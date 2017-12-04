package net.ruixin.service.plat.auth.impl;

import net.ruixin.dao.plat.auth.IModuleDao;
import net.ruixin.dao.plat.page.IPageDao;
import net.ruixin.domain.plat.auth.SysModule;
import net.ruixin.domain.plat.auth.SysPage;
import net.ruixin.service.plat.auth.IModuleService;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-8-19.
 * 系统模块服务实现
 */
@Service
public class ModuleService implements IModuleService {
    @Autowired
    private IModuleDao moduleDao;

    @Autowired
    private IPageDao pageDao;

    @Override
    public SysModule getModuleById(Long id) {
        return moduleDao.getModuleById(id);
    }

    @Override
    public FastPagination getModuleList(Map map) {
        return moduleDao.getModuleList(map);
    }

    @Override
    @Transactional
    public void saveModule(SysModule sysModule) {
        if (sysModule.getId() != null) {
            //清空关联的页面moduleId
            pageDao.clearModuleId(sysModule.getId());
        }
        moduleDao.saveModule(sysModule);
        //保存关联页面信息
        String pageIds = sysModule.getPageIds();
        if (pageIds != null && !"".equals(pageIds)) {
            Long moduleId = sysModule.getId();
            String[] idArr = pageIds.split(",");
            for (String anIdArr : idArr) {
                SysPage sysPage = pageDao.getPageById(Long.parseLong(anIdArr));
                sysPage.setModuleId(moduleId);
                pageDao.savePage(sysPage);
            }
        }

    }

    @Override
    @Transactional
    public void deleteModule(Long moduleId) {
        moduleDao.deleteModule(moduleId);
    }

    @Override
    public List<Map<String, Object>> getModuleSearch() {
        return moduleDao.getModuleSearchList();
    }

    @Override
    public String getMaxSort(String tableName, String fieldName) {
        return moduleDao.getMaxSort(tableName, fieldName);
    }

    @Override
    public AjaxReturn getNamesByModuleId(Long id) {
        AjaxReturn ar = new AjaxReturn();
//        List<Map<String, Object>> ruleNamelist = moduleDao.getRuleNameByModuleId(id);
        //修改项，目前模块不与菜单关联
//        List<Map<String, Object>> menuNamelist = moduleDao.getMenuNameByModuleId(id);
        List<Object> newList = new ArrayList<>();
        boolean flag = true; //未被其它规则、其它菜单使用
//        if (ruleNamelist.size() > 0) { //被其它规则使用
//            Map<String, Object> ruleMap = new HashMap<>();
//            ruleMap.put("data", ruleNamelist);
//            ruleMap.put("name", "规则");
//            ruleMap.put("showName", "RULE_NAME");
//            newList.add(ruleMap);
//            flag = false;
//        }
//        if (menuNamelist.size() > 0) { //被其它菜单使用
//            Map<String, Object> menuMap = new HashMap<>();
//            menuMap.put("data", menuNamelist);
//            menuMap.put("name", "菜单");
//            menuMap.put("showName", "NAME");
//            newList.add(menuMap);
//            flag = false;
//        }
        return ar.setSuccess(flag).setData(newList);
    }
}
