<template>
  <div>
    <ul>
      <li v-for="a in assignments" :key="a.id">
        {{ a.title }} - {{ a.status }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "AssignmentList",
  props: ["assignments"]
};
</script>
