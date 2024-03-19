<template>
    <co-drawer v-model="defData.visible" :title="comData.title" size="40%" :loading="btnLoading" @close="onClose"
        @cancel="onClose" @confirm="onConfirm">
        <el-form ref="formRef" :model="form.data" :rules="rules" label-width="110px">
            <el-form-item label="标题:" prop="title">
                <el-input v-model="form.data.title" maxlength="20" placeholder="请输入标题" clearable />
            </el-form-item>

            <el-form-item label="英文标题:" prop="title_en">
                <el-input v-model="form.data.title_en" maxlength="30" placeholder="请输入英文标题" clearable />
            </el-form-item>
            <el-form-item label="图片:" prop="img">
                <div class="w100% flex items-end">
                    <UploadFile v-model="form.data.img" />
                    <span class="ml5px text-12px c-#888">若跟商品关联，则默认使用商品图片</span>
                </div>
            </el-form-item>
            <el-form-item label="文件类型:" prop="type">
                <el-radio-group v-model="form.data.type">
                    <el-radio :label="2">
                        文档
                    </el-radio>
                    <el-radio :label="3">
                        视频
                    </el-radio>
                    <el-radio :label="4">
                        软件
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上传文件:" prop="upload">
                <el-upload v-if="defData.loadUpload" ref="uploadRef" v-model:file-list="form.data.upload"
                    class="upload-file" drag :limit="1" accept="*" :auto-upload="false" :on-change="onUploadChange"
                    :on-remove="onRemove" :on-exceed="onHandleExceed">
                    <el-icon class="el-icon--upload">
                        <ele-UploadFilled />
                    </el-icon>
                    <div class="el-upload__text">
                        将文件放在这里或<em>点击上传</em>
                    </div>
                    <!-- <template #tip>
                                <div class="el-upload__tip">
                                    （xlsx文件中一次上传商品数量最好不要超过1000，xlsx文件大小最好不要超过500K.）
                                </div>
                            </template> -->
                </el-upload>
            </el-form-item>

            <el-form-item label="文件地址:" prop="href">
                <el-input v-model="form.data.href" maxlength="200" placeholder="" clearable />
            </el-form-item>
            <el-form-item label="简介描述:" prop="content">
                <el-input v-model="form.data.content" type="textarea" maxlength="200" placeholder="" clearable />
            </el-form-item>

            <el-form-item label="关联商品:" prop="goods_id">
                <el-select v-model="form.data.goods_id" class="w100%" clearable filterable>
                    <el-option v-for="item in props.list" :key="item.id" :label="item.title" :value="item.id" />
                </el-select>
            </el-form-item>

            <el-form-item label="排序:" prop="sort">
                <el-input-number v-model="form.data.sort" :min="0" :max="10000" controls-position="right" placeholder=""
                    class="w100%" />
            </el-form-item>
            <el-form-item label="是否隐藏:" prop="isHide">
                <el-radio-group v-model="form.data.isHide">
                    <el-radio :label="true">
                        是
                    </el-radio>
                    <el-radio :label="false">
                        否
                    </el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
    </co-drawer>
</template>

<script lang="ts" setup>
import { genFileId } from 'element-plus'
import type { FormInstance, FormRules, UploadFile as UploadFileType, UploadFiles, UploadInstance, UploadProps, UploadRawFile } from 'element-plus'

import { verifyFormData } from '@/utils/element/form'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'
import { setBannerAdd, setBannerUpdate } from '@/api/list'
import { CommonApi } from '@/api/common'

const props = defineProps<{
    type: number | string
    title: string
    list: IGoodsGetListResponse['list']
}>()

const emits = defineEmits<{
    update: []
}>()

const uploadRef = ref<UploadInstance>()

// 绑定表单
const formRef = ref<FormInstance>()

const lang = ref<LanguageType>('cn')
const defData = reactive({
    visible: false, // 弹窗显示
    menuData: [], // 上级菜单数据
    ready: false,
    routeArr: [] as MenuApi_MenuItem[],
    type: 1,
    loadUpload: true,
})

