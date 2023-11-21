
class DateUtils {
    public static DAYS_OF_WEEK = 7;
    public static HOURS_PER_DAY = 24;
    public static SECONDS_PER_HOUR = 3600;
    public static MS_PER_SECOND = 1000;
    public static MS_PER_MINUTE = 60 * 1000;
    public static MS_PER_HOUR = 60 * 60 * 1000;
    public static MS_PER_DAY = 24 * 60 * 60 * 1000;
    public static MS_PER_WEEK = 7 * DateUtils.MS_PER_DAY;
    public static MS_PER_MONTH = 30 * DateUtils.MS_PER_DAY;
    public static MS_PER_YEAR = 12 * DateUtils.MS_PER_MONTH;
    public static MINI_DATE_TIME_BASE = Date.UTC(2010, 0) + new Date().getTimezoneOffset() * DateUtils.MS_PER_MINUTE;
    public static TIME_ZONE_OFFSET = 0;
    /**距离0时区偏移的毫秒值 */
    public static TIME_ZONE_OFFSET_MS = 8 * 60 * 60 * 1000;
    public static S_PER_MINUTE = 60;
    public static isAdapterGMT8Time: boolean = true

    public static isDst() {
        let getGMT8Date = new Date(GameServer.serverTimeMilli)
        var d1 = new Date(getGMT8Date.getFullYear(), 0, 1);
        var d2 = new Date(getGMT8Date.getFullYear(), 6, 1);
        if (d1.getTimezoneOffset() != d2.getTimezoneOffset()) {
            return true
        }
        return false
    }
    /**
     * 获取东八区的时间戳
     * times 服务器观念时间，对服务器来说，返回的应当是东八区的时间
     * 所以times 应当代表和东八区时间标识一致的时间
     */
    public static getGMT8Date(times): Date {
        if (DateUtils.isAdapterGMT8Time) {
            times += DateUtils.TIME_ZONE_OFFSET + DateUtils.getOffsetTiemWhichLocalToGMT()
        }
        let newDate = new Date(times);
        return newDate;
    }
    /**
     * 获取从本时区转换到东八区的时间差
     */
    public static getOffsetTiemWhichLocalToGMT() {

        let flag = 0
        if (DateUtils.isDst()) {
            flag = 60
        }
        return DateUtils.TIME_ZONE_OFFSET_MS + (new Date().getTimezoneOffset()) * DateUtils.MS_PER_MINUTE;
    }
    /**
     * 本地时间戳转换成gmt的时间戳
     * date 本地时间
     */
    public static getTimeStampWhichLocalToGMT(date: Date) {
        if (DateUtils.isAdapterGMT8Time) {
            return date.getTime() - DateUtils.getOffsetTiemWhichLocalToGMT()
        } else {
            return date.getTime()
        }
    }

    /**
     * 格式化字符串，返回时间戳
     * xx:xx:xx
     */
    public static FormatTimeString(str: string): number {
        if (!str) {
            return 0;
        }
        let arr = str.split(":");
        let h = arr[0] || 0;
        let m = arr[1] || 0;
        let s = arr[2] || 0;
        let date = DateUtils.getGMT8Date(GameServer.serverTimeMilli)
        date.setHours(Number(h), Number(m), Number(s));
        return date.getTime();
    }

    /**
     * 把MiniDateTime转化为距离1970-01-01的毫秒数
     * @param mdt 从2010年开始算起的秒数
     * @return 从1970年开始算起的毫秒数
     */
    public static formatMiniDateTime(mdt) {
        return DateUtils.MINI_DATE_TIME_BASE + (mdt & 0x7FFFFFFF) * DateUtils.MS_PER_SECOND;
    };

    /**转成服务器要用的时间***/
    public static formatServerTime(time) {
        return (time - DateUtils.MINI_DATE_TIME_BASE) / DateUtils.MS_PER_SECOND;
    };

