package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.IWorkflowTypeDao;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflow;
import net.ruixin.domain.plat.workflow.structure.frame.SysWorkflowType;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.service.plat.workflow.IWorkflowTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Jealous on 2016-8-9.
 * 工作流：流程类别服务接口实现
 */
@SuppressWarnings("unused")
@Service
@Transactional
public class WorkflowTypeService implements IWorkflowTypeService {

    @Autowired
    private IWorkflowTypeDao workflowTypeDao;

    @Override
    public List<SysWorkflowType> findWorkflowTypesByParent(Long id) {
        return workflowTypeDao.findByParent(id);
    }

    @Override
    public List<SysWorkflowType> findTopWorkflowTypes() {
        return workflowTypeDao.findTops();
    }

    @SuppressWarnings("unchecked")
    @Override
    public List parseTreeMap(List<SysWorkflowType> list, List<SysWorkflow> sysWorkflowList) {
        List jsonList = new ArrayList();
        if(list != null){
            for (SysWorkflowType workflowtype : list) {
                Map map = new HashMap();
                map.put("id", workflowtype.getId());
                map.put("name", workflowtype.getName());
                map.put("type", "workflowtype");
                map.put("isParent", true);
                if(workflowtype.getParent_id() == null){
                    map.put("pId", null);
                    map.put("open",true);
                }else{
                    map.put("pId", workflowtype.getParent_id());
                }
                jsonList.add(map);
            }
        }
        if(sysWorkflowList != null){
            for (SysWorkflow workflow : sysWorkflowList) {
                Map map = new HashMap();
                map.put("id", "f_" + workflow.getId());
                map.put("name", workflow.getName());
                map.put("type", "workflow");
                map.put("isParent", false);
                map.put("icon", "/plat/medias/images/baseModel/w.png");
                jsonList.add(map);
            }
        }
        return jsonList;
    }

    @Override
    public boolean delWorkflowType(Long id) {
        return workflowTypeDao.del(id);
    }

    @Override
    public SysWorkflowType getWorkflowType(Long id) {
        return workflowTypeDao.get(id);
    }

    @Override
    public boolean saveWorkflowType(SysWorkflowType sysWorkflowType) {
        sysWorkflowType.setSfyx_st(Sfyx_st.VALID);
        return workflowTypeDao.save(sysWorkflowType);
    }

    @Override
    public boolean hasChildren(Long id) {
        Integer wftCount = workflowTypeDao.hasChildrenWorkflowTypes(id);
        return wftCount != null && wftCount > 0;
    }
}
