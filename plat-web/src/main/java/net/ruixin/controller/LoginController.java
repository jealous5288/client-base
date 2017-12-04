package net.ruixin.controller;

import net.ruixin.service.plat.auth.IMenuService;
import net.ruixin.service.plat.log.LogManager;
import net.ruixin.service.plat.log.factory.LogTaskFactory;
import net.ruixin.service.plat.shiro.ShiroKit;
import net.ruixin.domain.plat.auth.ShiroUser;
import net.ruixin.util.constant.Const;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import static net.ruixin.util.http.HttpKit.getIp;

/**
 * 登录控制器
 */
//@Controller
public class LoginController extends BaseController {
    @Autowired
    private IMenuService menuService;

    /**
     * 跳转到主页
     */
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String index(Model model) {
        model.addAttribute("username",ShiroKit.getUser().getName());
        return "/plat/main/index";
    }

    /**
     * 跳转子页
     */
    @RequestMapping("/leftMenu")
    public String leftMenu() {
        return "/plat/main/leftMenu";
    }


    /**
     * Center
     */
    @RequestMapping("/center")
    public String center() {
        return "/plat/main/center";
    }

    /**
     * 跳转到登录页面
     */
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String login() {
        if (ShiroKit.isAuthenticated() || ShiroKit.getUser() != null) {
            return REDIRECT + "/";
        } else {
            return "login";
        }
    }

    /**
     * 点击登录执行的动作
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public String loginVali() {
        String username = super.getPara("username").trim();
        String password = super.getPara("password").trim();
//        String remember = super.getPara("remember");
        Subject currentUser = ShiroKit.getSubject();
        UsernamePasswordToken token = new UsernamePasswordToken(username, password.toCharArray());
//        if ("on".equals(remember)) {
//            token.setRememberMe(true);
//        } else {
//            token.setRememberMe(false);
//        }
        currentUser.login(token);
        ShiroUser shiroUser = ShiroKit.getUser();
        getSession().setAttribute(Const.USER_SESSION_KEY, shiroUser);
        super.getSession().setAttribute(Const.USER_LOGIN_NAME, shiroUser.getAccount());
        super.getSession().setAttribute(Const.USER_ID, shiroUser.getId());
        LogManager.me().executeLog(LogTaskFactory.loginLog(shiroUser.getId(), getIp()));
        super.getSession().setAttribute("sessionFlag", true);
        //将用户菜单信息放到session中
        getSession().setAttribute("userMenus", menuService.getUserMenus(shiroUser.getId(),shiroUser.getSfwhgxcd()));
        return REDIRECT + "/";
    }


    /**
     * 退出登录
     */
    @RequestMapping(value = "/logout", method = RequestMethod.GET)
    public String logOut() {
        LogManager.me().executeLog(LogTaskFactory.exitLog(ShiroKit.getUser().getId(), getIp()));
        ShiroKit.getSubject().logout();
        return REDIRECT + "/login";
    }
}
