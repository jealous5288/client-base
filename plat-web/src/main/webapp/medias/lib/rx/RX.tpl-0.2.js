/*****************************************************************
 * RX.tpl-0.2
 * RX前端模板引擎,基于underscore.template()
 * 最后更新时间：2017-09-14
 * 最后更新人：Zp
 *****************************************************************/

(function(global){
    //注册RX空间
    window.RX = window.RX || {};

    //注册模板池
    var tplPool = {};

    //（内部方法）模板编译方法
    //参数：str 模板字符串，tplName 模板名称
    //返回：Function 模板渲染方法
    function compileTpl(str,tplName){
        var tpl = null;
        try{
            debugger;
            tpl = tplPool[tplName] = _.template(str,null,null,tplName);
        }catch(e){
            tpl = "";
            if(console && console.error){
                console.error("RX: template compile error, \""+tplName+"\".");
            }else{
                throw e;
            }
        }
        return tpl;
    }

    //Dom模板加载方法
    //参数：tplName 模板名称
    //返回：Function 模板渲染方法
    RX.loadDomTpl = function(tplName){
        var doms = $("*[tplName="+tplName+"]");
        if(doms.length>0){
            var tdom = doms.eq(doms.length - 1);
            return compileTpl(tdom.html(),tplName);
        }
        return null;
    }

    //文件模板加载方法
    //参数：tplName 模板名称
    //返回：Function 模板渲染方法
    RX.loadFileTpl = function(tplName){
        var tpl = null;
        $.ajax({
            type: "post",
            url: "/template/getTemplate",
            async: false,
            data: {tplPath: tplName},
            success: function (ar) {
                tpl = compileTpl(ar[tplName],tplName);
            }
        });
        return tpl;
    }

    //模板渲染主方法
    //参数：tplName 模板名称， data 渲染数据
    //返回值：String 模板渲染html字符串
    RX.tpl = function(tplName, data){
        if(!tplName){
            return;
        }
        data = data || {};
        if(tplPool[tplName]){
            return tplPool[tplName](data);
        }else{
            var tpl = RX.loadDomTpl(tplName);
            if(tpl){
                return tpl(data);
            }else{
                tpl = RX.loadFileTpl(tplName);
                if(tpl){
                    return tpl(data);
                }
            }
            if(tpl !== null && console && console.error){
                console.error("RX: template is not exist, \""+tplName+"\".");
            }
            return "";
        }
    }

})(this);