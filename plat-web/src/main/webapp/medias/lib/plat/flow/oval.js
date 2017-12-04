function Oval()
{ 
	Shape.call(this);

	this.clsName = "shape oval";

	this.backgroundColor = "#ECFFD2";

	this.borderColor = "#7B7B7B";

	this.top = 0;

	this.left = 0;

} 

Oval.create = function(flow,x,y)
{
	var oval = new Oval();
	oval.id = "n"+createUUID();
	oval.flow = flow;
	oval.top=y;
	oval.left=x;
	flow.addShape(oval);
	return oval;
}
