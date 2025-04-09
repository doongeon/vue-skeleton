<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore' // transactionStore.js 불러오기
import FilterContent from '@/components/FilterContent.vue'
import HistoryList from '@/components/HistoryList.vue'

const router = useRouter()

// transactionStore 사용
const transactionStore = useTransactionStore()

// 거래 데이터 가져오기
onMounted(async () => {
  await transactionStore.initStore()
})

// 카테고리 id → 이름+아이콘 매핑
const categoryMap = computed(() => {
  const map = {}
  transactionStore.states.transactions.forEach((transaction) => {
    const category =
      transactionStore.states.transactions.find(
        (cat) => cat.categoryId === transaction.categoryId,
      ) || {} // categoryId에 맞는 카테고리를 찾거나 없으면 빈 객체 반환
    map[transaction.categoryId] = `${category.name} ${category.icon}` // 카테고리 이름과 아이콘 추가
  })
  return map
})

// 수입/지출 타입 매핑
const typeMap = {
  1: '지출',
  2: '수입',
}

// 필터 상태 정의
const filters = ref({
  type: 'all',
  categories: [],
  dayOfWeek: 'all',
  searchQuery: '',
})
const dateOrder = ref('desc')

// 필터링 이벤트 처리 함수들
const handleTypeFilter = (type) => {
  filters.value.type = type
}
const handleDayFilter = (day) => {
  filters.value.dayOfWeek = day
}
const handleCategoryFilter = (categoryObj) => {
  const name = categoryObj.name
  const idx = filters.value.categories.indexOf(name)
  if (idx === -1) filters.value.categories.push(name)
  else filters.value.categories.splice(idx, 1)
}
const handleSearch = (query) => {
  filters.value.searchQuery = query
}
const handleDateOrder = (order) => {
  dateOrder.value = order
}

// 필터링 + 정렬된 거래 내역 반환
const filteredTransactions = computed(() => {
  let result = transactionStore.states.transactions.filter((transaction) => {
    const matchesType = filters.value.type === 'all' || transaction.type === filters.value.type
    const matchesCategory =
      filters.value.categories.length === 0 ||
      filters.value.categories.some((cat) => transaction.category.includes(cat))
    const matchesDay =
      filters.value.dayOfWeek === 'all' ||
      new Date(transaction.date).getDay() === Number(filters.value.dayOfWeek)
    const matchesSearch =
      filters.value.searchQuery === '' || transaction.memo.includes(filters.value.searchQuery)

    return matchesType && matchesCategory && matchesDay && matchesSearch
  })

  // 날짜 기준 정렬
  return result.sort((a, b) => {
    if (dateOrder.value === 'asc') return new Date(a.date) - new Date(b.date)
    else return new Date(b.date) - new Date(a.date)
  })
})

// 거래 상세 페이지로 이동
const goToDetail = (id) => {
  router.push({ name: 'historyDetail', params: { id } })
}

// 거래 수정 페이지로 이동
const goToEdit = (id) => {
  router.push({ name: 'editHistory', params: { id } })
}

// 거래 삭제 처리
const deleteTransaction = async (id) => {
  const confirmation = window.confirm('삭제하시겠습니까?')
  if (confirmation) {
    await transactionStore.deleteTransaction(id)
    alert('삭제되었습니다.')
  }
}

// 거래 추가 페이지로 이동
const goToAdd = () => {
  router.push({ name: 'addHistory' })
}
</script>

<template>
  <div class="history-page">
    <!-- 필터 컴포넌트에서 필터링 이벤트 받아 처리 -->
    <FilterContent
      @filter-type="handleTypeFilter"
      @filter-day="handleDayFilter"
      @filter-category="handleCategoryFilter"
      @filter-search="handleSearch"
      @filter-date-order="handleDateOrder"
    />

    <!-- 거래 리스트 컴포넌트: 클릭 시 상세보기, ✏️ 수정 버튼 눌렀을 땐 edit 이벤트 발생 -->
    <HistoryList
      :items="filteredTransactions"
      @click="goToDetail"
      @edit="goToEdit"
      @delete="deleteTransaction"
    />

    <!-- 거래 추가 버튼을 가로로 배치 -->
    <div class="button-group">
      <button class="add-transaction-btn" @click="goToAdd">거래 추가</button>
    </div>
  </div>
</template>

<style scoped>
.history-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.add-transaction-btn {
  padding: 10px 20px;
  background-color: rgb(255, 188, 0); /* R255 G188 B0 */
  color: rgb(84, 80, 69);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-transaction-btn:hover {
  background-color: rgb(230, 170, 0); /* 조금 더 어두운 색상 */
}

@media (min-width: 768px) {
  .history-page {
    padding: 2rem;
    max-width: 700px;
    margin: 0 auto;
  }
}

@media (min-width: 1024px) {
  .history-page {
    max-width: 900px;
  }
}
</style>
