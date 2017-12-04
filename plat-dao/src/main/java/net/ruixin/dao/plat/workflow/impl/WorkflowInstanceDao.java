package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.IWorkflowInstanceDao;
import net.ruixin.domain.plat.workflow.instance.SysWorkflowInstance;
import net.ruixin.enumerate.plat.JbWfData;
import net.ruixin.util.hibernate.BaseDao;
import net.ruixin.util.tools.RxStringUtils;
import oracle.jdbc.OracleTypes;
import org.springframework.stereotype.Repository;

import java.util.*;

/**
 * Created by Jealous on 2016-8-16.
 * 流程实例类DAO接口实现
 */
@SuppressWarnings({"unused", "SqlDialectInspection", "SqlNoDataSourceInspection"})
@Repository
public class WorkflowInstanceDao extends BaseDao<SysWorkflowInstance> implements IWorkflowInstanceDao {
    @Override
    public String signForTask(Long id) {
        return super.prepareCallAndReturn("{call PKG_TASK.USP_TASK_SIGN(?,?,?)}", id);
    }

    @Override
    public String transact(List param) {
        return super.prepareCallAndReturn("{call PKG_TASK.USP_TASK_SUBMIT(?,?,?,?,?,?,?,?)}", param.toArray());
    }

    @Override
    public String startup(List<Object> param) {
        return super.prepareCallAndReturn("{call PKG_WF.USP_WORKFLOW_START(?,?,?,?,?,?,?,?)}", param.toArray());
    }

    @Override
    public String returned(List<Object> param) {
        return super.prepareCallAndReturn("{call PKG_TASK.USP_TASK_BACK(?,?,?,?,?)}", param.toArray());
    }

    @Override
    public String withdraw(Long id) {
        return super.prepareCallAndReturn("{call PKG_TASK.USP_TASK_RECOVER(?,?,?)}", id);
    }

    @Override
    public String delWorkflowInstance(Long wiId) {
        return super.prepareCallAndReturn("{call PKG_WF.USP_WORKFLOW_DELETE(?,?,?)}", wiId);
    }

    @Override
    public int getNodeSheetcount(Long wid) {
        return super.getJdbcTemplate().queryForObject("SELECT COUNT(1) AS NUM FROM SYS_NODE_PAGE_INSTANCE P, " +
                "SYS_NODE_INSTANCE N WHERE P.NODE_INSTANCE_ID = N.ID AND P.DATA_ID IS NOT NULL " +
                "AND N.WORKFLOW_INSTANCE_ID = ?", Integer.class, wid);
    }

    @Override
    public Long getNewestTaskId(Long wId, Long dataId, Long userid) {
        StringBuilder sb = new StringBuilder("SELECT MAX(STI.ID) AS SID\n" +
                "  FROM SYS_WORKFLOW SW, SYS_WORKFLOW_INSTANCE SWI, SYS_TASK_INSTANCE STI" +
                " WHERE SW.ID = SWI.WORKFLOW_ID" +
                "   AND SWI.ID = STI.WORKFLOW_INSTANCE_ID" +
                "   AND SWI.DATA_ID = ?" +
                "   AND SW.WORKFLOW_ID = ?");
        List<Long> para = new LinkedList<>();
        para.add(dataId);
        para.add(wId);
        if (userid != null) {
            sb.append(" AND STI.USER_ID = ?");
            para.add(userid);
        }
        Map<String, Object> map = super.getJdbcTemplate().queryForMap(sb.toString(), para.toArray());
        if (RxStringUtils.isNotEmpty(map.get("SID")))
            return Long.valueOf(map.get("SID").toString());
        return null;
    }

    @Override
    public Long getNewestTaskIdByWiId(Long wiId, Long userid) {
        StringBuilder sb = new StringBuilder("SELECT TASK.ID　FROM \n" +
                "(\n" +
                "SELECT TI.ID FROM  SYS_WORKFLOW_INSTANCE WI,SYS_TASK_INSTANCE TI\n" +
                "WHERE TI.WORKFLOW_INSTANCE_ID=WI.ID\n" +
                "AND WI.SFYX_ST='1' AND TI.SFYX_ST='1'\n" +
                "AND WI.ID=?\n");
        List<Long> para = new LinkedList<>();
        para.add(wiId);
        if (userid != null) {
            sb.append(" AND TI.USER_ID= ? ");
            para.add(userid);
        }
        sb.append(" ORDER BY TI.ID DESC) TASK WHERE ROWNUM=1 ");
        List<Map<String, Object>> result = super.getJdbcTemplate().queryForList(sb.toString(), para.toArray());
        if (result.size() > 0 && RxStringUtils.isNotEmpty(result.get(0).get("ID")))
            return Long.valueOf(result.get(0).get("ID").toString());
        return null;
    }

    @Override
    public List getBlrList(Long rwid, Boolean agree, String decision) {
        List<Object> param = new ArrayList<>();
        param.add(rwid);
        param.add(decision);
        param.add(agree ? "1" : "0"); //1:提交、同意   0:退回、不同意
        List<Integer> data = new ArrayList<>();
        data.add(OracleTypes.CURSOR);
        data.add(OracleTypes.VARCHAR);
        return super.prepareCallAndReturnCustom("{call PKG_WF.USP_WF_NEXT_NODE_USER_ORG(?,?,?,?,?,?)}", param, data);
    }

    @Override
    public void updateWorkflowInstanceData(Long dataId, Long wiId, String title) {
        super.executeHqlUpdate("update SysWorkflowInstance set data_id = ? , title = ? where id = ?", dataId, title, wiId);
    }


