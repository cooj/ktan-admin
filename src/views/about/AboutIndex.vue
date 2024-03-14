<template>
    <my-box class="b-none!">
        <!-- v-if="defData.ready" -->
        <div class="tab-box">
            <el-tabs v-if="props.type === 'recruit'" v-model="activeName" class="tab-box" tab-position="left"
                @tab-click="handleClick">
                <el-tab-pane label="人才招聘" name="1">
                    <el-scrollbar>
                        <AboutInfo type="recruit-person" />
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="人才招聘-岗位" name="5" lazy>
                    <el-scrollbar>
                        <RecruitList title="人才招聘-岗位" />
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="招聘须知" name="2" lazy>
                    <el-scrollbar>
                        <AboutInfo type="recruit-notice" />
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="人才培养" name="3" lazy>
                    <el-scrollbar>
                        <AboutInfo type="recruit-cultivate" />
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>
            <el-tabs v-else-if="props.type === 'service'" v-model="activeName" class="tab-box" tab-position="left"
                @tab-click="handleClick">
                <el-tab-pane label="资料下载" name="1">
                    <el-scrollbar>
                        <!-- <AboutInfo type="recruit-person" /> -->
                        <FileList type="2,3,4" title="资料文件" />
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="服务维修" name="2" lazy>
                    <el-scrollbar>
                        <AboutInfo type="service-mend" />
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>
            <el-tabs v-else v-model="activeName" class="tab-box" tab-position="left" @tab-click="handleClick">
                <el-tab-pane label="关于我们" name="1">
                    <el-scrollbar>
                        <AboutInfo type="about" />
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="关于我们-展示图" name="5" lazy>
                    <el-scrollbar>
                        <IndexList :type="7" title="关于我们-展示图" />
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="企业文化" name="2" lazy>
                    <el-scrollbar>
                        <AboutInfo type="culture" />
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="企业架构" name="3" lazy>
                    <el-scrollbar>
                        <AboutInfo type="organization" />
                    </el-scrollbar>
                </el-tab-pane>
                <el-tab-pane label="荣誉资质" name="4" lazy>
                    <el-scrollbar>
                        <IndexList :type="6" title="荣誉资质" />
                    </el-scrollbar>
                </el-tab-pane>
            </el-tabs>
        </div>
    </my-box>
</template>

<script lang="ts" setup>
import type { TabsPaneContext } from 'element-plus'

// import IndexList from '@/views/home/components/IndexList.vue'
// import AboutInfo from '@/views/about/components/AboutInfo.vue'
// import RecruitList from '@/views/about/components/RecruitList.vue'
// import FileList from '@/views/about/components/FileList.vue'

const props = defineProps<{
    type?: string
}>()

const IndexList = defineAsyncComponent(() => import('@/views/home/components/IndexList.vue'))
const AboutInfo = defineAsyncComponent(() => import('@/views/about/components/AboutInfo.vue'))
const RecruitList = defineAsyncComponent(() => import('@/views/about/components/RecruitList.vue'))
const FileList = defineAsyncComponent(() => import('@/views/about/components/FileList.vue'))

const activeName = ref('1')

const defData = reactive({
    ready: false,

})

// 初始化数据
const initDefaultData = async () => {
    defData.ready = true
}

const handleClick = (tab: TabsPaneContext, event: Event) => {

}

onBeforeMount(() => {
    initDefaultData()
})
</script>

<style lang="scss" scoped>
.tab-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: auto;

    :deep(.el-tabs) {
        height: 100%;
        --el-tabs-header-height: 48px;

        .el-tabs__header.is-left {
            // width: 160px;
            border-right: 1px solid #eee;

            .el-tabs__item {
                text-align: center;
                min-width: 120px;

                &.is-active {
                    background-color: var(--el-color-primary-light-9);
                }
            }
        }

        .el-tabs__content {
            height: 100%;

            .el-tab-pane {
                height: 100%;
                // .el-scrollbar{
                //     padding: 20px 0;
                // }
            }
        }
    }
}
</style>
