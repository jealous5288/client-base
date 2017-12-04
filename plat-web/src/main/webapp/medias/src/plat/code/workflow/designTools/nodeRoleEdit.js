//创建子model角色要素对象
var ModelRoleElement = DetailModel.extend({
    className:"ModelRoleElement",
    initJson:modelNodeRoleJson,
    stateJson:ckStateJson,
    setModelName:function () {
        this.set("ModelName", "ModelRoleElement"+(++modelIndex));
    }
});
//创建启用组织列表
var InOrganCollection = Backbone.Collection.extend({
    model: ModelRoleElement
});
//创建禁用组织列表
var OutOrganCollection = Backbone.Collection.extend({
    model: ModelRoleElement
});
//创建启用岗位列表
var InPostCollection = Backbone.Collection.extend({
    model: ModelRoleElement
});
//创建禁用岗位列表
var OutPostCollection = Backbone.Collection.extend({
    model: ModelRoleElement
});
//创建启用用户列表
var InUserCollection = Backbone.Collection.extend({
    model: ModelRoleElement
});
//创建禁用用户列表
var OutUserCollection = Backbone.Collection.extend({
    model: ModelRoleElement
});
//创建主model活动环节对象
var ModelNodeRole = DetailModel.extend({
    className:"ModelNodeRole",
    initJson:modelNodeRoleJson,
    stateJson:ckStateJson,
    setModelName:function () {
        this.set("ModelName", "ModelNodeRole"+(++modelIndex));
    },
    relations:[
        {
            type: Backbone.HasMany,
            key:'inOrganList',
            relatedModel: ModelRoleElement,
            collectionType: InOrganCollection
        },{
            type: Backbone.HasMany,
            key:'outOrganList',
            relatedModel: ModelRoleElement,
            collectionType: OutOrganCollection
        },{
            type: Backbone.HasMany,
            key:'inPostList',
            relatedModel: ModelRoleElement,
            collectionType: InPostCollection
        },{
            type: Backbone.HasMany,
            key:'outPostList',
            relatedModel: ModelRoleElement,
            collectionType: OutPostCollection
        },{
            type: Backbone.HasMany,
            key:'inUserList',
            relatedModel: ModelRoleElement,
            collectionType: InUserCollection
        },{
            type: Backbone.HasMany,
            key:'outUserList',
            relatedModel: ModelRoleElement,
            collectionType: OutUserCollection
        }]
});
//创建动态列表view类
var ElementTableView = Backbone.View.extend({
    tagName: 'table', //标签名，列表主体暂固定为table
    className: '',   //主体样式
    tableElement:null,  //列表jq元素
    index:0,    //序号迭代器
    //主渲染方法
    render: function(type,title){
        var view = this;
        this.index = 0;
        $(this.el).empty();
        //渲染控制区域，放入table的caption中
        var x = $(this.el)[0].createCaption();
        if(this.collection && this.collection.models){
            title += "("+this.collection.models.length+")";
        }else{
            title += "(0)";
        }
        x.innerHTML = "<div class='eleListTitle'>"+title+"</div>";
        //渲染table的thead部分
        $(this.el).append("<th width='20%'><th width='20%'></th><th width='20%'></th><th width='20%'></th><th width='20%'></th>");
        //渲染collection
        var elementStr = "<tr>";
        if(this.collection != null && this.collection.models != null) {
            if(this.collection.models.length > 0) {
                $.each(this.collection.models, function (key, model) {
                    if (model.get("sfyx_st") != "UNVALID") {
                        elementStr += "<td>";
                        if (type == "inOrgan") {
                            elementStr += "<img class='elementSrc' align='absmiddle' src='"+RX.handlePath("/medias/images/baseModel/role/inOrgan.png")+"'>";
                        } else if (type == "outOrgan") {
                            elementStr += "<img class='elementSrc' align='absmiddle' src='"+RX.handlePath("/medias/images/baseModel/role/outOrgan.png")+"'>";
                        } else if (type == "inPost") {
                            elementStr += "<img class='elementSrc' align='absmiddle' src='"+RX.handlePath("/medias/images/baseModel/role/inPost.png")+"'>";
                        } else if (type == "outPost") {
                            elementStr += "<img class='elementSrc' align='absmiddle' src='"+RX.handlePath("/medias/images/baseModel/role/outPost.png")+"'>";
                        } else if (type == "inUser") {
                            elementStr += "<img class='elementSrc' align='absmiddle' src='"+RX.handlePath("/medias/images/baseModel/role/inUser.png")+"'>";
                        } else if (type == "outUser") {
                            elementStr += "<img class='elementSrc' align='absmiddle' src='"+RX.handlePath("/medias/images/baseModel/role/outUser.png")+"'>";
                        }
                        elementStr += "&nbsp;&nbsp;" + model.get("name");
                        elementStr += "</td>";
                        view.index++;
                        if (view.index % 5 == 0) {
                            elementStr += "</tr><tr>";
                        }
                    }
                })
            }else{
                elementStr += "</tr>";
            }
        }
        elementStr += "</tr>";
        $(this.el).append(elementStr);
    }
});

//创建组织要素列表视图
function buildRoleElementView(type,title,data,obj){
    var view = new ElementTableView({
        collection:data,
        el: obj
    });
    view.render(type,title);
}
