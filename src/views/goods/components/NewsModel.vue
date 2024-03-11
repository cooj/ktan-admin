<template>
    <co-drawer v-model="defData.visible" :title="comData.title" size="60%" :loading="btnLoading" @close="onClose"
        @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :rules="rules" label-width="110px">
            <el-tabs v-model="lang" class="-mt15px">
                <el-tab-pane label="中文" name="cn" />
                <el-tab-pane label="英文" name="en" />
            </el-tabs>

            <el-form-item v-if="lang === 'cn'" label="标题" prop="title">
                <el-input v-model="form.data.title" maxlength="20" placeholder="请输入标题" clearable />
            </el-form-item>
            <el-form-item v-else-if="lang === 'en'" label="英文标题" prop="title_en">
                <el-input v-model="form.data.title_en" maxlength="50" placeholder="请输入英文标题" clearable />
            </el-form-item>

            <el-form-item v-if="lang === 'cn'" label="副标题" prop="sub_title">
                <el-input v-model="form.data.sub_title" maxlength="20" placeholder="请输入副标题" clearable />
            </el-form-item>
            <el-form-item v-else-if="lang === 'en'" label="英文副标题" prop="sub_title_en">
                <el-input v-model="form.data.sub_title_en" maxlength="50" placeholder="请输入英文副标题" clearable />
            </el-form-item>

            <!-- <el-form-item label="发布者" prop="author">
                <el-input v-model="form.data.author" maxlength="30" placeholder="请输入名称" clearable />
            </el-form-item> -->
            <el-form-item label="商品分类" prop="type">
                <!-- <el-select v-model="form.data.type" clearable filterable>
                    <el-option v-for="item in props.list" :key="item.id" :label="item.title" :value="item.id" />
                </el-select> -->
                <MyCascader v-model="form.data.type" :options="props.list"
                    :props="{ label: 'title', value: 'id', checkStrictly: true, emitPath: false }" filterable clearable
                    class="w100%" />
            </el-form-item>
            <el-form-item :label="`${props.title}图片`" prop="img">
                <!-- <UploadFile v-model="form.data.img" /> -->
                <CoUploadImage v-model="form.data.img" :limit="9" />
            </el-form-item>

            <template v-if="lang === 'cn'">
                <el-form-item label="简介" prop="describe">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.describe" placeholder="" clearable />
                </el-form-item>
                <el-form-item label="详细内容" prop="content">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.content" />
                </el-form-item>
                <el-form-item label="规格对比" prop="contrast">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.contrast" />
                </el-form-item>
                <el-form-item label="包装附件" prop="annex">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.annex" />
                </el-form-item>
            </template>
            <template v-else-if="lang === 'en'">
                <el-form-item label="英文简介" prop="describe_en">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.describe_en" placeholder="" clearable />
                </el-form-item>
                <el-form-item label="英文详细内容" prop="content_en">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.content_en" />
                </el-form-item>
                <el-form-item label="英文规格对比" prop="contrast">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.contrast_en" />
                </el-form-item>
                <el-form-item label="英文包装附件" prop="annex">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.annex_en" />
                </el-form-item>
            </template>
            <el-form-item label="热门产品" prop="isHide">
                <el-radio-group v-model="form.data.isHide">
                    <el-radio :label="true">
                        是
                    </el-radio>
                    <el-radio :label="false">
                        否
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="form.data.sort" :min="0" :max="10000" controls-position="right" placeholder=""
                    class="w100%" />
            </el-form-item>
            <el-form-item label="文件关联" label-width="50%" class="mb0!">
                <template #label>
                    <div class="w100%">
                        <b>文件关联</b>
                        <span class="text-12px">(详细更改请通过文件管理进行操作)</span>
                    </div>
                </template>
                <!-- <el-input-number v-model="form.data.read" :precision="0" :min="0" :max="10 ** 14"
                    controls-position="right" /> -->
            </el-form-item>
            <CoTable v-model:option="tableDataGoods" :data="form.data.links" auto-height border>
                <template #title="{ row, $index }">
                    <el-form-item label="" label-width="auto" :prop="`tableData.${$index}.title`">
                        <!--  :rules="$index >= 0 ? rules.required : []" -->
                        <el-input v-model="row.title" class="w100%" />
                    </el-form-item>
                </template>
                <template #content="{ row, $index }">
                    <el-form-item label="" label-width="auto" :prop="`tableData.${$index}.content`">
                        <el-input v-model="row.content" class="w100%" />
                    </el-form-item>
                </template>

                <template #href="{ row }">
                    <UploadFile v-model="row.href" type="text" accept="*" />
                </template>
                <template #operateHeader>
                    <el-button @click="onAddItem">
                        <el-icon class="ma!">
                            <ele-Plus />
                        </el-icon>
                    </el-button>
                </template>
                <template #operate="{ row }">
                    <el-button @click="onRemoveItem(row)">
                        <el-icon class="ma!">
                            <ele-Delete />
                        </el-icon>
                    </el-button>
                </template>
            </CoTable>
        </el-form>
    </co-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { verifyFormData } from '@/utils/element/form'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'
