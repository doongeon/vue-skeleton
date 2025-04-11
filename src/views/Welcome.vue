<script setup></script>

<template>
  <div class="welcome-wrapper">
    <div class="content">
      <h1 class="title">안녕하세요 👋</h1>
      <p class="subtitle">
        유전자팀에서 만든 가계부는<br />
        <strong>소득/지출 기반 그래프 분석</strong>, <strong>태그별 원형 그래프</strong>,
        <strong>캘린더 기반 서비스</strong>를 제공합니다.
      </p>

      <router-link to="/login" class="btn-kb">지금 로그인하기</router-link>
    </div>
  </div>
</template>

<style>
:root {
  --kb-yellow: rgb(255, 188, 0);
  --kb-yellow-hover: rgb(255, 204, 0);
  --kb-dark: rgb(96, 88, 76);
  --kb-darker: rgb(84, 80, 69);
}
</style>

<style scoped>
.welcome-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: #fffaf0;
  text-align: center;
}

.content {
  max-width: 600px;
}

.title {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--kb-darker);
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.2rem;
  line-height: 1.8;
  color: var(--kb-dark);
  margin-bottom: 2rem;
  word-break: keep-all;
}

.btn-kb {
  display: inline-block;
  padding: 0.75rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--kb-darker);
  background-color: var(--kb-yellow);
  border-radius: 8px;
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.btn-kb:hover {
  background-color: var(--kb-yellow-hover);
  color: var(--kb-dark);
}
</style>
