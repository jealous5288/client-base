package config;

import org.springframework.web.util.Log4jWebConfigurer;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class Log4jListener implements ServletContextListener {
    @Override
    public void contextInitialized(ServletContextEvent event) {
        String log4jOutputPath = (String) event.getServletContext().getInitParameter("log4jOutputPath");
        String webAppRootKey = (String) event.getServletContext().getInitParameter("webAppRootKey");
        System.setProperty("log4jOutputPath", log4jOutputPath +"\\"+ webAppRootKey);
        Log4jWebConfigurer.initLogging(event.getServletContext());
    }

    @Override
    public void contextDestroyed(ServletContextEvent event) {
        Log4jWebConfigurer.shutdownLogging(event.getServletContext());
    }
}