import { setGoodsAdd, setGoodsUpdate } from '@/api/list'
import { PAGINATION } from '@/config/global'

const props = defineProps<{
    // type: number
    title: string
    list: IGoodsClassifyItem[]
}>()

const emits = defineEmits<{
    update: []
}>()

const lang = ref<LanguageType>('cn')
const defData = reactive({
    visible: false, // 弹窗显示
    menuData: [] as MenuApi_MenuItem[],
    ready: false,
    routeArr: [] as MenuApi_MenuItem[],
    type: 1,
    editShow: false, // 是否是编辑器
})
const formRef = ref<FormInstance>()

const form = reactive({
    data: {
        id: 0,
        title: '', // 菜单名称
        title_en: '', // 菜单名称（英文）
        sub_title: '',
        sub_title_en: '',
        author: '',
        describe: '', // 简介
        describe_en: '', // 简介

        content: '',
        content_en: '',

        contrast: '',
        contrast_en: '',
        annex: '',
        annex_en: '',

        img: [] as string[], // 图片
        isHide: false, // 是否首页显示，默认否

        sort: 0, // 排序
        read: 0, // 阅读量
        type: '' as '' | number, // 分类id

        links: [] as Partial<ILinkItem>[],

    },
})

const rules = reactive<FormRules>({
    required: [
        { required: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    noRequired: [{ message: '', trigger: 'blur' }],
    title: [ // 菜单名称
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    title_en: [ // 菜单名称
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],

})

const comData = computed(() => {
    if (defData.type === 1) return { title: `新增${props.title}` }
    return { title: `修改${props.title}` }
})

const tableDataGoods = reactive<CoTableProps<ILinkItem>>({
    data: [],
    tableHeader: [
        { property: 'title', label: '标题', minWidth: 85 },
        // { property: 'title_en', label: '英文标题', minWidth: 160 },
        { property: 'content', label: '简介', minWidth: 100 },
        // { property: 'content_en', label: '英文简介', minWidth: 150 },
        { property: 'href', label: '文件', width: 100, align: 'center' },
        { property: 'operate', label: '操作', width: 85, fixed: 'right', align: 'center' },

    ],
    pagination: {
        ...PAGINATION,
        // total: 0,
    },
})

// 增加
const onAddItem = () => {
    const dat: ILinkItem = {
        id: 1,
        c_id: 0,
        title: '',
        title_en: '',
        content: '',
        content_en: '',
        img: '',
        href: '',
        sort: 0,
        type: 1,
        isHide: false,
        createdAt: '2024-03-08T08:46:12.839Z',
        updatedAt: '2024-03-08T08:46:12.839Z',
        productId: 1,
    }

    form.data.links.push(dat)
}
// 移除
const onRemoveItem = (row: ILinkItem) => {
    const index = form.data.links.indexOf(row)
    if (index >= 0) form.data.links.splice(index, 1)
}

const initDefaultData = async () => {
    if (defData.ready) return

    // const res = await MenuApi.getList()
    // if (res.code !== 200) return ElMessage.error(res.msg)

    // const list = res.data.list.filter(item => item.id === 3)

    // defData.menuData = list[0]?.children || []

    defData.ready = true
}

// 打开弹窗
const openDialog = async (row?: IGoodsGetListResponse['list'][0]) => {
    if (row) { // 修改
        defData.type = 2

        form.data.id = row.id
        form.data.title = row.title
        form.data.title_en = row.title_en || ''

        form.data.sub_title = row.sub_title
        form.data.sub_title_en = row.sub_title_en || ''

        form.data.author = row.author || ''
        form.data.describe = row.describe
        form.data.describe_en = row.describe_en || ''

        const imgs = row.links.filter(item => item.type === 1).map(item => item.img)
        form.data.img = imgs
        const links = row.links.filter(item => item.type === 2).map((item) => {
            return {
                id: item.id || 0,
                title: item.title,
                content: item.content || '',
                href: item.href || '',
            }
        })
        form.data.links = links

        form.data.content = row.content
        form.data.content_en = row.content_en || ''

        form.data.contrast = row.contrast || ''
        form.data.contrast_en = row.contrast_en || ''
        form.data.annex = row.annex || ''
        form.data.annex_en = row.annex_en || ''

        form.data.isHide = row.isHide
        form.data.sort = row.sort

        form.data.type = row.type || ''
        form.data.read = row.read || 0
    } else {
        defData.type = 1
        form.data.id = 0
        form.data.title = ''
        form.data.title_en = ''
        form.data.sub_title = ''
        form.data.sub_title_en = ''

        form.data.author = ''
        form.data.describe = ''
        form.data.describe_en = ''

        form.data.img = []
        form.data.links = []
        form.data.content = ''
        form.data.content_en = ''
        form.data.contrast = ''
        form.data.contrast_en = ''
        form.data.annex = ''
        form.data.annex_en = ''

        form.data.isHide = false
        form.data.sort = 0

        form.data.type = ''
        form.data.read = 0
    }

    await initDefaultData()
    defData.editShow = true
    defData.visible = true
}

const onReset = () => {
    formRef.value?.resetFields() // 清空表单
}

// 关闭弹窗
const onClose = () => {
    onReset()
    defData.editShow = false
    defData.visible = false
}

const [ApiFunc, btnLoading] = useLoadingSubmit()
// 确定
const onConfirm = useThrottleFn(async () => {
    const isRun = await verifyFormData(formRef.value)
    if (!isRun) return

    const links = form.data.links.filter(item => !!item.href).map((item) => {
        return {
            img: '',
            href: item.href || '',
            title: item.title || '',
            content: item.content || '',
            type: 2,
        }
    })
    form.data.img.forEach((item) => {
        if (item) {
            links.push({
                img: item,
                href: '',
                title: '',
                content: '',
                type: 1,
            })
        }
    })

    const data: IGoodsAdd = {
        sort: Number(form.data.sort),
        title: form.data.title?.trim() ?? '',
        title_en: form.data.title_en?.trim() ?? '',
        // img: form.data.img?.trim() ?? '',
        // author: form.data.author?.trim() ?? '',
        describe: form.data.describe?.trim() ?? '',
        describe_en: form.data.describe_en?.trim() ?? '',
        content: form.data.content?.trim() ?? '',
        content_en: form.data.content_en?.trim() ?? '',
        isHide: form.data.isHide,
        type: 0,
        read: form.data.read || 0,
        img: '',
        sub_title: form.data.sub_title || '',
        sub_title_en: form.data.sub_title_en || '',
        contrast: form.data.contrast || '',
        contrast_en: form.data.contrast_en || '',
        annex: form.data.annex || '',
        annex_en: form.data.annex_en || '',
        classifyId: Number(form.data.type),
        links,
    }
    // console.log('data :>> ', data)
    // return false

    if (defData.type === 1) {
        const res = await ApiFunc(setGoodsAdd(data))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('添加成功')
    } else {
        const param: IGoodsEdit = {
            ...data,
            id: form.data.id,
        }

        const res = await ApiFunc(setGoodsUpdate(param))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('修改成功')
    }

    emits('update') // 重新加载列表
    onClose() // 关闭弹窗
}, 800)

defineExpose({
    openDialog,
})
</script>

<style lang="scss" scoped></style>
