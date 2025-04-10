<script setup>
import '@/assets/header.css'
import { getUserInfo, logoutProcess } from '@/utils/AuthUtils'
import { useRouter } from 'vue-router'
import { ref, reactive } from 'vue'
import { useDateStore } from '@/stores/dateStore'

// 로그아웃 부분
const router = useRouter()
const data = reactive({ userInfo: getUserInfo() })
const logout = () => {
  logoutProcess(() => {
    data.userInfo = {}
    router.push({ name: 'home' })
  })
}

const showSettingPopup = ref(false)
const showDatePicker = ref(false)

// const selectedDate = ref(null)
const dateStore = useDateStore()

function toggleSetting() {
  showSettingPopup.value = !showSettingPopup.value
}

function toggleDatePicker() {
  showDatePicker.value = !showDatePicker.value
}
</script>

<template>
  <div class="header welcome-banner">
    <div class="header-title text-white">유전자's 가계부</div>

    <div class="header-menu">
      <span class="menu-button" @click="toggleDatePicker">날짜</span>
      <!-- <input v-if="showDatePicker" type="date" v-model="selectedDate" class="date-picker" /> -->
      <input v-if="showDatePicker" type="date" v-model="dateStore.selectedDate" class="date-picker" />

      <RouterLink to="/main/profile" class="menu-button">프로필</RouterLink>

      <div class="setting-wrapper">
        <span class="menu-button setting-btn" @click="toggleSetting">설정</span>

        <div class="popup" v-if="showSettingPopup">
          <button @click="logout">로그아웃</button>
          <button>태그 추가</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.welcome-banner {
  background: linear-gradient(
    135deg,
    rgb(255, 188, 0),
    rgb(255, 204, 0),
    rgb(96, 88, 76),
    rgb(84, 80, 69)
  );
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
</style>
