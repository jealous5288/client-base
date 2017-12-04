package net.ruixin.service.plat.dictionary;


import net.ruixin.dao.plat.dictionary.IDictDao;
import net.ruixin.domain.plat.dictionary.SysDict;
import net.ruixin.util.http.HttpSessionHolder;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxFileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.List;
import java.util.Map;


/**
 * 字典服务层
 */
@Service
public class DictService implements IDictService {

    @Autowired
    private IDictDao dictDao;

    @Override
    @Transactional
    public void saveDict(SysDict sysDict) {
        dictDao.saveDict(sysDict);
        //生成前端缓存
        cacheInFront(sysDict);
        //todo 更新ehcache中字典缓存

    }

    private void cacheInFront(SysDict sysDict) {
        File f = new File(HttpSessionHolder.getContextPath() + "medias/cache/" + sysDict.getDictCode() + ".js");
        RxFileUtils.createFile(f, sysDict);
    }

    @Override
    public FastPagination getDictList(Map map) {
        return dictDao.getDictList(map);
    }

    @Override
    public SysDict getDictById(Long id) {
        return dictDao.getDictById(id);
    }

    @Override
    @Transactional
    public void deleteDict(Long dictId) {
        dictDao.deleteDict(dictId);
        //删除前端缓存
        delCacheInFront(dictId);
        //todo 更新ehcache中字典缓存

    }

    private void delCacheInFront(Long dictId) {
        SysDict dict = getDictById(dictId);
        RxFileUtils.deleteFile(HttpSessionHolder.getContextPath() + "medias/cache/" + dict.getDictCode() + ".js");
    }

    @Override
    public List<Map<String, Object>> getSubDictsByCode(String dictcode) {
        return dictDao.getSubDictsByCode(dictcode);
    }
}
