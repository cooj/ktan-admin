<template>
    <my-box v-loading="defData.loading">
        <my-form-tool :data="searchData" inline @submit.prevent="onSearch">
            <template #status="{ row }">
                <el-select v-model="row.status" clearable filterable>
                    <el-option v-for="(item, key) in defData.statusList" :key="key" :label="item" :value="key" />
                </el-select>
            </template>
            <el-button type="success" @click="onOpenAdd()">
                <i class="i-ep-plus mr5px" />
                新增{{ props.title }}
            </el-button>
        </my-form-tool>
        <div class="min-h-0 flex-1">
            <CoTable v-model:option="tableData" class="table-box" border @pagination="onHandleCurrentChange">
                <template #createdAt="{ row }">
                    {{ formatDate(new Date(row.createdAt)) }}
                </template>

                <template #status="{ row }">
                    <el-tag v-if="row.status === 2" type="info">
                        已完成
                    </el-tag>
                    <el-tag v-else-if="row.status === 1" type="warning">
                        已沟通
                    </el-tag>
                    <el-tag v-else type="danger">
                        未处理
                    </el-tag>
                </template>

                <template #operate="{ row }">
                    <el-button size="small" text type="primary" @click.stop="onOpenEdit(row)">
                        修改
                    </el-button>
                    <el-button size="small" text type="primary" @click.stop="onRowDel(row)">
                        删除
                    </el-button>
                </template>
            </CoTable>
        </div>
        <LinkModel ref="modelRef" v-bind="props" :list="defData.statusList" @update="initTableData" />
    </my-box>
</template>

<script lang="ts" setup>
import LinkModel from '@/views/about/components/MessageModel.vue'
import { PAGINATION } from '@/config/global'

import { getMessageList, setMessageDelete } from '@/api/list'
import { formatDate } from '@/utils/common/formatTime'

const props = defineProps<{
    // type: string
    title: string
}>()

const modelRef = ref<InstanceType<typeof LinkModel>>()

const defData = reactive({
    loading: false,
    statusList: {
        0: '未处理',
        1: '已沟通',
        2: '已完成',
    },
})

// form表单数据类型
interface FormSearchData {
    name: string
    status: string | number
}
const searchData = reactive<SearchDataType<FormSearchData>>({
    data: {
        name: '',
        status: '',
    },
    config: [
        { itemProp: { label: '名称', prop: 'name' }, placeholder: '请输入客户名称', width: '200' },
        { itemProp: { label: '状态', prop: 'status' }, placeholder: '', width: '120', slot: true },
    ],
    hideBtn: false,
    // showAll: true,
    searchFunc: () => initTableData(),
})

type TableDataItem = IMessageGetListResponse['list'][0]
const tableData = reactive<CoTableProps<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'id', label: 'id', width: 70 },
        { property: 'title', label: '客户名称', minWidth: 120 },
        { property: 'phone', label: '联系号码', width: 130 },
        { property: 'email', label: '电子邮箱', width: 130 },
        { property: 'address', label: '所在地区', minWidth: 100 },
        { property: 'content', label: '备注', minWidth: 150 },
        { property: 'createdAt', label: '操作时间', width: 160 },
        { property: 'status', label: '状态', width: 100, align: 'center' },
        { property: 'operate', label: '操作', width: 110, fixed: 'right', align: 'center' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

// 初始化默认数据
const initDefaultData = async () => {

}

// 初始化菜单数据
const initTableData = async () => {
    const data: IMessageGetList = {
        isPage: 1,
        page: tableData.pagination.page,
        pageSize: tableData.pagination.page_size,
        title: searchData.data.name?.trim() ?? '',
        // type: props.type,
        status: searchData.data.status,
    }
    const res = await getMessageList(data)

    if (res.code !== 200) return ElMessage.error(res.msg)

    tableData.data = res.data.list
    tableData.pagination.total = res.data.total
}

// 打开新增菜单弹窗
const onOpenAdd = () => {
    modelRef.value?.openDialog()
}
// 打开编辑菜单弹窗
const onOpenEdit = (row: TableDataItem) => {
    modelRef.value?.openDialog(row)
}
// 删除当前行
const onRowDel = (row: TableDataItem) => {
    ElMessageBox.confirm('此操作将永久删除该条内容, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const res = await setMessageDelete({ id: row.id })
        if (res.code !== 200) return ElMessage.error(res.msg)

        ElMessage.success('删除成功')
        initTableData() // 更新列表数据
    }).catch(() => { })
}
// 查询
const onSearch = () => {
    initTableData()
}

// 分页改变
const onHandleCurrentChange = () => {
    initTableData()
}

// 加载时
onBeforeMount(() => {
    initDefaultData()
    initTableData()
})
</script>

<style lang="scss" scoped></style>
