package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.IWorkflowDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-10.
 * 工作流dao实现
 */
@SuppressWarnings({"SqlDialectInspection", "unused", "SqlNoDataSourceInspection"})
@Repository
public class WorkflowDao extends BaseDao<SysWorkflow> implements IWorkflowDao {
    @Override
    public Integer getVersion(Long workflow_id) {
        String sql = "select max(t.VERSION)+1 from SYS_WORKFLOW t where t.WORKFLOW_ID=?";
        return super.getJdbcTemplate().queryForObject(sql, Integer.class, workflow_id);
    }

    @Override
    public void save(SysWorkflow workflow) {
        super.saveOrUpdate(workflow);
    }

    @Override
    public SysWorkflow get(Long id) {
        return super.get(id);
    }

    @Override
    public List<SysWorkflow> findByType(Long workfolwTypeId) {
        return super.findListByHql("from SysWorkflow t where t.type.id = ? and t.sfyx_st = '1'", workfolwTypeId);
    }

    @Override
    public SysWorkflow findByCode(String flowCode) {
        List<SysWorkflow> list = super.findListByHql("from SysWorkflow t where t.code = ? and t.sfyx_st = '1'", flowCode);
        return list.size() > 0 ? list.get(0) : null;
    }

    @Override
    public List<SysWorkflow> findAll() {
        return super.findListByHql("from SysWorkflow");
    }

    @Override
    public boolean del(Long id) {
        super.delete(id);
        return true;
    }

    @Override
    public Integer hasChildrenWorkflow(Long workflowTypeId) {
        String sql = "select count(1) from SYS_WORKFLOW t where t.sfyx_st = '1' and t.TYPE_ID = ?";
        return super.getJdbcTemplate().queryForObject(sql, Integer.class, workflowTypeId);
    }

    @Override
    public String getWName(String workflow_ids) {
        return super.getJdbcTemplate().queryForObject("   SELECT  WM_CONCAT(TT.NAME)   FROM   SYS_WORKFLOW TT   WHERE  TT.ID IN(  SELECT  COLUMN_VALUE    FROM  TABLE(SPLITSTR(?,  ',') ))AND TT.SFYX_ST='1'", String.class, workflow_ids);
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
}
