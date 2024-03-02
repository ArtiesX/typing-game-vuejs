<script setup>
import ChangeTheme from "@/components/ChangeTheme.vue";
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import Forgotpassword from "@/components/Forgotpassword.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const forgotpassword = async () => {
  if (resetPassword.value.length != 0) {
    authStore.resetPassword(resetPassword.value);
  }
};
const resetPassword = ref("");
const email = ref("");
const password = ref("");
const login = async () => {
  try {
    await authStore.login(email.value, password.value);

    if (authStore.isAdmin) {
      router.push({ name: "admin-dashboard" });
    } else {
      router.push({ name: "normal" });
    }
  } catch (err) {
    console.log("Error", err);
  }
};
</script>
<template>
  <div class="bg-white dark:bg-neutral-950 flex min-h-screen flex-col">
    <div class="flex justify-end mr-16 mt-6">
      <div class="dropdown dropdown-hover dropdown-end">
        <div tabindex="0" role="button" class="btn m-1 btn-ghost btn-circle">
          <div class="indicator">
            <div>🌙</div>
          </div>
        </div>
        <ChangeTheme />
      </div>
    </div>
    <h2
      class="mt-8 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white"
    >
      Login
    </h2>
    <div class="mt-10 mx-auto w-full max-w-sm">
      <form @submit.prevent="login">
        <div>
          <label
            for="email"
            class="my-2 block text-sm font-medium leading-6 text-gray-900 dark:text-white"
            >Email Address</label
          >
          <input
            id="email"
            type="email"
            autocomplete="email"
            autofocus
            required
            placeholder="example@email.com"
            v-model="email"
            class="text-black dark:text-white input input-bordered w-full bg-transparent"
          />
        </div>
        <div>
          <label
            for="password"
            class="my-2 block text-sm font-medium leading-6 text-gray-900 dark:text-white"
            >Password</label
          >
          <input
            id="password"
            type="password"
            autocomplete="current-password"
            placeholder="********"
            required
            v-model="password"
            class="text-black dark:text-white input input-bordered w-full bg-transparent"
          />

          <p
            class="cursor-pointer flex justify-end pt-2 text-blue-600 hover:text-blue-500 font-medium dark:text-blue-500 dark:hover:text-blue-400"
            onclick="forgotpassword_modal.showModal()"
          >
            Forgot password?
          </p>
          <dialog id="forgotpassword_modal" class="modal">
            <div class="modal-box bg-gray-100 dark:bg-neutral-950">
              <h3 class="font-bold text-lg text-black dark:text-white">
                <div>Please enter your email for Reset password</div>
              </h3>
              <div class="my-4">
                <form @submit.prevent="forgotpassword">
                  <label
                    for="password"
                    class="my-2 block text-sm font-semibold leading-6 text-gray-900 dark:text-white"
                    >Email</label
                  >
                  <input
                    id="email"
                    type="email"
                    autofocus
                    required
                    v-model="resetPassword"
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
                  class="btn bg-blue-500 hover:bg-blue-600 border-none text-white"
                  @click="forgotpassword"
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
        <div class="my-4">
          <button
            @click="login"
            class="btn w-full bg-blue-600 hover:bg-blue-700 text-white text-medium border-none"
          >
            Login
          </button>
        </div>
      </form>
      <p class="mt-6 text-center text-m text-gray-500">
        Do you have an account?
        <RouterLink
          to="/signup"
          class="ml-1 font-semibold leading-6 text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
          >Signup</RouterLink
        >
      </p>
    </div>
  </div>
</template>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:focus {
  background-color: rgba(0, 0, 0, 0) !important;
  transition: background-color 0s 600000s, color 0s 600000s !important;
}
</style>
