<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const title = ref('')
const date = ref(new Date())
const amount = ref(0)
const content = ref('')
const type = ref('지출')
const selectedCategory = ref('')
const customCategory = ref('')

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

const transactionId = route.params.id

onMounted(async () => {
  const res = await fetch(`http://localhost:3000/transactions/${transactionId}`)
  const data = await res.json()
  title.value = data.title
  date.value = new Date(data.date)
  amount.value = data.amount
  content.value = data.content
  type.value = data.type
  selectedCategory.value = data.category
  customCategory.value = data.customCategory || '' // 추가
})

const goBack = () => {
  router.push('/history')
}

const goToEdit = () => {
  router.push(`/edit/${transactionId}`)
}

const deleteTransaction = async () => {
  if (confirm('삭제하시겠습니까?')) {
    await fetch(`http://localhost:3000/transactions/${transactionId}`, {
      method: 'DELETE',
    })
    alert('삭제되었습니다.')
    router.push('/history')
  }
}
</script>

<template>
  <div class="transaction-detail">
    <h2>거래 상세보기</h2>

    <div class="detail-form">
      <label>제목</label>
      <input v-model="title" type="text" disabled />

      <label>날짜</label>
      <input :value="date.toLocaleDateString()" disabled />

      <label>금액</label>
      <input v-model="amount" type="number" disabled />

      <label>내용</label>
      <textarea v-model="content" rows="3" disabled />

      <div class="type-toggle">
        <button :class="{ active: type === '수입' }" disabled>수입</button>
        <button :class="{ active: type === '지출' }" disabled>지출</button>
      </div>

      <div class="category-list">
        <button
          v-for="cat in categories"
          :key="cat.name"
          :class="{ selected: selectedCategory === cat.name }"
          disabled
        >
          <span class="icon">{{ cat.icon }}</span> {{ cat.name }}
        </button>
      </div>

      <div class="custom-category" v-if="customCategory">
        <label>직접 입력한 카테고리</label>
        <input :value="customCategory" disabled />
      </div>

      <div class="edit-delete-buttons">
        <button class="edit" @click="goToEdit">수정</button>
        <button class="delete" @click="deleteTransaction">삭제</button>
      </div>

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
