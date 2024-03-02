<script setup>
import { useThemeStore } from "@/stores/theme";
const themeStore = useThemeStore();
const themes = [
  {
    name: "Light",
    icon: "bi-sun-fill",
    value: "light",
  },
  {
    name: "Dark",
    icon: "bi-moon-stars-fill",
    value: "dark",
  },
  {
    name: "System",
    icon: "ri-computer-line",
    value: "system",
  },
];
</script>
<template>
  <div>
    <ul
      tabindex="0"
      class="dropdown-content z-[1] menu p-2 shadow bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-neutral-900 rounded-box w-52 flex"
    >
      <li v-for="theme in themes">
        <div
          class="flex flex-row justify-between"
          id="changeTheme"
          :key="theme.value"
          @click="themeStore.setTheme(theme.value)"
        >
          <div>
            {{ theme.name }}
          </div>
          <v-icon
            for="changetheme"
            class="text-xl peer-checked:rotate-180 peer-checked:scale-0 duration-1000 ease-out text-gray-700 dark:text-gray-300"
            :name="theme.icon"
          />
        </div>
      </li>
    </ul>
  </div>
</template>
