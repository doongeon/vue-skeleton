import { defineStore } from 'pinia'

export const useCalendarStore = defineStore('filter', {
  state: () => ({
    filteredData: {},
  }),
  actions: {
    updateFilteredData(newData) {
      this.filteredData = newData
    }
  }
})