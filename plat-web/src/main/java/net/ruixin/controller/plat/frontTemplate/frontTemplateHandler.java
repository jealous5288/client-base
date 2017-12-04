package net.ruixin.controller.plat.frontTemplate;

import net.ruixin.controller.BaseController;
import net.ruixin.service.plat.frontTemplate.IFrontTemplateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * 生成js字典缓存
 */
@Controller
@RequestMapping("/template")
public class frontTemplateHandler extends BaseController {

    @Autowired
    private IFrontTemplateService frontTemplateService;

    /**
     * 请求模板信息
     *
     * @return AjaxReturn
    **/
    @ResponseBody
    @RequestMapping("/getTemplate")
    public Map<String, Object> getTemplate(@RequestParam(value = "tplPath", required = false) String tplPath) {
        String basePath = getSession().getServletContext().getRealPath("/");
        return frontTemplateService.getTemplate(tplPath, basePath);
    }
}
