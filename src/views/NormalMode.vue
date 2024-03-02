<script setup>
import UserLayout from "@/layouts/UserLayout.vue";
import Keyboard from "@/components/Keyboard.vue";
import NormalGame from "@/views/Normal/NormalGame.vue";
import NormalResult from "@/views/Normal/NormalResult.vue";
import { useGameStore } from "@/stores/game";

const gameStore = useGameStore();

const toggleKeyboard = () => {
  gameStore.show_keyboard = !gameStore.show_keyboard;
};
</script>

<template>
  <UserLayout>
    <div
      :class="gameStore.show_result == true ? 'justify-center' : ''"
      class="flex flex-col h-full w-full items-center"
    >
      <div
        v-show="gameStore.show_result == false"
        class="flex justify-start items-center rounded-lg px-2 my-8 transition hover:shadow-lg bg-gray-100 dark:bg-neutral-900 dark:text-gray-100"
      >
        <div @click="toggleKeyboard">
          <v-icon name="fa-keyboard" class="mx-4 cursor-pointer" />
        </div>
        <div class="flex gap-4 px-2 py-3 text-xs">
          <div
            @click="gameStore.selectTimeMode"
            class="cursor-pointer flex gap-2"
          >
            <v-icon name="io-time" />time
          </div>
          <div
            @click="gameStore.selectWordMode"
            class="cursor-pointer flex gap-2"
          >
            <v-icon name="io-text" />word
          </div>
        </div>
        <div>|</div>
        <div
          v-show="gameStore.isTimeMode == true"
          class="flex gap-4 spcae-x-4 px-2 py-3 text-xs"
        >
          <div v-for="time in gameStore.timeSet">
            <div @click="gameStore.setTime(time)" class="cursor-pointer">
              {{ time }}s
            </div>
          </div>
        </div>
        <div
          v-show="gameStore.isWordMode == true"
          class="flex gap-4 spcae-x-4 px-2 py-3 text-xs"
        >
          <div v-for="wrd in gameStore.wordSet">
            <div @click="gameStore.setWord(wrd)" class="cursor-pointer">
              {{ wrd }}
            </div>
          </div>
        </div>
      </div>
      <NormalGame v-show="gameStore.show_result == false" />
      <Transition name="fade" :duration="500"
        ><Keyboard
          :key="gameStore.show_keyboard"
          v-show="
            gameStore.show_result == false && gameStore.show_keyboard == true
          "
      /></Transition>

      <NormalResult v-show="gameStore.show_result == true" />
    </div>
  </UserLayout>
</template>

<style>
.fade-enter-active {
  animation: fade 0.5s;
}
.fade-leave-active {
  animation: fade 0.5s reverse;
}
@keyframes fade {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
