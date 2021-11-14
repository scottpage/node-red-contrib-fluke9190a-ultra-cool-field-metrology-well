import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';

const BUILD_TO_DIST_COPY_EXCLUDE_FILES_NAMES = ['compile.d.ts', 'compile.d.ts.map', 'compile.js', 'compile.js.map', 'fluke-9190a-frontend.js'];

const MODULE_ROOT_PATH = path.join(__dirname, '..', '..');
const BUILD_ROOT_DIR_PATH = path.join(MODULE_ROOT_PATH, 'dist');

const SRC_ROOT_DIR_PATH = path.join(MODULE_ROOT_PATH, 'src');
const PACKAGE_JSON_SRC_FILE_PATH = path.join(MODULE_ROOT_PATH, 'package.json');
const PACKAGE_JSON_DST_FILE_PATH = path.join(BUILD_ROOT_DIR_PATH, 'package.json');
const FRONTEND_HTML_SRC_FILE_PATH = path.join(SRC_ROOT_DIR_PATH, 'fluke-9190a.hbs');
const FRONTEND_HTML_DST_FILE_PATH = path.join(BUILD_ROOT_DIR_PATH, 'fluke-9190a.html');
const FRONTEND_JS_SRC_FILE_PATH = path.join(BUILD_ROOT_DIR_PATH, 'fluke-9190a-frontend.js');

const readSourceFile = async (filePath: string) => {
  const frontendHtmlFileContentsBuffer = await fs.promises.readFile(filePath);
  const frontendHtmlFileContents = frontendHtmlFileContentsBuffer.toString();
  return frontendHtmlFileContents;
};

const readSourceFrontendHtmlFile = async () => readSourceFile(FRONTEND_HTML_SRC_FILE_PATH);
const readSourceFrontendJSFile = async () => readSourceFile(FRONTEND_JS_SRC_FILE_PATH);

const injectFrontendHtmlScript = async () => {
  let frontendJSFileContents = await readSourceFrontendJSFile();
  const frontendHtmlFileContents = await readSourceFrontendHtmlFile();
  frontendJSFileContents = frontendJSFileContents.replace('Object.defineProperty(exports, "__esModule", { value: true });', '');
  const view = {
    source: frontendJSFileContents
  };
  const output = Mustache.render(frontendHtmlFileContents, view);
  return output;
};

const saveFrontendHtmlFileToBuild = async (contents: string) => {
  await fs.promises.writeFile(FRONTEND_HTML_DST_FILE_PATH, contents);
};

const copyPackageJsonAssetFileToBuild = async () => {
  await fs.promises.copyFile(PACKAGE_JSON_SRC_FILE_PATH, PACKAGE_JSON_DST_FILE_PATH);
};

const deleteBuildExcludeFiles = async () => {
  for (const fileNameToRemove of BUILD_TO_DIST_COPY_EXCLUDE_FILES_NAMES) {
    const fileNameToRemoveFullPath = path.join(BUILD_ROOT_DIR_PATH, fileNameToRemove);
    await fs.promises.rm(fileNameToRemoveFullPath);
  }
};

const run = async () => {
  const frontendHtmlFileContents = await injectFrontendHtmlScript();
  await saveFrontendHtmlFileToBuild(frontendHtmlFileContents);
  await copyPackageJsonAssetFileToBuild();
  // await deleteBuildExcludeFiles();
};

run().catch((error) => {
  if (!error) return;
  console.error(error);
});
