import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

const MODULE_ROOT_PATH = path.join(__dirname, '..');
const ASSETS_ROOT_DIR_PATH = path.join(MODULE_ROOT_PATH, 'assets');
const BUILD_ROOT_DIR_PATH = path.join(MODULE_ROOT_PATH, 'build');
const SRC_ROOT_DIR_PATH = path.join(MODULE_ROOT_PATH, 'src');
const PACKAGE_JSON_SRC_FILE_PATH = path.join(ASSETS_ROOT_DIR_PATH, 'package.json');
const PACKAGE_JSON_DST_FILE_PATH = path.join(BUILD_ROOT_DIR_PATH, 'package.json');
const FRONTEND_HTML_SRC_FILE_PATH = path.join(SRC_ROOT_DIR_PATH, 'node-red-fluke-9190a.hbs');
const FRONTEND_HTML_DST_FILE_PATH = path.join(BUILD_ROOT_DIR_PATH, 'node-red-fluke-9190a.html');
const FRONTEND_JS_SRC_FILE_PATH = path.join(BUILD_ROOT_DIR_PATH, 'node-red-fluke-9190a-frontend.js');

const readSourceFile = async (filePath: string) => {
  const frontendHtmlFileContentsBuffer = await fs.promises.readFile(filePath);
  const frontendHtmlFileContents = frontendHtmlFileContentsBuffer.toString();
  return frontendHtmlFileContents;
};

const readSourceFrontendHtmlFile = async () => readSourceFile(FRONTEND_HTML_SRC_FILE_PATH);
const readSourceFrontendJSFile = async () => readSourceFile(FRONTEND_JS_SRC_FILE_PATH);

const injectFrontendHtmlScript = async (htmlContents: string, jsContents: string) => {
  jsContents = jsContents.replace('Object.defineProperty(exports, "__esModule", { value: true });', '');
  const view = {
    source: jsContents
  };
  const output = Mustache.render(htmlContents, view);
  return output;
};

const saveFrontendHtmlFileToBuild = async (contents: string) => {
  await fs.promises.writeFile(FRONTEND_HTML_DST_FILE_PATH, contents);
};

const copyPackageJsonAssetFileToBuild = async () => {
  await fs.promises.copyFile(PACKAGE_JSON_SRC_FILE_PATH, PACKAGE_JSON_DST_FILE_PATH);
};

const run = async () => {
  let frontendHtmlFileContents = await readSourceFrontendHtmlFile();
  const frontendJSFileContents = await readSourceFrontendJSFile();
  frontendHtmlFileContents = await injectFrontendHtmlScript(frontendHtmlFileContents, frontendJSFileContents);
  await saveFrontendHtmlFileToBuild(frontendHtmlFileContents);
  await copyPackageJsonAssetFileToBuild();
};

run().catch((error) => {
  if (!error) return;
  console.error(error);
});
