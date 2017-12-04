var pdictCode = GetQueryString("pdictCode");
var pdictIsEmpty = GetQueryString("pdictIsEmpty");
$(function () {
    if (!pdictCode || pdictIsEmpty == 1) {
        $("#pcode").empty().html("<input type='text' class='i_text' data-model='ModelSubDict' data-property='pcode'/>");
        ModelSubDictJson.ModelSubDict.pcode = {maxLength: 20};
    }
    var modelName = GetQueryString("modelName");
    var editSubDict = GetQueryString("editFunc");
    var getSubDict = GetQueryString("getFunc");
    pageAjax();
    //初始化尺寸
    resizeForm();
    var ModelSubDict = DetailModel.extend({
        className: "ModelSubDict",
        initJson: ModelSubDictJson
    });

    //获取初值
    var subDict = {};   //供初始化的数据对象
    if (modelName) {
        var evalFunc = eval("getPrevWin()." + getSubDict);
        var subDictJson = evalFunc(modelName);
        subDict = eval("(" + subDictJson + ")");
    }
    var modelSubDict = new ModelSubDict(subDict);
    modelSubDict.render();

    $("#confirm").click(function () {
        var result;
        if (modelSubDict.ruleValidate()) {
            var evalFunc = eval("getPrevWin()." + editSubDict);
            result = evalFunc(modelName, modelSubDict.getJson());
            if (result == "2") {
                layer.alert("字典项编码已存在");
            } else if (result == "3") {
                layer.alert("字典项值已存在");
            } else if (result == "4") {
                layer.alert("字典项序号已存在");
            } else {
                closeWin();
            }
        }
    });
});

function getParentDict() {
    if (pdictCode && pdictIsEmpty == 0) {
        return JsCache(pdictCode, null);
    } else {
        console.log("没有上级字典，或上级字典为空");
    }
}
