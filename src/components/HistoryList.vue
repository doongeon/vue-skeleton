<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  items: Array,
})
</script>

<template>
  <div class="history-wrapper">
    <!-- 테이블 헤더 -->
    <div class="row header">
      <span>날짜</span>
      <span>구별</span>
      <span>카테고리</span>
      <span>금액</span>
      <span>메모</span>
      <span>수정/삭제</span>
    </div>

    <!-- 거래 내역 리스트 -->
    <div class="row item" v-for="item in props.items" :key="item.id">
      <span>{{ item.date }}</span>
      <span>{{ item.type }}</span>
      <span>{{ item.category }}</span>
      <span>{{ item.amount.toLocaleString() }}원</span>
      <span>{{ item.memo }}</span>
      <span>
        <button @click="$emit('edit', item.id)">✏️</button>
        <button @click="$emit('delete', item.id)">🗑️</button>
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
  grid-template-columns: repeat(6, 1fr); /* 6등분으로 균등하게 */
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

.header {
  font-weight: bold;
  background-color: #f0e9e9;
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
</style>
