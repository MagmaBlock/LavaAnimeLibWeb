<template>
  <div>
    <n-input-group>
      <n-button @click="submitData">提交更新</n-button>
    </n-input-group>
    <div class="my-2 lg:grid lg:grid-cols-5">
      <div class="lg:col-span-2 lg:mr-4 h-52 sm:h-64 lg:h-72">
        <HeaderPictures :key="refresh" :customdata="headers" class="sm:rounded-md"/>
      </div>
      <div class="lg:col-span-3 overflow-scroll h-52 sm:h-64 lg:h-72">
        <pre>{{ JSON.stringify(headers, null, 2) }}</pre>
      </div>
    </div>
    <div class="md:grid md:grid-cols-3 gap-2">
      <BasicCard v-for="header, index in headers" class="flex flex-wrap gap-2 p-2">
        <n-input-group>
          <n-input-group-label>标题</n-input-group-label>
          <n-input v-model:value="header.title" placeholder="标题" type="text"/>
        </n-input-group>
        <n-input-group>
          <n-input-group-label>副标题</n-input-group-label>
          <n-input v-model:value="header.subtitle" placeholder="副标题" type="text"/>
        </n-input-group>
        <n-input-group>
          <n-input-group-label>图片链接</n-input-group-label>
          <n-input v-model:value="header.pic" placeholder="图片链接" type="text"/>
        </n-input-group>
        <n-input-group>
          <n-input-group-label>{{ header.externalUrl ? '外部链接' : '链接' }}</n-input-group-label>
          <n-input v-model:value="header.url" :placeholder="header.externalUrl ? '外部链接' : '链接'" type="text"/>
        </n-input-group>
        <n-space class="flex place-items-center">
          <n-switch v-model:value="header.externalUrl"/>
          外部链接
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
import {homeHeaderGet, LavaAnimeAPI} from '@/common/api'
import BasicCard from '../../components/BasicCard.vue';

export default {
  data() {
    return {
      headers: [],
      refresh: 0
    };
  },
  methods: {
    async submitData() {
      try {
        let result = await LavaAnimeAPI.post('/v2/home/header/update', {data: this.headers})
        $message.success(result.data.message)
      } catch (error) {
        console.error(error);
      }
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
      this.refresh++
    },
    remove(index) {
      this.headers.splice(index, 1)
      this.refresh++
    },
    add() {
      this.headers.push({
        title: '标题', subtitle: '副标题', pic: '/Home/headerPic/LavaAnime.jpg', url: ''
      })
      this.refresh++
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
  components: {HeaderPictures, BasicCard}
}
</script>