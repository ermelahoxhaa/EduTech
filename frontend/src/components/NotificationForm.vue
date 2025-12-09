<template>
  <form @submit.prevent="submit">
    <input v-model="title" placeholder="Title" />
    <textarea v-model="message" placeholder="Message"></textarea>
    <select v-model="audience">
      <option value="all">All</option>
      <option value="students">Students</option>
      <option value="teachers">Teachers</option>
    </select>
    <button>Create</button>
  </form>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      title: "",
      message: "",
      audience: "all"
    };
  },
  methods: {
    async submit() {
      await axios.post("http://localhost:3000/api/notifications", {
        title: this.title,
        message: this.message,
        audience: this.audience
      });
      alert("Notification created!");
    }
  }
};
</script>
