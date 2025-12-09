<template>
  <div class="dashboard" v-if="loaded">
    <h2>Welcome, {{ data.user.name }}</h2>

    <section>
      <h3>Curse</h3>
      <CourseList :courses="data.courses" />
    </section>

    <section>
      <h3>Future tasks</h3>
      <AssignmentList :assignments="data.assignments" />
    </section>

    <section>
      <h3>Progress</h3>
      <p>{{ data.progress.percentage }}% ({{ data.progress.graded }}/{{ data.progress.totalAssignments }})</p>
    </section>

    <section>
      <h3>Notification</h3>
      <NotificationList :notifications="data.notifications" />
    </section>
  </div>

  <div v-else>Loading...</div>
</template>

<script>
import axios from 'axios';
import CourseList from '../components/CourseList.vue';
import AssignmentList from '../components/AssignmentList.vue';
import NotificationList from '../components/NotificationList.vue';

export default {
  components: { CourseList, AssignmentList, NotificationList },
  data() {
    return { data: null, loaded: false };
  },
  async created() {
    try {
      const userId = 1; 
      const res = await axios.get(`http://localhost:3000/api/dashboard/student/${userId}`);
      this.data = res.data;
      this.loaded = true;
    } catch (err) {
      console.error(err);
      this.loaded = true;
      this.data = {
         user: { name: 'Error' }, courses: [], assignments: [], progress: {percentage:0}, notifications: []
      };
    }
  }
};
</script>
