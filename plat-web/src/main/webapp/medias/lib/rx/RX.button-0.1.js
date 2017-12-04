/*****************************************************************
 * RX.button-0.1
 * RX按钮组件
 * 最后更新时间：2017-09-22
 * 最后更新人：Zp
 *****************************************************************/

(function(global){
    //注册RX空间
    window.RX = window.RX || {};

    //组件池声明
    var widgetPool = {};

    //内部方法，执行配置回调
    function callFunction(obj,func){
        var result = true;
        if(typeof(func) == "function" && arguments.length >= 2){
            result = func.apply(obj, Array.prototype.slice.call(arguments,2));
        }
        if(typeof(result) != "boolean" || result != false){
            return true;
        }
        return false;
    }

    //Grid默认配置
    var defaults = {
        tag: "._rx_grid_control",
        tpl: null,
        param: {},
        title: null,
        buttons: [
            // {
            //     type: "add",
            //     tag: ".add",
            //     name: "新增",
            //     icon: null,
            //     beforeClick:null,
            //     onClick:null
            // }
        ],
        beforeInit: function(param){return true},
        onInit: function(param){}
    }

    //Button对象类构造声明
    var Button = function(){

    }

    //Button对象类属性声明
    Button.prototype = {

    }

    //ButtonGroup对象类构造声明
    var ButtonGroup = function ($obj, options) {
        //1、注册容器
        this.$obj = $obj;
        //2、注册参数
        this.options = options;
        //3、注册gridId：容器dom的Id，不在则为"_grid"+8位随机数
        this.id = $obj.attr("id");
        if(!this.id){
            this.id = "_button_group_" + Math.floor(Math.random()*100000000);
            $obj.attr("id",this.id);
        }
        //4、向组件池中注册
        widgetPool[this.id] = this;
        //5、布局初始化
        this.init();
    }

    //ButtonGroup对象类属性声明
    ButtonGroup.prototype = {
        $box:null,
        $obj:null,
        id:null,
        buttonPool:{},
        options:{},
        init: function(){
            debugger;
            var obj = this, $obj = obj.$obj, options = obj.options, param = options.param,
                buttons = options.buttons, buttonPool = obj.buttonPool;
            if(callFunction(obj,options.beforeInit,param)){
                $obj.empty();
                var $ul = $("<ul class='Actionbutton'></ul>");
                $obj.append($ul);
                if(buttons && buttons.length > 0) {
                    $.each(buttons, function(i,t){
                        var $li = $("<li><a>" + (t.name || "") + "</a></li>");
                        $ul.append($li);
                    })
                }
                callFunction(obj,options.onInit,param);
            }
        }
    }



    RX.button = {
        //ButtonGroup构建方法
        //参数：$obj （Jquery元素）button的dom容器， options （Json）构建参数
        //返回值：GridObj grid对象
        init: function($obj,options){
            if(!$obj){
                return null;
            }
            if(!options){
                options = {};
            }
            return new ButtonGroup($obj, $.extend(true, {}, defaults, options));
        },
        //ButtonGroup获取方法
        //参数：buttonGroupId （String）ButtonGroup的dom容器的id
        //返回值：ButtonGroup buttonGroup对象
        get: function(id){
                
        },
        //ButtonGroup销毁方法
        //参数：buttonGroupId （String）ButtonGroup的dom容器的id
        destroy: function(){

        }
    }
})(this);