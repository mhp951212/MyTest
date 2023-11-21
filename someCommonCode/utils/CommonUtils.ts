/**
 * 通用工具类
 */
class CommonUtils {


    /**
     * 给字体添加描边
     */
    public static addLableStrokeColor(lable, color, width) {
        lable.strokeColor = color;
        lable.stroke = width;
    };
    /**
     * 获取一个对象的长度
     * @param list
     */
    public static getObjectLength(list) {
        var num = 0;
        for (var i in list) {
            num++;
        }
        return num;
    };
    /**
     * 深度复制
     * @param _data
     */
    public static copyDataHandler(obj) {
        var newObj;
        if (obj instanceof Array) {
            newObj = [];
        }
        else if (obj instanceof Object) {
            newObj = {};
        }
        else {
            return obj;
        }
        var keys = Object.keys(obj);
        for (var i = 0, len = keys.length; i < len; i++) {
            var key = keys[i];
            newObj[key] = this.copyDataHandler(obj[key]);
        }
        return newObj;
    };

    public static CopyTo(src, des) {
        var keys = Object.keys(src);
        for (let key of keys) {
            des[key] = this.copyDataHandler(src[key])
        }
    }

    public static labelIsOverLenght(label, num) {
        label.text = this.overLength(num);
    };


    public static overLength(num, isInt: boolean = false) {
        if (num == null) {
            return ""
        }
        var str = null;
        if (num < 10000) {
            str = num;
        } else if (num >= 100000000) {
            // num = (num / 100000000);
            // num = Math.floor(num * 10) / 10;
            // str = num + "亿";
            if (num >= 1000000000) {
                num = (num / 100000000);
                num = Math.floor(num * 100) / 100;
                str = num + "亿";
            } else {
                str = Math.floor((num / 100000000)) + "亿"
                num = num % 100000000
                if (num > 10000) {
                    str += (Math.floor(num / 10000) + "万")
                }
            }
        } else {
            num = (num / 10000);
            num = Math.floor(num * 10) / 10;
            if (isInt) num = Math.floor(num);
            str = num + "万";
        }
        return str;
    };

    public static GetArray(dict: any, sortKey: string = null, ascendingOrder = true): any[] {
        if (dict == null) {
            return []
        }
        let list = []
        for (let key in dict) {
            let data = dict[key]
            list.push(data)
        }
        if (sortKey) {
            if (ascendingOrder) {
                list.sort((lhs, rhs) => {
                    return lhs[sortKey] - rhs[sortKey]
                })
            } else {
                list.sort((lhs, rhs) => {
                    return rhs[sortKey] - lhs[sortKey]
                })
            }
        }
        return list
    }

    /** 指定键，指定值找一组表数据 */
    public static GetOneRowData(dict: any, skey: string, value: number): any {
        if (dict == null) return [];
        let list = [];
        for (let key in dict) {
            let data = dict[key];
            list.push(data);
        }
        let tdata = null;
        for (var i = 0; i < list.length; i++) {
            let test = list[i][skey];
            if (list[i][skey] == value) {
                tdata = list[i];
                break;
            }
        }
        return tdata;
    }

    /** 指定键，指定值找一组表数据 */
    public static isMatchDataByList(dict: any, skey: string, value: any, skey2: string = ''): boolean {
        let temp = dict[skey];
        if (!StringUtils.IsNullOrEmpty(skey2)) {
            temp = temp[skey2];
        }
        if (temp && temp.indexOf(value) > -1) {
            return true;
        }
        return false;
    }

    /** 最大位移长度 **/
    private static MAX_BIT_LEN: number = 32;
    /**
     * 将一个uint类型的整数转换为指定长度的Boolean元素数组
     * <li>外部要保存转换的值则必须传入result</li>
     * <li>如果没传入result，则外部只引用，不去增减</li>
     * @param value 需要转换的uint值
     * @param len 需要转换出来的数组的长度，如果大于32，则限制为32
     * @return 返回uint转换的boolean数组
     */
    public static uintToVecBool(value: number, len: number): boolean[] {
        if (len > CommonUtils.MAX_BIT_LEN) len = CommonUtils.MAX_BIT_LEN;
        let result = [];
        let i: number;
        for (i = 0; i < len; i++) result[i] = (value & (1 << i)) > 0;
        return result;
    }

