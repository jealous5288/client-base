package net.ruixin.dao.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysTaskDao;
import net.ruixin.domain.plat.workflow.instance.SysTask;
import net.ruixin.domain.plat.workflow.structure.node.SysActivityNode;
import net.ruixin.domain.plat.workflow.structure.node.SysNode;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * 流程任务类操作接口实现
 * Created by Jealous on 2016-8-23.
 */
@SuppressWarnings("unused")
@Repository
public class SysTaskDao extends BaseDao<SysTask> implements ISysTaskDao {

    @Override
    public SysTask get(Long id) {
        return super.get(id);
    }

    @Override
    public SysTask getTaskByWorkflowInstanceAndUser(Long wId, Long userId) {
        return super.getByHql("from SysTask t where t.workflow_instance_id.id=? and t.user_id.id=?", wId, userId);
    }

    @Override
    public List<SysTask> findTasksByWorkflowInstance(Long id) {
        return super.findListByHql("from SysTask t where t.workflow_instance_id.id=? order by t.id desc", id);
    }

    @Override
    public List<SysTask> findTasksByNodeInstanceId(Long id) {
        return super.findListByHql("from SysTask t where t.node_instance_id.id=? order by t.id desc", id);
    }

    @Override
    public List taskPage(Long wfiId, Long nodeId) {
        String sql = "SELECT T.ID,\n" +
                "       TO_CHAR(T.CJSJ, 'YYYY-MM-DD HH24:MI:SS') AS ALLOT_DATE,\n" +
                "       TO_CHAR(T.ACCEPT_DATE, 'YYYY-MM-DD HH24:MI:SS') AS ACCEPT_DATE,\n" +
                "       TO_CHAR(T.FINISH_DATE, 'YYYY-MM-DD HH24:MI:SS') AS FINISH_DATE,\n" +
                "       CASE\n" +
                "         WHEN T.STATUS = 0 THEN\n" +
                "          '待办'\n" +
                "         WHEN T.STATUS = 1 THEN\n" +
                "          '在办'\n" +
                "         WHEN T.STATUS = 2 THEN\n" +
                "          '已办'\n" +
                "         WHEN T.STATUS = 3 THEN\n" +
                "          '抢占终止'\n" +
                "         WHEN T.STATUS = 4 THEN\n" +
                "          '会签终止'\n" +
                "         WHEN T.STATUS = 5 THEN\n" +
                "          '传阅终止'\n" +
                "         WHEN T.STATUS = 6 THEN\n" +
                "          '异步终止'\n" +
                "         WHEN T.STATUS = 7 THEN\n" +
                "          '被撤回'\n" +
                "         WHEN T.STATUS = 8 THEN\n" +
                "          '被退回'\n" +
                "       END AS STATUS,\n" +
                "       CASE\n" +
                "         WHEN T.ACTION = 1 THEN\n" +
                "          '无动作'\n" +
                "         WHEN T.ACTION = 2 THEN\n" +
                "          '签收'\n" +
                "         WHEN T.ACTION = 3 THEN\n" +
                "          '提交'\n" +
                "         WHEN T.ACTION = 4 THEN\n" +
                "          '退回'\n" +
                "         WHEN T.ACTION = 5 THEN\n" +
                "          '撤回'\n" +
                "         WHEN T.ACTION = 6 THEN\n" +
                "          '转办'\n" +
                "       END AS ACTION,\n" +
                "       CASE\n" +
                "         WHEN US.ID IS NULL THEN\n" +
                "          '无法找到办理人！'\n" +
                "         ELSE\n" +
                "          TO_CHAR(US.USER_NAME)\n" +
                "       END AS HANDLER\n  " +
                "    FROM SYS_TASK_INSTANCE T, SYS_NODE_INSTANCE N, SYS_USER US\n" +
                "    WHERE US.SFYX_ST = '1'\n" +
                "    AND N.SFYX_ST = '1'\n" +
                "    AND T.SFYX_ST = '1'\n" +
                "    AND US.ID = T.USER_ID\n" +
                "    AND T.NODE_INSTANCE_ID = N.ID\n" +
                "    AND N.NODE_ID = ? " +
                "    AND T.WORKFLOW_INSTANCE_ID = ?\n" +
                "    ORDER BY T.ID DESC";
        return super.getJdbcTemplate().queryForList(sql, nodeId, wfiId);
    }

