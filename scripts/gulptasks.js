/*
 * Copyright (c) 2018-2019 Pavel Kastornyy. All rights reserved.
 *
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.
 *
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 2 only, as
 * published by the Free Software Foundation.
 *
 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 *
 * You should have received a copy of the GNU General Public License version
 * 2 along with this work; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 *
 */

import gulp from 'gulp';
import fs from 'fs';
import packageJson from './../package.json'
import tsConfigJson from './../tsconfig.json'
const execSync = require('child_process').execSync;
import path from 'path';
import rimraf from 'rimraf';
import MODULE_DIST_PATHS from './../module.dist.paths';

const MODULES_PATH = __dirname + path.sep + '..' + path.sep + 'modules';
const TEMP_FOLDER = 'tmp';
const DIST_FOLDER = 'dist';
const SRC_FOLDER = 'src';
const TEST_FOLDER = 'test';
const MAIN_DIST_PATH = __dirname + path.sep + '..' + path.sep + DIST_FOLDER;

const MODULE_TYPE = {
    
    /**
     * The module that is for distribution.
     */
    DIST : 1,
    
    /**
     * The module that will be tested.
     */
    FOR_SPEC: 2,
    
    /**
     * The module that contains tests.
     */
    SPEC : 3
};

export function installModules() {
    for (let i = 0; i < packageJson.modules.length; i++) {
        const MODULE_PATH = MODULES_PATH + path.sep + packageJson.modules[i];
        //when we need npm install in another folder we do : 	//npm --prefix ./some_project install ./some_project
        //we call every module install-module command as it can have modifications
        execSync('npm run --prefix "' + MODULE_PATH + '" install-module', {stdio: 'inherit', shell: true});
    }
}

export function uninstallModule(modulePath) {
    uninstallNodeProject(modulePath);
}

export function uninstallModules() {
    for (let i = 0; i < packageJson.modules.length; i++) {
	const MODULE_PATH = MODULES_PATH + path.sep + packageJson.modules[i];
        //we call every module uninstall-module command as it can have modifications
        execSync('npm run --prefix "' + MODULE_PATH + '" uninstall-module', {stdio: 'inherit', shell: true});
    }
}

export function uninstallAll() {
    uninstallModules();
    uninstallNodeProject(__dirname + path.sep + '..');
}

export function buildModule(modulePath) {
    return doBuildModule(modulePath, MODULE_TYPE.DIST);
}

export function buildModules() {
    for (let i = 0; i < packageJson.modules.length; i++) {
        const MODULE_PATH = MODULES_PATH + path.sep + packageJson.modules[i];
        //we call every module build-module command as it can have modifications
        execSync('npm run --prefix "' + MODULE_PATH + '" build-module', {stdio: 'inherit', shell: true});
    }
}

export function cleanModule(modulePath) {
    cleanNodeProject(modulePath);
}

export function cleanModules() {
    for (let i = 0; i < packageJson.modules.length; i++) {
	const MODULE_PATH = MODULES_PATH + path.sep + packageJson.modules[i];
        //we call every module clean-module command as it can have modifications
        execSync('npm run --prefix "' + MODULE_PATH + '" clean-module', {stdio: 'inherit', shell: true});
    }
}

export function cleanAll() {
    cleanModules();
    cleanNodeProject(__dirname + path.sep + '..');
}

/**
 Mocha doesn't support ES6. So, we do this way:

        spec files written in
        plain ES6 JavaScript
             |
             |
mocha ---> reading the files
             |
babel ---> compiles the files
           from ES6 to ES5
             |
mocha ---> running the tests
             |
             |
        test results
 */
export function testModule(modulePath) {
    doBuildModule(modulePath, MODULE_TYPE.FOR_SPEC);
    doBuildModule(modulePath, MODULE_TYPE.SPEC);
    let typescriptPath = modulePath + path.sep + TEST_FOLDER;
    let module = require(typescriptPath + path.sep + 'module-info.js');
    let testFilePath = modulePath + path.sep + TEMP_FOLDER + path.sep + module.name + ".js";
    let babelRegisterPath = __dirname + path.sep + 'babel.register.js';
    //With npx you can invoke locally installed utilities like globally installed utilities 
    //(but you must begin the command with npx). 
    //mocha can be called ONLY witin project folder, so we have to use `cd`
    execSync('cd "' + modulePath + '" && npx mocha "' + testFilePath + '" --require "' + babelRegisterPath + '"',
                {stdio: 'inherit', shell: true});
}

