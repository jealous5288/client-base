package net.ruixin.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/global")
public class GlobalController {

    @RequestMapping(path = "/unauthorized")
    public String unauthorized() {
        return "401";
    }

    @RequestMapping(path = "/notFound")
    public String notFound() {
        return "404";
    }

    @RequestMapping(path = "/error")
    public String errorPage() {
        return "500";
    }

    @RequestMapping(path = "/sessionError")
    public String errorPageInfo(Model model) {
        model.addAttribute("tips", "session超时");
        return "login";
    }
}
