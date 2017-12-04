function Router() {
    this.isSelect = false;

    this.clsName = "router";
    this.style = "";
    this.startShape;
    this.endShape;
    this.points = new Array();
    this.type = Router.LINE;
    this.flow;
    this._lineObj;
    this._arrowObj;
    this.property;

    /* 设置开始节点 */
    this.setStartShape = function (startShape) {
        this.startShape = startShape;
        startShape ? startShape.addToRouter(this) : "";
    }

    this.getStartShape = function () {
        return this.startShape;
    }

    /* 设置结束节点 */
    this.setEndShape = function (endShape) {
        if(endShape != null && endShape!= undefined){
            this.endShape = endShape;
            endShape.addFromRouter(this);
        }
    }

    this.getEndShape = function () {
        return this.endShape;
    }

    this.obj = function () {
        return this._lineObj;
    }

    this.domObj = function () {
        return $("#" + this.property.domid);
    }


    this.removeFromRouter = function () {
        this._removeRouter(true, false);
    }

    this.removeToRouter = function () {
        this._removeRouter(false, true);
    }

    this.removeRouter = function () {
        this._removeRouter(true, true);
    }

    this._removeRouter = function (removeFromRoute, removeToRoute) {
        var dom = this.domObj();
        dom.unbind('click');
        dom.unbind('dblclick');
        dom.unbind('contextmenu');

        this._lineObj.remove();
        this._lineObj = null;

        this._arrowObj.remove();
        this._arrowObj = null;

        this.points = [];

        if (removeFromRoute) {
            this.startShape ? this.startShape.removeToRouter(this) : "";
//            for(var i = 0 ; i < this.flow.property.routers.length ; i++)
//            {
//                if(this.flow.property.routers[i].domid == this.property.domid)
//                {
//                   this.flow.property.routers.logicRemove(i);
//                    break;
//                }
//            }
        }

        if (removeToRoute){
            this.endShape ? this.endShape.removeFromRouter(this) : "";
//            for(var i = 0 ; i < this.flow.property.routers.length ; i++)
//            {
//                if(this.flow.property.routers[i].domid == this.property.domid)
//                {
//                    this.flow.property.routers.logicRemove(i);
//                    break;
//                }
//            }
        }
    }


    /* 绘制一个路由 */
    this.drawRouter = function (panel) {
        this.flushPoints();
        //panel.canvas.append( Elements.getLineCode(this) );

        var arr = this.points && this.points[0] ? this.points[0].split(",") : [];
        var x1 = parseFloat(arr[0]);
        var y1 = parseFloat(arr[1]);

        arr =this.points && this.points[1]? this.points[1].split(","):[];
        var x2 = parseFloat(arr[0]);
        var y2 = parseFloat(arr[1]);

        arr = this.points && this.points[2] ? this.points[2].split(","):[];
        var xc = parseFloat(arr[0]);
        var yc = parseFloat(arr[1]);

        this._lineObj = panel.paper.path("M" + x1 + "," + y1 + " L" + x2 + "," + y2);
        ;
        this._lineObj.node.setAttribute("id", this.property.domid);
        this._lineObj.attr("cursor", "pointer");
        this._lineObj.attr("stroke-width", 2);
        this._lineObj.data("AttachObj", this);
        this._lineObj.toBack();

        this._arrowObj = panel.paper.path(getArrowPath(x1, y1, xc, yc, 8));
        this._arrowObj.toBack();

    }

    function getArrowPath(x1, y1, x2, y2, size) {
        var angle = Raphael.angle(x1, y1, x2, y2);
        var a45 = Raphael.rad(angle - 45);
        var a45m = Raphael.rad(angle + 45);
        var x2a = x2 + Math.cos(a45) * size;
        var y2a = y2 + Math.sin(a45) * size;
        var x2b = x2 + Math.cos(a45m) * size;
        var y2b = y2 + Math.sin(a45m) * size;

        return "M" + x1 + " " + y1 + " L" + x2 + " " + y2 + " L" + x2a + " " + y2a + " M" + x2 + " " + y2 + " L" + x2b + " " + y2b;
    }

    this.flush = function () {
        this.flushPoints();

        var arr = this.points[0].split(",");
        var x1 = parseFloat(arr[0]);
        var y1 = parseFloat(arr[1]);

        arr = this.points[1].split(",");
        var x2 = parseFloat(arr[0]);
        var y2 = parseFloat(arr[1]);

        arr = this.points[2].split(",");
        var xc = parseFloat(arr[0]);
        var yc = parseFloat(arr[1]);

        var s = 6;
        var angle = Math.atan2(x1 - xc, yc - y1);
        angle = angle * 180 / Math.PI + 90;

        this._arrowObj.attr({path:getArrowPath(x1, y1, xc, yc, 8)});

        this._lineObj.attr({path:"M" + this.points[0] + " L" + this.points[1]});
    }

    /* 根据开始节点和结束节点得到路由的三点坐标值 */
    this.flushPoints = function () {
        this.points.length = 0;

        var startShape = this.startShape;
        var endShape = this.endShape;
        if (startShape != null && endShape != null) {

            var startShapeObj = startShape ? startShape.obj() : null;
            var box1 = startShapeObj.getBBox();
            var startShapeWidth = box1.width;
            var startShapeHeight = box1.height;
            var startShapeX = startShape.property.x;
            var startShapeY = startShape.property.y;
            var endShapeObj =endShape? endShape.obj():null;
            var box2 = endShapeObj.getBBox();
            var endShapeWidth = box2.width;
            var endShapeHeight = box2.height;
            var endShapeX = endShape.property.x;
            var endShapeY = endShape.property.y;
            //var endShapeX = endShape.domObj().position().left;
            //var endShapeY = endShape.domObj().position().top;

            if (this.type == Router.POLYLINE) {
                var startCenterX = startShapeX + (startShapeWidth / 2);
                var startCenterY = startShapeY + (startShapeHeight / 2);

                var endCenterX = endShapeX + (endShapeWidth / 2);
                var endCenterY = endShapeY + (endShapeHeight / 2);

                var point1X = 0;
                var point1Y = 0;

                var point2X = startCenterX;
                var point2Y = endCenterY;

                var point3X = 0;
                var point3Y = 0;

                if (endCenterX > startCenterX) {
                    var absY = endCenterY >= startCenterY ? endCenterY - startCenterY : startCenterY - endCenterY;
                    if (parseInt(startShapeHeight / 2) >= absY) {
                        point1X = startShapeX + startShapeWidth;
                        point1Y = endCenterY;
                        point2X = point1X;
                        point2Y = point1Y;
                    }
                    else {
                        point1X = startCenterX;
                        point1Y = startCenterY < endCenterY ? startShapeY + startShapeHeight : startShapeY;
                    }
                    var absX = endCenterX - startCenterX;
                    if (parseInt(startShapeWidth / 2) >= absX) {
                        point3X = startCenterX;
                        point3Y = startCenterY < endCenterY ? endShapeY : endShapeY + endShapeHeight;
                        point2X = point3X;
                        point2Y = point3Y;
                    }
                    else {
                        point3X = endShapeX;
                        point3Y = endCenterY;
                    }
                }
                if (endCenterX < startCenterX) {
                    var absY = endCenterY >= startCenterY ? endCenterY - startCenterY : startCenterY - endCenterY;
                    if (parseInt(startShapeHeight / 2) >= absY) {
                        point1X = startShapeX;
                        point1Y = endCenterY;
                        point2X = point1X;
                        point2Y = point1Y;
                    }
                    else {
                        point1X = startCenterX;
                        point1Y = startCenterY < endCenterY ? startShapeY + startShapeHeight : startShapeY;
                    }
                    var absX = startCenterX - endCenterX;
                    if (parseInt(startShapeWidth / 2) >= absX) {
                        point3X = startCenterX;
                        point3Y = startCenterY < endCenterY ? endShapeY : endShapeY + endShapeHeight;
                        point2X = point3X;
                        point2Y = point3Y;
                    }
                    else {
                        point3X = endShapeX + endShapeWidth;
                        point3Y = endCenterY;
                    }
                }
                if (endCenterX == startCenterX) {
                    point1X = startCenterX;
                    point1Y = startCenterY > endCenterY ? startShapeY : startShapeY + startShapeHeight;
                    point3X = startCenterX;
                    point3Y = startCenterY > endCenterY ? endShapeY + endShapeHeight : endShapeY;
                    point2X = point3X;
                    point2Y = point3Y;
                }
                if (endCenterY == startCenterY) {
                    point1X = startCenterX > endCenterX ? startShapeX : startShapeX + startShapeWidth;
                    point1Y = startCenterY;
                    point3Y = startCenterY;
                    point3X = startCenterX > endCenterX ? endShapeX + endShapeWidth : endShapeX;
                    point2X = point3X;
                    point2Y = point3Y;
                }

                this.points.push(parseInt(point1X) + "," + parseInt(point1Y));
                this.points.push(parseInt(point2X) + "," + parseInt(point2Y));
                this.points.push(parseInt(point3X) + "," + parseInt(point3Y));
            }
            else if (this.type == Router.LINE) {
                var point1X = startShapeX + (startShapeWidth / 2);
                var point1Y = startShapeY + (startShapeHeight / 2);

                var point2X = endShapeX + (endShapeWidth / 2);
                var point2Y = endShapeY + (endShapeHeight / 2);

                var a = (point2Y - point1Y) / (point2X - point1X);
                var b = point1Y - a * point1X;



                var point3X, point3Y;
                var point4X, point4Y;
                var point5X, point5Y;

                if (Math.abs(point1X - point2X) >= Math.abs(point1Y - point2Y)) {
                    point3X = (point1X + point2X) / 2;
                    point3Y = a * point3X + b;

                    point4X = point1X + (point2X - point1X) / 4;
                    point4Y = a * point4X + b;

                    point5X = point1X + (point2X - point1X) * 3 / 4;
                    point5Y = a * point5X + b;
                }
                else {
                    point3Y = (point1Y + point2Y) / 2;
                    point3X = (point3Y - b) / a;

                    point4Y = point1Y + (point2Y - point1Y) / 4;
                    point4X = (point4Y - b) / a;

                    point5Y = point1Y + (point2Y - point1Y) * 3 / 4;
                    point5X = (point5Y - b) / a;
                }


                this.points.push(point1X + "," + point1Y);
                this.points.push(point2X + "," + point2Y);
                this.points.push(point3X + "," + point3Y);
                this.points.push(point4X + "," + point4Y);
                this.points.push(point5X + "," + point5Y);
            }

        }
    }


    this.dblclickEvent = function (event) {
        var jsOption = {
            title:"流向设置",
            autoOpen:false,
            modal:true,
            resizable:false,
            width:600,
            height:400
        }

        _top.showDialog('router', jsOption, "/workflow/designTools/router", this, true, window);
        event.stopPropagation();


    }

    this.contextmenuEvent = function (event) {
        var startNode = this.getStartShape();
        //判断是否为决策环节
        if (startNode.constructor == DecisionNode) {


            $("#cmRouter1").attr("disabled", false);

            $("#cmRouter1").hover(function () {
                $(this).addClass("om-menu-item-hover");
            }, function () {
                $(this).removeClass("om-menu-item-hover");
            })

            $("#cmRouter1 a span").css("color", "#000");
        }
        else {
            $("#cmRouter1").attr("disabled", true);
            $("#cmRouter1").hover(function () {
                $(this).removeClass("om-menu-item-hover");
            });
            $("#cmRouter1 a span").css("color", "#d6d6d6");
        }
        $("#menu_router").omMenu('show', event);
    }
}

//折线
Router.POLYLINE = 100;

//直线
Router.LINE = 102;

/* 创建一个路由 */
Router.create = function (flow, start, end, createId, id) {
    var router = new Router();
    router.setStartShape(start);
    router.setEndShape(end);
    router.flow = flow;

    var domid, rid;
    if (createId) {
        domid = "r" + (flow.newRouterID++).toString();
        rid = "";
    }
    else {
        domid = "r" + id.toString();
        rid = id;
    }

    router.property = routerProperty.create(flow.property, start.property, end.property, domid, rid);

    flow.addRouter(router);
    return router;
}

Router.create2 = function (flow, start, end, p) {
    var router = new Router();
    router.setStartShape(start);
    router.setEndShape(end);
    router.flow = flow;

    p.domid = "r" + p.id.toString();
    p.startNodeId = start?start.property.domid:"";
    p.endNodeId = end?end.property.domid:"";

    router.property = p;

    flow.addRouter(router);
    return router;
}