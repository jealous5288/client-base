package net.ruixin.util.tools;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Oracle数据处理工具类
 */
public class OracleUtils {
    /**
     * 特殊处理BLOB和STRUCT类型
     * @param value 待处理对象
     * @return 对象结果
     */
    private static Object getValueFromOracleType(Object value) {
        if (value == null) {
            return "";
        }
        if (value instanceof oracle.sql.BLOB || value instanceof oracle.sql.STRUCT){
            return value;
        } else {
            return value.toString();
        }
    }

    /**
     * 转换ResultSet到List
     * @param rs ResultSet结果集
     * @param columnToProperty 指定的属性字段
     * @return List结果集
     * @throws SQLException sql异常
     */
    @SuppressWarnings("unchecked")
    public static List parseResultSetToList(ResultSet rs, Map<String, String> columnToProperty) throws SQLException {
        if (columnToProperty == null) {
            columnToProperty = new HashMap<>();
        }
        List result = new ArrayList();
        ResultSetMetaData meta = rs.getMetaData();
        int nColNum = meta.getColumnCount();
        while (rs.next()) {
            Map<String, Object> vRow = new HashMap<>();
            for (int j = 1; j <= nColNum; j++) {
                if (!meta.getColumnName(j).equalsIgnoreCase("count")) {
                    Object sValue = rs.getObject(j);
                    sValue = getValueFromOracleType(sValue);
                    String column = meta.getColumnName(j).toUpperCase();
                    String property = columnToProperty.get(column);
                    if (property != null && !property.equals("")) {
                        vRow.put(property, sValue);
                    } else {
                        vRow.put(column, sValue);
                    }
                }
            }
            result.add(vRow);
        }
        return result;
    }

    /**
     * 获取in的sql语句
     * @param zd 字段名称
     * @param ids id字符串序列，要求是逗号拼接
     * @return in的sql语句
     */
    public static String getInSql(String zd, String ids) {
        StringBuilder sb = new StringBuilder();
        String[] idarray = ids.split(",");
        if(idarray.length > 0){
            for(int i = 0; i < idarray.length; i++){
                if(i == 0){
                    sb.append(" (").append(zd).append(" in (");
                }else if(i%500 == 0){
                    sb.deleteCharAt(sb.length() - 1);
                    sb.append(") or ").append(zd).append(" in (");
                }
                sb.append(idarray[i]).append(",");
                if (i == idarray.length - 1){
                    sb.deleteCharAt(sb.length() - 1);
                    sb.append(")) ");
                }
            }
        }
        return sb.toString();
    }
}
