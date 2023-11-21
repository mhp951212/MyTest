class ElsdlpMgr {
    /**
     * 轮盘格子数
     */
    public grildNum: number = 0;
    /**
     * 正常转数
    */
    public normalNum: number = 3;
    /**
     * 缓动转数
     */
    public slowNum: number = 2;
    /**
     * 正常一圈时间
     */
    public normalTime: number = 150;
    /**
    * 缓动一圈时间
    */
    public slowTime: number = 250;
    public curState = LUCKING_STATE.END;
    public point: eui.Image;
    public targetAngle: number = 0;
    public funcF: Function
    //指针还是轮盘 0轮盘 1指针
    public type: number = 0

    constructor() {

    }

    public init(graidNum: number, point: eui.Image, type = 0) {
        this.grildNum = graidNum;
        this.point = point;
        this.type = type;
    }
    public setConfig(normalCount, normalTime, slowCount, slowTime) {
        this.normalNum = normalCount;
        this.normalTime = normalTime;
        this.slowNum = slowCount;
        this.slowTime = slowTime;
    }
    public setFinish(funcF: Function) {
        this.funcF = funcF
    }
    public start(index: number) {
        if (this.curState != LUCKING_STATE.LUCKING) {
            this.curState = LUCKING_STATE.LUCKING;
            this.point.rotation = 0
            this.turnToTarget(index);
        }
    }
    public initAngle(index) {
        //每一个格子均分角度
        let eachAngle = 360 / this.grildNum;
        //目标角度
        this.targetAngle = (eachAngle * index) % 360;
        this.point.rotation = this.targetAngle
    }
    public turnToTarget(index) {
        //每一个格子均分角度
        let eachAngle = 360 / this.grildNum;
        //目标角度
        this.targetAngle = (eachAngle * index) % 360;
        this.doCircle();
    }
    public addTweenOpr(target: egret.Tween, waitTime: number, nextAngle: number) {
        return target.wait(waitTime).call(() => {
            this.point.rotation = nextAngle;
        }, this)
    }
    public doCircle() {
        if (this.point) {
            if (this.type == 0) {
                let eachAngle = 360 / this.grildNum;
                egret.Tween.removeTweens(this.point);
                this.point.rotation = 0;
                let target = egret.Tween.get(this.point);
                for (let i = 0; i < this.normalNum * this.grildNum; i++) {
                    target = this.addTweenOpr(target, this.normalTime / this.normalNum, (i + 1) * eachAngle);
                }
                let index = this.targetAngle / eachAngle;
                for (let i = 0; i < this.slowNum * this.grildNum + index; i++) {
                    target = this.addTweenOpr(target, this.slowTime / this.slowNum, (i + 1) * eachAngle);
                }
                target.call(e => {
                    this.curState = LUCKING_STATE.END;
                    this.handleEnd();
                }, this)
            } else {
                let normalAngle = 360 * this.normalNum;
                let slowAndle = 360 * this.slowNum;
                egret.Tween.get(this.point)
                    .to({ rotation: normalAngle }, this.normalNum * this.normalTime)
                    .call(e => {
                        this.point.rotation = normalAngle, this.normalNum;
                    }, this)
                    .to({ rotation: normalAngle + slowAndle }, this.slowNum * this.slowTime)
                    .call(e => {
                        this.point.rotation = 0;
                    }, this)
                    .to({ rotation: normalAngle + slowAndle + this.targetAngle }, this.slowTime).call(e => {
                        this.curState = LUCKING_STATE.END;
                        this.handleEnd();
                    }, this)
            }
        }
    }
    private handleEnd() {
        if (this.funcF) {
            this.funcF();
        }
    }
    public destory() {
        if (this.point) {
            egret.Tween.removeTweens(this.point)
            this.point = null;
        }
        this.funcF = null;
        this.curState = LUCKING_STATE.END;
    }
    public bLucking() {
        return this.curState == LUCKING_STATE.LUCKING;
    }


}
const enum LUCKING_STATE {
    LUCKING = 1,
    END = 2
}