class Dictionary {
	private _values: Array<any>;
	private _keys: Array<any>;
	constructor() {
		this._values = [];
		this._keys = [];
	}
	/**
	 * 获取所有的子元素列表。
	 */
	public get values(): Array<any> {
		return this._values;
	}

	/**
	 * 获取所有的子元素键名列表。
	 */
	public get keys(): Array<any> {
		return this._keys;
	}

	/**
	 * 给指定的键名设置值。
	 * @param	key 键名。
	 * @param	value 值。
	 */
	public set(key: any, value: any): void {
		let index: number = this.indexOf(key);
		if (index >= 0) {
			this._values[index] = value;
			return;
		}
		this._keys.push(key);
		this._values.push(value);
	}

	/**
	 * 获取指定对象的键名索引。
	 * @param	key 键名对象。
	 * @return 键名索引。
	 */
	public indexOf(key: any): any {
		let index: number = this._keys.indexOf(key);
		if (index >= 0) {
			return index;
		}
		key = typeof (key) == "string" ? Number(key) : (typeof (key) == "number" ? key.toString() : key);
		return this._keys.indexOf(key);
	}

	/**
	 * 返回指定键名的值。
	 * @param	key 键名对象。
	 * @return 指定键名的值。
	 */
	public get(key: any): any {
		if (this.ContainsKey(key)) {
			let index: number = this.indexOf(key);
			return index < 0 ? null : this._values[index];
		}
		return null;
	}

	/**
	 * 移除指定键名的值。
	 * @param	key 键名对象。
	 * @return 是否成功移除。
	 */
	public remove(key: any): boolean {
		let index: number = this.indexOf(key);
		if (index >= 0) {
			this._keys.splice(index, 1);
			this._values.splice(index, 1);
			return true;
		}
		return false;
	}

	public ContainsKey(key: any): boolean {
		return this.indexOf(key) > -1;
	}

	/**
	 * 清除此对象的键名列表和键值列表。
	 */
	public clear(): void {
		this._values.length = 0;
		this._keys.length = 0;
	}
}