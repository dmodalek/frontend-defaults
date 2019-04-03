import {
    Analyzer,
    DependencyInstallation,
    fileExists,
    getDependencyInstallation,
    getPackageJSON,
    getFileContents,
    getJSON
} from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

type PrettierConfigLocation = 'package' | 'config';

type PrettierContent = {
    trailingComma: string,
    tabWidth: number,
    semi: boolean,
    singleQuote: boolean,
    jsxSingleQuote: boolean,
    bracketSpacing: boolean,
    jsxBracketSameLine: boolean,
    arrowParens: string,
    rangeStart: number,
    rangeEnd: number,
    requirePragma: boolean,
    insertPragma: boolean,
    proseWrap: string,
    htmlWhitespaceSensitivity: string
};

export type PrettierAnalyzerResult = {
    prettier: boolean;
    prettierIgnore?: boolean,
    prettierSettings?: Partial<PrettierContent>,
    prettierInstallation?: DependencyInstallation;
    prettierConfigLocation?: PrettierConfigLocation;
};

export const prettierAnalyzer = async (cwd: string): Promise<PrettierAnalyzerResult> => {
    const PRETTIER_CONFIG_PATH = join(cwd, '.prettierrc.js');
    const PRETTIER_IGNORE_PATH = join(cwd, '.prettierignore');

    const prettierConfigFile = await fileExists(PRETTIER_CONFIG_PATH);
    const prettierIgnore = await fileExists(PRETTIER_IGNORE_PATH);
    const packageConfig = await getPackageJSON(cwd);
    const inlinePrettierConfig = typeof (packageConfig as any).prettier === 'object';

    // we'll prefer config files for prettier instead of inline package configuration
    // so we'll check first if a certain config file exists to use
    if (prettierConfigFile) {
        const prettierInstallation = await getDependencyInstallation(cwd, 'prettier');
        const prettierSettings = require(PRETTIER_CONFIG_PATH);

        return {
            prettier: true,
            prettierIgnore,
            prettierSettings,
            prettierInstallation,
            prettierConfigLocation: 'config'
        };
    }

    if (inlinePrettierConfig) {
        const prettierInstallation = await getDependencyInstallation(cwd, 'prettier');

        return {
            prettier: true,
            prettierIgnore,
            prettierInstallation,
            prettierSettings: (packageConfig as any).prettier,
            prettierConfigLocation: 'package'
        };
    }

    return {
        prettier: false
    };
}