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
      <div class="section col-xl-10 px-0 px-sm-2">
        <div class="mb-5">
          <Header />
        </div>
        <div class="d-xl-none">
          <Sidebar />
        </div>
        <RouterView />
      </div>
    </div>
    <QuickAdd />
  </div>
</template>

<style scoped>
* {
  margin: 0;
  /* padding: 0; */
}
.container {
  /* width: 100%; */
  /* max-width: 1200px; */
  max-width: 1920px;
  margin: 0 auto;
}
.section {
  max-width: 1200px;
}
</style>
