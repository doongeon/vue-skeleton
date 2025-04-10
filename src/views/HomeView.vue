<script setup>
// import { ref, onMounted, watch, computed } from 'vue'
import { computed, ref } from 'vue'
import { useTransactionStore } from '@/stores/transactionStore'
import { useDateStore } from '@/stores/dateStore'
// import axios from 'axios'

const transactionStore = useTransactionStore()
const transactions = computed(() => transactionStore.states.transactions)

// 날짜
const dateStore = useDateStore()
const selectedDate = computed(() => dateStore.selectedDate)

const selectedYear = computed(() => parseInt(selectedDate.value.split('-')[0]))
const selectedMonth = computed(() => parseInt(selectedDate.value.split('-')[1]))

// ===== 지출 =====
const totalExpense = computed(() => {
  return transactions.value
    .filter((tx) => {
      const d = new Date(tx.date)
      return (
        d.getFullYear() === selectedYear.value &&
        d.getMonth() + 1 === selectedMonth.value &&
        tx.typeId === '1'
      )
    })
    .reduce((sum, tx) => sum + parseInt(tx.amount), 0)
})

const lastMonthExpense = computed(() => {
  const last = new Date(selectedDate.value)
  last.setMonth(last.getMonth() - 1)
  const year = last.getFullYear()
  const month = last.getMonth() + 1

  return transactions.value
    .filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === year && d.getMonth() + 1 === month && tx.typeId === '1'
    })
    .reduce((sum, tx) => sum + parseInt(tx.amount), 0)
})

// ===== 수입 =====
const totalIncome = computed(() => {
  return transactions.value
    .filter((tx) => {
      const d = new Date(tx.date)
      return (
        d.getFullYear() === selectedYear.value &&
        d.getMonth() + 1 === selectedMonth.value &&
        tx.typeId === '2'
      )
    })
    .reduce((sum, tx) => sum + parseInt(tx.amount), 0)
})

const lastMonthIncome = computed(() => {
  const last = new Date(selectedDate.value)
  last.setMonth(last.getMonth() - 1)
  const year = last.getFullYear()
  const month = last.getMonth() + 1

  return transactions.value
    .filter((tx) => {
      const d = new Date(tx.date)
      return d.getFullYear() === year && d.getMonth() + 1 === month && tx.typeId === '2'
    })
    .reduce((sum, tx) => sum + parseInt(tx.amount), 0)
})

// ========== 그래프 ==========
// ===== 지출 그래프 =====
const expenseSeries = computed(() => [
  { name: '지출', data: [lastMonthExpense.value, totalExpense.value] },
])

