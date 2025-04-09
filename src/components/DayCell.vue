<script setup>
import { computed, watch } from 'vue'
//import { useCalendarStore } from '@/stores/calendarStore'

const props = defineProps({
  date: {
    type: Date, // Fri May 09 2025 00:00:00 GMT+0900 (Korean)
    required: true,
  },
  filtererdData: {
    type: Object, // 2025-04-03: {income: 0, expense: 45000}
    default: () => ({}),
  },
})

console.log('DayCell DEBUG: filteredData data: ', props.filteredData)

// 날짜 변환용 함수 : YYYY-MM-DD 형식
const toDateString = (date) => new Date(date).toISOString().slice(0, 10)

watch(
  () => props.filteredData,
  (newFilteredData) => {
    console.log('DayCell: props.filteredData 업데이트:', newFilteredData)
  },
  { deep: true },
)

// 해당 날짜에 대한 income, expense 반환
const cellData = computed(() => {
  const currentDate = toDateString(props.date)
  // day cell에 들어갈 imcome, expense 업데이트
  if (props.filteredData[currentDate]) {
    const { income, expense } = props.filteredData[currentDate]
    return { income, expense }
  }
  // 해당 날짜에 데이터가 없으면 기본값 반환
  return { income: 0, expense: 0 }
})
</script>

<template>
  <div class="daily-cell">
    <div class="day-number">{{ props.date.getDate() }}</div>
    <!-- toLocaleString은 숫자 3마다 , 찍기 -->
    <div class="income" v-if="cellData.income">+{{ cellData.income.toLocaleString() }}</div>
    <div class="expense" v-if="cellData.expense">-{{ cellData.expense.toLocaleString() }}</div>
  </div>
</template>

<style scoped>
.daily-cell {
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
