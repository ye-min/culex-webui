# CulexWebui

Personal website built with Angular 21.2, TypeScript 5.9 and RxJS 7.8.
Uses NgModule, explicit Zone.js change detection, and static JSON / Markdown content.

## Conda environment

Create the `culex` environment with Node.js 22 and Angular CLI 21:

```bash
bash scripts/setup-conda.sh
conda activate culex
```

The script creates the environment from `environment.yml`, then installs
`@angular/cli@21` through npm into that environment. Conda YAML does not install
npm packages directly. To perform the same steps manually:

```bash
conda env create -f environment.yml
conda activate culex
npm install --global --prefix "$CONDA_PREFIX" @angular/cli@21
```

Node.js 22.12 or later in the 22.x series is compatible with Angular 21;
see the [Angular version compatibility table](https://angular.dev/reference/versions).
The Conda environment provides Node.js 22 and Angular CLI 21. Project-local
Angular dependencies are pinned by `package-lock.json`; install them after
activating the environment:

```bash
conda activate culex
npm ci
npm start
```

All npm / Angular commands should run in the `culex` environment. For
non-interactive shells, use `conda run --no-capture-output -n culex npm run build`.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm test -- --watch=false --browsers=ChromeHeadless` to execute the unit tests via [Karma](https://karma-runner.github.io). Chrome or Chromium must be installed; set `CHROME_BIN` if it is not detected automatically.

## Upgrade notes

See [Angular 21 upgrade notes](docs/angular21-upgrade.md) for environment,
architecture and deployment conventions.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