    /**获取时装剩余时间 */
    public static getFashionRemain(ms) {
        let day = Math.floor(ms / this.MS_PER_DAY);
        ms -= day * this.MS_PER_DAY;
        let hour = Math.floor(ms / this.MS_PER_HOUR);
        ms -= hour * this.MS_PER_HOUR;
        let minute = Math.floor(ms / this.MS_PER_MINUTE);
        return day > 0 ? `${day}天${hour}小时` : `${hour}小时${minute}分钟`;
    }

    /**
    * 格式化时间数为两位数
    * @param  {number} t 时间数
    * @returns String
    */
    public static formatTimeNum(t: number) {

        return t >= 10 ? t.toString() : `0` + t.toString().trim();
    }

    public static formatTitleTerm(second: number) {
        let daySeconds = 24 * 60 * 60;
        let day = Math.ceil(second / daySeconds);
        return day;
    }

    private static m_StrToDate: { [key: string]: Date } = {};

    public static StrToDate(str: string): Date {
        if (str == null) {
            return null;
        }
        if (this.m_StrToDate[str]) {
            return this.m_StrToDate[str];
        }
        try {
            let array = str.split("-");
            if (array) {
                let day = array[0];
                let time = array[1];
                let ms = 0 + DateUtils.getOffsetTiemWhichLocalToGMT()
                var tempDate = DateUtils.getGMT8Date(GameServer.serverTime)
                if (day) {
                    let ymd = day.split(".");
                    if (ymd) {
                        if (ymd[0]) {
                            tempDate.setFullYear(Number(ymd[0]));
                        }
                        if (ymd[1]) {
                            tempDate.setMonth(Number(ymd[1]) - 1);
                        }
                        if (ymd[2]) {
                            tempDate.setDate(Number(ymd[2]));
                        }
                    }
                }
                if (time) {
                    let hms = time.split(":");
                    if (hms) {
                        if (hms[0]) {
                            tempDate.setHours(Number(hms[0]));
                        }
                        if (hms[1]) {
                            tempDate.setMinutes(Number(hms[1]));
                        }
                        if (hms[2]) {
                            tempDate.setSeconds(Number(hms[2]));
                        }
                    }
                }
                this.m_StrToDate[str] = tempDate;
                return tempDate;
            }
        }
        catch (e) {

        }
        console.log("invalid date => " + str);
        return null;
    }

    public static GetDay(date: Date): number {
        return date.getDay() == 0 ? 7 : date.getDay();
    }

    /**当天时间点对比 返回<0表示还没有到，0，表示正好到， >0表示已经超过 */
    public static compareOneDayTime(timeStr, h, m, s?): number {
        let timeArr = timeStr.split(":");

        let h1 = timeArr[0];
        let m1 = timeArr[1];
        let s1 = timeArr.length == 3 ? timeArr[2] : 0;
        let T1 = parseInt(this.formatTimeNum(h) + this.formatTimeNum(m) + this.formatTimeNum(s || 0));
        let T2 = parseInt(this.formatTimeNum(h1) + this.formatTimeNum(m1) + this.formatTimeNum(s1 || 0));
        return T1 - T2;
    }

    /**
     * 将{{0,00},{23,59}}格式化为19:30-20:30
     * @param timeArr
     */
    public static formatTime(timeArr: Array<Array<number>>): string {
        let timeStr: string = "";
        timeStr = `${this.formatTimeNum(timeArr[0][0])}:${this.formatTimeNum(timeArr[0][1])}-${this.formatTimeNum(timeArr[1][0])}:${this.formatTimeNum(timeArr[1][1])}`;
        if (timeStr == "00:00-23:59") {
            timeStr = "全天";
        }
        return timeStr;
    }


