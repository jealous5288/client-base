package net.ruixin.dao.plat.auth.impl;

import net.ruixin.dao.plat.auth.IAuthCfgDao;
import net.ruixin.domain.plat.auth.SysDataAuth;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.jdbc.BadSqlGrammarException;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 权限控制类——控制规则、功能权限、数据权限
 */
@Repository
public class AuthCfgDao extends BaseDao<SysDataAuth> implements IAuthCfgDao {

    @Override
    public List<Map<String, Object>> getAuthRoleListByPageId(Long pageId) {
        String sql = ("SELECT AR.ID, AR.NAME, AR.CODE, AR.DESCRIPTION, GPA.ID PAGEAUTHROLEID\n" +
                "  FROM SYS_GLB_PAGE_AUTHROLE GPA, SYS_ACTION_AUTH AR\n" +
                " WHERE GPA.AUTHROLE_ID = AR.ID\n" +
                "   AND GPA.PAGE_ID = ?\n" +
                "   AND GPA.SFYX_ST = '1' " +
                "   AND AR.SFYX_ST = '1' ");
        return super.getJdbcTemplate().queryForList(sql, pageId);
    }

    @Override
    public List<Map<String, Object>> getAuthRoleListByRoleId(Long roleId) {
        String sql = ("SELECT P.ID     PAGE_ID,\n" +
                "       P.NAME,\n" +
                "       GPA.AUTHROLE_ID,\n" +
                "       GPA.ID         GLB_ID,\n" +
                "       GRP.ID         GRM_ID, \n" +
                "       GRP.ROLE_ID\n" +
                "  FROM SYS_PAGE P\n" +
                "  LEFT JOIN SYS_GLB_PAGE_AUTHROLE GPA\n" +
                "    ON P.ID = GPA.PAGE_ID\n" +
                "   AND GPA.SFYX_ST = '1'\n" +
                "  LEFT JOIN SYS_GLB_ROLE_PAGEAUTHROLE GRP\n" +
                "    ON GPA.ID = GRP.PAGEAUTHROLE_ID\n" +
                "   AND GRP.SFYX_ST = '1'\n" +
                " WHERE P.SFYX_ST='1' AND GRP.ROLE_ID = ?\n" +
                " ORDER BY P.ID DESC");
        return super.getJdbcTemplate().queryForList(sql, roleId);
    }

