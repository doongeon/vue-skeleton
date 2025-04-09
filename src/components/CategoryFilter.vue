<script setup>
import { TRANSACTION_CATEGORY, TRANSACTION_TYPE } from '@/types'
import { computed, ref, watch, watchEffect} from 'vue'
import transactionRequest from '@/apis/transaction'

const categoryList = computed(() => 
  Object.entries(TRANSACTION_CATEGORY).map(([name, id]) => ({
    id:Number(id),
    name:name
  }))
)

// selectedCategories 초기화: 전체 리스트 값
watch(categoryList, (list) => {
  if (selectedCategories.value.length === 0) {
    selectedCategories.value = list.map(c=>c.id)
  }
})
const transactions = ref([])

const selectedCategories = ref([])


watchEffect(async () => {
  const res = await transactionRequest.fetchTransactions()
  transactions.value = res.data
})

const toggleCategory = (category) => {
  const id = category.id
  const idx = selectedCategories.value.indexOf(id)
  
  if (idx >= 0) {
    selectedCategories.value.splice(idx, 1)
  } else {
    selectedCategories.value.push(id)
  }
}

const summaryData = computed(() => {
  const result = {}
    // 만약 transactions.value가 배열이 아니라면 data 배열을 사용
  const txArray = Array.isArray(transactions.value) 
    ? transactions.value 
    : transactions.value.data || []

    txArray.forEach((transaction) => {
    // 거래의 categoryId (문자열)을 숫자로 변환하여 selectedCategories와 비교
    const transactionCategoryId = Number(transaction.categoryId)
    if (selectedCategories.value.includes(transactionCategoryId)) {
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
</script>

<template>
  <div class="category-filter">
    <span
      v-for="category in categoryList"
      :key="category.id"
      @click="toggleCategory(category)"
      class="category-tag"
    >
      {{ category.name }}
    </span>

  </div>

  <slot :summary="summaryData" :selectedCategories="selectedCategories" />
</template>

<style scoped>
.category-filter {
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

.category-tag:hover {
  background-color: #ccc;
}
</style>
