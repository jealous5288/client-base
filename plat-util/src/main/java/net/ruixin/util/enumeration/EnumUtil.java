package net.ruixin.util.enumeration;

import net.ruixin.util.exception.RuleException;
import net.ruixin.util.tools.RxStringUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: Administrator
 * Date: 13-5-21
 * Time: 上午11:24
 * To change this template use File | Settings | File Templates.
 */
@SuppressWarnings({"finally", "ReturnInsideFinallyBlock", "unused"})
public class EnumUtil {

    /**
     * 枚举工具类，通过此方法可以生成枚举属性组成的列表，方便前台生成select框
     *
     * @param className 枚举类名
     * @return 枚举属性组成的列表
     */
    private static List<Map<String, Object>> getEnumValue(String className) {
        List<Map<String, Object>> result = new ArrayList<>();
        try {
            Object[] enumArr = Class.forName(className).getEnumConstants();
            List<Field> fieldList = new ArrayList<>();
            Field[] fields = Class.forName(className).getDeclaredFields();
            for (Field fld : fields) {
                if (!fld.isEnumConstant() && !fld.getName().equals("$VALUES")) {
                    fld.setAccessible(true);
                    fieldList.add(fld);
                }
            }
            for (Object anEnumArr : enumArr) {
                Map<String, Object> item = new HashMap<>();
                item.put("key", anEnumArr.toString());
                for (Field field : fieldList) {
                    item.put(field.getName(), field.get(anEnumArr));
                }
                result.add(item);
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            return result;
        }
    }

    private static Enum getEnumByKey(Class enumClass, String enumKey) throws RuleException {
        try {
            return Enum.valueOf(enumClass, enumKey);
        } catch (Exception e) {
            throw new RuleException("枚举" + enumClass.getName() + "." + enumKey + "不存在," + e.getMessage());
        }
    }

    private static Enum getEnumById(Class enumClass, int id) throws RuleException {
        try {
            Enum[] enumArr = (Enum[]) enumClass.getEnumConstants();
            return enumArr[id];
        } catch (Exception e) {
            throw new RuleException("INDEX为" + id + "的枚举不存在，" + e.getMessage());
        }
    }

    public static Enum getEnum(Class enumClass, String value) throws RuleException {
        if (RxStringUtils.isNumber(value)) {
            return getEnumById(enumClass, Integer.parseInt(value));
        } else {
            return getEnumByKey(enumClass, value);
        }
    }
}
