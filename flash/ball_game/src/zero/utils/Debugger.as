/***
Debugger
创建人：ZЁЯ¤　身高：168cm+；体重：57kg+；已婚（单身美女们没机会了~~）；最爱的运动：睡觉；格言：路见不平，拔腿就跑。QQ：358315553。
创建时间：2014年03月18日 10:19:05
简要说明：这家伙很懒什么都没写。
用法举例：这家伙还是很懒什么都没写。
*/

package zero.utils{
	import flash.display.*;
	import flash.events.*;
	import flash.geom.*;
	import flash.net.*;
	import flash.system.*;
	import flash.text.*;
	import flash.utils.*;
	
	public class Debugger extends Sprite{
		
		private var txt:TextField;
		
		private var startTime:int;
		private var fps:int;
		
		public function Debugger(){
			
			this.addChild(txt=new TextField());
			txt.border=true;
			txt.background=true;
			//txt.autoSize=TextFieldAutoSize.LEFT;
			txt.width=200;
			txt.height=20;
			
			startTime=getTimer();
			fps=0;
			
			this.addEventListener(Event.ENTER_FRAME,enterFrame);
			
		}
		
		private function enterFrame(...args):void{
			
			fps++;
			
			var dTime:int=getTimer()-startTime;
			if(dTime>1000){
				startTime=getTimer();
				txt.text="fps="+Math.round(fps*1000/dTime*100)/100;
				fps=0;
			}
			
		}
		
	}
}