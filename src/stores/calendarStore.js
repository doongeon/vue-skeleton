import { defineStore } from "pinia";
import { reactive } from "vue";

export const useCalendarStore = defineStore('filter', ()=> {
    state : ()=> (reactive({
        filteredData: {}
    })),
    actions: {
        updateFilteredData(newData){
            this.filteredData = newData
        }
    }
}
})