    public static getRemain(ms) {
        if (ms < this.MS_PER_HOUR) {
            let minute = Math.ceil(ms / this.MS_PER_MINUTE);
            return minute == 60 ? '1小时' : `${minute}分钟`;
        } else if (ms < this.MS_PER_DAY) {
            let hour = Math.ceil(ms / this.MS_PER_HOUR);
            return hour == 24 ? '1天' : `${hour}小时`;
        }
    }

    /**判断当前服务器时间是否在配置区间内 */
    public static checkIsInTimeInterval(timeArr) {
        let start = timeArr[0];
        let startTime = Date.UTC(start[0], start[1] - 1, start[2]) - DateUtils.TIME_ZONE_OFFSET_MS;
        let end = timeArr[1];
        let endTime = Date.UTC(end[0], end[1] - 1, end[2], 23, 59, 59) - DateUtils.TIME_ZONE_OFFSET_MS;
        let now = GameServer.serverTimeMilli;
        return (now >= startTime && now <= endTime);
    }
    /**判断当前服务器时间是否大于某个时间 */
    public static checkIsThanOneTime(timeArr) {
        let start = timeArr;
        let startTime = Date.UTC(start[0], start[1] - 1, start[2]) - DateUtils.TIME_ZONE_OFFSET_MS;

        let now = GameServer.serverTimeMilli;
        return now >= startTime;
    }


    /***************************************时间格式化start ************************************************/
    /**
     * 获取格式化时间 (2021/9/23 后续所有时间格式化只调用这个 当前只对之前对getFormatBySecond的调用进行了迁移 这次付费测试完再将之前所有对各个格式化函数的单独调用进行迁移)
     * @param second 秒数
     * @param formatType 格式化类型
     * @param showLength 显示长度
     */
    public static getFormatTime(second: number, formatType: TimeFormatType, showLength: number = 2): string {
        let str = '';
        let ms = second * 1000;
        let func = this[`format_${formatType}`];
        if (formatType === TimeFormatType.TYPE5) {
            str = func.call(this, ms, showLength);
        } else {
            str = func.call(this, ms);
        }
        return str;
    }

    /**
     * 格式1  00:00:00
     */
    public static format_1(ms) {
        var n = 0;
        var result = "##:##:##";
        n = Math.floor(ms / DateUtils.MS_PER_HOUR);
        result = result.replace("##", DateUtils.formatTimeNum(n));
        if (n) {
            ms -= n * DateUtils.MS_PER_HOUR;
        }
        n = Math.floor(ms / DateUtils.MS_PER_MINUTE);
        result = result.replace("##", DateUtils.formatTimeNum(n));
        if (n) {
            ms -= n * DateUtils.MS_PER_MINUTE;
        }
        n = Math.floor(ms / 1000);
        result = result.replace("##", DateUtils.formatTimeNum(n));
        return result;
    };

    /**
     * 格式2  yyyy-mm-dd h:m:s
     */
    public static format_2(ms) {
        var date = DateUtils.getGMT8Date(ms);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second;
    };

    /**
     * 格式3  00:00
     */
    public static format_3(ms) {
        var str = this.format_1(ms);
        var strArr = str.split(":");
        return strArr[1] + ":" + strArr[2];
    };

    /**
     * 格式4  xx天前，xx小时前，xx分钟前
     */
    private static format_4(ms) {
        if (ms < this.MS_PER_HOUR) {
            return Math.floor(ms / this.MS_PER_MINUTE) + "分钟前";
        }
        else if (ms < this.MS_PER_DAY) {
            return Math.floor(ms / this.MS_PER_HOUR) + "小时前";
        }
        else {
            return Math.floor(ms / this.MS_PER_DAY) + "天前";
        }
    };
    /**
     * 格式4  xx天前，xx小时前，xx分钟前
     */
    private static format_21(ms) {
        if (ms < this.MS_PER_HOUR) {
            return Math.floor(ms / this.MS_PER_MINUTE) + "分钟";
        }
        else if (ms < this.MS_PER_DAY) {
            return Math.floor(ms / this.MS_PER_HOUR) + "小时";
        }
        else {
            return Math.floor(ms / this.MS_PER_DAY) + "天";
        }
    };

