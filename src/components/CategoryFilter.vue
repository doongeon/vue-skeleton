<script setup>
// 상단필터 태그 클릭시 상태 업데이트

defineProps({
  categories: Object,
})
</script>

<template>
  <div class="category-filter">
    <span
      v-for="category in categories"
      :key="category"
      @click="$emit('selected-category', category)"
      class="category-tag"
    >
      {{ category }}
    </span>
  </div>
</template>

<style scoped>
.category-filter {
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-tag {
  padding: 4px 10px;
  border-radius: 12px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.category-tag:hover {
  background-color: #ccc;
}
</style>
