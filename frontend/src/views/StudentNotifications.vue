<template>
  <div class="student-page">
    <main class="page-main">
      <div class="main-container">
        <section class="page-header">
          <h1>🔔 Notifications</h1>
          <p>Stay updated with the latest announcements and updates.</p>
        </section>

        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading notifications...</p>
        </div>

        <div v-else-if="notifications.length === 0" class="empty-state">
          <div class="empty-icon">🔔</div>
          <h3>No Notifications</h3>
          <p>You don't have any notifications yet.</p>
        </div>

        <div v-else class="notifications-list">
          <div 
            v-for="notification in notifications" 
            :key="notification.id" 
            class="notification-item"
          >
            <div class="notification-icon">
              {{ getNotificationIcon(notification.audience) }}
            </div>
            <div class="notification-content">
              <h4>{{ notification.title }}</h4>
              <p>{{ notification.message }}</p>
              <span class="notification-time">{{ formatDate(notification.created_at) }}</span>
            </div>
            <div class="notification-badge-wrapper">
              <span class="audience-badge" :class="notification.audience">
                {{ formatAudience(notification.audience) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'StudentNotifications',
  setup() {
    const { user, isAuthenticated, checkAuth, hasRole } = useAuth();
    const router = useRouter();
    return { user, isAuthenticated, checkAuth, hasRole, router };
  },
  data() {
    return {
      notifications: [],
      loading: true,
      apiBaseUrl: 'http://localhost:5000/api'
    };
  },
  async created() {
    if (!this.isAuthenticated) {
      const isAuth = await this.checkAuth();
      if (!isAuth) {
        this.router.push('/login');
        return;
      }
    }

    if (!this.hasRole(['student'])) {
      this.router.push('/dashboard');
      return;
    }

    await this.fetchNotifications();
  },
  methods: {
    async fetchNotifications() {
      try {
        this.loading = true;
        const token = localStorage.getItem('token');
        const headers = { 'x-auth-token': token };

        const response = await axios.get(`${this.apiBaseUrl}/notifications/student`, { 
          headers, 
          withCredentials: true 
        }).catch(() => ({ data: [] }));

        this.notifications = response.data || [];
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        this.loading = false;
      }
    },
    getNotificationIcon(audience) {
      if (audience === 'students') return '🎓';
      if (audience === 'all') return '📢';
      return '🔔';
    },
    formatAudience(audience) {
      if (audience === 'students') return 'Students';
      if (audience === 'all') return 'Everyone';
      return 'Notification';
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
      if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
      return date.toLocaleDateString();
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.student-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

.page-main {
  padding: 2rem;
  padding-top: 120px;
}

.main-container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  color: #1a1a2e;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #6c757d;
  margin: 0;
}

.notifications-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s;
}

.notification-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.notification-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
}

.notification-content p {
  font-size: 0.95rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.notification-time {
  font-size: 0.8rem;
  color: #adb5bd;
}

.notification-badge-wrapper {
  flex-shrink: 0;
}

.audience-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.audience-badge.all {
  background: #e3f2fd;
  color: #0b56d1;
}

.audience-badge.students {
  background: #e8f5e9;
  color: #2e7d32;
}

.loading-container {
  text-align: center;
  padding: 4rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #4F6466;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: #ffffff;
  border-radius: 16px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
}

.empty-state p {
  color: #6c757d;
}

@media (max-width: 768px) {
  .page-main {
    padding: 1rem;
    padding-top: 100px;
  }
  
  .notification-item {
    flex-direction: column;
    gap: 0.75rem;
    padding: 1.25rem;
  }
  
  .notification-icon {
    font-size: 1.5rem;
  }
  
  .notification-badge-wrapper {
    order: -1;
  }
}

@media (max-width: 480px) {
  .page-main {
    padding: 0.75rem;
    padding-top: 90px;
  }
  
  .page-header h1 {
    font-size: 1.5rem;
  }
  
  .notification-item {
    padding: 1rem;
  }
}
</style>
