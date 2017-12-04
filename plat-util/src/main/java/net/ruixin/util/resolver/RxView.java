package net.ruixin.util.resolver;

import org.springframework.web.servlet.view.AbstractUrlBasedView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Map;

public class RxView extends AbstractUrlBasedView {
    // default content type
    private final static String CONTENT_TYPE = "text/html";

    //content of http response
    private String responseContent;

    public RxView() {
        super();
        setContentType(CONTENT_TYPE);
    }

    @Override
    public void setContentType(String contentType) {
        super.setContentType(contentType);
    }

    @Override
    protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request, HttpServletResponse response) throws Exception {
        response.setContentType(getContentType());
        response.getWriter().write(this.responseContent);
        response.getWriter().close();
    }

    public void setResponseContent(String responseContent) {
        this.responseContent = responseContent;
    }
}
