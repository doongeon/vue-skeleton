<script setup>
import { defineProps } from 'vue'
import { TRANSACTION_TYPE, TRANSACTION_CATEGORY } from '@/router/index.js'

const props = defineProps({
  items: Array,
})

const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('ko-KR')
}

const TYPE_LABEL = {
  [TRANSACTION_TYPE.expense]: '지출',
  [TRANSACTION_TYPE.income]: '수입',
}

const CATEGORY_LABEL = {
  [TRANSACTION_CATEGORY.식비]: '🍽️ 식비',
  [TRANSACTION_CATEGORY.교통]: '🚗 교통',
  [TRANSACTION_CATEGORY.문화여가]: '🎮 문화/여가',
  [TRANSACTION_CATEGORY.술유흥]: '🍺 술/유흥',
  [TRANSACTION_CATEGORY.쇼핑]: '🛍️ 쇼핑',
  [TRANSACTION_CATEGORY.여행숙박]: '🏨 여행/숙박',
  [TRANSACTION_CATEGORY.월급]: '💼 월급',
  [TRANSACTION_CATEGORY.용돈]: '💸 용돈',
  [TRANSACTION_CATEGORY.보너스]: '🎁 보너스',
  [TRANSACTION_CATEGORY.매매]: '📈 매매',
  [TRANSACTION_CATEGORY.이자]: '💰 이자',
}

const getTypeName = (typeId) => TYPE_LABEL[typeId] || '-'
const getCategoryName = (categoryId) => CATEGORY_LABEL[categoryId] || '-'
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
      <span><strong class="label">구별:</strong> {{ item.typeId }}</span>
      <span><strong class="label">카테고리:</strong> {{ item.category }}</span>
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
