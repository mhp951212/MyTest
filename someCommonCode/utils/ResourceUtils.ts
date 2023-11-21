// /**
//  * 资源加载工具类，
//  * 封装Group的加载
//  * 增加静默加载机制
//  */
// class ResourceUtils extends BaseSystem {
//     _groupIndex = 0;
//     _groups = {};

//     public constructor() {
//         super();
//         RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
//         RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceLoadProgress, this);
//         RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
//     }

//     public static ins(): ResourceUtils {
//         return super.ins();
//     };

//     /**
//      * 资源组加载完成
//      */
//     public onResourceLoadComplete(event) {
//         var groupName = event.groupName;
//         if (this._groups[groupName]) {
//             var loadComplete = this._groups[groupName][0];
//             var loadCompleteTarget = this._groups[groupName][2];
//             if (loadComplete != null) {
//                 loadComplete.call(loadCompleteTarget);
//             }
//             this._groups[groupName] = null;
//             delete this._groups[groupName];
//         }
//     };
//     /**
//      * 资源组加载进度
//      */
//     public onResourceLoadProgress(event) {
//         var groupName = event.groupName;
//         if (this._groups[groupName]) {
//             var loadProgress = this._groups[groupName][1];
//             var loadProgressTarget = this._groups[groupName][2];
//             if (loadProgress != null) {
//                 loadProgress.call(loadProgressTarget, event.itemsLoaded, event.itemsTotal);
//             }
//         }
//     };
//     /**
//      * 资源组加载失败
//      * @param event
//      */
//     public onResourceLoadError(event) {
//         let groupName = event.groupName;
//         let msg = groupName + "资源组有资源加载失败"
//         console.error(msg);
//         if (this._groups[groupName]) {
//             var loadError = this._groups[groupName][3];
//             var loadCompleteTarget = this._groups[groupName][2];
//             if (loadError != null) {
//                 loadError.call(loadCompleteTarget);
//             }
//             this._groups[groupName] = null;
//             delete this._groups[groupName];
//         }
//     };

//     /**
//      * 加载资源组
//      * @param $groupName 资源组名称
//      * @param $onResourceLoadComplete 资源加载完成执行函数
//      * @param $onResourceLoadProgress 资源加载进度监听函数
//      * @param $onResourceLoadTarget 资源加载监听函数所属对象
//      */
//     public loadGroup($groupName, $onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget, $onResoureLoadError) {
//         this._groups[$groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget, $onResoureLoadError];
//         console.warn("loadGroup", $groupName)
//         RES.loadGroup($groupName);
//     };
//     /**
//      * 加载动态(自定义)资源组
//      * @param $resources 资源数组 
//      * @param $onResourceLoadComplete 资源加载完成执行函数
//      * @param $onResourceLoadProgress 资源加载进度监听函数
//      * @param $onResourceLoadTarget 资源加载监听函数所属对象
//      * @param $priority 资源加载优先级
//      */
//     public loadDynamicGroup($resources = [], $onResourceLoadComplete = null, $onResourceLoadProgress = null, $onResourceLoadTarget = null, $onResourceonError = null, $priority: number = 1) {
//         let groupName = "loadGroup_" + this._groupIndex++;
//         // console.warn(groupName, $resources)
//         let ret = RES.createGroup(groupName, $resources);
//         if (ret) {
//             this._groups[groupName] = [$onResourceLoadComplete, $onResourceLoadProgress, $onResourceLoadTarget, $onResourceonError];
//             RES.loadGroup(groupName, $priority);
//         } else {
//             console.warn("创建动态组失败")
//         }
//     }
//     /**
//      * 静默加载
//      * @param $groupName 资源组名称
//      * @param $groupName 所包含的组名称或者key名称数组
//      */
//     public pilfererLoadGroup($groupName, $subGroups): Promise<number> {
//         if ($subGroups === void 0) { $subGroups = null; }
//         //添加前缀，防止与正常加载组名重复
//         var useGroupName = "pilferer_" + $groupName;
//         if (!$subGroups) {
//             $subGroups = [$groupName];
//         }
//         RES.createGroup(useGroupName, $subGroups, true);
//         return new Promise((resolve, reject) => {
//             let start = GameUtils.performanceNow();
//             RES.loadGroup(useGroupName, -1).then(() => {
//                 let useTime = GameUtils.performanceNow() - start;
//                 resolve(useTime);
//             });
//         })
//     };



// }