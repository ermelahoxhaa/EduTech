<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-icon">🎓</span>
          <span>School Digitalization Project</span>
        </div>
        <h1 class="hero-title">
          <span class="title-icon">💻</span>
          EduTech Platform
        </h1>
        <p class="hero-description">
          The goal of this project is to promote the use of technology in schools. Currently, schools in our country use little or no technology in their daily processes. Many tasks that do not require physical presence—such as announcements or assignment checking—can be managed digitally through an application.
        </p>
        <div class="hero-features">
          <div class="feature-highlight">
            <span class="feature-icon">📢</span>
            <span class="feature-text">Digital Announcements</span>
          </div>
          <div class="feature-highlight">
            <span class="feature-icon">📝</span>
            <span class="feature-text">Assignment Management</span>
          </div>
          <div class="feature-highlight">
            <span class="feature-icon">📊</span>
            <span class="feature-text">Grade Tracking</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-elements">
          <div class="float-element element-1">
            <span class="element-icon">📚</span>
          </div>
          <div class="float-element element-2">
            <span class="element-icon">✏️</span>
          </div>
          <div class="float-element element-3">
            <span class="element-icon">📱</span>
          </div>
          <div class="float-element element-4">
            <span class="element-icon">🎯</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeLanding'
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.home-page {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  color: #1a1a2e;
  line-height: 1.6;
  padding-top: 100px;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

.hero {
  min-height: calc(100vh - 100px);
  padding: 4rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.hero-content {
  max-width: 600px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  color: #0b56d1;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(11, 86, 209, 0.15);
}

.badge-icon {
  font-size: 1.2rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #1a1a2e;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title-icon {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.hero-description {
  font-size: 1.15rem;
  color: #6c757d;
  line-height: 1.8;
  margin-bottom: 2.5rem;
}

.hero-features {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.feature-highlight {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(79, 100, 102, 0.1);
  transition: all 0.3s ease;
}

.feature-highlight:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  border-color: #4F6466;
}

.feature-icon {
  font-size: 1.5rem;
}

.feature-text {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.95rem;
}

.hero-visual {
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.floating-elements {
  position: relative;
  width: 100%;
  height: 100%;
}

.float-element {
  position: absolute;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: float 6s ease-in-out infinite;
}

.element-icon {
  font-size: 2.5rem;
}

.element-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
}

.element-2 {
  top: 50%;
  right: 15%;
  animation-delay: 1.5s;
  background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
}

.element-3 {
  bottom: 20%;
  left: 20%;
  animation-delay: 3s;
  background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%);
}

.element-4 {
  top: 30%;
  right: 5%;
  animation-delay: 4.5s;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0) rotate(0deg); 
  }
  50% { 
    transform: translateY(-20px) rotate(5deg); 
  }
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
    padding: 3rem 1.5rem;
  }
  
  .hero-content {
    max-width: 100%;
    margin: 0 auto;
  }
  
  .hero-title {
    justify-content: center;
  }
  
  .hero-features {
    justify-content: center;
  }
  
  .hero-visual {
    height: 300px;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding-top: 90px;
  }
  
  .hero {
    padding: 2rem 1rem;
    min-height: auto;
    gap: 2rem;
  }
  
  .hero-badge {
    font-size: 0.85rem;
    padding: 0.65rem 1.25rem;
  }
  
  .hero-title {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .title-icon {
    font-size: clamp(1.75rem, 5vw, 2.5rem);
  }
  
  .hero-description {
    font-size: 1rem;
    text-align: center;
  }
  
  .hero-features {
    flex-direction: column;
    align-items: stretch;
  }
  
  .feature-highlight {
    justify-content: center;
  }
  
  .hero-visual {
    height: 250px;
  }
  
  .float-element {
    width: 60px;
    height: 60px;
  }
  
  .element-icon {
    font-size: 2rem;
  }
}
</style>
