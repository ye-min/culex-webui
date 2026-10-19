#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"

conda env create --file "$project_dir/environment.yml"
# Keep the CLI in the Conda environment, independent of npm's user prefix.
conda run --no-capture-output --name culex node -e '
  const { execFileSync } = require("node:child_process");
  const path = require("node:path");
  const prefix = process.env.CONDA_PREFIX;
  if (!prefix) throw new Error("Conda environment is not active");
  execFileSync(path.join(path.dirname(process.execPath), "npm"),
    ["install", "--global", "--prefix", prefix, "@angular/cli@21"],
    { stdio: "inherit" });
'
conda run --no-capture-output --name culex node --version
conda run --no-capture-output --name culex npm list --global --depth=0 @angular/cli

printf '\nEnvironment ready. Run: conda activate culex\n'