const expenseCharOptions = ref({
  chart: {
    id: 'expense-line',
    type: 'line',
    toolbar: { show: false},
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

// ===== 수입 그래프 =====
const incomeSeries = computed(() => [
  { name: '수입', data: [lastMonthIncome.value, totalIncome.value] },
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
    bar:{
      distributed: true,
    },
  },
  colors: ['lightgray', '#008FFB']
})

// ===== 순수익 그래프 =====
const mixedSeries = computed(() => [
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
  yaxis: [ 
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


// ========== 거래 목록 정렬 ==========
// const recentTransactions = computed(() => {
//   return [...transactions.value]
//     .filter((tx) => {
//       const d = new Date(tx.date)
//       return d.getFullYear() === selectedYear.value && d.getMonth() + 1 === selectedMonth.value
//     })
//     .sort((a, b) => new Date(b.date) - new Date(a.date))
//     .slice(0, 5)
// }) 

const recentTransactions = computed(() => {
  const selected = new Date(selectedDate.value) // 'YYYY-MM-DD'
  
  return [...transactions.value]
    .filter((tx) => new Date(tx.date) <= selected)
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
  <!-- <div>home</div> -->

  
  <!-- home -->
  <div class="home" style="max-width: 1200px;">
  
    <div class="home-section">

      <!-- 날짜 -->
      <div class="date">
        <!-- <div class="date-select">
          <label>날짜 선택 : </label>
          <input type="month" v-model="selectedDate">
        </div> -->
        <div class="selectedDate">
          <p>{{ selectedDate.slice(0,4) }}년 {{ selectedDate.slice(5,7) }}월</p>
          <!-- <p class="dateBox"><input type="month" v-model="selectedDate"></p> -->

          <!-- <p class="dateBox">
            <input type="month" v-model="selectedDate" class="border rounded px-2 py-1"style="font-size: 1rem;"/>
          </p> -->

        </div>
      </div>

      <!-- 1 -->
      <!-- <div class="home-sec01 row-card"> -->
    <div class="container" style="max-width: 1200px;">
        
      <div class="home-sec01 row g-0">

        <!-- 총 지출 -->
        <div class="expense col-lg-4">
          <div class="ex-c card h-100 p-4 m-2">

            <router-link to="/main/analysis" style="text-decoration: none;">
              <h3>{{ selectedDate.slice(6,7) }}월 총 지출</h3>
              <p class="amount">{{ totalExpense.toLocaleString() }}원</p>
              <p>
                지난 달보다 
                <span :class="{'red': totalExpense>lastMonthExpense, 'green': totalExpense<=lastMonthExpense}">
                  {{ Math.abs(totalExpense - lastMonthExpense).toLocaleString() }}원
                </span>
                {{ totalExpense > lastMonthExpense ? '더 소비했어요' : '덜 소비했어요' }} </p>
              <!-- 지출 그래프 -->
              <div class="expenseGraph">
                <ApexChart
                  type="line"
                  height="300"
                  :options="expenseCharOptions"
                  :series="expenseSeries"
                />
              </div>
            </router-link>

          </div><!-- ex-c -->
        </div><!-- expense -->

        <!-- 총 수입 -->
        <div class="income col-lg-4">
          <div class="in-c card h-100 p-4 m-2">

            <router-link to="/main/analysis" style="text-decoration: none;">
              <h3>{{ selectedDate.slice(6,7) }}월 총 수입</h3>
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
            </router-link>
          </div><!-- in-c -->
        </div><!-- income -->

        <!-- 총/순수익 -->
        <div class="net-gain col-lg-4">
          <div class="n-g-c card h-100 p-4 m-2">

            <router-link to="/main/analysis" style="text-decoration: none;">
              <h3>{{ selectedDate.slice(6,7) }}월 총/순수익</h3>
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
            </router-link>

          </div><!-- n-g-c -->
        </div><!-- net-gain -->

      </div><!-- home-sec01 -->
    </div>

      <!-- 2 -->
    <div class="container" style="max-width: 1200px;">

      <div class="home-sec02 row g-3">

        <!-- 최근 거래 목록 -->
        <div class="recent-transaction col-lg-8">
          <div class="re-trans-c card h-100 p-4 m-2">

            <router-link to="/main/analysis" style="text-decoration: none;">
            <h3>최근 거래 목록</h3>

              <div class="recent-trans-lists">
                <div class="row-card" v-for="item in recentTransactions" :key="item.id">
                  <p>{{ formatDate(new Date(item.date).toDateString()) }}</p>
                  <p class="amount-2">{{ (item.typeId === "1" ? '-' : '+') + parseInt(item.amount).toLocaleString() }}원</p>
                  <p>{{ item.memo }}</p>
                </div>
              </div>

            </router-link>

          </div><!-- re-trans-c -->
        </div><!-- recent-transaction -->

        <!-- 월 고정지출 -->
        <div class="fixed-expense col-lg-4">
          <div class="fix-ex-c card h-100 p-4 m-2">

            <h3>{{ selectedDate.slice(6,7) }}월 고정지출</h3>

            <div class="fixed-ex-lists">
              <div class="row-card">
                <p>10일</p>
                <p>국민건강보험</p>
                <p class="amount-2">100,000원</p>
              </div>
              <div class="row-card">
                <p>22일</p>
                <p>통신요금(SKT)</p>
                <p class="amount-2">32,100원</p>
              </div>
              <div class="row-card">
                <p>27일</p>
                <p>KB국민카드</p>
                <p class="amount-2">17,100원</p>
              </div>   
            </div>

          </div><!-- fix-ex-c -->
        </div><!-- fixed-expense -->
        
      </div><!-- home-sec02 -->

    </div><!-- home-sec -->
  </div>


  </div><!-- container -->
</template> 

<style scoped>
*{
  margin: 0;
  padding: 0;

  color: rgb(84, 80, 69);
}
h3{
  margin-bottom: 0.5rem;

  color: rgb(96, 88, 76);

  font-weight: 900;
}

/* home-section */
.home-section{
  /* border: 1px solid blue; */
  margin: 0;
  background-color: rgb(255, 188, 0, 0.8);
  padding: 1rem;

  border-style: none;
  border-radius: 10px;
}

/* 날짜 */
.date{
  margin-bottom: 1rem;
  margin-left: 1rem;
  font-size: larger;
  /* font-weight: 900; */
}
.date-select{
}
.selectedDate{
  display: flex;
}
.selectedDate > p {
  font-size: larger;
  font-weight: 900;
  margin-top: 0.5rem;
  margin-right: 1.5rem;
}

/* home-sec01 (총지출, 총수입, 총순수익)*/
.home-sec01{
  /* display: flex; */
  /* gap: 1rem; */
  margin-bottom: 1rem;
}

.home-sec01 > div {}

.expense,
.income,
.net-gain{
  margin-bottom: 1.5rem;
}
.ex-c,
.in-c,
.n-g-c{
  /* flex: 1; */
  /* flex: 1 1 calc((100% - 2rem) / 3); */
  /* border: 1px solid gray; */
  padding: 1rem;

  background-color: white;
  border-radius: 10px;
  border-style: none;
  box-shadow: 0 4px 6px rgb(0, 0, 0, 0.1);
}
/* .expense:hover,
.income:hover,
.net-gain:hover{ */
.ex-c:hover,
.in-c:hover,
.n-g-c:hover{
  background-color: lightgray;
}

/* 금액 (총지출, 총소비, 총순수익)*/
.amount{
  color: black;
  font-weight: 900;
}

/* 총 지출 금액 색상 */
.red{
  color: red;
  font-weight: bold;
}
.green{
  color: green;
  font-weight: bold;
}

/* 지출 그래프 */
.expenseGraph{
  margin-top: 1rem;
}

/* 수입 그래프 */
.incomeGraph{
  margin-top: 2rem;
}
/* 순수익 그래프 */
.mixedGraph{
  margin-top: 1rem;
}

/* home-sec02 (최근거래목록, 고정지출)*/
.home-sec02{
  /* display: flex; */
  /* gap: 2rem; */
  margin-bottom: 1rem;
}

.recent-transaction,
.fixed-expense{
  margin-bottom: 1rem;
}

/* 최근 거래 목록 */
.home-sec02 > div:first-child {}

/* .recent-transaction > card{ */
.re-trans-c {
  /* flex: 2; */
  /* flex: 1 1 calc((100% - 1rem) * 2 / 3); */
  /* border: 1px solid gray; */
  padding: 1rem;

  background-color: white;
  border-radius: 10px;
  border-style: none;
  box-shadow: 0 4px 6px rgb(0, 0, 0, 0.1);
}

/* .recent-transaction > card:hover{ */
.re-trans-c:hover{
  background-color: lightgray;
}

/* 고정 지출 */
.home-sec02 > div:last-child {}

/* .fixed-expense > card{ */
.fix-ex-c{
  /* flex: 1; */
  /* flex: 1 1 calc((100% - 1rem) * 1 / 3); */
  /* border: 1px solid gray; */
  padding: 1rem;

  background-color: white;
  border-radius: 10px;
  border-style: none;
  box-shadow: 0 4px 6px rgb(0, 0, 0, 0.1);
}

.row-card{
  display: flex;
  /* justify-content: space-between; */
  gap: 1rem;
}

.amount-2{
  font-weight: 900;
}

</style>
