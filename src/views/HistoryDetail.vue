<script setup>
import { ref, watch } from 'vue'
import CalendarPicker from '@/components/CalendarPicker.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const title = ref('커피')
const date = ref(new Date())
const amount = ref(4500)
const content = ref('카페에서 커피를 마셨어요.')
const type = ref('지출')
const selectedCategory = ref('식비')
const customCategory = ref('') // 사용자 직접 입력 카테고리

const categories = [
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
]

watch(customCategory, (val) => {
  if (val.trim() !== '') {
    selectedCategory.value = val.trim()
  }
})

const updateTransaction = () => {
  alert(
    `수정되었습니다.\n제목: ${title.value}\n금액: ${amount.value}\n카테고리: ${selectedCategory.value}`,
  )
}

const deleteTransaction = () => {
  if (confirm('삭제하시겠습니까?')) {
    alert('삭제되었습니다.')
  }
}

const goBack = () => {
  router.push('/history')
}
</script>

<template>
  <div class="transaction-detail">
    <h2>거래 상세보기</h2>

    <div class="detail-form">
      <label>제목</label>
      <input v-model="title" type="text" />

      <label>날짜</label>
      <CalendarPicker v-model="date" />

      <label>금액</label>
      <input v-model="amount" type="number" />

      <label>내용</label>
      <textarea v-model="content" rows="3" />

      <div class="type-toggle">
        <button :class="{ active: type === '수입' }" @click="type = '수입'">수입</button>
        <button :class="{ active: type === '지출' }" @click="type = '지출'">지출</button>
      </div>

      <div class="category-list">
        <button
          v-for="cat in categories"
          :key="cat.name"
          :class="{ selected: selectedCategory === cat.name }"
          @click="selectedCategory = cat.name"
        >
          <span class="icon">{{ cat.icon }}</span> {{ cat.name }}
        </button>
      </div>

      <div class="custom-category">
        <label>카테고리 직접 입력</label>
        <input v-model="customCategory" type="text" placeholder="예: 건강, 교육 등" />
      </div>

      <!-- 수정/삭제 버튼 -->
      <div class="edit-delete-buttons">
        <button class="edit" @click="updateTransaction">수정</button>
        <button class="delete" @click="deleteTransaction">삭제</button>
      </div>

      <!-- 목록으로 버튼 -->
      <div class="back-button-wrapper">
        <button class="back" @click="goBack">목록으로</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.transaction-detail {
  padding: 32px;
  max-width: 700px;
  margin: auto;
}

h2 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 24px;
  text-align: center;
}

.detail-form label {
  display: block;
  font-weight: bold;
  margin-top: 16px;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-sizing: border-box;
}

.type-toggle {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
}

.type-toggle button {
  padding: 8px 20px;
  border-radius: 10px;
  border: none;
  background-color: #eee;
  cursor: pointer;
  font-weight: bold;
}
.type-toggle .active {
  background-color: #333;
  color: white;
}

.category-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
  margin-top: 16px;
}

.category-list button {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  cursor: pointer;
}
.category-list .selected {
  background-color: #444;
  color: white;
}

.icon {
  margin-right: 4px;
}

.custom-category {
  margin-top: 16px;
}

.edit-delete-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
}

.back-button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.edit-delete-buttons button,
.back-button-wrapper .back {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.edit {
  background-color: #4caf50;
  color: white;
}

.delete {
  background-color: #f44336;
  color: white;
}

.back {
  background-color: #9e9e9e;
  color: white;
}
</style>
