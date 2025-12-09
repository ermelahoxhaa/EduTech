<template>
  <div>
    <h1>Admin Dashboard</h1>

    <div class="grid">
      <StatsCard label="Students" :value="stats.students" />
      <StatsCard label="Teachers" :value="stats.teachers" />
      <StatsCard label="Courses" :value="stats.courses" />
      <StatsCard label="Notifications" :value="stats.notifications" />
    </div>

    <h3>Recent Activity</h3>
    <ul>
      <li v-for="a in stats.activity" :key="a.id">
        {{ a.action }} — {{ a.created_at }}
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";
import StatsCard from "@/components/StatsCard.vue";

export default {
  components: { StatsCard },
  data() {
    return { stats: {} };
  },
  async created() {
    const res = await axios.get("http://localhost:3000/api/dashboard/admin");
    this.stats = res.data;
  }
};
</script>
