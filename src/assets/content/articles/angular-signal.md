Signal 不是新概念。SolidJS、Vue 3 的 Composition API、甚至更早的 Knockout.js，都有类似的想法。Angular 在 v16 引入它时，我的第一反应是：又一个响应式方案，有必要吗？

用了三个月之后，我改变了看法。但不是因为 Signal 有多厉害，而是因为它解决的问题比我以为的更具体。

## Signal 解决的是什么问题

在 Angular 的 Zone.js 模型下，变更检测是全局触发的。任何异步事件都可能导致整个组件树被检查一遍。这在小应用里感觉不到，在大应用里是真实的性能瓶颈。

Signal 引入了细粒度的追踪：只有依赖了某个 signal 的视图，才会在这个 signal 变化时重新渲染。这不是 magic，是明确的依赖图。

## 与 RxJS 的关系

很多人把 Signal 和 RxJS 放在对立面，这是误解。RxJS 处理的是时间维度的事件流，Signal 处理的是当前时刻的状态。两者解决的是不同的问题。

Angular 提供了 `toSignal()` 和 `toObservable()` 让两者互转。实践中我的做法是：数据请求和复杂异步逻辑用 RxJS，组件内部状态和模板绑定用 Signal。

## 真实使用感受

优点很明显：代码更简洁，不需要 `async` pipe，读写状态的方式更直觉。`computed()` 替代了大量 `combineLatest` 的场景。

缺点也存在：调试工具还不够完善，Signal 的追踪关系不如 RxJS 的 Observable 链那么显式。出了问题，有时候不知道从哪里断点。

总体来说，Signal 是值得采用的，但不要把它当成银弹。
