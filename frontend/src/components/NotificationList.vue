<template>
  <div>
    <ul>
      <li v-for="n in notifications" :key="n.id">
        {{ n.message }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "NotificationList",
  props: ["notifications"]
};
</script>
