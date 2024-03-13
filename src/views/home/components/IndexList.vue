<template>
    <my-box v-loading="defData.loading">
        <div class="mb20px">
            <span class="mr20px text-16px font-bold">{{ props.title }}</span>
            <el-button type="success" @click="onOpenAdd">
                <i class="i-ep-plus mr5px" />
                新增
            </el-button>
            <el-button @click="onSearch">
                <i class="i-ep-refresh mr5px" />
                刷新
            </el-button>
        </div>
        <div class="min-h-0 flex-1">
            <CoTable v-model:option="tableData" class="table-box" border @pagination="onHandleCurrentChange">
                <template #img="{ row }">
                    <co-image :src="row.img" :icon-size="28" :preview-src-list="[row.img]" preview-teleported
                        fit="contain" class="ma h50px w100px block!" />
                </template>

                <template #isHide="{ row }">
                    <el-tag v-if="row.isHide" type="info">
                        隐藏
                    </el-tag>
                    <el-tag v-else type="">
                        显示
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
        <LinkModel ref="modelRef" v-bind="props" @update="initTableData" />
    </my-box>
</template>

<script lang="ts" setup>
import LinkModel from '@/views/home/components/BannerModel.vue'
import { PAGINATION } from '@/config/global'

import { getBannerList, setBannerDelete } from '@/api/list'

const props = defineProps<{
    type: 1 | 2 | 5 | 6 | 7
    title: string
}>()

const modelRef = ref<InstanceType<typeof LinkModel>>()

const defData = reactive({
    loading: false,

})

type TableDataItem = IBannerGetListResponse['list'][0]
const tableData = reactive<CoTableProps<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'id', label: 'id', width: 80 },
        { property: 'img', label: '图片', width: 120, align: 'center' },
        { property: 'title', label: '标题', minWidth: 130 },
        { property: 'title_en', label: '英文标题', minWidth: 150, other: { isHide: [6, 7].includes(props.type) } },
        { property: 'href', label: '链接地址', minWidth: 150, other: { isHide: [6, 7].includes(props.type) } },
        { property: 'isHide', label: '是否隐藏', width: 100, align: 'center' },
        { property: 'sort', label: '排序', width: 100, align: 'center' },
        { property: 'operate', label: '操作', width: 110, fixed: 'right', align: 'center' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

// 初始化菜单数据
const initTableData = async () => {
    const res = await getBannerList({ type: props.type })

    if (res.code !== 200) return ElMessage.error(res.msg)

    tableData.data = res.data.list
    // tableData.pagination.total = res.total
}

// 打开新增菜单弹窗
const onOpenAdd = () => {
    modelRef.value?.openDialog()
}
// 打开编辑菜单弹窗
const onOpenEdit = (row: IBannerGetListResponse['list'][0]) => {
    modelRef.value?.openDialog(row)
}
// 删除当前行
const onRowDel = (row: IBannerGetListResponse['list'][0]) => {
    ElMessageBox.confirm('此操作将永久删除该条内容, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const res = await setBannerDelete({ id: row.id })
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
    initTableData()
})
</script>

<style lang="scss" scoped></style>
