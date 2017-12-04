package net.ruixin.util.resolver;

import org.springframework.core.Ordered;
import org.springframework.util.StringUtils;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.view.AbstractCachingViewResolver;

import java.util.Locale;
import java.util.Map;

public class RxMultiVewResolver extends AbstractCachingViewResolver implements Ordered {

    private int order = Integer.MIN_VALUE;

    public void setOrder(int order) {
        this.order = order;
    }

    @Override
    public int getOrder() {
        return this.order;
    }

    private Map<String, ViewResolver> resolvers;

    public void setResolvers(Map<String, ViewResolver> resolvers) {
        this.resolvers = resolvers;
    }

    @Override
    protected View loadView(String viewName, Locale locale) throws Exception {
        String fileExtension = StringUtils.getFilenameExtension(viewName);
        if (fileExtension == null) {
            return null;
        }
        ViewResolver resolver = resolvers.get(fileExtension);
        return resolver == null ? null : resolver.resolveViewName(viewName,
                locale);
    }
}
