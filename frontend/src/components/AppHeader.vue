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
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/login" class="nav-link">Login</router-link>

    </nav>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  data() {
    return {
      isMenuOpen: false,
      logoSrc: require('@/assets/image0 (2).jpeg')
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen
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
  box-shadow: 0 18px 60px rgba(13, 25, 48, 0.08);
}
.nav-brand {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand-link {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo {
  width: 89px;
  height: 89px;
  object-fit: contain;
  border-radius: 20px;
}

.burger {
  display: inline-flex;
  flex-direction: column;
  gap: 0.2rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.3rem;
}

.burger span {
  width: 26px;
  height: 3px;
  background: #0d1930;
  border-radius: 999px;
}

.nav-links {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-links--open {
  display: flex;
}

.nav-link {
  padding: 0.75rem 1rem;
  border-radius: 14px;
  font-weight: 600;
  text-decoration: none;
  color: #42506b;
  transition: color 0.2s ease, background 0.2s ease;
}

.nav-link:hover {
  color: #0b56d1;
  background: rgba(59, 130, 246, 0.12);
}

.nav-link.active {
  background: #0b56d1;
  color: #ffffff;
  box-shadow: 0 12px 30px rgba(11, 86, 209, 0.25);
}

@media (min-width: 768px) {
  .nav-shell {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .burger {
    display: none;
  }

  .nav-links {
    display: flex !important;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
  }
}
</style>

