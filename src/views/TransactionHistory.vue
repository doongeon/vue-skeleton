<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionStore } from '@/stores/transactionStore'
import FilterContent from '@/components/FilterContent.vue'
import HistoryList from '@/components/HistoryList.vue'

// 라우터 & 스토어
const router = useRouter()
const transactionStore = useTransactionStore()

// 거래 데이터
const transactions = computed(() => transactionStore.states.transactions)
const categories = computed(() => transactionStore.states.categories)

// 카테고리 id → 이름+아이콘 매핑
const categoryMap = computed(() => {
  const map = {}
  categories.value.forEach((category) => {
    map[category.id] = `${category.name} ${category.icon}`
  })
  return map
})

// 수입/지출 타입 매핑
const typeMap = {
  1: '지출',
  2: '수입',
}

// 필터 상태
const filters = ref({
  type: 'all',
  categories: [],
  dayOfWeek: 'all',
  searchQuery: '',
})
const dateOrder = ref('desc')

// 필터 핸들러
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

// 필터 + 정렬된 거래 내역
const filteredTransactions = computed(() => {
  const categoryList = categories.value || []

  let result = transactions.value.filter((transaction) => {
    const categoryName = categoryList.find((cat) => cat.id === transaction.categoryId)?.name || ''

    const matchesType = filters.value.type === 'all' || transaction.type === filters.value.type
    const matchesCategory =
      filters.value.categories.length === 0 ||
      filters.value.categories.some((cat) => categoryName.includes(cat))
    const matchesDay =
      filters.value.dayOfWeek === 'all' ||
      new Date(transaction.date).getDay() === Number(filters.value.dayOfWeek)
    const matchesSearch =
      filters.value.searchQuery === '' || transaction.memo.includes(filters.value.searchQuery)

    return matchesType && matchesCategory && matchesDay && matchesSearch
  })

  return result.sort((a, b) => {
    if (dateOrder.value === 'asc') return new Date(a.date) - new Date(b.date)
    else return new Date(b.date) - new Date(a.date)
  })
})

// 상세 보기, 수정, 삭제, 추가
const goToDetail = (id) => router.push({ name: 'historyDetail', params: { id } })
const goToEdit = (id) => router.push({ name: 'editHistory', params: { id } })
const deleteTransaction = async (id) => {
  const confirmation = window.confirm('삭제하시겠습니까?')
  if (confirmation) {
    await transactionStore.deleteTransaction(id)
    alert('삭제되었습니다.')
  }
}
const goToAdd = () => router.push({ name: 'addHistory' })
</script>

<template>
  <div class="history-page">
    <FilterContent
      @filter-type="handleTypeFilter"
      @filter-day="handleDayFilter"
      @filter-category="handleCategoryFilter"
      @filter-search="handleSearch"
      @filter-date-order="handleDateOrder"
    />

    <HistoryList
      :items="filteredTransactions"
      :type-map="typeMap"
      :category-map="categoryMap"
      @click="goToDetail"
      @edit="goToEdit"
      @delete="deleteTransaction"
    />

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
  background-color: rgb(255, 188, 0);
  color: rgb(84, 80, 69);
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-transaction-btn:hover {
  background-color: rgb(230, 170, 0);
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
