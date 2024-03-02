<script setup>
import ChangeTheme from "@/components/ChangeTheme.vue";
import { Chart } from "chart.js/auto";
import { useAuthStore } from "@/stores/auth";
import { useGameStore } from "@/stores/game";
import { useSpecialStore } from "@/stores/special";
import { RouterLink, useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const authStore = useAuthStore();
const gameStore = useGameStore();
const specialStore = useSpecialStore();

let myChart = Object;
const labels = [1, 2, 3, 4, 5, 6, 7];
const data = {
  labels: labels,
  datasets: [
    {
      label: "ACC",
      data: gameStore.lastACC,
      fill: false,
      borderColor: "#FF6384",
      backgroundColor: "#FFB1C1",
      tension: 0.4,
    },
    {
      label: "WPM",
      data: gameStore.lastWpm,
      fill: false,
      borderColor: "#36A2EB",
      backgroundColor: "#9BD0F5",
      tension: 0.4,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false,
};
const config = {
  type: "line",
  data: data,
  options: options,
};

onMounted(async () => {
  await gameStore.getLastData();
  await specialStore.getLastData();
  await specialStore.sortMinToMax().then(async () => {
    await specialStore.saveLastData();
  });
  await gameStore.sortMinToMax().then(async () => {
    await gameStore.saveLastData();
  });

  myChart = new Chart(document.getElementById("overview-chart"), config);
  await initChart();
});

const isNormalMode = ref(true);
const isSpecialMode = ref(false);
const toggleNormal = async () => {
  isNormalMode.value = true;
  isSpecialMode.value = false;
  await reloadChart();
};

const toggleSpecial = async () => {
  isNormalMode.value = false;
  isSpecialMode.value = true;
  await reloadChart();
};

const initChart = async () => {
  if (isNormalMode.value == true) {
    await gameStore.getLastData();
    await gameStore.sortMinToMax().then(async () => {
      await gameStore.saveLastData();
    });
    myChart.data.datasets[0].data.label = "ACC";
    myChart.data.datasets[0].fill = false;
    myChart.data.datasets[0].borderColor = "#FF6384";
    myChart.data.datasets[0].data = gameStore.lastACC;
    myChart.data.datasets[1].data.label = "WPM";
    myChart.data.datasets[1].fill = false;
    myChart.data.datasets[1].borderColor = "#36A2EB";
    myChart.data.datasets[1].data = gameStore.lastWpm;
    myChart.update();
  } else if (isSpecialMode.value == true) {
    await specialStore.getLastData();
    await specialStore.sortMinToMax().then(async () => {
      await specialStore.saveLastData();
    });
    myChart.data.datasets[1].data.label = "SCORE";
    myChart.data.datasets[1].fill = false;
    myChart.data.datasets[1].borderColor = "#36A2EB";
    myChart.data.datasets[1].data = specialStore.lastScore;
    myChart.update();
  }
};
const reloadChart = async () => {
  if (isNormalMode.value == true) {
    await gameStore.getLastData();
    await gameStore.sortMinToMax().then(async () => {
      await gameStore.saveLastData();
    });
    await removeData();
    await addData(0);
    await addData(1);
  } else if (isSpecialMode.value == true) {
    await specialStore.getLastData();
    await specialStore.sortMinToMax().then(async () => {
      await specialStore.saveLastData();
    });
    removeData();
    addData(3);
  }
};

const addData = async (idx) => {
  if (idx == 0) {
    const newDataset = {
      label: "ACC",
      data: gameStore.lastACC,
      fill: false,
      borderColor: "#FF6384",
      backgroundColor: "#FFB1C1",
      tension: 0.4,
    };
    myChart.data.datasets.push(newDataset);
    myChart.update();
  } else if (idx == 1) {
    const newDataset2 = {
      label: "WPM",
      data: gameStore.lastWpm,
      fill: false,
      borderColor: "#36A2EB",
      backgroundColor: "#9BD0F5",
      tension: 0.4,
    };
    myChart.data.datasets.push(newDataset2);
    myChart.update();
  } else if (idx == 3) {
    const newDataset3 = {
      label: "SCORE",
      data: specialStore.lastScore,
      fill: false,
      borderColor: "#36A2EB",
      backgroundColor: "#9BD0F5",
      tension: 0.4,
    };
    myChart.data.datasets.push(newDataset3);
    myChart.update();
  }
};

const removeData = async () => {
  while (myChart.data.datasets.length != 0) {
    myChart.data.datasets.pop();
    myChart.update();
  }
};

const destroy = async () => {
  await myChart.destroy();
};
</script>

<template>
  <div class="bg-white dark:bg-neutral-950 min-h-screen min-w-screen">
    <div class="mx-20 pt-10">
      <div
        class="font-bold text-2xl text-black dark:text-gray-200 flex flex-row justify-between"
      >
        <RouterLink to="/" @click="destroy" class="dark:hover:text-white"
          >X</RouterLink
        >
        <div class="flex space-x-12">
          <div
            class="dark:hover:text-white cursor-pointer hover:text-blue-600"
            :class="
              isNormalMode == true ? 'text-blue-500 dark:text-blue-400' : ''
            "
            @click="toggleNormal"
          >
            <v-icon name="fa-keyboard" scale="2" />
          </div>

          <div
            class="dark:hover:text-white cursor-pointer hover:text-blue-600"
            :class="
              isSpecialMode == true ? 'text-blue-500 dark:text-blue-400' : ''
            "
            @click="toggleSpecial"
          >
            <v-icon name="gi-perspective-dice-six-faces-random" scale="2" />
          </div>
        </div>
        <div class="dropdown dropdown-hover dropdown-end">
          <div tabindex="0" role="button" class="btn m-1 btn-ghost btn-circle">
            <div class="indicator">
              <v-icon name="bi-moon-stars-fill" scale="1.5" />
            </div>
          </div>
          <ChangeTheme />
        </div>
      </div>
      <div class="pt-4">
        <div class="flex flex-col space-y-8">
          <div
            class="text-3xl font-bold text-gray-800 dark:text-gray-200 dark:hover:text-white cursor-pointer"
            @click="reloadChart"
          >
            {{ authStore.user.displayName }} | Overview (Last 7 times)
          </div>
          <div class="flex">
            <canvas id="overview-chart" height="300" width="800"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
