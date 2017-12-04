package net.ruixin.dao.plat.page.impl;

import net.ruixin.dao.plat.page.IPageDao;
import net.ruixin.domain.plat.auth.SysPage;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-9-5
 * 页面DAO实现
 */
@Repository
public class PageDao extends BaseDao<SysPage> implements IPageDao {

    @Override
    public SysPage getPageById(Long pageId) {
        return super.get(pageId);
    }

    @Override
    public void savePage(SysPage sysPage) {
        super.saveOrUpdate(sysPage);
    }

    @Override
    public void deletePage(Long pageId) {
        super.delete(pageId);
    }

    @Override
    public FastPagination getPageList(Map map) {
        StringBuilder sql = new StringBuilder(" SELECT P.ID, P.NAME, P.CODE, P.PAGE_TYPE, SS.VALUE ZDMC, P.URL, P.XGSJ\n" +
                "  FROM SYS_PAGE P, SYS_SUBDICT SS " +
                " WHERE SS.CODE = P.PAGE_TYPE\n" +
                "   AND SS.DICT_CODE = 'YMLX'\n" +
                "   AND SS.SFYX_ST = '1'\n" +
                "   AND P.SFYX_ST = '1' ");
        List<Object> args = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("pageName"))) {
            sql.append(" AND P.NAME LIKE ? ");
            args.add("%" + map.get("pageName") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("pageType"))) {
            sql.append(" AND P.PAGE_TYPE = ? ");
            args.add(map.get("pageType"));
        }
        sql.append(" ORDER BY P.XGSJ DESC ");
        return super.cacheNextTotalPaginationSql(sql, args, map);
    }

    @Override
    public List<Map<String, Object>> getModuleNameByPageId(Long pageId) {
        String sql = "SELECT M.MODULE_NAME\n" +
                "  FROM SYS_MODULE M, SYS_PAGE P\n" +
                " WHERE M.ID = P.MODULE_ID\n" +
                "   AND P.ID = ?\n" +
                "   AND P.SFYX_ST = '1'\n" +
                "   AND M.SFYX_ST = '1' ";
        return super.getJdbcTemplate().queryForList(sql, pageId);
    }

    @Override
    public void clearModuleId(Long moduleId) {
        String sql = "UPDATE SYS_PAGE PAGE SET PAGE.MODULE_ID = NULL WHERE PAGE.MODULE_ID = ?";
        super.getJdbcTemplate().update(sql, moduleId);
    }

    @Override
    public List<Map<String, Object>> getPageSearchList() {
        String sql = ("SELECT    P.ID,\n" +
                "          P.NAME,\n" +
                "          P.CODE,\n" +
                "          P.XGSJ,\n" +
                "          WM_CONCAT(GPA.AUTHROLE_ID) AUTH_IDS\n" +
                "     FROM SYS_PAGE P\n" +
                "LEFT JOIN SYS_GLB_PAGE_AUTHROLE GPA\n" +
                "       ON P.ID = GPA.PAGE_ID\n" +
                "      AND GPA.SFYX_ST = '1'\n" +
                "    WHERE P.SFYX_ST = '1'\n" +
                " GROUP BY P.ID, P.NAME,P.CODE, P.XGSJ\n" +
                " ORDER BY P.XGSJ DESC ");
        return super.getJdbcTemplate().queryForList(sql);
    }

    @Override
    public List<Map<String, Object>> getMenuNameByPageId(Long pageId) {
        String sql = "SELECT M.NAME MENU_NAME FROM SYS_MENU M WHERE M.PAGE_ID=? AND M.SFYX_ST='1'";
        return super.getJdbcTemplate().queryForList(sql, pageId);
    }

    @Override
    public List<Map<String, Object>> getRuleNameByPageId(Long pageId) {
        String sql = "SELECT BR.RULE_NAME\n" +
                "  FROM SYS_AUTH_RULE AR, SYS_BASE_RULE BR\n" +
                " WHERE AR.GL_RULE_ID = BR.ID\n" +
                "   AND AR.SFYX_ST = '1'\n" +
                "   AND BR.SFYX_ST = '1'\n" +
                "   AND INSTR(','|| AR.PAGE_IDS || ',', ',' || ? || ',') > 0";
        return super.getJdbcTemplate().queryForList(sql, pageId);
    }


    @Override
    public List<Map<String, Object>> getWFNameByPageId(Long pageId) {
        String sql = "SELECT W.NAME\n" +
                "  FROM SYS_WORKFLOW_PAGE P, SYS_WORKFLOW W\n" +
                " WHERE P.WORKFLOW_ID = W.ID\n" +
                "   AND P.SFYX_ST = '1'\n" +
                "   AND W.SFYX_ST = '1'\n" +
                "   AND P.PAGE_ID = ?";
        return super.getJdbcTemplate().queryForList(sql, pageId);
    }
}
