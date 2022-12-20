<template>
  <div class="flex flex-wrap gap-8">
    <div>
      <n-form>
        <n-form-item label="生成数量">
          <n-input-number class="max-w-xs" v-model:value="amount" placeholder="生成数量" clearable />
        </n-form-item>
        <n-form-item label="是否启用时间限制">
          <n-switch v-model:value="timeLimit" />
        </n-form-item>
      </n-form>
      <n-form :disabled="!timeLimit">
        <n-form-item label="快速设定几天后失效">
          <n-input-number class="max-w-xs" v-model:value="lateDays" placeholder="晚几天" clearable />
        </n-form-item>
        <n-form-item label="失效时间">
          <n-date-picker v-model:value="expirationTime" type="datetime" clearable />
        </n-form-item>
      </n-form>
    </div>
    <n-button @click="send">确认生成</n-button>
    <div class="select-text">
      <div v-for="code in result">
        {{ code.code }} <span v-if="code.expirationTime">{{ code.expirationTime }}</span>
      </div>
    </div>

  </div>
</template>

<script>
import { LavaAnimeAPI } from '../../common/api.js';


export default {
  data() {
    return {
      amount: 1,
      timeLimit: false,
      lateDays: 1,
      expirationTime: null,
      result: []
    };
  },
  methods: {
    async send() {
      if (this.amount < 1) return
      try {
        let add = await LavaAnimeAPI.post('/v2/user/invite/new', {
          amount: this.amount,
          expirationTime: this.timeLimit ? this.expirationTime : undefined
        })
        if (add.data.code = 200) {
          $message.success(add.data.message)
          this.result = add.data.data
        }
      } catch (error) {
        console.error(error);
      }
    },
    setTimeDays(day) {
      this.expirationTime = new Date().getTime() + 1000 * 60 * 60 * 24 * day
    }
  },
  mounted() {
    this.setTimeDays(1)
  },
  watch: {
    lateDays(day) {
      this.setTimeDays(day)
    }
  }
}
</script>