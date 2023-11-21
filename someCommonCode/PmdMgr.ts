/**跑马灯效果管理器*/
class PmdMgr extends BaseSystem {
	//礼物个数
	private num: number = 14;
	//正常转次数，可调整
	private Normalcount: number = 3;
	//缓动转圈数，
	private Tweencount: number = 2;
	//缓动转次数，
	private TweenTimes: number = 0;
	//正常间隔，可调整
	private NormalTimeGap: number = 25;
	//缓动时间间隔，暂无效
	private TweenTimeGap: number = 25;
	//缓动时间递增,可调整
	private tweentimeSpeed: number = 10;
	//转动次数
	private count: number = 0;
	//当前转动的index
	private curIndex: number = 0;
	//目标index
	private targetIndex: number = 0;
	private timer: number;
	private tm: egret.Timer;
	private bRunning: boolean = false;
	private showFunc: Function;
	private targetobj: egret.DisplayObject;
	private bNormal: boolean = true;
	public bStart: boolean = false;
	public constructor() {
		super();
	}
	/**
	 * 初始化配置表
	 */
	public Init() {

	}
	/**
	 * 单例回调，注意修改回调对象
	 */
	public static ins(): PmdMgr {
		return super.ins();
	}

	public setConfig(num, Normalcount, Tweencount, NormalTimeGap, tweentimeSpeed) {
		this.num = num;
		this.Normalcount = Normalcount;
		this.Tweencount = Tweencount;
		this.NormalTimeGap = NormalTimeGap;
		this.tweentimeSpeed = tweentimeSpeed;
	}
	private bIsNormal() {
		return this.bNormal;
	}
	public bind(func: Function, obj: egret.DisplayObject) {
		this.showFunc = func;
		this.targetobj = obj;
	}
	public start(target: number) {
		if (!this.bStart) {
			this.bStart = true;
			this.curIndex = 0;
			this.targetIndex = target;
			let allTweenNum = this.Tweencount * this.num + this.targetIndex;
			this.TweenTimes = allTweenNum;
			this.timer = this.NormalTimeGap;
			this.startTimer();
			// dengmlLog.log("开始时间", egret.getTimer())
		} else {
			UserTips.InfoTip('正在抽奖，请先等待抽奖结束再继续');
		}
	}
	public stop(target: number) {
		if (this.tm) {
			this.tm.stop();
			this.tm = undefined;
		}
		this.targetIndex = target;
		this.count = 0;
		this.bRunning = false;
		this.bNormal = true;
		this.curIndex = 0;
		this.timer = 0;
		if (this.showFunc) {
			this.showFunc.call(this.targetobj, this.targetIndex)
		}
		this.bStart = false;
		//发起使用
		// dengmlLog.log("结束时间", egret.getTimer())
		MessageCenter.ins().dispatch(MessageDef.LUCK_END);
	}

	public stopTarget(): void {
		if (this.targetIndex) {
			this.stop(this.targetIndex);
		}
	}

	public resetTargetIndex(): void {
		this.targetIndex = null;
	}

	public cancel(target: number) {
		if (this.tm) {
			this.tm.stop();
			this.tm = undefined;
		}
		this.targetIndex = target;
		this.count = 0;
		this.bRunning = false;
		this.bNormal = true;
		this.curIndex = 0;
		this.timer = 0;
		this.bStart = false;

	}

	public startTimer() {
		if (!this.tm && !this.bRunning) {
			this.tm = new egret.Timer(this.timer, 1)
			this.tm.once(egret.TimerEvent.TIMER_COMPLETE, this.onNext, this);
			this.bRunning = true;
			this.tm.start();
		}
	}
	private checkNormal() {
		if (this.bNormal) {
			this.bNormal = (this.count <= this.Normalcount);
			if (!this.bNormal) {
				this.count = 0;
			}
		}
	}

	private onNext() {
		if (this.bIsNormal()) {
			this.bRunning = false;
			this.curIndex++;
			if (this.curIndex >= this.num) {
				this.count++;
				this.checkNormal();
				this.curIndex = 0;
			}
			this.timer = this.NormalTimeGap;
			this.tm.stop();
			this.tm = undefined;
			this.startTimer();
		} else {
			this.curIndex = MathUtils.Loop(this.curIndex + 1, 0, this.num - 1)
			this.count++;
			if (this.count >= this.TweenTimes) {
				//结束
				this.stop(this.targetIndex)
			} else {
				this.bRunning = false;
				this.timer += this.tweentimeSpeed;
				this.tm.stop();
				this.tm = undefined;
				this.startTimer();
			}
		}
		if (this.showFunc) {
			if (this.bStart) {
				this.showFunc.call(this.targetobj, this.curIndex)
			}
		}
	}
	public onDestory() {
		this.targetobj = null;
		this.showFunc = null;
		if (this.tm) {
			this.tm.stop();
			this.tm = undefined;
		}
		//重新设置回默认的值
		PmdMgr.ins().setConfig(14, 3, 2, 25, 10)
	}

}