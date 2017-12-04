package net.ruixin.dao.plat.auth.impl;

import net.ruixin.dao.plat.auth.IRoleDao;
import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-24.
 * 角色DAO实现
 */
@Repository
public class RoleDao extends BaseDao<SysRole> implements IRoleDao {

    @Override
    public SysRole getRoleById(Long id) {
        return super.get(id);
    }

    @Override
    public void saveRole(SysRole sysRole) {
        super.saveOrUpdate(sysRole);
        super.getSession().flush();
        //调用存储过程
        List<Object> params = new ArrayList<>();
        params.add(sysRole.getId());
        params.add(1);  //参数类型定义 1为roleId、2为organId、3为postId、4为userId   传参调用存储过程
        super.prepareCallNoReturn("{call PKG_PLATFORM.USP_SYS_GLB_ROLE_USER(?,?,?)}", params.toArray());
    }

    @Override
    public void freshRoleUser(Long id) {
        super.getSession().flush();
        //调用存储过程
        List<Object> params = new ArrayList<>();
        params.add(id);
        params.add(1);  //参数类型定义 1为roleId、2为organId、3为postId、4为userId   传参调用存储过程
        super.prepareCallNoReturn("{call PKG_PLATFORM.USP_SYS_GLB_ROLE_USER(?,?,?)}", params.toArray());
    }

