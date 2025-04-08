<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])

onMounted(async () => {
  const response = await axios.get('http://localhost:3000/users/1')
  users.value = response.data
})
</script>

<template>
  <div class="layout">
    <div class="profile" v-if="users">
      <p>이름 : {{ users.userName }}</p>
      <p>이메일 : {{ users.email }}</p>
    </div>
    <div class="container">
      <p class="title">계정 관리</p>
      <div class="article">
        <button>비밀번호 변경</button>
        <button>계정 탈퇴</button>
        <button>로그아웃</button>
      </div>
    </div>
    <div class="container">
      <p class="title">태그 관리</p>
      <div class="article">
        <p>태그 리스트</p>
      </div>
    </div>
    <div class="container">
      <p class="title">고정지출 관리</p>
      <div class="article">
        <p>매달 자동입력되는 지출 기록</p>
      </div>
    </div>
    <div class="container">
      <p class="title">데이터 내보내기</p>
      <div class="article">
        <button>데이터 내보내기</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: 0.2fr 1fr 1fr;
  gap: 0.5rem;
  padding: 1rem;
}

.layout .profile {
  padding: 1rem;
  font-size: 2rem;
  grid-column: span 12;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 4rem;
  background-color: rgb(255, 188, 0);
  border-radius: 0.5rem;
  margin: 1rem;
}

.layout .container {
  background-color: rgb(255, 188, 0);
  padding: 2rem;
  margin: 1rem;
  grid-column: span 6;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
}

.layout .container .title {
  padding: 0rem;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.layout .container .article {
  background-color: rgb(96, 88, 76);
  padding: 1rem;
  flex: 1; /* 높이를 유연하게 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 가운데 정렬 */
  align-items: center; /* 수평 가운데 정렬 */
  border-radius: 0.5rem;
  font-size: 1rem;
  gap: 0.5rem;
}

.layout .container .article button {
  border: 1px solid;
  margin: 0; /* ✅ 좌우 마진 제거 */
  padding: 0.75rem;
  width: 100%; /* ✅ 부모 너비에 맞게 */
  box-sizing: border-box; /* ✅ padding 포함 너비 계산 */
  background-color: white;
  color: black;
  border-radius: 0.5rem;
  font-size: 1rem;
}
</style>
