package net.ruixin.service.plat.workflow;

import net.ruixin.domain.plat.workflow.instance.SysEntrust;
import net.ruixin.util.paginate.FastPagination;

import java.util.Map;

/**
 * Created by Administrator on 2016/12/12 0012.
 * 委办service
 */
public interface ISysEntrustService {
    /*
    * 获取委办列表
    * */
    FastPagination getEntrustList(Map map, Long userId);

    SysEntrust getEntrustById(Long id);

    Long saveEntrust(SysEntrust sysEntrust);

    Boolean checkTime(SysEntrust sysEntrust, Long userId);

    Long stopEntrust(Long id);
}
