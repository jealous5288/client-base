package net.ruixin.service.plat.auth;

/**
 * Created by Ruixin on 2016/9/29.
 */
public interface IGenerateStrategy {
    String getDataIds(String ruleDetail) throws Exception;
}
