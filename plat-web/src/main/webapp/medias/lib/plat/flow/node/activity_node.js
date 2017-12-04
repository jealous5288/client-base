function ActivityNode() {
    Rect.call(this);

    this.clsName = "shape rect activity";

    this.backgroundColor = "#D2F3FF";

    this.borderColor = "#7B7B7B";

    this.dblclickEvent = function (event) {
        var jsOption = {
            title:"活动环节设置",
            autoOpen:false,
            modal:true,
            resizable:false,
            width:800,
            height:545
        }
        _top.showDialog('activity_node', jsOption, "/workflow/designTools/activity_node", this, true, window);
    }
}


ActivityNode.create = function (flow, x, y, createId, id) {
    var node = new ActivityNode();
    node.flow = flow;

    var domid, nid;
    if (createId) {
        domid = "n" + (flow.newShapeID++).toString();
        nid = "";
    }
    else {
        domid = "n" + id.toString();
        nid = id;
    }
    node.property = nodeProperty.create(node, x, y, domid, nid);
    //遍历flow中的节点，查看最大的sort
    node.property.nodeSort = findFlowMaxSort(flow) + 1;
    flow.addShape(node);
    return node;
};

//查找最大的sort
function findFlowMaxSort(flow){
    var shapes = flow.shapes;
    var maxSort = 0;
    for(var i=0,maxLength = shapes.length;i<maxLength;i++){
        if(shapes[i].constructor == ActivityNode){
            var shapePro = shapes[i].property;
            if(shapePro.sfyx_st == "VALID" && shapePro.nodeSort > maxSort){
                maxSort = shapePro.nodeSort;
            }
        }
    }
    return maxSort;
}

ActivityNode.create2 = function (flow, x, y, p) {
    var node = new ActivityNode();
    node.flow = flow;

    p.domid = "n" + p.id.toString();

    node.property = p;

    flow.addShape(node);
    return node;
}

