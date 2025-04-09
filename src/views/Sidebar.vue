<script setup>
import '@/assets/Sidebar.css'
</script>

<template>
  <aside class="sidebar">
    <div class="title"></div>
    <nav class="menu">
      <router-link to="/" class="menu-item">홈화면</router-link>
      <router-link to="/history" class="menu-item">거래 상세내역</router-link>
      <router-link to="/analysis" class="menu-item">수입/지출 분석</router-link>
      <router-link to="/calendar" class="menu-item">캘린더</router-link>
    </nav>
  </aside>
</template>

<style></style>
