package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysPageDao;
import net.ruixin.domain.plat.auth.SysPage;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

/**
 * Created by Jealous on 2016-8-17.
 * 表单Dao接口实现
 */
@SuppressWarnings("unused")
@Repository
public class SysPageDao extends BaseDao<SysPage> implements ISysPageDao {

    @Override
    public SysPage get(Long pageId) {
        return super.get(pageId);
    }
}
