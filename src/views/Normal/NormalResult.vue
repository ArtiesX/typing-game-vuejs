<script setup>
import { Chart } from "chart.js/auto";
import { onMounted, watch } from "vue";
import { useGameStore } from "@/stores/game";
import RestartButton from "@/components/RestartButton.vue";
const gameStore = useGameStore();
const labels = [1, 2, 3, 4, 5, 6, 7];
const data = {
  labels: labels,
  datasets: [
    {
      label: "My First Dataset",
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: false,
      borderColor: "rgb(75, 192, 192)",
      tension: 0.1,
    },
  ],
};
const config = {
  type: "line",
  data: data,
};
const options = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      beginAtZero: true,
    },
    x: {
      beginAtZero: true,
    },
  },
};
onMounted(() => {
  const ctx = document.getElementById("myChart");
  const myChart = new Chart(ctx, config, options);
  myChart.destroy();
});
let myChart = Object;
watch(
  () => gameStore.show_result,
  async () => {
    if (gameStore.show_result == true) {
      await gameStore.calculateWPS();
      await gameStore.calculateCharts();
      const ctx = document.getElementById("myChart");

      const time = await gameStore.testTime;
      const wpm = await gameStore.testWPS;
      const acc = await gameStore.testACC;
      const dataUpdate = {
        labels: time,
        datasets: [
          {
            label: "ACC",
            data: acc,
            fill: false,
            borderColor: "#FF6384",
            backgroundColor: "#FFB1C1",
            tension: 0.4,
          },
          {
            label: "WPM",
            data: wpm,
            fill: false,
            borderColor: "#36A2EB",
            backgroundColor: "#9BD0F5",
            tension: 0.4,
          },
        ],
      };
      const updateOption = {
        responsive: true,
        scales: {
          y: {
            min: 0,
          },
        },
      };
      const updateConfig = {
        type: "line",
        data: dataUpdate,
        options: updateOption,
      };

      myChart = new Chart(ctx, updateConfig);
    } else {
      myChart.destroy();
    }
  }
);
</script>

<template>
  <div class="flex flex-col justift-center items-center">
    <div class="flex flex-row justify-center items-center w-full h-full">
      <div class="text-3xl font-semibold text-black dark:text-white">
        <p>WPM</p>

        <p>{{ gameStore.wpm.toFixed(1) }}</p>
        <p>ACC</p>
        <p>{{ gameStore.acc }}%</p>
      </div>
      <div class="flex px-8">
        <canvas id="myChart" width="800" height="300"></canvas>
      </div>
    </div>
    <div class="mt-12">
      <RestartButton @click="gameStore.resetGame" />
    </div>
  </div>
</template>
