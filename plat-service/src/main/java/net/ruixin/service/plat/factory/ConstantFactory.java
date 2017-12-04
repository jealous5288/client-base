package net.ruixin.service.plat.factory;

import net.ruixin.domain.plat.dictionary.SysDict;
import net.ruixin.service.plat.log.LogObjectHolder;
import net.ruixin.util.spring.SpringContextHolder;
import org.springframework.context.annotation.DependsOn;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@DependsOn("springContextHolder")
public class ConstantFactory implements IConstantFactory{

    public static IConstantFactory me() {
        return SpringContextHolder.getBean("constantFactory");
    }

    @Override
    public String getUserNameById(Long userId) {
        return null;
    }

    @Override
    public String getUserAccountById(Long userId) {
        return null;
    }

    @Override
    public String getRoleName(String roleIds) {
        return null;
    }

    @Override
    public String getSingleRoleName(Long roleId) {
        return null;
    }

    @Override
    public String getSingleRoleTip(Long roleId) {
        return null;
    }

    @Override
    public String getDeptName(Long deptId) {
        return null;
    }

    @Override
    public String getMenuNames(String menuIds) {
        return null;
    }

    @Override
    public String getMenuName(Long menuId) {
        return null;
    }

    @Override
    public String getMenuNameByCode(String code) {
        return null;
    }

    @Override
    public String getDictName(Long dictId) {
        return null;
    }

    @Override
    public String getNoticeTitle(Long dictId) {
        return null;
    }

    @Override
    public String getDictsByName(String name, Long val) {
        return null;
    }

    @Override
    public String getSexName(Long sex) {
        return null;
    }

    @Override
    public String getStatusName(Long status) {
        return null;
    }

    @Override
    public String getMenuStatusName(Long status) {
        return null;
    }

    @Override
    public List<SysDict> findInDict(Long id) {
        return null;
    }

    @Override
    public String getCacheObject(String para) {
        return LogObjectHolder.me().get().toString();
    }

    @Override
    public List<Long> getSubDeptId(Long deptid) {
        return null;
    }

    @Override
    public List<Long> getParentDeptIds(Long deptid) {
        return null;
    }
}
