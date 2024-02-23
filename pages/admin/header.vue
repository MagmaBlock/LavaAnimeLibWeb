<template>
  <div>
    <NInputGroup>
      <NButton @click="submitData">提交更新</NButton>
    </NInputGroup>
    <div class="my-2 lg:grid lg:grid-cols-5">
      <div class="lg:col-span-2 lg:mr-4 h-52 sm:h-64 lg:h-72">
        <HomeHeaderPicture
          class="sm:rounded-md"
          :customdata="headers"
          :key="refresh"
        />
      </div>
      <div class="lg:col-span-3 overflow-scroll h-52 sm:h-64 lg:h-72">
        <pre>{{ JSON.stringify(headers, null, 2) }}</pre>
      </div>
    </div>
    <div class="md:grid md:grid-cols-3 gap-2">
      <div class="flex flex-wrap gap-2" v-for="(header, index) in headers">
        <NInputGroup>
          <NInputGroupLabel>标题</NInputGroupLabel>
          <NInput v-model:value="header.title" type="text" placeholder="标题" />
        </NInputGroup>
        <NInputGroup>
          <NInputGroupLabel>副标题</NInputGroupLabel>
          <NInput
            v-model:value="header.subtitle"
            type="text"
            placeholder="副标题"
          />
        </NInputGroup>
        <NInputGroup>
          <NInputGroupLabel>图片链接</NInputGroupLabel>
          <NInput
            v-model:value="header.pic"
            type="text"
            placeholder="图片链接"
          />
        </NInputGroup>
        <NInputGroup>
          <NInputGroupLabel>{{
            header.externalUrl ? "外部链接" : "链接"
          }}</NInputGroupLabel>
          <NInput
            v-model:value="header.url"
            type="text"
            :placeholder="header.externalUrl ? '外部链接' : '链接'"
          />
        </NInputGroup>
        <NSpace class="flex place-items-center">
          <NSwitch v-model:value="header.externalUrl" />外部链接
          <NSwitch v-model:value="header.video" />为视频
          <NButton size="small" @click="move(index, -1)">上移</NButton>
          <NButton size="small" @click="move(index, 1)">下移</NButton>
          <NButton size="small" @click="remove(index)">删除</NButton>
        </NSpace>
      </div>
      <div class="flex">
        <NButton @click="add">添加</NButton>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({
  layout: "admin",
});

export default {
  data() {
    return {
      headers: [],
      refresh: 0,
    };
  },
  methods: {
    async submitData() {
      try {
        let result = await LavaAnimeAPI.post("/v2/home/header/update", {
          data: this.headers,
        });
        $message.success(result.data.message);
      } catch (error) {
        console.error(error);
      }
      this.headers = await homeHeaderGet();
    },
    move(index, go) {
      if (go !== 1 && go !== -1) return; // 限制步数
      if (index + go >= this.headers.length) return console.log("越界");
      if (index + go < 0) return console.log("越界");
      let thisEle = this.headers[index];
      this.headers[index] = this.headers[index + go];
      this.headers[index + go] = thisEle;
      this.refresh++;
    },
    remove(index) {
      this.headers.splice(index, 1);
      this.refresh++;
    },
    add() {
      this.headers.push({
        title: "标题",
        subtitle: "副标题",
        pic: "/Home/headerPic/LavaAnime.jpg",
        url: "",
      });
      this.refresh++;
    },
  },
  async mounted() {
    this.headers = await homeHeaderGet();
    this.password = localStorage.getItem("adminPassword") || "";
  },
  watch: {
    password(newValue) {
      localStorage.setItem("adminPassword", newValue);
    },
  },
};
</script>
