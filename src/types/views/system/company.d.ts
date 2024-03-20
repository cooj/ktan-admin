


// 公司信息
declare interface SystemCompanyApi_GetInfoResponse {

    "id": 1,
    "company": "广东鹰测技术有限公司",
    "title": "广东鹰测技术有限公司",
    "address": "广东省东莞市虎门镇太安路虎门段41号泰明商业大厦2栋",
    "logo": "http://localhost:7001/upload/2023/8/29/goyojo.png",
    "logo2": "http://localhost:7001/upload/2023/8/29/16932880904120gn6xw.png",
    "customCode": string,
    "qrCode": "",
    "phone": "400-6261-158",
    "phone2": string,
    "email": "",
    "keyword": "洛泰、精密仪器、机械设备检测仪器、长度类、力学类、电学类、试验类、光学类、精密量仪类",
    "description": "洛泰精密仪器（东莞）有限公司是一家从事检测仪器设备的研发、销售、维修、计量管理于一体的综合型公司",
    "filing": "备案号： 粤ICP备2022043880号",
    "copyright": "版权所有 2021 汽车零部件清洁度检测仪-颗粒物分析测量仪器-清洗萃取机-东莞市捷布鲁科技有限公司官网",
    "createdAt": "2023-08-28T11:28:07.677Z",
    "updatedAt": "2024-03-14T05:52:43.485Z",
    "icon": "",
    "welcome": string,
    "welcome_en": string,
    "company_en": "Luotai Precision Instrument (Dongguan) Co., Ltd",
    "title_en": "Luotai Precision Instrument (Dongguan) Co., Ltd",
    "address_en": "广东省东莞市虎门镇太安路虎门段41号泰明商业大厦2栋Luotai Precision Instrument (Dongguan) Co., Ltd",
    "filing_en": "",
    "copyright_en": ""
    is_en: boolean

}



// 系统信息
declare interface ISystemEditParams {

    title: string, // 公司名称
    address: string, // 公司地址

    title_en: string,
    address_en: string, // 公司地址

    phone: string, // 公司电话
    email: string, // 公司邮箱


    logo: string, // 网站logo
    logo2: string, // 网站logo
    qr_code: string, // 二维码

    seo_keyword: string, // 关键词
    seo_description: string, // 描述

    filing: string, // 备案号
    copyright: string, // 版权信息
    filing_en: string, // 备案号
    copyright_en: string, // 版权信息
    icon: string, // 网站图标
    company: string
    company_en: string
    phone2: string
    custom_code: string
    welcome: string
    welcome_en: string
    is_en: boolean
}


declare interface ICompanyEditParams {

    company: string, // 公司名称
    address: string, // 公司地址

    company_en: string,
    address_en: string, // 公司地址

    phone: string, // 公司电话
    email: string, // 公司邮箱


    logo: string, // 网站logo
    logo2: string, // 网站logo
    qr_code: string, // 二维码

    seo_keyword: string, // 关键词
    seo_description: string, // 描述

    filing: string, // 备案号
    copyright: string, // 版权信息
    filing_en: string, // 备案号
    copyright_en: string, // 版权信息
}
