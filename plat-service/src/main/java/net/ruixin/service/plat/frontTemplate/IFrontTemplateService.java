package net.ruixin.service.plat.frontTemplate;

import java.util.Map;

/**
 * Created by Administrator on 2016/11/18
 */
public interface IFrontTemplateService {

    /**
     * 请求生成字典数据
     *
     * @return map
     */
    Map<String, Object> getTemplate(String tplPath, String basePath);
}
