<template>
  <div>
    <div class="flex transition-all">
      <n-popover trigger="manual" :show="showPre" placement="bottom" width="trigger" :show-arrow="false" raw>
        <template #trigger>
          <!-- 输入框 -->
          <input type="text" enterkeyhint="search" placeholder="进行搜索..." class="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500
            ease-in duration-100 w-full py-1 px-2 rounded" @keydown="inputKeyHandler" @focus="focusHandler"
            @blur="showPre = false; activeValue = -1" :value="search"
            @input="$emit('update:search', $event.target.value)" />
        </template>
        <!-- 弹出总容器 -->
        <div
          class="grid grid-cols-1 bg-white dark:bg-zinc-800 rounded overflow-hidden ring-2 ring-blue-500 select-none">
          <!-- 子候选项 -->
          <span v-for="value, index in preSearchValues" class="py-1 px-2 whitespace-nowrap cursor-pointer"
            @pointerenter="activeValue = index" @pointerleave="activeValue = -1" @click="$emit('search', value)"
            :class="activeValue == index ? 'bg-gray-200 dark:bg-zinc-700' : ''">
            <div class="text-ellipsis overflow-hidden">
              {{ value }}
            </div>
          </span>
        </div>
      </n-popover>
      <!-- 搜索按钮 -->
      <div class="bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 ease-in duration-100
        whitespace-nowrap py-1 px-2 ml-2 rounded text-center cursor-pointer" @click="$emit('search', search)">
        <i class="bi bi-search"></i>
      </div>
    </div>
  </div>
</template>

<script>
import { LavaAnimeAPI } from '../../common/api.js'

export default {
  data() {
    return {
      showPre: false,
      preSearchValues: [],
      preSearchLock: false,
      activeValue: -1,
      haveFocused: false
    }
  },
  props: {
    search: String
  },
  emits: ['search', 'update:search'],
  watch: {
    search(newV, oldV) {
      // 监听搜索词改变
      let search = newV.trim()
      if (search) {
        this.preSearch(search)
      } else {
        this.showPre = false
        this.preSearchValues = []
      }
    },
  },
  methods: {
    inputKeyHandler(key) {
      if (key.key == 'ArrowDown') {
        key.preventDefault()
        if (this.activeValue === -1) {
          this.activeValue = 0
          return
        }
        if (this.activeValue < this.preSearchValues.length - 1) {
          this.activeValue++
        } else {
          this.activeValue = -1
        }
      }
      if (key.key == 'ArrowUp') {
        key.preventDefault()
        if (this.activeValue === -1) {
          this.activeValue = this.preSearchValues.length - 1
          return
        }
        if (this.activeValue > 0) {
          this.activeValue--
        } else {
          this.activeValue = -1
        }
      }
      if (key.key == 'Enter') {
        if (this.activeValue == -1) {
          this.$emit('search', this.search)
        }
        else {
          this.$emit('search', this.preSearchValues[this.activeValue])
        }
      }
    },
    focusHandler() {
      this.haveFocused = true
      if (this.preSearchValues.length > 0) {
        this.showPre = true
      }
    },
    async preSearch(value) {
      value = value.trim();
      if (!value || this.preSearchLock) return; // 如果搜索值为空或正在节流则不继续请求
      this.preSearchLock = true; // Lock
      try {
        let results = (await LavaAnimeAPI.get("/v2/search/quick", { params: { value: value } })).data;
        // 如果有结果则显示结果
        if (results.code == 200 && results.data.length > 0) {
          this.preSearchValues = results.data;
          if (this.haveFocused) this.showPre = true
          console.log(`Received ${results.data.length} preSearchValues from server.`);
        } else {
          this.showPre = false
          console.log('No preSearchValues, hide');
        }
      } catch (error) {
        console.error('预搜索发生错误: ', error);
      }
      setTimeout(() => {
        this.preSearchLock = false;
      }, 500); // 0.5 秒可触发一次防止网络请求阻塞
    },
  }
}
</script>