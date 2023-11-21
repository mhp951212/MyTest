class DirUtil {

	/**
     * 通过2点，获取8方向值
     */
	public static Get8DirBy2Point(p1, p2) {
		//计算方向
		var angle = MathUtils.getAngle(MathUtils.getRadian2(p1.x, p1.y, p2.x, p2.y));
		return this.Gngle2dir(angle);
	}

	/** 方向转角度 */
	public static dir2angle(dir) {
		dir *= 45;
		dir -= 90;
		return dir;
	}

	/** 角度转方向-5方向 */
	public static Gngle2dir(angle) {
		if (angle < -90)
			angle += 360;
		angle += 90;
		let offest = 20;
		let a0 = 0 + offest;
		let a1 = 90 - offest;
		let a2 = 90 + offest;
		let a3 = 180 - offest;
		let a4 = 180 + offest;
		let a5 = 270 - offest;
		let a6 = 270 + offest;
		let a7 = 360 - offest;
		if (angle > a0 && angle <= a1) {
			return 1;
		}
		if (angle > a1 && angle <= a2) {
			return 2;
		}
		if (angle > a2 && angle <= a3) {
			return 3;
		}
		if (angle > a3 && angle <= a4) {
			return 4;
		}
		if (angle > a4 && angle <= a5) {
			return 5;
		}
		if (angle > a5 && angle <= a6) {
			return 6;
		}
		if (angle > a6 && angle <= a7) {
			return 7;
		}
		return 0;
		// return (Math.floor((angle + 90) / 90) % 4) * 2 + 1;
	};

	/** 角度转方向-2方向 */
	public static Gngle3dir(angle) {
		if (angle < -90)
			angle += 360;
		angle += 90
		if (angle <= 80) {
			return 1
		}
		if (angle > 80 && angle <= 190) {
			return 3
		}
		if (angle > 190 && angle <= 280) {
			return 5
		}
		return 7
		// return (Math.floor((angle + 90) / 90) % 4) * 2 + 1;
	};

	/** 反方向 */
	public static DirOpposit(dir) {
		return dir < 4 ? dir + 4 : dir - 4;
	}

	/** 8方向转5方向资源方向 */
	public static Get5DirBy8Dir(dir8: number) {
		var td = 2 * (dir8 - 4);
		if (td < 0)
			td = 0;
		return dir8 - td;
	}

	/** 获取方向格子坐标后几格的坐标 */
	public static GetGridByDir(dir, pos: number = 1, p: any = null) {
		var angle = this.dir2angle(this.DirOpposit(dir));
		var tp = p || new egret.Point();
		MathUtils.getDirMove(angle, pos * GameUtils.CELL_SIZE, tp);
		return tp;
	};

	public static GetDir(sx: number, sy: number, ex: number, ey: number, fiveDir: number): number {
		let radian = MathUtils.getRadian2(sx, sy, ex, ey);//弧度
		let angle = MathUtils.getAngle(radian);//弧度转角度
		let dir;
		if (fiveDir) dir = this.Gngle2dir(angle);//角度转方向
		else dir = this.Gngle3dir(angle);//角度转方向
		return dir;
	}
}