<script setup>
import Header from '@/views/Header.vue'
import Sidebar from '@/views/Sidebar.vue'
import QuickAdd from '@/views/QuickAdd.vue'
</script>

<template>
  <div class="container py-5">
    <div class="row">
      <div class="col-xl-2 d-none d-xl-block">
        <Sidebar />
      </div>
      <div class="col-xl-10">
        <div class="mb-5">
          <Header />
        </div>
        <div class="d-xl-none">
          <Sidebar />
        </div>
        <RouterView />
      </div>
    </div>
  </div>
  <QuickAdd />
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
