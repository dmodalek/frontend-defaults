import { join } from 'path';
import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';

export type TSLintAnalyzerResult = {
	tslint: boolean;
	tslintInstallation?: false | string;
};

export class TSLintAnalyzer extends Analyzer<TSLintAnalyzerResult> {
	async analyze(): Promise<TSLintAnalyzerResult> {
		const doesTSLintExist = await fileExists(join(this.context, 'tslint.json'));

		if (doesTSLintExist) {
			const eslintInstallation = this.packageAnalyzer.anyDependencyExists('tslint');

			return {
				tslint: doesTSLintExist,
				tslintInstallation: eslintInstallation ? eslintInstallation.version : false,
			};
		}

		return {
			tslint: doesTSLintExist,
		};
	}
}
