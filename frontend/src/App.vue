<template>
  <div id="app">
    <AppHeader />

    <main class="page">
      <HomeLanding />
    </main>

    <AppFooter />   
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'
import HomeLanding from './components/HomeLanding.vue'
import AppFooter from './components/AppFooter.vue';

export default {
  name: 'App',
  components: {
    AppHeader,
    HomeLanding, 
    AppFooter
  }
}
</script>
