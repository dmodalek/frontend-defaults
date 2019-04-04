import { Analyzer, fileExists, getFileContents } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export enum NodeAnalyzerManagerType {
	'nvm' = 'nvm',
	'node-version' = 'node-version'
}

type NodeAnalyzerManagerInfoType = {
	[managerType in NodeAnalyzerManagerType]: string | false;
}

export type NodeAnalyzerResult = {
	nodeVersion: boolean;
	nodeVersionManagerInfo?: NodeAnalyzerManagerInfoType;
};

async function getLocalVersionFile(cwd: string): Promise<{ exist: boolean, managers: NodeAnalyzerManagerInfoType }> {
	const allManagers: NodeAnalyzerManagerInfoType = {
		[NodeAnalyzerManagerType["node-version"]]: false as false,
		[NodeAnalyzerManagerType.nvm]: false as false,
	};
	const nodeVersionFileExists = await fileExists(join(cwd, '.node-version'));
	const nvmrcFileExists = await fileExists(join(cwd, '.nvmrc'));

	if (nodeVersionFileExists) {
		allManagers["node-version"] = await extractVersionFromFile(join(cwd, '.node-version'));
	}

	if (nvmrcFileExists) {
		allManagers.nvm = await extractVersionFromFile(join(cwd, '.nvmrc'));
	}

	return {
		exist: nvmrcFileExists || nodeVersionFileExists,
		managers: allManagers
	};
}

async function extractVersionFromFile(filePath: string) {
	const contents = await getFileContents(filePath)
	return contents.replace(/\r?\n|\r/g, '')
		.replace('^', '')
		.replace('~', '')
		.replace('>', '')
		.replace('>=', '')
		.replace('<', '')
		.replace('<=', '');
}

export const nodeAnalyzer = async (cwd: string): Promise<NodeAnalyzerResult> => {
	const localVersionFiles = await getLocalVersionFile(cwd);

	if (localVersionFiles.exist) {
		return {
			nodeVersion: true,
			nodeVersionManagerInfo: localVersionFiles.managers,
		};
	}

	return {
		nodeVersion: false,
	};
}
