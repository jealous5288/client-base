package config;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.xml.DOMConfigurator;
import org.springframework.context.ApplicationEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;

import java.net.URL;

public class LogInit implements ApplicationListener{
    @Override
    public void onApplicationEvent(ApplicationEvent event) {
        // 容器启动完成之后load
        if (event instanceof ContextRefreshedEvent) {
            if (((ContextRefreshedEvent) event).getApplicationContext().getParent() == null) {
                reloadLog4j();
            }
        }
    }

    public void reloadLog4j() {

        System.setProperty("log4jOutputPath","C:\\plat");

        URL url = this.getClass().getResource("log4j.xml");
        if (url == null) {
            return;
        }
        String path = url.toString();
        if (StringUtils.isNotEmpty(path)) {
            path = path.substring(path.indexOf(":") + 1, path.length());
            DOMConfigurator.configure(path);
        }
    }
}
