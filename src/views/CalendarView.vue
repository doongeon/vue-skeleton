<script setup>
import { Calendar } from 'v-calendar'
import 'v-calendar/style.css'
import CategoryFilter from '@/components/CategoryFilter.vue'
import DailyCell from '@/components/DailyCell.vue'
import WeekRow from '@/components/WeekRow.vue'


// 날짜 클릭 시 해당 내역 중첩 라우팅 처리
</script>

<template>
  <CategoryFilter v-slot="{ summary }"> 
  <div class="calendar-wrapper">
    <div class="calendar-outer">
      <Calendar style="height: 600px; width: 760px" is-expanded>
        <WeekRow :summary="summary"> </WeekRow>
        <template #day-content="{ day }">
          <DailyCell :date="day.date" :summary="summary[day.date.toISOString().slice(0, 10)]" />
        </template>
      </Calendar>
    </div>
  </div>
</CategoryFilter>
</template>

<style scoped>
.calendar-wrapper {
  margin-top: 5%;
}

.calendar-outer {
  display: flex;
  justify-content: center;
}

::v-deep(.vc-container) {
  height: auto !important;
}

::v-deep(.vc-weekday) {
  margin-bottom: 20px;
}
::v-deep(.vc-week) {
  position: relative;
  margin-bottom: 20px;
}

::v-deep(.vc-week::before) {
  content: '주간 요약 +120,000 / -95,000'; /* placeholder */
  position: absolute;
  top: -20px;
  left: 0;
  width: 100%;
  text-align: right;
  font-size: 13px;
  color: #444;
  background-color: rgba(255, 204, 0, 0.3);
  padding-right: 8px;
}

::v-deep(.vc-day) {
  border: 1px dashed #ccc;
  box-sizing: border-box;
  background-color: #fff;
  height: 100%;
}
</style>
