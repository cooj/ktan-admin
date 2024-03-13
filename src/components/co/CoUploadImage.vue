<template>
    <div>
        <VueDraggable ref="dragRef" v-model="uploadList" tag="ul" class="upload-list"
            handle=".upload-list-chose-icon-drag">
            <li v-for="(item, index) in uploadList" :key="item" class="upload-list-item">
                <el-image :src="item" class="upload-list-item-image" />
                <div class="upload-list-item-view">
                    <i v-if="uploadList.length > 1"
                        class="upload-list-chose-icon upload-list-chose-icon-drag i-ep-more-filled" />

                    <!-- <i v-if="uploadList.length > 1" class="i-ep-rank upload-list-chose-icon upload-list-chose-icon-drag" /> -->
                    <!-- <i v-if="uploadList.length > 1" class="i-ep-position upload-list-chose-icon upload-list-chose-icon-drag" /> -->
                    <!-- <i v-if="uploadList.length > 1" class="i-ep-connection upload-list-chose-icon upload-list-chose-icon-drag" /> -->

                    <i class="upload-list-chose-icon i-ep-zoom-in" @click="openImageView(index)" />
                    <i v-if="!props.readonly" class="upload-list-chose-icon i-ep-delete"
                        @click="onImageRemove(index)" />
                </div>
            </li>
            <li v-if="props.readonly && !uploadList.length" class="upload-list-item">
                <co-image src="" class="upload-list-item-image" />
            </li>
            <li v-else-if="props.limit > uploadList?.length" class="upload-list-item upload-list-chose"
                @click="openChoseDialog">
                <i class="upload-list-chose-icon i-ep-plus" />
            </li>
        </VueDraggable>
        <el-image-viewer v-if="defData.showImg.viewer" :url-list="uploadList" :z-index="10000"
            :initial-index="defData.showImg.index" teleported @close="closeView" />

        <CoDialog v-model:visible="defData.visible" title="图片列表" :width="1000" append-to-body @cancel="onCancel"
            @confirm="onConfirm">
            <!-- <PhotoListPane :multiple="props.limit > 1" @chose="setChoseImage" /> -->
        </CoDialog>
    </div>
</template>

<script lang="ts" setup>
import { type UseDraggableReturn, VueDraggable } from 'vue-draggable-plus'
import { CommonApi } from '@/api/common'
import { useLoadingSubmit } from '@/hooks/useLoadingSubmit'

const props = defineProps({
    modelValue: {
        type: String as PropType<string | string[]>,
    },
    limit: {
        type: Number,
        default: 1,
        validator: (val: number) => {
            return val > 0
        },
    },
    readonly: Boolean,
})

const emits = defineEmits<{
    (e: 'update:modelValue', value: string | string[]): void
}>()

const dragRef = ref<UseDraggableReturn>()
const defData = reactive({
    visible: false,
    showImg: {
        viewer: false,
        index: 0,
    },
    imgList: [] as string[],
})

const uploadList = computed({
    get() {
        // props.limit>1
        if (Array.isArray(props.modelValue)) {
            return props.modelValue
        } else {
            return props.modelValue ? [props.modelValue] : []
        }
    },
    set(value) {
        // const val = Array.isArray(props.modelValue) ? value : value[0] || ''
        // console.log('val', val)
        // emits('update:modelValue', val)
        emitsUpdate(value)
    },
})

const styles = computed(() => {
    const margin = props.limit > 1 ? '8px' : '0'
    return { margin }
})

const [ApiFunc, btnLoading] = useLoadingSubmit()

const { files, open, reset } = useFileDialog({
    multiple: true,
    accept: 'image/*',
})

// 上传图片方法
const uploadFile = async () => {
    if (!files.value?.length) return false
    const max = props.limit - uploadList.value.length
    if (files.value.length > max) return ElMessage.warning(`超过最大上传数量，最多还能上传${max}张`)

    // const list = files.value as unknown as File[]
    const list = Array.from(files.value)
    const resList = await Promise.all(list.map(file => CommonApi.upload({ file })))

    const srcList = resList.map((item) => {
        if (item.code !== 200) {
            ElMessage.error(item.msg)
            return ''
        } else {
            uploadList.value.push(item.data)
            return item.data
        }
        // return item.code === 200 ? item.data.src : ''
    })

    emitsUpdate(uploadList.value)

    return true
}

watch(files, async (val) => {
    if (val) {
        const res = await ApiFunc(uploadFile())
        // if (res === true) {
        //     initTableData()
        //     reset()
        // }
    }
})

// 更新图片
const emitsUpdate = (arr: string[]) => {
    const val = Array.isArray(props.modelValue) ? arr : arr[0] || ''
    console.log('val :>> ', val)
    emits('update:modelValue', val)
}

// 打开选择相册弹窗
const openChoseDialog = () => {
    open()
    // defData.visible = true
}

// 打开图片预览
const openImageView = (index: number) => {
    defData.showImg.index = index
    defData.showImg.viewer = true
}
// 关闭图片预览
const closeView = () => {
    defData.showImg.viewer = false
}

// 移除图片
const onImageRemove = (index: number) => {
    uploadList.value.splice(index, 1)
    emitsUpdate(uploadList.value)
}

// 设置选中的图片
const setChoseImage = (arr: string[]) => {
    if (!arr.length) return
    const limit = props.limit - uploadList.value.length
    if (props.limit === 1) {
        uploadList.value = arr.slice(0, 1)
    } else {
        const list = arr.slice(0, limit)
        uploadList.value = [...uploadList.value, ...list]
    }
    defData.imgList = arr
}

// 取消
const onCancel = () => {
    defData.visible = false
}

// 确认
const onConfirm = async () => {
    // if (!defData.imgList.length) return ElMessage.error('请先选择图片')

    uploadList.value = defData.imgList

    onCancel()
}
</script>

<style lang="scss" scoped>
.upload-list {
    --co-upload-image-width: 100px;
    --co-upload-item-margin: v-bind('styles.margin');
    --co-upload-icon-size: 24px;
    display: flex;
    flex-wrap: wrap;

    .upload-list-item {
        position: relative;
        width: var(--co-upload-image-width);
        height: var(--co-upload-image-width);
        background-color: var(--el-fill-color-blank);
        border: 1px solid var(--el-border-color);
        border-radius: 6px;
        overflow: hidden;
        margin: 0 var(--co-upload-item-margin) var(--co-upload-item-margin) 0;

        .upload-list-item-image {
            width: 100%;
            height: 100%;
            display: block;

            :deep(.el-image__error) {
                font-size: var(--co-upload-icon-size);
            }
        }

        .upload-list-item-view {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: inline-flex;
            justify-content: space-evenly;
            align-items: center;
            color: #fff;
            opacity: 0;
            font-size: var(--co-upload-icon-size);
            background-color: var(--el-overlay-color-lighter);
            transition: opacity var(--el-transition-duration);
        }

        &:hover {
            .upload-list-item-view {
                opacity: 1;
            }
        }

        .upload-list-chose-icon-drag {
            position: absolute;
            top: 0;
            left: 0;
            cursor: move;
            z-index: 10;
        }

    }

    .upload-list-chose {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-style: dashed;
        color: var(--el-text-color-secondary);
        background-color: var(--el-fill-color-lighter);

        &:hover {
            border-color: var(--el-color-primary);
        }

    }

    .upload-list-chose-icon {
        cursor: pointer;
        font-size: var(--co-upload-icon-size);
    }

}
</style>
