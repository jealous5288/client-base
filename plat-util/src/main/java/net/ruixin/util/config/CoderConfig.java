package net.ruixin.util.config;

import org.springframework.core.env.PropertySource;
import org.springframework.core.io.support.ResourcePropertySource;

import java.io.IOException;

/**
 * Created by admin on 2016-8-23.
 * 项目全局配置
 */
public class CoderConfig {
    private static class LocalConfigHold {
        private static final PropertySource propertySource;

        static {
            try {
                propertySource = new ResourcePropertySource("resource", "classpath:coder.properties");
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("读取系统配置文件出错");
            }
        }
    }

    private CoderConfig() {
    }

    public static PropertySource getInstance() {
        return LocalConfigHold.propertySource;
    }
}
