<script setup>
import { useSpecialStore } from "@/stores/special";
import RestartButton from "@/components/RestartButton.vue";
const specialStore = useSpecialStore();
</script>

<template>
  <div
    class="flex flex-col dark:text-white text-4xl font-semibold gap-4 justify-center items-center"
  >
    <div>
      <div class="flex flex-row space-x-8">
        <div>Level:</div>
        <div>{{ specialStore.level }}</div>
        <div>Score:</div>
        <div>{{ specialStore.score }}</div>
      </div>
      <div class="flex flex-row space-x-8">
        <div>Stack:</div>
        <div>{{ specialStore.wordCount }}</div>
        <div>ACC:</div>
        <div>{{ specialStore.acc }}%</div>
      </div>
    </div>
    <div class="my-12">
      <RestartButton @click="specialStore.newGame" />
    </div>
  </div>
</template>
