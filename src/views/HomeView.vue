<script setup>
import { ref, onMounted, watch, computed } from 'vue'
// import axios from 'axios'

// 날짜 기본값(2025-04)
const selectedDate = ref('2025-04')

// 거래
const transactions = ref([])
// 지출
const totalExpense = ref(0)
const lastMonthExpense = ref(0)
// 수입
const totalIncome = ref(0)
const lastMonthIncome = ref(0)

// ===== 그래프 =====
// 지출 그래프
const expenseSeries = ref([
  {
    name: '지출',
    data: [0, 0],
  },
])

const expenseCharOptions = ref({
  chart: {
    id: 'expense-line',
    type: 'line',
    toolbar: { show: false },
  },
  xaxis: {
    categories: ['지난 달', '이번 달'],
  },
  title: {
    text: '월 지출 비교',
    align: 'center',
  },
  stroke: {
    curve: 'smooth',
    width: 3,
  },
  markers: {
    size: 5,
  },
})

// 수입 그래프
const incomeSeries = ref([
  {
    name: '수입',
    data: [0, 0],
  },
])

const incomeChartOptions = ref({
  chart: {
    id: 'income-bar',
    toolbar: { show: false },
  },
  xaxis: {
    categories: ['지난 달', '이번 달'],
  },
  title: {
    text: '월 수입 비교',
    align: 'center',
  },
  plotOptions: {
    bar: {
      distributed: true,
    },
  },
  colors: ['lightgray', '#008FFB'],
})

async function fetchTransactions() {
  const res = await fetch('http://localhost:3000/transactions')
  const data = await res.json()
  transactions.value = data
  calculateMonthlyExpense()
  calculateMonthlyIncome()
}

// 순수익 그래프
const mixedSeries = ref([
  {
    name: '지출',
    type: 'line',
    data: [lastMonthExpense.value, totalExpense.value],
  },
  {
    name: '수입',
    type: 'column',
    data: [lastMonthIncome.value, totalIncome.value],
  },
])

const mixedChartOptions = ref({
  chart: {
    type: 'line',
    height: 350,
    stacked: false,
    toolbar: {
      show: false,
    },
  },
  stroke: {
    width: [0, 4],
  },
  title: {
    text: '월별 수입&지출 비교',
    align: 'center',
  },
  xaxis: {
    categories: ['지난 달', '이번 달'],
  },
  yaxios: [
    {
      title: {
        text: '수입',
      },
    },
    {
      opposite: true,
      title: {
        text: '지출',
      },
    },
  ],
  markers: {
    size: 5,
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
})

// 순수익 (수입&지출)
function updateMixedSeries() {
  mixedSeries.value = [
    {
      name: '지출',
      type: 'line',
      data: [lastMonthExpense.value, totalExpense.value],
    },
    {
      name: '수입',
      type: 'column',
      data: [lastMonthIncome.value, totalIncome.value],
    },
  ]
}

// ========== 월 지출 ==========
function calculateMonthlyExpense() {
  // 이번 달 (년/월)
  const [yearStr, monthStr] = selectedDate.value.split('-')
  const year = parseInt(yearStr)
  const month = parseInt(monthStr)

  // 이번 달 지출
  const total = transactions.value
    .filter((tx) => tx.typeId === '1')
    .filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === parseInt(year) && d.getMonth() + 1 === parseInt(month)
    })
    .reduce((sum, tx) => sum + parseInt(tx.amount), 0)

  totalExpense.value = total

  // 지난 달 (년/월)
  let lastYear = year
  let lastMonth = month - 1
  if (lastMonth === 0) {
    lastMonth = 12
    lastYear -= 1
  }

  //지난 달 지출
  const lastTotal = transactions.value
    .filter((tx) => tx.typeId === '1')
    .filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === lastYear && d.getMonth() + 1 === lastMonth
    })
    .reduce((sum, tx) => sum + parseInt(tx.amount), 0)

  lastMonthExpense.value = lastTotal

  // 지출 그래프
  expenseSeries.value[0].data = [lastMonthExpense.value, totalExpense.value]

  // 순수익 (수입&지출)
  updateMixedSeries()
}

