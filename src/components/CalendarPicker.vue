<script setup>
import { ref, watch, computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// props & emit
const props = defineProps({
  modelValue: {
    type: Date,
    required: false,
  },
})
const emit = defineEmits(['update:modelValue'])

// 상태
const date = ref(props.modelValue || new Date())
const showCalendar = ref(false)

// 날짜 포맷
const formattedDate = computed(() => {
  if (!date.value) return ''
  const yyyy = date.value.getFullYear()
  const mm = String(date.value.getMonth() + 1).padStart(2, '0')
  const dd = String(date.value.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

// modelValue 변경 감지
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) date.value = newVal
  },
)

// 날짜 선택 시 처리
const updateValue = (newDate) => {
  emit('update:modelValue', newDate)
  showCalendar.value = false
}

// 달력 열기/닫기
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}
</script>

<template>
  <div class="calendar-wrapper">
    <input
      type="text"
      :value="formattedDate"
      readonly
      aria-label="선택된 날짜"
      placeholder="연도 - 월 - 일"
      class="date-input"
    />
    <div class="calendar-button-wrapper">
      <button class="calendar-icon-button" @click="toggleCalendar" aria-label="달력 열기">
        📅
      </button>
      <div v-if="showCalendar" class="calendar-popup">
        <VueDatePicker
          v-model="date"
          :format="'yyyy-MM-dd'"
          :week-start="0"
          @update:model-value="updateValue"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
}

.date-input {
  width: 200px;
  padding: 10px;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

.calendar-button-wrapper {
  position: relative;
}

.calendar-icon-button {
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  font-size: 24px;
}

.calendar-popup {
  position: absolute;
  top: 0;
  left: 44px;
  z-index: 10;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

/* 요일을 Sun, Mon 등 3글자로 보기 좋게 조정 */
.dp__calendar_header span {
  min-width: 38px !important;
  font-size: 14px;
  display: inline-block;
  text-align: center;
}
</style>
