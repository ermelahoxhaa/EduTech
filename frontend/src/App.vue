<template>
  <div id="app">
    <AppHeader />
    <main class="page">
      <HomeLanding />
    </main>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import HomeLanding from './components/HomeLanding.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    HomeLanding
  }
}
</script>

<style>
:root {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial,
    sans-serif;
  color: #0d1930;
  background-color: #f5f7fb;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page {
  flex: 1;
  padding: 2rem 1.5rem 4rem;
}

@media (min-width: 768px) {
  .page {
    padding: 3rem 4rem 5rem;
  }
}
</style>
