package net.ruixin.dao.plat.log;

import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

/**
 * 登录日志DAO接口
 */
public interface ILoginLogDao {
    /**
     * 登录日志的查询
     *
     * @param map
     * @return
     */
    FastPagination getLoginLogPage(Map map);

}
