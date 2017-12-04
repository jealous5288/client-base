package net.ruixin.dao.plat.config;

import net.ruixin.domain.plat.config.SysConfig;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Repository
public class ConfigDao extends BaseDao<SysConfig> implements IConfigDao {

    @Override
    public void saveConfig(SysConfig config) {
        super.saveOrUpdate(config);
    }

    @Override
    public SysConfig getConfigById(Long id) {
        return super.get(id);
    }

    @Override
    public void delConfig(Long id) {
        super.delete(id);
    }

    @Override
    public FastPagination getConfigList(Map map) {
        StringBuilder sql = new StringBuilder("SELECT C.ID, C.NAME, C.CODE, C.VALUE, C.XGSJ\n" +
                "  FROM SYS_CONFIG C WHERE C.SFYX_ST='1' ");
        List<Object> args = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("name"))) {
            sql.append(" AND C.NAME LIKE ? ");
            args.add("%" + map.get("name") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("code"))) {
            sql.append(" AND C.CODE LIKE ? ");
            args.add("%" + map.get("code") + "%");
        }
        sql.append(" ORDER BY C.XGSJ DESC");
        return super.cacheNextPagePaginationSql(sql, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

}