export function testModules() {
    for (let i = 0; i < packageJson.modules.length; i++) {
	const MODULE_PATH = MODULES_PATH + path.sep + packageJson.modules[i];
        //we call every module test-module command as it can have modifications
        execSync('npm run --prefix "' + MODULE_PATH + '" test-module', {stdio: 'inherit', shell: true});
    }
}

function uninstallNodeProject(projectPath) {
    const NODE_MODULES_PATH = projectPath + path.sep + 'node_modules';
    const PACKAGE_LOCK_PATH = projectPath + path.sep + 'package-lock.json';
    if (fs.existsSync(NODE_MODULES_PATH)) {
        rimraf.sync(NODE_MODULES_PATH);
    }
    if (fs.existsSync(PACKAGE_LOCK_PATH)) {
        fs.unlinkSync(PACKAGE_LOCK_PATH);
    }
}

function cleanNodeProject(projectPath) {
    const MODULE_DIST_PATH = projectPath + path.sep + DIST_FOLDER;
    const MODULE_TEMP_PATH = projectPath + path.sep + TEMP_FOLDER;
    if (fs.existsSync(MODULE_DIST_PATH)) {
        rimraf.sync(MODULE_DIST_PATH);
    }
    if (fs.existsSync(MODULE_TEMP_PATH)) {
        rimraf.sync(MODULE_TEMP_PATH);
    }
}

class ClassDescriptor {

    /**
     * 
     * @param {type} module
     * @param {type} pkg
     * @param {type} name - Short name.
     * @param {type} alias
     * @returns {ClassDescriptor}
     */
    constructor(module, pkg, name, alias) {
        this.module = module;
        this.package = pkg;
        this.name = name;
        this.alias = alias;
    }
    
    getName() {
        return this.name;
    }
    
    getAlias() {
        return this.alias;
    }
    
    getModule() {
        return this.module;
    }
    
    getPackage() {
        return this.package;
    }
}

function doBuildModule(modulePath, moduleType) {
    let typescriptPath = null;
    let moduleTsFileName = null;
    let moduleJsFileName = null;
    let targetFolderPath = null;
    let testedModuleName = null;
    if (moduleType !== MODULE_TYPE.SPEC) {
        typescriptPath = modulePath + path.sep + SRC_FOLDER;
    } else {
        typescriptPath = modulePath + path.sep + TEST_FOLDER;
    }
    let moduleInfo = require(typescriptPath + path.sep + 'module-info.js');
    if (moduleType === MODULE_TYPE.DIST) {
        moduleTsFileName = moduleInfo.name + '.ts';
        moduleJsFileName = moduleInfo.name + '.js';
        targetFolderPath = modulePath + path.sep + DIST_FOLDER;
    } else if (moduleType === MODULE_TYPE.FOR_SPEC) {
        moduleTsFileName = moduleInfo.name + '.4spec.ts';
        targetFolderPath = modulePath + path.sep + TEMP_FOLDER;
    } else if (moduleType === MODULE_TYPE.SPEC) {
        moduleTsFileName = moduleInfo.name + '.ts';
        targetFolderPath = modulePath + path.sep + TEMP_FOLDER;
        testedModuleName = resolve4SpecModuleName(moduleInfo.name);
    }
    try {
        //array of ClassDescriptor
        let classesToExport = [];
        //array of ClassDescriptor
        let classesToImport = [];
        let totalData = '';
        for (let i = 0; i < moduleInfo.classes.length; i++) {
            let classFullName = moduleInfo.classes[i];
            extractObjectsToExport(moduleInfo, classFullName, classesToExport);
            let data = fs.readFileSync(typescriptPath + path.sep + classFullName.replace(/\./g, "/") + ".ts", 'utf8');
            extractObjectsToImport(data, classesToImport, moduleType, testedModuleName);
            //now we can remove import lines from data
            data = removeImportLines(data);
            //for dist module we make "exports" changes
            if (moduleType === MODULE_TYPE.DIST) {
                data = removeExportLines(data);
            }
            totalData += data
                    + '\n\n/* ===================================='
                    + '========================================= */\n\n';
        }
        if (classesToImport.length > 0) {
            totalData = buildImport(moduleInfo, classesToImport, moduleType) + totalData;
        }
        if (classesToExport.length > 0 && (moduleType === MODULE_TYPE.DIST)) {
            totalData += buildExport(classesToExport);
        }
        if (!fs.existsSync(targetFolderPath)){
            fs.mkdirSync(targetFolderPath, { recursive: false }, (err) => {
                if (err) throw err;
            });
        }
        fs.writeFileSync(targetFolderPath + path.sep + moduleTsFileName, totalData, { flag: 'w' }, function(err) {
            if(err) return console.error(err);
        });
        //now we can compile, we don't use gulp-typescript as wee need more controll.
        execSync('npx tsc "' + targetFolderPath + path.sep + moduleTsFileName + '" ' 
                + buildTscCommandLineString(), {stdio: 'inherit', shell: true});
        if (moduleType === MODULE_TYPE.DIST) {
            if (!fs.existsSync(MAIN_DIST_PATH)){
                fs.mkdirSync(MAIN_DIST_PATH, { recursive: false }, (err) => {
                    if (err) throw err;
                });
            }
            let distTsFilePath = MAIN_DIST_PATH + path.sep + moduleInfo.name + '-' + packageJson.version + '.ts';
            let distJsFilePath = MAIN_DIST_PATH + path.sep + moduleInfo.name + '-' + packageJson.version + '.js'
            makeDistFile(targetFolderPath + path.sep + moduleJsFileName, distJsFilePath, moduleInfo);
            //in dist folder we need only js
            //makeDistFile(targetFolderPath + path.sep + moduleTsFileName, distTsFilePath, moduleInfo);
        }

    } catch(e) {
        console.log('Error:', e.stack);
    }
}

