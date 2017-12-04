package net.ruixin.util.resolver;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.ruixin.domain.plat.BaseDomain;
import net.ruixin.util.json.JacksonMapper;
import net.ruixin.util.json.JacksonUtil;
import org.springframework.beans.BeanUtils;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import java.util.HashMap;

public class MethodArgumentsJsonResolver implements HandlerMethodArgumentResolver {
    @Override
    public boolean supportsParameter(MethodParameter methodParameter) {
        return methodParameter.hasParameterAnnotation(FormModel.class) || methodParameter.hasParameterAnnotation(JsonModel.class);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        Object o = BeanUtils.instantiate(parameter.getParameterType());
        FormModel formModel = parameter.getParameterAnnotation(FormModel.class);
        String param;
        if (null == formModel) {
            o = new HashMap();
            JsonModel jsonModel = parameter.getParameterAnnotation(JsonModel.class);
            param = jsonModel.value();
        } else {
            param = formModel.value();
        }
        if ("".equals(param)) {
            param = parameter.getParameterName();
        }
        ObjectMapper mapper = JacksonMapper.getInstance();
        mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        String jsonStr = webRequest.getParameter(param);
        Object domain = mapper.readValue(jsonStr, o.getClass());
        if (domain != null && !(o instanceof HashMap))
            ((BaseDomain) domain).setInteractionFields(JacksonUtil.getJsonNode(jsonStr));
        return domain;
    }
}
