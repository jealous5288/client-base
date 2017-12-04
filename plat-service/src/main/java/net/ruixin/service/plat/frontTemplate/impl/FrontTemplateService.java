package net.ruixin.service.plat.frontTemplate.impl;

import net.ruixin.service.plat.frontTemplate.IFrontTemplateService;
import net.ruixin.util.tools.RxFileUtils;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by Administrator on 2016/11/18
 */
@Service
public class FrontTemplateService implements IFrontTemplateService {

    @Override
    public Map<String, Object> getTemplate(String tplPath, String basePath) {
        String[] tpls = tplPath.split(",");
        Map<String, Object> result = new HashMap<>();
        if (tpls.length > 0) {
            for(String tpl: tpls){
                result.put(tpl, RxFileUtils.readFileToString(new File(basePath+"/WEB-INF/tpl/"+tpl+".html")));
            }
        }
        return result;
    }
}
