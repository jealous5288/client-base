package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.auth.SysPage;

/**
 * Created by Jealous on 2016-8-9.
 * 工作流：流程表单服务接口
 */
public interface ISysPageService {
    /**
     * 获取流程表单
     * @param pageId 表单ID
     * @return 流程表单
     */
    SysPage get(Long pageId);
}