    @Override
    public FastPagination getObjectList(Map map) {
        List<Object> args = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT DA.OBJECT_ID, O.OBJ_NAME, O.DB_NAME, WM_CONCAT(F.FIELD_NAME) FIELD_NAMES\n" +
                "  FROM SYS_DATA_AUTH DA\n" +
                "  LEFT JOIN SYS_OBJECT O\n" +
                "    ON O.ID = DA.OBJECT_ID\n" +
                "   AND O.SFYX_ST = '1'\n" +
                "  LEFT JOIN SYS_FIELD F\n" +
                "    ON O.ID = F.OBJ_ID\n" +
                "   AND F.SFYX_ST = '1'\n" +
                " WHERE DA.SFYX_ST = '1' ");
        if (RxStringUtils.isNotEmpty(map.get("objectName"))) {
            sb.append(" AND O.OBJ_NAME LIKE ? ");
            args.add("%" + map.get("objectName") + "%");
        }
        sb.append(" GROUP BY DA.OBJECT_ID, O.OBJ_NAME, O.DB_NAME ORDER BY O.XGSJ DESC");
        return super.cacheNextPagePaginationSql(sb, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));

    }

    @Override
    public FastPagination getOraDataAuthListByParam(Map map) {
        Boolean hasSfyx_st = true;
        try {
            super.getJdbcTemplate().queryForList("SELECT SFYX_ST FROM " + map.get("db_name") + " WHERE ROWNUM < 2 ");
        } catch (BadSqlGrammarException e) {
            hasSfyx_st = false;
        }
        List<Object> args = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        sb.append("WITH A AS\n" +
                " (SELECT SDS.OIDS, SDS.PAGE_IDS PAGE_IDS, SDS.QXLX\n" +
                "    FROM SYS_DATA_AUTH SDS\n" +
                "   WHERE SDS.OBJECT_ID = ?\n" +
                "     AND SDS.USER_ID = ? ");
        args.add(map.get("object_id"));
        args.add(map.get("user_id"));
        if (RxStringUtils.isNotEmpty(map.get("page_id"))) {
            sb.append(" AND (SDS.PAGE_IDS IS NULL OR INSTR(',' || SDS.PAGE_IDS || ',', ','||?||',') > 0) ");
            args.add("," + map.get("page_id") + ",");
        }
        sb.append(" AND SDS.SFYX_ST = '1') SELECT ").append(map.get("field_names")).append(",");
        sb.append(" (SELECT WM_CONCAT(P.NAME)\n" +
                "          FROM SYS_PAGE P\n" +
                "         WHERE INSTR(',' || SDA.PAGE_IDS || ',', ',' || P.ID || ',') > 0) PAGE_NAMES\n" +
                "  FROM (SELECT MAX(DA.QXLX) QXLX, DA.OIDS, DA.PAGE_IDS\n" +
                "          FROM (SELECT REGEXP_SUBSTR(A.OIDS, '[^,]+', 1, LEVEL, 'i') OIDS,\n" +
                "                       A.QXLX,\n" +
                "                       A.PAGE_IDS PAGE_IDS\n" +
                "                  FROM A\n" +
                "                CONNECT BY LEVEL <=\n" +
                "                           LENGTH(A.OIDS) - LENGTH(REPLACE(A.OIDS, ',')) + 1) DA\n" +
                "         GROUP BY DA.OIDS, DA.PAGE_IDS) SDA, ");
        sb.append(map.get("db_name"));
        sb.append(" S WHERE (S.ID = SDA.OIDS OR SDA.OIDS IS NULL) ");
        if (hasSfyx_st) {
            sb.append(" AND S.SFYX_ST = '1' ");
        }
        sb.append(" ORDER BY S.ID DESC ");
        return super.cacheNextPagePaginationSql(sb, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public FastPagination getPerDataAuthListByParam(Map map) {
        List<Object> args = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        if ("1".equals(map.get("ztlx"))) {  //1：角色
            sb.append("SELECT R.ROLE_NAME ZT_NAME, R.ID ZT_ID, ");
        } else if ("2".equals(map.get("ztlx"))) {   //2：用户
            sb.append("SELECT U.USER_NAME ZT_NAME, U.ID ZT_ID, ");
        }
        sb.append(" DA.ID, DA.QXLX, SO.OBJ_NAME, SO.ID OBJID, DECODE(DA.OIDS, NULL, '全部', '部分') SJFW,\n" +
                "       DECODE(DA.RULE_ID, NULL, 1, 0) SFZDY,\n" +
                "       (SELECT WM_CONCAT(P.NAME)\n" +
                "          FROM SYS_PAGE P\n" +
                "         WHERE INSTR(',' || DA.PAGE_IDS || ',', ',' || P.ID || ',') > 0 AND P.SFYX_ST = '1' ) PAGE_NAME ");
        if ("1".equals(map.get("ztlx"))) {  //1：角色
            sb.append(" FROM SYS_ROLE R, SYS_DATA_AUTH DA\n" +
                    "  LEFT JOIN SYS_OBJECT SO\n" +
                    "    ON DA.OBJECT_ID = SO.ID\n" +
                    " WHERE R.ID = DA.ROLE_ID\n" +
                    "   AND R.SFYX_ST = '1'\n" +
                    "   AND DA.SFYX_ST = '1' ");
            if (RxStringUtils.isNotEmpty(map.get("zt_id"))) {
                sb.append(" AND R.ID=? ");
                args.add(map.get("zt_id"));
            }
        } else if ("2".equals(map.get("ztlx"))) {   //2：用户
            sb.append(" FROM SYS_USER U, SYS_DATA_AUTH DA\n" +
                    "  LEFT JOIN SYS_OBJECT SO\n" +
                    "    ON DA.OBJECT_ID = SO.ID\n" +
                    " WHERE U.ID = DA.USER_ID\n" +
                    "   AND U.SFYX_ST = '1' \n" +
                    "   AND DA.SFYX_ST = '1' ");
            if (RxStringUtils.isNotEmpty(map.get("zt_id"))) {
                sb.append(" AND U.ID=? ");
                args.add(map.get("zt_id"));
            }
        }
        if (RxStringUtils.isNotEmpty(map.get("object_id"))) {
            sb.append(" AND DA.OBJECT_ID=? ");
            args.add(map.get("object_id"));
        }
        if (RxStringUtils.isNotEmpty(map.get("page_id"))) {
            sb.append(" AND (DA.PAGE_IDS IS NULL OR INSTR(',' || DA.PAGE_IDS || ',', ','||?||',') > 0) ");
            args.add("," + map.get("page_id") + ",");
        }
        sb.append(" ORDER BY DA.CJSJ DESC ");
        return super.cacheNextPagePaginationSql(sb, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public void deleteDataAuth(String ztlx, Long id, Long objId) {
        StringBuilder sb = new StringBuilder();
        sb.append("UPDATE SYS_DATA_AUTH SET SFYX_ST='0' WHERE 1=1 ");
        if ("1".equals(ztlx)) {        //1：角色
            sb.append(" AND ROLE_ID=? AND OBJECT_ID=? AND RULE_ID IS NULL ");
            super.executeSqlUpdate(sb, id, objId);
        } else if ("2".equals(ztlx)) {  //2：用户
            sb.append(" AND ID=? ");
            super.executeSqlUpdate(sb, id);
        }

    }

    @Override
    public SysDataAuth getDataAuthById(Long dataAuthId) {
        return super.get(dataAuthId);
    }

    @Override
    public void saveDataAuth(SysDataAuth sysDataAuth) {
        if (sysDataAuth.getRoleId() == null) {
            super.saveOrUpdate(sysDataAuth);
        } else {
            Object[] objs = new Object[]{sysDataAuth.getRoleId(), sysDataAuth.getUserId(),
                    sysDataAuth.getRuleId(), sysDataAuth.getObjectId(), sysDataAuth.getOids(),
                    sysDataAuth.getPageIds(), sysDataAuth.getQxlx()};
            super.prepareCallNoReturn("{call PKG_PLATFORM.USP_SYS_DATA_AUTH(?,?,?,?,?,?,?,?)}", objs);
        }
    }

    /**
     *  根据用户id获取页面功能权限
     * @param userId 用户id
     * @return
     */
	@Override
    public List<Map<String, Object>> getPageActionAuthByUserId(Long userId) {
        String sql = "SELECT P.CODE PAGE_CODE, WM_CONCAT(DISTINCT AR.CODE) ACTION_AUTH_CODES\n" +
                "  FROM SYS_GLB_ROLE_USER         GRU,\n" +
                "       SYS_GLB_ROLE_PAGEAUTHROLE GRP,\n" +
                "       SYS_GLB_PAGE_AUTHROLE     GPA,\n" +
                "       SYS_PAGE                  P,\n" +
                "       SYS_ACTION_AUTH             AR\n" +
                " WHERE GRU.ROLE_ID = GRP.ROLE_ID\n" +
                "   AND GRP.PAGEAUTHROLE_ID = GPA.ID\n" +
                "   AND GPA.PAGE_ID = P.ID\n" +
                "   AND GPA.AUTHROLE_ID = AR.ID\n" +
                "   AND GRU.SFYX_ST = '1'\n" +
                "   AND GRP.SFYX_ST = '1'\n" +
                "   AND GPA.SFYX_ST = '1'\n" +
                "   AND P.SFYX_ST = '1'\n" +
                "   AND AR.SFYX_ST = '1'\n" +
                "   AND GRU.USER_ID = ?\n" +
                " GROUP BY P.CODE ";
        return super.getJdbcTemplate().queryForList(sql, userId);
    }
}
