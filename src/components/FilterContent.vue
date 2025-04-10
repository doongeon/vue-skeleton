<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useTransactionCategoryStore } from '../stores/transactionCategoryStore'

// 카테고리 스토어 사용
const store = useTransactionCategoryStore()

// 부모 컴포넌트로 emit할 이벤트 정의
const emit = defineEmits([
  'filter-type', // 수입/지출/전체 필터
  'filter-day', // 요일 필터
  'filter-category', // 카테고리 필터
  'filter-search', // 검색어 필터
  'filter-date-order', // 정렬 기준 (최신순/오래된순)
  'close', // 외부 클릭 시 필터 창 닫기
])

// 상태 정의
const selectedCategoryIds = ref([]) // 선택된 카테고리 id 리스트
const selectedType = ref('all') // 선택된 타입 (all, 수입, 지출)
const selectedDay = ref(null) // 선택된 요일 (1~7, 일요일은 0)
const searchQuery = ref('') // 검색어
const newCategory = ref({ name: '', icon: '' }) // 새 카테고리 입력값
const dateOrder = ref('desc') // 정렬순서 (desc: 최신순, asc: 오래된순)

// 카테고리 목록 가져오기
const categories = computed(() => store.states.transactionCategories)

// 수입/지출/전체 필터 설정
const setFilter = (type) => {
  selectedType.value = type
  emit('filter-type', type)
}

// 요일 필터 설정 (같은 요일 누르면 해제)
const setDayFilter = (day) => {
  if (selectedDay.value === day) {
    selectedDay.value = null
    emit('filter-day', null)
  } else {
    selectedDay.value = day
    emit('filter-day', day)
  }
}

// 카테고리 선택/해제
const selectCategory = (categoryId) => {
  const idx = selectedCategoryIds.value.indexOf(categoryId)
  const categoryObj = categories.value.find((c) => c.id === categoryId)

  if (idx === -1) {
    selectedCategoryIds.value.push(categoryId)
    emit('filter-category', categoryObj) // 선택됨
  } else {
    selectedCategoryIds.value.splice(idx, 1)
    emit('filter-category', { ...categoryObj, removed: true }) // 해제됨
  }
}

// 카테고리 삭제 (스토어에서 제거 + 선택에서도 제거)
const removeCategory = async (categoryId) => {
  const category = categories.value.find((c) => c.id === categoryId)
  if (!category) return

  if (confirm('삭제하시겠습니까?')) {
    await store.actions.deleteTransactionCategory(categoryId)
    selectedCategoryIds.value = selectedCategoryIds.value.filter((id) => id !== categoryId)
    alert('삭제되었습니다.')
  }
}

// 새 카테고리 추가
const addCategory = async () => {
  const name = newCategory.value.name.trim()
  const icon = newCategory.value.icon.trim()
  if (name && icon && !categories.value.some((c) => c.name === name)) {
    await store.actions.addTransactionCategory({ name, icon, accountTypeId: '1' }) // accountTypeId는 임시로 '1'
    newCategory.value = { name: '', icon: '' }
  }
}

// 검색 실행
const handleSearch = () => {
  emit('filter-search', searchQuery.value.trim())
}

// 날짜 정렬 토글
const toggleDateOrder = () => {
  dateOrder.value = dateOrder.value === 'desc' ? 'asc' : 'desc'
  emit('filter-date-order', dateOrder.value)
}

// 외부 클릭 감지를 위한 ref
const filterContentRef = ref(null)

// 외부 클릭 시 닫기 이벤트
const handleClickOutside = (event) => {
  if (filterContentRef.value && !filterContentRef.value.contains(event.target)) {
    emit('close')
  }
}

// 컴포넌트 마운트 시 이벤트 등록
onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

// 컴포넌트 언마운트 시 이벤트 제거
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="filter-bar" ref="filterContentRef">
    <div class="type-filter">
      <button @click="setFilter('all')" :class="{ active: selectedType === 'all' }">전체</button>
      <button @click="setFilter('수입')" :class="{ active: selectedType === '수입' }">수입</button>
      <button @click="setFilter('지출')" :class="{ active: selectedType === '지출' }">지출</button>
    </div>

    <div class="day-filter">
      <button
        v-for="(day, idx) in ['월', '화', '수', '목', '금', '토', '일']"
        :key="idx"
        @click="setDayFilter(idx === 6 ? 0 : idx + 1)"
        :class="{ active: selectedDay === (idx === 6 ? 0 : idx + 1) }"
      >
        {{ day }}
      </button>
    </div>

    <div class="category-chips">
      <div
        v-for="category in categories"
        :key="category.id"
        :class="['chip', { active: selectedCategoryIds.includes(category.id) }]"
        @click="selectCategory(category.id)"
      >
        <span class="icon">{{ category.icon }}</span>
        <span class="label">{{ category.name }}</span>
        <span class="close" @click.stop="removeCategory(category.id)">×</span>
      </div>
    </div>

    <div class="add-category">
      <input v-model="newCategory.name" type="text" placeholder="새 카테고리 이름" />
      <input v-model="newCategory.icon" type="text" placeholder="아이콘 (예: 🍽️)" />
      <button @click="addCategory">추가</button>
    </div>

    <div class="bottom-bar">
      <div class="search-bar">
        <input v-model="searchQuery" @keydown.enter="handleSearch" placeholder="내용 검색" />
        <button class="search-icon" @click="handleSearch">🔍</button>
      </div>
      <div class="date-order">
        <button @click="toggleDateOrder">
          {{ dateOrder === 'desc' ? '최신순 ↓' : '오래된순 ↑' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 스타일은 그대로 유지됨 */
.filter-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 10px;
}

button {
  margin: 5px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #ccc;
}

button.active {
  background-color: #ffcc00;
  color: black;
}

input {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.category-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.chip {
  display: flex;
  align-items: center;
  background-color: #f2f2f2;
  padding: 6px 12px;
  border-radius: 9999px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.chip.active {
  background-color: #ffcc00;
}

.icon {
  margin-right: 6px;
}

.close {
  margin-left: 8px;
  font-weight: bold;
  cursor: pointer;
}

.add-category {
  display: flex;
  gap: 6px;
}

.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 10px;
}

.search-bar {
  display: flex;
  align-items: center;
}

.search-bar input {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 20px;
  border: 1px solid #ccc;
  width: 200px;
}

.search-icon {
  background: transparent;
  border: none;
  font-size: 18px;
  margin-left: 8px;
  cursor: pointer;
}

.date-order button {
  padding: 6px 12px;
  border-radius: 4px;
  background-color: #ddd;
  cursor: pointer;
  transition: background-color 0.2s;
}

.date-order button:hover {
  background-color: #bbb;
}

@media (max-width: 768px) {
  .filter-bar {
    align-items: stretch;
  }

  .type-filter,
  .day-filter,
  .category-chips,
  .add-category {
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .add-category {
    flex-direction: column;
    gap: 8px;
  }

  input {
    width: 100%;
  }

  .chip {
    justify-content: space-between;
    width: 100%;
  }

  .label {
    flex-grow: 1;
    text-align: left;
  }

  .close {
    margin-left: auto;
    padding-left: 8px;
  }

  .bottom-bar {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .search-bar {
    justify-content: center;
    width: 100%;
  }

  .date-order {
    justify-content: center;
    width: 100%;
  }
}
</style>
