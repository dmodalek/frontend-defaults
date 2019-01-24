import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type ReadmeAnalyzerResult = {
	readme: boolean;
};

export class ReadmeAnalyzer extends Analyzer<ReadmeAnalyzerResult> {
	async analyze(): Promise<ReadmeAnalyzerResult> {
		const readmeExists = await fileExists(join(this.context, 'README.md'));

		return {
			readme: readmeExists,
		};
	}
}
