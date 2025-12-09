<template>
  <div>
    <ul>
      <li v-for="c in courses" :key="c.id">
        {{ c.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "CourseList",
  props: ["courses"]
};
</script>
