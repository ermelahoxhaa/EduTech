<template>
  <header class="nav-shell">
    <div class="nav-brand">
      <a class="brand-link" href="#">
        <img class="brand-logo" :src="logoSrc" alt="EduTech logo" />
      </a>
      <button class="burger" @click="toggleMenu" aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <nav :class="['nav-links', { 'nav-links--open': isMenuOpen }]">
      <template v-if="!isAuthenticated">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/features" class="nav-link">Features</router-link>
        <router-link to="/login" class="nav-link">Login</router-link>
      </template>

      <template v-else-if="isStudent">
        <router-link to="/my-courses" class="nav-link">Courses</router-link>
        <router-link to="/my-notifications" class="nav-link">Notifications</router-link>
        <div class="user-section">
          <span class="user-name">{{ userName }}</span>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </template>

     
    </nav>
  </header>
</template>

<script>
import { useAuth } from '@/composables/useAuth';

export default {
  name: 'AppHeader',
  setup() {
    const { isAuthenticated, user, hasRole, logout } = useAuth();
    return { isAuthenticated, user, hasRole, logout };
  },
  data() {
    return {
      isMenuOpen: false,
      logoSrc: require('@/assets/image0 (2).jpeg')
    }
  },
  computed: {
    isAdmin() {
      return this.hasRole(['admin']);
    },
    isAdminOrTeacher() {
      return this.hasRole(['admin', 'teacher']);
    },
    isStudent() {
      return this.hasRole(['student']);
    },
    userName() {
      return this.user?.name || 'User';
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
    },
    async handleLogout() {
      await this.logout();
      this.isMenuOpen = false;
    }
  }
}
</script>

<style scoped>
.nav-shell {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-bottom: 1px solid #e5eaf5;
  box-shadow: 0 4px 20px rgba(13, 25, 48, 0.08);
}

.nav-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo {
  width: 70px;
  height: 70px;
  object-fit: contain;
  border-radius: 16px;
}

.burger {
  display: inline-flex;
  flex-direction: column;
  gap: 0.25rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.burger span {
  width: 24px;
  height: 3px;
  background: #1a1a2e;
  border-radius: 999px;
  transition: all 0.3s;
}

.nav-links {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem 1rem 1rem;
}

.nav-links--open {
  display: flex;
}

.nav-link {
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-weight: 600;
  text-decoration: none;
  color: #42506b;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.nav-link:hover {
  color: #4F6466;
  background: rgba(79, 100, 102, 0.08);
}

.nav-link.router-link-active {
  background: #4F6466;
  color: #ffffff;
}

.user-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  border-top: 1px solid #e5eaf5;
}

.user-name {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.9rem;
}

.logout-btn {
  background: #fee2e2;
  color: #dc3545;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #fecaca;
}

@media (min-width: 768px) {
  .nav-shell {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
  }

  .nav-brand {
    padding: 0.5rem 0;
  }

  .brand-logo {
    width: 60px;
    height: 60px;
  }

  .burger {
    display: none;
  }

  .nav-links {
    display: flex !important;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
  }

  .nav-link {
    padding: 0.5rem 1rem;
  }

  .user-section {
    margin-top: 0;
    margin-left: 1rem;
    padding: 0 0 0 1rem;
    border-top: none;
    border-left: 1px solid #e5eaf5;
  }
}

@media (max-width: 480px) {
  .brand-logo {
    width: 55px;
    height: 55px;
  }
  
  .nav-link {
    padding: 0.65rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .user-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .logout-btn {
    width: 100%;
  }
}
</style>
