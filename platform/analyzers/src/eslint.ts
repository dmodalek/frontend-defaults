import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';

export type ESLintAnalyzerResult = {
	eslint: boolean;
	eslintIgnore?: boolean;
	eslintInstallation?: false | string;
};

export class ESLintAnalyzer extends Analyzer<ESLintAnalyzerResult> {
	async analyze(): Promise<ESLintAnalyzerResult> {
		const doesESLintExist = await fileExists(this.context.getPath('.eslintrc.js'));

		if (doesESLintExist) {
			const doesESLintIgnoreExist = await fileExists(this.context.getPath('.eslintignore'));
			const eslintInstallation = this.packageAnalyzer.anyDependencyExists('eslint');

			return {
				eslint: doesESLintExist,
				eslintIgnore: doesESLintIgnoreExist,
				eslintInstallation: eslintInstallation ? eslintInstallation.version : false,
			};
		}

		return {
			eslint: doesESLintExist,
		};
	}
}