const form = reactive({
    data: {
        id: 0,
        title: '', // 菜单名称
        title_en: '', // 菜单名称（英文）
        href: '', // 链接地址
        sort: 0, // 排序
        img: '', // 图片地址
        isHide: false, // 是否隐藏
        upload: [] as UploadFileType[],
        url: '', // 文件地址路径
        type: 2,
        goods_id: '',
        content: '',
    },
})

const rules = reactive<FormRules>({
    title: [ // 菜单名称
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    // title_en: [ // 菜单名称
    //     { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    // ],

    href: [
        { required: true, whitespace: true, message: '必填项不能为空', trigger: 'blur' },
    ],
    // img: [
    //     { required: [6, 7].includes(props.type), message: '必填项不能为空', trigger: 'blur' },
    // ],
})

const comData = computed(() => {
    if (defData.type === 1) return { title: `新增${props.title}` }
    return { title: `修改${props.title}` }
})

const initDefaultData = async () => {
    if (defData.ready) return

    defData.ready = true
}

// 文件上传
const onUploadChange = async (file: UploadFileType, files: UploadFiles) => {
    const raw = file.raw as File
    // if (!/\.(xlsx|xls)$/.test(raw.name.toLowerCase())) return ElMessage.error('文件类型必须是.xlsx,xls中的一种')
    const res = await CommonApi.upload({
        file: raw,
    })
    if (res.code !== 200) return ElMessage.error(res.msg)

    form.data.url = res.data
    form.data.href = res.data

    // form.data.upload = [{ url: res.data.src }]
    // let url = 'https://goyojo.oss-cn-shenzhen.aliyuncs.com/20221018/202210181702586490.xlsx'
}
// 移除文件
const onRemove = async (file: UploadFileType, files: UploadFiles) => {
    defData.loadUpload = false

    form.data.upload = []
    form.data.url = ''

    nextTick(() => {
        defData.loadUpload = true
    })
}

// 替换文件
const onHandleExceed: UploadProps['onExceed'] = (files) => {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    file.uid = genFileId()
    uploadRef.value!.handleStart(file)
}

// 打开弹窗
const openDialog = async (row?: IBannerGetListResponse['list'][0]) => {
    if (row) { // 修改
        defData.type = 2

        form.data.id = row.id
        form.data.title = row.title
        form.data.title_en = row.title_en
        form.data.href = row.href
        form.data.sort = row.sort
        form.data.img = row.img || ''
        form.data.type = row.type
        form.data.content = row.content || ''
    } else {
        defData.type = 1
        form.data.id = 0
        form.data.title = ''
        form.data.title_en = ''
        form.data.href = ''
        form.data.sort = 0
        form.data.img = ''
        form.data.type = 2
        form.data.content = ''
    }

    await initDefaultData()
    defData.visible = true
}

const [ApiFunc, btnLoading] = useLoadingSubmit()

const onReset = () => {
    formRef.value?.resetFields() // 清空表单
}

// 关闭弹窗
const onClose = () => {
    defData.visible = false
    onReset()
}

// 确定
const onConfirm = useThrottleFn(async () => {
    const isRun = await verifyFormData(formRef.value)
    if (!isRun) return
    const url = form.data.url?.trim() || form.data.href?.trim()
    if (!url) return ElMessage.warning('请上传文件或输入文件地址')

    const data: IBannerAdd = {
        href: url,
        sort: Number(form.data.sort),
        title: form.data.title?.trim() ?? '',
        title_en: form.data.title_en?.trim() ?? '',
        img: form.data.img?.trim() ?? '',
        isHide: form.data.isHide,
        type: form.data.type,
        productId: Number(form.data.goods_id) || '',
        content: form.data.content?.trim() ?? '',
    }

    if (defData.type === 1) {
        const res = await ApiFunc(setBannerAdd(data))
        if (res.code !== 200) return ElMessage.error(res.msg)
        ElMessage.success('添加成功')
    } else {
        const param: IBannerEdit = {
            ...data,
            id: form.data.id,
        }

        const res = await ApiFunc(setBannerUpdate(param))
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

<style lang="scss" scoped>
.comp-box {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;

    em {
        color: var(--el-text-color-secondary);
        font-size: 13px;
    }
}
</style>
