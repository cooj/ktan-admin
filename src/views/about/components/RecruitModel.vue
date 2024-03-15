<template>
    <co-drawer v-model="defData.visible" :title="comData.title" size="60%" :loading="btnLoading" @close="onClose"
        @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :rules="rules" label-width="110px">
            <el-tabs v-model="lang" class="-mt15px">
                <el-tab-pane label="中文" name="cn" />
                <el-tab-pane label="英文" name="en" />
            </el-tabs>

            <el-form-item v-if="lang === 'cn'" label="岗位名称" prop="title">
                <el-input v-model="form.data.title" maxlength="20" placeholder="请输入岗位名称" clearable />
            </el-form-item>
            <el-form-item v-else-if="lang === 'en'" label="英文岗位名称" prop="title_en">
                <el-input v-model="form.data.title_en" maxlength="50" placeholder="请输入英文岗位名称" clearable />
            </el-form-item>
            <el-form-item label="招聘人数" prop="people">
                <el-input v-model="form.data.people" maxlength="30" placeholder="请输入招聘人数" clearable />
            </el-form-item>
            <el-form-item v-if="lang === 'cn'" label="工作地区" prop="address">
                <el-input v-model="form.data.address" maxlength="20" placeholder="请输入工作地区" clearable />
            </el-form-item>
            <el-form-item v-else-if="lang === 'en'" label="英文工作地区" prop="address_en">
                <el-input v-model="form.data.address_en" maxlength="50" placeholder="请输入英文工作地区" clearable />
            </el-form-item>

            <template v-if="lang === 'cn'">
                <el-form-item label="岗位描述" prop="describe">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.describe" placeholder="" clearable />
                </el-form-item>
                <el-form-item label="职责要求" prop="content">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.content" />
                </el-form-item>
            </template>
            <template v-else-if="lang === 'en'">
                <el-form-item label="岗位描述" prop="describe_en">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.describe_en" placeholder="" clearable />
                </el-form-item>
                <el-form-item label="英文职责要求" prop="content_en">
                    <BaseWangEditor v-if="defData.editShow" v-model="form.data.content_en" />
                </el-form-item>
            </template>
            <el-form-item label="状态" prop="isOpen">
                <el-radio-group v-model="form.data.isOpen">
                    <el-radio :label="true">
                        开启招聘
                    </el-radio>
                    <el-radio :label="false">
                        关闭招聘
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
import { setRecruitAdd, setRecruitUpdate } from '@/api/list'

const props = defineProps<{
    // type: number
    title: string
    // list: IGoodsClassifyItem[]
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
        address: '',
        address_en: '',
        people: '',
        describe: '', // 简介
        describe_en: '', // 简介

        content: '',
        content_en: '',
        isOpen: true, // 是否首页显示，默认否
        sort: 0, // 排序

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

const initDefaultData = async () => {
    if (defData.ready) return

    // const res = await MenuApi.getList()
    // if (res.code !== 200) return ElMessage.error(res.msg)

    // const list = res.data.list.filter(item => item.id === 3)

    // defData.menuData = list[0]?.children || []

    defData.ready = true
}

// 打开弹窗
const openDialog = async (row?: IRecruitGetListResponse['list'][0]) => {
    if (row) { // 修改
        defData.type = 2

        form.data.id = row.id
        form.data.title = row.title
        form.data.title_en = row.title_en || ''

        form.data.address = row.address
        form.data.address_en = row.address_en || ''

        form.data.people = row.people || ''
        form.data.describe = row.describe
        form.data.describe_en = row.describe_en || ''

        form.data.content = row.content
        form.data.content_en = row.content_en || ''

        form.data.isOpen = row.is_open
        form.data.sort = row.sort
    } else {
        defData.type = 1
        form.data.id = 0
        form.data.title = ''
        form.data.title_en = ''
        form.data.address = ''
        form.data.address_en = ''

        form.data.people = ''
        form.data.describe = ''
        form.data.describe_en = ''

        form.data.content = ''
        form.data.content_en = ''

        form.data.isOpen = true
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

    const data: IRecruitAdd = {
        sort: Number(form.data.sort),
        title: form.data.title?.trim() ?? '',
        title_en: form.data.title_en?.trim() ?? '',
        describe: form.data.describe?.trim() ?? '',
        describe_en: form.data.describe_en?.trim() ?? '',
        content: form.data.content?.trim() ?? '',
        content_en: form.data.content_en?.trim() ?? '',
        is_open: form.data.isOpen,
        address: form.data.address || '',
        address_en: form.data.address_en || '',
        people: form.data.people || '',
    }
    // console.log('data :>> ', data)
    // return false

    if (defData.type === 1) {
        const res = await ApiFunc(setRecruitAdd(data))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('添加成功')
    } else {
        const param: IRecruitEdit = {
            ...data,
            id: form.data.id,
        }

        const res = await ApiFunc(setRecruitUpdate(param))
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
