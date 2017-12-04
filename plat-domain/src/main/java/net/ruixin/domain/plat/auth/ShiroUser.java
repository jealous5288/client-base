package net.ruixin.domain.plat.auth;

import java.io.Serializable;
import java.util.List;

/**
 * 自定义Authentication对象，使得Subject除了携带用户的登录名外还可以携带更多信息
 */
public class ShiroUser implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;          // 主键ID
    private String account;      // 账号
    private String name;         // 姓名
    private Long deptId;      // 部门id
    private String deptName;        // 部门名称
    private String sfwhgxcd;      //是否个性维护菜单
    private List<Long> roleList; // 角色集
    private List<String> roleNames; // 角色名称集

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getDeptId() {
        return deptId;
    }

    public void setDeptId(Long deptId) {
        this.deptId = deptId;
    }

    public List<Long> getRoleList() {
        return roleList;
    }

    public void setRoleList(List<Long> roleList) {
        this.roleList = roleList;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public List<String> getRoleNames() {
        return roleNames;
    }

    public void setRoleNames(List<String> roleNames) {
        this.roleNames = roleNames;
    }

    public String getSfwhgxcd() {
        return sfwhgxcd;
    }

    public void setSfwhgxcd(String sfwhgxcd) {
        this.sfwhgxcd = sfwhgxcd;
    }
}
