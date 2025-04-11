<script setup>
import { defineProps } from 'vue'
import { useTransactionCategoryStore } from '@/stores/transactionCategoryStore' // ✅ 정확한 import
import { TRANSACTION_TYPE } from '@/types/index.js'

// 부모 컴포넌트로부터 전달받는 거래 항목 배열
const props = defineProps({
  items: Array,
})

// 날짜를 'YYYY.MM.DD' 형식으로 포맷
const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('ko-KR')
}

// 거래 타입 라벨 매핑
const TYPE_LABEL = {
  [TRANSACTION_TYPE.expense]: '지출',
  [TRANSACTION_TYPE.income]: '수입',
}

// 거래 타입 텍스트 반환
const getTypeName = (typeId) => TYPE_LABEL[typeId] || '-'

// Pinia 스토어 인스턴스 호출
const categoryStore = useTransactionCategoryStore()

// categoryId로 카테고리 이름 + 아이콘 반환
const getCategoryName = (categoryId) => {
  const category = categoryStore.states.transactionCategories.find((c) => c.id === categoryId)
  return category ? `${category.icon} ${category.name}` : '-'
}
</script>

<template>
  <div class="container history-wrapper">
    <!-- 테이블 헤더 (PC용) -->
    <div class="row header">
      <span>날짜</span>
      <span>구별</span>
      <span>카테고리</span>
      <span>금액</span>
      <span>메모</span>
      <span>수정/삭제</span>
    </div>

    <!-- 거래 내역 리스트 -->
    <div
      class="row item"
      v-for="item in props.items"
      :key="item.id"
      @click="$emit('click', item.id)"
    >
      <span><strong class="label">날짜:</strong> {{ formatDate(item.date) }}</span>
      <span><strong class="label">구별:</strong> {{ getTypeName(item.typeId) }}</span>
      <span><strong class="label">카테고리:</strong> {{ getCategoryName(item.categoryId) }}</span>
      <span><strong class="label">금액:</strong> {{ item.amount.toLocaleString() }}원</span>
      <span><strong class="label">메모:</strong> {{ item.memo }}</span>
      <span class="buttons">
        <button @click.stop="$emit('edit', item.id)">✏️</button>
        <button @click.stop="$emit('delete', item.id)">🗑️</button>
      </span>
    </div>
  </div>
</template>

<style scoped>
.history-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 20px;
}

.row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.header {
  font-weight: bold;
  background-color: rgb(255, 204, 0);
}

.item:hover {
  background-color: #f9f9f9;
}

.buttons button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin: 0 4px;
  transition: transform 0.2s;
}

.buttons button:hover {
  transform: scale(1.2);
}

.label {
  display: none;
  font-weight: bold;
}

@media (max-width: 768px) {
  .row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 12px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
  }

  .row span {
    display: block;
    margin-bottom: 6px;
  }

  .label {
    display: inline;
    margin-right: 4px;
  }

  .buttons {
    display: flex;
    gap: 8px;
  }

  .buttons button {
    font-size: 16px;
  }
}
</style>
