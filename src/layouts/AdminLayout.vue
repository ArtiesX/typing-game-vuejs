<script setup>
import { RouterLink, useRouter, useRoute } from "vue-router";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
const router = useRouter();
const route = useRoute();
const themeStore = useThemeStore();
const authStore = useAuthStore();
const logout = async () => {
  try {
    await authStore.logout();
    router.push({ name: "login" });
  } catch (err) {
    console.log("error", err);
  }
};
const pageData = [
  {
    name: "Overview",
    route: "/admin/dashboard",
  },
  {
    name: "User",
    route: "/admin/users",
  },
];

const currentPath = ref("");
currentPath.value = route.path;

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
  <div class="flex flex-col h-screen w-screen justify-between">
    <div class="drawer drawer-open bg-white dark:bg-neutral-950">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content p-4 bg-red-900">
        <slot></slot>
      </div>
      <div class="drawer-side">
        <div class="menu flex flex-col justify-between min-h-screen">
          <ul
            class="p-2 w-60 bg-white text-black dark:bg-neutral-950 dark:text-white"
          >
            <li class="mb-2 font-semibold text-2xl">
              <div>Admin</div>
            </li>
            <li
              v-for="page in pageData"
              class="flex w-full justify-between cursor-pointer mb-4 font-medium text-lg"
            >
              <RouterLink
                :to="page.route"
                :class="
                  currentPath === page.route
                    ? 'bg-blue-500 dark:bg-neutral-900 '
                    : ''
                "
                class="py-3"
                >{{ page.name }}</RouterLink
              >
            </li>
          </ul>

          <div class="mx-4 my-4">
            <div class="join mb-4 flex justify-center items-center">
              <button
                v-for="theme in themes"
                :key="theme.value"
                class="tooltip rounded-lg cursor-pointer border-none btn join-item bg-gray-200 hover:bg-gray-300 dark:bg-neutral-900"
                :class="themeStore.theme === theme.value ? 'text-blue-600' : ''"
                @click="themeStore.setTheme(theme.value)"
                v-bind:data-tip="theme.name"
              >
                <v-icon :name="theme.icon" scale="1.5" />
              </button>
            </div>
            <div class="flex justify-center">
              <button
                @click="logout"
                class="btn w-full text-white bg-red-600 border-none hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
