<template>
  <div class="card">
    <h4>{{ label }}</h4>
    <p>{{ value }}</p>
  </div>
</template>

<script>
export default {
  props: ["label", "value"]
};
</script>
