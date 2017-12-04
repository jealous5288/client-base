package net.ruixin.dao.plat.auth.impl;

import net.ruixin.dao.plat.auth.IAuthRoleDao;
import net.ruixin.domain.plat.auth.SysAuthRole;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-19.
 * 功能权限DAO实现
 */
@Repository
public class AuthRoleDao extends BaseDao<SysAuthRole> implements IAuthRoleDao {

    @Override
    public SysAuthRole getAuthRoleById(Long id) {
        return super.get(id);
    }

    @Override
    public FastPagination getAuthRoleList(Map map) {
        StringBuilder sb = new StringBuilder();
        sb.append("SELECT A.ID, A.NAME, A.CODE, A.DESCRIPTION, A.SFYX_ST\n" +
                "  FROM SYS_ACTION_AUTH A\n" +
                " WHERE A.TYPE = '1' AND A.SFYX_ST = '1' ");
        List<Object> args = new ArrayList<>();
        if (RxStringUtils.isNotEmpty(map.get("authRoleName"))) {
            sb.append(" AND A.NAME LIKE ? ");
            args.add("%" + map.get("authRoleName") + "%");
        }
        if (RxStringUtils.isNotEmpty(map.get("authRoleCode"))) {
            sb.append(" AND A.CODE LIKE ? ");
            args.add("%" + map.get("authRoleCode") + "%");
        }
        sb.append(" ORDER BY A.XGSJ DESC ");
        return super.cacheNextPagePaginationSql(sb, args, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public void saveAuthRole(SysAuthRole sysAuthRole) {
        super.saveOrUpdate(sysAuthRole);
    }

    @Override
    public void deleteAuthRole(Long authRoleId) {
        super.deleteCascade(authRoleId);
    }

    @Override
    public void ableAuthRole(Long authRoleId) {
        SysAuthRole sysAuthRole = this.getAuthRoleById(authRoleId);
        sysAuthRole.setSfyx_st(Sfyx_st.VALID);
        this.saveAuthRole(sysAuthRole);
    }

}
