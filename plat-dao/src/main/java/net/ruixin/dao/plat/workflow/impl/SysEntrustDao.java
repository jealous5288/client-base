package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysEntrustDao;
import net.ruixin.domain.plat.workflow.instance.SysEntrust;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/12/12 0012.
 * 委办
 */

@Repository
public class SysEntrustDao extends BaseDao<SysEntrust> implements ISysEntrustDao {
    @Override
    public FastPagination getEntrustList(Map map, Long userId) {
        List<Object> params = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT ENTRUST.*,(SELECT SUSER.USER_NAME FROM SYS_USER SUSER WHERE SUSER.ID = ENTRUST.ENTRUST_USER_ID) ENTRUSTUSERNAME\n" +
                "        FROM SYS_ENTRUST ENTRUST WHERE ENTRUST.USER_ID = ? AND ENTRUST.SFYX_ST = '1' ORDER BY ENTRUST.START_DATE DESC");
        params.add(userId);
        return super.cacheNextPagePaginationSql(sql, params, (Integer) map.get("pageNo"),
                (Integer) map.get("pageSize"), (Boolean) map.get("onePage"), (Integer) map.get("oldPage"));
    }

    @Override
    public SysEntrust getEntrustById(Long id) {
        return super.get(id);
    }

    @Override
    public Integer getEntrustByryId(Long ry_id) {
        return super.getJdbcTemplate().queryForObject("select count(1) from SYS_ENTRUST where user_id=? and sfyx_st='1'\n", Integer.class, ry_id);
    }

    @Override
    public Long saveEntrust(SysEntrust sysEntrust, Integer flag) {//flag--新增删除标志，1.新增 2.删除
        super.saveOrUpdate(sysEntrust);
        super.getSession().flush();
        List<Object> params = new ArrayList<>();
        if(flag==1){
            params.add(sysEntrust.getUserId());
        }else{
            params.add(sysEntrust.getEntrustUserId());
        }
        params.add(flag);
        super.prepareCallAndReturn("{call PKG_TASK.USP_TASK_WB_UPDATE_SS(?,?,?,?)}", params.toArray());
        return sysEntrust.getId();
    }

    public List getEntrustByDate(Date date, Long userId) {
        StringBuffer sql = new StringBuffer("SELECT ENTRUST.* FROM SYS_ENTRUST ENTRUST WHERE ? BETWEEN ENTRUST.START_DATE AND ENTRUST.END_DATE AND ENTRUST.USER_ID = ? AND ENTRUST.SFYX_ST = '1' ");
        List<Object> params = new ArrayList<>();
        params.add(date);
        params.add(userId);
        return super.getJdbcTemplate().queryForList(sql.toString(), params.toArray());
    }

    /**
     * 检查委办计划信息
     *
     * @param wbjh
     */
    public Integer checkWbjh(SysEntrust wbjh) throws Exception {
        String sql = "   SELECT COUNT(1) AS NUM\n" +
                "    FROM SYS_ENTRUST\n" +
                "   WHERE USER_ID = ?\n" +
                "     AND intersection(WORKFLOW_ID, ?) = 1\n" +
                "     AND ((TO_CHAR(END_DATE, 'YYYY-MM-DD')  >= TO_CHAR(?, 'YYYY-MM-DD') AND\n" +
                "         TO_CHAR(END_DATE, 'YYYY-MM-DD')  <= TO_CHAR(?, 'YYYY-MM-DD')) OR\n" +
                "         (TO_CHAR(START_DATE, 'YYYY-MM-DD') >= TO_CHAR(?, 'YYYY-MM-DD') AND\n" +
                "         TO_CHAR(START_DATE, 'YYYY-MM-DD') <= TO_CHAR(?, 'YYYY-MM-DD')) OR\n" +
                "         (TO_CHAR(START_DATE, 'YYYY-MM-DD') <= TO_CHAR(?, 'YYYY-MM-DD') AND\n" +
                "         TO_CHAR(END_DATE, 'YYYY-MM-DD')  >= TO_CHAR(?, 'YYYY-MM-DD')))\n" +
                "     AND SFYX_ST = '1'";
        return Integer.parseInt(this.getJdbcTemplate().queryForMap(sql, wbjh.getUserId(), wbjh.getWorkFlow_Id(), wbjh.getStartDate(), wbjh.getEndDate(), wbjh.getStartDate(), wbjh.getEndDate(), wbjh.getStartDate(), wbjh.getEndDate()).get("NUM").toString());
    }

    @Override
    public void delWbjh(Long id) {
        super.delete(id);
    }
}