// ========== 월 수입 ==========
function calculateMonthlyIncome() {
  // 이번 달 (년/월)
  const [yearStr, monthStr] = selectedDate.value.split('-')
  const year = parseInt(yearStr)
  const month = parseInt(monthStr)

  // 이번 달 수입
  const total = transactions.value
    .filter((tx) => tx.typeId === '2')
    .filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === parseInt(year) && d.getMonth() + 1 === parseInt(month)
    })
    .reduce((sum, tx) => sum + parseInt(tx.amount), 0)

  totalIncome.value = total

  // 지난 달 (년/월)
  let lastYear = year
  let lastMonth = month - 1
  if (lastMonth === 0) {
    lastMonth = 12
    lastYear -= 1
  }

  //지난 달 수입
  const lastTotal = transactions.value
    .filter((tx) => tx.typeId === '2')
    .filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === lastYear && d.getMonth() + 1 === lastMonth
    })
    .reduce((sum, tx) => sum + parseInt(tx.amount), 0)

  lastMonthIncome.value = lastTotal

  // 수입 그래프
  incomeSeries.value[0].data = [lastMonthIncome.value, totalIncome.value]

  // 순수익 (수입&지출)
  updateMixedSeries()
}

// selectedDate가 바뀌면 다시 계산
// watch(selectedDate, calculateMonthlyExpense)
watch(selectedDate, () => {
  calculateMonthlyExpense()
  calculateMonthlyIncome()
  // recentTransactions()
})

onMounted(() => {
  fetchTransactions()
})

// ========== 거래 목록 정렬 ==========
// 가장 최근 거래들(월 상관x)
// const recentTransactions = computed(() => {
//   return [...transactions.value]
//     .sort((a, b) => new Date(b.date) - new Date(a.date))
//     .slice(0, 5)  //최근 5개
// })

// 최근 거래 (월 바뀌면 해당 월의 최근 거래)
const recentTransactions = computed(() => {
  const [yearStr, monthStr] = selectedDate.value.split('-')
  const year = parseInt(yearStr)
  const month = parseInt(monthStr)

  return [...transactions.value]
    .filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === year && d.getMonth() + 1 === month
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)
})

// 날짜 형식
const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const date = d.getDate()

  // const dayNames = ['일', '월', '화', '수', '목', '금', '토']
  // const day = dayNames[d.getDay()]

  return `${year}년 ${month}월 ${date}일`
  // return `${year}년 ${month}월 ${date}일 ${day}요일`
}
</script>

<template>
  <div>home</div>

  <!-- home -->
  <section>
    <div class="home-section">
      <!-- 날짜 -->
      <div class="date">
        <!-- <div class="date-select">
          <label>날짜 선택 : </label>
          <input type="month" v-model="selectedDate">
        </div> -->
        <div class="selectedDate">
          <p>{{ selectedDate.slice(0, 4) }}년 {{ selectedDate.slice(6, 7) }}월</p>
          <p class="dateBox"><input type="month" v-model="selectedDate" /></p>
        </div>
      </div>

      <!-- 1 -->
      <div class="home-sec01">
        <!-- 총 지출 -->
        <div class="expense">
          <h3>{{ selectedDate.slice(6, 7) }}월 총 지출</h3>
          <p class="amount">{{ totalExpense.toLocaleString() }}원</p>
          <p>
            지난 달보다
            <span
              :class="{
                red: totalExpense > lastMonthExpense,
                green: totalExpense <= lastMonthExpense,
              }"
            >
              {{ Math.abs(totalExpense - lastMonthExpense).toLocaleString() }}원
            </span>
            {{ totalExpense > lastMonthExpense ? '더 소비했어요' : '덜 소비했어요' }}
          </p>
          <!-- 지출 그래프 -->
          <div class="expenseGraph">
            <ApexChart
              type="line"
              height="300"
              :options="expenseCharOptions"
              :series="expenseSeries"
            />
          </div>
        </div>

        <!-- 총 수입 -->
        <div class="income">
          <h3>{{ selectedDate.slice(6, 7) }}월 총 수입</h3>
          <p class="amount">{{ totalIncome.toLocaleString() }}원</p>
          <!-- 수입 그래프 -->
          <div class="incomeGraph">
            <ApexChart
              type="bar"
              height="300"
              :options="incomeChartOptions"
              :series="incomeSeries"
            />
          </div>
        </div>

        <!-- 총/순수익 -->
        <div class="net-gain">
          <h3>{{ selectedDate.slice(6, 7) }}월 총/순수익</h3>
          <p class="amount">{{ (totalIncome - totalExpense).toLocaleString() }}원</p>
          <!-- 순수익 그래프 (수입&지출) -->
          <div class="mixedGraph">
            <ApexChart
              height="350"
              type="line"
              :options="mixedChartOptions"
              :series="mixedSeries"
            />
          </div>
        </div>
      </div>
      <!-- home-sec01 -->

      <!-- 2 -->
      <div class="home-sec02">
        <!-- 최근 거래 목록 -->
        <div class="recent-transaction">
          <h3>최근 거래 목록</h3>

          <div class="recent-trans-lists">
            <div class="row" v-for="item in recentTransactions" :key="item.id">
              <p>{{ formatDate(new Date(item.date).toDateString()) }}</p>
              <p>
                {{ (item.typeId === '1' ? '-' : '+') + parseInt(item.amount).toLocaleString() }}원
              </p>
              <p>{{ item.memo }}</p>
            </div>
          </div>
        </div>
        <!-- recent-transaction -->

        <!-- 월 고정지출 -->
        <div class="fixed-expense">
          <h3>{{ selectedDate.slice(6, 7) }}월 고정지출</h3>

          <div class="fixed-ex-lists">
            <div class="row">
              <p>10일</p>
              <p>국민건강보험</p>
              <p>100,000원</p>
            </div>
            <div class="row">
              <p>22일</p>
              <p>통신요금(SKT)</p>
              <p>32,100원</p>
            </div>
            <div class="row">
              <p>27일</p>
              <p>KB국민카드</p>
              <p>17,100원</p>
            </div>
          </div>
        </div>
        <!-- fixed-expense -->
      </div>
      <!-- home-sec02 -->
    </div>
    <!-- home-sec -->
  </section>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;

  color: rgb(84, 80, 69);
}
h3 {
  margin-bottom: 0.5rem;

  color: rgb(96, 88, 76);
}

