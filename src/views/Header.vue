<script setup>
import '@/assets/header.css'
import { ref } from 'vue'

const showSettingPopup = ref(false)

function toggleSetting() {
  showSettingPopup.value = !showSettingPopup.value
}
</script>

<template>
  <div class="header">
    <div class="title">홈 화면</div>
    <div class="menu">
      <span>날짜</span>
      <RouterLink to="/profile">프로필</RouterLink>
      <span class="setting" @click="toggleSetting">설정</span>

      <div class="popup" v-if="showSettingPopup">
        <button>로그아웃</button>
        <button>태그 추가</button>
      </div>
    </div>
  </div>
</template>

<style></style>
