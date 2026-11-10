# 常用命令

在项目根目录执行以下命令（需先安装并初始化 Conda）。

```bash
# 根据 environment.yml 创建 culex 环境，安装项目所需的 Node.js
conda env create -f environment.yml

# 激活 culex 环境，后续 npm 命令使用该环境中的 Node.js
conda activate culex

# 根据 package-lock.json 安装项目依赖，包括 Angular 21 和 Angular CLI
npm ci

# 启动 Angular 开发服务器
npm start
```

`environment.yml` 管理 Conda 环境及 Node.js；Angular 21 和 Angular CLI 是 npm 依赖，分别声明在 `package.json` 的 `dependencies` 和 `devDependencies` 中，具体安装版本由 `package-lock.json` 锁定。因此无需在 `environment.yml` 中重复声明 Angular。

如果需要在 Conda 环境中安装全局 Angular CLI，可用项目已有脚本替代上面的环境创建步骤，之后仍需激活环境并执行 `npm ci`：

```bash
# 创建 culex 环境，并在该环境内安装全局 Angular CLI 21
bash scripts/setup-conda.sh
```

直接使用 `npm start` 时会调用项目本地的 Angular CLI，无需安装全局 CLI。环境创建命令只需首次执行；后续启动项目只需激活环境并执行 `npm start`。
