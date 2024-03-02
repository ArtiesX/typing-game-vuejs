<script setup>
import UserLayout from "@/layouts/UserLayout.vue";
import SpecialGame from "@/views/Special/SpecialGame.vue";
import SpecialResult from "@/views/Special/SpecialResult.vue";
import { useSpecialStore } from "@/stores/special";
import { onMounted } from "vue";
const specialStore = useSpecialStore();

onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (e.key == "Tab") {
      var startBtn = document.getElementById("start-btn");
      document.addEventListener("keydown", () => startBtn.focus());
    }
  });
});

const start = async () => {
  specialStore.started = true;
};
</script>

<template>
  <UserLayout>
    <div class="flex w-full h-full">
      <div
        class="flex flex-col w-full h-full"
        :class="
          specialStore.started == true ? '' : 'justify-center items-center'
        "
      >
        <div
          v-show="
            specialStore.show_result == false &&
            specialStore.started == false &&
            specialStore.ended == false
          "
          class="flex flex-col justify-center items-center space-y-12"
        >
          <button
            id="start-btn"
            class="btn text-3xl flex justify-center items-center h-20 w-40 text-gray-200 bg-neutral-900 border-none hover:bg-neutral-800 border-none"
            @click="start"
          >
            Start!
          </button>
          <div
            class="flex flex-row space-x-2 justify-center items-center text-lg text-gray-900 font-semibold dark:text-gray-200"
          >
            <div>Press</div>
            <kbd class="kbd text-gray-200 bg-neutral-900">Tab</kbd>
            <div>+</div>
            <kbd class="kbd text-gray-200 bg-neutral-900">enter</kbd>
            <div>to start</div>
          </div>
        </div>
        <SpecialGame
          v-show="
            specialStore.show_result == false && specialStore.started == true
          "
        />
        <SpecialResult
          v-show="
            specialStore.show_result == true &&
            specialStore.started == false &&
            specialStore.ended == true
          "
        />
      </div>
    </div>
  </UserLayout>
</template>
