<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  items: Array,
})
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
      <span><strong class="label">날짜:</strong> {{ item.date }}</span>
      <span><strong class="label">구별:</strong> {{ item.type }}</span>
      <span><strong class="label">카테고리:</strong> {{ item.category }}</span>
      <span><strong class="label">금액:</strong> {{ item.amount.toLocaleString() }}원</span>
      <span><strong class="label">메모:</strong> {{ item.memo }}</span>
      <span>
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
  grid-template-columns: repeat(6, 1fr); /* PC에서 6등분 */
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

button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  margin: 0 4px;
}

/* 반응형 스타일 */
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

  button {
    font-size: 16px;
  }
}
</style>
