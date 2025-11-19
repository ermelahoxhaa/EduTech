<template>
  <section class="landing">
    <div class="content">
      <p class="eyebrow">School Digitalization Platform</p>
      <h1>
        Seamlessly manage classrooms, resources, and insights from one
        connected home base.
      </h1>
      <p class="lead">
        EduTech empowers administrators, teachers, and families with real-time
        collaboration tools, adaptive learning journeys, and actionable data to
        accelerate student success.
      </p>
      <div class="cta-group">
        <button class="cta primary">Explore Home</button>
        <button class="cta ghost">Go to Login</button>
      </div>
      <ul class="pillars">
        <li>
          <span class="label">Smart Timetabling</span>
          <p>Automated scheduling with conflict prevention</p>
        </li>
        <li>
          <span class="label">Unified Communications</span>
          <p>Broadcasts, announcements, and parent portals</p>
        </li>
        <li>
          <span class="label">Learning Insights</span>
          <p>Performance analytics layered over curriculum goals</p>
        </li>
      </ul>
    </div>
    <div class="visual">
      <div class="card-grid">
        <article class="card">
          <p class="card-title">District Snapshot</p>
          <p class="card-value">14 Schools</p>
          <small>92% digital adoption</small>
        </article>
        <article class="card accent">
          <p class="card-title">Live Attendance</p>
          <p class="card-value">9,842 learners</p>
          <small>Updated 2 mins ago</small>
        </article>
        <article class="card">
          <p class="card-title">Teacher Resources</p>
          <p class="card-value">1,210 shared</p>
          <small>+36 new this week</small>
        </article>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HomeLanding'
}
</script>

<style scoped>
.landing {
  background: linear-gradient(135deg, #ffffff 0%, #f8fbff 45%, #e7efff 100%);
  border-radius: 32px;
  padding: 2.75rem;
  display: grid;
  gap: 2.5rem;
  box-shadow: 0 24px 80px rgba(13, 25, 48, 0.08);
}

.content {
  max-width: 640px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.75rem;
  font-weight: 700;
  color: #0b56d1;
  margin-bottom: 1rem;
}

h1 {
  font-size: clamp(2rem, 5vw, 3rem);
  line-height: 1.2;
  margin-bottom: 1rem;
}

.lead {
  color: #4a5670;
  font-size: 1.05rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.cta-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.cta {
  border: none;
  border-radius: 999px;
  padding: 0.85rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.cta.primary {
  background: #0b56d1;
  color: #ffffff;
  box-shadow: 0 15px 30px rgba(11, 86, 209, 0.3);
}

.cta.ghost {
  background: transparent;
  color: #0b56d1;
  border: 1px solid rgba(11, 86, 209, 0.4);
}

.cta:hover {
  transform: translateY(-1px);
}

.pillars {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 0;
  margin: 0;
}

.pillars li {
  background: rgba(255, 255, 255, 0.65);
  border-radius: 20px;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(13, 25, 48, 0.08);
}

.label {
  display: inline-flex;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  background: rgba(11, 86, 209, 0.08);
  color: #0b56d1;
  font-size: 0.8rem;
  font-weight: 600;
}

.pillars p {
  margin: 0.35rem 0 0;
  color: #4a5670;
  font-size: 0.95rem;
}

.visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-grid {
  display: grid;
  gap: 1rem;
}

.card {
  background: #ffffff;
  border-radius: 24px;
  padding: 1.5rem;
  min-width: 220px;
  border: 1px solid rgba(13, 25, 48, 0.08);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5),
    0 12px 30px rgba(13, 25, 48, 0.08);
}

.card.accent {
  background: linear-gradient(135deg, #0b56d1, #2563eb);
  color: white;
  transform: translateX(25px);
}

.card-title {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.7rem;
  margin-bottom: 0.5rem;
  opacity: 0.85;
}

.card-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

@media (min-width: 960px) {
  .landing {
    grid-template-columns: 1.2fr 0.8fr;
    align-items: center;
  }
}
</style>

