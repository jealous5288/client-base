/*****************************************************************
 * 动态意见面板
 * 最后更新时间：2016-12-09
 * 最后更新人：Zp
 *****************************************************************/
//创建附件model
var OpinionModel = Backbone.Model.extend({
    defaults: {
        ID:"",
        SPXNAME: "",
        OPINION:"",
        NPID:""
    },
    idAttribute:"ID"
});

var OpinionCollection = Backbone.Collection.extend({
    model: OpinionModel
});

//动态表单块
var OpinionView = Backbone.View.extend({
    tagName: 'table', //标签名，列表主体暂固定为table
    className: '',   //主体样式
    wiId:null,
    npId:null,
    spId:null,
    lookflg:false,
    initialize: function (option) {
        if(option.wiId){
            this.wiId = option.wiId;
        }
        if(option.npId){
            this.npId = option.npId;
        }
        if(option.spId){
            this.spId = option.spId;
        }
        if(option.lookflg){
            this.lookflg = option.lookflg;
        }
    },
    //事件
    events: {
    },
    //主渲染方法
    render: function(){
        var view = this;
        $(this.el).find("tbody").empty();
        //渲染collection
        if(view.wiId){
            $.ajax({
                type:"post",
                url:"/workflow/instance/getNodePageOpinion",
                data:{wiId:view.wiId,spId:view.spId},
                dataType:"json",
                success:function(ar){
                    if(ar.success){
                        view.collection.reset(ar.data);
                        if(view.collection != null && view.collection.models != null) {
                            $.each(view.collection.models, function (key, model) {
                                var rfunc = (view.npId == model.get("NPID") && view.lookflg) ? "renderEditMode" : "renderViewMode";
                                var sonview = new OpinionItemView({
                                    model:model,
                                    renderCallback:rfunc});
                                var viewel = sonview.render().el;
                                $(view.el).append(viewel);
                            })
                        }
                    }else{
                        layer.alert(ar.msg);
                    }
                }
            })
        }
    }
});

//创建动态子元素view
var OpinionItemView = Backbone.View.extend({
    tagName: 'tr',  //标签名，表单块个体创建为div,行个体创建为tr
    className: '',   //个体样式
    //初始化方法，主要用来设置初始状态
    initialize: function (option) {
        if(option.renderCallback){
            this.renderCallback = option.renderCallback;
        }
    },
    //查看模式渲染方法
    renderViewMode: function() {
        if(this.model.get('OPINION')){
            $(this.el).html("<th>" + this.model.get('SPXNAME') + "</th><td>" + "<textarea class='textarea disabled' readonly='readonly'>"+ this.model.get('OPINION') +"</textarea>" + "</td>");
        }
    },
    //编辑模式渲染方法
    renderEditMode: function() {
        $(this.el).html("<th><b>*</b>" + this.model.get('SPXNAME') + "</th><td>" + "<textarea class='textarea flowEditOpinion' npid='"+this.model.get("NPID")+"'></textarea>" + "</td>");
        $(this.el).find("textarea").bind("blur", function () {
            $(this).removeClass("TextBoxErr");
            $(this).parent().find(".invalidtip").remove();
        });
    },
    renderCallback: 'renderEditMode', //渲染回调标志
    //渲染主方法
    render:function() {
        this[this.renderCallback]();
        return this;
    },
    //事件
    events: {

    }
});
