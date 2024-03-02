<script setup>
import { onMounted, watch } from "vue";
import { useGameStore } from "@/stores/game";
const gameStore = useGameStore();
onMounted(async () => {
  document.addEventListener("keydown", async (e) => {
    await gameStore.checkCapLock(e);
  });
  await gameStore.played();
});

watch(
  () => gameStore.started,
  async () => {
    if (gameStore.started == true && gameStore.ended == false) {
      await gameStore.timer();
    } else {
    }
  }
);

watch(
  () => gameStore.curTime,
  async () => {
    if (gameStore.curTime == 0 && gameStore.isTimeMode == true) {
      gameStore.ended = true;
      gameStore.started = false;
      gameStore.show_result = true;
    } else if (gameStore.isWordMode == true && gameStore.ended == true) {
      gameStore.stopTheGame();
    }
  }
);

watch(
  () => gameStore.index,
  async () => {
    gameStore.endTypingTest();
  }
);

watch(
  () => gameStore.ended,
  async () => {
    if (gameStore.ended == true) {
      gameStore.started = false;
      gameStore.show_result = true;

      await gameStore.calculateAcc();
      await gameStore.calculateWPM();
      await gameStore.saveDataToFireStore();
    }
  }
);
</script>

<template>
  <div class="main">
    <h1
      id="score"
      class="font-bold text-3xl text-blue-400"
      v-show="gameStore.isTimeMode == true"
    >
      {{ gameStore.curTime.toFixed(0) }}
    </h1>
    <h1
      id="score"
      class="font-bold text-3xl text-blue-400"
      v-show="gameStore.isWordMode == true"
    >
      {{ gameStore.curCount }}
    </h1>
    <div class="paragraph-box">
      <p id="paragraph-area"></p>
    </div>
    <input
      type="text"
      autocomplete="off"
      v-model="gameStore.input_value"
      :maxlength="gameStore.maxLengthInput"
      @input="gameStore.processInput($event)"
      @keyup.space="gameStore.processInputSpaceBack($event)"
      @keyup.delete="gameStore.processInputSpaceBack($event)"
      @keyup="gameStore.onChangeInput"
      id="inputField"
      class="opacity-0 absolute -z-999"
      @paste.prevent
      @keyup.ctrl.prevent
    />
  </div>
</template>

<style>
.main {
  display: block;
  margin: 0 auto;
  width: 80%;
}
.paragraph-box {
  height: 90px;
  min-height: 90px;
  max-height: 90px;
  overflow: hidden;
}
#paragraph-area {
  flex-wrap: wrap;
  transition: left 0.1s ease;
  line-height: 165%;
  font-size: 26px;

  word-spacing: -2px;
  text-align: justify;
  font-weight: bold;
  margin-top: -5px;
  overflow: hidden;
}
word span.correct {
  color: rgb(228, 228, 228);
}

word span.error {
  color: #ff3a4d;
}

span.lineLtr {
  border-left: 2px solid #b6b6b6;
}

span.lastLetter {
  border-right: 2px solid #b6b6b6;
}
</style>
