package net.ruixin.service.plat.log.impl;

import net.ruixin.dao.plat.log.ILoginLogDao;
import net.ruixin.dao.plat.log.IOperateLogDao;
import net.ruixin.service.plat.log.ILogService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;


@Service
public class LogService implements ILogService {


    @Autowired
    private ILoginLogDao loginLogDao;
    @Autowired
    private IOperateLogDao operateLogDao;

    /**
     * 登录日志分页查询
     * @param map
     */
    @Override
    public FastPagination getLoginLogPage(Map map) {
        return loginLogDao.getLoginLogPage(map);
    }

    /**
     * 操作日志的查询
     * @param map
     */
    @Override
    public FastPagination getOperateLogPage(Map map){
        return operateLogDao.getOperateLogePage(map);
    }


}
