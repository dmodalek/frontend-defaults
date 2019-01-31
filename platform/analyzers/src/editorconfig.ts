import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';

export type EditorconfigAnalyzerResult = {
	editorConfig: boolean;
};

export class EditorconfigAnalyzer extends Analyzer<EditorconfigAnalyzerResult> {
	async analyze(): Promise<EditorconfigAnalyzerResult> {
		const eidtorConfigExists = await fileExists(this.context.getPath('.editorconfig'));

		return {
			editorConfig: eidtorConfigExists,
		};
	}
}
