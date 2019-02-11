import { fileExists } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type LicenseAnalyzerResult = {
	license: boolean;
};

export const licenseAnalyzer = async (cwd: string): Promise<LicenseAnalyzerResult> => {
	// TODO: Recognize also license or License (case) + type from package
	const licenseExists = await fileExists(join(cwd, 'LICENSE'));

	return {
		license: licenseExists,
	};
}