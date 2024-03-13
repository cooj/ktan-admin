import { post } from '@/utils/http/request'

// 获取轮播图列表
export const getBannerList = (data?: IBannerGetList) => post<IBannerGetListResponse>('/api/banner/get_list', data)
// 添加轮播图
export const setBannerAdd = (data: IBannerAdd) => post('/api/banner/add', data)
// 修改轮播图
export const setBannerUpdate = (data: IBannerEdit) => post('/api/banner/edit', data)
// 删除轮播图
export const setBannerDelete = (data: { id: number }) => post('/api/banner/delete', data)

// 、、、   ///
// 获取商品列表
export const getGoodsList = (data?: IGoodsGetList) => post<IGoodsGetListResponse>('/api/product/get_list', data)
// 添加商品
export const setGoodsAdd = (data: IGoodsAdd) => post('/api/product/add', data)
// 修改商品
export const setGoodsUpdate = (data: IGoodsEdit) => post('/api/product/edit', data)
// 删除商品
export const setGoodsDelete = (data: { id: number }) => post('/api/product/delete', data)

// 、、、   ///
// 获取商品分类列表
export const getGoodsClassifyList = (data?: IGoodsGetList) => post<IGoodsClassifyGetListResponse>('/api/classify/get_list', data)
export const setGoodsClassifyAdd = (data: IGoodsClassifyAdd) => post('/api/classify/add', data)
export const setGoodsClassifyUpdate = (data?: IGoodsClassifyEdit) => post('/api/classify/edit', data)
// 删除商品分类
export const setGoodsClassifyDelete = (data: { id: number }) => post('/api/classify/delete', data)

// 、、、   ///
// 获取关于我们、联系我们信息
export const getOtherInfo = (data: { type: number | string }) => post<IOtherInfoResponse | null>('/api/other/info', data)
// 更新关于我们、联系我们信息
export const setOtherInfoUpdate = (data: IOtherInfoUpdate) => post('/api/other/edit', data)

// 、、、   ///
// 获取新闻列表
export const getNewsList = (data?: INewsGetList) => post<INewsGetListResponse>('/api/news/get_list', data)
// 添加新闻
export const setNewsAdd = (data: INewsAdd) => post('/api/news/add', data)
// 修改新闻
export const setNewsUpdate = (data: INewsEdit) => post('/api/news/edit', data)
// 删除新闻
export const setNewsDelete = (data: { id: number }) => post('/api/news/delete', data)

// 、、、   ///
// 获取人才招聘列表
export const getRecruitList = (data?: IRecruitGetList) => post<IRecruitGetListResponse>('/api/recruit/get_list', data)
// 添加人才招聘
export const setRecruitAdd = (data: IRecruitAdd) => post('/api/recruit/add', data)
// 修改人才招聘
export const setRecruitUpdate = (data: IRecruitEdit) => post('/api/recruit/edit', data)
// 删除人才招聘
export const setRecruitDelete = (data: { id: number }) => post('/api/recruit/delete', data)