/* home-section */
.home-section {
  /* border: 1px solid blue; */
  background-color: rgb(255, 188, 0, 0.8);
  padding: 1rem;

  border-style: none;
  border-radius: 10px;
}

/* 날짜 */
.date {
  margin-bottom: 1rem;
}

.selectedDate {
  display: flex;
}
.selectedDate > p {
  font-size: larger;
  font-weight: 900;
  margin-top: 0.5rem;
  margin-right: 1.5rem;
}

/* home-sec01 (총지출, 총수입, 총순수익)*/
.home-sec01 {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}


.expense,
.income,
.net-gain {
  flex: 1;
  /* flex: 1 1 calc((100% - 2rem) / 3); */
  /* border: 1px solid gray; */
  padding: 1rem;

  background-color: white;
  border-radius: 10px;
  border-style: none;
  box-shadow: 0 4px 6px rgb(0, 0, 0, 0.1);
}
.expense:hover,
.income:hover,
.net-gain:hover {
  background-color: lightgray;
}

/* 금액 (총지출, 총소비, 총순수익)*/
.amount {
  color: black;
  font-weight: 900;
}

/* 총 지출 금액 색상 */
.red {
  color: red;
  font-weight: bold;
}
.green {
  color: green;
  font-weight: bold;
}

/* 지출 그래프 */
.expenseGraph {
  margin-top: 1rem;
}

/* 수입 그래프 */
.incomeGraph {
  margin-top: 2rem;
}
/* 순수익 그래프 */
.mixedGraph {
  margin-top: 1rem;
}

/* home-sec02 (최근거래목록, 고정지출)*/
.home-sec02 {
  display: flex;
  gap: 2rem;
  margin-bottom: 1rem;
}


.recent-transaction {
  flex: 2;
  /* flex: 1 1 calc((100% - 1rem) * 2 / 3); */
  /* border: 1px solid gray; */
  padding: 1rem;

  background-color: white;
  border-radius: 10px;
  border-style: none;
  box-shadow: 0 4px 6px rgb(0, 0, 0, 0.1);
}

.recent-transaction:hover {
  background-color: lightgray;
}

/* 고정 지출 */

.fixed-expense {
  flex: 1;
  /* flex: 1 1 calc((100% - 1rem) * 1 / 3); */
  /* border: 1px solid gray; */
  padding: 1rem;

  background-color: white;
  border-radius: 15px;
  border-style: none;
  box-shadow: 0 4px 6px rgb(0, 0, 0, 0.1);
}

.row {
  display: flex;
  /* justify-content: space-between; */
  gap: 1rem;
}
</style>
