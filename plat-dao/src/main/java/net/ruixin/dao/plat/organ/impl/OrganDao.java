package net.ruixin.dao.plat.organ.impl;

import net.ruixin.dao.plat.organ.IOrganDao;
import net.ruixin.domain.plat.organ.SysOrgan;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-16.
 * 机构DAO实现
 */
@Repository
public class OrganDao extends BaseDao<SysOrgan> implements IOrganDao {

    @Override
    public SysOrgan getOrganById(Long id) {
        return super.get(id);
    }

    @Override
    public FastPagination getSysOrganPagingList(Map map, String hasDelData) {
        StringBuilder sql = new StringBuilder();
        List<Object> params = new ArrayList<>();
        sql.append("SELECT O.ID,\n" +
                "       O.ORGAN_NAME,\n" +
                "       O.ORGAN_CODE,\n" +
                "       O.FULL_NAME,\n" +
                "       O.SFYX_ST,\n" +
                "       O.SFKHF,\n" +
                "       (SELECT ORGAN_NAME FROM SYS_ORGAN WHERE ID = O.PARENT_ORG) SJ_ORGAN\n" +
                "  FROM SYS_ORGAN O\n" +
                " WHERE 1 = 1 ");
        if (RxStringUtils.isNotEmpty(map.get("parent_org"))) {
            sql.append(" AND O.PARENT_ORG = ? ");
            params.add(map.get("parent_org"));
        }
        if (RxStringUtils.isNotEmpty(map.get("organ_name"))) {
            sql.append(" AND O.ORGAN_NAME LIKE ? ");
            params.add("%" + map.get("organ_name") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("full_name"))) {
            sql.append(" AND O.FULL_NAME LIKE ? ");
            params.add("%" + map.get("full_name") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("organ_code"))) {
            sql.append(" AND O.ORGAN_CODE LIKE ? ");
            params.add("%" + map.get("organ_code") + "%");
        }
        if (RxStringUtils.isEmpty(hasDelData)) {
            sql.append(" AND O.SFYX_ST = '1' ");
        } else {
            sql.append(" AND (O.SFYX_ST = '1' OR O.SFKHF = '1') ");
        }
        sql.append(" ORDER BY O.XGSJ DESC ");
        return super.cacheNextPagePaginationSql(sql, params, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public void saveOrgan(SysOrgan sysOrgan) {
        super.saveOrUpdate(sysOrgan);
        super.getSession().flush();
        //调用存储过程
        List<Object> params = new ArrayList<>();
        params.add(sysOrgan.getId());
        params.add(2);  //参数类型定义 1为roleId、2为organId、3为postId、4为userId
        super.prepareCallNoReturn("{call PKG_PLATFORM.USP_SYS_GLB_ROLE_USER(?,?,?)}", params.toArray());
    }

    @Override
    public List<Map<String, Object>> getOrganListByParentId(Long id, String hasDelData) {
        StringBuilder sql = new StringBuilder("SELECT O.ID,\n" +
                "       O.ORGAN_CODE,\n" +
                "       O.ORGAN_NAME MC,\n" +
                "       O.FULL_NAME QC,\n" +
                "       O.PARENT_ORG,\n" +
                "       O.SFYX_ST," +
                "       O.SFKHF,\n" +
                "       (SELECT COUNT(1)\n" +
                "          FROM SYS_ORGAN SO\n" +
                "         WHERE SO.PARENT_ORG = O.ID\n" +
                "           AND (SO.SFYX_ST = '1' OR SO.SFKHF='1')) JGCT,\n" +
                "       (SELECT COUNT(1)\n" +
                "          FROM SYS_POST SP\n" +
                "         WHERE SP.ORGAN = O.ID\n" +
                "           AND (SP.SFYX_ST='1' OR SP.SFKHF = '1')) GWCT,\n" +
                "       (SELECT COUNT(OUP.USER_ID)\n" +
                "          FROM SYS_GLB_ORGAN_USER_POST OUP\n" +
                "         WHERE OUP.ORGAN_ID = O.ID\n" +
                "           AND OUP.SFYX_ST='1') USERCT\n" +
                "  FROM SYS_ORGAN O\n" +
                " WHERE 1=1 ");
        if (RxStringUtils.isEmpty(hasDelData)) {
            sql.append(" AND O.SFYX_ST = '1' ");
        } else {
            sql.append(" AND (O.SFYX_ST = '1' OR O.SFKHF = '1') ");
        }
        if (null == id || 0 == id) {
            sql.append(" AND O.PARENT_ORG IS NULL ORDER BY O.SORT_NUM ");
            return super.getJdbcTemplate().queryForList(sql.toString());
        } else {
            sql.append(" AND O.PARENT_ORG = ? ORDER BY O.SORT_NUM ");
            return super.getJdbcTemplate().queryForList(sql.toString(), id);
        }
    }

    @Override
    public boolean hasOrganName(Long organId, String organName, Long parentOrg) {
        if (null == parentOrg) {  //无上级组织
            return false;
        }
        StringBuilder sql = new StringBuilder("SELECT COUNT(O.ID) SL FROM SYS_ORGAN O " +
                "WHERE O.PARENT_ORG=:PARENT_ORG AND O.ORGAN_NAME=:ORGAN_NAME AND O.SFYX_ST='1'");
        Map<String, Object> queryMap = new HashMap<>();
        queryMap.put("PARENT_ORG", parentOrg);
        queryMap.put("ORGAN_NAME", organName);
        if (null != organId) {  //修改
            sql.append(" AND O.ID <> :ORGAN_ID ");
            queryMap.put("ORGAN_ID", organId);
        }
        Map map = super.getNpJdbcTemplate().queryForMap(sql.toString(), queryMap);
        return Integer.parseInt(map.get("SL").toString()) > 0;
    }

    @Override
    public void able(Long organId) {
        SysOrgan organ = super.get(organId);
        organ.setSfyx_st(Sfyx_st.VALID);
        organ.setSfkhf("0");
        this.saveOrgan(organ);
    }

    @Override
    public void del(Long organId, Long newOrganId) {
        //调用存储过程
        List<Object> params = new ArrayList<>();
        params.add(organId);     //机构id
        params.add(newOrganId);  //调整后机构id
        super.prepareCallNoReturn("{call PKG_PLATFORM.USP_ORG_DELETE_UPDATE(?,?,?)}", params.toArray());
    }

    @Override
    public void pause(Long organId) {
        SysOrgan organ = super.get(organId);
        organ.setSfyx_st(Sfyx_st.UNVALID);
        organ.setSfkhf("1");
        this.saveOrgan(organ);
    }

    @Override
    public boolean isOrganHasPost(Long organId, Long filterId) {
        List<Object> args = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT COUNT(P.ID) SL FROM SYS_POST P WHERE P.SFYX_ST='1' AND P.ORGAN=? ");
        args.add(organId);
        if (RxStringUtils.isNotEmpty(filterId)) {
            sql.append(" AND P.ID <> ? ");
            args.add(filterId);
        }
        return super.getJdbcTemplate().queryForObject(sql.toString(), Integer.class, args.toArray()) > 0;
    }

    @Override
    public SysOrgan getOrganByCode(String code) {
        return super.getByHql("FROM  SysOrgan  WHERE  ORGAN_CODE = ? ", code);
    }

    @Override
    public List<Map<String, Object>> getBmByUserId(Long userId) {
        String sql = "SELECT ID, ORGAN_CODE, ORGAN_NAME\n" +
                "  FROM SYS_ORGAN\n" +
                " WHERE PARENT_ORG = 10\n" +
                " START WITH ID = (SELECT U.DEFAULT_ORGAN_ID FROM SYS_USER U WHERE U.ID = ?)\n" +
                "CONNECT BY ID = PRIOR PARENT_ORG\n" +
                " ORDER BY ORGAN_CODE";
        return super.getJdbcTemplate().queryForList(sql, userId);
    }

}
