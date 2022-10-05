<template>
  <div>
    <n-input-group>
      <n-input v-model:value="password" type="password" placeholder="管理密码" />
      <n-button @click="submitData">提交更新</n-button>
    </n-input-group>
    <BasicCard class="px-4 py-2 mt-2">
      {{result}}
    </BasicCard>
    <div class="lg:flex my-2">
      <div class="lg:basis-1/3 lg:mr-4">
        <HeaderPictures class="sm:rounded-md h-52" :customdata="headers" v-if="display" />
      </div>
      <div class="lg:basis-2/3 overflow-scroll h-52">
        <pre>{{ JSON.stringify(headers, null, 2) }}</pre>
      </div>
    </div>
    <div class="md:grid md:grid-cols-3 gap-2">
      <BasicCard class="flex flex-wrap gap-2 p-2" v-for="header, index in headers">
        <n-input-group>
          <n-input-group-label>标题</n-input-group-label>
          <n-input v-model:value="header.title" type="text" placeholder="标题" />
        </n-input-group>
        <n-input-group>
          <n-input-group-label>副标题</n-input-group-label>
          <n-input v-model:value="header.subtitle" type="text" placeholder="副标题" />
        </n-input-group>
        <n-input-group>
          <n-input-group-label>图片链接</n-input-group-label>
          <n-input v-model:value="header.pic" type="text" placeholder="图片链接" />
        </n-input-group>
        <n-input-group>
          <n-input-group-label>{{ header.externalUrl ? '外部链接' : '链接' }}</n-input-group-label>
          <n-input v-model:value="header.url" type="text" :placeholder="header.externalUrl ? '外部链接' : '链接'" />
        </n-input-group>
        <n-space class="flex place-items-center">
          <n-switch v-model:value="header.externalUrl" /> 外部链接
          <n-button size="small" @click="move(index, -1)">上移</n-button>
          <n-button size="small" @click="move(index, 1)">下移</n-button>
          <n-button size="small" @click="remove(index)">删除</n-button>
        </n-space>
      </BasicCard>
      <BasicCard class="flex p-2">
        <n-button @click="add">添加</n-button>
      </BasicCard>
    </div>
  </div>
</template>

<script>
import HeaderPictures from '../../components/Home/HeaderPictures.vue';
import { homeHeaderGet, homeHeaderUpdate } from '../../common/api'
import BasicCard from '../../components/BasicCard.vue';

export default {
  data() {
    return {
      headers: [],
      password: '',
      result: '尚未提交',
      display: true
    };
  },
  methods: {
    async submitData() {
      this.result = await homeHeaderUpdate(this.headers, this.password)
      console.log(this.result);
      this.headers = await homeHeaderGet();
    },
    move(index, go) {
      if (go !== 1 && go !== -1) return // 限制步数
      if (index + go >= this.headers.length) return console.log('越界');
      if (index + go < 0) return console.log('越界');
      let thisEle = this.headers[index]
      let nextEle = this.headers[index + go]
      this.headers[index] = nextEle
      this.headers[index + go] = thisEle
      this.regen()
    },
    remove(index) {
      this.headers.splice(index, 1)
      this.regen()
    },
    add() {
      this.headers.push({
        title: '标题', subtitle: '副标题', pic: '/Home/headerPic/LavaAnime.jpg', url: ''
      })
      this.regen()
    },
    regen() {
      this.display = false
      setTimeout(() => {
        this.display = true
      }, 1);
    }
  },
  async mounted() {
    this.headers = await homeHeaderGet();
    this.password = localStorage.getItem('adminPassword') || ''
  },
  watch: {
    password(newValue) {
      localStorage.setItem('adminPassword', newValue)
    }
  },
  components: { HeaderPictures, BasicCard }
}
</script>