    @Override
    public FastPagination getRoleList(Map map) {
        List<Object> params = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT R.ID,\n" +
                "       R.ROLE_NAME,\n" +
                "       R.ROLE_CODE,\n" +
                "       R.ROLE_TYPE,\n" +
                "       (SELECT SS.VALUE\n" +
                "          FROM SYS_SUBDICT SS\n" +
                "         WHERE SS.DICT_CODE = 'JSLX'\n" +
                "           AND SS.SFYX_ST = '1'\n" +
                "           AND SS.CODE = R.ROLE_TYPE) ROLE_TYPE_NAME,\n" +
                "       R.XGSJ,\n" +
                "       SUM(DECODE(GR.GL_TYPE, '2', 1, 0)) ORGANCT,\n" +
                "       SUM(DECODE(GR.GL_TYPE, '1', 1, 0)) POSTCT,\n" +
                "       SUM(DECODE(GR.GL_TYPE, '3', 1, 0)) USERCT,\n" +
                "       (SELECT NVL(SUM(NVL2(RULE_ID, 1, 0)), 0)\n" +
                "          FROM SYS_GLB_ROLE_AUTHRULE\n" +
                "         WHERE ROLE_ID = R.ID\n" +
                "           AND SFYX_ST = '1') GLRULE,\n" +
                "       (SELECT NVL(SUM(NVL2(MENU_ID, 1, 0)), 0)\n" +
                "          FROM SYS_GLB_MENU GM, SYS_MENU M\n" +
                "         WHERE M.SFYX_ST = '1'\n" +
                "           AND GM.MENU_ID = M.ID\n" +
                "           AND GM.GL_ID = R.ID\n" +
                "           AND GM.GL_TYPE = '1') GLMENU,\n" +
                "       (SELECT NVL(SUM(NVL2(GPA.AUTHROLE_ID, 1, 0)), 0)\n" +
                "          FROM SYS_GLB_PAGE_AUTHROLE GPA, SYS_GLB_ROLE_PAGEAUTHROLE GRP\n" +
                "         WHERE GPA.ID = GRP.PAGEAUTHROLE_ID\n" +
                "           AND GRP.ROLE_ID = R.ID\n" +
                "           AND GRP.SFYX_ST = '1'\n" +
                "           AND GPA.SFYX_ST = '1') GLAUTH\n" +
                "  FROM SYS_ROLE R\n" +
                "  LEFT JOIN SYS_GLB_ROLE GR\n" +
                "    ON GR.ROLE_ID = R.ID\n" +
                "   AND GR.SFYX_ST = '1'\n" +
                "   AND GR.SFQY_ST = '1'\n" +
                " WHERE R.SFYX_ST = '1' ");
        if (RxStringUtils.isNotEmpty(map.get("roleName"))) {
            sql.append(" AND R.ROLE_NAME LIKE ? ");
            params.add("%" + map.get("roleName") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("roleCode"))) {
            sql.append(" AND R.ROLE_CODE LIKE ? ");
            params.add("%" + map.get("roleCode") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("roleType"))) {
            sql.append(" AND R.ROLE_TYPE IN (SELECT COLUMN_VALUE FROM TABLE (SPLITSTR(?,','))) ");
            params.add(map.get("roleType"));
        }
        if (RxStringUtils.isNotEmpty(map.get("glType")) && "2".equals(map.get("glType").toString())) {
            sql.append(" AND GR.GL_TYPE = '2' AND GR.GL_ID = ? ");
            params.add(map.get("gl_id"));
        } else if (RxStringUtils.isNotEmpty(map.get("glType")) && "1".equals(map.get("glType").toString())) {
            sql.append(" AND (GR.GL_TYPE = '1'\n" +
                    "    AND GR.GL_ID = ?\n" +
                    "     OR (GR.GL_TYPE = '2' AND\n" +
                    "        GR.GL_ID = (SELECT SP.ORGAN\n" +
                    "                      FROM SYS_POST SP\n" +
                    "                     WHERE SP.ID = ?\n" +
                    "                       AND SP.SFYX_ST = '1'))) ");
            params.add(map.get("gl_id"));
            params.add(map.get("gl_id"));
        } else if (RxStringUtils.isNotEmpty(map.get("glType")) && "3".equals(map.get("glType").toString())) {
            sql.append(" AND R.ID IN (SELECT RU.ROLE_ID\n" +
                    "                   FROM SYS_GLB_ROLE_USER RU\n" +
                    "                  WHERE RU.USER_ID =?\n" +
                    "                    AND RU.SFYX_ST = '1') ");
            params.add(map.get("gl_id"));
        }
        sql.append(" GROUP BY R.ID,R.ROLE_NAME,R.ROLE_CODE,R.ROLE_TYPE,R.XGSJ ORDER BY R.XGSJ DESC");
        return super.cacheNextPagePaginationSql(sql, params, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public List getRoleGlDataList(String roleIds) {
        Map<String, Object> map = new HashMap<>();
        String[] roleId = roleIds.split(",");
        StringBuilder roleIdIn = new StringBuilder();
        for (int i = 0; i < roleId.length; i++) {
            roleIdIn.append(":ROLEID").append(i);
            if (i < roleId.length - 1) {
                roleIdIn.append(",");
            }
            map.put("ROLEID" + i, roleId[i]);
        }
        String sql = ("SELECT O.ID, O.ORGAN_NAME MC, GR.GL_TYPE, GR.SFQY_ST, SO.ORGAN_NAME SSZZ\n" +
                "  FROM SYS_GLB_ROLE GR, SYS_ORGAN O\n" +
                "  LEFT JOIN SYS_ORGAN SO\n" +
                "    ON SO.ID = O.PARENT_ORG\n" +
                "   AND SO.SFYX_ST = '1'\n" +
                " WHERE GR.GL_ID = O.ID\n" +
                "   AND GR.SFYX_ST = '1'\n" +
                "   AND O.SFYX_ST = '1'\n" +
                "   AND GR.GL_TYPE = '2'\n" +
                "   AND GR.ROLE_ID IN ( ") +
                roleIdIn +
                " ) UNION ALL\n" +
                "SELECT P.ID, P.POST_NAME MC, GR.GL_TYPE, GR.SFQY_ST, SO.ORGAN_NAME SSZZ\n" +
                "  FROM SYS_GLB_ROLE GR, SYS_POST P\n" +
                "  LEFT JOIN SYS_ORGAN SO\n" +
                "    ON SO.ID = P.ORGAN\n" +
                "   AND SO.SFYX_ST = '1'\n" +
                " WHERE GR.GL_ID = P.ID\n" +
                "   AND GR.SFYX_ST = '1'\n" +
                "   AND P.SFYX_ST = '1'\n" +
                "   AND GR.GL_TYPE = '1'\n" +
                "   AND GR.ROLE_ID IN ( " +
                roleIdIn +
                " ) UNION ALL\n" +
                "SELECT U.ID,\n" +
                "       U.USER_NAME MC,\n" +
                "       GR.GL_TYPE,\n" +
                "       GR.SFQY_ST,\n" +
                "       WM_CONCAT(SO.ORGAN_NAME) SSZZ\n" +
                "  FROM SYS_GLB_ROLE GR, SYS_USER U\n" +
                "  LEFT JOIN SYS_GLB_ORGAN_USER_POST OUP\n" +
                "    ON OUP.USER_ID = U.ID\n" +
                "   AND OUP.SFYX_ST = '1'\n" +
                "  LEFT JOIN SYS_ORGAN SO\n" +
                "    ON SO.ID = OUP.ORGAN_ID\n" +
                "   AND SO.SFYX_ST = '1'\n" +
                " WHERE GR.GL_ID = U.ID\n" +
                "   AND GR.SFYX_ST = '1'\n" +
                "   AND U.SFYX_ST = '1'\n" +
                "   AND GR.GL_TYPE = '3'\n" +
                "   AND GR.ROLE_ID IN ( " +
                roleIdIn +
                " ) GROUP BY U.ID, U.USER_NAME, GR.GL_TYPE, GR.SFQY_ST\n" +
                "  ORDER BY GL_TYPE DESC ";
        return super.getNpJdbcTemplate().queryForList(sql, map);
    }

    @Override
    public void deleteRole(Long roleId) {
        super.deleteCascade(roleId);
        String dSql = "DELETE FROM SYS_GLB_MENU GM WHERE GM.GL_ID = ? AND GM.GL_TYPE = '1'";
        super.executeSqlUpdate(dSql, roleId);
        List<Object> params = new ArrayList<>();
        params.add(roleId);
        params.add(1);  //参数类型定义 1为roleId、2为organId、3为postId、4为userId
        super.prepareCallNoReturn("{call PKG_PLATFORM.USP_SYS_GLB_ROLE_USER(?,?,?)}", params.toArray());
    }

    @Override
    public List<Map<String, Object>> getRoleByGlxx(String gl_ids, String gl_type) {
        String sql = ("SELECT R.ID   ROLEID," +
                "       1 SFGL,\n" +
                "       R.ROLE_CODE,\n" +
                "       R.ROLE_NAME,\n" +
                "       R.ROLE_TYPE,\n" +
                "       SS.VALUE     ROLE_TYPE_NAME,\n" +
                "       DECODE(GR.SFQY_ST,'0','UNVALID','1','VALID') SFQY_ST\n" +
                "  FROM SYS_ROLE R, SYS_GLB_ROLE GR, SYS_SUBDICT SS\n" +
                " WHERE R.ID = GR.ROLE_ID\n" +
                "   AND R.ROLE_TYPE = SS.CODE\n" +
                "   AND SS.DICT_CODE = 'JSLX'\n" +
                "   AND SS.SFYX_ST = '1'\n" +
                "   AND R.SFYX_ST = '1'\n" +
                "   AND GR.SFYX_ST = '1'\n" +
                "   AND GR.GL_TYPE = ?\n" +
                "   AND GR.GL_ID IN (select column_value from table(splitstr(?, ',')))\n" +
                " GROUP BY R.ID, R.ROLE_CODE, R.ROLE_NAME, R.ROLE_TYPE, SS.VALUE, GR.SFQY_ST" +
                " ORDER BY GR.SFQY_ST ");
        return super.getJdbcTemplate().queryForList(sql, gl_type, gl_ids);
    }

    @Override
    public List<Map<String, Object>> getRoleListByEleId(Long eleId, String gl_type) {
        String sql = ("SELECT DISTINCT R.ID,\n" +
                "                R.ROLE_CODE,\n" +
                "                R.ROLE_NAME,\n" +
                "                R.ROLE_TYPE,\n" +
                "                SS.VALUE ROLETYPE_NAME,\n" +
                "                GR.SFQY_ST" +
                "  FROM SYS_ROLE R, SYS_GLB_ROLE GR, SYS_SUBDICT SS\n" +
                " WHERE GR.ROLE_ID = R.ID\n" +
                "   AND R.ROLE_TYPE = SS.CODE\n" +
                "   AND SS.DICT_CODE = 'JSLX'\n" +
                "   AND SS.SFYX_ST = '1'\n" +
                "   AND GR.SFYX_ST = '1'\n" +
                "   AND R.SFYX_ST = '1'\n" +
                "   AND GR.GL_ID = ?\n" +
                "   AND GR.GL_TYPE = ?");
        return super.getJdbcTemplate().queryForList(sql, eleId, gl_type);
    }

    @Override
    public void setHf_st(String type, Long glId, String hf_st, String sfyx_st) {
        String sql = "UPDATE SYS_GLB_ROLE GLB SET SFYX_ST=?,HF_ST=? WHERE GLB.GL_ID=? AND GLB.GL_TYPE=? ";
        super.executeSqlUpdate(sql, sfyx_st, hf_st, glId, type);
    }

    @Override
    public boolean checkRoleHasUser(Long roleId) {
        String sql = "SELECT COUNT(ID) SL FROM SYS_GLB_ROLE_USER WHERE SFYX_ST = '1' AND ROLE_ID = ? ";
        return super.getJdbcTemplate().queryForObject(sql, Integer.class, roleId) > 0;
    }

    @Override
    public List<Map<String, Object>> getRoleGlRule(Long roleId) {
        String sql = "SELECT AR.ID, AR.XGSJ, BR.RULE_NAME, BR.DESCRIPTION\n" +
                "  FROM SYS_AUTH_RULE AR, SYS_BASE_RULE BR, SYS_GLB_ROLE_AUTHRULE GRA\n" +
                " WHERE AR.SFYX_ST = '1'\n" +
                "   AND BR.SFYX_ST = '1'\n" +
                "   AND GRA.SFYX_ST = '1'\n" +
                "   AND GRA.ROLE_ID = ?\n" +
                "   AND AR.ID = GRA.RULE_ID\n" +
                "   AND AR.GL_RULE_ID = BR.ID";
        return super.getJdbcTemplate().queryForList(sql, roleId);
    }

    @Override
    public void saveRoleMenu(Long id, String menuIds) {
        //删除原有的角色关联菜单
        String delSql = "DELETE FROM SYS_GLB_MENU GM WHERE GM.GL_ID = ? AND GM.GL_TYPE = '1'";
        super.executeSqlUpdate(delSql, id);

        //生成角色与菜单关联关系
        if (RxStringUtils.isNotEmpty(menuIds)) {
            String insertSql = "INSERT INTO SYS_GLB_MENU(ID,GL_ID,GL_TYPE,MENU_ID) VALUES(SEQ_SYS_GLB_MENU.NEXTVAL,?,'1',?)";
            for (String menuId : menuIds.split(",")) {
                super.executeSqlUpdate(insertSql,id,Integer.parseInt(menuId));
            }
        }
    }

    @Override
    public String getRoleAuthTypeByUserId(Long userId) {
        String sql = "select max(r.auth_type)\n" +
                "  from SYS_GLB_ROLE_USER t, sys_role r\n" +
                " where t.sfyx_st = '1'\n" +
                "   and r.sfyx_st = '1'\n" +
                "   and r.id = t.role_id\n" +
                "   and t.user_id = ?";
        return super.getJdbcTemplate().queryForObject(sql, String.class, userId);
    }

    @Override
    public FastPagination getRoleGlbUser(Map map, Long roleId) {
        List<Object> params = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT SUSER.USER_NAME, ORGAN.ORGAN_NAME\n" +
                "  FROM SYS_USER SUSER, sys_glb_role_user SGR, SYS_ORGAN ORGAN\n" +
                " WHERE SGR.User_Id = SUSER.ID\n" +
                "   AND ORGAN.ID = SUSER.DEFAULT_ORGAN_ID\n" +
                "   AND SGR.ROLE_ID = ?\n" +
                "   AND SUSER.SFYX_ST = '1'\n" +
                "   AND SGR.SFYX_ST = '1'\n" +
                "   AND ORGAN.SFYX_ST = '1'\n");

        params.add(roleId);
        if(RxStringUtils.isNotEmpty(map.get("user_name"))){
            sql.append(" AND SUSER.USER_NAME LIKE ? ");
            params.add("%"+map.get("user_name")+"%");
        }
        if(RxStringUtils.isNotEmpty(map.get("organ_name"))){
            sql.append(" AND ORGAN.ORGAN_NAME LIKE ? ");
            params.add("%"+map.get("organ_name")+"%");
        }
        sql.append(" ORDER BY ORGAN.ORGAN_CODE");
        return super.cacheNextPagePaginationSql(sql, params, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public List<Map<String, Object>> getWFNameByRoleId(Long roleId) {
        String sql = "SELECT SW.NAME FROM SYS_WORKFLOW SW WHERE SW.SFYX_ST='1' " +
                " AND EXISTS(SELECT 1 FROM SYS_NODE SN,SYS_TRANSACT_NODE STN " +
                " WHERE SN.ID=STN.ID AND SN.WORKFLOW_ID=SW.ID AND SN.SFYX_ST='1' AND STN.ROLE_ID= ?)";
        return super.getJdbcTemplate().queryForList(sql, roleId);
    }
}
