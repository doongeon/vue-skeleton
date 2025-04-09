<script setup>
import { TRANSACTION_CATEGORY } from '@/types'
import { computed, defineProps } from 'vue'

const props = defineProps({
  categorialTransaction: Object,
})

const categorialTransactions = computed(() => {
  return Object.keys(props.categorialTransaction)
    .map((key) => {
      return { id: key, amount: props.categorialTransaction[key] }
    })
    .sort((a, b) => b.amount - a.amount)
})

const sum = computed(() => {
  return categorialTransactions.value.reduce((sum, e) => sum + e.amount, 0)
})

const getCategoryName = (categoryId) => {
  return Object.keys(TRANSACTION_CATEGORY).find(
    (categoryName) => TRANSACTION_CATEGORY[categoryName] === categoryId,
  )
}

const getRatio = (amount) => {
  return Math.round((amount / sum.value) * 1000) / 10
}
</script>

<template>
  <ul class="card p-3 list-group list-group-flush">
    <li
      class="list-group-item d-flex align-items-center justify-content-between"
      v-for="categorialTransaction in categorialTransactions"
      :key="categorialTransaction.id"
    >
      <span style="width: 70px">{{ getCategoryName(categorialTransaction.id) }}</span>
      <div
        class="progress w-50"
        role="progressbar"
        aria-label="Success example"
        :aria-valuenow="getRatio(categorialTransaction.amount)"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          class="progress-bar bg-warning"
          :style="{ width: getRatio(categorialTransaction.amount) + '%' }"
        ></div>
      </div>
      <span class="me-0" style="width: 90px">{{
        categorialTransaction.amount.toLocaleString()
      }}</span>
    </li>
  </ul>
</template>
