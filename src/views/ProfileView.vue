<script setup>
import { getUserInfo, logoutProcess } from '@/utils/AuthUtils';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useTransactionStore } from '@/stores/transactionStore'
import { useTransactionCategoryStore } from '@/stores/transactionCategoryStore'
import { computed, reactive } from 'vue'


const router = useRouter();
const data = reactive({userInfo:getUserInfo()})

// categoryId가 숫자가 아닌 문자열로 선언되었으므로 문자열로 filter해야함
// 날짜기준 오름차순 정렬
const transactionStore = useTransactionStore()
const transactions = computed(() => transactionStore.states.transactions)
const periodic = computed(() =>
  transactions.value
    .filter((t) => ['2', '3'].includes(String(t.categoryId)))
    .sort((a, b) => new Date(a.date) - new Date(b.date)),
)

// category 받아오기
const transactionCategoryStore = useTransactionCategoryStore()
const categories = computed(() => transactionCategoryStore.states.transactionCategories)

/* db.json 유저 정보 */
const users = ref([])
onMounted(async () => {
  const response = await axios.get('http://localhost:3000/users/1')
  users.value = response.data
})

// const transactionCategories = ref([]) /* db.json 태그 관리 */
// onMounted(async () => {
//   const response = await axios.get('http://localhost:3000/transactionCategory')
//   transactionCategories.value = response.data
// })

function formatToMonthDay(dateString) {
  const date = new Date(dateString)
  const month = date.getMonth() + 1 /* getMonth가 0부터 시작하므로 +1 */
  const day = date.getDate()
  return `${month}월 ${day}일`
}

const logout = ()=>{
  logoutProcess(()=> {
    data.userInfo = {};
    router.push({name: 'home'})
  })
}
</script>

<template>
  <div class="layout">
    <div class="profile" v-if="users">
      <p>이름 {{ users.userName }}</p>
      <p>이메일 {{ users.email }}</p>
    </div>
    <div class="container">
      <p class="containerTitle">계정 관리</p>
      <div class="article">
        <button>비밀번호 변경</button>
        <button>계정 탈퇴</button>
        <button @click="logout" type="button">로그아웃</button>
      </div>
    </div>
    <div class="container">
      <p class="containerTitle">태그 관리</p>
      <div class="article">
        <div class="categoryList">
          <span v-for="category in categories" :key="category.id">
            {{ category.icon }} {{ category.name }}
          </span>
        </div>
      </div>
    </div>
    <div class="container">
      <p class="containerTitle">고정지출 관리</p>
      <div class="article">
        <div class="periodical" v-for="list in periodic" :key="list.id">
          {{ formatToMonthDay(list.date) }} {{ list.memo }} {{ list.amount }}
        </div>
      </div>
    </div>
    <div class="container">
      <p class="containerTitle">데이터 내보내기</p>
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
  gap: 2rem;
  padding: 2rem;
  background-color: rgb(255, 188, 0);
  border-radius: 1rem;
}

.layout .profile {
  padding: 1rem;
  font-size: 2rem;
  grid-column: span 12;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 3rem;
  /* background-color: rgb(255, 255, 255); */
  border-radius: 0.5rem;
}

.layout .container {
  background-color: rgb(255, 255, 255);
  padding: 2rem;
  grid-column: span 6;
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
}

.layout .container .containerTitle {
  padding: 0rem;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.layout .container .article {
  /* background-color: rgb(255, 188, 0); */
  padding: 1rem;
  flex: 1; /* 높이를 유연하게 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 수직 가운데 정렬 */
  align-items: center; /* 수평 가운데 정렬 */
  border-radius: 1rem;
  font-size: 1rem;
  gap: 0.5rem;
}

.layout .container .article .categoryList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
}

.layout .container .article .periodical {
  align-self: flex-start; /* article이 가운데 정렬이고 periodical만 왼쪽 정렬함*/
}

.layout .container .article button {
  flex-direction: column;
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

.layout .container .article button:hover {
  background-color: rgb(200, 200, 200);
}

.layout .container .article button:active {
  transform: translateY(0.1rem);
}
</style>
