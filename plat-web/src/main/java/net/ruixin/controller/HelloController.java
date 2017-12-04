package net.ruixin.controller;

import net.ruixin.service.plat.shiro.ShiroKit;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HelloController {
    @RequestMapping("/hello")
    public String hello(Model model) {
        if(ShiroKit.isAuthenticated()){
            model.addAttribute("flag","1");
        }
        return "hello";
    }
}
