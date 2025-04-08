<script setup>
import Header from '@/views/Header.vue'
import Sidebar from '@/views/Sidebar.vue'
</script>

<template>
  <div class="container pt-5">
    <div class="row">
      <div class="col-2">
        <Sidebar />
      </div>
      <div class="col-10">
        <div class="mb-5">
          <Header />
        </div>
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
