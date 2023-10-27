<template>
  <div>
    <slot name="head"></slot>
    <div class="container mx-auto sm:p-6 md:p-8">
      <slot></slot>
    </div>
    <slot name="bottom"></slot>
  </div>
</template>
