package net.ruixin.util.resolver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.View;
import org.springframework.web.servlet.view.AbstractCachingViewResolver;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Locale;

public class RxViewResolver extends AbstractCachingViewResolver implements Ordered {

    private Logger logger = LoggerFactory.getLogger(RxViewResolver.class);

    private int order = Integer.MIN_VALUE;

    private String location;

    public void setOrder(int order) {
        this.order = order;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getOrder() {
        return order;
    }

    @Override
    protected View loadView(String viewName, Locale locale) throws Exception {
        if (location == null) {
            throw new Exception("No location specified for RxViewResolver.");
        }
        String requestedFilePath = location + viewName + ".html";
        Resource resource;
        try {
            resource = getApplicationContext().getResource(requestedFilePath);
        } catch (Exception e) {
            logger.error(" load resource error:{}", requestedFilePath);
            return null;
        }
        if (resource.exists()) {
            RxView view = this.getApplicationContext().getBean(RxView.class);
            view.setUrl(requestedFilePath);
            view.setResponseContent(inputStreamTOString(resource.getInputStream(), "utf-8"));
            return view;
        }
        return null;
    }

    private final static int BUFFER_SIZE = 4096;

    private static String inputStreamTOString(InputStream in, String encoding)
            throws Exception {
        ByteArrayOutputStream outStream;
        try {
            outStream = new ByteArrayOutputStream();
            byte[] data = new byte[BUFFER_SIZE];
            int count;
            while ((count = in.read(data, 0, BUFFER_SIZE)) != -1)
                outStream.write(data, 0, count);
        } finally {
            in.close();
        }
        return new String(outStream.toByteArray(), encoding);
    }
}
