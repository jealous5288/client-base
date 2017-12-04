package net.ruixin.service.plat.auth.impl;

import net.ruixin.dao.plat.auth.IRoleDao;
import net.ruixin.dao.plat.auth.IRuleDao;
import net.ruixin.dao.plat.organ.IUserDao;
import net.ruixin.domain.plat.auth.SysAuthRule;
import net.ruixin.domain.plat.auth.SysBaseRule;
import net.ruixin.domain.plat.auth.SysGlbRoleAuthRule;
import net.ruixin.domain.plat.auth.SysRole;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.service.plat.auth.IDataAuthGenerateService;
import net.ruixin.service.plat.auth.IGenerateStrategy;
import net.ruixin.util.hibernate.BaseDao;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


/**
 * Created by Ruixin on 2016/9/29.
 * 数据权限生成服务
 */
@Service
public class DataAuthGenerateService extends BaseDao implements IDataAuthGenerateService, ApplicationContextAware {

    private ApplicationContext applicationContext;

    @Autowired
    private IUserDao userDao;

    @Autowired
    private IRoleDao roleDao;

    @Autowired
    private IRuleDao ruleDao;

    @Override
    public void generateDataAuth(SysRole sysRole, Long userId) {
        List<SysGlbRoleAuthRule> roleAuthRules = sysRole.getSysGlbRoleAuthRuleList();
        SysAuthRule authRule;
        SysBaseRule baseRule;
        IGenerateStrategy generateStrategy = null;
        if (null != roleAuthRules)
            for (SysGlbRoleAuthRule roleAuthRule : roleAuthRules) {
                authRule = ruleDao.getAuthRuleById(roleAuthRule.getRuleId());
                baseRule = authRule.getSysBaseRule();
                switch (baseRule.getSxfs()) { //根据实现方式获取生成策略
                    case "1"://sql
                        generateStrategy = (IGenerateStrategy) applicationContext.getBean("sqlStrategy");
                        break;
                    case "2"://procedure
                        generateStrategy = (IGenerateStrategy) applicationContext.getBean("procedureStrategy");
                        break;
                    case "3"://java
                        generateStrategy = (IGenerateStrategy) applicationContext.getBean("javaStrategy");
                        break;
                    default:
                        break;
                }
                if (null != generateStrategy) {
                    String oIds;
                    if (null != baseRule.getRule_detail()) {//根据实现细节获取权限数据IDs
                        //获取对象数据ID
                        try {
                            oIds = generateStrategy.getDataIds(baseRule.getRule_detail());
                            //如果oIds为空字符串，则不生成数据权限
                            if (!"".equals(oIds)) {
                                generateDataAuth(sysRole.getId(), userId, authRule, oIds);
                            }
                        } catch (Exception e) {
                            throw new RuntimeException("根据规则实现细节获取数据权限失败");
                        }
                    } else {//对该对象的所有数据都有权限
                        generateDataAuth(sysRole.getId(), userId, authRule, null);
                    }
                }
            }
    }

    @SuppressWarnings("WhileLoopReplaceableByForEach")
    @Override
    public void generateDataAuth(SysUser sysUser) {
        List<Map<String, Object>> roleList = userDao.getUserGlxx(sysUser.getId());
        Iterator<Map<String, Object>> iterator = roleList.iterator();
        while (iterator.hasNext()) {
            Long roleId = Long.parseLong(iterator.next().get("ID").toString());
            SysRole sysRole = roleDao.getRoleById(roleId);
            generateDataAuth(sysRole, sysUser.getId());
        }
    }

    /**
     * 调用存储过程生成用户数据权限
     *
     * @param roleId   角色ID
     * @param userId   用户ID，为空时生成角色关联用户数据权限，非空时，生成指定用户关联数据权限
     * @param authRule 业务规则
     * @param oIds     对象数据IDs
     */
    private void generateDataAuth(Long roleId, Long userId, SysAuthRule authRule, String oIds) {
        List<Object> param = new ArrayList<>();
        param.add(roleId);//角色ID
        param.add(userId);//用户ID
        param.add(authRule.getId());//业务规则ID
        param.add(authRule.getObjectId());//对象ID
        param.add(oIds);//数据IDs
        //存储过程
        param.add(authRule.getPageIds());//页面IDS
        param.add(authRule.getQxlx());//权限类型
        super.prepareCallNoReturn("{call PKG_PLATFORM.USP_SYS_DATA_AUTH(?,?,?,?,?,?,?,?)}", param.toArray());
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
    }
}
