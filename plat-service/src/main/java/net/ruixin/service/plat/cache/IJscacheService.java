package net.ruixin.service.plat.cache;

import java.util.Map;

/**
 * Created by Administrator on 2016/11/18
 */
public interface IJscacheService {

    /**
     * 请求生成字典数据
     *
     * @param forceUpdate 是否强制更新
     * @param ljspath     js文件相对路径
     * @param rjspath     js文件完整路径
     * @param dictCode    字典编码
     * @return map
     */
    Map<String, Object> jsPath(Boolean forceUpdate, String ljspath, String rjspath, String dictCode);

    /**
     * 请求生成字典数据
     *
     * @param forceUpdate 是否强制更新
     * @param ljspath     js文件相对路径
     * @param rjspath     js文件完整路径
     * @param dictCodes   字典编码数组
     * @return map
     */
    Map<String, Object> jsMergePath(Boolean forceUpdate, String ljspath, String rjspath, String[] dictCodes);

    /*
   * 重新生成所有字典项
   * */
    void allJsPath(String rootPath);
}
