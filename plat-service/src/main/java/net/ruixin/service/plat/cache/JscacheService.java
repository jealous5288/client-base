package net.ruixin.service.plat.cache;

import net.ruixin.dao.plat.dictionary.IDictDao;
import net.ruixin.domain.plat.dictionary.SysDict;
import net.ruixin.util.tools.RxFileUtils;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/11/18
 */
@Service
public class JscacheService implements IJscacheService {

    @Autowired
    private IDictDao dictDao;

    @Override
    public Map<String, Object> jsPath(Boolean forceUpdate, String ljspath, String rjspath, String dictCode) {
        Map<String, Object> result = new HashMap<>();
        if (RxStringUtils.isNotEmpty(dictCode)) {
            try {
                dictCode = URLDecoder.decode(dictCode, "UTF-8").trim();
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
        }
        File f = new File(rjspath);
        if (f.exists() && f.isFile()) {
            if(forceUpdate == null){
                result.put("data", dictDao.getDictByCode(dictCode));
            }else{
                if (forceUpdate && f.delete()) {  //前端判断为过期的时候传入forceUpdate参数
                    SysDict dict = dictDao.getDictByCode(dictCode);
                    RxFileUtils.createFile(f, dict);
                    result.put("data", dict);
                }
            }
        } else {
            SysDict dict = dictDao.getDictByCode(dictCode);
            RxFileUtils.createFile(f, dict);
            result.put("data", dict);
        }
        result.put("jspath", ljspath);
        return result;
    }

    @Override
    public Map<String, Object> jsMergePath(Boolean forceUpdate, String ljspath, String rjspath, String[] dictCodes) {
        Map<String, Object> result = new HashMap<>();
        File f = new File(rjspath);
        if (f.exists() && f.isFile()) {
            if(forceUpdate == null){
                Map<String, Object> rs = new HashMap<>();
                for (String dictCode : dictCodes) {
                    rs.put(dictCode, dictDao.getDictByCode(dictCode));
                }
                result.put("data", rs);
            }else{
                if (forceUpdate && f.delete()) { //前端判断为过期的时候传入forceUpdate参数
                    Map<String, Object> rs = new HashMap<>();
                    for (String dictCode : dictCodes) {
                        rs.put(dictCode, dictDao.getDictByCode(dictCode));
                    }
                    RxFileUtils.createFile(f, rs);
                    result.put("data", rs);
                }
            }
        } else {
            Map<String, Object> rs = new HashMap<>();
            for (String dictCode : dictCodes) {
                rs.put(dictCode, dictDao.getDictByCode(dictCode));
            }
            RxFileUtils.createFile(f, rs);
            result.put("data", rs);
        }
        result.put("mergePath", ljspath);
        return result;
    }

    @Override
    public void allJsPath(String rootPath) {
        List<SysDict> dicts = dictDao.getAllDict();
        for(SysDict dict :dicts){
            File f = new File(rootPath+dict.getDictCode()+".js");
            if (f.exists() && f.isFile()) {
                if(f.delete()){
                    RxFileUtils.createFile(f, dict);
                }
            }else{
                RxFileUtils.createFile(f, dict);
            }
        }
    }
}
