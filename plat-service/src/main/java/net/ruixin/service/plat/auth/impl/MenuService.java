package net.ruixin.service.plat.auth.impl;

import net.ruixin.dao.plat.auth.IMenuDao;
import net.ruixin.dao.plat.organ.IUserDao;
import net.ruixin.domain.plat.auth.SysMenu;
import net.ruixin.domain.plat.organ.SysUser;
import net.ruixin.service.plat.auth.IMenuService;
import net.ruixin.util.cache.Cache;
import net.ruixin.util.cache.CacheKit;
import net.ruixin.util.paginate.FastPagination;
import net.ruixin.util.tools.RxStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by admin on 2016-10-12
 * 系统菜单服务实现
 */
@Service
public class MenuService implements IMenuService {

    @Autowired
    private IMenuDao menuDao;

    @Autowired
    private IUserDao userDao;

    @Override
    public SysMenu getMenuById(Long id) {
        return menuDao.getMenuById(id);
    }

    @Override
    public FastPagination getMenuList(Map map) {
        return menuDao.getMenuList(map);
    }

    @Override
    @Transactional
    public void saveMenu(SysMenu sysMenu) {
        menuDao.saveMenu(sysMenu);
    }

    @Override
    @Transactional
    public void deleteMenu(Long menuId) {
        menuDao.deleteMenu(menuId);
    }

    @Override
    public List<Map<String, Object>> getMenuByParent(Long parent, Long menuId) {
        return menuDao.getMenuByParent(parent, menuId);
    }

    @Override
    public List getMenuTree(Long filterId) {
        List<Map<String, Object>> menuList = menuDao.getMenuTree();
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> tempMap;
        for (Map<String, Object> map : menuList) {
            if (filterId != null && filterId.toString().equals(map.get("MENU_ID").toString())) {
                continue;
            }
            tempMap = new HashMap<>();
            tempMap.put("id", map.get("MENU_ID"));     //菜单id
            tempMap.put("pId", map.get("PARENT") == null ? "" : map.get("PARENT"));  //父级菜单id
            tempMap.put("name", map.get("MENU_NAME")); //菜单名
            tempMap.put("sort", map.get("SORT"));    //序号
            tempMap.put("icon", CacheKit.get(Cache.CONFIG, "menuIcon"));     //菜单图标
            tempMap.put("open", map.get("PARENT") == null);  //展开第一级
            list.add(tempMap);
        }
        return list;
    }

    @Override
    public List getRoleMenuTree(Long filterId, Long roleId) {
        List<Map<String, Object>> roleMenuList = menuDao.getRoleMenuTree(roleId);
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> tempMap;
        for (Map<String, Object> map : roleMenuList) {
            if (filterId != null && filterId.toString().equals(map.get("MENU_ID").toString())) {
                continue;
            }
            tempMap = new HashMap<>();
            tempMap.put("id", map.get("MENU_ID"));      //菜单id
            tempMap.put("pId", map.get("PARENT") == null ? "" : map.get("PARENT")); //父级菜单id
            tempMap.put("name", map.get("MENU_NAME"));  //菜单名
            tempMap.put("sort", map.get("SORT"));       //序号
            tempMap.put("checked", map.get("GLB_ID") != null);       //是否关联（勾不勾）
            tempMap.put("icon", CacheKit.get(Cache.CONFIG, "menuIcon"));        //菜单图标
            tempMap.put("open", map.get("PARENT") == null); //展开第一级
            list.add(tempMap);
        }
        return list;
    }

    @Override
    public List getUserMenuTree(Long filterId, Long userId) {
        SysUser sysUser = userDao.getUserById(userId);
        List<Map<String, Object>> userMenuList;
        if (sysUser.getSfwhgxcd() != null && sysUser.getSfwhgxcd().equals("1")) {  //是否维护个性菜单 0：否 1：是
            userMenuList = menuDao.getUserMenuTree(userId, "y");
        } else {
            userMenuList = menuDao.getUserMenuTree(userId, "n");
        }
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> tempMap;
        for (Map<String, Object> map : userMenuList) {
            if (filterId != null && filterId.toString().equals(map.get("MENU_ID").toString())) {
                continue;
            }
            tempMap = new HashMap<>();
            tempMap.put("id", map.get("MENU_ID"));      //菜单id
            tempMap.put("pId", map.get("PARENT") == null ? "" : map.get("PARENT"));      //父级菜单id
            tempMap.put("name", map.get("MENU_NAME"));  //菜单名
            tempMap.put("sort", map.get("SORT"));       //序号
            tempMap.put("checked", map.get("GLB_ID") != null);       //是否关联（勾不勾）
            tempMap.put("icon", CacheKit.get(Cache.CONFIG, "menuIcon"));        //菜单图标
            tempMap.put("open", map.get("PARENT") == null);  //展开第一级
            list.add(tempMap);
        }
        return list;
    }

