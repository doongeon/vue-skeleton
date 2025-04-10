<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useTransactionStore } from '@/stores/transactionStore'
import { useTransactionCategoryStore } from '@/stores/transactionCategoryStore'
import { computed, reactive, watch } from 'vue'

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

function formatToMonth(dateString) {
  const date = new Date(dateString)
  const month = date.getMonth() + 1 /* getMonth가 0부터 시작하므로 +1 */
  return `${month}월`
}
function formatToDay(dateString) {
  const date = new Date(dateString)
  const day = date.getDate()
  return `${day}일`
}
</script>

<template>
  <div class="layout">
    <div class="profile" v-if="users">
      <p>{{ users.userName }}</p>
      <p>{{ users.email }}</p>
    </div>
    <div class="container account">
      <p class="containerTitle">계정 관리</p>
      <div class="article">
        <button>비밀번호 변경</button>
        <button>계정 탈퇴</button>
        <button>로그아웃</button>
      </div>
    </div>
    <div class="container category">
      <p class="containerTitle">태그 관리</p>
      <div class="article">
        <div class="categoryList">
          <span v-for="category in categories" :key="category.id">
            {{ category.icon }} {{ category.name }}
          </span>
        </div>
      </div>
    </div>

    <div class="container export">
      <p class="containerTitle">데이터 내보내기</p>
      <div class="article">
        <button>데이터 내보내기</button>
      </div>
    </div>
    <div class="container periodic">
      <p class="containerTitle">고정지출 관리</p>
      <div class="article">
        <div class="periodical" v-for="list in periodic" :key="list.id">
          <span class="date">
            <span class="month">{{ formatToMonth(list.date) }}</span>
            <span class="day">{{ formatToDay(list.date) }}</span>
          </span>
          <span class="memo">{{ list.memo }}</span>
          <span class="amount">{{ list.amount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  /* grid-template-rows: 0.2fr 1fr 1fr; */
  gap: 2rem;
  padding: 2rem;
  background-color: rgb(255, 188, 0);
  border-radius: 1rem;
}

.layout .profile {
  padding: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
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
  display: flex;
  flex-direction: column;
  border-radius: 1rem;
}

.layout .container.account,
.layout .container.category,
.layout .container.export {
  grid-column: span 4;
}

.layout .container.periodic {
  grid-column: span 12;
}

.layout .container .containerTitle {
  padding: 0rem;
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-weight: bold;
}

.layout .container .article {
  /* background-color: rgb(255, 188, 0); */
  padding: 0rem 1rem;
  flex: 1;
  /* 높이를 유연하게 */
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

.layout .container.periodic .article {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: flex-start; /* 다른 article은 가운데 정렬이고 periodical만 왼쪽 정렬함*/
  justify-items: flex-start;
}

/* .periodical {
  display: flex;
  flex-direction: column;
  background-color: #fffdf5;
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-height: 100px;
  justify-content: space-between;
} */

.periodical {
  display: flex;
  gap: 1rem;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.periodical .date {
  display: flex;
  gap: 0.5rem;
  width: 5rem;
  justify-content: flex-start;
}
.periodical .month,
.periodical .day {
  display: inline-block;
  width: 3rem;
  text-align: right;
}

.periodical .amount {
  font-weight: bold;
}

.layout .container .article button {
  flex-direction: column;
  border: none;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.3);
  margin: 1rem;
  padding: 0.75rem;
  width: 100%; /* ✅ 부모 너비에 맞게 */
  box-sizing: border-box; /* ✅ padding 포함 너비 계산 */
  background-color: white;
  color: black;
  border-radius: 10rem;
  font-size: 1rem;
}

.layout .container .article button:hover {
  background-color: rgb(200, 200, 200);
}

.layout .container .article button:active {
  transform: translateY(0.1rem);
}

@media (max-width: 920px) {
  .layout {
    grid-template-columns: repeat(12, 1fr);
  }

  .layout .container {
    grid-column: span 12 !important; /* 모바일에선 모두 한 줄 */
  }

  .layout .container.export {
    order: 10;
  }
  .layout .container.periodic .article {
    grid-template-columns: 1fr;
  }
}
</style>
