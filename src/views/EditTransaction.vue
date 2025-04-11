<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTransactionCategoryStore } from '@/stores/transactionCategoryStore'
import CalendarPicker from '@/components/CalendarPicker.vue'

const router = useRouter()
const route = useRoute()

// 스토어
const transactionCategoryStore = useTransactionCategoryStore()
const transactionCategories = computed(() => transactionCategoryStore.states.transactionCategories)

const title = ref('')
const date = ref(new Date())
const amount = ref(null)
const content = ref('')
const type = ref('지출')
const selectedCategory = ref('식비')
const customCategory = ref('')

// 거래 정보 불러오기
onMounted(async () => {
  if (transactionCategories.value.length === 0) {
    transactionCategoryStore.initStore?.()
  }

  const transactionId = route.params.id
  if (transactionId) {
    const res = await fetch(`http://localhost:3000/transactions/${transactionId}`)
    const transaction = await res.json()

    title.value = transaction.memo
    date.value = new Date(transaction.date)
    amount.value = transaction.amount
    content.value = transaction.memo
    type.value = transaction.typeId === '2' ? '수입' : '지출'

    const matchedCategory = transactionCategories.value.find(
      (cat) => cat.name === getCategoryNameById(transaction.categoryId),
    )
    selectedCategory.value = matchedCategory ? matchedCategory.name : ''
  }
})

// id ↔ name 변환
const getCategoryNameById = (id) => {
  const map = {
    1: '식비',
    2: '교통',
    3: '문화/여가',
    4: '술/유흥',
    5: '쇼핑',
    6: '여행/숙박',
    7: '월급',
    8: '용돈',
    9: '보너스',
    10: '매매',
    11: '이자',
  }
  return map[id]
}

const getCategoryIdByName = (name) => {
  const map = {
    식비: '1',
    교통: '2',
    '문화/여가': '3',
    '술/유흥': '4',
    쇼핑: '5',
    '여행/숙박': '6',
    월급: '7',
    용돈: '8',
    보너스: '9',
    매매: '10',
    이자: '11',
  }
  return map[name] || '1'
}

// 사용자 입력 카테고리 추가
const addCustomCategory = () => {
  const trimmed = customCategory.value.trim()
  if (trimmed !== '') {
    const exists = transactionCategories.value.some((cat) => cat.name === trimmed)
    if (!exists) {
      transactionCategoryStore.addCategory({ name: trimmed, icon: '🆕', isCustom: true })
    }
    selectedCategory.value = trimmed
    customCategory.value = ''
  }
}

// 사용자 입력 카테고리 제거
const removeCategory = (name) => {
  transactionCategoryStore.removeCategory(name)
  if (selectedCategory.value === name) {
    selectedCategory.value = ''
  }
}

// 거래 수정
const submitTransaction = async () => {
  const isConfirmed = confirm(
    `수정하시겠습니까?\n제목: ${title.value}\n금액: ${amount.value}\n카테고리: ${selectedCategory.value}`,
  )
  if (isConfirmed) {
    const transactionId = route.params.id
    await fetch(`http://localhost:3000/transactions/${transactionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: transactionId,
        userId: '1',
        typeId: type.value === '수입' ? '2' : '1',
        categoryId: getCategoryIdByName(selectedCategory.value),
        amount: amount.value,
        memo: content.value,
        date: date.value.toISOString(),
        updatedAt: new Date().toISOString(),
      }),
    })
    alert('수정되었습니다.')
    router.push('/main/history')
  }
}

// 거래 취소 함수
const cancelTransaction = () => {
  // 입력된 내용이 없으면 바로 목록으로 이동
  if (!title.value && !amount.value && !content.value && !customCategory.value) {
    router.push('/main/history')
    return
  }

  // 입력된 내용이 있으면 취소 확인 메시지 후 목록으로 이동
  const isConfirmed = confirm('작성을 취소하시겠습니까?')
  if (isConfirmed) {
    router.push('/main/history')
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
          v-for="cat in transactionCategories"
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
        <button class="back" @click="router.push('/main/history')">목록으로</button>
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

.category-item {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  cursor: pointer;
  text-align: center;
}
.category-item.selected {
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
  background-color: rgb(255, 204, 0);
  color: black;
}

.delete {
  background-color: rgb(96, 88, 76);
  color: white;
}

.back {
  background-color: #9e9e9e;
  color: white;
}

/* 반응형 */
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
