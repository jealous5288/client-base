package net.ruixin.dao.plat.auth.impl;

import net.ruixin.dao.plat.auth.IRuleDao;
import net.ruixin.domain.plat.auth.SysAuthRule;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-9-22.
 * 权限规则
 */
@Repository
public class RuleDao extends BaseDao<SysAuthRule> implements IRuleDao {

    @Override
    public FastPagination getAuthRuleList(Map map) {
        StringBuilder sb = new StringBuilder();
        List<Object> args = new ArrayList<>();
        sb.append("SELECT AR.ID,\n" +
                "         AR.GL_RULE_ID,\n" +
                "         BR.RULE_NAME,\n" +
                "         BR.DESCRIPTION,\n" +
                "         (SELECT SS.VALUE\n" +
                "            FROM SYS_SUBDICT SS\n" +
                "           WHERE SS.DICT_CODE = 'GZLX'\n" +
                "             AND SS.SFYX_ST = '1'\n" +
                "             AND SS.CODE = AR.GZLX) GZLX,\n" +
                "         (SELECT SS.VALUE\n" +
                "            FROM SYS_SUBDICT SS\n" +
                "           WHERE SS.DICT_CODE = 'GZSXFS'\n" +
                "             AND SS.SFYX_ST = '1'\n" +
                "             AND SS.CODE = BR.SXFS) SXFS,\n" +
                "         AR.XGSJ\n" +
                "    FROM SYS_AUTH_RULE AR, SYS_BASE_RULE BR\n" +
                "   WHERE BR.ID = AR.GL_RULE_ID\n" +
                "     AND AR.SFYX_ST = '1'\n" +
                "     AND BR.SFYX_ST = '1' ");
        if (RxStringUtils.isNotEmpty(map.get("RULE_NAME"))) {
            sb.append(" AND BR.RULE_NAME LIKE ? ");
            args.add("%" + map.get("RULE_NAME") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("GZLX"))) {
            sb.append(" AND AR.GZLX= ? ");
            args.add(map.get("GZLX"));
        }
        sb.append(" ORDER BY AR.XGSJ DESC ");
        return super.cacheNextPagePaginationSql(sb, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public SysAuthRule getAuthRuleById(Long authRuleId) {
        return super.get(authRuleId);
    }

    @Override
    public void saveAuthRule(SysAuthRule sysAuthRule) {
        super.saveOrUpdate(sysAuthRule);
    }

    @Override
    public void delAuthRule(Long authRuleId) {
        super.deleteCascade(authRuleId);
    }

    @Override
    public List<Map<String, Object>> getRoleNameByRuleId(Long ruleId) {
        String sql = "SELECT R.ROLE_NAME\n" +
                "  FROM SYS_GLB_ROLE_AUTHRULE RA, SYS_ROLE R\n" +
                " WHERE RA.ROLE_ID = R.ID\n" +
                "   AND RA.SFYX_ST = '1'\n" +
                "   AND R.SFYX_ST = '1'\n" +
                "   AND RA.RULE_ID = ? ";
        return super.getJdbcTemplate().queryForList(sql, ruleId);
    }

    @Override
    public boolean checkRuleDetail(String ruleDetail) {
        String sql = ruleDetail.replaceAll("<br>","\n").replaceAll(":user_id", "1").replaceAll(":data_id", "1");
        try {
            super.executeSqlUpdate(sql);
        } catch (Exception e) {
            return false;
        }
        return true;
    }

}
