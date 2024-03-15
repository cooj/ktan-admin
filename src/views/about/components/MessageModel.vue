<template>
    <co-drawer v-model="defData.visible" :title="comData.title" size="40%" :loading="btnLoading" @close="onClose"
        @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :rules="rules" label-width="110px">
            <el-form-item label="客户名称:" prop="title">
                <el-input v-model="form.data.title" maxlength="20" placeholder="请输入客户名称" clearable />
            </el-form-item>
            <el-form-item label="联系方式:" prop="phone">
                <el-input v-model="form.data.phone" maxlength="20" placeholder="请输入联系方式" clearable />
            </el-form-item>
            <el-form-item label="电子邮箱:" prop="email">
                <el-input v-model="form.data.email" maxlength="30" placeholder="请输入电子邮箱" clearable />
            </el-form-item>
            <el-form-item label="工作地区:" prop="address">
                <el-input v-model="form.data.address" maxlength="20" placeholder="请输入工作地区" clearable />
            </el-form-item>
            <el-form-item label="备注:" prop="content">
                <el-input v-model="form.data.content" type="textarea" maxlength="255" placeholder="请输入备注信息" clearable />
            </el-form-item>

            <el-form-item label="状态:" prop="status">
                <el-radio-group v-model="form.data.status">
                    <el-radio v-for="(item, key) in props.list" :key="key" :label="Number(key)">
                        {{ item }}
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="排序" prop="sort">
                <el-input-number v-model="form.data.sort" :min="0" :max="10000" controls-position="right" placeholder=""
                    class="w100%" />
            </el-form-item> -->
        </el-form>
    </co-drawer>
</template>

<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'

import { verifyFormData } from '@/utils/element/form'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'
import { setMessageAdd, setMessageUpdate } from '@/api/list'

const props = defineProps<{
    // type: number
    title: string
    list: Record<string, string>
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
        email: '', // 菜单名称（英文）
        address: '',
        phone: '',
        content: '',
        status: 0, // 排序

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
const openDialog = async (row?: IMessageGetListResponse['list'][0]) => {
    if (row) { // 修改
        defData.type = 2

        form.data.id = row.id
        form.data.title = row.title
        form.data.address = row.address
        form.data.phone = row.phone || ''
        form.data.email = row.email || ''
        form.data.content = row.content
        form.data.status = row.status
    } else {
        defData.type = 1
        form.data.id = 0
        form.data.title = ''
        form.data.phone = ''
        form.data.address = ''
        form.data.email = ''

        form.data.content = ''
        form.data.status = 0
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

    const data: IMessageAdd = {
        title: form.data.title?.trim() ?? '',
        phone: form.data.phone?.trim() ?? '',
        email: form.data.email?.trim() ?? '',
        address: form.data.address?.trim() ?? '',
        content: form.data.content?.trim() ?? '',
        status: Number(form.data.status) || 0,
    }
    // console.log('data :>> ', data)
    // return false

    if (defData.type === 1) {
        const res = await ApiFunc(setMessageAdd(data))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('添加成功')
    } else {
        const param: IMessageEdit = {
            ...data,
            id: form.data.id,
        }

        const res = await ApiFunc(setMessageUpdate(param))
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
