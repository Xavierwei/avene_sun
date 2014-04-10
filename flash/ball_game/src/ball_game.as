package
{
	import com.greensock.TweenMax;
	
	import flash.display.DisplayObject;
	import flash.display.Sprite;
	import flash.events.Event;
	import flash.events.MouseEvent;
	import flash.external.ExternalInterface;
	import flash.geom.Matrix;
	import flash.geom.Point;
	import flash.geom.Vector3D;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.utils.getTimer;
	
	import ui.Btn;
	
	public class ball_game extends Sprite
	{
		
		private var xmlLoader:URLLoader;
		private var xml:XML;
		
		public var back2:Sprite;
		public var target0:Sprite;
		public var target1:Sprite;
		public var target2:Sprite;
		public var back1:Sprite;
		public var langan:Sprite;
		public var hint:Sprite;
		public var front:Sprite;
		public var ball:Sprite;
		public var btnStart:Btn;
		
		private var ball_x0:int;
		private var ball_y0:int;
		
		private var speed:Vector3D;
		private var oldMouseX:int;
		private var oldMouseY:int;
		
		private var isHit:Boolean;
		private var startTime:int;
		
		public function ball_game(){
			
			this.visible=false;
			
			xmlLoader=new URLLoader();
			xmlLoader.addEventListener(Event.COMPLETE,loadXMLComplete);
			xmlLoader.load(new URLRequest(
				this.loaderInfo.parameters.xml
				||
				"xml/config.xml"
			));
			
		}
		
		private function loadXMLComplete(...args):void{
			
			xmlLoader.removeEventListener(Event.COMPLETE,loadXMLComplete);
			xml=new XML(xmlLoader.data);
			xmlLoader=null;
			
			init();
			
		}
		
		private function init():void{
			
			if(ExternalInterface.available){
				ExternalInterface.addCallback(xml.reset[0].@callback.toString(),reset);
			}
			
			ball_x0=ball.x;
			ball_y0=ball.y;
			
			btnStart.release=start;
			
			this.tabEnabled=false;
			this.tabChildren=false;
			this.mouseEnabled=false;
			this.mouseChildren=true;
			var i:int=this.numChildren;
			while(i--){
				var child:DisplayObject=this.getChildAt(0);
				if(child.hasOwnProperty("tabEnabled")){
					child["tabEnabled"]=false;
				}
				if(child.hasOwnProperty("tabChildren")){
					child["tabChildren"]=false;
				}
				if(child.hasOwnProperty("mouseEnabled")){
					child["mouseEnabled"]=false;
				}
				if(child.hasOwnProperty("mouseChildren")){
					child["mouseChildren"]=false;
				}
			}
			
			btnStart.mouseEnabled=true;
			ball.buttonMode=true;
			ball.addEventListener(MouseEvent.MOUSE_DOWN,mouseDown);
			
			this.visible=true;
			
			
			reset();
			
		}
		
		private function reset():void{
			
			stopDrag();
			stage.removeEventListener(MouseEvent.MOUSE_UP,mouseUp);
			stage.removeEventListener(Event.ENTER_FRAME,mouseMove);
			this.removeEventListener(Event.ENTER_FRAME,enterFrame);
			
			hint.visible=false;
			var i:int=-1;
			while(this.hasOwnProperty("target"+(++i))){
				var target:Sprite=this["target"+i];
				target.visible=false;
				target.scaleX=target.scaleY=1;
				target.alpha=1;
				TweenMax.killTweensOf(target);
			}
			ball.visible=true;
			btnStart.visible=true;
			
			ball.transform.matrix=new Matrix();
			ball.x=ball_x0;
			ball.y=ball_y0;
			ball.mouseEnabled=false;
			
			front.addChild(ball);
			
			this.mouseChildren=true;
			
		}
		
		private function start():void{
			
			hint.visible=true;
			var i:int=-1;
			while(this.hasOwnProperty("target"+(++i))){
				var target:Sprite=this["target"+i];
				target.visible=true;
			}
			ball.visible=true;
			btnStart.visible=false;
			
			ball.mouseEnabled=true;
			
			isHit=false;
			
		}
		
		private function mouseDown(...args):void{
			
			ball.startDrag();
			stage.addEventListener(MouseEvent.MOUSE_UP,mouseUp);
			stage.addEventListener(Event.ENTER_FRAME,mouseMove);
			
			oldMouseX=this.mouseX;
			oldMouseY=this.mouseY;
			
			speed=new Vector3D();
			
		}
		private function mouseMove(...args):void{
			var dx:Number=this.mouseX-oldMouseX;
			var dy:Number=this.mouseY-oldMouseY;
			if(dx*dx+dy*dy>1){
				speed.x=dx;
				speed.y=dy;
			}
			oldMouseX=this.mouseX;
			oldMouseY=this.mouseY;
		}
		private function mouseUp(...args):void{
			
			speed.z=Math.sqrt(speed.x*speed.x+speed.y*speed.y)*0.707;
			trace("speed="+speed);
			speed.normalize();
			speed.x*=Number(xml.@speed.toString());
			speed.y*=Number(xml.@speed.toString());
			speed.z*=Number(xml.@speed.toString());
			trace("speed="+speed);
			
			stopDrag();
			stage.removeEventListener(MouseEvent.MOUSE_UP,mouseUp);
			stage.removeEventListener(Event.ENTER_FRAME,mouseMove);
			
			startTime=getTimer();
			
			this.mouseChildren=false;
			hint.visible=false;
			this.addEventListener(Event.ENTER_FRAME,enterFrame);
		}
		
		private function enterFrame(...args):void{
			
			ball.x+=speed.x;
			ball.y+=speed.y;
			ball.z+=speed.z;
			speed.y+=Number(xml.@g.toString());
			
			if(ball.y>Number(xml.@ground_y.toString())&&speed.y>0){
				if(speed.y>4){
					speed.x*=0.8;
					speed.y=-speed.y*0.4;
					speed.z*=0.8;
				}else{
					speed.x=0;
					speed.y=0;
					speed.z=0;
				}
			}
			
			if(isHit){
				return;
			}
			
			if(getTimer()-startTime>Number(xml.@time.toString())*1000){
				reset();
				start();
				return;
			}
			
			//trace("ball.z="+ball.z);
			if(ball.z>Number(xml.@langan_z.toString())&&ball.z<Number(xml.@target_z.toString())){
				var p:Point=ball.localToGlobal(new Point());
				var i:int=-1;
				while(this.hasOwnProperty("target"+(++i))){
					var target:Sprite=this["target"+i];
					if(new Point(target.x-p.x,target.y-p.y).length<Number(xml.@dis.toString())){
						hit(target);
						break;
					}
				}
			}
			if(ball.z>Number(xml.@target_z.toString())){
				back2.addChild(ball);
			}else if(ball.z>Number(xml.@langan_z.toString())&&ball.z<Number(xml.@langan_z.toString())+30){
				if(ball.y>Number(xml.@langan_y.toString())){
					ball.z=Number(xml.@langan_z.toString())-10;
					speed.z=0;
				}else{
					back1.addChild(ball);
				}
			}
			
		}
		
		private function hit(target:Sprite):void{
			
			isHit=true;
			
			TweenMax.to(target,8,{scaleX:1.5,scaleY:1.5,alpha:0,useFrames:true});
			
			if(ExternalInterface.available){
				ExternalInterface.call("eval",xml.hit[0].@action.toString().replace(/\$\{id\}/g,target.name.replace("target","")));
			}
		}
	}
}