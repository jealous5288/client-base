function Shape()
{
	this.isSelect = false;

	this.clsName = "shape";
	this.style = "";

	this.fromRouters = new Array();
	this.toRouters = new Array();

	this.flow;
	this.backgroundColor;
	this.borderColor;
	this._obj;
	this.property;
	this.status=1;

	/* 增加进入路由 */
	this.addFromRouter = function(fromRouter)
	{
		this.fromRouters.push(fromRouter);
		return this;
	}
	
	this.removeFromRouter = function(fromRouter)
	{
		var idx=this.findIndexByFromRouter(fromRouter);
		if(idx>-1)
			this.fromRouters.logicRemove(idx);
	}

	/* 增加指向路由 */
	this.addToRouter = function(toRouter)
	{
		this.toRouters.push(toRouter);
		return this;
	}

	this.removeToRouter = function(toRouter)
	{
		var idx=this.findIndexByToRouter(toRouter);
		if(idx>-1)
			this.toRouters.logicRemove(idx);
	}

	this.findIndexByFromRouter = function(fromRouter)
	{
		for(var i = 0 ; i < this.fromRouters.length ; i++)
		{
			if(this.fromRouters[i].property.domid == fromRouter.property.domid)
			{
				return i;
			}
		}
		return -1;
	}

	this.findIndexByToRouter = function(toRouter)
	{
		for(var i = 0 ; i < this.toRouters.length ; i++)
		{
			if(this.toRouters[i].property.domid == toRouter.property.domid)
			{
				return i;
			}
		}
		return -1;
	}

	this.obj = function()
	{
		return this._obj;
	}

	this.domObj = function()
	{
		return $("#"+this.property.domid);
	}

	this.equals = function(shape)
	{
		return this.property.domid == shape.property.domid;
	}
	
	this.drawShape = function(panel)
	{
		//panel.canvas.append( Elements.getShapeCode(this,panel) );
		this._obj=Elements.getShapeCode(this,panel);
		//this.fromRouters=[];
		//this.toRouters=[];
	}

	this.removeShape= function()
	{
		var text=this._obj.data("enclosedText");
		if(text!=null)
		{
			text.undrag(Panel.moveText, Panel.dragText, Panel.upText); 

			var textDom=$(text.node);
			textDom.unbind('click');
			textDom.unbind('dblclick');
			textDom.unbind('contextmenu');

			text.remove();
		}

		var l=this._obj.data("extraLine");
		if(l!=null)
		{
			l.remove();
		}

		this._obj.undrag(Panel.moveShape, Panel.dragShape, Panel.upShape);
		
		var dom=this.domObj();
		dom.unbind('click');
		dom.unbind('dblclick');
		dom.unbind('contextmenu');

		this._obj.remove();
		this._obj=null;

		this.fromRouters=[];
		this.toRouters=[];
	}

	this.dblclickEvent = function(){};
		
	this.contextmenuEvent = function(event)
	{
		$("#menu_node").omMenu('show',event);
	}

	this.textWrap = function(t, width, newText) 
	{
		var abc = "测试";
		t.attr({"text": abc});
		var letterWidth = t.getBBox().width / abc.length;
		
		var count=newText.length;
		var x = 0, s = [];
		for ( var i = 0; i < count; i++) 
		{
			if (x + letterWidth > width) 
			{
				s.push("\n");
				x = 0;
			}
			x += letterWidth;
			s.push(newText.charAt(i));
		}
		
		t.attr({
			"text" : s.join("")
		});
	}

	this.textWrap2 = function(t, width, newText,n) 
	{
		newText=this.textLeft(newText,n);

		this.textWrap(t, width, newText);
	}

	this.textLeft=function(s, n) 
	{
		var s2 = s.slice(0, n);
		var i = s2.replace(/[^x00-xff]/g, "**").length;
		if (i <= n) return s2;
		i -= s2.length;
		switch (i)
		{
			case 0: return s2;
			case n: return s.slice(0, n>>1);
			default:
				var k = n - i;
				var s3 = s.slice(k, n);
				var j = s3.replace(/[x00-xff]/g, "").length;
				return j ? s.slice(0, k) + this.textLeft(s3, j) : s.slice(0, k);
		}
	}



}

