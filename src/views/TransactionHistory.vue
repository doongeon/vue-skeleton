<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import FilterContent from '@/components/FilterContent.vue'
import HistoryList from '@/components/HistoryList.vue'

// -----------------------
// 거래 내역 원본 데이터
// -----------------------
const transactions = ref([])

// -----------------------
// 컴포넌트 마운트 시 거래 데이터 요청
// -----------------------
onMounted(async () => {
  try {
    const response = await fetch('http://localhost:3000/transactions')
    const data = await response.json()

    // typeId → 텍스트 변환
    const typeMap = {
      1: '지출',
      2: '수입',
    }

    // categoryId → 이름 + 이모지 변환
    const categoryMap = {
      1: '월급 💼',
      2: '교통 🚗',
      3: '문화/여가 🎮',
      4: '술/유흥 🍺',
      5: '쇼핑 🛍️',
      6: '여행/숙박 🏨',
      7: '식비 🍽️',
      8: '용돈 💸',
      9: '보너스 🎁',
      10: '매매 📈',
      11: '이자 💰',
    }

    // 불러온 데이터를 화면에 맞게 가공
    transactions.value = data.map((item) => ({
      id: item.id,
      date: item.date.slice(0, 10), // yyyy-mm-dd 형식
      category: categoryMap[item.categoryId] || '기타',
      amount: item.amount,
      memo: item.memo,
      type: typeMap[item.typeId] || '기타',
    }))
  } catch (error) {
    console.error('데이터 불러오기 실패:', error)
  }
})

// -----------------------
// 필터 상태 관리
// -----------------------
const filters = ref({
  type: 'all', // 수입/지출/전체
  categories: [], // 선택된 카테고리들 (복수 가능)
  dayOfWeek: 'all', // 요일 (0~6) or 전체
  searchQuery: '', // 검색어
})

// 날짜 정렬 상태 (오름차순/내림차순)
const dateOrder = ref('desc')

// -----------------------
// 필터 이벤트 핸들러
// -----------------------
const handleTypeFilter = (type) => {
  filters.value.type = type
}

const handleDayFilter = (day) => {
  filters.value.dayOfWeek = day
}

const handleCategoryFilter = (categoryObj) => {
  const name = categoryObj.name
  const idx = filters.value.categories.indexOf(name)

  if (idx === -1) {
    filters.value.categories.push(name) // 추가
  } else {
    filters.value.categories.splice(idx, 1) // 제거
  }
}

const handleSearch = (query) => {
  filters.value.searchQuery = query
}

const handleDateOrder = (order) => {
  dateOrder.value = order
}

// -----------------------
// 필터링 + 정렬된 거래 내역 반환
// -----------------------
const filteredTransactions = computed(() => {
  // 필터 적용
  let result = transactions.value.filter((transaction) => {
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

  // 날짜 정렬
  return result.sort((a, b) => {
    if (dateOrder.value === 'asc') {
      return new Date(a.date) - new Date(b.date)
    } else {
      return new Date(b.date) - new Date(a.date)
    }
  })
})

// -----------------------
// 거래 상세 페이지로 이동
// -----------------------
const router = useRouter()
const goToDetail = (id) => {
  router.push({ name: 'TransactionDetail', params: { id } })
}
</script>

<template>
  <div class="history-page">
    <!-- 필터 컴포넌트에서 다양한 필터링 이벤트 발생 -->
    <FilterContent
      @filter-type="handleTypeFilter"
      @filter-day="handleDayFilter"
      @filter-category="handleCategoryFilter"
      @filter-search="handleSearch"
      @filter-date-order="handleDateOrder"
    />

    <!-- 필터링 + 정렬된 거래 리스트 렌더링 -->
    <HistoryList :items="filteredTransactions" @click="goToDetail" />
  </div>
</template>

<style scoped>
/* 페이지 레이아웃 설정 */
.history-page {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 태블릿 이상 */
@media (min-width: 768px) {
  .history-page {
    padding: 2rem;
    max-width: 700px;
    margin: 0 auto;
  }
}

/* 데스크탑 이상 */
@media (min-width: 1024px) {
  .history-page {
    max-width: 900px;
  }
}
</style>
