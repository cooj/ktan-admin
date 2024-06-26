import { post } from '@/utils/http/request'

/**
 * 角色管理api
 */
export const SystemCompanyApi = {

    // /api/system

    /**
     *
     * 获取默认信息
     * @returns
     */
    getSystem: () => post<SystemCompanyApi_GetInfoResponse>('/api/system/info'),

    /**
     *
     * 修改系统信息
     * @returns
     */
    editSystem: (data: ISystemEditParams) => post<SystemCompanyApi_GetInfoResponse>('/api/system/edit', data),
}
