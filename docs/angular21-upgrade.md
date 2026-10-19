# Angular 21 升级说明

## 环境与安装

- Conda 环境：`culex`，配置文件为根目录 `environment.yml`。
- Node.js：22.12+（22.x），npm：10.x / 11.x。
- Angular 框架 / CLI / 构建工具：21.2.x。
- TypeScript：5.9.x；RxJS：7.8.x；Zone.js：0.15.x。
- 精确依赖版本由 `package-lock.json` 固定；使用 `npm ci` 安装。

```bash
conda activate culex
npm ci
npm start
npm run build
npm test -- --watch=false --browsers=ChromeHeadless
```

版本兼容要求见 [Angular 官方兼容表](https://angular.dev/reference/versions)。
无交互终端使用 `conda run --no-capture-output -n culex` 作为命令前缀。
测试需要本机 Chrome / Chromium；必要时通过 `CHROME_BIN` 指定可执行文件。

## 迁移后的架构约定

- 保留 `AppModule`、`CoreModule`、`SharedModule` 和集中注册的 Router 路由。
- Angular 19 起组件默认 standalone；本项目模块内声明的组件显式使用
  `standalone: false`，CLI 的组件、指令、管道生成设置也采用非 standalone。
- Angular 21 默认 zoneless。本项目现有页面通过订阅、Promise 和计时器
  更新普通字段，因此在 `AppModule` 显式注册 `provideZoneChangeDetection()`，
  构建与测试继续加载 Zone.js，避免改变异步页面的刷新行为。
- HTTP 使用 `provideHttpClient(withInterceptorsFromDi())` 注册。
- 启动入口采用 `platformBrowser().bootstrapModule(AppModule)`。
- 保留受支持的 browser / Karma builder，开发服务器及国际化提取配置使用
  `buildTarget`。生产输出仍为 `dist/culex-webui`，静态资源和 PDF worker
  复制路径保持与部署工作流一致。
- GitHub Actions 使用 Node.js 22 和 `npm ci`，发布前仍复制 `404.html`。

本次升级不强制重写为 standalone、signals 或新的控制流模板；这些可作为
后续独立迁移，避免将框架升级与业务行为重构混在一起。

## 验证结果

在 `culex` 环境中验证：Angular 21.2.25、CLI / builder 21.2.27、
Node.js 22.23.2、npm 10.9.8、TypeScript 5.9.3。

- `npm ci --offline --no-audit --no-fund`：通过，锁文件可由环境自带 npm 10 安装。
- `npm run build`：生产构建通过，PDF worker 和本地数据按原路径复制。
- `npm test -- --watch=false --browsers=ChromeHeadless`：3 项集成测试通过，
  覆盖应用启动、Tools 到潜水艇游戏的路由与投弹、重新进入游戏，
  以及时间戳页面自动刷新和表单转换。
- 生产构建仍提示首屏 568.45 kB 超过 500 kB 警告阈值、游戏 CSS
  6.66 kB 超过 6 kB 警告阈值；均低于既有错误阈值，未放宽预算。

生产构建会内联现有 Google Fonts，需要访问 `fonts.googleapis.com`。
首次重新解析依赖时 npm 10 出现内部 `edgesOut` 错误，使用临时
npm 11.6.2 生成锁文件后，npm 10 的 `npm ci` 已验证通过。