function removeImportLines(data) {
    return data.replace(/^import.*$\n/gm, '');
}

function removeExportLines(data) {
    //console.log(data);
    let regexpNotGlobal = /export\s+[class|interface|abstract|enum|function|type]/;
    data = data.replace(regexpNotGlobal, function(match){
        return match.replace("export", "").trim();
    });
    let regexpGlobal = /export\s+namespace/g;
    data = data.replace(regexpGlobal, function(match){
        return match.replace("export", "").trim();
    });
    return data;
}

function extractObjectsToExport(moduleInfo, classFullName, classesToExport) {
    let lastDotIndex = classFullName.lastIndexOf(".");
    let classShortName = classFullName.substr(lastDotIndex + 1);
    let classPackage = classFullName.substr(0, lastDotIndex);
    if (!("export" in moduleInfo) || !("packages" in moduleInfo.export)) {
        return;
    }
    if (moduleInfo.export.packages.indexOf(classPackage) > -1) {
        if ('exclude' in moduleInfo.export && moduleInfo.export.exclude.indexOf(classFullName) !== -1) {
            return;
        } else {
            let klass = new ClassDescriptor(moduleInfo.name, classPackage, classShortName, null);
            classesToExport.push(klass);
        }
    }
}

function extractObjectsToImport(data, classesToImport, moduleType, testedModuleName) {
    let importRegExp = /^import.*$\n/gm;
    let classAndModuleRegExp = /\{\s*(\S+)\s*\}\s+from\s+["']([\w\.\/]+)["']/;
    let asteriskAndModuleRegExp = /\s*\*\s+as\s+(\S+)\s+from\s+["']([\w\.\/]+)["']/;
    let importExecResult;
    let className = null;
    let alias = null;
    let moduleName = null;
    do {
        importExecResult = importRegExp.exec(data);
        if (importExecResult) {
            let arr = importExecResult[0].match(classAndModuleRegExp);
            if (arr !== null) {
                className = arr[1];
                moduleName = arr[2];
            } else {
                arr = importExecResult[0].match(asteriskAndModuleRegExp);
                if (arr !== null) {
                    className = "*";
                    alias = arr[1];
                    moduleName = arr[2];
                }
            }
            if (arr !== null) {
                let shouldAddClass = true;
                //there are two types of import - import within module and import from other module.
                //spec module is the only module that import from another module classes by './..' string.
                //however, spec module can import and within module.
                //this is internal import (within module)
                if (moduleName.startsWith("./")) {
                    if (moduleType === MODULE_TYPE.DIST || moduleType === MODULE_TYPE.FOR_SPEC) {
                        shouldAddClass = false;
                    } else {
                        //import from another class in test module
                        if (moduleName.indexOf("/src/") < 0) {
                            shouldAddClass = false;
                        }
                        moduleName = testedModuleName;
                    }
                }
                if (shouldAddClass) {
                    let klass = new ClassDescriptor(moduleName, null, className, alias);
                    //now check if such class is in array already
                    let classIsInArray = false;
                    for (let z = 0; z < classesToImport.length; z++) {
                        if (classesToImport[z].getModule() === klass.getModule() &&
                            classesToImport[z].getName() === klass.getName()) {
                            classIsInArray = true;
                            break;
                        }
                    }
                    if (!classIsInArray) {
                        classesToImport.push(klass);
                    }
                }
            }
        }
    } while (importExecResult);
}

function buildImport(module, classesToImport, moduleType) {
    if (classesToImport.length === 0) {
        return "";
    }
    let dataHolder = {};
    for (let i = 0; i < module.import.modules.length; i++) {
        //create array for every module
        dataHolder[module.import.modules[i]] = [];
    }
    for (let i = 0; i < classesToImport.length; i++) {
        dataHolder[classesToImport[i].getModule()].push(classesToImport[i]);
    }
    let result = "";
    for (let i = 0; i < module.import.modules.length; i++) {
	let importStr = "import ";
        //there is nothing to import, so we import all module.
        let moduleName = module.import.modules[i];
        let moduleFinalName = moduleName;
        //we can change module name accordig to map rules if it is needed 4spec.
        if (moduleType === MODULE_TYPE.FOR_SPEC && "forspecmap" in module.import) {
            if (moduleName in module.import.forspecmap) {
                moduleFinalName = module.import.forspecmap[moduleName];
            }
        }
        if (dataHolder[moduleName].length === 0) {
            importStr += "'" + moduleFinalName + "'";
        
        } else if (dataHolder[moduleName].length === 1 && dataHolder[moduleName][0].getName() === "*") {
            let klass = dataHolder[moduleName][0];
            importStr += klass.getName() + " as " + klass.getAlias() + " from '" + klass.getModule() + "'";
        } else {
            importStr += "{\n"
            for (let z = 0; z < dataHolder[moduleName].length; z++) {
                if (z > 0) {
                    importStr += ",\n";
                }
                importStr += "    " + dataHolder[moduleName][z].getName();
            }
            //we need to show where to look for 4spec module.
            if (moduleType === MODULE_TYPE.SPEC && moduleName === resolve4SpecModuleName(module.name)) {
                importStr +="\n} from './" + moduleFinalName + "'";
            } else {
                importStr +="\n} from '" + moduleFinalName + "'";
            }

        }
	result += importStr + ";\n";
    }
    return result;
}

function buildExport(classesToExport) {
    let exportStr = "";
    for (let n = 0; n < classesToExport.length; n++) {
        if (n > 0) {
            exportStr += ",";
        }
        exportStr += "\n    " + classesToExport[n].getName();
    }
    return "\nexport {" + exportStr + "\n}";
}

function resolve4SpecModuleName(moduleName) {
    return moduleName.replace(".spec", ".4spec")
}

/**
 * This function exists until the following issue is resolved: https://github.com/Microsoft/TypeScript/issues/27379
 * 
 */
function buildTscCommandLineString() {
    let result = "";
    for (var key in tsConfigJson.compilerOptions) {
        if (!tsConfigJson.compilerOptions.hasOwnProperty(key)) {
            continue;
        }
        let value = tsConfigJson.compilerOptions[key];
        if (typeof value === "boolean"){
            if (value) {
                result += " --" + key;
            }
        } else {
            result += " --" + key + " " + value;
        }
    }
    return result;
}

function makeDistFile(src, dest, module) {
  if (!fs.existsSync(src)) {
       return false;
  }
  let data = fs.readFileSync(src, 'utf-8');
  data = fixModulePathsInDistFile(data, module)
  fs.writeFileSync(dest, data, { flag: 'w' });
}

function fixModulePathsInDistFile(data, module) {
    if (!("import" in module) || !("modules" in module.import)) {
        return data;
    }
    //let regExpStr = "^} from '(";
    //[] is only for one character
    //*? - non greedy
    //?: non capturing group
    let regExpStr = "^import (?:[\\S\\s\\w$]*? from )*?['\"](";
    let isFirst = true;
    for (let i = 0; i < module.import.modules.length; i++) {
        //if imported module is from script4j modules
        if (!isFirst) {
            regExpStr += "|";
        }
        regExpStr += module.import.modules[i];
        isFirst = false;
    }
    regExpStr += ")['\"];";
    let regExp = new RegExp(regExpStr, "gm");
    data = data.replace(regExp, function(param, p1) {
        //param is the full expression: import ... 'module';
        return param.replace(p1, MODULE_DIST_PATHS[p1]);
    })
    return data;
}