/***
ZeroGIFBmd 版本:v1.0
简要说明:这家伙很懒什么都没写
创建人:ZЁЯ¤  身高:168cm+;体重:57kg+;未婚(已有女友);最爱的运动:睡觉;格言:路见不平,拔腿就跑;QQ:358315553
创建时间:2010年4月21日 20:41:48
历次修改:未有修改
用法举例:这家伙很懒什么都没写
*/

package zero{
	import flash.display.*;
	import flash.events.*;
	import flash.utils.*;
	
	public class ZeroGIFBmd extends BitmapData{//推荐使用ZeroGIFData
		public function ZeroGIFBmd(){
			super(40,40,false);
			bmdData.position=0;
			this.setPixels(this.rect,bmdData);
		}
		
		private static var bmdData:ByteArray=decode();
		private static function decode():ByteArray{
			var colorV:Vector.<uint>=new <uint>[
				0xff000000,
				0xff333333,
				0xff666666,
				0xff999999,
				0xffcccccc,
				0xffffffff
			];
			var arr:Array=[0x78,0xda,0x65,0x93,0xcd,0x96,0x83,0x20,0x0c,0x85,0x01,0xe9,0x3e,0x76,0xea,0xbe,0x9d,0x96,0x7d,0x67,0xce,0xb8,0xc7,0xa9,0xec,0x11,0xcd,0xfb,0xbf,0xca,0xe4,0x07,0x3b,0x7a,0xcc,0x06,0xce,0x27,0xe1,0xde,0x84,0x88,0x23,0x1e,0xc3,0xd8,0x9f,0xf1,0xd5,0x9e,0xf6,0x4c,0xa2,0xdf,0x31,0x10,0x96,0xf6,0x2c,0x30,0xdb,0xe7,0x42,0xca,0x87,0x83,0xf0,0x9a,0x25,0xfb,0xbe,0x65,0xd1,0xab,0x8c,0x39,0xbf,0x6d,0xc1,0x70,0x62,0xe0,0x48,0xf9,0xdb,0x55,0x79,0x98,0x12,0xa1,0x8b,0xec,0x17,0x48,0xd5,0x0b,0x31,0x4f,0x9b,0x72,0xef,0x71,0xb1,0xea,0xb9,0x2b,0xc6,0xc8,0x66,0x24,0xf1,0xc2,0xa6,0x66,0x8b,0xd9,0x38,0xda,0x4c,0xea,0xb2,0xe5,0x6d,0x4f,0xd9,0xcc,0xd8,0x25,0xad,0xb9,0xab,0x15,0x6f,0x18,0xf2,0xd5,0xc8,0x96,0x59,0x82,0x96,0x86,0xd6,0x88,0xf5,0x22,0xb2,0xb0,0xd0,0xc2,0x79,0x39,0xd4,0xa4,0xa0,0x0d,0x92,0x34,0x56,0x8e,0xb5,0x2d,0xf3,0xa7,0x56,0xd1,0x54,0xd6,0xe0,0xad,0x5b,0x8b,0x3d,0xaf,0x4d,0x7d,0x6a,0x22,0x87,0x15,0xe6,0x61,0xed,0xe0,0x8d,0x2a,0xf1,0xc2,0x3e,0xa6,0xca,0xb2,0xb1,0x52,0x08,0x42,0x23,0xde,0x98,0x19,0x1f,0xc5,0x0f,0x82,0x13,0x8b,0x0d,0x1f,0xeb,0xb3,0xad,0xcd,0x1a,0x49,0xc1,0x26,0xf9,0x5a,0x1f,0xf5,0x6a,0xea,0xc3,0x4d,0x26,0x44,0xab,0x0f,0x18,0x85,0x35,0x7c,0xac,0xd8,0xa8,0x2c,0xeb,0x0b,0xe1,0xd3,0xf4,0x10,0x8a,0x5a,0x2f,0xca,0xac,0xe9,0xa2,0x01,0x95,0x95,0x86,0x70,0x5c,0xf8,0x12,0x4c,0xdb,0x89,0x79,0x0c,0x22,0xf5,0x9b,0xde,0x22,0x2e,0x0d,0xf5,0x06,0x5c,0x45,0xdc,0x02,0x7a,0xda,0xc0,0x66,0x04,0x1f,0x6a,0xc9,0x7f,0x5d,0xb1,0x26,0xbb,0xe8,0x85,0x51,0x0b,0xda,0xa0,0x70,0xc6,0x18,0xa4,0x9c,0xb0,0x9d,0xb8,0x02,0xee,0xb9,0x4e,0xcd,0x7f,0xf4,0xd1,0x1d,0x7f,0x00,0x78,0xcf,0xef,0x1f,0x34,0x25,0xa1,0x5c];
			var newData:ByteArray=new ByteArray();
			var i:int=0;
			for each(var value:int in arr){
				newData[i++]=value;
			}
			newData.uncompress();
			var L:int=newData.length;
			var data:ByteArray=new ByteArray();
			for(i=0;i<L;i++){
				var newDataValue:int=newData[i];
				data.writeUnsignedInt(colorV[(newDataValue>>4)&0xf]);
				data.writeUnsignedInt(colorV[newDataValue&0xf]);
			}
			return data;
		}
		override public function dispose():void{
			throw new Error("不让 dispose");
		}
		
		/*
		private static var loader:Loader;
		public static function getCode():void{
			loader=new Loader();
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE,loadComplete);
			loader.loadBytes(new ZeroGIFData());
		}
		private static function loadComplete(event:Event):void{
			var bmd:BitmapData=(loader.content as Bitmap).bitmapData;
			var data:ByteArray=bmd.getPixels(bmd.rect);
			data.position=0;
			var newData:ByteArray=new ByteArray();
			while(data.bytesAvailable>0){
				newData[newData.length]=(getValueByColor(data.readUnsignedInt())<<4)|getValueByColor(data.readUnsignedInt());
			}
			newData.compress();
			trace(BytesAndStr16.bytes2str16(newData,0,newData.length).replace(/ /g,",0x"));
		}
		private static function getValueByColor(color:uint):int{
			switch(color){
				case 0xffffffff:
					return 5;
				break;
				case 0xffcccccc:
					return 4;
				break;
				case 0xff999999:
					return 3;
				break;
				case 0xff666666:
					return 2;
				break;
				case 0xff333333:
					return 1;
				break;
				case 0xff000000:
					return 0;
				break;
				default:
					throw new Error("其它颜色值: "+color);
				break;
			}
			return -1;
		}
		*/
	}
}

