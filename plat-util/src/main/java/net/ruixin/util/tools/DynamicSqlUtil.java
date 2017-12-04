package net.ruixin.util.tools;

import java.util.Iterator;
import java.util.Map;

/**
 * 将查询参数map转换成where子句。
 */
public class DynamicSqlUtil {
    public static String generateWhere(Map queryMap) {
        queryMap = mapRemoveNullVallue(queryMap);
        StringBuilder sb = new StringBuilder(" WHERE ");
        Iterator it = queryMap.entrySet().iterator();
        int i = 0;
        while (it.hasNext()) {
            Map.Entry entry = (Map.Entry) it.next();
            if (entry.getValue() != null) {
                if (i < queryMap.size()-1 ) {
                    sb.append(entry.getKey() + "=:" + entry.getKey()+" AND " );
                    i++;
                } else {
                    sb.append(entry.getKey() + "=:" + entry.getKey());
                }
            }


        }
        return sb.toString();
    }

    /**
     * map 去除value为空的值
     */
    public static Map mapRemoveNullVallue(Map map) {
        Iterator it = map.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry entry = (Map.Entry) it.next();
            if(entry.getValue()==null){
                map.remove( entry.getKey());
            }

            System.out.println(entry.getKey()+""+entry.getValue());

        }
        return map;
    }

//        Set<Map.Entry<String, Object>> entrySet = map.entrySet();
//        for (Map.Entry<String, Object> entry : entrySet) {
//            System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
//        }
//        return null;
//    }

}
