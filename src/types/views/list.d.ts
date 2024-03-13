

/**
 * 轮播图列表 - 响应数据
 */
declare interface IBannerGetList extends ListPage {
    type: 1 | 2 | 5 | 6|7,   // 5:轮播图 2：友情链接 6：荣誉资质,7: 关于我们展示图
}


/**
 * 轮播图列表 - 响应数据
 */
declare interface IBannerGetListResponse extends ListTotal {
    list: {
        id: number,
        title: string,  // 标题
        title_en: string,  // 标题
        img: string; // 图片地址
        href: string; // 链接地址
        sort: number;    // 排序
        type: number;    // 类型 1:轮播图，2：友情链接
        isHide: boolean; //是否隐藏
    }[]
}

/**
 * 新增轮播图 - 请求参数
 */
declare interface IBannerAdd {

    title: string,  // 标题
    title_en: string,  // 标题
    img: string; // 图片地址
    href: string; // 链接地址
    sort: number;    // 排序
    isHide: boolean; //是否隐藏
    type: number;    // 类型 1:轮播图，2：友情链接
}


/**
 * 修改轮播图 - 请求参数
 */
declare interface IBannerEdit extends IBannerAdd {
    id: number;  // 轮播图ID
}



/**
 * 关于我们、联系我们 - 响应数据
 */
declare interface IOtherInfoResponse {

    id: number,
    title: string,  // 标题
    title_en: string,  // 标题
    img: string; // 图片地址

    content: string; // 内容
    content_en: string; // 内容

    type: number;    // 类型 1:关于我们，2：联系我们


}



/**
 * 修改关于我们、联系我们 - 请求参数
 */
declare interface IOtherInfoUpdate {

    // id?: number,
    title?: string,  // 标题
    title_en?: string,  // 标题
    img: string; // 图片地址

    content: string; // 内容
    content_en: string; // 内容

    type: number | string;    // 类型 1:关于我们，2：联系我们
    key?: string

}



/**
 * 新闻列表 - 请求参数
 */
declare interface INewsGetList extends ListPage {
    type: number | string;    // 类型
    title?: string;  // 标题
}

/**
 * 新闻列表 - 响应数据
 */
declare interface INewsGetListResponse extends ListTotal {
    list: {
        "id": 1,
        "title": "清洁度检测标准ISO16232和VDA",
        "title_en": "",
        "author": "tong",
        "describe": "检测目的：通过标准的方法来验证产品的清洁度品在装配时的紧密度,并且使产品的磨损老化加速。通过清洁度检测并规定其限值，可大大减轻颗粒磨损造......",
        "describe_en": "",
        "content": string
        "content_en": string
        "img": "http://localhost:9008/upload/2023/8/31/1693465126951cbycq5.png",
        "sort": 0,
        "isHide": boolean,
        "type": 1 | 2,
        "createdAt": "2023-08-31T06:59:35.000Z",
        "updatedAt": "2023-08-31T06:59:35.000Z"
    }[]
}

/**
 * 新闻列表 - 添加
 */
declare interface INewsAdd {

    title: string,  // 标题
    title_en?: string,  // 标题
    img: string; // 图片地址
    author?: string;  // 作者
    describe: string; //简介
    describe_en: string; //简介

    content: string; // 内容
    content_en: string; // 内容

    isHide: boolean; //是否首页显示
    sort: number;    // 排序

    type: number;    // 类型 1:新闻
    read: number;  // 阅读量
}

/**
 * 新闻列表 - 修改
 */
declare interface INewsEdit extends INewsAdd {
    id: number
}







/**
 * 产品列表 - 请求参数
 */
declare interface IGoodsGetList extends ListPage {
    type?: number | '';    // 类型
    title?: string;  // 标题
}

/**
 * 产品列表 - 响应数据
 */
declare interface IGoodsGetListResponse extends ListTotal {
    list: {
        "id": 1,
        "title": "S108B MiNi钳形漏电流表 ",
        "title_en": string | null,
        "sub_title": "钳形电流表",
        "sub_title_en": string | null,
        "author": string | null,
        "describe": string
        "describe_en": string | null,
        "content": string
        "content_en": string | null,
        "contrast": string
        "contrast_en": string | null,
        "annex": string
        "annex_en": string | null,
        "img": string | null,
        "sort": 0,
        "isHide": false,
        "type": 0,
        "read": 0,
        "createdAt": "2024-03-08T08:46:12.839Z",
        "updatedAt": "2024-03-08T08:46:12.839Z",
        "classifyId": 9,

        classify: {
            title: string
        },
        links: ILinkItem[]
    }[]
}


/**
 * 产品列表 - 添加
 */
declare interface IGoodsAdd {

    title: string,  // 标题
    title_en?: string,  // 标题
    img: string; // 图片地址
    // author?: string;  // 作者
    describe: string; //简介
    describe_en: string; //简介

    content: string; // 内容
    content_en: string; // 内容

    isHide: boolean; //是否首页显示
    sort: number;    // 排序

    type: number;    // 类型 1:新闻
    read: number;  // 阅读量


    "sub_title": string,
    "sub_title_en": string,
    // "author": string | null,
    "describe": string
    "describe_en": string,
    "content": string
    "content_en": string,
    "contrast": string
    "contrast_en": string,
    "annex": string
    "annex_en": string,
    // "img": string,
    // "sort": 0,
    // "isHide": boolean,
    // "type": 0,
    "read": 0,
    classifyId: number,
    links: { title: string, href: string, content: string }[]
}

/**
 * 产品列表 - 修改
 */
declare interface IGoodsEdit extends IGoodsAdd {
    id: number
}


// 友情链接、文件下载、轮播图
declare interface ILinkItem {
    "id": number,
    "c_id": 0,
    "title": string,
    "title_en": string,
    "content": string,
    "content_en": string,
    "img": string,
    "href": string,
    "sort": 0,
    "type": number,
    "isHide": boolean,
    "createdAt": "2024-03-08T08:46:12.839Z",
    "updatedAt": "2024-03-08T08:46:12.839Z",
    "productId": 1
}


// 产品分类
declare interface IGoodsClassifyItem {
    "id": 14,
    "p_id": 1,
    "title": "本地语音智能核相仪",
    "title_en": null,
    "createdAt": "2024-03-08T06:51:32.165Z",
    "updatedAt": "2024-03-08T06:51:32.165Z",
    "sort": 0,
    "status": 1
    children?: IGoodsClassifyItem[]
}


/**
 * 产品分类 - 响应数据
 */
declare interface IGoodsClassifyGetListResponse extends ListTotal {
    list: IGoodsClassifyItem[]
}


/**
 * 产品分类 - 添加
 */
declare interface IGoodsClassifyAdd {

    title: string,  // 标题
    title_en?: string,  // 标题
    "p_id": number,
    sort: number;    // 排序
    status: number;    // 类型 1:新闻
}


/**
 * 产品分类 - 修改
 */
declare interface IGoodsClassifyEdit extends IGoodsClassifyAdd {
    "id": number,
}



