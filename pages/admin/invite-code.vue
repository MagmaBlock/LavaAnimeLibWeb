<template>
  <NSpace vertical>
    <!-- 创建单个邀请码 -->
    <NCard title="创建单个邀请码" class="mb-4">
      <NForm
        :model="singleInviteForm"
        :rules="singleInviteRules"
        ref="singleInviteFormRef"
      >
        <NFormItem label="邀请码" path="code">
          <NInput
            v-model:value="singleInviteForm.code"
            placeholder="留空自动生成"
          />
        </NFormItem>
        <NFormItem label="过期时间" path="expiredAt">
          <NDatePicker
            v-model:value="singleInviteForm.expiredAt"
            type="datetime"
          />
        </NFormItem>
        <NButton @click="createSingleInviteCode" type="primary">创建</NButton>
      </NForm>
    </NCard>

    <!-- 批量创建邀请码 -->
    <NCard title="批量创建邀请码" class="mb-4">
      <NForm
        :model="batchInviteForm"
        :rules="batchInviteRules"
        ref="batchInviteFormRef"
      >
        <NFormItem label="数量" path="amount">
          <NInputNumber v-model:value="batchInviteForm.amount" :min="1" />
        </NFormItem>
        <NFormItem label="过期时间" path="expiredAt">
          <NDatePicker
            v-model:value="batchInviteForm.expiredAt"
            type="datetime"
          />
        </NFormItem>
        <NButton @click="createBatchInviteCodes" type="primary"
          >批量创建</NButton
        >
      </NForm>
    </NCard>

    <!-- 邀请码列表 -->
    <NCard title="邀请码列表">
      <NScrollbar x-scrollable>
        <NDataTable
          class="min-w-[720px]"
          :columns="columns"
          :data="inviteCodes ?? undefined"
          :pagination="{ pageSize: 10 }"
        />
      </NScrollbar>
    </NCard>
  </NSpace>
</template>

<script lang="ts" setup>
import {
  NCard,
  NSpace,
  NForm,
  NFormItem,
  NInput,
  NDatePicker,
  NButton,
  NInputNumber,
  NDataTable,
  useMessage,
  type FormRules,
  type DataTableColumns,
} from "naive-ui";
import type { InviteCode } from "@prisma/client";

definePageMeta({
  layout: "admin",
});

const { $client } = useNuxtApp();
const message = useMessage();

// 单个邀请码表单
const singleInviteForm = ref({
  code: "",
  expiredAt: null as number | null,
});

const singleInviteRules: FormRules = {
  code: {
    required: false,
    trigger: ["blur", "input"],
    message: "请输入邀请码或留空自动生成",
  },
};

const singleInviteFormRef = ref<null | { validate: () => Promise<boolean> }>(
  null,
);

// 批量邀请码表单
const batchInviteForm = ref({
  amount: 1,
  expiredAt: null as number | null,
});

const batchInviteRules: FormRules = {
  amount: {
    required: true,
    type: "number",
    min: 1,
    trigger: ["blur", "change"],
    message: "请输入大于0的数量",
  },
};

const batchInviteFormRef = ref<null | { validate: () => Promise<boolean> }>(
  null,
);

// 邀请码列表
const { data: inviteCodes, refresh: refreshInviteCodes } = useAsyncData(
  "inviteCodes",
  () => $client.pages.admin.inviteCode.getInviteCodes.query({}),
);

const columns: DataTableColumns<InviteCode> = [
  {
    title: "邀请码",
    key: "code",
  },
  {
    title: "创建者",
    key: "createdById",
    render: (row) => row.createdById?.toString() ?? "",
  },
  {
    title: "创建时间",
    key: "createdAt",
    render: (row) => row.createdAt.toLocaleString(),
  },
  {
    title: "状态",
    key: "status",
    render: (row) => {
      if (row.usedById) return "已使用";
      if (row.expiredAt && new Date(row.expiredAt) < new Date())
        return "已过期";
      return "可用";
    },
  },
  {
    title: "过期时间",
    key: "expiredAt",
    render: (row) =>
      row.expiredAt ? new Date(row.expiredAt).toLocaleString() : "永不过期",
  },
  {
    title: "使用者",
    key: "usedById",
    render: (row) => row.usedById?.toString() ?? "未使用",
  },
  {
    title: "操作",
    key: "actions",
    render: (row) => {
      return h(
        NButton,
        {
          size: "small",
          onClick: () => deleteInviteCode(row.code),
        },
        { default: () => "删除" },
      );
    },
  },
];

// 创建单个邀请码
const createSingleInviteCode = async () => {
  try {
    await $client.pages.admin.inviteCode.createInviteCode.mutate({
      code: singleInviteForm.value.code || undefined,
      expiredAt: singleInviteForm.value.expiredAt
        ? new Date(singleInviteForm.value.expiredAt)
        : undefined,
    });
    message.success("邀请码创建成功");
    await refreshInviteCodes();
  } catch (error: unknown) {
    if (error instanceof Error) {
      message.error("创建失败：" + error.message);
    } else {
      message.error("创建失败：未知错误");
    }
  }
};

// 批量创建邀请码
const createBatchInviteCodes = async () => {
  try {
    await $client.pages.admin.inviteCode.createManyInviteCodes.mutate({
      amount: batchInviteForm.value.amount,
      expiredAt: batchInviteForm.value.expiredAt
        ? new Date(batchInviteForm.value.expiredAt)
        : undefined,
    });
    message.success("邀请码批量创建成功");
    await refreshInviteCodes();
  } catch (error: unknown) {
    if (error instanceof Error) {
      message.error("批量创建失败：" + error.message);
    } else {
      message.error("批量创建失败：未知错误");
    }
  }
};

// 删除邀请码
const deleteInviteCode = async (code: string) => {
  try {
    await $client.pages.admin.inviteCode.deleteInviteCode.mutate(code);
    message.success("邀请码删除成功");
    await refreshInviteCodes();
  } catch (error: unknown) {
    if (error instanceof Error) {
      message.error("删除失败：" + error.message);
    } else {
      message.error("删除失败：未知错误");
    }
  }
};
</script>
