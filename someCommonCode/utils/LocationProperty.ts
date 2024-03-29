class LocationProperty {
	public constructor() {
	}

	public static urlParam: any;

	public static init() {
		this.urlParam = {};
		// var str = window['paraUrl'];
		var reg = new RegExp("(.*?)=(.*)")
		var str = window.location.search;
		if (str) {
			var whIndex = str.indexOf("?");
			if (whIndex != -1) {
				var param = str.slice(whIndex + 1).split("&");
				for (var i = 0; i < param.length; i++) {
					let match = param[i].match(reg)
					if (match) {
						this.urlParam[match[1]] = match[2]
					}
					// strArr = param[i].split("=");
					// this.urlParam[strArr[0]] = strArr[1];
				}
			}
		}
	};

	/*
	 * 检查url中是否包含某参数
	 * 这代码有一个例外就是paraName = "undefined", paraUrl中不含"?"会返回true
	 * 相信你不会这么用的 =.=
	 * */
	public hasProperty(paraName, paraUrl) {
		var url = paraUrl || location.href;
		var para = "&" + url.split("?")[1]; //加&是为了把&作为参数名开始=作为参数名结束，防止uid=1&id=2此类误判
		return para.indexOf("&" + paraName + "=") != -1;
	};

	public static VerPlat(): number {
		return window["__CONFIG__"]["__GAME_ID__"] || 999999
	}

	private static m_UploadUserData = null

	public static UploadUserData(): boolean {
		if (this.m_UploadUserData == null) {
			this.m_UploadUserData = window["UPLOAD_USER_DATA"] ? true : false
		}
		return this.m_UploadUserData
	}

	public static Reload(bExitAccount = false): void {
		PlatformAdapter.Reload(bExitAccount)

	}
	public static reloadGameView() {
		GameServer.bExitGame = true;
		YuYinTalk.ins().onQuitRoom();
		NativeHandler.ins().ModelInit(false);
		let data = new Sproto.QuitGame_request()
		GameSocket.ins().Rpc(C2sProtocol.QuitGame, data)
		GameSocket.ins().close()
		SoundMgr.ins().stopAllSound()
		SoundMgr.ins().stopMusic()
		ItemManager.ins().OnSocketClose()
		EasyUserModel.ins().OnSocketClose()
		PlatformAdapter.tryReload()

	}

	// 客户端定义配置

	private static HasClientConfig(index: number): boolean {
		return BitUtil.Has(window["__CONFIG__"]["__CLIENT_CONFIG__"] || 0, index)
	}

	// 没有新手引导副本		1
	public static NotGuideRaid(): boolean {
		return this.HasClientConfig(0)
	}

	// 没有客服 2
	public static NotCustionServer(): boolean {
		return this.HasClientConfig(2)
	}

	public static GetRechargeId(): number {
		return window["__CONFIG__"]["__RECHARGE_ID__"] || 1
	}

	// 不显示首充推荐提示
	public static NotRechargeGood(): boolean {
		try {
			let func = window["__CONFIG__"]["__NOT_RECHARGE_GOOD__"]
			if (func) {
				if (typeof (func) == "function") {
					return func()
				} else {
					console.error("__NOT_RECHARGE_GOOD__ not function !!!")
				}
			}
		} catch (e) {
			console.error(e)
		}
		return false
	}
}