<script setup>
</script>

<style scoped>

</style>
<template>
  <div>

  </div>
</template>



<!-- <script setup>
import { computed } from 'vue'
import { useCalendarStore } from '@/stores/calendarStore'

const props = defineProps({
  week: {
    type: Array,
    required: 'true',
  },
  index: Number,
})

const categoryFilter = useCalendarStore()

// weekKey: props.date가 속한 ISO 주(예: "2025-W14")를 계산
const weekKey = computed(() => {
  console.log(props.week, props.index)
  const firstDate = new Date(props.week[0])
  console.log(
    'DEBUG: firstday weekKey: ',
    `${firstDate.getFullYear()}-W${getWeekNumber(firstDate)}`,
  )
  return `${firstDate.getFullYear()}-W${getWeekNumber(firstDate)}`
})

/**
 * 주간 요약 데이터 계산
 * filteredData의 각 날짜(키)는 "YYYY-MM-DD" 형식이라고 가정합니다.
 * 각 날짜의 income, expense를 해당 날짜가 속한 주(week)별로 합산합니다.
 */
const weeklySummary = computed(() => {
  const weeks = {}
  // categoryFilter.filteredData: { "2025-04-06": { income: 0, expense: 37750 }, ... }
  Object.entries(categoryFilter.filteredData).forEach(([dateKey, { income, expense }]) => {
    // dateKey는 "YYYY-MM-DD" 문자열임 → 이를 Date 객체로 변환
    const dayObj = new Date(dateKey)
    // 주 번호 계산: 예를 들어 "2025-W14"와 같이 생성
    const currentWeekKey = `${dayObj.getFullYear()}-W${getWeekNumber(dayObj)}`
    if (currentWeekKey === weekKey.value) {
      if (!weeks[weekKey.value]) {
        weeks[weekKey.value] = { income: 0, expense: 0 }
      }
      weeks[weekKey].income += Number(income) || 0
      weeks[weekKey].expense += Number(expense) || 0
    }
  })
  console.log('DEBUG weeks: ', weeks)
  return weeks
})

/**
 * getWeekNumber 함수: Date 객체를 입력받아 ISO 주 번호(1~53)를 반환
 * 참고: ISO 주 번호는 연도의 첫 주가 1월 4일(또는 그 주에 포함된 주)인 주입니다.
 */
function getWeekNumber(date) {
  // date를 UTC 기준으로 연, 월, 일만을 갖는 Date 객체 생성
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  // getUTCDay()가 0이면 일요일이므로 7로 처리 (월요일을 1로 보고 주 계산)
  const dayNum = d.getUTCDay() || 7
  // ISO week: d를 목요일을 기준으로 이동시킵니다.
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  // 연도의 첫 날 (UTC 기준)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  // 일수 차이를 주 단위로 변환
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
}
</script>

<template>
  <strong>{{ weekKey }}</strong>
  <div class="week-box">
    <div class="week-summary">
      | +{{ weeklySummary[weekKey].income.toLocaleString() }} / -{{
        weeklySummary[expense]?.expense?.toLocaleString() || 0
      }}
    </div>
  </div>
</template>

<style scoped>
.week-box {
  position: relative;
  border: 2px solid tomato;
}

.week-summary {
  position: absolute;
  font-size: 13px;
  color: rgb(84, 80, 69);
  background-color: rgba(255, 204, 0, 0.3);
  top: 10%;
}
</style> -->
