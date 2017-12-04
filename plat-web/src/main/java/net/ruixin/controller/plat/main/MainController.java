package net.ruixin.controller.plat.main;

import net.ruixin.controller.BaseController;
import net.ruixin.util.data.AjaxReturn;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;

@Controller
@RequestMapping("/main")
public class MainController extends BaseController {
    //获取菜单
    /**
     * 获取当前用户菜单权限
     * */
    @ResponseBody
    @RequestMapping("/getUserMenus")
    public AjaxReturn getUserMenus(HttpSession session) {
        return new AjaxReturn(true, session.getAttribute("userMenus"));
    }
}
