package net.ruixin.service.plat.workflow.impl;

import net.ruixin.dao.plat.workflow.ISysEntrustDao;
import net.ruixin.domain.plat.workflow.instance.SysEntrust;
import net.ruixin.enumerate.plat.Sfyx_st;
import net.ruixin.service.plat.workflow.ISysEntrustService;
import net.ruixin.util.paginate.FastPagination;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * Created by Administrator on 2016/12/12 0012.
 * 委办服务层
 */
@Service
public class SysEntrustService implements ISysEntrustService {
    @Autowired
    private ISysEntrustDao entrustDao;

    @Override
    public FastPagination getEntrustList(Map map, Long userId) {
        return entrustDao.getEntrustList(map, userId);
    }

    @Override
    public SysEntrust getEntrustById(Long id) {
        return entrustDao.getEntrustById(id);
    }

    @Override
    @Transactional
    public Long saveEntrust(SysEntrust sysEntrust) {
        return entrustDao.saveEntrust(sysEntrust, 1);
    }

    @Override
    public Boolean checkTime(SysEntrust sysEntrust, Long userId) {
        List<SysEntrust> startList = entrustDao.getEntrustByDate(sysEntrust.getStartDate(), userId);
        if (startList.size() > 0) {
            return false;
        } else {
            List<SysEntrust> endList = entrustDao.getEntrustByDate(sysEntrust.getEndDate(), userId);
            if (endList.size() > 0) {
                return false;
            }
        }
        return true;
    }

    @Override
    @Transactional
    public Long stopEntrust(Long id) {
        SysEntrust entrust = entrustDao.getEntrustById(id);
        entrust.setSfyx_st(Sfyx_st.UNVALID);
        return entrustDao.saveEntrust(entrust, 2);
    }
}
