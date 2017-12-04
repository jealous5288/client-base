package net.ruixin.dao.plat.auth.impl;

import net.ruixin.dao.plat.auth.IModuleDao;
import net.ruixin.domain.plat.auth.SysModule;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-19.
 * 模块DAO实现
 */
@Repository
public class ModuleDao extends BaseDao<SysModule> implements IModuleDao {

    @Override
    public SysModule getModuleById(Long id) {
        return super.get(id);
    }

    @Override
    public FastPagination getModuleList(Map map) {
        StringBuilder sql = new StringBuilder("SELECT M.ID," +
                "       M.MODULE_NAME," +
                "       M.MODULE_CODE," +
                "       M.XGSJ," +
                "       WM_CONCAT(P.NAME) PAGENAMES "+
                "  FROM SYS_MODULE M" +
                "  LEFT JOIN SYS_PAGE P " +
                "    ON P.MODULE_ID = M.ID " +
                "   AND P.SFYX_ST = '1' "+
                " WHERE M.SFYX_ST = '1' ");
        List<Object> params = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("moduleName"))) {
            sql.append(" AND M.MODULE_NAME LIKE ? ");
            params.add("%" + map.get("moduleName") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("moduleCode"))) {
            sql.append(" AND M.MODULE_CODE LIKE ? ");
            params.add("%" + map.get("moduleCode") + "%");
        }
        sql.append(" GROUP BY M.ID, M.MODULE_NAME, M.MODULE_CODE, M.XGSJ" +
                " ORDER BY M.XGSJ DESC ");
        return super.cacheNextPagePaginationSql(sql, params, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public void saveModule(SysModule sysModule) {
        super.saveOrUpdate(sysModule);
    }

    @Override
    public void deleteModule(Long moduleId) {
        super.deleteCascade(moduleId);
    }

    @Override
    public List<Map<String, Object>> getModuleSearchList() {
        String sql = ("SELECT    M.ID,\n" +
                "          M.MODULE_NAME,\n" +
                "          M.MODULE_CODE,\n" +
                "          M.XGSJ,\n" +
                "          WM_CONCAT(GMA.AUTHROLE_ID) AUTH_IDS\n" +
                "     FROM SYS_MODULE M\n" +
                "LEFT JOIN SYS_GLB_MODULE_AUTHROLE GMA\n" +
                "       ON M.ID = GMA.MODULE_ID\n" +
                "      AND GMA.SFYX_ST = '1'\n" +
                "    WHERE M.SFYX_ST = '1'\n" +
                " GROUP BY M.ID, M.MODULE_NAME, M.MODULE_CODE, M.XGSJ\n" +
                " ORDER BY M.XGSJ DESC ");
        return super.getJdbcTemplate().queryForList(sql);
    }

    @Override
    public String getMaxSort(String tableName, String fieldName) {
        String sql = "SELECT TO_NUMBER(NVL(MAX(" + fieldName + "), 0)) + 1 MAXSORT FROM " + tableName;
        return super.getJdbcTemplate().queryForMap(sql).get("MAXSORT").toString();
    }

    @Override
    public List<Map<String, Object>> getRuleNameByModuleId(Long moduleId) {
        String sql = "SELECT BR.RULE_NAME\n" +
                "  FROM SYS_AUTH_RULE AR, SYS_BASE_RULE BR\n" +
                " WHERE AR.GL_RULE_ID = BR.ID\n" +
                "   AND AR.SFYX_ST = '1'\n" +
                "   AND BR.SFYX_ST = '1'\n" +
                "   AND INSTR(','|| AR.MODULE_IDS || ',', ',' || ? || ',') > 0";
        return super.getJdbcTemplate().queryForList(sql, moduleId);
    }

    @Override
    public List<Map<String, Object>> getMenuNameByModuleId(Long moduleId) {
        String sql = "SELECT M.NAME FROM SYS_MENU M WHERE M.MODULE_ID=? AND M.SFYX_ST='1'";
        return super.getJdbcTemplate().queryForList(sql, moduleId);
    }

}
