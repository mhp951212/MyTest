
class Painter {
    private _g: egret.Graphics;
    private _totalFrame: number;
    private _curFrame: number;
    private splashObjs: SplashObj[] = []
    private _bLoop: boolean = false;
    private _updating: boolean = false;
    constructor(gra: egret.Graphics) {
        this._g = gra;

    }
    //画一条单线
    public drawSigleLine(lineData: LineObj) {
        if (this._g) {
            this._g.lineStyle(lineData.lineWidth, lineData.lineColor, lineData.alpha);
            this._g.moveTo(lineData.startX, lineData.startY)
            this._g.lineTo(lineData.endX, lineData.endY)
        }
    }

    //画多条线
    public drawLines(lines: LineObj[]) {
        for (let line of lines) {
            this.drawSigleLine(line);
        }
    }
    //画个圆
    public drawCircle(point: CircleObj) {
        if (this._g) {
            this._g.drawCircle(point.x, point.y, point.radius)
        }
    }
    public addSplash(splashObj: SplashObj) {
        this.splashObjs.push(splashObj);
    }
    public addCircle(circleObj: CircleObj) {
        this.drawCircle(circleObj);
    }
    public start(loop: boolean = true) {
        this.updateAllFrame()
        this._bLoop = loop;
        this._curFrame = 0;
        this._updating = true;
        egret.startTick(this.updateFrame, this)
    }
    private updateFrame(dt: number) {
        this._g.clear()
        this._curFrame += 1;
        if (this._curFrame >= this._totalFrame) {
            if (this._bLoop) {
                this._curFrame = 1;
            } else {
                this.stop()
            }
        }
        let lines: LineObj[] = []
        for (let sp of this.splashObjs) {//先画背景
            lines.push(sp.getBgLineData(1));
        }
        for (let sp of this.splashObjs) {//再画流光
            let obj = sp.getLineDataByFrame(this._curFrame);
            if (obj) {
                lines.push(obj);
            }
        }
        if (this._updating)
        {
            this.drawLines(lines);
        }
        return true;
    }
    public stop() {
        for (let sp of this.splashObjs) {
            sp.clear()
        }
        egret.stopTick(this.updateFrame, this)
        this._updating = false;
        this.splashObjs = []
    }
    public destory() {
        //if (this._updating) {
            this.stop()
        //}
        this._g.clear()
    }
    private updateAllFrame() {
        let frame = -1;
        for (let sp of this.splashObjs) {
            if (frame < sp.getTotalFrame()) {
                frame = sp.getTotalFrame();
            }
        }
        this._totalFrame = frame;
    }

}
class CircleObj {
    //起始点X
    x: number
    //起始点Y
    y: number;
    //半径
    radius: number = 5;
    //线的颜色
    backgroundColor: number;
    //线的透明度
    alpha: number;
}
class LineObj {
    //起始点X
    startX: number
    //起始点Y
    startY: number;
    //结束点X
    endX: number;
    //结束点Y
    endY: number;
    //线的颜色
    lineColor: number;
    //线的宽度
    lineWidth: number;
    //线的透明度
    alpha: number;
}

//流光对象
class SplashObj {
    //起始点X
    startX: number
    //起始点Y
    startY: number;
    //结束点X
    endX: number;
    //结束点Y
    endY: number;
    //类型 0 帧率，1速度
    type: number
    //帧率
    frame: number;
    //背景颜色
    bgColor: number;
    //流光颜色
    flashColor: number;
    //线宽
    lineWidth: number;
    //最大可展示的段
    showFrame: number;

    private _pointXs: number[] = [];
    private _pointYs: number[] = [];
    /**
     * 
     * @param startX 流光起始点x
     * @param startY 流光起始点y
     * @param endX 流光结束点x
     * @param endY 流光结束点y
     * @param type 类型 0->按帧率 1->按距离(1无效)
     * @param frame 总帧率
     * @param bgColor 流光底层颜色
     * @param flashColor 流光颜色
     * @param lineWidth 光线宽
     * @param splashFrameShow 展现的流光长度
     */
    constructor(startX, startY, endX, endY, type, frame, bgColor, flashColor, lineWidth, splashFrameShow: number) {
        this.startX = startX
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.frame = frame;
        this.bgColor = bgColor;
        this.flashColor = flashColor;
        this.lineWidth = lineWidth;
        this.showFrame = splashFrameShow;
        this.type = type;
        if (type == 1) {
            this.frame = Math.floor(this.getDistance() / this.frame) + 1;
        }
        this.calcFrameShowPoints()
    }
    protected calcFrameShowPoints() {
        let eachGapX = (this.endX - this.startX) / this.frame
        let eachGapY = (this.endY - this.startY) / this.frame;
        for (let i = 0; i < this.frame; i++) {
            let nx = this.startX + eachGapX * i;
            let ny = this.startY + eachGapY * i;
            this._pointXs.push(nx)
            this._pointYs.push(ny)
        }
    }
    private getDistance() {
        let xw = Math.abs(this.endX - this.startX)
        let yh = Math.abs(this.endY - this.startY)
        return Math.round(Math.sqrt(xw * xw + yh * yh));
    }
    //获取完成的总帧数
    public getTotalFrame() {
        return this.frame + this.showFrame;
    }

    public getBgLineData(alpha) {
        let obj = new LineObj()
        obj.startX = this.startX;
        obj.startY = this.startY;
        obj.endX = this.endX;
        obj.endY = this.endY;
        obj.alpha = alpha;
        obj.lineColor = this.bgColor;
        obj.lineWidth = this.lineWidth;
        return obj;
    }
    public getLineDataByFrame(curFrame) {
        let start = curFrame - this.showFrame;
        if (start <= 0) start = 0;
        if (start >= this.frame) start = this.frame - 1;
        let end = curFrame;
        if (end >= this.frame) end = this.frame - 1;
        if (start == end) {
            return undefined;
        }
        let obj = new LineObj()
        obj.startX = this._pointXs[start];
        obj.startY = this._pointYs[start];
        obj.endX = this._pointXs[end];
        obj.endY = this._pointYs[end];
        obj.lineColor = this.flashColor;
        obj.lineWidth = this.lineWidth;
        obj.alpha = 1;
        return obj;
    }
    public clear() {
        this._pointXs = [];
        this._pointYs = [];
        this.frame = 0;
    }
}

