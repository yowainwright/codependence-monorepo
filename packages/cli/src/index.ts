import { program } from "commander";
import { readFileSync, writeFileSync } from "fs-extra";
import { sync as glob } from "fast-glob";

export type Options = {
  debug?: boolean;
  rootPackageJson?: string;
  matchers?: string;
  path?: string;
  ignore?: Array<string>;
  isTesting?: boolean;
  config?: string;
};

export const action = ({
  rootPackageJson = "package.json",
  matchers = "**/package.json",
  path: cwd = "./",
  ignore = ["node_modules/**/*", "**/node_modules/**/*"],
  config = "package.json",
  isTesting = false,
}: Options) => {
  const rootPkgPath = `${cwd}${rootPackageJson}`;
  const rootPkg = readFileSync(`${cwd}${rootPackageJson}`, "utf8");
  const json = JSON.parse(rootPkg);
  const files = glob(matchers, { cwd, ignore });
  const codependencies: Array<string> = [];
  files.forEach((file) => {
    const packageJson = readFileSync(`${file}`, "utf8");
    const { dependencies = {}, devDependencies = {} } = JSON.parse(packageJson);
    const deps = Object.keys(dependencies).concat(Object.keys(devDependencies));
    codependencies.push(...deps);
  });
  if (!codependencies.length) return;
  const isPackageJsonConfig = config === rootPackageJson;
  const codependence = {
    codependencies,
  };
  const updatedJson = {
    ...json,
    ...(isPackageJsonConfig ? { codependence } : {}),
  };
  if (isTesting) {
    return updatedJson;
  }
  if (isPackageJsonConfig)
    writeFileSync(
      rootPkgPath,
      JSON.stringify(updatedJson, null, 2).concat("\n")
    );
  else
    writeFileSync(
      `${cwd}${config}`,
      JSON.stringify(codependence, null, 2).concat("\n")
    );
};

program
  .option("--rootPackageJson <rootPackageJson>", "root package.json")
  .option("-c, config <config>", "config file path")
  .option("-f, --files", "file glob pattern")
  .option("-m, --matchers <matchers>", "update dependencies based on check")
  .option("-p, --path <path>", "path to start search")
  .option("-i, --ignore [ignore...]", "ignore glob pattern")
  .option("--debug", "enable debugging")
  .action(action)
  .parse(process.argv);
