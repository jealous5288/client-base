/*****************************************************************
 * 模型渲染器（MR）
 * 最后更新时间：2016-09-12
 * 最后更新人：zp
 *****************************************************************/

// 替换html中的特殊符号
function replaceSymbols(s) {
    if (s) {
        s = s.toString().replace(/</g, "&lt;");
        s = s.toString().replace(/>/g, "&gt;");
    }
    return s;
}

//MR:模型控件渲染器，剥离出来，方便维护
var MR = function () {
    return MR.prototype.init();
}
MR.prototype = {
    init: function () {
        return this;
    },
    /*****************************************************************
     *  参数：字段初始配置默认值
     *****************************************************************/
    defaultPropertyJson: {
        //核心结构
        main: {
            disabled: false, //禁用标志，权限高于状态json。可选值：true/false。
            display: true, //显示标志。可选值：true/false。
            width: "",  //Zp add. 字段控件宽度设置，可根据具体情况个性定制
            defaultValue: null, //默认值，不设置则为null，否则为具体值。
            maxLength: null, //最大长度，不设置则为null，否则为具体数字。
            type: "normal",  //控件类型，默认为“normal”,否则为具体的控件类型：“normal”、“dict”、“date”、“layer”、“file”、“img”。
            changeFunc: null,  //后置接口名称，当字段值变更时触发该处注册的方法。该处填写为字符串方法名。
            tagName: "",  //Zp add. searchView用，作为字段的中文显示。
            spanShow: true,  //Zp add. 当字段被禁用时，是否开启spanshow
            canClear: false, //Zp add. searchView用，true可被清空成defaultValue或“”，同时当有显示的字段canClear为true，则搜索面板显示“恢复”按钮
            ifForm: true    //是否提交，getJson时会根据该项判断是否需要转换成json。可选值：true/false。同时getSearchJson作为是否提交搜索条件的标志。
        },
        rules: {//规则配置
            //选择具体的验证方法名填入下面合适的数组中：参考validate.js.
            //具体方法有：1、"notNull"非空验证 2、"isIntEqZero" 3、判断整数是否等于0 4、"isIntGtZero"判断整数num是否大于0
            //5、"isIntGteZero"判断整数num是否大于或等于0 6、"isEmail"匹配Email地址 7、"isNumber"判断数值类型，包括整数和浮点数
            //8、"isDigits"只能输入数字[0-9] 9、"isPhone"手机或固定电话 10、"isTel"匹配固定电话 11、"isMobile"匹配手机号
            //12、"isQq"匹配qq 13、"isIp"判断是否为ip地址 14、"isDate"匹配日期（“2016-01-01”） 15、"inOneAndHundred"判断输入值是否在0-100之间
            //16、"isEnglish"匹配英文  17、"isInteger"匹配整数 18、"isDouble"匹配Double或float  19、"isZipCode"匹配邮政编码 20、"isUrl"匹配URL
            //21、"isRightfulString"判断是否为合法字符(a-zA-Z0-9-_) 22、"isNumAndEnglish"判断是否为数字和字母的组合 23、"isIdCardNo“匹配身份证号码
            //24、"isChinese"匹配汉字 25、"isChineseChar"匹配中文(包括汉字和字符) 26、"stringCheck"字符验证，只能包含中文、英文、数字、下划线等字符。
            //27、"isCode"验证是否为编码（字母数字下划线）
            checkKeyup: [],  //输入验证，挂载输入事件。
            checkValue: [],  //失焦验证，挂载失焦事件，同时当调用模型验证接口时优先触发。
            checkSave: []    //保存验证，当调用模型验证接口时触发。
        },
        //字典项类型配置，type:"dict"时生效
        dictConfig: {
            dictCode: null, //请求的字段类型编码，对应数据库zdlxcode，字符串类型。
            reqInterface: null, //个性化字典请求接口名，如为个性化字典，则请求该处注册的个性字典，获取具体的字典数据。该处填写为字符串方法名。
            pcode: null, //供筛选的父级字典值，默认为null。
            checkType: null, //字典项控件类型，可为“checkbox”、“radio”，null则为默认下拉字典项。
            dependence: null, //依赖的级联字典项字段名
            showPlsSelect: true,   //若为下拉字典项，显示“请选择”项，可选值true/false。
            plsSelectName: "请选择",    //为选择内容的“请选择”可定制。
            ifSearch: false //若为下拉字典项，是否为搜索下拉框，可选值true/false。
        },
        //日期类型配置，type:"date"时生效
        dateConfig: {
            dateFmt: "yyyy-MM-dd", //显示日期格式，默认为年月日，如“2016-06-22”,可根据需要具体配置
            defaultDate: false,  //是否默认为系统时间，可选值：true/false。
            maxDate: null, //最大日期，可为具体的日期字符串，也可为渲染最大日期的字段，也可为“sysdate”表示以系统时间为限。
            minDate: null, //最小日期，可为具体的日期字符串，也可为渲染最小日期的字段，也可为“sysdate”表示以系统时间为限。
            startDate: null,//开始时间，可为具体的日期字符串。
            focusPosit: null     //聚焦到下一日期位置
        },
        //弹出层类型配置，type:"layer"时生效
        layerConfig: {
            title: "弹出层",  //弹出层标题，字符串类型。
            style: "medium", //弹出层样式类型，可选值：“small”（小）、“medium”（中）、“big”（大）、“tree”（树）或是个性配置,两项的字符串数组，如：["200px","300px"]。
            url: null, //请求url，字符串类型，如“sggl/getSgry?”需带上第一个连接符。
            checkFunc: null, //弹出层前置接口名称，该处填写为字符串方法名。当方法返回false，则不弹出弹出层，若返回字符串，则拼接到url中，如“dwlx=1&rylx=2”。
            callbackFunc: null,  //弹出层回调接口名称，该处填写为字符串方法名。
            canDelete: false, //弹出层内容是否可删除，true则显示删除按钮，可选值：true/false。
            name: ""     //关联的名称属性,在id中配置，名称如果不需要存储到数据库，可配置
        },
        //附件类型配置，type:"file"时生效
        fileConfig: {
            type: "list",  //附件控件类型，可为：“list”手风琴附件、"table"附件列表、“div”横向附件块、“single”单条附件、“image”图片附件。
            fileType: null, //文件类型限制，配置为字符串，如：“*.jpg,*.png,*.gif”。
            dictCode: null, //若为手风琴附件，配置字典名称。
            pcode: null, //若为手风琴附件，若字典有上级字典依赖，则配置上级字典编号。
            defaultType: null, //默认附件类型编码，同字典项编码。
            uploadName: null, //上传按钮名称，null则上传按钮显示为“上传资料”。
            minNum: null,  //上传最小数量，配置为数字，若设置弹出层各字典项。
            listName: "" //附件列表名称
        },
        //弹出层类型配置，type:"img"时生效
        imgConfig: {
            imgSrc: null,  //图片路径。
            imgGetFunc: null //获取图片方法名。该处填写为字符串方法名。
        }
    },
    /*****************************************************************
     *  方法：检查补全字段配置
     *****************************************************************/
    checkPropertyJson: function (propertyJson, model) {
        //main配置
        var json = this.defaultPropertyJson;
        for (key in json.main) {
            if (!propertyJson[key] && typeof(propertyJson[key]) != "boolean") {
                propertyJson[key] = json.main[key];
            }
        }
        //rules规则配置
        if (!propertyJson.rules) {
            propertyJson.rules = {};
        }
        for (key in json.rules) {
            if (!propertyJson.rules[key]) {
                propertyJson.rules[key] = json.rules[key];
            }
        }
        //控件详细配置
        var type = propertyJson.type;
        if (type != "normal") {
            if (!propertyJson[type + "Config"]) {
                propertyJson[type + "Config"] = {};
            }
            for (key in json[type + "Config"]) {
                if (typeof propertyJson[type + "Config"][key] == "undefined") {
                    propertyJson[type + "Config"][key] = json[type + "Config"][key];
                }
            }
        }
    },
    /*****************************************************************
     *  方法：禁用效果实现（spanshow等）
     *****************************************************************/
    disabledHandle: function (t, proJson, keyValue) {
        //spanshow的去除
        var tagName = $(t).prop("tagName");
        if ($(t).hasClass("spanparent")) {
            $(t).removeClass("spanparent");
            $(t).show();
            if ($(t).next().hasClass("span_show_ellipsis")) {
                $(t).next().remove();
            }
            if ($(t).next().hasClass("clearLayer")) {
                if ($(t).next().next().hasClass("span_show_ellipsis")) {
                    $(t).next().next().remove();
                }
            }
        }
        if (proJson.spanShow) {
            //spanShow的实现
            if ($(t).hasClass("disabled") && !$(t).is(":hidden")) {
                if (tagName == "INPUT" && $(t).prop("type") == "text") {
                    $(t).addClass("spanparent");
                    $(t).hide();
                    $(t).after("<span class='span_show_ellipsis' title='" + replaceSymbols($(t).val()) + "'>" + replaceSymbols($(t).val()) + "</span>");
                } else if (tagName == "SELECT") {
                    $(t).addClass("spanparent");
                    $(t).hide();
                    var text = "";
                    if (keyValue) {
                        if (isIE6) {
                            $(t).each(function (i, options) {
                                for (var i = 0; i < options.length; i++) {
                                    if (options[i].value == keyValue) {
                                        text = options[i].text;
                                    }
                                }
                            });
                        } else {
                            text = $(t).find("option:selected").text();
                        }
                    }
                    $(t).after("<span class='span_show_ellipsis' title='" + replaceSymbols(text) + "'>" + replaceSymbols(text) + "</span>");
                } else if (tagName == "DIV" && proJson.type == "dict") {
                    $(t).addClass("spanparent");
                    $(t).hide();
                    var text = "";
                    $(t).find('input[type=checkbox]:checked').each(function () {
                        text = text + $(this).parent().text() + "，";
                    });
                    $(t).find('input[type=radio]:checked').each(function () {
                        text = text + $(this).parent().text() + "，";
                    });
                    if (text != "") {
                        text = text.substr(0, text.length - 1);
                    }
                    $(t).after("<span class='span_show_ellipsis' title='" + replaceSymbols(text) + "'>" + replaceSymbols(text) + "</span>");
                } else if (tagName == "TEXTAREA") {
                    //直接修改不行
                    setTimeout(function () {
                        $(t).attr("disabled", false);
                        $(t).attr("readonly", true);
                    }, 1);
                }

            }
        }
    },
    /*****************************************************************
     *  方法：请求字典
     *****************************************************************/
    getZdDict: function (dictCode, pcode) {
        if (typeof(dictCode) == "string") {
            if (this.dictJson) {
                var json = this.dictJson;
                for (var key in json) {
                    if (json[key].length > 0) {
                        if ($.inArray(dictCode, json[key]) != -1) {
                            return JsMergeCache(key, json[key], dictCode, pcode);
                        }
                    }
                }
                return JsCache(dictCode, pcode);
            } else {
                return JsCache(dictCode, pcode);
            }
        } else {
            return dictCode;
        }
    },
    /*****************************************************************
     *  方法：清除字段渲染效果
     *****************************************************************/
    clearPropertyRender: function (t, model) {
        $(t).unbind();
    },
    /*****************************************************************
     *  方法：清空字段内容
     *****************************************************************/
    emptyProperty: function (t, property, model, emptyDomTag) {
        if (t) {
            var tagName = $(t).prop("tagName");
            var type = $(t).prop("type");
            if (property != "sfyx_st") {
                model.set(property, "");
                if (emptyDomTag) {
                    if (tagName == "DIV") {
                        $(t).children("input").prop("checked", false);
                    } else if (tagName == "INPUT" && (type == "radio" || type == "checkbox")) {
                        $(t).prop("checked", false);
                    } else {
                        $(t).val("");
                    }
                }
            }
        } else {
            if (property != "sfyx_st") {
                model.set(property, "");
            }
        }
    },
    /*****************************************************************
     *  方法：从更新表单中更新字段
     *****************************************************************/
    updateModelByElement: function (t, model) {
        var tagName = $(t).prop("tagName");
        var pro = $(t).attr("data-property");
        var type = $(t).prop("type");
        var value;
        if (tagName == "INPUT" && type == "radio") {
            var checkStr = "";
            $("*[data-model=" + model.get("ModelName") + "][data-property=" + pro + "]").each(function (i2, t2) {
                if ($(t2).prop("checked")) {
                    checkStr += $(t2).val() + ","
                }
            });
            if (checkStr.length > 0) {
                model.set(pro, checkStr.substring(0, checkStr.length - 1));
            } else {
                model.set(pro, "");
            }
        } else if (tagName == "INPUT" && type == "checkbox") {
            var checkStr = "";
            $("*[data-model=" + model.get("ModelName") + "][data-property=" + pro + "]").each(function (i2, t2) {
                if ($(t2).prop("checked")) {
                    checkStr += $(t2).attr("checkvalue") + ","
                }
            });
            if (checkStr.length > 0) {
                model.set(pro, checkStr.substring(0, checkStr.length - 1));
            } else {
                model.set(pro, "");
            }
        } else {
            if (tagName == "DIV") {
                var valList = "";
                $(t).find('input[type=checkbox]:checked').each(function () {
                    valList = valList + $(this).val() + ",";
                });
                $(t).find('input[type=radio]:checked').each(function () {
                    valList = valList + $(this).val() + ",";
                });
                if (valList != "") {
                    valList = valList.substr(0, valList.length - 1);
                }
                value = valList;
            } else if (tagName == "SELECT") {
                value = $(t).val();
            } else if (tagName == "LABEL" || tagName == "SPAN") {
                value = $(t).text();
            } else {
                if (typeof($(t).val()) != "undefined") {
                    if ($(t).val() == null || $(t).val() === "") {
                        value = "";
                    } else {
                        value = $(t).val();
                    }
                }
            }
            model.set(pro, value);
        }
    },
    /*****************************************************************
     *  方法：验证字段
     *****************************************************************/
    variableProperty: function (t, noTip, model) {
        if (typeof(noTip) == "undefined" || noTip === null) {
            noTip = false;
        }
        var result = true;
        var tagName = $(t).prop("tagName");
        var type = $(t).prop("type");
        if (!$(t).parent().eq(0).hasClass("hideElement") && !$(t).hasClass("hideElement") && !$(t).hasClass("disabled")) {
            var key2 = $(t).attr("data-property");
            var value2 = model.initJson[model.className][$(t).attr("data-property")];
            if (value2 == null) {
                console.log(model.get("ModelName") + "属性" + key2 + "未定义");
            }
            if (value2.type == "file") {
                //手风琴类型验证
                if (value2.fileConfig.type == "list") {
                    var minNum = parseInt($(t).next().find(".action_button ").attr("minNum"));
                    if (minNum > 0) {
                        var num = 0;
                        $(t).next().find(".attachment_header").each(function (i3, t3) {
                            num += parseInt($(t3).children("h1").eq(0).children("em").html());
                        });
                        if (num < minNum) {
                            result = false;
                            if ($(t).next().find(".err").length == 0) {
                                $(t).next().find(".page_title").makeImgTip($(t), "附件数目不够");
                                $(t).next().find(".page_title").append('<span class="err" ><i class="iconfont">&#xe603;</i></span>');
                            }
                        }
                    }
                    $(t).next().find(".attachment_header").each(function (i, t2) {
                        var minNum = parseInt($(t2).attr("minNum"));
                        if (minNum > 0) {
                            var num = $(t2).children("h1").eq(0).children("em").html();
                            if (parseInt(num) < minNum) {
                                result = false;
                            }
                        }
                    });
                }
                //表格类型验证
                else if (value2.fileConfig.type == "table") {
                    //if($.inArray("notNull",value2.rules.checkSave) != -1) {
                    var minNum = parseInt($(t).next().attr("minNum"));
                    if (minNum > 0) {
                        var trNum = $(t).next().find("tr").length - $(t).next().find(".errortr").length - 1;
                        if (trNum < minNum) {
                            if ($(t).next().find(".err").length == 0) {
                                $(t).next().find(".page_title").makeImgTip($(t).next(), "附件数目不够");
                                $(t).next().find(".page_title").append('<span class="err" ><i class="iconfont">&#xe603;</i></span>');
                            }
                            result = false;
                        }
                    }
                    //}
                }
                else if (value2.fileConfig.type == "div") {
                    if ($.inArray("notNull", value2.rules.checkSave) != -1) {
                        var minNum = parseInt($(t).next().find("dl").attr("minNum"));
                        if (minNum > 0) {
                            if ($(t).next().find("dd").length < minNum) {
                                result = false;
                            }
                        }
                    }
                }
                else if (value2.fileConfig.type == "single") {
                    if ($.inArray("notNull", value2.rules.checkSave) != -1) {
                        if ($(t).next().find("dd").length < 1) {
                            result = false;
                        }
                    }
                }
                else if (value2.fileConfig.type == "image") {
                    if ($.inArray("notNull", value2.rules.checkSave) != -1) {
                        if ($(t).val == null || $(t).val() == "") {
                            result = false;
                            $(t).parent().find(".zpimage").attr("src", "/plat/medias/images/plat/002.jpg");
                        }
                    }
                }
                else if (value2.fileConfig.type == "html5") {

                }
            }
            else if (value2.type == "layer") {
                var objselect = "$(\"*[data-model='" + model.get("ModelName") + "'][data-property='" + key2 + "']\")" + ".get(0)";
                if (value2.layerConfig.name) {
                    objselect = "$(\"*[layer-model='" + model.get("ModelName") + "'][layer-property='" + value2.layerConfig.name + "']\")" + ".get(0)";
                }
                if (value2.rules.checkSave || value2.rules.checkValue) {
                    if (value2.rules.checkSave) {
                        for (var i = 0; i < value2.rules.checkSave.length; i++) {
                            var checkResult = eval(value2.rules.checkSave[i] + "(" + objselect + "," + noTip + ")");
                            if (!checkResult) {
                                result = false;
                                break;
                            }
                        }
                    }
                    if (value2.rules.checkValue) {
                        for (var i = 0; i < value2.rules.checkValue.length; i++) {
                            var checkResult = eval(value2.rules.checkValue[i] + "(" + objselect + "," + noTip + ")");
                            if (!checkResult) {
                                result = false;
                                break;
                            }
                        }
                    }
                }
            }
            else if (!$(t).is(":hidden")) {
                if (tagName == "INPUT" && (type == "radio" || type == "checkbox")) {    //手动radio验证
                    if ($.inArray("notNull", value2.rules.checkSave) != -1) {
                        var checkTag = false;
                        $("*[data-model=" + model.get("ModelName") + "][data-property=" + key2 + "]").each(function (i, t2) {
                            if ($(t2).prop("checked")) {
                                checkTag = true;
                            }
                        });
                        if (!checkTag) {
                            result = false;
                            $(t).parent().makeTip($(t).parent(), "不可为空");
                        }
                        $(t).click(function () {
                            if ($(t).parent().parent().find(".err").length > 0) {
                                $(t).parent().removeErrorTip();
                            }
                        });
                    }
                }
                else {
                    if (type != "hidden") {
                        if ($(t).hasClass("ValueErrorTag")) {
                            result = false;
                        } else {
                            if (value2.rules.checkSave || value2.rules.checkValue) {
                                //获取指定的document
                                if ($(t).val() != undefined) {
                                    var objselect = "$(\"*[data-model='" + model.get("ModelName") + "'][data-property='" + key2 + "']\")" + ".get(0)";
                                    if (value2.rules.checkSave) {
                                        for (var i = 0; i < value2.rules.checkSave.length; i++) {
                                            var checkResult = eval(value2.rules.checkSave[i] + "(" + objselect + "," + noTip + ")");
                                            if (!checkResult) {
                                                result = false;
                                                break;
                                                //return false;
                                            }
                                        }
                                    }
                                    if (value2.rules.checkValue) {
                                        for (var i = 0; i < value2.rules.checkValue.length; i++) {
                                            var checkResult = eval(value2.rules.checkValue[i] + "(" + objselect + "," + noTip + ")");
                                            if (!checkResult) {
                                                result = false;
                                                break;
                                                //return false;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return result;
    },
    /*****************************************************************
     *  方法：验证字段是否变更
     *****************************************************************/
    variableChange: function (t, model) {
        var result = false;
        if (!$(t).parent().eq(0).hasClass("hideElement")) {
            var tagName = $(t).prop("tagName");
            var pro = $(t).attr("data-property");
            var type = $(t).prop("type");
            var json2 = model.initJson[model.className][pro];
            var value;
            if (tagName == "DIV") {
                var valList = "";
                $(t).find('input[type=checkbox]:checked').each(function () {
                    valList = valList + $(this).val() + ",";
                });
                $(t).find('input[type=radio]:checked').each(function () {
                    valList = valList + $(this).val() + ",";
                });
                if (valList != "") {
                    valList = valList.substr(0, valList.length - 1);
                }
                value = valList;
            } else if (tagName == "LABEL" || type == "SPAN") {
                value = $(t).text();
            } else if (tagName == "INPUT" && type == "radio") {
                var checkStr = "";
                $("*[data-model=" + model.get("ModelName") + "][data-property=" + pro + "]").each(function (i2, t2) {
                    if ($(t2).prop("checked")) {
                        checkStr += $(t2).val() + ","
                    }
                });
                if (checkStr.length > 0) {
                    value = checkStr.substring(0, checkStr.length - 1);
                }
            } else if (tagName == "INPUT" && type == "checkbox") {
                var checkStr = "";
                $("*[data-model=" + model.get("ModelName") + "][data-property=" + pro + "]").each(function (i2, t2) {
                    if ($(t2).prop("checked")) {
                        checkStr += $(t2).attr("checkvalue") + ","
                    }
                });
                if (checkStr.length > 0) {
                    value = checkStr.substring(0, checkStr.length - 1);
                }
            } else {
                if (json2.type == "date") {
                    //var date =  new Date(Date.parse($(t).val().toString().replace(/-/g, "/")));
                    value = $(t).val().toString();
                } else if (typeof($(t).val()) != "undefined" && $(t).val() != null) {
                    value = $(t).val();
                }
            }
            if (value == null) {
                value = "";
            }
            if (model.get(pro) != value) {
                result = true;
            }
        }
        return result;
    },
    /*****************************************************************
     *  方法：渲染字典项
     *****************************************************************/
    fillDict: function (obj, key, value2, model, zdx, key2) {
        if (zdx != null) {
            if (value2.dictConfig.dependence) {
                model.MR.addDependEvent(key, zdx, key2, obj, value2, model);
            } else {
                model.MR.fillDictByZd(key, zdx, key2, obj, value2, model, value2.dictConfig.pcode);
            }
        }
    },
    //生成select  radio  checkbox
    fillDictByZd: function (key, zdx, key2, obj, value2, model, pValue) {
        var check = "";
        if (value2.dictConfig.checkType) {
            //checkbox || radio 的前置处理
        } else {
            //select的前置处理
            if (value2.dictConfig.showPlsSelect == null || value2.dictConfig.showPlsSelect) {
                check += "<option value=''>" + value2.dictConfig.plsSelectName + "</option>";
            }
        }
        //根据字典生成子项
        check += this.getChild(pValue, zdx, value2.dictConfig.checkType, key2);
        obj.html(check);
        //checkbox || radio
        if (value2.dictConfig.checkType) {
            obj.click(function () {
                if (obj.parent().find(".err").length > 0) {
                    obj.removeErrorTip();
                }
            });
        }
        //带搜索框的验证去除
        else if (value2.dictConfig.ifSearch) {
            obj.parent().click(function () {
                if (obj.parent().find(".err").length > 0) {
                    obj.removeErrorTip();
                }
            });
        }
    },
    //生成子项 option  div
    //还有默认值
    getChild: function (pValue, zdx, zdType, key2) {
        var check = "";
        if (zdx instanceof Array || Object.prototype.toString.apply(zdx) == "[object Array]") {
            for (var i = 0; i < zdx.length; i++) {
                if (pValue) {
                    if (typeof(pValue) == "object") {
                        for (var m = 0; m < pValue.length; m++) {
                            if (zdx[i].pcode == pValue[m] || (zdx[i].pcode && zdx[i].pcode == pValue[m])) {
                                check += this.getChild(null, zdx[i], zdType, key2);
                            }
                        }
                    } else if (zdx[i].pcode == pValue || (zdx[i].pcode && zdx[i].pcode == pValue)) {
                        check += this.getChild(null, zdx[i], zdType, key2);
                    }
                } else {
                    for (var i = 0; i < zdx.length; i++) {
                        check += this.getChild(null, zdx[i], zdType, key2);
                    }
                }
            }
        } else {
            if (typeof(zdx.code) != "undefined" && zdx.code != null) {
                if (zdType) {
                    check += "<label><input type='" + zdType + "' class='" + "i_checkbox" + "' name='" + key2 + "' value='" +
                        zdx.code + "'/>" + zdx.value + "</label>";
                } else {
                    check += this.parseOption(zdx, false);
                }
            }
        }
        return check;
    },
    //为字典项添加级联事件
    addDependEvent: function (key, zdx, key2, obj, value2, model) {
        $("*[data-model=" + key + "][data-property="
            + value2.dictConfig.dependence + "]").unbind("change");
        $("*[data-model=" + key + "][data-property="
            + value2.dictConfig.dependence + "]").bind("change",
            function () {
                var type = obj.prop("tagName");
                var pValue = [];
                //获取关联数据
                if (type == "SELECT") {
                    pValue = $(this).val();
                } else {
                    $(this).find(':checked').each(function () {
                        pValue.push($(this).val());
                    });
                }
                //生成子项
                model.MR.fillDictByZd(key, zdx, key2, obj, value2, model, pValue);
                $(obj).trigger("change");
                var value3 = model.initJson[model.className][value2.dictConfig.dependence];
                if (value3.changeFunc != "undefined" && value3.changeFunc != undefined) {
                    eval(value3.changeFunc + "(model)");
                }
            });
        //若dependence项有初值，触发依赖项的change事件，完成级联渲染
        var depobj = $("*[data-model=" + key + "][data-property=" + value2.dictConfig.dependence + "]");
        if ($(depobj).val() != null && $(depobj).val() != "") {
            $(depobj).trigger("change");
        }
    },
    //
    /*****************************************************************
     *  方法：核心方法，渲染字段
     *****************************************************************/
    renderProperty: function (t, model) {
        var jqueryS = $(t);
        var initJson = model.initJson;
        var tagName = jqueryS.prop("tagName");
        var modelname = jqueryS.attr("data-model");
        var pro = jqueryS.attr("data-property");
        var keyValue = model.get(pro);
        var value2 = initJson[model.className][pro];
        if (value2 == undefined) {
            console.log(model.get("ModelName") + "的" + pro + "属性配置不存在");
        }
        //先去除
        if (jqueryS.hasClass("hideElement")) {
            jqueryS.removeClass("hideElement");
        }
        if (value2.type == "layer") {
            if (value2.layerConfig.name) {
                $(t).val(keyValue);
                var flagClass = false;
                if ($(t).hasClass("disabled")) {
                    flagClass = true;
                }
                jqueryS.hide();
                t = $("<input class='i_text' layer-model='" + modelname + "' layer-property='" + value2.layerConfig.name + "' link-property='" + pro + "'>");
                if (flagClass) {
                    $(t).addClass("disabled");
                }
                jqueryS.parent().append(t);
                jqueryS = $(t);
                keyValue = model.get(value2.layerConfig.name);
            }
        }
        //清除挂载事件和readonly属性
        jqueryS.unbind(".ModelEvent");
        jqueryS.prop("readonly", false);
        //规则绑定
        //如果变量存在valueRules验证规则，则在DOM上添加相应事件
        if (value2.rules.checkValue && value2.rules.checkValue.length > 0) {
            var objselect = "$(\"*[data-model='" + modelname + "'][data-property='" + pro + "']\")" + ".get(0)";
            //对DOM添加事件
            //4-19 zhan修改keyup为blur，部分验证需要输入完成再验证
            jqueryS.bind("blur.ModelEvent", function () {
                jqueryS.removeClass("TextBoxErr").removeClass("ValueErrorTag");
                jqueryS.parent().find(".invalidtip").remove();
                for (var i = 0; i < value2.rules.checkValue.length; i++) {
                    if (value2.rules.checkValue[i] == "checkNumlength") {
                        var iLength = value2.numLength[0];
                        var fLength = value2.numLength[1];
                        if (!eval(value2.rules.checkValue[i] + "(" + objselect + "," + iLength + "," + fLength + ")")) {
                            jqueryS.val("");
                            jqueryS.addClass("ValueErrorTag");
                        }
                    } else {
                        if (!eval(value2.rules.checkValue[i] + "(" + objselect + ")")) {
                            jqueryS.val("");
                            jqueryS.addClass("ValueErrorTag");
                        }
                    }

                }
            });
        }
        //如果变量存在valueRules验证规则，则在DOM上添加相应事件
        if (value2.rules.checkKeyup && value2.rules.checkKeyup.length > 0) {
            var objselect = "$(\"*[data-model='" + modelname + "'][data-property='" + pro + "']\")" + ".get(0)";
            //对DOM添加事件
            //4-19 zhan修改keyup为blur，部分验证需要输入完成再验证
            jqueryS.bind("keyup.ModelEvent", function () {
                jqueryS.removeClass("TextBoxErr");
                jqueryS.parent().find(".invalidtip").remove();
                for (var i = 0; i < value2.rules.checkKeyup.length; i++) {
                    if (!eval(value2.rules.checkKeyup[i] + "(" + objselect + ")")) {
                        jqueryS.val("");
                    }
                }
            });
        }
        //禁止的控制
        if (value2.disabled) {
            jqueryS.attr("disabled", "disabled");
            jqueryS.addClass("disabled");
        }
        //可见、不可见的控制
        if (value2.display) {
            jqueryS.removeClass("hideElement");
        } else {
            jqueryS.addClass("hideElement");
        }

        //最大长度的控制
        if (value2.maxLength) {
            jqueryS.prop("maxlength", value2.maxLength);
            if (keyValue) {
                keyValue = keyValue.toString().substring(0, value2.maxLength);
                model.set(pro, keyValue);
            }
        } else {
            jqueryS.removeAttr("maxlength");
        }

        // //控件宽度设置
        // if (value2.width) {
        //     jqueryS.width(value2.width);
        // }

        //对于时间类型的操作
        if (value2.type == "date") {
            if (!jqueryS.hasClass("disabled")) {
                //渲染时间控件
                var $t = $('<div class="auto_ico_box ico_1"></div>');
                $t.append('<span class="date" title="日期"><i class="iconfont">&#xe604;</i></span>');
                jqueryS.parent().addClass("ele_1").append($t);

                if (!jqueryS.attr("id")) {
                    jqueryS.attr("id", pro);
                }
                var dataRex = "%y-%M-%d";
                var json = "";
                json = json + "dateFmt: '" + value2.dateConfig.dateFmt + "'";
                //根据日期格式赋值当前时间
                if (typeof(value2.dateConfig.defaultDate) != "undefined") {
                    if (value2.dateConfig.defaultDate) {
                        jqueryS.val(getNow(value2.dateConfig.dateFmt));
                        model.set(pro, jqueryS.val());
                    }
                }
                //获取日期格式长度的表达式
                dataRex = getDateRex(value2.dateConfig.dateFmt.length);
                //最大时间控制
                if (value2.dateConfig.maxDate) {
                    if (isDateTime(value2.dateConfig.maxDate)) {
                        json = json + " ,maxDate: '" + value2.dateConfig.maxDate + "'";
                    } else if (value2.dateConfig.maxDate == "sysdate") {
                        json = json + " ,maxDate: '" + dataRex + "'";
                    } else {
                        var tid = $.getEle(modelname, value2.dateConfig.maxDate).attr("id") || value2.dateConfig.maxDate;
                        json = json + " ,maxDate: \'#F{$dp.$D(\\'" + tid + "\\')}'";
                    }
                }
                //最小时间控制
                if (value2.dateConfig.minDate) {
                    if (isDateTime(value2.dateConfig.minDate)) {
                        json = json + " ,minDate: '" + value2.dateConfig.minDate + "'";
                    } else if (value2.dateConfig.minDate == "sysdate") {
                        json = json + " ,minDate: '" + dataRex + "'";
                    } else {
                        var tid = $.getEle(modelname, value2.dateConfig.minDate).attr("id") || value2.dateConfig.minDate;
                        json = json + " ,minDate: \'#F{$dp.$D(\\'" + tid + "\\')}'";
                    }
                }
                if (value2.dateConfig.startDate) {
                    json = json + " ,startDate: '" + value2.dateConfig.startDate + "'";
                }
                //聚焦到另一位置
                if (value2.dateConfig.focusPosit) {
                    json = json + " ,onpicked:function(){" +
                        value2.dateConfig.focusPosit + ".focus()" +
                        "}";
                }
                //日期改变
                if (value2.changeFunc) {
                    //改变
                    json = json + " ,onpicking:function(dp){" +
                        "return " + value2.changeFunc + "(dp)" +
                        "} ";
                    //清空
                    json = json + " ,oncleared:function(dp){" +
                        value2.changeFunc + "(dp)" +
                        "} ";

                }
                json = json + ",el:'" + jqueryS.attr("id") + "'";
                json = "{" + json + "}";
                jqueryS.unbind("focus.ModelEvent");

                jqueryS.bind("focus.ModelEvent", function () {
                    WdatePicker(eval('(' + json + ')'));
                });

                //选择事件绑定
                $t.parent().find(".date").bind("click.ModelEvent", function () {
                    WdatePicker(eval('(' + json + ')'));
                });
            }
        }
        //若控件为图片直接赋值给SRC属性
        if (value2.type == "img") {
            if (value2.imgConfig.imgSrc) {
                jqueryS.attr("src", value2.imgConfig.imgSrc);
            } else if (value2.imgConfig.imgGetFunc) {
                eval(value2.imgConfig.imgGetFunc + "(model)");
            }
        }
        //弹出控件渲染
        if (value2.type == "layer") {
            if (value2.layerConfig.canDelete) {
                if (!jqueryS.hasClass("disabled")) {
                    $t = $('<div class="auto_ico_box ico_2"></div>');
                    $t.append('<span class="popup" title="选择"><i class="iconfont">&#xe662;</i></span>');
                    $t.append('<span class="remove" title="删除"><i class="iconfont">&#xe606;</i></span>');
                    jqueryS.parent().addClass("ele_2").append($t);
                    //删除事件绑定
                    $t.find(".remove").click(function () {
                        jqueryS.val("");
                        //触发change事件
                        jqueryS.trigger("change");
                    });
                    //选择事件绑定
                    $t.find(".popup").click(function () {
                        jqueryS.click();
                    });
                }

            } else {
                if (!jqueryS.hasClass("disabled")&&!value2.display==false) {
                    var $t = $('<div class="auto_ico_box ico_1"></div>');
                    $t.append('<span class="popup" title="选择"><i class="iconfont">&#xe662;</i></span>');
                    jqueryS.parent().addClass("ele_1").append($t);
                    //选择事件绑定
                    $t.find(".popup").click(function () {
                        jqueryS.click();
                    });
                }
            }
            jqueryS.prop("readonly", true);
            jqueryS.unbind("click.ModelEvent");
            jqueryS.bind("click.ModelEvent", function () {
                var urldata = "";
                if (value2.layerConfig.checkFunc) {
                    var result = eval(value2.layerConfig.checkFunc + "(model)");
                    if (result !== undefined) {
                        if (result === false) {
                            return;
                        } else if (result === true) {

                        } else {
                            urldata = result;
                        }
                    }
                }
                _top.openStack(window, value2.layerConfig.title, value2.layerConfig.style, value2.layerConfig.url + "modelName=" + modelname + "&func=" + value2.layerConfig.callbackFunc + urldata);
            });
        }
        //附件控件渲染
        if (value2.type == "file") {
            if (typeof(value2.fileConfig) != "undefined") {
                if (jqueryS.next().hasClass("attachment_box")) {
                    jqueryS.next().unbind();
                    jqueryS.next().children().unbind();
                    jqueryS.next().empty();
                }
                if (value2.fileConfig.type != "image" && value2.fileConfig.type != "cysbImage") {
                    if (keyValue == null || $.trim(keyValue) == "") {
                        keyValue = forms.uuid(); //生成附件uuid
                        model.set(pro, keyValue);
                    }
                }
                jqueryS.val(keyValue);
                var zdx = null;
                var dictCode = null;
                var pcode = null;
                if (typeof(value2.fileConfig.dictCode) != "undefined") {//dictCode定义的条件下调用统一请求
                    pcode = value2.fileConfig.pcode;
                    zdx = JSON.stringify(model.MR.getZdDict(value2.fileConfig.dictCode, value2.fileConfig.pcode));
                    dictCode = value2.fileConfig.dictCode;
                }
                var fjState = "xz";
                if (jqueryS.hasClass("disabled")) {
                    fjState = "ck";
                }
                var view;
                if (value2.fileConfig.type == "list") {
                    view = new AttachmentListView({
                        uuid: keyValue,
                        state: fjState,
                        listName: value2.fileConfig.listName,
                        collection: new AttachmentCollection(),
                        el: jqueryS.next(),
                        element: jqueryS,
                        dictStr: zdx,
                        dictCode: dictCode,
                        pcode: pcode,
                        fileType: value2.fileConfig.fileType,
                        minNum: value2.fileConfig.minNum,
                        defaultType: value2.fileConfig.defaultType
                    });
                    //        }else if(value2.fileConfig.type == "div"){
                    //            view = new AttachmentDivView({
                    //                uuid:keyValue,
                    //                state:fjState,
                    //                uploadName:value2.fileConfig.uploadName,
                    //                collection:new AttachmentCollection(),
                    //                el:$(t).next(),
                    //                element:$(t),
                    //                fileType:value2.fileConfig.fileType,
                    //                minNum:value2.fileConfig.minNum,
                    //                defaultType:value2.fileConfig.defaultType,
                    //                showTag:value2.fileConfig.showTag
                    //            });
                }
                else if (value2.fileConfig.type == "table") {
                    view = new AttachmentTableView({
                        uuid: keyValue,
                        state: fjState,
                        listName: value2.fileConfig.listName,
                        collection: new AttachmentCollection(),
                        el: jqueryS.next(),
                        element: jqueryS,
                        fileType: value2.fileConfig.fileType,
                        minNum: value2.fileConfig.minNum,
                        defaultType: value2.fileConfig.defaultType
                    });
                }
                else if (value2.fileConfig.type == "single") {
                    view = new AttachmentSingleView({
                        uuid: keyValue,
                        state: fjState,
                        uploadName: value2.fileConfig.uploadName,
                        collection: new AttachmentCollection(),
                        el: $(t).next(),
                        element: $(t),
                        fileType: value2.fileConfig.fileType,
                        defaultType: value2.fileConfig.defaultType
                    });
                }
                // else if(value2.fileConfig.type == "image"){
                //            view = new ImageUploadView({
                //                zpid:keyValue,
                //                state:fjState,
                //                collection:new AttachmentCollection(),
                //                el:$(t).next(),
                //                element:$(t),
                //                ModelName:modelname,
                //                property:pro,
                //                fileType:value2.fileConfig.fileType
                //            });
                //        }else if(value2.fileConfig.type == "cysbImage"){
                //            view = new CysbUploadView({
                //                zpid:keyValue,
                //                state:fjState,
                //                collection:new AttachmentCollection(),
                //                el:$(t).next(),
                //                element:$(t),
                //                ModelName:modelname,
                //                property:pro,
                //                fileType:value2.fileConfig.fileType
                //            });

                else if (value2.fileConfig.type == "image") {
                    view = new ImageUploadView({
                        zpid: keyValue,
                        state: fjState,
                        collection: new AttachmentCollection(),
                        el: $(t).next(),
                        element: $(t),
                        ModelName: modelname,
                        property: pro,
                        fileType: value2.fileConfig.fileType
                    });
                }
                else if (value2.fileConfig.type == "html5") {
                    view = new AttachmentListViewHtml5({
                        uuid: keyValue,
                        state: fjState,
                        listName: value2.fileConfig.listName,
                        collection: new AttachmentCollection(),
                        el: jqueryS.next(),
                        element: jqueryS,
                        dictStr: zdx,
                        dictCode: dictCode,
                        pcode: pcode,
                        fileType: value2.fileConfig.fileType,
                        minNum: value2.fileConfig.minNum,
                        defaultType: value2.fileConfig.defaultType
                    });
                }
                // $(view.el).addClass("attachment_box");

                //挂载失焦去验证事件
                jqueryS.next().bind("click.ModelEvent", function () {
                    // jqueryS.removeClass("TextBoxErr");
                    //$(t).parent().find(".invalidtip").remove();
                })
            }
        }

        //挂载后置事件
        if (value2.changeFunc) {
            jqueryS.bind("change.ModelEvent", function () {
                eval(value2.changeFunc + "(model)");
            })
        }

        //值渲染
        if (tagName == "INPUT") {
            if (value2.type == "date") {    //若为日期控件，需将毫秒数转为日期格式
                if (keyValue != null && $.trim(keyValue.toString()) != "") {
                    if (!isDateTime(keyValue)) {
                        var datestr = new Date(keyValue).Format(value2.dateConfig.dateFmt);
                        jqueryS.val(datestr);
                        model.set(pro, datestr);
                    } else {
                        jqueryS.val(keyValue);
                    }
                } else {
                    if (!value2.dateConfig.defaultDate) {
                        jqueryS.val("");
                    }
                }
            }
            else {
                var type = jqueryS.prop("type");
                switch (type) {
                    case "text":
                        if (keyValue != null)
                            jqueryS.val(keyValue);
                        break;
                    case "hidden":
                        if (keyValue != null)
                            jqueryS.val(keyValue);
                        break;
                    case "checkbox":
                        var checkval = keyValue.toString().split(",");
                        for (var i = 0; i < checkval.length; i++) {
                            if (checkval[i] == jqueryS.attr("checkvalue")) {
                                jqueryS.prop("checked", true);
                            }
                        }
                        break;
                    case "radio":
                        if (keyValue != null)
                            jqueryS.prop("checked", keyValue == jqueryS.val());
                        jqueryS.click(function () {
                            $("*[data-model=" + model.get("ModelName") + "][data-property=" + pro + "]").parent().removeClass("TextBoxErr");
                        });
                        break;
                }
            }
            jqueryS.bind("keyup.ModelEvent", function () {
                jqueryS.prop("title", jqueryS.val());
            })
        }
        else if (tagName == "SELECT") {
            debugger
            //若为字典项，先获取字典项
            if (value2.type == "dict") {
                var zdx = null;
                if (value2.dictConfig.reqInterface) {//自定义获取字典项json接口
                    zdx = eval(value2.dictConfig.reqInterface + "(model)");
                    model.MR.fillDict(jqueryS, model.get("ModelName"), value2, model, zdx, pro);
                    setSelectVal(t, keyValue);
                } else if (value2.dictConfig.dictCode) {//dictCode定义的条件下调用统一请求
                    var zdx = model.MR.getZdDict(value2.dictConfig.dictCode, value2.dictConfig.pcode);
                    if (zdx != null) {
                        model.MR.fillDict(jqueryS, model.get("ModelName"), value2, model, zdx, pro);
                        setSelectVal(t, keyValue);
                    }
                }
                if (jqueryS.hasClass("select2-hidden-accessible")) {
                    if (jqueryS.next().hasClass("select2")) {
                        jqueryS.next().remove();
                    }
                }
                if (value2.dictConfig.ifSearch && !isIE6 && !isIE7) {
                    if (!jqueryS.hasClass("disabled") && !jqueryS.is(":hidden")) {
                        jqueryS.select2();
                    }
                }
            } else {
                if (keyValue != null)
                // setTimeout(function () {
                    try {
                        jqueryS.val(keyValue)
                    } catch (e) {

                    }
                // }, 1);
            }
        } else if (tagName == "LABEL" || tagName == "SPAN") {
            if (value2.type == "date") {
                if (keyValue != null && $.trim(keyValue.toString()) != "") {
                    if (!isDateTime(keyValue)) {
                        var datestr = new Date(keyValue).Format(value2.dateConfig.dateFmt);
                        jqueryS.text(datestr);
                        model.set(pro, datestr);
                    } else {
                        jqueryS.text(keyValue);
                    }
                } else {
                    if (!value2.dateConfig.defaultDate) {
                        jqueryS.val("");
                    }
                }
            } else if (keyValue != null) {
                jqueryS.text(keyValue);
            }
        } else if (tagName == "TEXTAREA") {
            jqueryS.val(keyValue);
        } else if (tagName == "DIV") {
            //若为字典项，先获取字典项
            if (value2.type == "dict") {
                var zdx = null;
                if (value2.dictConfig.reqInterface) {//自定义获取字典项json接口
                    zdx = eval(value2.dictConfig.reqInterface + "(model)");
                    model.MR.fillDict(jqueryS, model.get("ModelName"), value2, model, zdx, pro);
                    if (keyValue != null) {
                        var checkval = keyValue.toString().split(",");
                        for (var i = 0; i < checkval.length; i++) {
                            jqueryS.find('input[type=checkbox][value=' + checkval[i] + ']').each(function () {
                                $(this).attr("checked", "checked");
                            });
                            jqueryS.find('input[type=radio][value=' + checkval[i] + ']').each(function () {
                                $(this).attr("checked", "checked");
                            });
                        }
                    }
                } else if (value2.dictConfig.dictCode) {//dictCode定义的条件下调用统一请求
                    var zdx = model.MR.getZdDict(value2.dictConfig.dictCode, value2.dictConfig.pcode);
                    if (zdx != null) {
                        model.MR.fillDict(jqueryS, model.get("ModelName"), value2, model, zdx, pro);
                        if (keyValue != null) {
                            var checkval = keyValue.toString().split(",");
                            for (var i = 0; i < checkval.length; i++) {
                                jqueryS.find('input[type=checkbox][value=' + checkval[i] + ']').each(function () {
                                    $(this).attr("checked", "checked");
                                });
                                jqueryS.find('input[type=radio][value=' + checkval[i] + ']').each(function () {
                                    $(this).attr("checked", "checked");
                                });
                            }
                        }
                    }
                }
                if (jqueryS.hasClass("disabled")) {
                    jqueryS.find('input[type=checkbox]').each(function () {
                        $(this).prop("disabled", true);
                        $(this).addClass("disabled");
                    });
                    jqueryS.find('input[type=radio]').each(function () {
                        $(this).prop("disabled", true);
                        $(this).addClass("disabled");
                    });
                }
            }
        }

        //对控件默认值赋值
        //select会出错？？？？
        if (jqueryS.val() == null || jqueryS.val() == "") {
            if (value2.defaultValue) {
                model.set(pro, value2.defaultValue);
                jqueryS.val(value2.defaultValue);
            }
        }

        //挂载失焦去验证事件
        jqueryS.bind("focus.ModelEvent", function () {
            jqueryS.removeErrorTip();
            // jqueryS.removeErrorTip2();
            jqueryS.addClass("prompt");
        });

        jqueryS.bind("blur.ModelEvent", function () {
            jqueryS.removeClass("prompt");
            if (jqueryS.prop("tagName") == "INPUT") {
                jqueryS.prop("title", jqueryS.val());
            }
        });
        model.MR.disabledHandle(t, value2, keyValue);
    }
    ,
    setValue: function (property, value, ifSetDomTag, model) {
        model.set(property, value);
        if (ifSetDomTag) {
            $("*[data-model=" + model.get("ModelName") + "][data-property=" + property + "]").each(function (i, t) {
                var initJson = model.initJson;
                var tagName = $(t).prop("tagName");
                var modelname = $(t).attr("data-model");
                var pro = $(t).attr("data-property");
                var keyValue = model.get(pro);
                var value2 = initJson[model.className][pro];
                //值渲染
                if (tagName == "INPUT") {
                    var type = $(t).prop("type");
                    switch (type) {
                        case "text":
                            $(t).val(value);
                            break;
                        case "hidden":
                            $(t).val(value);
                            break;
                        case "checkbox":
                            var checkval = value.toString().split(",");
                            for (var i = 0; i < checkval.length; i++) {
                                if (checkval[i] == $(t).attr("checkvalue")) {
                                    $(t).prop("checked", true);
                                }
                            }
                            break;
                        case "radio":
                            $(t).prop("checked", value == $(t).val());
                            break;
                    }
                } else if (tagName == "SELECT") {
                    setSelectVal(t, keyValue);
                    if (value2.type == "dict" && value2.dictConfig && value2.dictConfig.ifSearch && !isIE6 && !isIE7) {
                        if ($(t).next().hasClass("select2")) {
                            $(t).select2();
                        }
                    }
                } else if (tagName == "LABEL" || tagName == "SPAN") {
                    $(t).text(value);
                } else if (tagName == "TEXTAREA") {
                    $(t).val(value);
                } else if (tagName == "DIV") {
                    //若为字典项，先获取字典项
                    if (value2.type == "dict") {
                        var checkval = value.toString().split(",");
                        for (var i = 0; i < checkval.length; i++) {
                            $(t).find('input[type=checkbox]').prop("checked", false)
                            $(t).find('input[type=checkbox][value=' + checkval[i] + ']').each(function () {
                                $(this).attr("checked", true);
                            });
                            $(t).find('input[type=radio]').prop("checked", false)
                            $(t).find('input[type=radio][value=' + checkval[i] + ']').each(function () {
                                $(this).attr("checked", true);
                            });
                        }
                    }
                }
            });
        }
    }
    ,
    parseOption: function (zdx, ifSelect) {
        var opstr = "<option ";
        for (okey in zdx) {
            if (okey == "code") {
                opstr += "value='" + zdx[okey] + "' ";
            } else if (okey != "value") {
                opstr += okey + "='" + zdx[okey] + "' ";
            }
        }
        opstr += (ifSelect ? "selected" : "") + ">" + zdx.value + "</option>";
        return opstr;
    }
};
