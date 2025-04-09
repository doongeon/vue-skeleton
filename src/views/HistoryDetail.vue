<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTransactionCategoryStore } from '../stores/transactionCategoryStore'

const route = useRoute()
const router = useRouter()

const title = ref('')
const amount = ref(0)
const content = ref('')
const date = ref('')
const type = ref('')
const selectedCategory = ref('')
const transactionId = ref('')

// Pinia store 사용
const transactionCategoryStore = useTransactionCategoryStore()

// 카테고리 리스트는 store에서 가져오기
const categories = computed(() => transactionCategoryStore.states.transactionCategories)

// 거래 데이터 불러오기
onMounted(async () => {
  transactionId.value = route.params.id
  const res = await fetch(`http://localhost:3000/transactions/${transactionId.value}`)
  const data = await res.json()

  title.value = data.memo || ''
  amount.value = data.amount || 0
  content.value = data.memo || ''
  date.value = data.date.slice(0, 10)
  type.value = data.typeId === 1 || data.typeId === '1' ? '수입' : '지출'

  // 카테고리 찾아서 선택
  const category = categories.value.find((cat) => cat.id === String(data.categoryId))
  selectedCategory.value = category ? category.name : ''
})

// 거래 수정
const updateTransaction = async () => {
  const updatedData = {
    id: transactionId.value,
    userId: '1',
    typeId: type.value === '수입' ? 1 : 2,
    categoryId: categories.value.find((cat) => cat.name === selectedCategory.value)?.id || '',
    amount: amount.value,
    memo: content.value,
    date: new Date(date.value).toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await fetch(`http://localhost:3000/transactions/${transactionId.value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  })

  alert('수정 완료!')
}

// 거래 삭제
const deleteTransaction = async () => {
  const confirmed = confirm('삭제하시겠습니까?')
  if (!confirmed) return

  await fetch(`http://localhost:3000/transactions/${transactionId.value}`, {
    method: 'DELETE',
  })

  alert('삭제 완료!')
  router.push('/history')
}

// 목록으로 이동
const goBack = () => {
  router.push('/history')
}
</script>

<template>
  <div class="transaction-detail">
    <h2>상세 내용</h2>
    <div class="detail-form">
      <label>제목</label>
      <input type="text" v-model="title" />

      <label>날짜</label>
      <input type="date" v-model="date" />

      <label>금액</label>
      <input type="number" v-model="amount" />

      <label>내용</label>
      <textarea v-model="content" rows="3" />

      <label>유형</label>
      <div class="type-toggle">
        <button :class="{ active: type === '수입' }" @click="type = '수입'">수입</button>
        <button :class="{ active: type === '지출' }" @click="type = '지출'">지출</button>
      </div>

      <label>카테고리</label>
      <div class="category-list">
        <button
          v-for="cat in categories"
          :key="cat.id"
          :class="{ selected: selectedCategory === cat.name }"
          @click="selectedCategory = cat.name"
        >
          <span class="icon">{{ cat.icon }}</span>
          {{ cat.name }}
        </button>
      </div>

      <div class="edit-delete-buttons">
        <button class="edit" @click="updateTransaction">수정</button>
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
  flex-wrap: wrap;
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
  background-color: #545045;
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
  text-align: center;
}
.category-list .selected {
  background-color: #545045;
  color: white;
}

.icon {
  margin-right: 4px;
}

.edit-delete-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 24px;
  flex-wrap: wrap;
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
  background-color: #ffcc00;
  color: black;
}

.delete {
  background-color: #60584c;
  color: white;
}

.back {
  background-color: #9e9e9e;
  color: white;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .transaction-detail {
    padding: 20px;
  }

  h2 {
    font-size: 22px;
  }

  .type-toggle button {
    flex: 1 1 45%;
  }

  .edit-delete-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .back-button-wrapper {
    justify-content: center;
    margin-top: 20px;
  }

  .edit-delete-buttons button,
  .back-button-wrapper .back {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .category-list {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }

  .icon {
    display: block;
    margin-bottom: 4px;
  }
}
</style>
