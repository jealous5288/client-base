package net.ruixin.dao.plat.log.impl;

import net.ruixin.dao.plat.log.IOperateLogDao;
import net.ruixin.domain.plat.log.OperationLog;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Repository
public class OperateLogDao extends BaseDao<OperationLog> implements IOperateLogDao {

    @Override
    public FastPagination getOperateLogePage(Map map) {
        List<Object> params = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT T.*,U.USER_NAME FROM SYS_LOG_OPERATION T,SYS_USER U WHERE T.USER_ID=U.ID ORDER BY T.ID DESC");
        if (RxStringUtils.isNotEmpty(map.get("logType"))) {
            sql.append(" AND T.LOGIN_TYPE = ? ");
            params.add(map.get("logType"));
        }
        return super.cacheNextPagePaginationSql(sql, params, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }
}
