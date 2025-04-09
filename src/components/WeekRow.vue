<script setup>
import { computed, defineProps } from 'vue';


const props = defineProps({
    summary:Object

})

const weeklySummary = computed(()=> {
    const weeks = {}

    Object.entries(props.summary).forEach(([date, {income, expense}]) => {
        const day = new Date(date)
        const weekKey = `${day.getFullYear()}-W${getWeekNumber(day)}`
    
    if (!weeks[weekKey]) {
      weeks[weekKey] = { income: 0, expense: 0 }
    }

    weeks[weekKey].income += income
    weeks[weekKey].expense += expense
  })

  return weeks
})

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}
</script>

<template>
    <div class="week-summary">
      <div v-for="(data, week) in weeklySummary" :key="week">
        <strong>{{ week }}</strong> | +{{ data.income }} / -{{ data.expense }}
      </div>
    </div>
  </template>
  
  <style scoped>
  .week-summary {
    margin-top: 12px;
    font-size: 14px;
  }
  </style>