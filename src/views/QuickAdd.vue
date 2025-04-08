<script setup>
import { ref } from 'vue'

const isFormVisible = ref(false) // 폼 표시 여부 상태

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
      <input type="text" placeholder="내용입력" />
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
  border: none;
  font-size: 1rem;
  color: white;
  border-radius: 0.5rem;
  background-color: rgb(255, 188, 0);
  position: relative;
  display: flex;
  padding: 1rem 1.5rem;
  z-index: 200;
}

.wrapper .format {
  border: none;
  padding: 1rem;
  background-color: rgba(50, 50, 50, 0.75);
  border-radius: 0.5rem;
  position: absolute;
  bottom: 0;
  right: 0;
  width: fit-content;
  z-index: 100;
  padding-bottom: 5rem;
}
</style>
