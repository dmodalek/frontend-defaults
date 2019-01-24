import { Analyzer, fileExists, getFileContents } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type NodeAnalyzerManagerType = 'nvm' | 'node-version';

export type NodeAnalyzerResult = {
	nodeVersion: boolean;
	nodeVersionSelectedVersion?: string;
	nodeVersionManager?: NodeAnalyzerManagerType;
};

export class NodeAnalyzer extends Analyzer<NodeAnalyzerResult> {
	async analyze(): Promise<NodeAnalyzerResult> {
		const localVersionFile = await this.getLocalVersionFile();

		if (localVersionFile) {
			return {
				nodeVersion: true,
				nodeVersionSelectedVersion: localVersionFile.content.trim(),
				nodeVersionManager: localVersionFile.manager,
			};
		}

		return {
			nodeVersion: false,
		};
	}

	async getLocalVersionFile(): Promise<false | { manager: NodeAnalyzerManagerType; content: string }> {
		const nodeVersionFileExists = await fileExists(this.nodeVersionPath);
		if (nodeVersionFileExists) {
			return {
				manager: 'node-version',
				content: await getFileContents(this.nodeVersionPath),
			};
		}

		const nvmrcFileExists = await fileExists(this.nvmrcPath);
		if (nvmrcFileExists) {
			return {
				manager: 'nvm',
				content: await getFileContents(this.nvmrcPath),
			};
		}

		return false;
	}

	private get nodeVersionPath() {
		return join(this.context, '.node-version');
	}

	private get nvmrcPath() {
		return join(this.context, '.nvmrc');
	}
}
