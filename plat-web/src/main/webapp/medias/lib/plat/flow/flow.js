function Flow() {
    this.shapes = new Array();

    this.routers = new Array();

    this.property;

    this.deleteRouterDoms = new Array();

    this.newShapeID = 1;

    this.newRouterID = 1;

    this.restoreFlow = function (property, fromlocal) {
        var obj;

        if (!fromlocal)
            this.property = property;
        else
            this.property = new workflowProperty();

        var nodeType = ["StartNode", "EndNode", "ActivityNode","CirculationNode","DecisionNode", "ClusterNode","ArchiveNode", "FreeNode",  "ComputeNode"];

        var idx, maxIdx = 0;
        var count = property.nodes.length;
        for (var i = 0; i < count; i++) {
            obj = eval(nodeType[property.nodes[i].type]);

            if (property.nodes[i].domid.length > 0)
                idx = parseInt(property.nodes[i].domid.substr(1));
            else
                idx = parseInt(property.nodes[i].id);
            var node = 0;
            if (!fromlocal) {
                node = obj.create2(this, property.nodes[i].x, property.nodes[i].y, property.nodes[i]);
                if (node && node.property && node.property.status != undefined) {
                    node.status = node.property.status;
                }
            }
            else
                node = obj.create(this, property.nodes[i].x, property.nodes[i].y, false, idx);
            if (idx > maxIdx) maxIdx = idx;
        }
        this.newShapeID = maxIdx + 1;

        maxIdx = 0;
        var startNode, endNode;
        count = property.routers.length;
        for (var i = 0; i < count; i++) {
            if (property.routers[i].startNodeId.toString().charAt(0) == "n")
                startNode = this.findShapeById(property.routers[i].startNodeId);
            else
                startNode = this.findShapeById("n" + property.routers[i].startNodeId);

            if (property.routers[i].endNodeId.toString().charAt(0) == "n")
                endNode = this.findShapeById(property.routers[i].endNodeId);
            else
                endNode = this.findShapeById("n" + property.routers[i].endNodeId);

            obj = eval("Router");

            if (property.routers[i].domid.length > 0)
                idx = parseInt(property.routers[i].domid.substr(1));
            else
                idx = parseInt(property.routers[i].id);

            if (!fromlocal)
                obj.create2(this, startNode, endNode, property.routers[i]);
            else
                obj.create(this, startNode, endNode, false, idx);

            if (idx > maxIdx) maxIdx = idx;
        }
        this.newRouterID = maxIdx + 1;


    }

    this.destroy = function () {
        var count = this.routers.length;
        for (var i = count - 1; i >= 0; i--) {
            this.removeRoute(this.routers[i]);
        }

        count = this.shapes.length;
        for (var i = count - 1; i >= 0; i--) {
            this.removeNode(this.shapes[i]);
        }
    }

    /* 为流程增加一个节点 */
    this.addShape = function (shape) {
        this.shapes.push(shape);
        return this;
    }


    /* 为流程增加一个路由 */
    this.addRouter = function (router) {
        this.routers.push(router);
        return this;
    }

    this.removeRoute = function (route) {
        this.deleteRouterDoms.push(route.property.domid);
        if (route != null) {
            route.removeRouter();

            var idx = this.findIndexByRoute(route);
            if (idx > -1) {
                this.routers.logicRemove(idx);
                this.property.removeRouter(route.property.domid);
            }

        }
    }

    this.removeNode = function (shape) {
        if (shape != null) {
            var idx;
            var fromRouters = shape.fromRouters;
            var toRouters = shape.toRouters;

            if (fromRouters != null) {
                for (var i = 0; i < fromRouters.length; i++) {
                    var fromRouter = fromRouters[i];

                    fromRouter.removeFromRouter();

                    idx = this.findIndexByRoute(fromRouter);
                    if (idx > -1) {
                        this.routers.remove(idx);
                        this.property.removeRouter(fromRouter.property.domid);
                    }
                }
            }

            if (toRouters != null) {
                for (var i = 0; i < toRouters.length; i++) {
                    var toRouter = toRouters[i];

                    toRouter.removeToRouter();

                    idx = this.findIndexByRoute(toRouter);
                    if (idx > -1) {
                        this.routers.remove(idx);
                        this.property.removeRouter(toRouter.property.domid);
                    }
                }
            }

            shape.removeShape();
            ;

            idx = this.findIndexByShape(shape);
            if (idx > -1) {
                this.shapes.remove(idx);
                this.property.removeNode(idx);
            }

        }
    }


    /* 根据节点id得到节点 */
    this.findShapeById = function (id) {
        for (var i = 0; i < this.shapes.length; i++) {
            if (this.shapes[i].property.domid == id) {
                return this.shapes[i];
            }
        }
        return null;
    }

    this.findIndexByShape = function (shape) {
        for (var i = 0; i < this.shapes.length; i++) {
            if (this.shapes[i].property.domid == shape.property.domid) {
                return i;
            }
        }
        return -1;
    }

    /* 根据路由id得到路由 */
    this.findRouterById = function (id) {
        for (var i = 0; i < this.routers.length; i++) {
            if (this.routers[i].property.domid == id) {
                return this.routers[i];
            }
        }
        return null;
    }

    this.findIndexByRoute = function (route) {
        for (var i = 0; i < this.routers.length; i++) {
            if (this.routers[i].property.domid == route.property.domid) {
                return i;
            }
        }
        return -1;
    }

    this.verify = function () {
        if (this.property.status.toUpperCase() != "DISABLE") {
            alert("流程处于运行状态，不能保存。");
            return false;
        }

        if (this.shapes.length == 0) {
            alert("缺少环节。");
            return false;
        }

        var startNodeCount = 0, endNodeCount = 0;
        for (var i = 0; i < this.shapes.length; i++) {
            if (this.shapes[i].constructor == StartNode) {
                startNodeCount++;
                if (this.shapes[i].toRouters.length == 0) {
                    alert("\"开始环节\"之后缺少环节。");
                    return false;
                }
            }
            else if (this.shapes[i].constructor == EndNode) {
                endNodeCount++;
                if (this.shapes[i].fromRouters.length == 0) {
                    alert("\"结束环节\"之前缺少环节。");
                    return false;
                }
            }
            else if (this.shapes[i].constructor == DecisionNode) {
                if (this.shapes[i].toRouters.length < 2) {
                    alert("\"" + this.shapes[i].text + "\"之后缺少流向。");
                    return false;
                }
            }
            else {
                if (this.shapes[i].fromRouters.length == 0) {
                    alert("\"" + this.shapes[i].text + "\"之前缺少环节。");
                    return false;
                }
                if (this.shapes[i].toRouters.length == 0) {
                    alert("\"" + this.shapes[i].text + "\"之后缺少环节。");
                    return false;
                }
            }
        }

        if (startNodeCount == 0) {
            alert("缺少\"开始环节\"。");
            return false;
        }
        if (endNodeCount == 0) {
            alert("缺少\"结束环节\"。");
            return false;
        }


        return true;
    }


    this.dblclickEvent = function (event) {

        var jsOption = {
            title:"流程设置",
            autoOpen:false,
            modal:true,
            resizable:false,
            width:750,
            height:560
        }


        _top.showDialog('flowsetting', jsOption, "/workflow/designTools/flowProperty", event.data.panel.flow.property, true, window);

    }
	
	this.dblclickEventTest = function () {
        var jsOption = {
            title:"流程设置",
            autoOpen:false,
            modal:true,
            resizable:false,
            width:750,
            height:560
        }

        //modify by zl   test lazyload
       top.showDialog('flowsetting', jsOption, "flowPropertyTest", this.property, true, window);
        //end modify
	}

    this.contextmenuEvent = function (event) {
        $("#menu_flow").omMenu('show', event);
    }


}

Array.prototype.remove = function (index) {
    if (isNaN(index) || index > this.length) {
        return false;
    }
    this.splice(index, 1);
}

Array.prototype.logicRemove = function (index) {
    if (isNaN(index) || index > this.length) {
        return false;
    }
    if(!this[index].id || this[index].id == "null"){
        this.splice(index, 1);
    }else{
        this[index].sfyx_st = "UNVALID";
    }
}