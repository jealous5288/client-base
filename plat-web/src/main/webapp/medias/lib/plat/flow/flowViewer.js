function FlowViewer(canvas) {
    //当前绘制的画布元素
    this.canvas = canvas;

    //绘图工具
    this.paper = new Raphael(canvas.attr("id"), canvas.width(), canvas.height());

    //当前画布上的元素
    this.flow = null;


    /* 绘制当前画板中的流程 */
    this.drawFlow = function () {
        var maxHeight = 0;
        var shapes = this.flow.shapes;
        //绘制流程节点
        var maxWidth = 0;
        for (var i = 0; i < shapes.length; i++) {
            var curShape = shapes[i];
            curShape.drawShape(this);
            this.setShapeEvent(curShape);

            if (curShape.property.y > maxHeight)
                maxHeight = curShape.property.y;
            if (curShape.property.x > maxWidth)
                maxWidth = curShape.property.x;
        }

        this.resizeCanvas(maxHeight, maxWidth);

        var routers = this.flow.routers;
        //绘制流程路由
        for (var i = 0; i < routers.length; i++) {
            routers[i].drawRouter(this);
        }
    }

    this.resizeCanvas = function (newHeight, newWidth) {
        var height = panel.canvas.height();
        if (newHeight + 100 > height) {
            if (newHeight > height) height = newHeight;
            //增加画布的高度
            height += 50;
            panel.canvas.height(height)
            panel.paper.setSize(panel.canvas.width(), height);
        }
        if (newWidth) {
            var width = panel.canvas.width();
            if (newWidth + 100 > width) {
                if (newWidth > width)
                    width = newWidth;
                width += 100;
                panel.canvas.width(width)
                panel.paper.setSize(width, panel.canvas.height());
            }
        }

    }

    /* 设置每个节点的事件 */
    this.setShapeEvent = function (shape) {
        var dom = shape.domObj();
        dom.bind('click', {panel:this}, this.clickShapeEvent);

        var robj = shape.obj();
        robj.data("panel", this);

        var rtext = robj.data("enclosedText");

        var textDom = $(rtext.node);
        textDom.bind('click', {panel:this, obj:dom, shape:shape}, this.clickTextEvent);
    }


    /* 点击节点所执行的事件 */
    this.clickShapeEvent = function (event) {
        var panel = event.data.panel;
        var shape = panel.flow.findShapeById($(this).attr("id"));
        if (typeof nodeClick == 'function') {
            try {
                nodeClick(shape.property);
            } catch (e) {

            }
        }
        event.stopPropagation();
    }

    this.clickTextEvent = function (event) {
        var panel = event.data.panel;
        var obj = event.data.obj;
        try {
            obj.trigger("click", panel);
        } catch (e) {

        }
        event.stopPropagation();
    }


}

