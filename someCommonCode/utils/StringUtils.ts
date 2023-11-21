class StringUtils {

    public static IsNullOrEmpty(str: any): boolean {
        // if (typeof(str) != "string") {
        //     return false
        // }
        return str == null || str == "";
    }

    /**
     * 去掉前后空格
     * @param str
     * @returns {string}
     */
    public static trimSpace(str) {
        return str.replace(/^\s*(.*?)[\s\n]*$/g, "$1");
    };

    /**
     * 获取字符串长度，中文为2
     * @param str
     */
    public static getStringLength(str) {
        var strArr = str.split("");
        var length = 0;
        for (var i = 0; i < strArr.length; i++) {
            var s = strArr[i];
            if (this.isChinese(s)) {
                length += 2;
            }
            else {
                length += 1;
            }
        }
        return length;
    };

    /**
     * 判断一个字符串是否包含中文
     * @param str
     * @returns {boolean}
     */
    public static isChinese(str) {
        var reg = /^[\u4E00-\u9FA5]+$/;
        if (!reg.test(str)) {
            return true;
        }
        return false;
    };

    /**
     * 获取字符串的字节长度
     * 一个中文算2两个字节
     */
    public static strByteLen(str) {
        // var byteLen = 0;
        // var strLen = str.length;
        // for (var i = 0; i < strLen; i++) {
        //     byteLen += str.charCodeAt(i) >= 0x7F ? 2 : 1;
        // }
        // return byteLen;

        var ch;//, st, re = [];
        let len = 0;
        for (var i = 0; i < str.length; i++) {
            ch = str.charCodeAt(i);  // get char  
            do {
                ++len;
                ch = ch >> 8;          // shift value down by 1 byte  
            }
            while (ch);
        }
        return len;
    }

    /**
     * 补齐字符串
     * @param 源字符串
     * @param 指定的字节长度
     * @param 填补的字符
     * @param 是否忽略HTML代码
     * @return
     *
     */
    public static complementByChar(str, length, char: string = " ", ignoreHtml: boolean = true) {
        str = str + "";
        var byteLen = this.strByteLen(ignoreHtml ? str.replace(StringUtils.HTML, "") : str);
        return str + this.repeatStr(char, length - byteLen);
    }

    /**
     * 重复指定字符串count次
     */
    public static repeatStr(str, count) {
        var s = "";
        for (var i = 0; i < count; i++) {
            s += str;
        }
        return s;
    };

    /**
     * 为文字添加颜色
     * */
    public static addColor(content: string, color: number): string {
        color = color || 0;
        content = content == null ? "" : content;
        var colorStr;
        if (typeof (color) == "string") {
            colorStr = String(color);
        }
        else if (typeof (color) == "number") {
            colorStr = "0x" + Number(color).toString(16);
        }
        return "|C:" + colorStr + "&T:" + content + "|";
    };

    public static HTML = /<[^>]+>/g;

    public static Format(str: string, ...args: any[]): string {
        let result = str;
        if (args.length > 0) {
            if (args.length == 1 && typeof (args[0]) == "object") {
                let objStr = args[0];
                for (let key in objStr) {
                    if (objStr[key] != undefined) {
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, objStr[key]);
                    }
                }
            }
            else {
                for (let i = 0; i < args.length; ++i) {
                    if (args[i] != undefined) {
                        var reg = new RegExp("({)" + i + "(})", "g");
                        result = result.replace(reg, args[i]);
                    }
                }
            }
        }
        return result;
    }
    
    /** 交互里节日格式 */
    public static FormatHoliday(result: string, ...args: any[]) {
        if (!result) {
            return "";
        }
        let newStr: string = '';
        let strArr = result.split("$");
        if (strArr.length > 1) {
            newStr = strArr[0];
            let argsActive: boolean = true;
            if (args && args.length > 0){
                for(var one of args){
                    if(this.IsNullOrEmpty(one)) {
                        argsActive = false;
                        break;
                    }
                }
            }else{
                argsActive = false;
            }
            if (argsActive) {
                newStr += this.FormatS(strArr[1], args);
            }
        } else {
            newStr = this.FormatS(result, args);
        }
        return newStr;
    }

    public static FormatS(result: string, ...args: any[]) {
        let arg = Util.getArgs(args);
        args = arg
        if (!result) {
            return "";
        }
        if (!args || !args.length) {
            return result;
        }
        var newStr = "";
        var index = 0;
        let values = result.split(/(%d|%s)/g);
        for (var value of values) {
            if (!/(%d|%s)/g.test(value)) {
                if (value != undefined) {
                    newStr += value;
                }
            }
            else {
                let pram = args[index++];
                if (pram != undefined) {
                    newStr += (`${pram}`);
                }
            }
        }
        return newStr;
    }

    /** 主角 */
    public static FormatZJ(result: string, ...args: any[]) {
        if (!result) {
            return "";
        }
        if (!args || !args.length) {
            return result;
        }
        var newStr = "";
        var index = 0;
        for (var value of result.split(/(%z|%j)/g)) {
            if (/(%z)/g.test(value)) {
                newStr = newStr + (args[0] || "");
            }
            else if (/(%j)/g.test(value)) {
                newStr = newStr + (args[1] || "");
            }
            else {
                newStr = newStr + value;
            }
        }
        return newStr;
    }

    public static FormatTaskDialogue(result: string, ...args: any[]) {
        if (!result) {
            return "";
        }
        if (!args || !args.length) {
            return result;
        }
        var newStr = "";
        var index = 0;
        for (var value of result.split(/(%m|%i|%n|%l)/g)) {
            if (/(%m)/g.test(value)) {
                newStr = newStr + (args[0] || "");
            }
            else if (/(%i)/g.test(value)) {
                newStr = newStr + (args[1] || "");
            }
            else if (/(%n)/g.test(value)) {
                newStr = newStr + (args[2] || "");
            }
            else if (/(%l)/g.test(value)) {
                newStr = newStr + (args[3] || "");
            }
            else {
                newStr = newStr + value;
            }
        }
        return newStr;
    }
    public static ToSingleHex(value: number): string {
        let str = value.toString(16);
        if (str.length == 1) {
            return "0" + str;
        }
        return str;
    }

    public static numTenToChinese(number): string {
        switch (number) {
            case 0:
                return "零";
            case 1:
                return "一";
            case 2:
                return "二";
            case 3:
                return "三";
            case 4:
                return "四";
            case 5:
                return "五";
            case 6:
                return "六";
            case 7:
                return "七";
            case 8:
                return "八";
            case 9:
                return "九";
            case 10:
                return "十";
        }
        return "";
    }


    public static numberToChinese(num: number): string {
        let chinese: string;
        if (num <= 10) {
            chinese = StringUtils.numTenToChinese(num);
        }
        else if (num < 100) {
            let gw = num % 10;
            let sw = num / 10;
            if (gw == 0) {
                chinese = StringUtils.numTenToChinese(Math.floor(sw)) + "十";
            }
            else {
                if (sw < 2) {
                    chinese = "十" + StringUtils.numTenToChinese(gw);
                }
                else {
                    chinese = StringUtils.numTenToChinese(Math.floor(sw)) + "十" + StringUtils.numTenToChinese(gw);
                }
            }
        }
        return chinese;
    }

    /**
     * 获取属性描述，带有换行符
     * @param key 键
     * @param value 值
     * @param flag 中间间隔符号
     * @param bLast 是否是最后一行，决定要不要增加换行符
     */
    public static getAttrDesc(key: string, value: any, flag: string, bLast: boolean = false,size:number=-1,colorKey:number=-1,colorValue:number=-1): string {
        if(colorKey!=-1)
        {
            key =  "<font color = '"+colorKey+"'>" + key + "</font>"
        }
        if(colorValue!=-1)
        {
            value =  "<font color = '"+colorValue+"'>" + flag+value + "</font>"
        }else
        {
            value=flag+value;
        }
        let str = key  + value;
        if(size!=-1)
        {
            str="<font size = '"+size+"'>" + str + "</font>";
        }

        if (!bLast) {
            str += "\n";
        }
        return str;
    }

    /**把<br/>转化为换行符 */
    public static handleBRString(str: string): string {
        let data = str.split(`<br/>`);
        if (data.length > 1) {
            let newStr = "";
            for (let s of data) {
                newStr += s + `\n`;
            }
            return newStr.trim();
        }
        return str;
    }

    /**换算货币格式
     * 每隔3位增加一个，号
     */
    public static getPriceFormat(num: any): string {
        // return `${num}`;
        let str = num + ``;
        str = str.trim();
        let strArr = [];
        for (let i = 0; i < str.length; i++) {
            strArr.push(str[i]);
        }
        let start = 0;
        let end = strArr.length - 3;
        while (start < end) {
            strArr.splice(end, 0, `,`);
            end -= 3;
        }

        str = ``;
        for (let i = 0; i < strArr.length; i++) {
            str += strArr[i];
        }
        return str;
    }

    public split(str: string, len: number, flag?: string) {
        if (str.length > len) {
            str = str.slice(0, len);
        }
        if (flag) {
            str += flag;
        }
    }

    public static handleTime(time: number): string {
        let hour: number = 60 * 60;
        let min: number = 60;
        let day: number = 60 * 60 * 24;

        let curTime: number = GameServer.serverTime - time;
        let curDay = parseInt(`` + (curTime / day));
        if (curDay > 0) {
            return curDay + `天前`;
        }
        let curHour = parseInt(`` + (curTime / hour));
        if (curHour > 0) {
            return curHour + `小时前`;
        }
        let curMin = parseInt(`` + (curTime / min));
        if (curMin > 0) {
            return curMin + `分钟前`
        }
        return "1分钟前";
    }

    public static handleRestTime(time: number): string {
        let hour: number = 60 * 60;
        let min: number = 60;
        let day: number = 60 * 60 * 24;
        if(time==0){
            return `无`
        }
        let curTime: number = time - GameServer.serverTime;
        let curDay = parseInt(`` + (curTime / day));
        if (curDay > 0) {
            return curDay + `天`;
        }
        let curHour = parseInt(`` + (curTime / hour));
        if (curHour > 0) {
            return curHour + `小时`;
        }
        let curMin = parseInt(`` + (curTime / min));
        if (curMin > 0) {
            return curMin + `分钟`
        }
        return "已过期";
    }

    public static timeTwoPosition(h: number): string {
        let str: string = '';
        if (h < 10) {
            str += '0' + h.toString();
        } else {
            str += h.toString();
        }
        return str;
    }

    public static conversionPhone(phone: string) {
        if (StringUtils.IsNullOrEmpty(phone)) return '';
        let showPhone = phone.substr(0, 3) + '*****' + phone.substr(8);
        return showPhone;
    }
    public static gbLen(str: string) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 127 || str.charCodeAt(i) == 94) {
                len += 2;
            } else {
                len++;
            }
        }
        return len;
    }

    public static isEmpty(obj){
        if(typeof obj == "undefined" || obj == null || obj == ""){
            return true;
        }else{
            return false;
        }
    }

    public static sortStr(str:string):string
	{
		let len:number=str.length;
		let list=[];
		for(let i:number=0;i<len;i++)
		{
			list.push(str.charAt(i));
		}
		list=MathUtils.sortOnNumber(list);
		return list.join("");
	}

    public static handleTipContent(originStr:string, replaceStr:any[]){
        // let text = MathUtils.copyArrDepth(originStr)
        var text = ''
		let texts = originStr.split("%s");
		if (texts.length > 1) {
			let ind = 0;
			let str = "";
			for (let i = 0; i < texts.length; i++) {
				str += texts[i];
				if (replaceStr[ind] != null) {
					str += replaceStr[ind]
					ind++;
				}
			}

			text = str;
		}
        return text
    }
}