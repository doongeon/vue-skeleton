<script setup>
import { useTransactionStore } from '@/stores/transactionStore'
import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@/types'
import { computed, reactive, watch } from 'vue'
import PieChart from '../components/PieChart.vue'
import StatisticList from '../components/StatisticList.vue'

const transactionStore = useTransactionStore()
const transactions = computed(() => transactionStore.states.transactions)

const states = reactive({
  period: 1,
  transactionType: 'income',
  expenses: [],
  incomes: [],
  categorialExpense: {},
  categorialIncome: {},
})

watch(transactions, () => {
  transactions.value.forEach((t) => {
    if (t.typeId === TRANSACTION_TYPE.expense) states.expenses.push(t)
    if (t.typeId === TRANSACTION_TYPE.income) states.incomes.push(t)
  })

  states.expenses.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  states.categorialExpense = states.expenses.reduce((res, e) => {
    if (!res[e.categoryId]) res[e.categoryId] = 0
    res[e.categoryId] += e.amount
    return res
  }, {})

  states.categorialIncome = states.incomes.reduce((res, e) => {
    if (!res[e.categoryId]) res[e.categoryId] = 0
    res[e.categoryId] += e.amount
    return res
  }, {})
})

const getCategoryName = (categoryId) => {
  return Object.keys(TRANSACTION_CATEGORY).find(
    (categoryName) => TRANSACTION_CATEGORY[categoryName] === categoryId,
  )
}

const getTotal = () => {
  return transactions.value
    .reduce((res, t) => {
      if (t.typeId === TRANSACTION_TYPE.expense) res -= t.amount
      else res += t.amount
      return res
    }, 0)
    .toLocaleString()
}
</script>

<template>
  <div class="card py-3 px-5 shadow-sm">
    <div class="card-body">
      <div class="mb-4">
        <span class="fs-4 me-2">총 수익</span>
        <span class="fs-2">{{ getTotal() }}</span>
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
            {{
              states.transactionType === 'income'
                ? Object.values(states.categorialIncome)
                    .reduce((sum, i) => sum + i, 0)
                    .toLocaleString()
                : Object.values(states.categorialExpense)
                    .reduce((sum, i) => sum + i, 0)
                    .toLocaleString()
            }}
            원
          </span>
        </div>

        <div class="row flex-column flex-md-row">
          <div class="col-lg-6 mb-3 mb-lg-0">
            <template v-if="states.transactionType === 'expense'">
              <PieChart
                :series="Object.values(states.categorialExpense)"
                :labels="Object.keys(states.categorialExpense).map(getCategoryName)"
              />
            </template>
            <template v-if="states.transactionType === 'income'">
              <PieChart
                :series="Object.values(states.categorialIncome)"
                :labels="Object.keys(states.categorialIncome).map(getCategoryName)"
              />
            </template>
          </div>

          <div class="col-lg-6">
            <template v-if="states.transactionType === 'income'">
              <StatisticList :categorialTransaction="states.categorialIncome" />
            </template>
            <template v-if="states.transactionType === 'expense'">
              <StatisticList :categorialTransaction="states.categorialExpense" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
