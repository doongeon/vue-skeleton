<script setup></script>

<template>
  <div>profile</div>

  <div class="layout">
    <div class="account">
      <p>계정관리</p>
      <div class="article">
        <p>비밀번호 변경</p>
        <p>계정 탈퇴</p>
        <p>로그아웃</p>
      </div>
    </div>
    <div>
      <!-- 태그관리 -->
    </div>
    <div>
      <!-- 고정지출관리 -->
    </div>
    <div>
      <!-- 데이터 내보내기 -->
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
}

.layout .account {
  border: 1px solid yellow;
  padding: 2rem;
}

.layout .account .article {
  border: 1px solid orange;
  padding: 1rem;
}
</style>
