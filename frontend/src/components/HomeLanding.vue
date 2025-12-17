<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">🎓 School Digitalization Platform</span>
        <h1 class="hero-title">
          Transform Education with
          <span class="gradient-text">Smart Technology</span>
        </h1>
        <p class="hero-description">
          EduTech empowers administrators, teachers, and families with real-time
          collaboration tools, adaptive learning journeys, and actionable data to
          accelerate student success.
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-value">14+</span>
            <span class="stat-label">Schools</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">9,800+</span>
            <span class="stat-label">Students</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-value">92%</span>
            <span class="stat-label">Satisfaction</span>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-cards">
          <div class="float-card card-1">
            <div class="card-icon">📊</div>
            <div class="card-content">
              <span class="card-title">Live Analytics</span>
              <span class="card-value">Real-time tracking</span>
            </div>
          </div>
          <div class="float-card card-2">
            <div class="card-icon">📝</div>
            <div class="card-content">
              <span class="card-title">Assignments</span>
              <span class="card-value">1,210 active</span>
            </div>
          </div>
          <div class="float-card card-3">
            <div class="card-icon">🏆</div>
            <div class="card-content">
              <span class="card-title">Success Rate</span>
              <span class="card-value">94.5%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="about" class="about-section">
      <div class="section-container">
        <div class="about-content">
          <span class="section-badge">About Us</span>
          <h2 class="section-title">Empowering Education Through Innovation</h2>
          <p class="section-description">
            EduTech is a comprehensive school digitalization platform designed to bridge 
            the gap between traditional education and modern technology. Our mission is to 
            create an inclusive, efficient, and engaging learning environment for everyone.
          </p>
          <div class="about-features">
            <div class="about-feature">
              <div class="feature-icon">🎯</div>
              <div class="feature-content">
                <h3>Our Mission</h3>
                <p>To democratize quality education by providing accessible digital tools that enhance learning outcomes for students worldwide.</p>
              </div>
            </div>
            <div class="about-feature">
              <div class="feature-icon">👁️</div>
              <div class="feature-content">
                <h3>Our Vision</h3>
                <p>A world where every student has access to personalized, technology-enhanced education that prepares them for the future.</p>
              </div>
            </div>
            <div class="about-feature">
              <div class="feature-icon">💎</div>
              <div class="feature-content">
                <h3>Our Values</h3>
                <p>Innovation, accessibility, collaboration, and continuous improvement drive everything we do at EduTech.</p>
              </div>
            </div>
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

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #e3f2fd;
  color: #0b56d1;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, #4F6466 0%, #0b56d1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-description {
  font-size: 1.15rem;
  color: #6c757d;
  margin-bottom: 2rem;
  max-width: 520px;
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 800;
  color: #4F6466;
}

.stat-label {
  font-size: 0.85rem;
  color: #6c757d;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: rgba(0, 0, 0, 0.08);
}

.hero-visual {
  position: relative;
  height: 400px;
}

.floating-cards {
  position: relative;
  width: 100%;
  height: 100%;
}

.float-card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  animation: float 6s ease-in-out infinite;
}

.float-card .card-icon {
  font-size: 2rem;
}

.float-card .card-title {
  font-size: 0.8rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.float-card .card-value {
  font-weight: 700;
  color: #1a1a2e;
}

.card-1 {
  top: 10%;
  left: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 40%;
  right: 5%;
  animation-delay: 2s;
  background: #4F6466;
  color: white;
}

.card-2 .card-title,
.card-2 .card-value {
  color: white;
}

.card-3 {
  bottom: 15%;
  left: 20%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
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

.section-description {
  font-size: 1.1rem;
  color: #6c757d;
  max-width: 600px;
  margin: 0 0 2rem 0;
}

.about-section {
  padding: 6rem 0;
  background: #f8f9fa;
}

.about-features {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.about-feature {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}

.about-feature:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.about-feature .feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.about-feature h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}

.about-feature p {
  font-size: 0.95rem;
  color: #6c757d;
  margin: 0;
}

@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .hero-content {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .hero-description {
    max-width: 100%;
    margin-left: auto;
    margin-right: auto;
  }
  
  .hero-stats {
    justify-content: center;
  }
  
  .hero-visual {
    display: none;
  }
  
  .about-content .section-title,
  .about-content .section-description {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .home-page {
    padding-top: 90px;
  }
  
  .hero {
    padding: 2rem 1rem;
    min-height: auto;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .stat-divider {
    width: 60px;
    height: 1px;
  }
  
  .about-section {
    padding: 4rem 0;
  }
  
  .section-container {
    padding: 0 1rem;
  }
  
  .about-feature {
    flex-direction: column;
    text-align: center;
  }
}
</style>
