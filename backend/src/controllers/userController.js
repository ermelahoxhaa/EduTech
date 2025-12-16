import DataAccessLayer from '../dataAccess/DataAccessLayer.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  try {
    const users = await DataAccessLayer.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await DataAccessLayer.getUsersByRole('teacher');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const students = await DataAccessLayer.getUsersByRole('student');
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await DataAccessLayer.getUser(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!['admin', 'teacher', 'student'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be admin, teacher, or student' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userId = await DataAccessLayer.createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'User created successfully', id: userId });
  } catch (err) {
    if (err.message.includes('Duplicate entry') || err.message.includes('email')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const existingUser = await DataAccessLayer.getUser(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updateData = { name, email };
    
    if (role) {
      if (!['admin', 'teacher', 'student'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      updateData.role = role;
    }

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const success = await DataAccessLayer.updateUser(id, updateData);
    if (success) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(500).json({ error: 'Failed to update user' });
    }
  } catch (err) {
    if (err.message.includes('Duplicate entry') || err.message.includes('email')) {
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: err.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await DataAccessLayer.getUser(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const success = await DataAccessLayer.deleteUser(id);
    if (success) {
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};