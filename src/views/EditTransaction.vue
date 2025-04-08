<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import CalendarPicker from '@/components/CalendarPicker.vue'

const router = useRouter()
const route = useRoute()

// 거래 수정 시 사용할 데이터
const title = ref('')
const date = ref(new Date())
const amount = ref(null)
const content = ref('')
const type = ref('지출')
const selectedCategory = ref('식비')
const customCategory = ref('')

// 카테고리 목록
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

// 거래 수정 시 해당 거래 정보 불러오기
onMounted(() => {
  const transactionId = route.params.id
  // 여기서 API나 데이터베이스에서 거래 정보를 가져오기
  if (transactionId) {
    // 예시 데이터
    const transaction = {
      title: '점심',
      date: new Date(),
      amount: 15000,
      content: '식사비',
      type: '지출',
      category: '식비',
    }

    title.value = transaction.title
    date.value = transaction.date
    amount.value = transaction.amount
    content.value = transaction.content
    type.value = transaction.type
    selectedCategory.value = transaction.category
  }
})

const addCustomCategory = () => {
  const trimmed = customCategory.value.trim()
  if (trimmed !== '') {
    const exists = categories.value.some((cat) => cat.name === trimmed)
    if (!exists) {
      categories.value.push({ name: trimmed, icon: '🆕', isCustom: true })
    }
    selectedCategory.value = trimmed
    customCategory.value = ''
  }
}

const removeCategory = (name) => {
  categories.value = categories.value.filter((cat) => cat.name !== name)
  if (selectedCategory.value === name) {
    selectedCategory.value = ''
  }
}

const submitTransaction = () => {
  const isConfirmed = confirm(
    `수정하시겠습니까?\n제목: ${title.value}\n금액: ${amount.value}\n카테고리: ${selectedCategory.value}`,
  )
  if (isConfirmed) {
    // 실제 API 호출하여 거래 수정
    alert('수정되었습니다.')
    router.push('/history')
  }
}

const cancelTransaction = () => {
  if (confirm('작성을 취소하시겠습니까?')) {
    router.push('/history')
  }
}
</script>

<template>
  <div class="transaction-detail">
    <h2>거래 수정</h2>

    <div class="detail-form">
      <label>제목</label>
      <input v-model="title" type="text" placeholder="거래 제목을 입력하세요." />

      <label>날짜</label>
      <CalendarPicker v-model="date" />

      <label>금액</label>
      <input v-model="amount" type="number" placeholder="금액을 입력하세요." />

      <label>내용</label>
      <textarea v-model="content" rows="3" placeholder="내용을 입력해주세요." />

      <div class="type-toggle">
        <button :class="{ active: type === '수입' }" @click="type = '수입'">수입</button>
        <button :class="{ active: type === '지출' }" @click="type = '지출'">지출</button>
      </div>

      <div class="category-list">
        <div
          v-for="cat in categories"
          :key="cat.name"
          class="category-item"
          :class="{ selected: selectedCategory === cat.name }"
          @click="selectedCategory = cat.name"
        >
          <span class="icon">{{ cat.icon }}</span> {{ cat.name }}
          <span v-if="cat.isCustom" class="remove-btn" @click.stop="removeCategory(cat.name)"
            >×</span
          >
        </div>
      </div>

      <div class="custom-category">
        <label>카테고리 직접 입력</label>
        <input
          v-model="customCategory"
          type="text"
          placeholder="예: 건강, 교육 등"
          @keyup.enter="addCustomCategory"
        />
      </div>

      <div class="edit-delete-buttons">
        <button class="edit" @click="submitTransaction">수정</button>
        <button class="delete" @click="cancelTransaction">취소</button>
      </div>

      <div class="back-button-wrapper">
        <button class="back" @click="cancelTransaction">목록으로</button>
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

input::placeholder,
textarea::placeholder {
  color: #aaa;
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

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  cursor: pointer;
  position: relative;
}

.category-item.selected {
  background-color: #444;
  color: white;
}

.icon {
  margin-right: 4px;
}

.remove-btn {
  font-weight: normal;
  color: white;
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 14px;
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