    /**
     * 格式5 X天X小时X分X秒
     * @param  {number} ms                毫秒
     * @param  {number=2} showLength    显示长度（一个时间单位为一个长度）
     * @returns string
     */
    public static format_5(ms, showLength = 2): string {
        return this.FormatType5(ms, showLength, null);
    };

    /**
     * 格式6  h:m:s
     * @param  {number} ms        毫秒
     * @returns string            返回自1970年1月1号0点开始的对应的时间点（不包含年月日）
     */
    public static format_6(ms) {

        var date = DateUtils.getGMT8Date(ms);
        var hours = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();
        return this.formatTimeNum(hours) + ":" + this.formatTimeNum(minute) + ":" + this.formatTimeNum(second);
    };

    /**
     * 格式7  X天/X小时/<1小时
     * @param  {number} ms        毫秒
     * @returns string
     */
    public static format_7(ms) {
        if (ms < this.MS_PER_HOUR) {
            return "<1小时";
        }
        else if (ms < this.MS_PER_DAY) {
            return Math.floor(ms / this.MS_PER_HOUR) + "小时";
        }
        else {
            return Math.floor(ms / this.MS_PER_DAY) + "天";
        }
    };

    /**
     * 格式8  yyyy-mm-dd h:m
     * @param  {number} ms        毫秒
     * @returns string            返回自1970年1月1号0点开始的对应的时间点（不包含秒）
     */
    public static format_8(ms) {
        var date = DateUtils.getGMT8Date(ms);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        return year + "-" + month + "-" + day + " " + hours + ":" + minute;
    };

    /**
     * 格式9  x小时x分钟x秒
     * @param  {number} ms        毫秒
     * @returns string
     */
    public static format_9(ms) {
        var h = Math.floor(ms / this.MS_PER_HOUR);
        ms -= h * this.MS_PER_HOUR;
        var m = Math.floor(ms / this.MS_PER_MINUTE);
        ms -= m * this.MS_PER_MINUTE;
        var s = Math.floor(ms / 1000);
        if (h > 0) {
            return h + "时" + m + "分" + s + "秒";
        } else {
            return m + "分" + s + "秒";
        }
    };

    /**
     * 格式10 年.月.日
     * @param ms 毫秒
     * @returns 
     */
    public static format_10(ms) {

        var date = DateUtils.getGMT8Date(ms);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        let monthStr = month >= 10 ? `${month}` : `0${month}`;
        var day = date.getDate();
        let dayStr = day >= 10 ? `${day}` : `0${day}`;
        return year + "." + monthStr + "." + dayStr;

    }

    //格式11 h:m:s
    public static format_11(ms, fixation = true, dibit = false) {
        var h = Math.floor(ms / this.MS_PER_HOUR);
        ms -= h * this.MS_PER_HOUR;
        var m = Math.floor(ms / this.MS_PER_MINUTE);
        ms -= m * this.MS_PER_MINUTE;
        var s = Math.floor(ms / 1000);
        let hstr = h < 10 ? dibit ? "0" + h : h : h;
        let mstr = m < 10 ? dibit ? "0" + m : m : m;
        let sstr = s < 10 ? dibit ? "0" + s : s : s;
        if (fixation) {

            return hstr + ":" + mstr + ":" + sstr;
        }
        else {
            if (h == 0) {
                return mstr + ":" + sstr;
            }
        }
    };

