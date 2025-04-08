<script setup>
import { ref, watch, computed } from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

// 부모 컴포넌트로부터 받는 props 및 이벤트 정의
const props = defineProps({
  modelValue: {
    type: Date,
    required: false,
  },
})
const emit = defineEmits(['update:modelValue'])

// 상태 변수 정의
const date = ref(props.modelValue || new Date()) // 선택된 날짜
const showCalendar = ref(false) // 달력 표시 여부

// 날짜를 "yyyy-MM-dd" 형식으로 포맷
const formattedDate = computed(() => {
  if (!date.value) return ''
  const yyyy = date.value.getFullYear()
  const mm = String(date.value.getMonth() + 1).padStart(2, '0')
  const dd = String(date.value.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

// 외부에서 modelValue가 변경되었을 때 감지
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) date.value = newVal
  },
)

// 사용자가 날짜를 선택했을 때 처리
const updateValue = (newDate) => {
  emit('update:modelValue', newDate) // 부모 컴포넌트로 변경된 날짜 전달
  showCalendar.value = false // 달력 닫기
}

// 달력 열기/닫기 토글
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}
</script>

<template>
  <div class="calendar-wrapper">
    <!-- 선택된 날짜 표시용 입력창 -->
    <input
      type="text"
      :value="formattedDate"
      readonly
      placeholder="연도 - 월 - 일"
      class="date-input"
    />
    <div class="calendar-button-wrapper">
      <!-- 달력 아이콘 버튼 -->
      <button class="calendar-icon-button" @click="toggleCalendar" aria-label="달력 열기">
        📅
      </button>
      <!-- 달력 팝업 -->
      <div v-if="showCalendar" class="calendar-popup">
        <VueDatePicker v-model="date" :format="'yyyy-MM-dd'" @update:model-value="updateValue" />
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
  left: 44px; /* 아이콘 오른쪽에 표시 */
  z-index: 10;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
