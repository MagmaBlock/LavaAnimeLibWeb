<template>
  <div>
    <div class="sticky top-0 z-10">
      <slot name="head"></slot>
    </div>
    <div class="container mx-auto p-6 md:p-8">
      <slot></slot>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>
