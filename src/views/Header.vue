<script setup>
import '@/assets/header.css'
import { ref } from 'vue'

const showSettingPopup = ref(false)
const showDatePicker = ref(false)
const selectedDate = ref(null)

function toggleSetting() {
  showSettingPopup.value = !showSettingPopup.value
}

function toggleDatePicker() {
  showDatePicker.value = !showDatePicker.value
}
</script>

<template>
  <div class="header">
    <div class="title">홈 화면</div>

    <div class="header-menu">
      <span class="menu-button" @click="toggleDatePicker">날짜</span>
      <input v-if="showDatePicker" type="date" v-model="selectedDate" class="date-picker" />
      <RouterLink to="/profile" class="menu-button">프로필</RouterLink>

      <div class="setting-wrapper">
        <span class="menu-button setting-btn" @click="toggleSetting">설정</span>

        <div class="popup" v-if="showSettingPopup">
          <button>로그아웃</button>
          <button>태그 추가</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
