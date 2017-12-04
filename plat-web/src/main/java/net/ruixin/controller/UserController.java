package net.ruixin.controller;

import com.fasterxml.jackson.databind.JsonNode;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.service.plat.common.BaseService;
import net.ruixin.service.plat.log.LogObjectHolder;
import net.ruixin.service.plat.log.aop.BussinessLog;
import net.ruixin.service.plat.shiro.ShiroKit;
import net.ruixin.util.constant.Dict;
import net.ruixin.util.constant.ParaType;
import net.ruixin.util.data.AjaxReturn;
import net.ruixin.util.json.JacksonUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("/user")
public class UserController extends BaseController{

    @Autowired
    private BaseService baseService;

    @RequestMapping("/add")//?loginName=ly&loginPwd=123&userName=liyan
    @BussinessLog(value = "新增用户",key = "userName", dict = Dict.UserDict, type = ParaType.ATTRIBUTE)
    @ResponseBody
    public AjaxReturn add(){
        SysUser user = new SysUser(getPara("loginName"), ShiroKit.md5Nosalt(getPara("loginPwd")),getPara("userName"));
        baseService.save(user);
        return SUCCESS;
    }

    @RequestMapping("/edit")//?userinfo=["userId":"1","userName":"liyan"]//?userId=1&userName=liyan2
//    @BussinessLog(value = "修改用户", key = "userId", dict = Dict.UserDict, type = ParaType.ATTRIBUTE)
    @BussinessLog(value = "修改用户", key = "userinfo", dict = Dict.UserDict)
    @ResponseBody
    public AjaxReturn edit(){
        //type attibute
//        SysUser user = baseService.get(SysUser.class,Long.parseLong(getPara("userId")));
//        LogObjectHolder.me().set(ObjectFactory.create(user));
//        user.setUserName(getPara("userName"));
        //type Json
        String para = getPara("userinfo");
        JsonNode jn = JacksonUtil.getJsonNode(para.replaceAll("\\[","{").replaceAll("\\]","}"));
        //JSON解析
        SysUser user = baseService.get(SysUser.class,jn.get("userId").asLong());
        LogObjectHolder.me().set(user);
        user.setUserName(jn.get("userName").asText());
        baseService.saveHibernate(user);
        return SUCCESS;
    }
}
