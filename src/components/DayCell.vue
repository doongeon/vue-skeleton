<script setup>
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'

const props = defineProps({
  date: {
    type: Date, // Fri May 09 2025 00:00:00 GMT+0900 (Korean)
    required: true,
  },
})

const categoryFilter = useCalendarStore()

// 해당 날짜에 대한 income, expense 반환
const cellData = computed(() => {
  const currentDate = props.date.toISOString().slice(0, 10)
  // day cell에 들어갈 imcome, expense 업데이트
  if (categoryFilter.filteredData[currentDate]) {
    const { income, expense } = categoryFilter.filteredData[currentDate]
    return { income, expense }
  }
  // 해당 날짜에 데이터가 없으면 기본값 반환
  return { income: 0, expense: 0 }
})
</script>

<template>
  <div class="day-cell">
    <div class="day-number">{{ props.date.getDate() }}</div>
    <!-- toLocaleString은 숫자 3마다 , 찍기 -->
    <div class="income" v-if="cellData.income">+{{ cellData.income.toLocaleString() }}</div>
    <div class="expense" v-if="cellData.expense">-{{ cellData.expense.toLocaleString() }}</div>
  </div>
</template>

<style scoped>
.day-cell {
  padding: 4px;
  font-size: 12px;
}

.day-number {
  font-size: 16px;
  font-weight: bold;
}

.income {
  text-align: right;
  color: red;
}
.expense {
  text-align: right;
  color: blue;
}
</style>
