<script setup>
import { Calendar } from 'v-calendar'
import 'v-calendar/style.css'
import CategoryFilter from '@/components/CategoryFilter.vue'
import DayCell from '@/components/DayCell.vue'
import WeekRow from '@/components/WeekRow.vue'

// 날짜 클릭 시 해당 내역 중첩 라우팅 처리
</script>

<template>
  <CategoryFilter>
    <div class="calendar-wrapper">
      <div class="calendar-outer">
        <Calendar style="height: 600px; width: 760px" is-expanded trim-weeks>
          <!-- <template #week="{ week, weekIndex }"> -->
          <!-- <div class="week-box"> -->
          <!-- <WeekRow :week="week" :index="weekIndex" /> -->
          <!-- </div> -->
          <!-- </template> -->
          <template #day-content="{ day }">
            <DayCell :date="day.date" class="day-cell" />
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
  /* content: '주간 요약 +120,000 / -95,000'; */
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

.week-box {
  position: absolute;
  top: -30px;
  left: 0;
  width: 100%;
  text-align: center;
  font-weight: bold;
  color: #333;
  border: palegreen solid 2px;
}

::v-deep(.vc-day) {
  border: 0.5px dashed #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  background-color: #fff;
  height: 100%;
  transition: 0.2s;
}

::v-deep(.vc-day):hover {
  background-color: #ccc;
  cursor: pointer;
}
.day-cell {
  height: 70px;
}
</style>
