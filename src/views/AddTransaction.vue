<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTransactionCategoryStore } from '@/stores/transactionCategoryStore'
import { useTransactionStore } from '@/stores/transactionStore'
import CalendarPicker from '@/components/CalendarPicker.vue'

// 스토어 연결
const transactionCategoryStore = useTransactionCategoryStore()
const transactionStore = useTransactionStore()

// 구조분해
const { transactionCategories } = transactionCategoryStore.states
const { addTransactionCategory, deleteTransactionCategory } = transactionCategoryStore.actions

const router = useRouter()

const title = ref('')
const date = ref(new Date())
const amount = ref(null)
const content = ref('')
const type = ref('지출')
const customCategory = ref('')
const selectedCategory = ref('')

// 카테고리 목록
const categories = computed(() => transactionCategories)

// 카테고리 선택
const selectCategory = (category) => {
  selectedCategory.value = category.name
}

// 커스텀 카테고리 추가
const addCustomCategory = () => {
  const trimmed = customCategory.value.trim()
  if (trimmed !== '') {
    const exists = categories.value.some((cat) => cat.name === trimmed)
    if (!exists) {
      addTransactionCategory({
        name: trimmed,
        icon: '🆕',
        accountTypeId: '1',
        isCustom: true,
        id: Date.now(), // 고유 ID
      })
    }
    selectedCategory.value = trimmed
    customCategory.value = ''
  }
}

// 카테고리 삭제
const removeCategory = (name) => {
  deleteTransactionCategory(name)
  if (selectedCategory.value === name) {
    selectedCategory.value = ''
  }
}

// 거래 등록
const submitTransaction = async () => {
  const isConfirmed = confirm(
    `등록하시겠습니까?\n제목: ${title.value}\n금액: ${amount.value}\n카테고리: ${selectedCategory.value}`,
  )

  if (isConfirmed) {
    const newTransaction = {
      title: title.value,
      date: date.value.toISOString().split('T')[0], // YYYY-MM-DD
      amount: Number(amount.value),
      content: content.value,
      type: type.value,
      category: selectedCategory.value,
    }

    await transactionStore.addTransaction(newTransaction)

    alert('등록되었습니다.')
    router.push('/history')
  }
}

// 거래 취소
const cancelTransaction = () => {
  if (!title.value && !amount.value && !content.value && !customCategory.value) {
    router.push('/history')
    return
  }

  const isConfirmed = confirm('작성을 취소하시겠습니까?')
  if (isConfirmed) {
    router.push('/history')
  }
}
</script>

<template>
  <div class="transaction-detail">
    <h2>거래 등록</h2>

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
          :key="cat.id"
          class="category-item"
          :class="{ selected: selectedCategory === cat.name }"
          @click="selectCategory(cat)"
        >
          <span class="icon">{{ cat.icon }}</span>
          <span class="name">{{ cat.name }}</span>

          <!-- 커스텀 카테고리일 경우에만 삭제 버튼 표시 -->
          <span v-if="cat.isCustom" class="remove-btn" @click.stop="removeCategory(cat.name)"
            >×</span
          >
        </div>
      </div>

      <div class="custom-category">
        <label>카테고리 직접 입력</label>
        <div style="display: flex; gap: 10px">
          <input
            v-model="customCategory"
            type="text"
            placeholder="예: 건강, 교육 등"
            @keydown.enter.prevent="addCustomCategory"
          />
        </div>
      </div>

      <div class="edit-delete-buttons">
        <button class="edit" @click="submitTransaction">등록</button>
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background-color: #fafafa;
  cursor: pointer;
  position: relative;
  text-align: center;
  font-weight: bold;
}

.category-item.selected {
  background-color: #545045;
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
  background-color: #ffcc00;
  color: white;
}

.delete {
  background-color: #60584c;
  color: white;
}

/* ✅ 태블릿 대응 */
@media (max-width: 900px) {
  .transaction-detail {
    padding: 24px;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 22px;
  }

  .type-toggle button {
    font-size: 15px;
    padding: 10px 18px;
  }

  .category-list {
    grid-template-columns: repeat(3, 1fr);
  }

  .edit-delete-buttons button,
  .back-button-wrapper .back {
    font-size: 15px;
  }

  input,
  textarea {
    font-size: 15px;
  }
}

/* ✅ 모바일 대응 */
@media (max-width: 600px) {
  .transaction-detail {
    padding: 16px;
  }

  h2 {
    font-size: 22px;
    margin-bottom: 20px;
  }

  .type-toggle {
    flex-direction: column;
    align-items: center;
  }

  .type-toggle button {
    width: 100%;
    font-size: 14px;
    padding: 10px;
  }

  .category-list {
    grid-template-columns: repeat(2, 1fr);
  }

  .edit-delete-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .edit-delete-buttons button,
  .back-button-wrapper .back {
    width: 100%;
    font-size: 16px;
  }

  .back-button-wrapper {
    justify-content: center;
  }

  input,
  textarea {
    font-size: 16px;
  }
}
</style>
