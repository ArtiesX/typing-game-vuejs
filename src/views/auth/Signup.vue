<script setup>
import ChangeTheme from "@/components/ChangeTheme.vue";
import { ref } from "vue";
import { useRouter, RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmpassword = ref("");
const sigup = async () => {
  if (password.value !== confirmpassword.value) {
    alert("Password not match");
  } else {
    await authStore.register(name.value, email.value, password.value);
    router.push({ name: "normal" });
  }
};
</script>
<template>
  <div class="bg-white dark:bg-neutral-950 flex min-h-screen flex-col">
    <div class="flex justify-end mr-16 mt-4">
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
      class="text-center text-4xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white"
    >
      Create an account
    </h2>
    <div class="mt-6 mx-auto w-full max-w-sm">
      <form @submit.prevent="register">
        <label
          for="username"
          class="my-2 block text-sm font-medium leading-6 text-gray-900 dark:text-white"
          >Username</label
        >
        <input
          id="username"
          type="username"
          required
          autofocus
          placeholder="Enter your username"
          v-model="name"
          class="text-black dark:text-white input input-bordered w-full bg-transparent"
        />
        <label
          for="email"
          class="my-2 block text-sm font-medium leading-6 text-gray-900 dark:text-white"
          >Email Address</label
        >
        <input
          id="email"
          type="email"
          autocomplete="email"
          required
          placeholder="example@email.com"
          v-model="email"
          class="text-black dark:text-white input input-bordered w-full bg-transparent"
        />

        <label
          for="password"
          class="my-2 block text-sm font-medium leading-6 text-gray-900 dark:text-white"
          >Password</label
        >
        <input
          id="password"
          type="password"
          placeholder="********"
          required
          v-model="password"
          class="text-black dark:text-white input input-bordered w-full bg-transparent"
        />
        <label
          for="confirmpassword"
          class="my-2 block text-sm font-medium leading-6 text-gray-900 dark:text-white"
          >Confirm password</label
        >
        <input
          id="confirmpassword"
          type="password"
          placeholder="********"
          required
          v-model="confirmpassword"
          class="text-black dark:text-white input input-bordered w-full bg-transparent"
        />

        <div class="mt-4">
          <button
            @click="sigup"
            class="btn w-full bg-blue-600 hover:bg-blue-700 text-white text-medium border-none"
          >
            Signup
          </button>
        </div>
      </form>

      <p class="mt-6 text-center text-m text-gray-500">
        Already have an account
        <RouterLink
          to="/login"
          class="ml-1 font-semibold leading-6 text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400"
          >Login</RouterLink
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
