package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysPageDao;
import net.ruixin.domain.plat.auth.SysPage;
import net.ruixin.service.plat.workflow.ISysPageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Created by Jealous on 2016-8-9.
 * 工作流：流程表单服务接口实现
 */
@Service
@Transactional
public class SysPageService implements ISysPageService {

    @Autowired
    private ISysPageDao sysPageDao;


    @Override
    public SysPage get(Long pageId) {
        return sysPageDao.get(pageId);
    }
}
