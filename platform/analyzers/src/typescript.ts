import { join } from 'path';
import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';

export type TypeScriptAnalyzerResult = {
	typescript: boolean;
	typescriptInstallation?: false | string;
};

export class TypeScriptAnalyzer extends Analyzer<TypeScriptAnalyzerResult> {
	async analyze(): Promise<TypeScriptAnalyzerResult> {
		const doesTypeScriptExist = await fileExists(this.context.getPath('tsconfig.json'));

		if (doesTypeScriptExist) {
			const tsInstallation = this.packageAnalyzer.anyDependencyExists('typescript');

			return {
				typescript: doesTypeScriptExist,
				typescriptInstallation: tsInstallation ? tsInstallation.version : false,
			};
		}

		return {
			typescript: doesTypeScriptExist,
		};
	}
}
