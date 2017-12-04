package net.ruixin.dao.plat.log;

import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

/**
 * 操作日志DAO接口
 */
public interface IOperateLogDao {

    /**
     * 操作日志的查询
     *
     * @param map
     * @return
     */
    FastPagination getOperateLogePage(Map map);
}
