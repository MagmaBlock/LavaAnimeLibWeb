<template>
  <NNotificationProvider placement="bottom-right">
    <NMessageProvider>
      <NaiveUIInjecter>
        <slot></slot>
      </NaiveUIInjecter>
    </NMessageProvider>
  </NNotificationProvider>
</template>
