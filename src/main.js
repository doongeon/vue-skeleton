import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueApexCharts from 'vue3-apexcharts'

import App from './App.vue'
import router from './router'

import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VCalendar, { componentPrefix: 'V' })
app.use(VueApexCharts)

app.component('ApexChart', VueApexCharts)

app.mount('#app')
