class TextFlowMaker {
    private static EMPTY_TABLE = [];

    /**
     * "你好|S:18&C:0xffff00&T:带颜色字号|S:50&T:大号字体|C:0x0000ff&T:带色字体";
     * @param sourceText
     * @returns {Array}
     */
    public static generateTextFlow(sourceText: string): egret.ITextElement[] {
        if (!sourceText) {
            return this.EMPTY_TABLE;
        }
        var textArr = sourceText.split("|");
        var str = "";
        for (var i = 0, len = textArr.length; i < len; i++) {
            let text = textArr[i];
            if (!text || text.length == 0) {
                continue;
            }

            str += this.getSingleTextFlow1(text);
        }
        return new egret.HtmlTextParser().parser(str);
    };

    public static generateTextFlowTest(sourceText: string): egret.ITextElement[] {
        if (!sourceText) {
            return this.EMPTY_TABLE;
        }
        var textArr = sourceText.split("|");
        var str = "";
        for (var i = 0, len = textArr.length; i < len; i++) {
            let text = textArr[i];
            if (!text || text.length == 0) {
                continue;
            }
            // if (text.startsWith('C')) {
            //     let rep = text.substring(2, 10);
            //     text = text.replace(rep, '0x019704');
            // } else {
            //     text = `C:0x377A77&T:${text}`;
            // }
            str += this.getSingleTextFlow1(text);
        }
        return new egret.HtmlTextParser().parser(str);
    };


    public static generateTextFlowAndReplace(sourceText: string, replace: string): egret.ITextElement[] {
        let endStr = sourceText.replace(`%s`, replace);
        return TextFlowMaker.generateTextFlow(endStr);
    }

    public static generateTextFlow1(sourceText) {
        var textArr = sourceText.split("|");
        var result = [];
        for (var i = 0, len = textArr.length; i < len; i++) {
            if(textArr[i]!=""){//如果是空的，对于native端会有影响，屏蔽掉，不清楚是否会对web端有影响，如果出现问题，再确定处理方案
            result.push(this.getSingleTextFlow(textArr[i]));
            }
        }
        return result;
    };

    public static getSingleTextFlow1(text, replaceColor?: string) {
        var str = "<font";
        var textArr = this.Match(text);
        var tempArr;
        var t;
        for (var i = 0, len = textArr.length; i < len; i++) {
            let type = textArr[i].type;
            let value = textArr[i].value;

            if (type == this.PROP_TEXT) {
                t = value;
            }
            else if (type == this.STYLE_SIZE) {
                str += " size=\"" + parseInt(value) + "\"";
            }
            else if (type == this.STYLE_COLOR) {
                value = replaceColor || value;
                str += " color=\"" + parseInt(value) + "\"";
            }
            else {
                t = value;
            }
        }
        str += ">" + t + "</font>";

        return str;
    };

    public static getSingleTextFlow(text) {
        let textArr = this.Match(text);
        var textFlow: any = { "style": {} };
        for (var i = 0, len = textArr.length; i < len; i++) {
            let type = textArr[i].type;
            let value = textArr[i].value;
            if (type == this.PROP_TEXT) {
                textFlow.text = value;
            }
            else if (type == this.STYLE_SIZE) {
                textFlow.style.size = parseInt(value);
            }
            else if (type == this.STYLE_COLOR) {
                textFlow.style.textColor = parseInt(value);
            }
            else {
                textFlow.text = value;
            }
        }
        return textFlow;
    };

    public static consumeLabel(value, max, isShowMax = true): egret.ITextElement[] {
        let str = "";
        if (value != null && !isNaN(value)) {
            if (isShowMax) {
                str += (value < max ? "|C:0xff0000&T:" : "|C:0x019704&T:") + value + "|/" + max;
            }
            else {
                str += value;
            }
        }
        return this.generateTextFlow(str);
    }


    static _REG = new RegExp("&?[SCTU]:");

    static LIST = [];

    private static Match(str: string) {

        if (str == null) {
            return;
        }
        let preType = null;
        let preStr = "";
        this.LIST.length = 0;
        for (let i = 0; i < 99; ++i) {
            let data = str.match(this._REG);
            if (data == null || data.index == -1) {
                this.LIST.push({
                    type: preType,
                    value: str
                });
                break;
            }
            if (preType != null) {
                this.LIST.push({
                    type: preType,
                    value: str.substr(0, data.index)
                });
            }
            preType = data[0].replace("&", "").replace(":", "");
            str = str.substr(data.index + data[0].length);
        }

        return this.LIST;
    }


    public static getCStr(e) {
        return this.numberList[e] ? this.numberList[e] : "";
    }

    /**
     * 获取文本富文本-对于同一字体大小不同文字颜色
     * @param arg 传入数组-格式- "xxxxx-0x000066|text-color二进制"
     */
    public static getRTFTextArr(textStr:string){
        let textArr = textStr.split("|")
        let textFlowArr = []
        for (let index = 0; index < textArr.length; index++) {
            const element = textArr[index]
            const eleArr = element.split("-")
            let dic = {text: eleArr[0], style: {textColor:Number(eleArr[1])}}
            textFlowArr.push(dic)
        }
        return textFlowArr
    }

    public static STYLE_COLOR = "C";
    public static STYLE_SIZE = "S";
    public static PROP_TEXT = "T";
    public static UNDERLINE_TEXT = "U";
    public static numberList = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四"]

}