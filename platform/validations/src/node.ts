import { NodeAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { ValidationResult, ValidationSeverityLevel } from '@namics/frontend-defaults-platform-core';
import { versionSatisfaction } from '@namics/frontend-defaults-platform-core/dist/utils/version';

const CURRENT_NODE_LTS = '10.x';

export const nodeValidation = async (cwd: string, analytics: NodeAnalyzerResult): Promise<ValidationResult[]> => {
	const validations: ValidationResult[] = [];

	if (analytics.nodeVersionManagerInfo) {
		// NVM is used, do validation stuff
		if (analytics.nodeVersionManagerInfo.nvm) {
			// .nvmrc file isn't required anymore because it can also read .node-version
			validations.push({
				level: ValidationSeverityLevel.info,
				message: `The .nvmrc file isn't required anymore, because it can also read .node-version files`,
				source: 'licenseValidation',
			});

			// Check for update in the .nvmrc file
			const definedNVMVersion = analytics.nodeVersionManagerInfo.nvm;
			if (!versionSatisfaction(definedNVMVersion, CURRENT_NODE_LTS)) {
				validations.push({
					level: ValidationSeverityLevel.warning,
					message: `Your .nvmrc version is set to ${definedNVMVersion}, Namics uses ${CURRENT_NODE_LTS}`,
					source: 'licenseValidation',
				});
			}
		} else {
			// FIXME: NVM is not required by namics, because NVM will also read the .node-version file
		}

		// NodeVersion is used, do validatio nstuff
		if (analytics.nodeVersionManagerInfo['node-version']) {
			const definedNodeVersion = analytics.nodeVersionManagerInfo['node-version'];
			if (!versionSatisfaction(definedNodeVersion, CURRENT_NODE_LTS)) {
				validations.push({
					level: ValidationSeverityLevel.warning,
					message: `Your .node-version version is set to ${definedNodeVersion}, Namics uses ${CURRENT_NODE_LTS}`,
					source: 'nodeValidation',
				});
			}
		} else {
			validations.push({
				level: ValidationSeverityLevel.error,
				message: `We require to provide a .node-version file for version managers`,
				source: 'nodeValidation',
			});
		}
	}

	return validations;
};
