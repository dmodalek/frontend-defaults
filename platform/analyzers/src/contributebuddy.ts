import {
	directoryExists,
	getDependencyInstallation,
	DependencyInstallation,
} from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type ContributebuddyAnalyzerResult = {
	contributebuddy: boolean;
	contributebuddyConfigFolder?: string;
	contributebuddyInstallation?: DependencyInstallation;
};

export const contributebuddyAnalyzer = async (cwd: string): Promise<ContributebuddyAnalyzerResult> => {
	const CONTRIBUTE_BUDDY_FOLDER = join(cwd, '.contributebuddy');
	const contributebuddyConfigFolder = await directoryExists(CONTRIBUTE_BUDDY_FOLDER);
	const contributebuddyInstallation = await getDependencyInstallation(cwd, 'contribute-buddy');

	if (contributebuddyConfigFolder || contributebuddyInstallation.declared) {
		return {
			contributebuddy: true,
			contributebuddyConfigFolder: CONTRIBUTE_BUDDY_FOLDER,
			contributebuddyInstallation,
		};
	}

	return {
		contributebuddy: false,
	};
};
