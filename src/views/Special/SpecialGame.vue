<script setup>
import { useSpecialStore } from "@/stores/special";
import { watch, onMounted } from "vue";
const specialStore = useSpecialStore();
onMounted(async () => {
  await specialStore.newGame();
});

watch(
  () => specialStore.started,
  async () => {
    if (specialStore.started == true && specialStore.ended == false) {
      await specialStore.timer();
    }
  }
);
watch(
  () => specialStore.wordTime,
  async () => {
    if (
      specialStore.input_value != specialStore.word &&
      specialStore.wordTime <= 0
    ) {
      specialStore.ended = true;
      document.getElementById("input").disabled = true;
      await specialStore.calacualteAcc();
    }
  }
);
</script>

<template>
  <div class="w-full h-full text-gray-400">
    <div class="flex justify-end items-end gap-8 mr-12 dark:text-white">
      <div class="flex text-2xl font-bold gap-4">
        <div>Score :</div>
        <Transition name="bounce" mode="out-in">
          <div :key="specialStore.score">
            {{ specialStore.score }}
          </div></Transition
        >
      </div>
      <div class="flex text-2xl font-bold gap-4">
        Level :
        <div>
          <Transition name="bounce" mode="out-in">
            <div :key="specialStore.level">
              {{ specialStore.level }}
            </div></Transition
          >
        </div>
      </div>
    </div>
    <div
      class="flex flex-col w-full h-full justify-center items-center gap-12 -mt-12"
    >
      <p id="word-area" class="text-6xl font-bold"></p>
      <span id="cd" class="text-3xl font-bold">
        {{ specialStore.wordTime.toFixed(2) }}</span
      >
      <input
        id="input"
        type="text"
        autocomplete="off"
        v-model="specialStore.input_value"
        :maxlength="specialStore.maxlength"
        @input="specialStore.processInput($event)"
        @keyup.space="specialStore.processInputSpaceBack($event)"
        @keyup.delete="specialStore.processInputSpaceBack($event)"
        @keyup="specialStore.onChangeInput"
        class="opacity-0 absolute -z-999"
        @paste.prevent
        @keyup.ctrl.prevent
      />
      
    </div>
  </div>
</template>

<style scoped>
.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes animateCountdown {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
</style>