    @Override
    public List getMenusByUserId(Long userId) {
        String sfwhgxcd = userDao.getUserById(userId).getSfwhgxcd();
        List<String> menus;
        if (RxStringUtils.isNotEmpty(sfwhgxcd) && sfwhgxcd.equals("1")) {
            menus = menuDao.getMenusByUserId(userId, "y");
        } else {
            menus = menuDao.getMenusByUserId(userId, "n");
        }
        return menus;
    }

//    @Override
//    public List getUserMenus(Long userId, String sfwhgxcd) {
//        List<Map<String, Object>> menus = menuDao.getUserMenus(userId, sfwhgxcd);
//        List<Map<String, Object>> finalList = new ArrayList<>();
//        List<Map<String, Object>> tempChildList = new ArrayList<>();
//        Map<String, Object> menuMap;
//        if (menus.size() > 0) {
//            for (int i = 0; i < menus.size(); i++) {
//                menuMap = new HashMap<>();
//                menuMap.put("MENU_ID", menus.get(i).get("MENU_ID"));
//                menuMap.put("MENU_NAME", menus.get(i).get("MENU_NAME"));
//                menuMap.put("MENU_CODE", menus.get(i).get("MENU_CODE"));
//                menuMap.put("MENU_ICON", menus.get(i).get("MENU_ICON"));
//                menuMap.put("MENU_URL", menus.get(i).get("MENU_URL"));
//                menuMap.put("CHILD", new ArrayList<Map>());
//                if (RxStringUtils.isNotEmpty(menus.get(i).get("PARENT"))) {
//                    tempChildList.add(menuMap);
//                    if (i == menus.size() - 1) {
//                        finalList.get(finalList.size() - 1).put("CHILD", tempChildList);
//                    }
//                } else {
//                    if (i > 0) {
//                        finalList.get(finalList.size() - 1).put("CHILD", tempChildList);
//                        tempChildList = new ArrayList<>();
//                    }
//                    finalList.add(menuMap);
//                }
//            }
//        }
//        return finalList;
//    }

    @Override
    public List getUserMenus(Long userId, String sfwhgxcd) {
        List<Map<String, Object>> rootMenus = menuDao.getUserMenus(userId, sfwhgxcd);
        List<Map<String, Object>> finalList = new ArrayList<>();
        //获取顶级菜单
        for (Map<String, Object> menu : rootMenus) {
            // 一级菜单没有parentId
            if (RxStringUtils.isEmpty(menu.get("PARENT"))) {
                finalList.add(menu);
            }
        }
        //获取顶级菜单的子菜单
        for (Map<String, Object> menu : finalList) {
            //通过顶级菜单id获取子菜单
            menu.put("CHILD_MENU", getChild(Integer.parseInt(menu.get("MENU_ID").toString()) , rootMenus));
        }

        return finalList;
    }

    private List<Map<String, Object>> getChild(Integer id, List<Map<String, Object>> menus) {
        // 子菜单
        List<Map<String, Object>> childList = new ArrayList<>();
        for (Map<String, Object> m : menus) {
            if (RxStringUtils.isNotEmpty(m.get("PARENT"))) {
                if (Integer.parseInt(m.get("PARENT").toString())==id) {
                    childList.add(m);
                }
            }
        }

        for (Map<String, Object> m : childList) {
            if (RxStringUtils.isEmpty(m.get("MENU_URL"))) {
                m.put("CHILD_MENU", getChild(Integer.parseInt(m.get("MENU_ID").toString()) , menus));
            }
        }
        if (childList.size() == 0) {
            return null;
        }
        return childList;
    }

}
