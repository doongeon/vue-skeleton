<script setup>
import { ref, onMounted } from 'vue'
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
const categories = transactionCategoryStore.states.transactionCategories

// 거래 데이터 불러오기
onMounted(async () => {
  transactionId.value = route.params.id
  const res = await fetch(`http://localhost:3000/transactions/${transactionId.value}`)
  const data = await res.json()

  title.value = data.memo || ''
  amount.value = data.amount || 0
  content.value = data.memo || ''
  date.value = data.date.slice(0, 10)
  type.value = data.typeId === 1 || data.typeId === '1' ? '지출' : '수입'

  // 카테고리 찾아서 선택
  const category = categories.find((cat) => cat.id === String(data.categoryId))
  selectedCategory.value = category ? category.name : ''
})

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
      <p>{{ title }}</p>

      <label>날짜</label>
      <p>{{ date }}</p>

      <label>금액</label>
      <p>{{ amount }}</p>

      <label>내용</label>
      <p>{{ content }}</p>

      <label>유형</label>
      <p>{{ type }}</p>

      <label>카테고리</label>
      <p>{{ selectedCategory }}</p>

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

p {
  margin-top: 6px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fafafa;
  font-weight: 500;
}

.back-button-wrapper {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

.back {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  cursor: pointer;
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

  .back-button-wrapper {
    margin-top: 20px;
  }

  .back {
    width: 100%;
  }
}
</style>
