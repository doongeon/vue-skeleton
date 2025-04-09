<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useTransactionStore } from '@/stores/transactionStore'

const categoryList = ref([])
onMounted(async () => {
  const response = await axios.get('http://localhost:3000/transactionCategory')
  categoryList.value = response.data
})
// 현재 존재하는 categoryId의 list

const isFormVisible = ref(false) // 폼 표시 여부 상태
const date = ref('')
const typeId = ref('')
const categoryId = ref('')
const amount = ref('')
const memo = ref('')
// Pinia Store
const transactionStore = useTransactionStore()
// 제출 및 유효성검사
const submit = async () => {
  if (!date.value) {
    alert('유효한 날짜를 선택하세요')
    return
  } else if (typeId.value !== '1' && typeId.value !== '2') {
    alert('유효한 구별을 선택하세요')
    return
  } else if (!categoryList.value.find((item) => String(item.id) === String(categoryId.value))) {
    alert('유효한 카테고리를 선택하세요')
    return
  } else if (isNaN(amount.value) || amount.value <= 0) {
    alert('0보다 큰 금액을 입력하세요')
    return
  } else if (!memo.value) {
    alert('유효한 메모를 입력하세요')
    return
  }
  const newHistory = {
    typeId: String(typeId.value),
    categoryId: String(categoryId.value),
    amount: parseInt(amount.value),
    memo: memo.value,
    date: new Date(date.value).toISOString(),
  }
  try {
    await transactionStore.actions.addTransaction(newHistory)
    alert('거래내역이 추가되었습니다.')
    // 초기화
    typeId.value = ''
    categoryId.value = ''
    amount.value = ''
    memo.value = ''
    date.value = ''
    isFormVisible.value = false
  } catch (error) {
    console.error(error)
    alert('거래내역 추가에 실패했습니다.')
  }
}

// 빠른추가버튼 클릭할때마다 새로운거래추가 화면 on/off
const toggleForm = () => {
  if (isFormVisible.value == false) {
    isFormVisible.value = true
  } else {
    isFormVisible.value = false
  }
}
</script>

<template>
  <div class="wrapper">
    <button class="icon" @click="toggleForm">빠른 추가</button>
    <div v-if="isFormVisible" class="format">
      <div>새로운 거래 추가</div>
      <div class="form-row">
        날짜<input v-model="date" type="datetime-local" placeholder="내용입력" />
      </div>
      <div class="form-row">
        구별
        <select v-model="typeId">
          <option value=""></option>
          <option value="1">지출</option>
          <option value="2">수입</option>
        </select>
      </div>
      <div class="form-row">
        카테고리
        <select v-model="categoryId">
          <option value="">카테고리를 선택하세요</option>
          <option v-for="category in categoryList" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
      <div class="form-row">
        금액<input v-model="amount" type="number" placeholder="숫자만 입력" />
      </div>
      <div class="form-row">
        메모<textarea v-model="memo" placeholder="내용입력" class="memo"></textarea>
      </div>
      <button @click="submit">거래내역 추가</button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  position: fixed; /* 여기 기준으로 .format 위치 잡힘 */
  display: inline-block;
  bottom: 2rem;
  right: 2rem;
}
.wrapper .icon {
  border: 2px solid rgb(210, 160, 20);
  font-size: 1rem;
  color: white;
  border-radius: 0.5rem;
  background-color: rgb(255, 188, 0);
  position: relative;
  display: flex;
  padding: 1rem 1.5rem;
  z-index: 200;
}

.wrapper .icon:hover {
  background-color: rgb(210, 160, 20);
}

.wrapper .icon:active {
  transform: translateY(0.1rem);
}

.wrapper .format {
  border: none;
  padding: 1rem;
  background-color: rgba(50, 50, 50, 0.75);
  color: white;
  border-radius: 0.5rem;
  position: absolute;
  bottom: 0;
  right: 0;
  width: fit-content;
  z-index: 100;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  flex-direction: column;
}

.wrapper .format input {
  padding: 0.5rem;
}

.wrapper .format .memo {
  padding: 0.5rem;
  height: 5rem;
  resize: none; /* 메모영역 영역크기 변경막기 */
}

.wrapper .format button:hover {
  background-color: rgb(200, 200, 200);
}

.wrapper .format button:active {
  transform: translateY(0.1rem);
}
</style>
