package net.ruixin.util.resolver;


import net.ruixin.util.json.JacksonMapper;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class NotPageSearchResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        return methodParameter.hasParameterAnnotation(NotPageSearchModel.class);
    }

    @Override
    @SuppressWarnings({"unchecked", "Duplicates"})
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        Map map = new HashMap();
        String searchParam = webRequest.getParameter("param");
        List<Map> params = JacksonMapper.getInstance().readValue(searchParam,List.class);
        if (null != params && params.size() > 0) {
            for (Map<String, Object> param : params) {
                if (param.get("value") != null) {
                    map.put(param.get("zdName"), URLDecoder.decode(URLDecoder.decode( param.get("value").toString(), "UTF-8").trim(), "UTF-8").trim());
                } else {
                    map.put(param.get("zdName"), null);
                }
            }
        }
        return map;
    }
}