    /**
     * 格式12 x天x小时x分
     * @param ms 
     * @param showLength 
     * @returns 
     */
    public static format_12(ms, showLength = 2): string {
        var result = "";
        if (showLength >= 4) {
            let d = Math.floor(ms / this.MS_PER_DAY);
            if (d > 0) {
                ms -= d * this.MS_PER_DAY;
                result += (result.length > 0 ? this.formatTimeNum(d) : d) + "天";
            }
        }
        if (showLength >= 3) {
            let h = Math.floor(ms / this.MS_PER_HOUR);
            if (h > 0) {
                ms -= h * this.MS_PER_HOUR;
                result += (result.length > 0 ? this.formatTimeNum(h) : h) + "小时";
            }
        }
        let m = Math.floor(ms / this.MS_PER_MINUTE);
        if (m > 0) {
            ms -= m * this.MS_PER_MINUTE;
            result += (result.length > 0 ? this.formatTimeNum(m) : m) + "分";
        }
        return result;
    };

    /**
     * 格式13 dd:hh:mm:ss
     * @param ms 
     * @param showLength 
     * @returns 
     */
    private static format_13(ms, showLength = 2): string {
        return this.FormatType5(ms, showLength, ":");
    };

    /**
     * 格式14 X年X月X日
     * @param ms 
     * @returns 
     */
    public static format_14(ms: number) {
        var date = DateUtils.getGMT8Date(ms || 0);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        return year + "年" + month + "月" + day + "日";
    }

    /**
     * 格式15 年-月-日
     * @param ms 
     * @returns 
     */
    private static format_15(ms: number) {
        var date = DateUtils.getGMT8Date(ms || 0);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        return year + "-" + month + "-" + day;
    }

    /**
     * 格式16 大于1天:X天X时X分(X天X时) 小于1天:00:00:00
     * @param ms 
     * @returns 
     */
    public static format_16(time: number, showM?: boolean): string {
        let str;
        if (time >= DateUtils.MS_PER_DAY) {
            let d = Math.floor(time / DateUtils.MS_PER_DAY);
            let h = Math.floor(time % DateUtils.MS_PER_DAY / DateUtils.MS_PER_HOUR);
            str = d + "天" + h + "时";
            if (showM) {
                let m = Math.floor(time % DateUtils.MS_PER_HOUR / DateUtils.MS_PER_MINUTE);
                str += m + "分";
            }
            return str;
        }
        else {
            return this.format_1(time);
        }

    }

    /**
     * 格式17 大于1天:X天X时X分X秒 小于一天:00:00:00
     * @param ms 
     * @returns 
     */
    private static format_17(time: number): string {
        let str;
        if (time >= DateUtils.MS_PER_DAY) {
            let d = Math.floor(time / DateUtils.MS_PER_DAY);
            let h = Math.floor(time % DateUtils.MS_PER_DAY / DateUtils.MS_PER_HOUR);
            let m = Math.floor(time % DateUtils.MS_PER_HOUR / DateUtils.MS_PER_MINUTE);
            let s = Math.floor(time % DateUtils.MS_PER_MINUTE / DateUtils.MS_PER_SECOND);
            str = d + "天" + h + "时" + m + "分" + s + "秒";
            return str;
        }
        else {
            return this.format_1(time);
        }

    }

    /**
     * 格式18 X天X时X分
     * @param ms 
     * @returns 
     */
    public static format_18(time: number, bshowDay: boolean = true): string {
        let str = "";
        let d = Math.floor(time / DateUtils.MS_PER_DAY);
        let h = Math.floor(time % DateUtils.MS_PER_DAY / DateUtils.MS_PER_HOUR);
        let m = Math.floor(time % DateUtils.MS_PER_HOUR / DateUtils.MS_PER_MINUTE);
        if (bshowDay) {
            if (d > 0) {
                str += d + "天";
            }
            else {
                str += "00天";
            }
        }
        if (h > 0) {
            str += h + "时";
        }
        else {
            str += "00时";
        }
        if (m > 0) {
            str += m + "分";
        }
        else {
            str += "00分";
        }
        return str;
    }

