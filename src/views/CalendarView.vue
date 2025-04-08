<script setup>
import { Calendar } from 'v-calendar'
import 'v-calendar/style.css'
import { computed, ref } from 'vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import DailyCell from '@/components/DailyCell.vue'
import { TRANSACTION_CATEGORY } from '@/types'

const CategoryList = computed(() => Object.keys(TRANSACTION_CATEGORY))

const selectedCategory = ref('')

const filterData = (category) => {
  selectedCategory.value = category
}

// 날짜 클릭 시 해당 내역 중첩 라우팅 처리
</script>

<template>
  <CategoryFilter :categories="CategoryList" @selected-category="filterData" />
  <div class="calendar-wrapper">
    <div class="calendar-outer">
      <Calendar style="height: 600px; width: 760px" is-expanded>
        <template #day-content="{ day }">
          <DailyCell :date="day.date" :selectedCategory="selectedCategory" />
        </template>
        <!-- <template #week="{ week }">
          <div class="vc-week">
            <div class="week-summary">
              {{ getWeeklySummaryText(week) }}
            </div>
            <div class="vc-days">
              <template v-for="day in week.days" :key="day.date">
                <DailyCell :date="day.date" :selectedCategory="selectedCategory" />
              </template>
            </div>
          </div>
        </template> -->
      </Calendar>
    </div>
  </div>
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
