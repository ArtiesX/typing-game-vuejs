<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useGameStore } from "@/stores/game";
import { useSpecialStore } from "@/stores/special";
import { RouterLink, useRouter } from "vue-router";
import ChangeTheme from "@/components/ChangeTheme.vue";
const removeAccount = async () => {
  if (password.value.length != 0) {
    await authStore.removeAccount(password.value);
    router.push({ name: "login" });
  }
};
const password = ref("");
const router = useRouter();
const authStore = useAuthStore();
const gameStore = useGameStore();
const specialStore = useSpecialStore();

const logout = async () => {
  try {
    await authStore.logout();
    router.push({ name: "login" });
  } catch (err) {
    console.log("error", err);
  }
};
</script>

<template>
  <header class="layout bg-transparent">
    <div class="flex w-full flex-row items-center justify-between pt-4 px-10">
      <RouterLink
        to="/"
        @click="gameStore.resetGame"
        class="relative text-3xl font-bold text-fg transition-colors duration-200 hover:dark:text-gray-100 dark:text-gray-300"
      >
        <v-icon name="fa-keyboard" scale="3" /> typing game</RouterLink
      >

      <div class="flex flex-row justify-center items-center space-x-6">
        <RouterLink
          to="/"
          @click="gameStore.resetGame"
          class="dark:hover:text-gray-100"
          ><v-icon name="fa-keyboard" scale="2"
        /></RouterLink>
        <RouterLink
          to="/special"
          @click="specialStore.newGame"
          class="dark:hover:text-gray-100"
          ><v-icon name="gi-perspective-dice-six-faces-random" scale="2"
        /></RouterLink>
        <RouterLink to="/leaderboard" class="dark:hover:text-gray-100"
          ><v-icon name="fa-crown" scale="2"
        /></RouterLink>
      </div>
      <div class="flex space-x-6">
        <div class="dropdown dropdown-hover dropdown-end">
          <div tabindex="0" role="button" class="btn m-1 btn-ghost btn-circle">
            <div class="indicator">
              <v-icon name="bi-moon-stars-fill" scale="1.5" />
            </div>
          </div>
          <ChangeTheme />
        </div>
        <div class="dropdown dropdown-hover dropdown-end">
          <div tabindex="0" role="button" class="btn m-1 btn-ghost btn-circle">
            <v-icon name="fa-user-circle" scale="1.5" />
          </div>
          <ul
            tabindex="0"
            class="dropdown-content z-[1] menu p-2 shadow bg-gray-100 text-gray-700 dark:text-gray-300 dark:bg-neutral-900 rounded-box w-52 flex"
          >
            <li>
              <RouterLink to="/profile" class="justify-between">
                Dashboard</RouterLink
              >
            </li>
            <li><a class="text-red-500" @click="logout">Logout</a></li>
            <li>
              <a class="text-red-500" onclick="removeaccount_modal.showModal()"
                >Remove Account</a
              >
            </li>
          </ul>
          <dialog id="removeaccount_modal" class="modal">
            <div class="modal-box bg-gray-100 dark:bg-neutral-950">
              <h3 class="font-bold text-lg text-black dark:text-white">
                <div>Are you sure to remove account?</div>
                <div class="flex items-center">
                  Email : {{ authStore.user.email }}
                </div>
              </h3>
              <div class="my-4">
                <form @submit.prevent="removeAccount">
                  <label
                    for="password"
                    class="my-2 block text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                    >Password</label
                  >
                  <input
                    id="password"
                    type="password"
                    autofocus
                    autocomplete="current-password"
                    placeholder="********"
                    required
                    v-model="password"
                    class="text-black dark:text-white input input-bordered w-full bg-transparent"
                  />
                </form>
              </div>

              <form
                method="dialog"
                class="modal-backdrop flex justify-end gap-2"
              >
                <button class="btn btn-outline text-black dark:text-white">
                  CANCEL
                </button>
                <button
                  class="btn bg-red-600 hover:bg-red-700 border-none text-white"
                  @click="removeAccount"
                >
                  OK
                </button>
              </form>
            </div>

            <form method="dialog" class="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
        </div>
      </div>
    </div>
  </header>
</template>
