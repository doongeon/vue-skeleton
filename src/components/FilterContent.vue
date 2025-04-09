<script setup>
import { ref } from 'vue'

const emit = defineEmits(['filter-type', 'filter-day', 'filter-category', 'filter-search'])

const categories = ref([
  { name: '식비', icon: '🍽️' },
  { name: '교통', icon: '🚗' },
  { name: '문화/여가', icon: '🎮' },
  { name: '술/유흥', icon: '🍺' },
  { name: '쇼핑', icon: '🛍️' },
  { name: '여행/숙박', icon: '🏨' },
  { name: '월급', icon: '💼' },
  { name: '용돈', icon: '💸' },
  { name: '보너스', icon: '🎁' },
  { name: '매매', icon: '📈' },
  { name: '이자', icon: '💰' },
])

const searchQuery = ref('')
const newCategory = ref({ name: '', icon: '' })

const setFilter = (type) => emit('filter-type', type)
const setDayFilter = (day) => emit('filter-day', day)
const setCategoryFilter = (category) => emit('filter-category', category)
const setSearchQuery = () => emit('filter-search', searchQuery.value)

const addCategory = () => {
  const trimmedName = newCategory.value.name.trim()
  const trimmedIcon = newCategory.value.icon.trim()

  if (trimmedName && trimmedIcon && !categories.value.some((cat) => cat.name === trimmedName)) {
    categories.value.push({ name: trimmedName, icon: trimmedIcon })
    newCategory.value = { name: '', icon: '' }
  }
}

const deleteCategory = (category) => {
  if (confirm(`"${category.name}" 카테고리를 삭제할까요?`)) {
    categories.value = categories.value.filter((c) => c.name !== category.name)
  }
}
</script>

<template>
  <div class="filter-bar">
    <!-- 수입/지출 버튼 -->
    <div class="type-filter">
      <button @click="setFilter('all')">전체</button>
      <button @click="setFilter('수입')">수입</button>
      <button @click="setFilter('지출')">지출</button>
    </div>

    <!-- 요일 필터 버튼 -->
    <div class="day-filter">
      <button @click="setDayFilter(1)">월</button>
      <button @click="setDayFilter(2)">화</button>
      <button @click="setDayFilter(3)">수</button>
      <button @click="setDayFilter(4)">목</button>
      <button @click="setDayFilter(5)">금</button>
      <button @click="setDayFilter(6)">토</button>
      <button @click="setDayFilter(0)">일</button>
    </div>

    <!-- 카테고리 필터 버튼 + 삭제 -->
    <div class="category-filter">
      <div v-for="category in categories" :key="category.name" class="category-chip">
        <button @click="setCategoryFilter(category)">
          <span>{{ category.icon }}</span> {{ category.name }}
        </button>
        <span class="delete-btn" @click="deleteCategory(category)">&times;</span>
      </div>
    </div>

    <!-- 카테고리 추가 -->
    <div class="add-category">
      <input v-model="newCategory.name" type="text" placeholder="새 카테고리 이름" />
      <input v-model="newCategory.icon" type="text" placeholder="아이콘 입력 (예: 🍽️)" />
      <button @click="addCategory">추가</button>
    </div>

    <!-- 검색창 -->
    <div class="search-filter">
      <input type="text" v-model="searchQuery" placeholder="검색..." @input="setSearchQuery" />
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

input {
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.add-category {
  display: flex;
  gap: 6px;
}

/* 카테고리 버튼 + 삭제 버튼 스타일 */
.category-chip {
  display: inline-flex;
  align-items: center;
  margin: 5px;
  background-color: #f5f5f5;
  border-radius: 20px;
  padding: 4px 8px;
}

.category-chip button {
  background: none;
  padding: 4px 8px;
  border: none;
  cursor: pointer;
}

.delete-btn {
  margin-left: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  font-weight: normal;
  line-height: 1;
}
</style>
