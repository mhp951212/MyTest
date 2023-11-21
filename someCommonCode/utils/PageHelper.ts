class PageHelper {
    private _source: any[] = []
    private _pageMaxLimit: number = 0;
    private _totalPage: number = 0;
    public constructor(pageLimit: number) {
        this._pageMaxLimit = pageLimit;
    }
    /**
     * 重新刷新页面数
     */
    public set source(data: any[]) {
        this._source = data;
        if (data.length % this._pageMaxLimit == 0) {
            this._totalPage = data.length / this._pageMaxLimit
        } else {
            this._totalPage = Math.floor(data.length / this._pageMaxLimit) + 1
        }
    }
    public get source(): any[] {
        return this._source || []
    }

    /**
     * 通过索引获取数据
     */
    public getDataByIndex(index: number): { index: number, data: any[] } {
        if (index < 0) {
            console.warn("索引小于0，可能是数据没有更新，强制刷新为当前的最小页面数")
            index = 0
        }
        if (index > this._totalPage - 1) {
            console.warn("索引大于总页数，可能是数据没有更新，强制刷新为当前的最大页面数")
            index = this._totalPage - 1;
        }
        let dt = []
        let start = index * this._pageMaxLimit;
        let end = MathUtils.Clamp(start + this._pageMaxLimit, 0, this.source.length)
        for (let i = start; i < end; i++) {
            dt.push(this.source[i])
        }
        return { index: index, data: dt };
    }

    public get totalPage(): number {
        return this._totalPage
    }
}