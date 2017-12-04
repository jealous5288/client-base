/*****************************************************************
 * 重构表单detailModel
 * 最后更新时间：2016-09-12
 * 最后更新人：zp
 *****************************************************************/

//基础表单模型
var BaseGridModel = Backbone.Model.extend({
    searchView:null, //SearchView缓存
    /*****************************************************************
     *  方法：内部方法，backbone.model自带的初始化构造器
     *****************************************************************/
    initialize:function (setting) {
        this.set(setting);
    },
    defaults:{
        ModelName:"", //模型名称
        SearchModelName:"",   //搜索区model的ModelName
        columns:"", //表头
        searchJson:null, //搜索区配置json
        showSearch:true, //显示搜索按钮
        url:"", //表体
        postData:[],//参数
        tempPageSize:5, //数据缓冲区大小
        pagination:true, //是否分页
        fastPagenate:false,// 使用不返回记录总数的分页 默认为false
        ordinal:true, //是否有序号
        mulchose:false, //是否多选
        checkbox:false, //是否显示checkbox
        limit:10, //分页页码
        columnResize:false,  //列是否可拖动修改宽度
        allPageChose:true, //是否开启全页选择
        stretch:false,     //是否有详情
        dischose: false,    //是否开启禁用
        disObject:{},     //是否开启数据禁选
        selObject:{},
        newThead:null,    //自定义表头
        colSetting:[80,150,80,150,80,150] //列宽设置
    },
    /*****************************************************************
     *  方法：需实现接口，设置model名称
     *****************************************************************/
    editSearchJson:function(param){
        return param;
    },
    /*************************************************
     *  方法：外部接口，列表渲染接口
     ************************************************/
    render:function () {
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            var re=eval('/('+ 'random'+'=)([^&]*)/gi');
            //替换random，防止缓存。
            var o = {};
            //model.unset("ModelName");
            var attrs = model.attributes;
            for (var i in attrs) {
                if (model.attributes[i] != undefined) {
                    o[i] = model.attributes[i];
                }
            }
            o.url = model.get("url").replace(/\#/g,"%23")
                .replace(re,'random'+'='+Math.random());
            if(model.searchView){
                model.set("postData", model.searchView.getSearchJson(false) || []);
            }
            o.postData = model.get("postData");
            o.dischose = model.get("dischose");
            o.disObject = model.get("disObject");
            o.localData = model.get("localData");
            if(model.get("newThead") != null && model.get("newThead") != ""){
                o.newThead = model.get("newThead");
            }
            c.datagrid(o, !model.ruleValidate(true));
        });
    },
    /*************************************************
     *  方法：外部接口，创建搜索区
     ************************************************/
    buildSearchView:function(object){
        try{
            if(object){
                if(typeof(object) != "object"){
                    object = JSON.parse(object);
                }
            }
        }catch(e){}
        //获取搜索区model名称
        var listmodel = this, sName = listmodel.get("SearchModelName");
        if(!sName){
            if (window.console && window.console.log) {
                console.log("未设置搜索区ModelName");
            }
            return;
        }
        //获取搜索区div元素
        var sEl = $("*[data-model=" + sName + "]");
        if(sEl.length == 0){
            if (window.console && window.console.log) {
                console.log(sName+"找不到对应的搜索区");
            }
            return;
        }
        sEl = sEl.eq(0);
        //创建搜索区Model类
        var SModel =  DetailModel.extend({
            className:sName,
            initJson:listmodel.get("searchJson")
        });
        //创建搜索区view并注册进GridModel缓存
        listmodel.searchView = new SearchView({
            model: new SModel(object),
            el: sEl,
            showSearch: listmodel.get("showSearch"),
            gridModel: listmodel,
            //colHtml:listmodel.getColHtml(), //列宽设置
            colSetting : listmodel.get("colSetting"),
            cols:listmodel.get("colSetting").length
        });
        //渲染搜索区view
        listmodel.searchView.render();
        //$('select').selectOrDie();
    },
    hideSearchView: function(){
        var listmodel = this, sName = listmodel.get("SearchModelName");
        if(!sName){
            return;
        }
        var sEl = $("*[data-model=" + sName + "]");
        if(sEl.length == 0){
            return;
        }else{
            sEl.hide();
        }
    },
    showSearchView: function(){
        var listmodel = this, sName = listmodel.get("SearchModelName");
        if(!sName){
            return;
        }
        var sEl = $("*[data-model=" + sName + "]");
        if(sEl.length == 0){
            return;
        }else{
            sEl.show();
        }
    },
    /************************************************************************
     *  方法：内部适配接口，将model自带的colSetting转为SearchView识别的colHtml
     ***********************************************************************/
    getColHtml:function(){
        var colSetting = this.get("colSetting");
        var colHtml = "";
        for(var i = 0; i < colSetting.length; i++){
            if(colSetting[i] > 0){
                colHtml += "<col width='"+colSetting[i]+"px'/>";
            }
        }
        return colHtml;
    },
    /*************************************************
     *  方法：外部接口，获取搜索区数据model
     ************************************************/
    getSearchModel:function(){
        return this.searchView && this.searchView.model;
    },
    /*************************************************
     *  方法：外部接口，使用参数刷新列表
     *  参数：param，获取搜索区数据Json
     ************************************************/
    reloadGrid: function (param) {
        if(this.searchView){
            this.set("postData",this.searchView.getSearchJson(true));
        }
        param = this.editSearchJson(param);
        if(param){
            this.set("postData",param);
        }

        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            var re=eval('/('+ 'random'+'=)([^&]*)/gi');
            //替换random，防止缓存。
            c.datagrid('options').columns = model.get("columns");
            c.datagrid('options').url = model.get("url").replace(/\#/g,"%23")
                .replace(re,'random'+'='+Math.random());
            c.datagrid('options').postData = model.get("postData");
            c.datagrid('options').dischose = model.get("dischose");
            c.datagrid('options').disObject = model.get("disObject");
            c.datagrid('options').localData = model.get("localData");
            c.datagrid('options').startPage = 1;
            c.datagrid('freshTempPool');
            c.datagrid('reload',!model.ruleValidate());
        });
    },
    /*************************************************
     *  方法：外部接口，获取列表控件配置
     *  参数：param，获取搜索区数据Json
     ************************************************/
    getOptions:function () {
        var model = this;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            return c.datagrid("options");
        });
    },
    /*************************************************
     *  方法：外部接口，获取列表所选项
     *  参数：param，获取搜索区数据Json
     *       checkTag 获取被选择/未被选择的标志， 当checkTag为false返回当页未被选择的数据（不支持分页）
     ************************************************/
    getSelect: function (checkTag) {
        if(typeof(checkTag) == "undefined" || checkTag === null){
            checkTag = true;
        }
        var model = this;
        var selected;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            selected = c.datagrid('getSelected',checkTag);
        });
        return selected;
    },
    /*************************************************
     *  方法：外部接口，获取所有数据
     *  参数：param，获取搜索区数据Json
     ************************************************/
    getAllData: function () {
        var model = this;
        var selected;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            selected = c.datagrid('getAllData');
        });
        return selected;
    },
    /*************************************************
     *  方法：外部接口，设置所选项
     *  参数：arr，应选主键数组
     ************************************************/
    setSelect:function(arr){
        var model = this;
        var selected;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            selected = c.datagrid('setSelected',arr);
        });
    },
    /*************************************************
     *  方法：外部接口，判断是否获取到了数据
     ************************************************/
    hasGetedData:function(){
        var model = this;
        var isSuccess;
        $("*[data-model=" + model.get("ModelName") + "]").each(function (i, t) {
            var c = $(t);
            isSuccess = c.datagrid('hasGetedData');
        });
        return isSuccess;
    },
    ruleValidate: function(noTip) {
        var model = this.getSearchModel();
        var result = true;
        if(model){
            $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
                if(!$(t).parent().eq(0).hasClass("hideElement") && !$(t).hasClass("disabled")) {
                    if(window.removeErrorTip){
                        $(t).removeErrorTip();
                        $(t).removeErrorTip2();
                    }
                }
            });
            $("*[data-model=" + model.get("ModelName") + "][data-property]").each(function (i, t) {
                var tresult = model.MR.variableProperty(t,noTip,model);
                result = (result ? tresult : false);
            });
        }
        return result;
    }
});
