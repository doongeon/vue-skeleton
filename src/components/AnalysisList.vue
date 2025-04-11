<script setup>
import { useTransactionCategoryStore } from '@/stores/transactionCategoryStore'
import { computed, defineProps } from 'vue'

const transactionCategoryStore = useTransactionCategoryStore()
const transactionCategories = computed(() => transactionCategoryStore.states.transactionCategories)

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
  if (transactionCategories.value.length === 0) {
    return 'loading'
  }

  return transactionCategories.value.find(
    (transactionCategory) => transactionCategory.id === categoryId,
  ).name
}

const getCategoryIcon = (categoryId) => {
  if (transactionCategories.value.length === 0) {
    return 'loading'
  }

  return transactionCategories.value.find(
    (transactionCategory) => transactionCategory.id === categoryId,
  ).icon
}

const getRatio = (amount) => {
  return Math.round((amount / sum.value) * 1000) / 10
}
</script>

<template>
  <ul class="p-lg-3 list-group list-group-flush">
    <li
      class="list-group-item d-flex align-items-center justify-content-between px-0 px-sm-2"
      v-for="categorialTransaction in categorialTransactions"
      :key="categorialTransaction.id"
    >
      <span style="width: 110px"
        >{{ getCategoryIcon(categorialTransaction.id) }}
        {{ getCategoryName(categorialTransaction.id) }}
      </span>
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
      <span class="ms-2 me-0" style="width: 90px">{{
        categorialTransaction.amount.toLocaleString()
      }}</span>
    </li>
  </ul>
</template>
