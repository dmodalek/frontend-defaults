import { fileExists, getStats, getJSON, DependencyInstallation, getDependencyInstallation } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export type RepositoryAnalyzerResult = {
	size: {
		source: number,
		vendor: number
	},
	projectType: 'default' | 'angular' | 'react',
	lerna: boolean,
	lernaProjectInformation: LernaConfiguration | undefined,
	lernaInstallation: DependencyInstallation | undefined,
	nx: boolean,
	nxProjectInformation: NxConfiguration | undefined,
	nxInstallation: DependencyInstallation | undefined
};

export type LernaConfiguration = {
	packages: string[],
	version: string,
	npmClient?: string
}

type NxProject = {
	tags?: string[],
}

export type NxConfiguration = {
	npmScope: string,
	projects: {
		[name: string]: NxProject
	},
	implicitDependencies?: {
		[dependency: string]: string
	}
}

export const repositoryAnalyzer = async (cwd: string): Promise<RepositoryAnalyzerResult> => {
	const LERNA_PATH = join(cwd, 'lerna.json');
	const NX_PATH = join(cwd, 'nx.json');

	const lernaExists = await fileExists(LERNA_PATH);
	const nxExists = await fileExists(NX_PATH);
	const rootStats = await getStats(cwd) || ({ size: -1 } as any);
	const vendorStats = await getStats(join(cwd, 'node_modules')) || ({ size: -1 } as any);

	const reactInstallation = await getDependencyInstallation(cwd, 'react');
	const isReactProject = Boolean(reactInstallation.declared);
	const angularInstallation = await getDependencyInstallation(cwd, '@angular/core');
	const isAngularProject = Boolean(angularInstallation.declared);


	let lernaProjectInformation: LernaConfiguration | undefined;
	let lernaInstallation: DependencyInstallation | undefined;
	let nxProjectInformation: NxConfiguration | undefined;
	let nxInstallation: DependencyInstallation | undefined;

	if (lernaExists) {
		lernaProjectInformation = await getJSON<LernaConfiguration>(LERNA_PATH);
		lernaInstallation = await getDependencyInstallation(cwd, 'lerna');
	}

	if (nxExists) {
		nxProjectInformation = await getJSON<NxConfiguration>(NX_PATH);
		nxInstallation = await getDependencyInstallation(cwd, '@nrwl/nx');
	}

	return {
		size: {
			source: rootStats.size,
			vendor: vendorStats.size
		},
		projectType: isReactProject ? 'react' : (isAngularProject ? 'angular' : 'default'),
		lerna: lernaExists,
		lernaProjectInformation,
		lernaInstallation,
		nx: nxExists,
		nxProjectInformation,
		nxInstallation,
	};
}