<template>
    <el-form ref="formRef" :model="form.data" :rules="rules" class="pl30px" label-position="top">
        <el-tabs v-model="lang">
            <el-tab-pane label="中文" name="cn" />
            <el-tab-pane label="英文" name="en" />
        </el-tabs>
        <el-row>
            <template v-if="lang === 'cn'">
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="title" label="标题：">
                        <el-input v-model="form.data.title" maxlength="100" clearable />
                    </el-form-item>
                </el-col>
            </template>
            <template v-else-if="lang === 'en'">
                <el-col :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                    <el-form-item prop="title_en" label="英文标题名称：">
                        <el-input v-model="form.data.title_en" maxlength="100" clearable />
                    </el-form-item>
                </el-col>
            </template>
            <el-col v-if="props.type === 'service-mend'" :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                <el-form-item v-if="lang === 'cn'" prop="subtitle" label="副标题：">
                    <el-input v-model="form.data.subtitle" maxlength="100" clearable />
                </el-form-item>
                <el-form-item v-else-if="lang === 'en'" prop="subtitle_en" label="英文副标题名称：">
                    <el-input v-model="form.data.subtitle_en" maxlength="100" clearable />
                </el-form-item>
            </el-col>
            <el-col
                v-if="!(props.type === 'culture' || props.type === 'recruit-cultivate' || props.type === 'service-mend')"
                :xs="24" :sm="24" :md="20" :lg="18" :xl="16" class="mb18px">
                <el-form-item prop="img" label="图片：">
                    <UploadFile v-model="form.data.img" />
                </el-form-item>
            </el-col>
            <el-col v-if="props.type !== 'organization'" :xs="24" :sm="24" :md="24" :lg="20" :xl="16" class="mb18px">
                <el-form-item v-if="lang === 'cn'" prop="content" label="描述信息：">
                    <BaseWangEditor v-model="form.data.content" />
                </el-form-item>
                <el-form-item v-else-if="lang === 'en'" prop="content_en" label="英文描述信息：">
                    <BaseWangEditor v-model="form.data.content_en" />
                </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb18px">
                <el-form-item>
                    <el-button type="primary" :loading="btnLoading" @click="onSubmit">
                        确定
                    </el-button>
                    <el-button @click="resetForm">
                        重置
                    </el-button>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import { setSystemInfo } from '@/api/system'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'
import { getOtherInfo, setOtherInfoUpdate } from '@/api/list'

const props = defineProps<{
    type?: IOtherType
}>()

const lang = ref<LanguageType>('cn')

const formRef = ref<FormInstance>()
const form = reactive({

    data: {
        title: '', // 公司名称
        title_en: '',
        subtitle: '', // 公司地址
        subtitle_en: '', // 公司地址
        content: '', // 公司地址
        content_en: '', // 公司地址
        img: '', // 网站logo

    },

})

const rules = reactive<FormRules>({

    title: [{ required: true, whitespace: true, message: '请输入标题', trigger: 'blur' }],
})

// 初始化数据
const initDefaultData = async () => {
    if (!props.type) return

    const res = await getOtherInfo({ type: props.type })
    console.log('res :>> ', res)
    if (res.code !== 200) return ElMessage.error('网络错误')
    const propsData = res.data

    form.data.title = propsData?.title || ''
    form.data.title_en = propsData?.title_en || ''
    form.data.subtitle = propsData?.subtitle || ''
    form.data.subtitle_en = propsData?.subtitle_en || ''
    form.data.content = propsData?.content || ''
    form.data.content_en = propsData?.content_en || ''
    form.data.img = propsData?.img || ''

    // form.data.logo2 = propsData.logo2 || ''
    // form.data.qr_code = propsData.qrCode || ''
    // form.data.phone = propsData.phone || ''
    // form.data.email = propsData.email || ''
    // form.data.seo_keyword = propsData.keyword || ''
    // form.data.seo_description = propsData.description || ''
    // form.data.filing = propsData.filing || ''
    // form.data.copyright = propsData.copyright || ''
    // form.data.filing_en = propsData.filing_en || ''
    // form.data.copyright_en = propsData.copyright_en || ''

    // form.data.icon = propsData.icon || ''
}

const [ApiFunc, btnLoading] = useLoadingSubmit()
// 确定
const onSubmit = async () => {
    if (!props.type) return ElMessage.warning('类型错误')
    const param: IOtherInfoUpdate = {
        title: form.data.title?.trim() ?? '',
        title_en: form.data.title_en?.trim() ?? '',
        subtitle: form.data.subtitle?.trim() ?? '',
        subtitle_en: form.data.subtitle_en?.trim() ?? '',
        content: form.data.content?.trim() ?? '',
        content_en: form.data.content_en?.trim() ?? '',
        img: form.data.img?.trim() ?? '',
        type: props.type,
        key: props.type,
    }

    const res = await ApiFunc(setOtherInfoUpdate(param))
    if (res.code !== 200) return ElMessage.error(res.msg)
    // const res = await ShopBaseApi.getBasicInf(data)
    // if (res.code != 200) return ElMessage.error(res.msg)
    ElMessage.success('设置成功')

    // initData?.() // 更新数据
}
// 重置
const resetForm = async () => {
    // formRef.value?.resetFields();
    initDefaultData()
}

// 监听，
watch(() => props.type, (newVal) => {
    initDefaultData()
})

onBeforeMount(() => {
    initDefaultData()
})
</script>

<style lang="scss" scoped></style>
