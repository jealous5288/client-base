package net.ruixin.controller.plat.dictionary;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 字典Mapping
 */

@Controller
@RequestMapping("/dict")
public class DictMapping {

    @RequestMapping("/dictList")
    public String dictList() {
        return "plat/dictionary/dictList";
    }

    @RequestMapping("/dictEdit")
    public String dictEdit() {
        return "plat/dictionary/dictEdit";
    }

    @RequestMapping("/subDictEdit")
    public String subDictEdit() {
        return "plat/dictionary/subDictEdit";
    }

    @RequestMapping("/dictSelect")
    public String dictSelect() {
        return "plat/dictionary/dictSelect";
    }

}
