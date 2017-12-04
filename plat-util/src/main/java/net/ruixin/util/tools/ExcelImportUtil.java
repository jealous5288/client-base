package net.ruixin.util.tools;

import org.apache.poi.hssf.usermodel.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * excel导入数据工具类
 */
public class ExcelImportUtil {

    public static List<Map<String, Object>> excelImport(MultipartFile file, String[] fields) throws IOException {
        //目前只适用elcel2003版本的
        HSSFWorkbook wookbook = new HSSFWorkbook(file.getInputStream());
        // 在Excel文档中，第一张工作表的缺省索引是0
        HSSFSheet sheet = wookbook.getSheetAt(0);
        // cel文件中的所有行数­
        int rows = sheet.getPhysicalNumberOfRows();
        // 只有表头没有内容，返回空list
        if (rows == 1) return Collections.emptyList();

        List<Map<String, Object>> resultList = new ArrayList<>();
        // 遍历行，从第一行开始。
        for (int i = 1; i < rows; i++) {
            // 读取左上端单元格­
            HSSFRow row = sheet.getRow(i);  //获取行数据
            if (row != null) {
                Map<String, Object> map = new HashMap<>();
                // 遍历行的单元格
                for (int j = 1; j < fields.length; j++) {
                    // 获取列
                    HSSFCell cell = row.getCell(j);
                    if (cell != null) {
                        switch (cell.getCellType()) {
                            case HSSFCell.CELL_TYPE_NUMERIC:      //数字类型
                                if (HSSFDateUtil.isCellDateFormatted(cell)) {  //时间类型
                                    SimpleDateFormat sdf = null;
                                    if (cell.getCellStyle().getDataFormat() == HSSFDataFormat
                                            .getBuiltinFormat("h:mm")) {
                                        sdf = new SimpleDateFormat("HH:mm");
                                    } else {// 日期
                                        sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
                                    }
                                    Date date = cell.getDateCellValue();
                                    map.put(fields[j], sdf.format(date));
                                } else {
                                    DecimalFormat df = new DecimalFormat("#");
                                    map.put(fields[j], df.format(cell.getNumericCellValue()));
                                }
                                break;
                            case HSSFCell.CELL_TYPE_STRING:        //字符串类型
                                map.put(fields[j], cell.getStringCellValue());
                                break;
                            default:
                                map.put(fields[j], "");
                                break;
                        }
                    } else {
                        map.put(fields[j], "");
                    }
                }
                resultList.add(map);
            }
        }
        return resultList;
    }

    /**
     * 导入excel文件工具类
     *
     * @param fis 文件流
     * @return
     */
    public static HSSFWorkbook parseExcel(InputStream fis) {
        HSSFWorkbook book = null;//创建工作薄
        try {
            book = new HSSFWorkbook(fis);
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Excle导入出错");
        }
        return book;
    }

}
