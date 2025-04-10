<script setup>
import { reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loginProcess } from '../utils/AuthUtils'

const router = useRouter()
const currentRoute = useRoute()
const fromName = currentRoute.query.fromname

const info = reactive({ userid: '', password: '' })

const successCallback = () => {
  if (fromName) router.push({ name: fromName })
  else router.push({ name: 'home' })
}

const failCallback = () => {
  alert('로그인 실패')
}

const login = () => {
  loginProcess(info.userid, info.password, successCallback, failCallback)
}
</script>

<template>
  <div class="login-wrapper">
    <div class="login-box">
      <h2 class="login-title">KB 로그인</h2>
      <p class="login-subtitle">It's Your Life - 20회차 유전자 가계부</p>

      <form @submit.prevent="login">
        <div class="form-group">
          <label for="userid">아이디</label>
          <input type="text" id="userid" v-model="info.userid" required />
        </div>

        <div class="form-group">
          <label for="userpassword">비밀번호</label>
          <input type="password" id="userpassword" v-model="info.password" required />
        </div>

        <button type="submit" class="btn-kb">로그인</button>
      </form>
    </div>
  </div>
</template>
<!-- 전역 색상 변수 정의 -->
<style>
:root {
  --kb-yellow: rgb(255, 188, 0);
  --kb-yellow-hover: rgb(255, 204, 0);
  --kb-dark: rgb(96, 88, 76);
  --kb-darker: rgb(84, 80, 69);
}
</style>

<style scoped>
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}

.login-box {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 400px;
  color: var(--kb-darker);
  text-align: center;
}

/* 기본 스타일 (모바일~태블릿) */
.login-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  font-size: 1rem;
  margin-bottom: 1.5rem;
  color: var(--kb-dark);
}

.form-group {
  text-align: left;
  margin-bottom: 1.5rem;
}

.form-group label {
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
  color: var(--kb-dark);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

/* 버튼 */
.btn-kb {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.1rem;
  font-weight: bold;
  background-color: var(--kb-yellow);
  color: var(--kb-darker);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-kb:hover {
  background-color: var(--kb-yellow-hover);
  color: var(--kb-dark);
}

/* 💻 데스크탑 스타일 (1200px 이상일 때) */
@media (min-width: 1200px) {
  .login-box {
    max-width: 500px;
    padding: 3rem 3rem 2.5rem;
  }

  .login-title {
    font-size: 2rem;
  }

  .login-subtitle {
    font-size: 1.1rem;
  }
}
</style>
