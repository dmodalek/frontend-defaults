import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type EditorconfigAnalyzerResult = {
	editorConfig: boolean;
};

export class EditorconfigAnalyzer extends Analyzer<EditorconfigAnalyzerResult> {
	async analyze(): Promise<EditorconfigAnalyzerResult> {
		const eidtorConfigExists = await fileExists(join(this.context, '.editorconfig'));

		return {
			editorConfig: eidtorConfigExists,
		};
	}
}
