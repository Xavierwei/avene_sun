/***
Test
创建人：ZЁЯ¤　身高：168cm+；体重：57kg+；未婚（已有女友）；最爱的运动：睡觉；格言：路见不平，拔腿就跑。QQ：358315553。
创建时间：2012年12月01日 18:06:42
简要说明：这家伙很懒什么都没写。
用法举例：这家伙还是很懒什么都没写。
*/

package zero.stage3Ds.test{
	import flash.display.*;
	import flash.geom.*;
	import flash.utils.*;
	import zero.shaders.Float2;
	import zero.shaders.Pixel4;
	import zero.stage3Ds.*;
	
	/**
	 * 
	 * 测试
	 * 
	 */	
	public class Test extends BaseEffect{
		
		public static const nameV:Vector.<String>=new <String>["alpha","center","dimension"];
		//TestCode//为了编译进来
		public static const byteV:Vector.<int>=new <int>[
			0xa0,0x01,0x00,0x00,0x00,0xa1,0x01,
			
			//sub ft0.xy,v0.xy,fc1.xy
			0x02,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x04,0x00,0x00,0x00, 0x01,0x00,0x00,0x04,0x01,0x00,0x00,0x00,
			
			//div ft0.xy,ft0.xy,fc1.zw
			0x04,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x01,0x00,0x00,0x0e,0x01,0x00,0x00,0x00,
			
			//add ft0.xy,ft0.xy,fc2.yy
			0x01,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x02,0x00,0x00,0x05,0x01,0x00,0x00,0x00,
			
			//frc ft1.xy,ft0.xy
			0x08,0x00,0x00,0x00, 0x01,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
			
			//sub ft0.xy,ft0.xy,ft1.xy
			0x02,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x01,0x00,0x00,0x04,0x02,0x00,0x00,0x00,
			
			//mul ft0.xy,ft0.xy,fc1.zw
			0x03,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x01,0x00,0x00,0x0e,0x01,0x00,0x00,0x00,
			
			//add ft0.xy,ft0.xy,fc1.xy
			0x01,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x01,0x00,0x00,0x04,0x01,0x00,0x00,0x00,
			
			//sub ft0.xy,ft0.xy,fc0.xy
			0x02,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x00,0x00,0x00,0x04,0x01,0x00,0x00,0x00,
			
			//div ft0.xy,ft0.xy,fc0.zw
			0x04,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x00,0x00,0x00,0x0e,0x01,0x00,0x00,0x00,
			
			//sat ft0.xy,ft0.xy
			0x16,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,
			
			//mul ft0.xy,ft0.xy,fc0.zw
			0x03,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x00,0x00,0x00,0x0e,0x01,0x00,0x00,0x00,
			
			//add ft0.xy,ft0.xy,fc0.xy
			0x01,0x00,0x00,0x00, 0x00,0x00,0x03,0x02, 0x00,0x00,0x00,0x04,0x02,0x00,0x00,0x00, 0x00,0x00,0x00,0x04,0x01,0x00,0x00,0x00,
			
			//tex ft0.xyzw,ft0.xyyy,fs0<2d>
			0x28,0x00,0x00,0x00, 0x00,0x00,0x0f,0x02, 0x00,0x00,0x00,0x54,0x02,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,0x05,0x00,0x00,0x00,
			
			//mul ft0.xyzw,ft0.xyzw,fc2.xxxx
			0x03,0x00,0x00,0x00, 0x00,0x00,0x0f,0x02, 0x00,0x00,0x00,0xe4,0x02,0x00,0x00,0x00, 0x02,0x00,0x00,0x00,0x01,0x00,0x00,0x00,
			
			//mov oc.xyzw,ft0.xyzw
			0x00,0x00,0x00,0x00, 0x00,0x00,0x0f,0x03, 0x00,0x00,0x00,0xe4,0x02,0x00,0x00,0x00, 0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00
		];
		
		public static const data:Vector.<Number>=new <Number>[
			
			//fc0
			0,//u_d
			0,//v_d
			0,//u_wid
			0,//v_hei
			
			//fc1
			0,//u_center
			0,//v_center
			0,//u_dimension
			0,//v_dimension
			
			//fc2
			0,//alpha
			0.5,
			0,//占位
			0//占位
			
		];
		data.fixed=true;
		
		/**
		 * 
		 * 透明度 （0~1） 默认 1
		 * 
		 */
		public var alpha:Number;
		
		/**
		 * 
		 * 坐标 默认 null
		 * 
		 */
		public var center:Float2;
		
		/**
		 * 
		 * 格子大小 （1~100） 默认 10
		 * 
		 */
		public var dimension:Number;
		

		/**
		 * 
		 * 透明度 （0~1） 默认 1<br/>
		 * 坐标 默认 null<br/>
		 * 格子大小 （1~100） 默认 10<br/>
		 * 
		 */
		public function Test(_alpha:Number=1,_center:Float2=null,_dimension:Number=10){
			alpha=_alpha;
			center=_center;
			dimension=_dimension;
		}
		
		override public function updateParams():void{
			
			//fc0
			data[0]=Xiuzhengs.d/uploadBmd.width;//0 u_d
			data[1]=Xiuzhengs.d/uploadBmd.height;//0 v_d
			data[2]=(bmd.width+Xiuzhengs.uvxiuzheng)/uploadBmd.width;//0 u_wid
			data[3]=(bmd.height+Xiuzhengs.uvxiuzheng)/uploadBmd.height;//0 v_hei
			
			//fc1
			data[4]=(Xiuzhengs.d+center.x)/uploadBmd.width;//0 u_center
			data[5]=(Xiuzhengs.d+center.y)/uploadBmd.height;//0 v_center
			data[6]=dimension/uploadBmd.width;//0 u_dimension
			data[7]=dimension/uploadBmd.height;//0 v_dimension
			
			//fc2
			data[8]=alpha
			//0.5
			//0 占位
			//0 占位
		}
		

	}
}