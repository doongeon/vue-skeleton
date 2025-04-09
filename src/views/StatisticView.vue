<script setup>
import { useTransactionStore } from '@/stores/transactionStore'
import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@/types'
import { computed, reactive } from 'vue'
import PieChart from '../components/PieChart.vue'
import StatisticList from '../components/StatisticList.vue'

const transactionStore = useTransactionStore()

const transactions = computed(() => transactionStore.states.transactions)

const expenses = computed(() =>
  transactions.value
    .filter((t) => t.typeId === TRANSACTION_TYPE.expense)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }),
)

const incomes = computed(() =>
  transactions.value
    .filter((t) => t.typeId === TRANSACTION_TYPE.income)
    .sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    }),
)

const categorialExpense = computed(() =>
  expenses.value.reduce((res, e) => {
    if (!res[e.categoryId]) res[e.categoryId] = 0
    res[e.categoryId] += e.amount
    return res
  }, {}),
)

const categorialIncome = computed(() =>
  incomes.value.reduce((res, e) => {
    if (!res[e.categoryId]) res[e.categoryId] = 0
    res[e.categoryId] += e.amount
    return res
  }, {}),
)

const total = computed(() => {
  console.log('  ⚠️  : ', incomes)
  return (
    incomes.value.reduce((sum, i) => sum + i.amount, 0) -
    expenses.value.reduce((sum, i) => sum + i.amount, 0)
  ).toLocaleString()
})

const totalIncome = computed(() => {
  return incomes.value.reduce((sum, i) => sum + i.amount, 0).toLocaleString()
})

const totalExpense = computed(() => {
  return expenses.value.reduce((sum, i) => sum + i.amount, 0).toLocaleString()
})

const states = reactive({
  period: 1,
  transactionType: 'income',
  expenses: [],
  incomes: [],
  categorialExpense: {},
  categorialIncome: {},
})

const getCategoryName = (categoryId) => {
  return Object.keys(TRANSACTION_CATEGORY).find(
    (categoryName) => TRANSACTION_CATEGORY[categoryName] === categoryId,
  )
}
</script>

<template>
  <div class="card py-3 px-5 shadow-sm">
    <div class="card-body">
      <div class="mb-4">
        <span class="fs-4 me-2">총 수익</span>
        <span class="fs-2">{{ total }}</span>
      </div>

      <div class="mb-3 d-flex justify-content-between">
        <div>
          <select class="form-select" v-model="states.period">
            <option value="1">1개월</option>
            <option value="3">3개월</option>
            <option value="6">6개월</option>
          </select>
        </div>
        <div class="d-flex">
          <button class="btn btn-warning me-1" @click="states.transactionType = 'income'">
            수익
          </button>
          <button class="btn btn-warning" @click="states.transactionType = 'expense'">지출</button>
        </div>
      </div>

      <div class="card mb-5 p-4 shadow-sm">
        <div class="mb-4">
          <span class="fs-5 me-2">
            {{ states.transactionType === 'income' ? '순 수익' : '순 지출' }}
          </span>
          <span class="fs-4">
            {{ states.transactionType === 'income' ? totalIncome : totalExpense }}
            원
          </span>
        </div>

        <div class="row flex-column flex-md-row">
          <div class="col-lg-6 mb-3 mb-lg-0">
            <template v-if="states.transactionType === 'expense'">
              <PieChart
                :series="Object.values(categorialExpense)"
                :labels="Object.keys(categorialExpense).map(getCategoryName)"
              />
            </template>
            <template v-if="states.transactionType === 'income'">
              <PieChart
                :series="Object.values(categorialIncome)"
                :labels="Object.keys(categorialIncome).map(getCategoryName)"
              />
            </template>
          </div>

          <div class="col-lg-6">
            <template v-if="states.transactionType === 'income'">
              <StatisticList :categorialTransaction="categorialIncome" />
            </template>
            <template v-if="states.transactionType === 'expense'">
              <StatisticList :categorialTransaction="categorialExpense" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
