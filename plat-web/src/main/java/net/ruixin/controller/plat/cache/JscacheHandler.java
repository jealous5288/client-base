package net.ruixin.controller.plat.cache;

import net.ruixin.controller.BaseController;
import net.ruixin.service.plat.cache.IJscacheService;
import net.ruixin.util.data.AjaxReturn;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * 生成js字典缓存
 */
@Controller
@RequestMapping("/jscache")
public class JscacheHandler extends BaseController {

    @Autowired
    private IJscacheService jscacheService;

    /**
     * 请求生成字典数据
     *
     * @param forceUpdate 是否强制更新
     * @param jspath      js文件路径
     * @param dictCode    字典编码
     * @param request     request
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/jspath")
    public Map<String, Object> jsPath(@RequestParam(value = "forceUpdate", required = false) Boolean forceUpdate,
                                      @RequestParam(value = "jspath", required = false) String jspath,
                                      String dictCode,
                                      HttpServletRequest request) {
        String ljspath = "medias/cache/" + jspath + ".js";
        String rjspath = request.getSession().getServletContext().getRealPath("/") + ljspath;
        return jscacheService.jsPath(forceUpdate, ljspath, rjspath, dictCode);
    }

    /**
     * 请求生成字典数据
     *
     * @param forceUpdate 是否强制更新
     * @param mergePath   js文件路径（合并）
     * @param dictCodes   字典编码数组
     * @param request     request
     * @return AjaxReturn
     */
    @ResponseBody
    @RequestMapping("/jsMergePath")
    public AjaxReturn jsMergePath(@RequestParam(value = "forceUpdate", required = false) Boolean forceUpdate,
                                  @RequestParam(value = "mergePath", required = false) String mergePath,
                                  @RequestParam(value = "dictCodes[]", required = false) String[] dictCodes,
                                  HttpServletRequest request) {
        String ljspath = "medias/cache/" + mergePath + ".js";
        String rjspath = request.getSession().getServletContext().getRealPath("/") + ljspath;
        Map<String, Object> result = jscacheService.jsMergePath(forceUpdate, ljspath, rjspath, dictCodes);
        return new AjaxReturn(true, result);
    }

    /*
   * 重新生成所有字典项
   * */
    @ResponseBody
    @RequestMapping("/allJspath")
    public AjaxReturn allJspath(HttpServletRequest request) {
        jscacheService.allJsPath(request.getSession().getServletContext().getRealPath("/") +  "medias/cache/");
        return new AjaxReturn(true);
    }
}
