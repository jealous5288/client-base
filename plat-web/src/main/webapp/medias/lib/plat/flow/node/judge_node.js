function DecisionNode() {
    Shape.call(this);

    this.clsName = "shape diamond";

    this.backgroundColor = "#D2F3FF";

    this.borderColor = "#7B7B7B";

    this.dblclickEvent = function (event) {
        var jsOption = {
            title:"决策环节设置",
            autoOpen:false,
            modal:true,
            resizable:false,
            width:600,
            height:400

        }
        _top.showDialog('judge_node',jsOption,"/workflow/designTools/judge_node",this, true, window);
    }
}

DecisionNode.create = function (flow, x, y, createId, id) {
    var node = new DecisionNode();
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

    flow.addShape(node);
    return node;
}

DecisionNode.create2 = function (flow, x, y, p) {
    var node = new DecisionNode();
    node.flow = flow;

    p.domid = "n"+p.id.toString();

    node.property = p;

    flow.addShape(node);
    return node;
}
