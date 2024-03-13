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
                <template #is_open="{ row }">
                    <el-tag v-if="row.is_open" type="">
                        是
                    </el-tag>
                    <el-tag v-else type="info">
                        否
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
import LinkModel from '@/views/about/components/RecruitModel.vue'
import { PAGINATION } from '@/config/global'

import { getBannerList, getRecruitList, setBannerDelete, setRecruitDelete } from '@/api/list'

const props = defineProps<{
    // type: 1 | 2 | 5 | 6 | 7
    title: string
}>()

const modelRef = ref<InstanceType<typeof LinkModel>>()

const defData = reactive({
    loading: false,

})

type TableDataItem = IRecruitGetListResponse['list'][0]
const tableData = reactive<CoTableProps<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'id', label: 'id', width: 80 },
        { property: 'title', label: '招聘岗位', minWidth: 130 },
        // { property: 'title_en', label: '英文标题', minWidth: 150 },
        { property: 'people', label: '招聘人数', width: 120, align: 'center' },
        { property: 'address', label: '工作地区', minWidth: 120 },
        { property: 'is_open', label: '是否招聘', width: 100, align: 'center' },
        { property: 'sort', label: '排序', width: 100, align: 'center' },
        { property: 'operate', label: '操作', width: 110, fixed: 'right', align: 'center' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

// 初始化菜单数据
const initTableData = async () => {
    const data: IRecruitGetList = {
        isPage: 1,
        page: tableData.pagination.page,
        pageSize: tableData.pagination.page_size,
        // title: searchData.data.name?.trim() ?? '',
        // type: Number(searchData.data.type) || '',
    }
    const res = await getRecruitList(data)

    if (res.code !== 200) return ElMessage.error(res.msg)
    // console.log('res.data :>> ', res.data)
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
        const res = await setRecruitDelete({ id: row.id })
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