    /**
     * 格式19  yyyy年mm月dd日 h:m
     * @param  {number} ms        毫秒
     * @returns string            返回自1970年1月1号0点开始的对应的时间点（不包含秒）
     */
    public static format_19(ms) {
        var date = DateUtils.getGMT8Date(ms);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = StringUtils.timeTwoPosition(date.getHours());
        var minute = StringUtils.timeTwoPosition(date.getMinutes());
        return year + "年" + month + "月" + day + "日" + " " + hours + ":" + minute;
    };



    /**
     *   yyyy年mm月dd日 hh时mm分
     * @param  {number} ms        毫秒
     * @returns string            返回自1970年1月1号0点开始的对应的时间点（不包含秒）
     */
    public static format_openbeta_seven_rank(ms) {
        var date = DateUtils.getGMT8Date(ms);
        var year = date.getFullYear();
        var month = date.getMonth() + 1; //返回的月份从0-11；
        var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        return year + "年" + month + "月" + day + "日" + hours + "时" + minute + "分";
    };

    private static FormatType5(ms, showLength = 2, typeStr = null) {
        var result = "";
        if (showLength >= 4) {
            let d = Math.floor(ms / this.MS_PER_DAY);
            if (d > 0) {
                ms -= d * this.MS_PER_DAY;
                result += (result.length > 0 ? this.formatTimeNum(d) : d) + (typeStr ? typeStr : "天");
            }
        }
        if (showLength >= 3) {
            let h = Math.floor(ms / this.MS_PER_HOUR);
            if (h > 0) {
                ms -= h * this.MS_PER_HOUR;
                result += (result.length > 0 ? this.formatTimeNum(h) : h) + (typeStr ? typeStr : "小时");
            }
        }
        if (showLength >= 2) {
            let m = Math.floor(ms / this.MS_PER_MINUTE);
            if (m > 0) {
                ms -= m * this.MS_PER_MINUTE;
                result += (result.length > 0 ? this.formatTimeNum(m) : m) + (typeStr ? typeStr : "分");
            }
        }
        let s = Math.floor(ms / 1000);
        result += this.formatTimeNum(s) + (typeStr ? "" : "秒");

        return result;
    }

    /**  11'11'' */
    public static format_20(sTotal: number): string {
        let result: string = '';
        let m: number = Math.floor(sTotal / this.S_PER_MINUTE);
        if (m > 0) {
            sTotal -= m * this.S_PER_MINUTE;
            result += `${m}′`;
        }
        let s: number = Math.floor(sTotal % this.S_PER_MINUTE);
        result += `${s}″`;
        return result;
    }

    /**
     * 时：分
     * 格式22  00:00
     */
    public static format_22(ms) {
        var str = this.format_1(ms);
        var strArr = str.split(":");
        return strArr[0] + ":" + strArr[1];
    }

    /**
     * 格式化时间为 时:分
     * @param ms 时间戳 13位
     * @returns xx:xx
     */
    public static format_timeHM(ms) {
        var date = DateUtils.getGMT8Date(ms);
        // var year = date.getFullYear();
        // var month = date.getMonth() + 1; //返回的月份从0-11；
        // var day = date.getDate();
        var hours = date.getHours();
        var minute = date.getMinutes();
        // var second = date.getSeconds();
        return hours + ":" + minute
    };


    /**
     * 
     * @param startTimeH 开始时间 小时 h eg 6 24小时制
     * @param endTimeH 结束时间 小时 h eg 12
     * @returns 
     */
    public static checkTimeIsInSet(startTimeH:number, endTimeH:number){
        var date = DateUtils.getGMT8Date(GameServer.serverTimeMilli);
        var hours = date.getHours();
        var minute = date.getMinutes();
        if(hours >= startTimeH && hours <= endTimeH){
            return true
        }
        return false
    }

