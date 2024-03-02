<script setup>
import { onMounted, watch, computed } from "vue";
import { useGameStore } from "@/stores/game";
import { useSpecialStore } from "@/stores/special";
import UserLayout from "@/layouts/UserLayout.vue";
const gameStore = useGameStore();
const specialStore = useSpecialStore();
onMounted(async () => {
  await gameStore.getAllMaxDataByUser();
  await specialStore.getAllMaxDataByUser();
});
watch(
  () => gameStore.maxData.length,
  async () => {
    if (gameStore.maxData.length != 0) {
      await gameStore.sortMaxToMin();
    } else {
    }
  }
);
watch(
  () => specialStore.maxData.length,
  async () => {
    if (specialStore.maxData.length != 0) {
      await specialStore.sortMaxToMin();
    } else {
    }
  }
);
</script>

<template>
  <UserLayout>
    <div
      class="flex flex-col w-full h-full items-center justify-start space-y-12"
    >
      <div
        class="text-4xl font-bold dark:text-gray-200 dark:hover:text-gray-100 cursor-pointer p-4"
      >
        Leaderboard Top Five
      </div>
      <div
        class="flex flex-row"
        :class="
          gameStore.maxData.length != 0 && specialStore.maxData.length != 0
            ? ' space-x-24'
            : ''
        "
      >
        <div class="overflow-x-auto" v-show="gameStore.maxData != 0">
          <table
            class="min-w-full bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-neutral-900 shadow-md rounded-xl"
          >
            <thead class="">
              <tr clas="bg-blue-gray-100 text-gray-700">
                <th class="py-3 px-8 text-left">ID</th>
                <th class="py-3 px-8 text-left">Username</th>
                <th class="py-3 px-8 text-left">WPM</th>
                <th class="py-3 px-8 text-left">ACC</th>
              </tr>
            </thead>
            <tbody class="text-blue-gray-900">
              <tr v-for="(items, index) in gameStore.maxData" class="">
                <td class="py-3 px-8 text-center">{{ index + 1 }}</td>
                <td class="py-3 px-8">{{ items.username }}</td>
                <td class="py-3 px-8">{{ items.data.wpm }}</td>
                <td class="py-3 px-8">{{ items.data.acc }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <div class="overflow-x-auto" v-show="specialStore.maxData != 0">
            <table
              class="min-w-full bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-neutral-900 shadow-md rounded-xl"
            >
              <thead class="">
                <tr clas="bg-blue-gray-100 ">
                  <th class="py-3 px-8 text-left">ID</th>
                  <th class="py-3 px-8 text-left">Username</th>
                  <th class="py-3 px-8 text-left">SCORE</th>
                  <th class="py-3 px-8 text-left">ACC</th>
                </tr>
              </thead>
              <tbody class="text-blue-gray-900">
                <tr v-for="(items, index) in specialStore.maxData" class="">
                  <td class="py-3 px-8 text-center">{{ index + 1 }}</td>
                  <td class="py-3 px-8">{{ items.username }}</td>
                  <td class="py-3 px-8">{{ items.data.score }}</td>
                  <td class="py-3 px-8">{{ items.data.acc }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </UserLayout>
</template>
