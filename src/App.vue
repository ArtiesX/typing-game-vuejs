<script setup>
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import Chart from "chart.js/auto";

const themeStore = useThemeStore();
onMounted(async () => {
  await themeStore.loadTheme;
});
</script>

<template>
  <div :class="themeStore.mode">
    <RouterView />
  </div>
</template>
