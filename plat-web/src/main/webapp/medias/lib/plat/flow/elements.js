function Elements()
{

}

Elements.getShapeCode = function(shape,panel)
{
	if(shape.constructor == StartNode || shape.constructor == EndNode)
	{

		var circle = panel.paper.circle(shape.property.x+20, shape.property.y+20, 20);   
		circle.node.setAttribute("id",shape.property.domid); 
		circle.attr("fill", shape.status==1?shape.backgroundColor:shape.status==0?"#ECECEC":"#007ab3");
		circle.attr("stroke", shape.borderColor);  
		circle.attr("cursor", "pointer");
		circle.attr("id", shape.property.domid);

		if(shape.property.name!=undefined)
		{
			circle.attr("title", shape.property.name); 

			var text=panel.paper.text(shape.property.x+20, shape.property.y+20, shape.property.name );
			text.attr("title", shape.property.name); 
			text.attr("cursor", "pointer");

			circle.data("enclosedText",text); 
			text.data("parentShape",circle); 
		}

		return circle;
		
	}
	else if(shape.constructor == DecisionNode)
	{
		var x=shape.property.x;
		var y=shape.property.y+25;
		var diamond=panel.paper.path("M"+x+" "+y+" l50 -25 l50 25 l-50 25 l-50 -25");
		diamond.node.setAttribute("id",shape.property.domid); 
		diamond.attr("fill", shape.status==1?shape.backgroundColor:shape.status==0?"#ECECEC":"#007ab3");
		diamond.attr("stroke", shape.borderColor);  
		diamond.attr("cursor", "pointer");
		diamond.attr("id", shape.property.domid);

		if(shape.property.name!=undefined)
		{
			diamond.attr("title", shape.property.name); 

			var text=panel.paper.text(x+100/2, y, "");
			text.attr("title", shape.property.name); 
			text.attr("cursor", "pointer");
			shape.textWrap2(text,50,shape.property.name,30);

			diamond.data("enclosedText",text); 
			text.data("parentShape",diamond); 
		}


		return diamond;

	}
    else if(shape.constructor == ClusterNode || shape.constructor == CirculationNode)
    {
        var x=shape.property.x;
        var y=shape.property.y;
        var w=70;
        var h=40;

        var rect;
        if(shape.constructor == ClusterNode)
            rect = panel.paper.path("M"+x+" "+y+" l0 "+h+" l"+w+" 0 l0 -"+h+" l-"+w+" 0"+" m"+(w/5)+" 0 l0 "+ h+ " m"+(w*3/5)+" 0 l0 -"+h);
        else
        {
            rect = panel.paper.path("M"+x+" "+y+" h"+ (w-8) +" v8 h8 v" +(h-8)+ " h-"+ w+" v-"+h);
            var l=panel.paper.path("M"+(x+w-8)+" "+y+" l8,8");
            l.attr("stroke", shape.borderColor);
            rect.data("extraLine",l);
        }

        rect.node.setAttribute("id",shape.property.domid);
        rect.attr("fill", shape.status==1?shape.backgroundColor:"#ECECEC");
        rect.attr("stroke", shape.borderColor);
        rect.attr("cursor", "pointer");
        rect.attr("id", shape.property.domid);

        if(shape.property.name!=undefined)
        {
            rect.attr("title", shape.property.name);

            var text=panel.paper.text(x+70/2, y+40/2, "");
            text.attr("title", shape.property.name);
            text.attr("cursor", "pointer");

            if(shape.constructor == CirculationNode)
                shape.textWrap2(text,60,shape.property.name,36);
            else
                shape.textWrap2(text,45,shape.property.name,24);

            rect.data("enclosedText",text);
            text.data("parentShape",rect);
        }
        return rect;
    }
	else if(shape.constructor == ActivityNode)
	{
		var r=0;
		var rect = panel.paper.rect(shape.property.x, shape.property.y,70,40,r);   
		rect.node.setAttribute("id",shape.property.domid); 
		rect.attr("fill", shape.status==1?shape.backgroundColor:shape.status==0?"#ECECEC":"#007ab3");
		rect.attr("stroke", shape.borderColor);  
		rect.attr("cursor", "pointer");
		rect.attr("id", shape.property.domid);

		if(shape.property.name!=undefined)
		{
			rect.attr("title", shape.property.name);  

			var text=panel.paper.text(shape.property.x+70/2, shape.property.y+40/2, "");
			text.attr("title", shape.property.name);  
			text.attr("cursor", "pointer");
			shape.textWrap2(text,60,shape.property.name,36);

			rect.data("enclosedText",text); 
			text.data("parentShape",rect); 
		}

		return rect;
	}
}

Elements.getLineCode = function(router)
{
	
	if(router.type == Router.POLYLINE)
	{
		var p=panel.paper.path("M "+router.points[0]+" L"+router.points[1]+" L"+router.points[2]);   
		p.node.setAttribute("id",router.domid); 


		return p;
	}
	else if(router.type == Router.LINE)
	{
		/*
		var arr=router.points[0].split(",");
		var x1=parseFloat(arr[0]);
		var y1=parseFloat(arr[1]);
		arr=router.points[1].split(",");
		var x2=parseFloat(arr[0]);
		var y2=parseFloat(arr[1]);
		arr=router.points[2].split(",");
		var xc=parseFloat(arr[0]);
		var yc=parseFloat(arr[1]);

		var s=6;
		var angle = Math.atan2(x1-xc,yc-y1);
		angle = angle*180 /Math.PI+90;

		var arrow=panel.paper.path("M"+xc+" "+yc+" L"+(xc-s)+" "+(yc-s)+" M"+xc+" "+yc+" L"+(xc-s)+" "+(yc+s));
		//arrow.transform("r"+angle);
		arrow.rotate(angle,xc,yc);

		var p=panel.paper.path("M" + x1 + " " + y1 + " L" + x2 + " " + y2);;   
		p.node.setAttribute("id",router.domid); 
 

		return p;
		*/

	}
}

Elements.getPositionStyleCode = function(x, y)
{
	return 'top:'+y+'px; left:'+x+'px';
}