    /**
     * 格式17 大于1天:X天X时X分X秒 小于一天:00:00:00
     * @param ms 
     * @returns 
     */
    public static format_23(time: number): string {
        let str;
        if (time >= DateUtils.MS_PER_DAY) {
            let d = Math.floor(time / DateUtils.MS_PER_DAY);
            let h = Math.floor(time % DateUtils.MS_PER_DAY / DateUtils.MS_PER_HOUR);
            //let m = Math.floor(time % DateUtils.MS_PER_HOUR / DateUtils.MS_PER_MINUTE);
            //let s = Math.floor(time % DateUtils.MS_PER_MINUTE / DateUtils.MS_PER_SECOND);
            str = d + "天" + h + "小时";
            return str;
        }
        else if (time >= DateUtils.MS_PER_HOUR) {
            let h = Math.floor(time % DateUtils.MS_PER_DAY / DateUtils.MS_PER_HOUR);
            str = "0天" + h + "小时";
            return str;
        } else {
            str = "0天0小时"
            return str;
        }

    }

    /**秒转 x分y秒 */
    public static secondsToMS(seconds: number) {
        var m = Math.floor(seconds / 60);
        var s = seconds % 60;
        return `${m}分${s}秒`
    }

    /**判断是否同一天 */
    public static isSameDay(aMilliTime: number, bMilliTime: number): boolean {
        let aDate = new Date(aMilliTime);
        let bDate = new Date(bMilliTime);
        return aDate.getFullYear() == bDate.getFullYear() &&
            aDate.getMonth() == bDate.getMonth() &&
            aDate.getDate() == bDate.getDate();
    }

    /**好友圈发布时间 */
    public static getHyqPublicTime(ms: number) {
        let curMs = DateUtils.curServerTimeStamp();
        let dis = curMs - ms;
        if (dis < DateUtils.MS_PER_HOUR) {
            let minute = Math.floor(dis / DateUtils.MS_PER_MINUTE);
            return `${minute}分钟前`;
        } else if (dis < DateUtils.MS_PER_DAY) {
            let hour = Math.floor(dis / DateUtils.MS_PER_HOUR);
            return `${hour}小时前`;
        } else {
            let date = DateUtils.getGMT8Date(ms);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; //返回的月份从0-11；
            let day = date.getDate();
            let monthStr = month < 10 ? `0${month}` : `${month}`;
            let dayStr = day < 10 ? `0${day}` : `${day}`;
            return `${year}-${monthStr}-${dayStr}`;
        }
    }
    /***************************************时间格式化end ************************************************/

    public static curServerTimeStamp(): number {
        return DateUtils.getGMT8Date(GameServer.serverTime * 1000).getTime();
    }

    public static curServerTimeDate(): Date {
        return DateUtils.getGMT8Date(GameServer.serverTime * 1000);
    }

    /**
     * 获取当天是周几
     * @returns 周几 1-7
     */
    public static getCurDay():number{
        return DateUtils.GetDay(DateUtils.getGMT8Date(GameServer.serverTime * 1000))
    }
}

const enum TimeFormatType {
    /**00:00:00 */
    TYPE1 = 1,
    /**yyyy-mm-dd h:m:s */
    TYPE2 = 2,
    /**00:00 */
    TYPE3 = 3,
    /**xx天前/xx小时前/xx分钟前 */
    TYPE4 = 4,
    /**x天x小时x分x秒 */
    TYPE5 = 5,
    /*h:m:s */
    TYPE6 = 6,
    /**xx天/xx小时/<1小时 */
    TYPE7 = 7,
    /**yyyy-mm-dd h:m */
    TYPE8 = 8,
    /**x小时x分钟x秒 */
    TYPE9 = 9,
    /**年.月.日 */
    TYPE10 = 10,
    TYPE11 = 11,
    TYPE12 = 12,
    TYPE13 = 13,
    TYPE14 = 14,
    TYPE15 = 15,
    TYPE21 = 21,
}

const enum DayType {
    WorkDay = 0,//工作日
    DoubleDay = 1,//双休日
    Holiday = 2,//法定假日
}