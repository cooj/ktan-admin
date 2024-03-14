<template>
    <my-box v-loading="defData.loading">
        <my-form-tool :data="searchData" inline @submit.prevent="onSearch">
            <template #goods_id="{ row }">
                <el-select v-model="row.goods_id" clearable filterable>
                    <el-option v-for="item in defData.goodsList" :key="item.id" :label="item.title" :value="item.id" />
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
        <LinkModel ref="modelRef" v-bind="props" :list="defData.goodsList" @update="initTableData" />
    </my-box>
</template>

<script lang="ts" setup>
import LinkModel from '@/views/about/components/FileModel.vue'
import { PAGINATION } from '@/config/global'

import { getBannerList, getGoodsList, setBannerDelete } from '@/api/list'

const props = defineProps<{
    type: string
    title: string
}>()

const modelRef = ref<InstanceType<typeof LinkModel>>()

const defData = reactive({
    loading: false,
    goodsList: [] as IGoodsGetListResponse['list'],
})

// form表单数据类型
interface FormSearchData {
    name: string
    goods_id: string | number
}
const searchData = reactive<SearchDataType<FormSearchData>>({
    data: {
        name: '',
        goods_id: '',
    },
    config: [
        { itemProp: { label: '标题', prop: 'name' }, placeholder: '请输入标题', width: '200' },
        { itemProp: { label: '商品名称', prop: 'goods_id' }, placeholder: '', width: '240', slot: true },
    ],
    hideBtn: false,
    // showAll: true,
    searchFunc: () => initTableData(),
})

type TableDataItem = IBannerGetListResponse['list'][0]
const tableData = reactive<CoTableProps<TableDataItem>>({
    data: [],
    tableHeader: [
        { property: 'id', label: 'id', width: 80 },
        { property: 'img', label: '图片', width: 120, align: 'center' },
        { property: 'title', label: '标题', minWidth: 130 },
        // { property: 'title_en', label: '英文标题', minWidth: 150 },
        { property: 'href', label: '文件链接地址', minWidth: 150 },
        { property: 'isHide', label: '是否隐藏', width: 100, align: 'center' },
        { property: 'sort', label: '排序', width: 100, align: 'center' },
        { property: 'operate', label: '操作', width: 110, fixed: 'right', align: 'center' },
    ],
    pagination: {
        ...PAGINATION,
    },
})

// 初始化默认数据
const initDefaultData = async () => {
    const res = await getGoodsList({ isPage: 0 })
    if (res.code !== 200) return ElMessage.error(res.msg)

    defData.goodsList = res.data.list
}

// 初始化菜单数据
const initTableData = async () => {
    const data: IBannerGetList = {
        isPage: 1,
        page: tableData.pagination.page,
        pageSize: tableData.pagination.page_size,
        title: searchData.data.name?.trim() ?? '',
        type: props.type,
        goods_id: searchData.data.goods_id,
    }
    const res = await getBannerList(data)

    if (res.code !== 200) return ElMessage.error(res.msg)

    tableData.data = res.data.list
    tableData.pagination.total = res.data.total
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
    initDefaultData()
    initTableData()
})
</script>

<style lang="scss" scoped></style>
