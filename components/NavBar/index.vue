<template>
  <div>
    <NavBarMobile v-if="!isLargeScreen" />
    <NavBarWide v-else />
  </div>
</template>

<script setup>
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const isLargeScreen = breakpoints.greaterOrEqual("lg");
</script>
