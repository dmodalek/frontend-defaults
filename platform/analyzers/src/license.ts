import { Analyzer, fileExists } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type LicenseAnalyzerResult = {
	license: boolean;
};

export class LicenseAnalyzer extends Analyzer<LicenseAnalyzerResult> {
	async analyze(): Promise<LicenseAnalyzerResult> {
		const licenseExists = await fileExists(join(this.context, 'LICENSE'));

		return {
			license: licenseExists,
		};
	}
}
