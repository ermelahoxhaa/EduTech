<template>
  <div class="features-page">
    <section class="features-section">
      <div class="section-container">
        <div class="section-header">
          <span class="section-badge">Features</span>
          <h1 class="section-title">Platform Capabilities</h1>
          <p class="section-subtitle">
            Powerful tools designed to streamline school operations and enhance learning experiences.
          </p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">📝</span>
            </div>
            <h3>Assignment Management</h3>
            <p>Create, distribute, and grade assignments with automated deadline tracking.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">📊</span>
            </div>
            <h3>Grade Tracking</h3>
            <p>Comprehensive gradebook with progress reports and parent notifications.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon-wrapper">
              <span class="feature-icon">🔔</span>
            </div>
            <h3>Real-time Notifications</h3>
            <p>Instant alerts for important updates.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'FeaturesPage'
};
</script>

<style scoped>

* {
  box-sizing: border-box;
}

.features-page {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #1a1a2e;
  line-height: 1.6;
  padding-top: 100px;
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #e3f2fd;
  color: #0b56d1;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 auto;
}

.features-section {
  padding: 4rem 0;
  background: #ffffff;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.feature-card {
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  background: #ffffff;
}

.feature-icon-wrapper {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e3f2fd;
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.feature-icon-wrapper .feature-icon {
  font-size: 2rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.feature-card p {
  color: #6c757d;
  font-size: 0.95rem;
  margin: 0;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  .feature-card {
    min-height: 200px;
  }
}

@media (max-width: 768px) {
  .features-page {
    padding-top: 90px;
  }
  
  .features-section {
    padding: 2rem 0;
  }
  
  .section-container {
    padding: 0 1rem;
  }
  
  .section-header {
    margin-bottom: 2rem;
  }
  
  .section-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .feature-card {
    padding: 1.5rem;
    min-height: auto;
  }
  
  .feature-icon-wrapper {
    width: 56px;
    height: 56px;
  }
}

@media (max-width: 480px) {
  .features-page {
    padding-top: 80px;
  }
  
  .section-container {
    padding: 0 0.75rem;
  }
  
  .feature-card {
    padding: 1.25rem;
  }
}
</style>
