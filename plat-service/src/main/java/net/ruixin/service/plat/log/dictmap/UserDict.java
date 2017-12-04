package net.ruixin.service.plat.log.dictmap;

import net.ruixin.service.plat.log.dictmap.base.AbstractDictMap;

public class UserDict extends AbstractDictMap {
    @Override
    public void init() {
        put("userId","用户ID");
        put("loginName","登录名");
        put("userName","用户名");
        put("default_organ_id","默认组织id");
        put("dftOrganName","默认组织名称");
        put("dftOrganCode","默认组织代码");

        put("userinfo","用户信息");
    }

    @Override
    protected void initBeWrapped() {

    }
}
