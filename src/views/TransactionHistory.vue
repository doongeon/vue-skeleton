<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router' // Vue Router 추가
import FilterContent from '@/components/FilterContent.vue'
import HistoryList from '@/components/HistoryList.vue'

// 거래내역
const transactions = ref([
  { id: 1, date: '2025-04-01', category: '식비', amount: 12000, memo: '점심', type: '지출' },
  { id: 2, date: '2025-04-02', category: '쇼핑', amount: 50000, memo: '옷 구매', type: '지출' },
])

// 필터 상태
const filters = ref({
  type: 'all',
  category: 'all',
  dayOfWeek: 'all',
  searchQuery: '',
})

// 필터링된 거래내역
const filteredTransactions = computed(() => {
  return transactions.value.filter((transaction) => {
    const matchesType = filters.value.type === 'all' || transaction.type === filters.value.type
    const matchesCategory =
      filters.value.category === 'all' || transaction.category === filters.value.category
    const matchesDay =
      filters.value.dayOfWeek === 'all' ||
      new Date(transaction.date).getDay() === Number(filters.value.dayOfWeek)
    const matchesSearch = transaction.memo.includes(filters.value.searchQuery)

    return matchesType && matchesCategory && matchesDay && matchesSearch
  })
})

// Vue Router의 useRouter 훅 사용
const router = useRouter()

// 거래 클릭 시 상세보기로 이동하는 함수
const goToDetail = (id) => {
  router.push({ name: 'TransactionDetail', params: { id } })
}
</script>

<template>
  <div class="history-page">
    <!-- 필터 컴포넌트 -->
    <FilterContent />

    <!-- 거래내역 리스트 -->
    <HistoryList :transactions="filteredTransactions" @click="goToDetail" />
  </div>
</template>

<style scoped>
.history-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
