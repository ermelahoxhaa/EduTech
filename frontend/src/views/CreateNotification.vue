<template>
  <div class="container py-4">
    <h2 class="mb-4">Create Notification</h2>

    <form @submit.prevent="submitForm" class="mb-5">
      <div class="mb-3">
        <input v-model="form.title" type="text" class="form-control" placeholder="Title" required />
      </div>
      <div class="mb-3">
        <textarea v-model="form.message" class="form-control" placeholder="Message" rows="3" required></textarea>
      </div>
      <div class="mb-3">
        <select v-model="form.audience" class="form-select" required>
          <option value="" disabled>Select Audience</option>
          <option value="all">All</option>
          <option value="students">Students</option>
          <option value="teachers">Teachers</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary" style="background-color: rgb(128, 97, 114)">
        Create Notification
      </button>
    </form>

    <div v-if="notifications.length">
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th>Title</th>
            <th>Message</th>
            <th>Audience</th>
            <th style="width: 100px">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="note in notifications" :key="note.id">
            <td>{{ note.title }}</td>
            <td>{{ note.message }}</td>
            <td>{{ note.audience }}</td>
            <td>
              <button class="btn btn-sm btn-danger" @click="deleteNotification(note.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else>
      <p>No notifications yet.</p>
    </div>
  </div>
</template>

<script>
import axios from '../axios'; 

export default {
  name: 'CreateNotification',
  data() {
    return {
      form: {
        title: '',
        message: '',
        audience: ''
      },
      notifications: []
    };
  },
  created() {
    this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
      try {
        console.log('Fetching notifications...');
        const res = await axios.get('http://localhost:5000/api/notifications', { withCredentials: true });
        console.log('Fetched notifications:', res.data);
        this.notifications = res.data;
      } catch (err) {
        console.error('Error fetching notifications:', err.response || err);
      }
    },
    async submitForm() {
      console.log('Submitting form with payload:', this.form);
      try {
        const res = await axios.post('http://localhost:5000/api/notifications', this.form, { withCredentials: true });
        console.log('Notification created:', res.data);
        alert('Notification created!');
        this.form.title = '';
        this.form.message = '';
        this.form.audience = '';
        this.fetchNotifications();
      } catch (err) {
        console.error('Error creating notification:', err.response || err);
        alert(err.response?.data?.message || 'Error creating notification');
      }
    },
    async deleteNotification(id) {
      if (!confirm('Are you sure?')) return;
      try {
        const res = await axios.delete(`http://localhost:5000/api/notifications/${id}`, { withCredentials: true });
        console.log('Notification deleted:', res.data);
        alert('Deleted!');
        this.fetchNotifications();
      } catch (err) {
        console.error('Error deleting notification:', err.response || err);
        alert(err.response?.data?.message || 'Error deleting notification');
      }
    }
  }
};
</script>

<style scoped>
.table th,
.table td {
  vertical-align: middle;
}
</style>
