<script setup>
import Sidebar from './views/Sidebar.vue'
</script>

<template>
  <div class="layout">
    <Sidebar />
    <Router-View />
  </div>
</template>

<style>
.layout {
  display: flex;
}
</style>
