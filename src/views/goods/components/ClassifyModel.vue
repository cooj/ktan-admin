<template>
    <co-drawer v-model="defData.visible" :title="comData.title" size="45%" :loading="btnLoading" @close="onClose"
        @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :rules="rules" label-width="110px">
            <!-- <el-tabs v-model="lang" class="-mt15px">
                <el-tab-pane label="中文" name="cn" />
                <el-tab-pane label="英文" name="en" />
            </el-tabs> -->

            <el-form-item label="上级分类" prop="pid">
                <MyCascader v-model="form.data.pid" :options="options"
                    :props="{ label: 'title', value: 'id', checkStrictly: true, emitPath: false }" filterable clearable
                    class="w100%" />
            </el-form-item>
            <el-form-item label="分类名称" prop="title">
                <el-input v-model="form.data.title" maxlength="20" placeholder="请输入分类名称" clearable />
            </el-form-item>
            <el-form-item label="英文分类名称" prop="title_en">
                <el-input v-model="form.data.title_en" maxlength="30" placeholder="请输入英文分类名称" clearable />
            </el-form-item>

            <!-- <el-form-item :label="`${props.title}图片`" prop="img">
                <UploadFile v-model="form.data.img" />
            </el-form-item> -->

            <el-form-item label="是否显示" prop="status">
                <el-radio-group v-model="form.data.status">
                    <el-radio :label="1">
                        是
                    </el-radio>
                    <el-radio :label="2">
                        否
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序" prop="sort">
                <el-input-number v-model="form.data.sort" :min="0" :max="10000" controls-position="right" placeholder=""
                    class="w100%" />
            </el-form-item>
        </el-form>
    </co-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { verifyFormData } from '@/utils/element/form'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'
import { setGoodsClassifyAdd, setGoodsClassifyUpdate } from '@/api/list'
import { deepClone } from '@/utils/other'
import { setDisableTree } from '@/utils/common/tree'

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
    menuData: [] as IGoodsClassifyItem[],
    ready: false,
    routeArr: [] as IGoodsClassifyItem[],
    type: 1,
    editShow: false, // 是否是编辑器
})
const formRef = ref<FormInstance>()

const form = reactive({
    data: {
        id: 0,
        title: '', // 菜单名称
        title_en: '', // 菜单名称（英文）
        // author: '',
        // describe: '', // 简介
        // describe_en: '', // 简介

        // content: '',
        // content_en: '',
        // img: '', // 图片
        // isHide: false, // 是否首页显示，默认否

        sort: 0, // 排序
        // read: 0, // 阅读量
        // type: '' as '' | number, // 分类id
        pid: '' as '' | number, //
        status: 1,
    },
})

const rules = reactive<FormRules>({
    title: [ // 菜单名称
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    title_en: [ // 菜单名称
        // { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],

})

const options = ref<IGoodsClassifyItem[]>([])

const comData = computed(() => {
    if (defData.type === 1) return { title: `新增${props.title}` }
    return { title: `修改${props.title}` }
})

const initDefaultData = async () => {
    if (defData.ready) return

    // const res = await MenuApi.getList()
    // if (res.code !== 200) return ElMessage.error(res.msg)

    // const list = res.data.list.filter(item => item.id === 3)

    // defData.menuData = list[0]?.children || []

    defData.ready = true
}

// 打开弹窗
const openDialog = async (row?: IGoodsClassifyItem) => {
    if (row) { // 修改
        defData.type = 2
        const dat = deepClone(props.list)

        options.value = setDisableTree(dat, row.id)

        form.data.id = row.id
        form.data.pid = row.p_id || ''
        form.data.title = row.title
        form.data.title_en = row.title_en || ''

        form.data.status = row.status || 1
        form.data.sort = row.sort
    } else {
        defData.type = 1

        options.value = props.list

        form.data.id = 0
        form.data.pid = ''
        form.data.title = ''
        form.data.title_en = ''

        form.data.status = 1
        form.data.sort = 0
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

    const data: IGoodsClassifyAdd = {
        sort: Number(form.data.sort),
        title: form.data.title?.trim() ?? '',
        title_en: form.data.title_en?.trim() ?? '',
        status: Number(form.data.status),
        p_id: form.data.pid || 0,
    }

    if (defData.type === 1) {
        const res = await ApiFunc(setGoodsClassifyAdd(data))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('添加成功')
    } else {
        const param: IGoodsClassifyEdit = {
            ...data,
            id: form.data.id,
        }

        const res = await ApiFunc(setGoodsClassifyUpdate(param))
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
