import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';

export type ReadmeAnalyzerResult = {
	readme: boolean;
};

export class ReadmeAnalyzer extends Analyzer<ReadmeAnalyzerResult> {
	async analyze(): Promise<ReadmeAnalyzerResult> {
		// TODO: Recognize also readme, Readme or ReadMe (case)
		const readmeExists = await fileExists(this.context.getPath('README.md'));

		return {
			readme: readmeExists,
		};
	}
}
