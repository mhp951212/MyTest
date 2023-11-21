class MathUtils {
    /**
     * 弧度制转换为角度值
     * @param radian 弧度制
     * @returns {number}
     */
    public static getAngle(radian) {
        return 180 * radian / Math.PI;
    }

    /**
     * 角度值转换为弧度制
     * @param angle
     */
    public static getRadian(angle) {
        return angle / 180 * Math.PI;
    }

    /**
     * 获取两点间弧度
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getRadian2(p1X, p1Y, p2X, p2Y) {
        var xdis = p2X - p1X;
        var ydis = p2Y - p1Y;
        return Math.atan2(ydis, xdis);
    }

    /**
     * 获取两点间距离
     * @param p1X
     * @param p1Y
     * @param p2X
     * @param p2Y
     * @returns {number}
     */
    public static getDistance(p1X, p1Y, p2X, p2Y) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        var disQ = disX * disX + disY * disY;
        return Math.sqrt(disQ);
    }

    public static GetDisSqrt(p1X: number, p1Y: number, p2X: number, p2Y: number) {
        var disX = p2X - p1X;
        var disY = p2Y - p1Y;
        return disX * disX + disY * disY;
    }

    public static GetDisSqrt2(pos1: { x: number, y: number }, pos2: { x: number, y: number }) {
        var disX = pos1.x - pos2.x;
        var disY = pos1.y - pos2.y;
        return disX * disX + disY * disY;
    }

    /** 角度移动点 */
    public static getDirMove(angle, distance, p?: egret.Point) {
        p = p || new egret.Point();
        p.x = Math.cos(angle * Math.PI / 180) * distance;
        p.y = Math.sin(angle * Math.PI / 180) * distance;
        return p;
    }

    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public static limit($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        var range = $end - $from;
        return $from + Math.random() * range;
    }

    /**
     * 获取一个区间的随机数(整数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public static limitInteger($from, $end) {
        return Math.round(this.limit($from, $end));
    }

    /**
     * 获取一个区间的随机数
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}    (最小值, 最大值]
     */
    public static limit_v1($from, $end) {
        $from = Math.min($from, $end);
        $end = Math.max($from, $end);
        let range = $end - $from;
        return $from + Math.random() * (range - 1);
    }

    /**
     * 获取一个区间的随机数(整数)
     * @param $from 最小值
     * @param $end 最大值
     * @returns {number}
     */
    public static limitInteger_v1($from, $end) {
        return Math.round(this.limit_v1($from, $end));
    }

    /**
     * 在一个数组中随机获取一个元素
     * @param arr 数组
     * @returns {any} 随机出来的结果
     */
    public static randomArray(arr) {
        var index = Math.floor(Math.random() * arr.length);
        return arr[index];
    }

    /**
     * 在数组里面获得随机不重复的n个对象
     * 当 n>=length时，默认为打乱数组顺序并返回
     * @param source目标数组
     * @param n 个数
     */
    public static RandomArrayData<T>(source: T[], n: number): T[] {
        let len = source.length;
        if (n > len) {
            n = len;
        }
        let result = [];
        for (let i = 0; i < n; i++) {
            var index = GameUtils.random(0, len - 1);
            len--;
            result[i] = source[index];
            source.splice(index, 1);
        }
        return result;
    }

    public static RandomArr(min: number, max: number, n: number): number[] {
        let len = max - min + 1;
        if (max < min || n > len) {
            return [];
        }
        //初始化给定范围的待选数组
        let source = [];
        for (let i = min; i < min + len; i++) {
            source[i - min] = i;
        }
        return this.RandomArrayData(source, n);
    }
    /**
     * 判断目标值是否在[min,max)内
     * @param target 目标值
     * @param min 最小值
     * @param max 最大值
     */
    public static bInSide(target: number, min: number, max: number) {
        if (min > max) {
            let tmp = min + max
            min = tmp - min
            max = tmp - min;
        }
        return target >= min && target < max;
    }

    /**
     * 阈值夹角，限制值不小于最小值，不大于最大值
     */
    public static Clamp(value: number, min: number, max: number): number {
        if (min > max) {
            let tmp = min
            min = max
            max = tmp;
        }
        if (value < min) {
            return min;
        }
        if (value > max) {
            return max;
        }
        return value;
    }

    /**
     * 阈值循环，限制值保持在[min,max]中循环，适用value每次自增/自减1
     */
    public static Loop(value: number, min: number, max: number): number {
        if (value < min) {
            return max;
        }
        if (value > max) {
            return min;
        }
        return value;
    }

    /**数组或对象排序方法
     */
    public static sort(object: any, compare?: (a, b) => number): any {
        let obj;
        let type = (object instanceof Array);//判定是否属数组，如果是，执行数组排序，如果不是，执行对象排序
        if (type) {//数组排序
            obj = <any[]>object;
            obj.sort(compare);
        }
        else {//对象排序
            obj = object as Object;
            let keys = [];//获取经排序后的键值
            keys = Object.keys(obj).sort(compare);
            obj = {};
            for (let key of keys) {//重新按顺序赋值
                obj[key] = object[key];
            }
        }
        object = obj;
        return object;//返回结果
    }

    private static RAN_SIGN = [-1, 1];

    public static GetRandomSign(): number {
        return this.RAN_SIGN[MathUtils.limitInteger(0, 1)];
    }

    public static TEMP_POS = new egret.Point();

    /**  */
    public static Normalize(x: number, y: number, temp: egret.Point) {
        let magnitude = Math.sqrt(x * x + y * y);
        if (magnitude > 9.9E-06) {
            temp.x = x / magnitude;
            temp.y = y / magnitude;
        }
        else {
            temp.x = 0;
            temp.y = 0;
        }
    }

    /**
     * 线性插值
     */
    public static Lerp(sx: number, sy: number, ex: number, ey: number, t: number, temp: { x: number, y: number }) {
        if (t > 1) {
            t = 1;
        }
        else if (t < 0) {
            t = 0;
        }
        temp.x = Math.round(sx + (ex - sx) * t);
        temp.y = Math.round(sy + (ey - sy) * t);
        if(temp instanceof MapEntity)
        {
            temp.onPostionChange();
        }
    }

    // 长度向量
    public static VectorMagnitude(x: number, y: number, length: number, temp: egret.Point): void {
        this.Normalize(x, y, this.TEMP_POS);
        temp.x = Math.round(this.TEMP_POS.x * length);
        temp.y = Math.round(this.TEMP_POS.y * length);
    }

    // 向量延长线
    public static VectorExtension(sx: number, sy: number, ex: number, ey: number, len: number, temp: egret.Point) {
        this.VectorMagnitude(ex - sx, ey - sy, len, temp);
        temp.x += ex;
        temp.y += ey;
    }

    /** 复制一个数组，返回新的数组(浅拷贝) */
    public static copyArr(arr: any[]) {
        let a2 = [...arr];
        return a2;
    }

    /** 复制一个数组，返回新的数组(深拷贝,但不能拷贝函数) */
    public static copyArrDepth(arr: any[] | string) {
        let new_arr = GameUtils.parse(GameUtils.stringify(arr));
        return new_arr;
    }

    public static copyObjDepth(obj) {
        let newObj = GameUtils.parse(GameUtils.stringify(obj));
        return newObj;
    }

    public static dictLen(dict) {
        let len = 0;
        if (dict) {
            len = Object.keys(dict).length;
        }
        return len;
    }

    public static dictToArray(dict) {
        let data = [];
        for (let id in dict) {
            data.push(dict[id]);
        }
        return data;
    }

    /** 获取两点的距离 */
    public getDistance(sx: number, sy: number, ex: number, ey: number) {
        let x1 = sx - ex;
        let y1 = sy - ey;
        let distance = Math.sqrt(x1 * x1 + y1 * y1);
        return distance;
    }

    /** 判断给定点是否在终点范围外*/
    public static isOutScope(sx: number, sy: number, ex: number, ey: number, disx: number, disy: number) {
        let dx = Math.abs(sx - ex);
        let dy = Math.abs(sy - ey);
        return (dx > disx || dy > disy);
    }

    /** 判断点是否在指定距离的边界位置 */
    public static inBorder(sx: number, sy: number, ex: number, ey: number, disx: number, disy: number) {
        let dx = Math.abs(sx - ex);
        let dy = Math.abs(sy - ey);
        return (dx == disx && dy <= disy) || (dx <= disx && dy == disy);
    }

    public static getYDistance(p: number) {
        if (p > 0) {
            return Math.floor(p);
        }
        else {
            return Math.ceil(p);
        }
    }

    //判断一个点是否在矩形内部
    public static isInside(x1: number, y1: number, x4: number, y4: number, x: number, y: number): boolean {
        //默认:1点在左上,4点在右下
        if (x <= x1) {//在矩形左侧
            return false;
        }
        if (x >= x4) {//在矩形右侧
            return false;
        }
        if (y <= y1) {//在矩形上侧
            return false;
        }
        if (y >= y4) {//在矩形下侧
            return false;
        }
        return true;
    }

    /**
     * 在二维坐标系中 那么一个矩形可以由4个点来表示，(x1,y1)为最左的点，(x2,y2)为最上的点，(x3,y3)为最下的点，(x4,y4)为最右的点。
     * 给定四个点代表的矩形，再给定一个点(x,y)，判断该点是否在矩形中。
     */
    public static isInside_v1(x1: number, y1: number, x4: number, y4: number, x2: number, y2: number, x3: number, y3: number, x: number, y: number): boolean {
        //矩形边平行于x轴或y轴
        if (y1 == y2) {
            return this.isInside(x1, y1, x4, y4, x, y);
        }
        //坐标变换，把矩形转成平行，所有点跟着动
        let a: number = Math.abs(y4 - y3);
        let b: number = Math.abs(x4 - x3);
        let c: number = Math.sqrt(a * a + b * b);
        let sin: number = a / c;
        let cos: number = b / c;
        let x11: number = cos * x1 + sin * y1;
        let y11: number = -x1 * sin + y1 * cos;
        let x44: number = cos * x4 + sin * y4;
        let y44: number = -x4 * sin + y4 * cos;
        let xx: number = cos * x + sin * y;
        let yy: number = -x * sin + y * cos;
        //旋转完成，又变成上面一种平行的情况
        return this.isInside(x11, y11, x44, y44, xx, yy);
    }

    public static isPhone(phone: string) {
        if (StringUtils.IsNullOrEmpty(phone)) {
            return false;
        }
        //通过正则表达式判断手机号码格式是否正确,根据电信，联通、移动手机号码规则可以到以下正则
        // 手机号码第一位是[1]开头，第二位[3,4,5,7,8,9]中的一位，第三位到第十一位则是[0-9]中的数字；
        //^1表示开头为1
        //[3|4|5|7|8] 表示3、4、5、7、8中的一位数值
        //[0-9]{9} 匹配包含0-9的数字
        let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
        if (reg.test(phone)) {
            return true;//手机号码正确
        }
        return false;
    }

    /** 是否是汉字 */
    public static isChinese(str: string): boolean{
        let reg = /[\u4E00-\u9FA5]/g;
        return reg.test(str);
    }

    public static chnDigOneOrTwo(str: string): boolean {
        if (StringUtils.IsNullOrEmpty(str)) {
            return false;
        }
        let reg = /^[0-9\u4E00-\u9FA5]{1,2}$/;
        return reg.test(str);
    }

    public static chnDigTwo(str: string){
        if (StringUtils.IsNullOrEmpty(str)) {
            return false;
        }
        let reg = /^[0-9\u4E00-\u9FA5]{2}$/;
        return reg.test(str);
    }

    /** 判断玩家编号 */
    public static chnDigSeven(str: string){
        if (StringUtils.IsNullOrEmpty(str)) {
            return false;
        }
        let reg = /^[0-9\u4E00-\u9FA5]{7}$/;
        return reg.test(str);
    }

    /**
     * 获取数字的整数部分 5.9取5 -5.9取-5
     * @param num 
     */
    public static getIntergerPoint(num: number): number {
        return num >= 0 ? Math.floor(num) : Math.ceil(num);
    }

    /** 十进制转换二进制数组
     * @param num 目标数字(十进制)
     * @param digits 转换成的二进制位数，位数不够，前面补0
    */
    public static decimalToBinaryArray(num: number, digits: number): number[]{
        if(num < 0 || num >= Math.pow(2, digits)) return;
        let str: string = num.toString(2);//转二进制
        let diff: number = digits - str.length;//需要补几个0
        if(diff > 0){
            str = '0'.repeat(diff) + str;
        }

        let birArrs: number[] = [];
        let strs: Array<string> = Array.from(str).reverse();
        for(let one of strs){
            birArrs.push(parseInt(one));
        }
        return birArrs;
    }
    
    public static sortOnNumber(numberList:number[]):number[]
    {
        for(var i=1;i<numberList.length;i++){
            for(var j=0;j<numberList.length-i;j++){
                if(numberList[j]>numberList[j+1]){
                    var t=numberList[j];
                    numberList[j]=numberList[j+1];
                    numberList[j+1]=t;
                }
            }
        }
        return numberList;
    }
}
