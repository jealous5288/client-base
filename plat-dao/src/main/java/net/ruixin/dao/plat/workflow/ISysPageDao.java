package net.ruixin.dao.plat.workflow;

import net.ruixin.domain.plat.auth.SysPage;

/**
 * Created by Jealous on 2016-8-17.
 * 表单Dao接口
 */
public interface ISysPageDao {
    /**
     * 获取表单实体
     * @param pageId 表单ID
     * @return 表单实体
     */
    SysPage get(Long pageId);
}
