<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  series: Array,
  labels: Array,
})
</script>

<template>
  <div class="">
    <apexchart
      class="chart"
      type="donut"
      :options="{
        chart: {
          id: 'vuechart-example',
        },
        labels: props.labels,
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return val.toFixed(1) + '%'
          },
          style: {
            fontSize: '14px',
          },
        },
        plotOptions: {
          pie: {
            donut: {
              labels: {
                show: true,
              },
            },
          },
        },
      }"
      :series="props.series"
    />
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
}

@media screen and (min-width: 1024px) {
  .container {
    max-width: 600px;
  }
}
</style>
