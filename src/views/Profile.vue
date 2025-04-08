<script setup></script>

<template>
  <div>Profile</div>
  <div class="profile">이름: 이메일:</div>
  <div class="layout">
    <div class="container">
      <p class="title">계정 관리</p>
      <div class="article">
        <button>비밀번호 변경</button><br />
        <button>계정 탈퇴</button><br />
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
  grid-template-rows: 1fr 1fr;
  gap: 0.5rem;
  padding: 1rem;
}

.layout .container {
  border: 1px solid;
  background-color: rgb(255, 188, 0);
  padding: 2rem;
  margin: 1rem;
  grid-column: span 6;
  display: flex;
  flex-direction: column;
}

.layout .container .title {
  padding: 0rem;
}

.layout .container .article {
  border: 1px solid;
  background-color: rgb(96, 88, 76);
  padding: 1rem;
  flex: 1; /* 높이를 유연하게 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 가운데 정렬 */
  align-items: flex-start; /* 수평 왼쪽 정렬 */
}

.layout .container .article button {
  border: 1px solid;
  margin: 1rem;
}
</style>