    @Override
    public List getNodePageOpinion(Long wiId, Long spId) {
        String sql = "select n.id,\n" +
                "       np.id npId,\n" +
                "       np.spx_name spxName,\n" +
                "       nvl(tpi.task_page_opinion, '') opinion\n" +
                "  from sys_workflow_instance wi\n" +
                " inner join sys_node n\n" +
                "    on wi.workflow_id = n.workflow_id\n" +
                "   and n.sfyx_st = '1'\n" +
                "   and n.id in (select node_id from sys_node_instance where workflow_instance_id=? and sfyx_st='1')\n" +
                " inner join sys_node_page np\n" +
                "    on n.id = np.node_id\n" +
                "   and np.control = '1'\n" +
                "   and np.spx_name is not null\n" +
                "   and np.spx_name <> 'null'\n" +
                "   and np.sfyx_st = '1'\n" +
                "   and np.page_id =?\n" +
                "  left join (select *\n" +
                "               from (select rank() over(partition by node_page_id order by tpi.id desc) rn,\n" +
                "                            node_page_id,\n" +
                "                            TASK_PAGE_OPINION\n" +
                "                       from sys_task_wf_page_instance tpi,\n" +
                "                            sys_task_instance         task\n" +
                "                      where tpi.sfyx_st = '1'\n" +
                "                        and task.sfyx_st = '1'\n" +
                "                        and task.id = tpi.task_Instance_id\n" +
                "                        and task.workflow_instance_id = ?\n" +
                "                        and tpi.TASK_PAGE_OPINION is not null\n" +
                "                        and tpi.if_opinion_show = '1') \n" +
                "              where rn = 1) tpi\n" +
                "    on tpi.node_page_id = np.id\n" +
                " where wi.sfyx_st = '1'\n" +
                "   and wi.id = ?\n" +
                " order by np.spx_sort asc\n";
        return super.getJdbcTemplate().queryForList(sql, wiId, spId, wiId, wiId);
    }

    @Override
    public List getPageOpinionWithCode(Long wiId) {
        String sql = "select n.id,\n" +
                "       np.id npId,\n" +
                "       tpi.page_code,\n" +
                "       np.spx_name spxName,\n" +
                "       nvl(tpi.task_page_opinion, '') opinion\n" +
                "  from sys_workflow_instance wi\n" +
                " inner join sys_node n\n" +
                "    on wi.workflow_id = n.workflow_id\n" +
                "   and n.sfyx_st = '1'\n" +
                " inner join sys_node_page np\n" +
                "    on n.id = np.node_id\n" +
                "   and np.control = '1'\n" +
                "   and np.spx_name is not null\n" +
                "   and np.spx_name <> 'null'\n" +
                "   and np.spx_print = '1'\n" +
                "   and np.sfyx_st = '1'\n" +
                "  left join (select *\n" +
                "               from (select rank() over(partition by node_page_id order by tpi.id desc) rn,\n" +
                "                            node_page_id,\n" +
                "                            TASK_PAGE_OPINION,\n" +
                "                            sp.code AS page_code\n" +
                "                       from sys_task_wf_page_instance tpi,\n" +
                "                            sys_task_instance         task,\n" +
                "                            sys_page                   sp\n" +
                "                      where tpi.sfyx_st = '1'\n" +
                "                        and task.sfyx_st = '1'\n" +
                "                        and sp.sfyx_st = '1'\n" +
                "                        and task.id = tpi.task_Instance_id\n" +
                "                        and sp.id = tpi.page_id\n" +
                "                        and task.workflow_instance_id = ?\n" +
                "                        and tpi.TASK_PAGE_OPINION is not null \n" +
                "                        and tpi.if_opinion_show = '1')\n" +
                "              where rn = 1) tpi\n" +
                "    on tpi.node_page_id = np.id\n" +
                " where wi.sfyx_st = '1'\n" +
                "   and wi.id = ?\n" +
                " order by np.spx_sort asc \n";
        return super.getJdbcTemplate().queryForList(sql, wiId, wiId);
    }

    public void saveTmpAutoOpinion(String autoOpinion) {
        String[] temp = autoOpinion.split("##");
        for (int i = 0; i < temp.length; i = i + 2) {
            String sql = "INSERT INTO temp_TASK_PAGE_BLYJ VALUES (" + temp[i] + ", ?)";
            super.executeSqlUpdate(sql, temp[i + 1]);
        }
    }

    @Override
    public List<Map<String, Object>> getSheetByNodeId(Long nodeId) {
        String sql = "SELECT NVL(NP.TITLE, P.NAME) \"name\", P.URL \"url\", " +
                "       NP.CONTROL \"sheetMode\", NP.SORT \"sId\", NP.ID \"npId\" " +
                "  FROM SYS_NODE_PAGE NP, SYS_PAGE P\n" +
                " WHERE NP.PAGE_ID = P.ID\n" +
                "   AND NP.NODE_ID = ?\n" +
                "   AND NP.SFYX_ST = '1'\n" +
                "   AND P.SFYX_ST = '1'";
        return jdbcTemplate.queryForList(sql, nodeId);
    }

    @Override
    public SysNode getFirstActivityNode(String flowCode) {
        String sql = "SELECT R.END_NODE_ID\n" +
                "  FROM SYS_WORKFLOW W, SYS_NODE N, SYS_ROUTER R\n" +
                " WHERE W.CODE = ?\n" +
                "   AND W.ID = N.WORKFLOW_ID\n" +
                "   AND N.TYPE = '0'\n" +
                "   AND N.ID = R.START_NODE_ID\n" +
                "   AND W.SFYX_ST = '1'\n" +
                "   AND N.SFYX_ST = '1'\n" +
                "   AND R.SFYX_ST = '1'";
        List<Map<String, Object>> nodeIds = jdbcTemplate.queryForList(sql, flowCode);
        if (nodeIds != null && nodeIds.size() > 0) {
            return (SysActivityNode) getSession().get(SysActivityNode.class, nodeIds.get(0).get("END_NODE_ID").toString());
        }
        return null;
    }

}
