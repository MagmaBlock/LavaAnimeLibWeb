<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
    <div class="col-span-1">
      <n-form>
        <n-form-item label="生成数量">
          <n-input-number
            class="max-w-xs"
            v-model:value="amount"
            placeholder="生成数量"
            clearable
          />
        </n-form-item>
        <n-form-item label="开启到期时间">
          <n-switch v-model:value="timeLimit" />
        </n-form-item>
      </n-form>
      <n-form :disabled="!timeLimit">
        <n-form-item label="快速设定几天后失效">
          <n-input-number
            class="max-w-xs"
            v-model:value="lateDays"
            placeholder="晚几天"
            clearable
          />
        </n-form-item>
        <n-form-item label="失效时间">
          <n-date-picker
            v-model:value="expirationTime"
            type="datetime"
            clearable
          />
        </n-form-item>
      </n-form>
      <n-button secondary @click="send">确认生成</n-button>
    </div>
    <div class="col-span-2">
      <n-table v-if="allCodes.length">
        <thead>
          <tr>
            <th>邀请码</th>
            <th>截至</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="code in allCodes">
            <td class="select-text">{{ code.code }}</td>
            <td class="select-text">
              <n-time v-if="code.expirationTime" :time="code.expirationTime" />
            </td>
            <td>
              <n-button
                size="small"
                type="error"
                secondary
                @click="deleteCode(code.code)"
                >删除</n-button
              >
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>

<script>
import { LavaAnimeAPI } from "../../common/api.js";

export default {
  data() {
    return {
      amount: 1,
      timeLimit: false,
      lateDays: 3,
      expirationTime: null,
      allCodes: [],
    };
  },
  methods: {
    async send() {
      if (this.amount < 1) return;
      try {
        let add = await LavaAnimeAPI.post("/v2/user/invite/new", {
          amount: this.amount,
          expirationTime: this.timeLimit ? this.expirationTime : undefined,
        });
        if ((add.data.code = 200)) {
          $message.success(add.data.message);
          this.allVaildCodes();
        }
      } catch (error) {
        console.error(error);
      }
    },
    setTimeDays(day) {
      this.expirationTime = new Date().getTime() + 1000 * 60 * 60 * 24 * day;
    },
    async allVaildCodes() {
      try {
        let result = await LavaAnimeAPI.get("/v2/admin/invite/all-valid-codes");
        if (result.data?.code == 200) {
          this.allCodes = result.data.data;
        }
      } catch (error) {
        console.error(error);
      }
    },
    async deleteCode(code) {
      try {
        let result = await LavaAnimeAPI.post("/v2/admin/invite/delete-codes", {
          codes: [code],
        });
        if (result.data?.code == 200) $message.success("成功");
      } catch (error) {
        console.error(error);
        $message.error("删除失败");
      }
      this.allVaildCodes();
    },
  },
  mounted() {
    this.setTimeDays(1);
    this.allVaildCodes();
  },
  watch: {
    lateDays(day) {
      this.setTimeDays(day);
    },
  },
};
</script>
