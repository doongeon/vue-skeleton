<script setup>
import { TRANSACTION_TYPE } from '@/types'
import { computed, watch, reactive } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore.js'
import { useTransactionStore } from '@/stores/transactionStore'
import { useTransactionCategoryStore } from '@/stores/transactionCategoryStore'

const categoryStore = useTransactionCategoryStore()

// 태그 구조 [ {id:1, name: '식비'}, {} ...]
const categoryList = computed(() =>
  (categoryStore.states.transactionCategories || []).map((c) => ({
    id: Number(c.id),
    name: c.name,
  })),
)

// selectedCategories 초기화: 전체 태그 포함
// category id 기준 계산
const selectedCategories = reactive([])

watch(
  categoryList,
  (newList) => {
    // 값이 비어 있을 때만 초기화 (처음 로딩 시에만)
    if (selectedCategories.length === 0 && newList.length > 0) {
      newList.forEach((c) => selectedCategories.push(c.id))
    }
  },
  { immediate: true },
)

// 새로운 거래가 생기면 받아와 transactions.value에 추가
// transactions.value [{}, {}...]
// amount: 10000
// categoryId:7
// createdAt:2025-04-06T00:00:00
// date:2025-04-06T12:30:00
// id:1
// memo:test 돈까쓰
// typeId:1
// updatedAt:2025-04-08T00:03:13.840Z
// userId:1
const transactionStore = useTransactionStore()
const transactions = computed(() => transactionStore.states.transactions)

// selectedCategories 값 토글함수
const toggleCategory = (category) => {
  const id = category.id
  const idx = selectedCategories.indexOf(id)

  if (idx >= 0) {
    selectedCategories.splice(idx, 1)
  } else {
    selectedCategories.push(id)
  }
}

// 선택된 태그 기준 날짜별 {income, expense} object
// 2025-04-02: {income: 0, expense: 30000}
// 2025-04-03: {income: 0, expense: 45000}
const filteredData = computed(() => {
  console.log('DEBUG: selectedCategories:', selectedCategories)

  const result = {}
  const txArray = transactions.value
  txArray.forEach((transaction) => {
    // 거래의 categoryId (문자열)을 숫자로 변환하여 selectedCategories와 비교
    const transactionCategoryId = Number(transaction.categoryId)
    if (selectedCategories.includes(transactionCategoryId)) {
      // 날짜는 ISO 문자열의 앞부분(YYYY-MM-DD)으로 처리
      const date = transaction.date.slice(0, 10)

      // 해당 날짜에 대한 결과 초기화
      if (!result[date]) {
        result[date] = { income: 0, expense: 0 }
      }
      // 거래 유형에 따라 수입 혹은 지출 누적
      if (transaction.typeId === TRANSACTION_TYPE.expense) {
        result[date].expense += Number(transaction.amount)
      } else if (transaction.typeId === TRANSACTION_TYPE.income) {
        result[date].income += Number(transaction.amount)
      }
    }
  })
  return result
})

// filteredData 선언 후 사용 가능
const categoryFilter = useCalendarStore()
// 자동추적 & 재실행
watch(
  filteredData,
  (newVal) => {
    categoryFilter.updateFilteredData(newVal)
  },
  { immediate: true },
)
</script>

<template>
  <div class="category-filter">
    <span
      v-for="(category, idx) in categoryList"
      :key="category.id"
      @click="toggleCategory(category)"
      :class="{ active: selectedCategories.includes(category.id) }"
      class="category-tag"
    >
      {{ category.name }}
    </span>
  </div>

  <slot :filter="filteredData" :selectedCategories="selectedCategories" />
</template>

<style scoped>
.category-filter {
  margin-top: 5%;
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tag {
  padding: 4px 10px;
  border-radius: 12px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.category-tag.active {
  background-color: rgb(96, 88, 76);
  color: white;
}
</style>
