/**场景工具类？ */
class StageUtils extends BaseSystem {

    public static readonly WIDTH = 720
    public static readonly HEIGHT = 1280
    public static readonly HEIGHT2 = 960
    //stage的首层，可以理解为layerManager的root层
    private static _uiStage: eui.UILayer;
    //开始游戏前初始化游戏配置
    public constructor() {
        super()
    }
    public static ins(): StageUtils {
        return super.ins()
    }



    public initUIStage() {
        if (StageUtils._uiStage) {
            StageUtils._uiStage.removeChildren()
            StageUtils._uiStage.removeSelf()
            StageUtils._uiStage = undefined
        }
        StageUtils._uiStage = new eui.UILayer();
        StageUtils._uiStage.name = "UIStage"
        StageUtils._uiStage.touchEnabled = false;
        StageUtils._uiStage.touchThrough = true
        StageUtils._uiStage.percentHeight = 100;
        StageUtils._uiStage.percentWidth = 100;
        // console.warn("initUIStage", StageUtils._uiStage)
        this.GetStage().addChildAt(StageUtils._uiStage, 0);
    }

    public GetHeight(): number {
        return this.GetStage().stageHeight;
    }

    /**
     * 获取游戏宽度
     */
    public GetWidth(): number {
        return this.GetStage().stageWidth;
    }

    /**
     * 指定此对象的子项以及子孙项是否接收鼠标/触摸事件
     * @param value
     */
    public setTouchChildren(value: boolean): void {
        this.GetStage().touchChildren = value;
    }

    /**
     * 设置同时可触发几个点击事件，默认为2
     */
    public SetMaxTouches(value: number): void {
        this.GetStage().maxTouches = value;
    }

    /**
     * 设置帧频
     */
    public SetFrameRate(value: number): void {
        this.GetStage().frameRate = value;
    }

    public GetStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }

    /**
     * 获取唯一UIStage
     */
    public GetUIStage(): eui.UILayer {
        if (!StageUtils._uiStage) {
            this.initUIStage()
        }
        return StageUtils._uiStage;
    }
    /**
 * 获取唯一UIStage
 */
    public clean() {
        if (StageUtils._uiStage) {
            if (StageUtils._uiStage.parent) {
                  StageUtils._uiStage.removeChildren()
                StageUtils._uiStage.removeSelf()
                StageUtils._uiStage = undefined
            }
        }
        //场景移除所有
    }
    public setBackgroupColor(color: string = `#205955`) {
        let body = document.getElementsByTagName("div")[0]
        if (body) {
            body.style.backgroundColor = color;
        }
    }

    /** 锁住舞台，指引那边调用 */
    public unlockStage(unlock: boolean) {
        if (this.GetUIStage()) {
            this.GetUIStage().touchEnabled = unlock;
            caoyyLog.log(` >> 舞台状态`, unlock ? '解锁' : '锁住');
        } else {
            caoyyLog.log('stage is null');
        }

    }
}