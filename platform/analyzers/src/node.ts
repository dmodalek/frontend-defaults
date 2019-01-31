import { Analyzer, fileExists, getFileContents } from '@namics/frontend-defaults-platform-core';

export enum NodeAnalyzerManagerType {
	'nvm' = 'nvm',
	'node-version' = 'node-version'
}

type NodeAnalyzerManagerInfoType = {
	[managerType in NodeAnalyzerManagerType]: string | boolean;
}

export type NodeAnalyzerResult = {
	nodeVersion: boolean;
	nodeVersionManagerInfo?: NodeAnalyzerManagerInfoType;
};

export class NodeAnalyzer extends Analyzer<NodeAnalyzerResult> {
	async analyze(): Promise<NodeAnalyzerResult> {
		const localVersionFiles = await this.getLocalVersionFile();

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

	async getLocalVersionFile(): Promise<{ exist: boolean, managers: NodeAnalyzerManagerInfoType }> {
		const allManagers: NodeAnalyzerManagerInfoType = {
			[NodeAnalyzerManagerType["node-version"]]: false,
			[NodeAnalyzerManagerType.nvm]: false,
		};
		const nodeVersionFileExists = await fileExists(this.nodeVersionPath);
		const nvmrcFileExists = await fileExists(this.nvmrcPath);

		if (nodeVersionFileExists) {
			allManagers["node-version"] = await this.extractVersionFromFile(this.nodeVersionPath);
		}

		if (nvmrcFileExists) {
			allManagers.nvm = await this.extractVersionFromFile(this.nvmrcPath);
		}

		return {
			exist: nvmrcFileExists || nodeVersionFileExists,
			managers: allManagers
		};
	}

	private async extractVersionFromFile(filePath: string) {
		const contents = await getFileContents(filePath)
		return contents.replace(/\r?\n|\r/g, '')
			.replace('^', '')
			.replace('~', '')
			.replace('>', '')
			.replace('>=', '')
			.replace('<', '')
			.replace('<=', '');
	}

	private get nodeVersionPath() {
		return this.context.getPath('.node-version');
	}

	private get nvmrcPath() {
		return this.context.getPath('.nvmrc');
	}
}
