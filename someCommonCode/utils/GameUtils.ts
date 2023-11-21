class GameUtils {
	/**
	 * 把rgb转换成颜色码
	 */
	public static changeRgbToColor(r: number, g: number, b: number) {
		let red = GameUtils.formatColor(r.toString(16));
		let green = GameUtils.formatColor(g.toString(16));
		let blue = GameUtils.formatColor(b.toString(16));
		let total = red + green + blue;
		return parseInt(total, 16);
	}

	/**
	 * 格式化16进制颜色
	 */
	public static formatColor(cols: string) {
		let len = cols.length;
		let result = len > 1 ? cols : 0 + cols;
		return result;
	}

	/**
	 * 无旋转角度的矩形与圆形的碰撞检测
	 * 参数介绍(w：矩形的宽，h：矩形的高，r：圆形半径，rx：圆形中心与矩形中心相对坐标X，ry：圆形中心与矩形中心相对坐标Y）
	 */
	public static computeCollision(w: number, h: number, r: number, rx: number, ry: number): boolean {
		if (w <= 0 && h <= 0) return false;
		let wa = w >> 2;
		let ha = h >> 2;
		var dx = Math.min(rx, wa);
		var dx1 = Math.max(dx, -wa);
		var dy = Math.min(ry, ha);
		var dy1 = Math.max(dy, -ha);
		return (dx1 - rx) * (dx1 - rx) + (dy1 - ry) * (dy1 - ry) <= r * r;
	}

	/**
	 * 两个圆形之间的碰撞检测
	 * 圆心距离小于半径之和
	 */
	public static computeCirCleAndCircle(radix1: number, posx1: number, posy1: number, radix2: number, posx2: number, posy2: number) {
		let disx = posx1 - posx2;
		let disy = posy1 - posy2;
		let dis = Math.sqrt(disx * disx + disy * disy);
		return dis < radix1 + radix2 - 5;//加5的偏移量
	}

	/**根据权重随机第几个(从第0个开始)
	 * 例:let count = Common.randomWeight([10, 30, 30, 30]);
	 */
	public static randomWeightArr(arr: Array<number>) {
		let sum = 0;
		for (let i = 0; i < arr.length; i++) {
			sum += arr[i];
		}
		let rand = GameUtils.random(0, sum - 1);
		for (let i = 0; i < arr.length; i++) {
			if (rand < arr[i]) return i;
			rand -= arr[i];
		}
		// console.error("根据权重随机第几个的方法报错common.randomWeightArr:", arr);
		return 0;
	}

	/** 随机到区间的随机数,左右都是闭合区间[min,max] */
	public static random(min: number, max: number) {
		let d = Math.floor(max + 1) - Math.floor(min);
		return min + Math.floor(Math.random() * d);
	}

	// /**延时 */
	// public static delay(time: number, tab: string) {

	// 	return new Promise((resolve, reject) => {
	// 		if (time == 0) {
	// 			resolve(undefined)
	// 		}
	// 		TimerManager.ins().doTimer(time, 1, () => { resolve(undefined) }, this)
	// 	});
	// }

	/** 添加tween动画 */
	public static addTween(target: any, props: any, time: number, ease?: Function) {
		return new Promise((resolve, reject) => {
			egret.Tween.get(target).to(props, time, ease).call(() => {
				resolve(undefined);
			});
		});
	}

	/**
	 * 把json转换成字符串
	 */
	public static stringify(data: any) {
		if (data) {
			return JSON.stringify(data);
		}
		return ``;
	}

	/**
	 * 解析json字符串
	 */
	public static parse(data: any) {
		if (data) {
			return JSON.parse(data);
		}
		return {};
	}

	/**是否是字符串数据 返回:true false */
	public static isDataString(data: string) {
		//这些都不是数据类型的字符串
		let result = !data || data == "" || data == "undefined" || data == "null" || data == "{}" || data == "NaN";
		return !result;
	}

	/** 把帧率转换成时间 */
	public static getTimeByFrame(frame: number, frameRate: number = 12) {
		return Math.round(frame * 1000 / frameRate);
	}

	/**像素和格子的转换率 */
	public static CELL_SIZE: number = 32;

	/** 格子坐标（整数）到像素坐标的转换**/
	public static PosToPixel(val: number): number {
		let p = Math.floor(val * this.CELL_SIZE);
		return p;
	}

	/** 像素坐标到格子坐标（整数）的转换**/
	public static PixelToPos(val: number): number {
		let p = Math.floor(val / this.CELL_SIZE);
		return p;
	}

	/** 像素坐标到格子坐标（整数）的转换**/
	public static PixelToPos2(val: number): number {
		let p = Math.floor(val / this.CELL_SIZE * 100) / 100;
		return p;
	}

	/** 目标点像素转换成整数格子的像素坐标**/
	public static PixelToInteger(val: number): number {
		let pos = this.PixelToPos(val);
		let pixel = this.PosToPixel(pos);
		return pixel;
	}

	/** 目标像素调整到格子中间(格子加0.5)的像素坐标 */
	public static PixelToPixelCenter(val: number) {
		let pos = this.PixelToPos(val);
		return (pos + 0.5) * this.CELL_SIZE;
	}

	public static PosToPixelCenter(val: number) {
		return (val + 0.5) * this.CELL_SIZE;
	}

	/** 将节点坐标转换成A*坐标 */
	public static pointToAStar(posx: number, posy: number) {
		let astar = new AStarNode(Math.floor(posx / 100), Math.floor(posy / 100));
		return astar;
	}

	// /** 将节点坐标组转换成A*坐标组(取出所有点包括起始点) */
	// public static pointsToAStars(points: sc_map_entity_pos[]): AStarNode[] {
	// 	let astars: AStarNode[] = []
	// 	let len = points.length;
	// 	let index = 0;
	// 	for (let i = len - 1; i >= 0; i--) {
	// 		let point = points[i];
	// 		astars[index] = this.pointToAStar(point.x, point.y);
	// 		index++;
	// 	}
	// 	return astars;
	// }

	/** 将节点坐标组转换成A*坐标组(取出所有点包括起始点) */
	public static pointsToAStarsTest(points: sc_map_entity_pos[]): AStarNode[] {
		let astars: AStarNode[] = [];
		let len = points.length;
		let index = 0;
		for (let i = 0; i < len; i++) {
			astars[i] = this.pointToAStar(points[i].x, points[i].y);
		}
		return astars;
	}

	/** 数组去重 */
	public static DeleteSame<T>(data: Array<T>): Array<T> {
		let hash: any = {};
		let newArr = [];
		for (let item of data) {
			if (hash[item])
				continue;
			newArr.push(item);
			hash[item] = 1;
		}
		return newArr;
	}

	/**
	 * 判断一个数是否是10的n次幂(n为正负整数)
	 * @author lijun
	 * @param num 
	 */
	public static isNthPowOf10(num: number): boolean {
		let is1Appear: boolean = false;
		let numStrArr = num.toString().split('');
		for (let i = 0; i < numStrArr.length; i++) {
			const str = numStrArr[i];
			if (i == 0) {
				if (str !== '-' && str !== '0' && str !== '.' && str !== '1') {
					return false;
				}
				if (str === '1') is1Appear = true;
				continue;
			}
			if (is1Appear) {
				if (str !== '0' && str !== '.') {
					return false;
				}
			} else {
				if (str !== '0' && str !== '.' && str !== '1') {
					return false;
				}
				if (str === '1') is1Appear = true;
			}
		}
		return true;
	}

	/**
	 * 修复精度缺失的(基础数*10的n次幂数)乘法运算
	 * @author lijun
	 * @param baseNum 基础数
	 * @param multiNum 必须为10的n次幂(n为正负整数)
	 */
	public static fixPrecisionMulti(baseNum: number, multiNum: number): number {
		if (DEBUG) {
			console.assert(GameUtils.isNthPowOf10(multiNum), `调用GameUtils.fixPrecisionMulti:第二个传入参数${multiNum}不是10的整数n次幂,无法正确运算,请检查!`);
		}

		//处理baseNum的小数点
		let baseArr = baseNum.toString().split('');
		let pointIndex = baseArr.indexOf('.');
		//如果baseNum不存在小数点,说明是整数,在最后面补一个小数点和一个0(不能直接返回两数相乘结果,因为multiNum可能是小数,如7*0.00001就不能正确计算)
		if (pointIndex < 0) {
			baseArr.push('.');
			baseArr.push('0');
			pointIndex = baseArr.length - 2;
		}

		//处理相乘两值的正负情况
		let minusSign = '';
		if (baseNum < 0) {
			minusSign = baseArr.shift();
			pointIndex -= 1;
		}
		if (multiNum < 0) minusSign = minusSign == '-' ? '' : '-';

		//处理multiNum
		if (Math.abs(multiNum) == 1) {
			return baseNum * multiNum;
		} else {
			//判断multiNum是10的正次幂还是10的负次幂
			var isNthPositive = Math.abs(multiNum) > 1 ? true : false;
		}
		//计算multiNum为10的几次幂
		let tenx = Math.log(Math.abs(multiNum)) / Math.log(10);

		//根据tenx对baseNum的小数点进行移位，模仿乘法
		for (let i = 0; i < Math.abs(tenx); i++) {
			if (isNthPositive) {
				let flag = baseArr[pointIndex + 1];
				baseArr[pointIndex + 1] = baseArr[pointIndex];
				baseArr[pointIndex] = flag;
				pointIndex += 1;
				//如果小数点到了尾部: 如果是最后一次循环则删除小数点 如果不是就在最后面补0
				if (pointIndex == baseArr.length - 1) {
					//Math.abs(tenx)可能是小数 因为存在tenx = Math.log(1000)/Math.log(10)结果不是3是2.99999999这种情况
					if (Math.abs(tenx) - i <= 1) {
						baseArr.pop();
					} else {
						baseArr.push('0');
					}
				}
			} else {
				let flag = baseArr[pointIndex - 1];
				baseArr[pointIndex - 1] = baseArr[pointIndex];
				baseArr[pointIndex] = flag;
				pointIndex -= 1;
				//如果小数点到了首位: 在最前面补0 更新小数点index
				if (pointIndex == 0) {
					baseArr.unshift('0');
					pointIndex = 1;
				}
			}
		}

		//返回最终结果
		baseArr.unshift(minusSign);
		return parseFloat(baseArr.join(''));
	}

	/**
	 * 返回从time origin之后到当前调用时经过的时间(单位也是ms,但可以精确到小数点后10位)
	 * @author lijun
	 */
	public static performanceNow(): number {
		let performance = window['performance'];
		if (!performance) {
			//不存在performance的情况下
			return egret.getTimer();
		}
		if (typeof performance.now == 'function') {
			return performance.now();
		}
		//兼容写法获取performance.now()的近似值
		return Date.now() - performance['timeOrigin'];
	}

	/**
	 * 每秒创建对象数量测试 每秒diff值尽量小于120
	 * @author lijun
	 */
	public static hashCountTest(): void {
		var count = egret.$hashCount;
		setInterval(() => {
			var newCount = egret.$hashCount;
			var diff = newCount - count;
			count = newCount;
			console.log('1s内引擎对象的创建数量:' + diff);

		}, 1000)
	}
	public static getTextureByLoadBase64(base64: string, callback: (texture: egret.Texture, base64: string) => void, callbackObj: any): void {

		let img: HTMLImageElement = new Image();
		img.src = base64
		img.crossOrigin = '*';
		let bitmapData = new egret.BitmapData(img);
		img.onload = function () {
			img.onload = undefined;
			bitmapData.source = img;
			bitmapData.height = img.height;
			bitmapData.width = img.width;
			let texture = new egret.Texture()
			texture._setBitmapData(bitmapData)
			callback.call(callbackObj, texture, base64);
		}
	}
	/**
 * 根据标签获得纹理
 */
	public static getTextureByElement(element: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement): egret.Texture {
		var texture = new egret.Texture();
		texture.bitmapData = new egret.BitmapData(element);
		return texture;
	}
	public static ClipTexture(obj: egret.DisplayObject, rect?: egret.Rectangle, scale?: number): egret.Texture {
		if (obj) {
			let camera = new egret.RenderTexture()
			camera.drawToTexture(obj, rect, scale)
			return camera;
		} else {
			console.log(`操作对象不存在`)
		}

	}
	/**
	 * 重置滚动条到当前选择位置
	 * @param sc  eui.Scroller
	 * @param li  eui.List
	 * @param isH true 横向  false 竖向   偷了个懒
	 * @returns 
	 */
	public static restScrollerPosToCurSelectIndex(sc: eui.Scroller, li: eui.List, isH: boolean = true, isToEnd: boolean = false): void {
		if (!li.dataProvider || li.dataProvider.length <= 0) {
			return;
		}
		let len: number = li.dataProvider.length;
		sc.viewport = li;
		let a: eui.LayoutBase = li.layout;
		let controlNum: number = 1;
		if (a instanceof eui.TileLayout) {
			let b: eui.TileLayout = a;
			if (b.orientation == "rows") {
				controlNum = (b.requestedColumnCount == 0 ? 1 : b.requestedColumnCount);
			} else if (b.orientation == "columns") {
				controlNum = (b.requestedRowCount == 0 ? 1 : b.requestedRowCount)
			}
			len = Math.ceil(len / controlNum);
		}
		sc.validateNow();
		if (isH) {
			if (sc.viewport.contentWidth > sc.viewport.width) {

				let oneWidth = sc.viewport.contentWidth / len;
				let curX = oneWidth * Math.floor(li.selectedIndex / controlNum);
				let maxX = sc.viewport.contentWidth - sc.viewport.width;
				curX = curX > maxX ? maxX : curX;
				sc.viewport.scrollH = curX < 0 ? 0 : curX;

				if (isToEnd) {
					sc.viewport.scrollH = maxX;
				} else {
					sc.viewport.scrollH = curX < 0 ? 0 : curX;
				}
			} else {
				sc.viewport.scrollH = 0;
			}
		} else {
			if (sc.viewport.contentHeight > sc.viewport.height) {
				let oneHeight = sc.viewport.contentHeight / len;
				let curY = oneHeight * Math.floor(li.selectedIndex / controlNum);
				let maxY = sc.viewport.contentHeight - sc.viewport.height;
				curY = curY > maxY ? maxY : curY;
				if (isToEnd) {
					sc.viewport.scrollV = maxY;
				} else {
					sc.viewport.scrollV = curY < 0 ? 0 : curY;
				}
			} else {
				sc.viewport.scrollV = 0;
			}
		}
	}
	/**
	 * 重置TabBar到当前选择位置
	 * @param sc  eui.Scroller
	 * @param li  eui.List
	 * @param isH true 横向  false 竖向
	 * @returns 
	 */
	public static restTabBarPosToCurSelectIndex(tabBarGroup: eui.Group, tabBar: eui.TabBar, limitWidth: number = 0, limitHeight: number = 0): void {
		if (tabBar.selectedIndex >= 0 && tabBar.numChildren > tabBar.selectedIndex) {

			tabBarGroup.validateNow();
			let oneW: number = tabBar.contentWidth / tabBar.numChildren;
			let curX: number = oneW * tabBar.selectedIndex;
			let maxX: number = tabBarGroup.contentWidth - limitWidth;
			maxX = maxX < 0 ? 0 : maxX;
			let srollH = MathUtils.Clamp(curX, 0, maxX)
			tabBarGroup.scrollH = srollH;


			let oneH: number = tabBar.contentHeight / tabBar.numChildren;
			let curY: number = oneH * tabBar.selectedIndex;
			let maxY: number = tabBarGroup.contentHeight - limitHeight;
			maxY = maxY < 0 ? 0 : maxY;
			let srollV = MathUtils.Clamp(curY, 0, maxY)
			tabBarGroup.scrollV = srollV;
		}
	}

	/**
	 * 适用于在进行切换左右切换时 将对应滚动条滑动至对应项的位置 (如仙君页面的切换)
	 * @author lijun
	 * @param li 滚动容器 必须是eui.List;
	 */
	public static moveToRightScroll(li: eui.List): void {
		let sc = <eui.Scroller>li.parent;
		sc.validateNow();
		let index = li.selectedIndex;
		let isHorizon = egret.is(li.layout, "eui.HorizontalLayout");
		let scrollValue = isHorizon ? li.scrollH : li.scrollV;                            //当前滑动量
		let itemSize = isHorizon ? li.layout.$typicalWidth : li.layout.$typicalHeight;    //子项尺寸
		let liSize = isHorizon ? li.width : li.height;                                    //列表显示尺寸
		let liContentSize = isHorizon ? li.contentWidth : li.contentHeight;               //列表内容尺寸
		let linearLayout = <eui.LinearLayoutBase>li.layout;
		let gap = linearLayout.gap;                                                       //子项间隔

		//可视区域之前的完整item数量 
		let preCount = Math.floor(scrollValue / itemSize);
		let preSize = preCount * itemSize + (preCount - 1) * gap;
		//根据模糊计算出的结果反推需要的滑动量,再通过对比修正最后的preCount值   
		if (preSize > scrollValue) {
			preCount -= 1;
			preSize = preCount * itemSize + (preCount - 1) * gap;
		}
		let preRemain = scrollValue - preSize;
		//可视区域的第一个完整item的索引index
		let start;
		//可视区域不可分配部分
		let cantUseContent;
		//可视区域剩余可分配部分
		let remainContent;
		if (preRemain <= gap) {
			cantUseContent = gap - preRemain;
			remainContent = liSize - cantUseContent;
			start = preCount;
		} else {
			cantUseContent = itemSize - (preRemain - gap) + gap;
			remainContent = liSize - cantUseContent;
			start = preCount + 1;
		}
		//可视区域显示的完整item数量
		let wholeCount = Math.floor(remainContent / itemSize);
		let needSize = wholeCount * itemSize + (wholeCount - 1) * gap;
		if (needSize > remainContent) {
			wholeCount -= 1;
		}
		//可视区域的最后一个完整item的索引index
		let end = start + wholeCount - 1;
		//判断当前选中的index在不在start到end之间 如果在则不用处理 如果不在则修正滑动量
		if (index >= start && index <= end) return;
		let fixedScrollValue = index * itemSize + index * gap;
		if (index < start) {
			fixedScrollValue -= cantUseContent;
		}
		if (index > end) {
			fixedScrollValue -= cantUseContent;
			fixedScrollValue -= (wholeCount - 1) * itemSize + (wholeCount - 1) * gap;
		}
		let maxScrollValue = liContentSize - liSize;
		if (fixedScrollValue < 0) fixedScrollValue = 0;
		if (fixedScrollValue > maxScrollValue) fixedScrollValue = maxScrollValue;
		//滑动至计算值
		ScrollSwitch.ins().checkSwitchData(sc).then(() => {
			if (isHorizon) {
				li.scrollH = fixedScrollValue;
			} else {
				li.scrollV = fixedScrollValue;
			}
		})
	}

	public static openRateUrl(url = "http://xysy.m.skysgame.com/New/News?id=6120&siteId=12&Cid=128") {
		if (DeviceUtil.isNative()) {
			NativeHandler.ins().sendMsg('@openweb', url)
		} else {
			window.open(url)
		}
	}

	/**
	 * Log允许是否生效
	 * @returns 
	 */
	public bIsLog() {
		return DEBUG || DeviceUtil.isNativeCheckLog();
	}

	/**
   * 数字转换中文
   */
	public static toChinesNum(num: number): string {
		const changeNum = [
		  "零",
		  "一",
		  "二",
		  "三",
		  "四",
		  "五",
		  "六",
		  "七",
		  "八",
		  "九",
		]; // changeNum[0] = "零"
		const unit = ["", "十", "百"];
		let strWeek = "";
		let strHundred = "";
		let decimal = 0;
	
		if (num > 99) {
		  decimal = num % 100;
		  if (decimal === 0) {
			return changeNum[Math.floor(num / 100)] + "百";
		  }
		  if (decimal < 10) {
			strHundred = changeNum[Math.floor(num / 100)] + "百零";
		  } else if (decimal > 10 && decimal < 20) {
			strHundred = changeNum[Math.floor(num / 100)] + "百一";
		  } else {
			strHundred = changeNum[Math.floor(num / 100)] + "百";
		  }
		} else {
		  decimal = num;
		}
	
		if (decimal < 10) {
		  strWeek = changeNum[decimal];
		} else {
		  if (decimal % 10 === 0) {
			if (decimal === 10 && num < 99) {
			  strWeek = unit[1];
			} else {
			  strWeek = changeNum[decimal / 10] + unit[1];
			}
		  } else if (decimal < 20) {
			strWeek = unit[1] + changeNum[decimal % 10];
		  } else {
			strWeek =
			  changeNum[Math.floor(decimal / 10)] +
			  unit[1] +
			  changeNum[decimal % 10];
		  }
		}
		return strHundred + strWeek;
	  }
}