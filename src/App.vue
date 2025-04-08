<script setup>
import { RouterView, RouterLink  } from 'vue-router'


</script>

<template>
  <router-link to="/calendar"> Calendar </router-link> 
  <br>
  <router-link to="/history"> History </router-link>
  <RouterView />
</template>
