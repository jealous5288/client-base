package net.ruixin.service.plat.log;


import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

public interface ILogService {
    /**
     * 登录日志分页查询
     * @param map
     * @return
     */
    FastPagination getLoginLogPage(Map map);

    /**
     * 操作日志分页查询
     * @param map
     * @return
     */
    FastPagination getOperateLogPage(Map map);

}
