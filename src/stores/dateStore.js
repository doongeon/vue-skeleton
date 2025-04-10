import { defineStore } from 'pinia'

export const useDateStore = defineStore('date', {
  state: () => ({
    // selectedDate: new Date().toISOString().slice(0, 7), // 기본값 (오늘 날짜 'yyyy-mm')
    selectedDate: new Date().toISOString().slice(0, 10), // 기본값 (오늘 날짜 'yyyy-mm')
  }),
  actions: {
    setDate(newDate) {
      this.selectedDate = newDate
    },
  },
})
