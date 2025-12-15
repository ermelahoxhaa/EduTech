<template>
  <div id="app">
    <AppHeader v-if="!hideLayout"/>

    <main class="page">
      <router-view />
    </main>

    <AppFooter v-if="!hideLayout"/>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'


export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter
  },
   setup() {
    const route = useRoute()
    const hideLayout = computed(() => route.path === '/dashboard'|| route.path === '/createnotification'|| route.path === '/course')
    return { hideLayout }
  }
}
</script>

<style>
.page {
  padding-top: 100px;
}
</style>