    /**
     * 将一个 Vector.&lt;Boolean> 转换为一个32位整数 
     * @param data 需要转换的原始数组。如果数组是以非数字为索引，则直接返回0；如果元素是非Boolea类型的值，则自动将元素int化后，取其与0的比较值为Boolean
     * @return 返回boolean数组合成后的uint数值
     */
    public static vecBoolToUint(data: boolean[]): number {
        if (null == data) return 0;
        let len: number = data.length;
        if (0 == len) return 0;
        if (len > CommonUtils.MAX_BIT_LEN) len = CommonUtils.MAX_BIT_LEN;
        let i: number;
        let saveValue: number = 0;
        let value: number;
        for (i = 0; i < len; i++) {
            value = (true == data[i]) ? 1 : 0;
            saveValue = saveValue | (value << i);
        }
        data = null;
        return saveValue;
    }

    public static ArrayEqual(arr1: any[], arr2: any[]): boolean {
        if (!arr1 || !arr2) {
            return false
        }
        if (arr1.length != arr2.length) {
            return false
        }
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] != arr2[i]) {
                return false
            }
        }
        return true
    }

    /**
     * 获取A数组想对比B数组的不同元素
     * @param arrA
     * @param arrB
     */
    public static getInexistenceInArrB(arrA: Array<any>, arrB: Array<any>): Array<any> {
        let arr = [];
        for (let i = 0; i < arrA.length; i++) {
            const arrAElement = arrA[i];
            if (arrB.indexOf(arrAElement) == -1) {
                arr.push(arrAElement);
            }
        }
        return arr;
    }
    /**
     * 获取两个数字型数组的交集
     * @param arr1 
     * @param arr2 
     */
    public static concatNumArrDiff(arr1: number[], arr2: number[]): number[] {
        let newData: number[] = []
        for (let a1 of arr1) {
            let bhas = false;
            for (let a2 of arr2) {
                if (a1 == a2) {
                    bhas = true;
                    break;
                }
            }
            if (!bhas) {
                newData.push(a1);
            }

        }
        newData.concat(arr2)
        return newData
    }
    /**
    * 获取两个数字型数组的并集
    * @param arr1 
    * @param arr2 
    */
    public static getNumArrSame(arr1: number[], arr2: number[]): number[] {
        let newData: number[] = []
        for (let a1 of arr1) {
            for (let a2 of arr2) {
                if (a1 == a2) {
                    newData.push(a1)
                    break;
                }
            }
        }
        return newData
    }
    public static getsplitAreaStart(curNum: number, limit: number) {
        if (curNum == 0) return 0;//第一个数是0
        if (curNum <= limit) return 0;//当前小于限制
        let gap = 0
        if (curNum % limit == 0) {//刚好等于的情况，应该归于左侧
            gap = -1;
        }
        let ret = Math.floor(curNum / limit) + gap;
        return ret * limit;
    }

    /** 水平滚动条可滑动设置 */
    public static updateScrollEnableHorizontal(scroll: eui.Scroller, canScroll: boolean) {
        let str: string = canScroll ? "on" : "off";
        scroll.scrollPolicyH = str;
    }

    /** 判断两个数组是否相等 */
    public static isEqualArray(arr1: any[], arr2: any[]): boolean{
        if(arr1.length != arr2.length) {
            return false;
        }else{
            for (let i = 0; i < arr1.length; i++) {
                if (arr1[i] !== arr2[i]) {
                    return false;
                }
            }
            return true;
        }
    }

    public static numChnChar = {
        0:'零',
        1:'一',
        2:'双',
        3:'三',
        4:'四',
        5:'五',
        6:'六',
        7:'七',
        8:'八',
        9:'九',
    }
}