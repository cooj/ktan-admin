<template>
    <my-box v-loading="defData.loading">
        <my-form-tool :data="searchData" inline @submit.prevent="onSearch">
            <template #type="{ row }">
                <el-select v-model="row.type" clearable filterable>
                    <el-option v-for="(item, id) in defData.typeList" :key="id" :label="item" :value="id" />
                </el-select>
            </template>

            <el-button type="success" @click="onOpenAdd()">
                <i class="i-ep-plus mr5px" />
                新增{{ props.title }}
            </el-button>
        </my-form-tool>
        <div class="min-h-0 flex-1">
            <CoTable v-model:option="tableData" class="table-box" border @pagination="onHandleCurrentChange">
                <template #img="{ row }">
                    <co-image :src="row.img" :icon-size="28" :preview-src-list="[row.img]" preview-teleported
                        fit="contain" class="ma h50px w60px block!" />
                </template>
                <template #type="{ row }">
                    <el-tag v-if="row.type === 2" type="warning">
                        行业新闻
                    </el-tag>
                    <el-tag v-else type="">
                        公司新闻
                    </el-tag>
                </template>
                <template #isHide="{ row }">
                    <el-tag v-if="row.isHide" type="info">
                        否
                    </el-tag>
                    <el-tag v-else type="">
                        是
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
        <NewsModel ref="modelRef" v-bind="props" @update="initTableData" />
    </my-box>
</template>

<script lang="ts" setup>
import NewsModel from './NewsModel.vue'
import { PAGINATION } from '@/config/global'
import { getNewsList, setNewsDelete } from '@/api/list'

const props = defineProps<{
    type: number | string
    title: string
}>()
const modelRef = ref<InstanceType<typeof NewsModel>>()

const defData = reactive({
    loading: false,
    typeList: {
        1: '公司新闻',
        2: '行业新闻',
    },
    expand: false, // 是否默认展开
})

// form表单数据类型
interface FormSearchData {
    name: string
    type: string | number
}
const searchData = reactive<SearchDataType<FormSearchData>>({
    data: {
        name: '',
        type: '',
    },
    config: [
        { itemProp: { label: `${props.title}名称`, prop: 'name' }, placeholder: `请输入${props.title}名称`, width: '200' },
        { itemProp: { label: '新闻类型', prop: 'type' }, slot: true, placeholder: '', width: '160' },
    ],
    hideBtn: false,
    // showAll: true,
    searchFunc: () => initTableData(),
})

type TableDataItem = INewsGetListResponse['list'][0]
const tableData = reactive<CoTableProps<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'id', label: 'id', width: 70 },
        { property: 'img', label: '图片', width: 100, align: 'center' },
        { property: 'title', label: '标题名称', minWidth: 150 },
        { property: 'type', label: '类型', width: 150, align: 'center' },
        { property: 'isHide', label: '首页推荐', width: 150, align: 'center' },
        // { property: 'redirect', label: '重定向', width: 200 },
        // { property: 'page_path', label: '组件路径', width: 200 },
        { property: 'sort', label: '排序', width: 100, align: 'center' },
        { property: 'operate', label: '操作', width: 130, fixed: 'right', align: 'center' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

// 初始化菜单数据
const initTableData = async () => {
    const type = searchData.data.type || props.type

    const data: INewsGetList = {
        isPage: 1,
        page: tableData.pagination.page,
        pageSize: tableData.pagination.page_size,
        title: searchData.data.name?.trim() ?? '',
        type,
    }

    const res = await getNewsList(data)

    if (res.code !== 200) return ElMessage.error(res.msg)

    tableData.data = res.data.list

    tableData.pagination.total = res.data.total
}

// 打开新增菜单弹窗
const onOpenAdd = () => {
    modelRef.value?.openDialog()
}
// 打开编辑菜单弹窗
const onOpenEdit = (row: INewsGetListResponse['list'][0]) => {
    modelRef.value?.openDialog(row)
}
// 删除当前行
const onRowDel = (row: INewsGetListResponse['list'][0]) => {
    ElMessageBox.confirm('此操作将永久删除该条内容, 是否继续?', '提示', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning',
        buttonSize: 'default',
    }).then(async () => {
        const res = await setNewsDelete({ id: row.id })
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

<style lang="scss" scoped>
.table-box {
    :deep(.el-table__body-wrapper) {
        .row-info-bg {
            --el-table-tr-bg-color: var(--el-color-info-light-8);
            opacity: 0.8;
        }
    }
}
</style>
