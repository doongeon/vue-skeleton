<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useTransactionCategoryStore } from '../stores/transactionCategoryStore'

// Pinia store 가져오기
const store = useTransactionCategoryStore()

// 부모 컴포넌트로 필터 정보 전달
const emit = defineEmits([
  'filter-type',
  'filter-day',
  'filter-category',
  'filter-search',
  'filter-date-order',
  'close',
])

// 상태 정의
const selectedCategories = ref([])
const selectedType = ref('all')
const selectedDay = ref(null)
const searchQuery = ref('')
const newCategory = ref({ name: '', icon: '' })
const dateOrder = ref('desc')

// 카테고리 목록은 computed로 Pinia store의 데이터 반영
const categories = computed(() => store.states.transactionCategories)

// 수입/지출/전체 필터
const setFilter = (type) => {
  selectedType.value = type
  emit('filter-type', type)
}

// 요일 필터 (두 번 클릭 시 해제)
const setDayFilter = (day) => {
  if (selectedDay.value === day) {
    selectedDay.value = null
    emit('filter-day', null)
  } else {
    selectedDay.value = day
    emit('filter-day', day)
  }
}

// 카테고리 선택/해제 (두 번 클릭 시 해제 포함)
const selectCategory = (categoryName) => {
  const idx = selectedCategories.value.indexOf(categoryName)
  const categoryObj = categories.value.find((c) => c.name === categoryName)

  if (idx === -1) {
    selectedCategories.value.push(categoryName)
    emit('filter-category', categoryObj)
  } else {
    selectedCategories.value.splice(idx, 1)
    emit('filter-category', { ...categoryObj, removed: true })
  }
}

// 카테고리 제거
const removeCategory = async (categoryName) => {
  if (confirm('삭제하시겠습니까?')) {
    await store.actions.deleteTransactionCategory(categoryName)
    selectedCategories.value = selectedCategories.value.filter((name) => name !== categoryName)
    alert('삭제되었습니다.')
  }
}

// 카테고리 추가
const addCategory = async () => {
  const name = newCategory.value.name.trim()
  const icon = newCategory.value.icon.trim()
  if (name && icon && !categories.value.some((c) => c.name === name)) {
    await store.actions.addTransactionCategory({ name, icon, accountTypeId: '1' }) // 예시로 '1' 사용
    newCategory.value = { name: '', icon: '' }
  }
}

// 검색
const handleSearch = () => {
  emit('filter-search', searchQuery.value.trim())
}

// 날짜 정렬 토글
const toggleDateOrder = () => {
  dateOrder.value = dateOrder.value === 'desc' ? 'asc' : 'desc'
  emit('filter-date-order', dateOrder.value)
}

// 외부 클릭 감지
const filterContentRef = ref(null)

const handleClickOutside = (event) => {
  if (filterContentRef.value && !filterContentRef.value.contains(event.target)) {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<template>
  <div class="filter-bar" ref="filterContentRef">
    <!-- 수입/지출 필터 -->
    <div class="type-filter">
      <button @click="setFilter('all')" :class="{ active: selectedType === 'all' }">전체</button>
      <button @click="setFilter('수입')" :class="{ active: selectedType === '수입' }">수입</button>
      <button @click="setFilter('지출')" :class="{ active: selectedType === '지출' }">지출</button>
    </div>

    <!-- 요일 필터 -->
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

    <!-- 카테고리 필터 -->
    <div class="category-chips">
      <div
        v-for="category in categories"
        :key="category.name"
        :class="['chip', { active: selectedCategories.includes(category.name) }]"
        @click="selectCategory(category.name)"
      >
        <span class="icon">{{ category.icon }}</span>
        <span class="label">{{ category.name }}</span>
        <span class="close" @click.stop="removeCategory(category.name)">×</span>
      </div>
    </div>

    <!-- 새 카테고리 추가 -->
    <div class="add-category">
      <input v-model="newCategory.name" type="text" placeholder="새 카테고리 이름" />
      <input v-model="newCategory.icon" type="text" placeholder="아이콘 (예: 🍽️)" />
      <button @click="addCategory">추가</button>
    </div>

    <!-- 검색창 + 날짜 정렬 -->
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

/* 카테고리 스타일 */
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

/* 카테고리 추가 */
.add-category {
  display: flex;
  gap: 6px;
}

/* 검색 + 정렬 */
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

/* 반응형 */
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
