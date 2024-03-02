<script setup>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import { ref } from "vue";
</script>
<template>
  <div
    class="flex flex-col w-full h-screen justify-between bg-white dark:bg-neutral-950"
  >
    <div><Header /></div>
    <slot></slot>
    <div><Footer /></div>
  </div>
</template>
