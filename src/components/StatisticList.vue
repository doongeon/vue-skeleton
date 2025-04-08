<script setup>
import { TRANSACTION_CATEGORY } from '@/types'
import { computed, defineProps } from 'vue'

const props = defineProps({
  categorialTransaction: Object,
})

const sum = computed(() =>
  Object.values(props.categorialTransaction).reduce((sum, amount) => sum + amount, 0),
)

const getCategoryName = (categoryId) => {
  return Object.keys(TRANSACTION_CATEGORY).find(
    (categoryName) => TRANSACTION_CATEGORY[categoryName] === categoryId,
  )
}

const getRatio = (categoryId) => {
  return Math.round((props.categorialTransaction[categoryId] / sum.value) * 1000) / 10
}
</script>

<template>
  <ul class="card p-3 list-group list-group-flush">
    <li
      class="list-group-item d-flex align-items-center justify-content-between"
      v-for="categoryId in Object.keys(props.categorialTransaction)"
      :key="categoryId"
    >
      <span style="width: 70px">{{ getCategoryName(categoryId) }}</span>
      <div
        class="progress w-50"
        role="progressbar"
        aria-label="Success example"
        :aria-valuenow="getRatio(categoryId)"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          class="progress-bar text-bg-success"
          :style="{ width: getRatio(categoryId) + '%' }"
        ></div>
      </div>
      <span class="me-0" style="width: 90px">{{
        props.categorialTransaction[categoryId].toLocaleString()
      }}</span>
    </li>
  </ul>
</template>