    /**
     * 获取特送退回的环节树
     *
     * @param taskId 任务ID
     */
    @Override
    public List<Map<String, Object>> getSpecialBackTree(Long taskId) {
        Object[] params = new Object[2];
        String sql = "SELECT *\n" +
                "  FROM SYS_NODE\n" +
                " where WORKFLOW_ID = (SELECT B.WORKFLOW_ID\n" +
                "                        FROM SYS_TASK_INSTANCE A, SYS_WORKFLOW_INSTANCE B\n" +
                "                       WHERE A.WORKFLOW_INSTANCE_ID = B.ID\n" +
                "                         AND A.ID = ?)\n" +
                "   AND ID IN\n" +
                "       (SELECT R.START_NODE_ID\n" +
                "          FROM SYS_ROUTER R\n" +
                "         START WITH R.END_NODE_ID =\n" +
                "                    (SELECT B.NODE_ID\n" +
                "                       FROM SYS_TASK_INSTANCE A, SYS_NODE_INSTANCE B\n" +
                "                      WHERE A.NODE_INSTANCE_ID = B.ID\n" +
                "                        AND A.ID = ?)\n" +
                "        CONNECT BY NOCYCLE PRIOR R.START_NODE_ID = R.END_NODE_ID)\n" +
                "   AND ID IN\n" +
                "       (SELECT R.END_NODE_ID\n" +
                "          FROM SYS_ROUTER R\n" +
                "         START WITH R.START_NODE_ID = ?\n" +
                "        CONNECT BY NOCYCLE PRIOR R.END_NODE_ID = R.START_NODE_ID)\n" +
                "   AND ID IN (SELECT NODE_ID\n" +
                "                FROM SYS_NODE_INSTANCE\n" +
                "               WHERE STATUS = '2'\n" +
                "                 AND WORKFLOW_INSTANCE_ID =\n" +
                "                     (SELECT WORKFLOW_INSTANCE_ID\n" +
                "                        FROM SYS_TASK_INSTANCE\n" +
                "                       WHERE ID = ?))\n";
        params[0] = taskId;
        params[1] = taskId;
        return super.getJdbcTemplate().queryForList(sql, params);
    }

    @Override
    public SysWorkflowInstance get(Long id) {
        return super.get(id);
    }

    @Override
    public String batchProcess(Long userId, String wfiIds, String opinion, String handleTag) {
        return super.prepareCallAndReturn("{call PKG_WF.USP_WORKFLOW_BATCH_HANDLE(?,?,?,?,?,?)}", wfiIds, userId, opinion, handleTag);
    }

    @Override
    public void updateWfiBd(JbWfData em, Object value, Long wiId) {
        List<Object> param = new ArrayList<>();
        StringBuilder sb = new StringBuilder("update SYS_WORKFLOW_INSTANCE t set t.");
        sb.append(em.code).append("= ? ");
        param.add(value);
        switch (em) {
            case SFGD:
                sb.append(" ,t.GDSJ = ? ");
                break;
            case SFDY:
                sb.append(" ,t.DYSJ = ? ");
                break;
            default:
                break;
        }
        if (em != JbWfData.JE)
            param.add(new Date());
        sb.append("where t.id = ?");
        param.add(wiId);
        super.executeSqlUpdate(sb.toString(), param.toArray());
    }

    public void insertWorkflowAdditionUsers(Long wiId, Long nId, String ids) {
        String sql = "insert into sys_wf_auto_handle_user(WORKFLOW_INSTANCE_ID,NODE_ID,USER_ID)\n" +
                "select ?,?,x\n" +
                "from (select column_value x from table( splitstr('" + ids + "',',')))\n";
        super.getJdbcTemplate().update(sql, wiId, nId);
    }

    @Override
    public SysWorkflowInstance getById(Long id) {
        return super.get(id);
    }

    @Override
    public String hasDynamicUser(String flowCode, Long dataId) {
        return super.prepareCallAndReturn("{call PKG_WF_DAMIC_USER.USP_WORKFLOW_DAMIC_USER_YZ(?,?,?,?)}", flowCode, dataId);
    }

    @Override
    public void updateWordpath(String path, Long pageId, Long winId) {
        String sql = "UPDATE SYS_NODE_PAGE_INSTANCE NPI SET NPI.PATH=? WHERE NPI.NODE_INSTANCE_ID IN " +
                "(SELECT NI.ID FROM SYS_NODE_INSTANCE NI WHERE NI.WORKFLOW_INSTANCE_ID=?) " +
                "AND NPI.PAGE_ID=? ";
        super.executeSqlUpdate(sql, path, winId, pageId);
    }

    @Override
    public Long getDataIdByTaskId(Long id) {
        String sql = "SELECT WI.DATA_ID\n" +
                "  FROM SYS_WORKFLOW_INSTANCE WI, SYS_TASK_INSTANCE TI\n" +
                " WHERE WI.ID = TI.WORKFLOW_INSTANCE_ID\n" +
                "   AND WI.SFYX_ST = '1'\n" +
                "   AND TI.SFYX_ST = '1' " +
                "   AND TI.ID=? ";
        return Long.valueOf(super.getJdbcTemplate().queryForMap(sql, id).get("DATA_ID").toString());
    }

    @Override
    public String specialBack(Long nodeInstanceId, Long nodeId, String opinion, String fj_id) {
        Object[] objs = new Object[]{nodeInstanceId, nodeId, opinion, fj_id};
        return super.prepareCallAndReturn("{call PKG_WF.USP_WORKFLOW_SPECIAL_BACK(?,?,?,?,?,?)}", objs);
    }

    @Override
    public void updateSysGlbBizWf(Long dataId, Long wiId) {
        super.executeSqlUpdate("UPDATE SYS_GLB_BIZ_WF SET DATA_ID=? WHERE WORKFLOW_INSTANCE_ID=? AND SFYX_ST='1'", dataId, wiId);
    }
}
