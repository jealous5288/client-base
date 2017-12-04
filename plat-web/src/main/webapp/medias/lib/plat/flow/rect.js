function Rect()
{ 
	Shape.call(this);

	this.clsName = "shape rect";

	this.backgroundColor = "#D2F3FF";

	this.borderColor = "#7B7B7B";

	this.top = 0;

	this.left = 0;
} 

Rect.create = function(flow,x,y)
{
	var rect = new Rect();
	rect.id = "n"+createUUID();
	rect.flow = flow;
	rect.top=y;
	rect.left=x;
	flow.addShape(rect);
	return rect;
}