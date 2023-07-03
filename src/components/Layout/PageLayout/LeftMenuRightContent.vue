<!-- 本布局是左侧菜单右侧内容的常见视图 -->
<!-- 左侧的菜单占较小，右侧占较大. 是展示大量番剧的经典布局 -->
<!-- 同时，左侧的菜单支持在宽屏上吸附 -->
<template>
  <div class="grid lg:grid-cols-3 xl:grid-cols-7 gap-4 lg:gap-12">
    <!-- 由于 Grid 布局默认将所有子元素拉伸至总高，因此我们在这里使用 self-start 来让元素向上对齐 -->
    <div class="lg:col-span-1 xl:col-span-2 lg:self-start lg:sticky lg:top-8">
      <slot name="left"></slot>

      <div class="hidden lg:block">
        <slot name="foot"></slot>
      </div>
    </div>
    <div class="lg:col-span-2 xl:col-span-5">
      <slot name="right"></slot>
      
      <div class="lg:hidden">
        <slot name="foot"></slot>
      </div>
    </div>
  </div>
</template>
