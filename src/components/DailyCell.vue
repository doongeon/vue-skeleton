<script setup>
import { computed } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { TRANSACTION_TYPE } from '@/types'

const props = defineProps({
  date: [String, Date],
  selectedCategory: String,
})

const store = useTransactionStore()
const toDateString = (date) => new Date(date).toISOString().slice(0, 10)
const summary = computed(() => {
  const currentDate = toDateString(props.date)
  const matched = store.states.transactions.filter((t) => {
    const isSameDate = toDateString(t.date) === currentDate 
    const isSameCategory = !props.selectedCategory || t.categoryId === props.selectedCategory
    return isSameDate&&isSameCategory
  })

  const income = matched
    .filter((t) => t.typeId === TRANSACTION_TYPE.income)
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const expense = matched
    .filter((t) => t.typeId === TRANSACTION_TYPE.expense)
    .reduce((sum, t) => sum + Number(t.amount), 0)

  return { income, expense }
})
</script>

<template>
  <div class="daily-box">
    <div class="day-number">{{ props.date.getDate() }}</div>
    <div class="income" v-if="summary.income">+{{ summary.income.toLocaleString() }}</div>
    <div class="expense" v-if="summary.expense">-{{ summary.expense.toLocaleString() }}</div>
  </div>
</template>

<style scoped>
.daily-box {
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
