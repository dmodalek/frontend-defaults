import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type LicenseAnalyzerResult = {
	license: boolean;
};

export class LicenseAnalyzer extends Analyzer<LicenseAnalyzerResult> {
	async analyze(): Promise<LicenseAnalyzerResult> {
		// TODO: Recognize also license or License (case)
		const licenseExists = await fileExists(this.context.getPath('LICENSE'));

		return {
			license: licenseExists,
		};
	}
}
