import { NodeAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import {
    checkNewerLTSVersion,
    ValidationException,
    ValidationResult,
    ValidationSeverityLevel
    } from '@namics/frontend-defaults-platform-core';

export const nodeValidation = async (cwd: string, analytics: NodeAnalyzerResult): Promise<ValidationResult[]> => {
    const { nodeVersion, nodeVersionManagerInfo } = analytics;

    if (!nodeVersion || !nodeVersionManagerInfo) {
        return [
            {
                message: `No node version manager used, integrate node-version or/and nvm`,
                level: ValidationSeverityLevel.error,
                source: 'NodeValidation',
                patch: ['NVMInstallPatch', 'NodeVersionInstallPatch']
            }
        ];
    }

    const validations: ValidationResult[] = [];

    if (!nodeVersionManagerInfo.nvm) {
        // no .nvmrc file found
        validations.push({
            message: `No .nvmrc ressource file found, you might add one`,
            source: 'NodeValidation',
            level: ValidationSeverityLevel.info,
            patch: ['NVMInstallPatch']
        });
    } else if (typeof nodeVersionManagerInfo.nvm === 'string') {
        // check for lts updates in .nvmrc
        const nvmUpgradeException = await checkManagerForUpdate(nodeVersionManagerInfo.nvm, 'nvm', 'UpdateNVMPatch');
        if (nvmUpgradeException) {
            validations.push(nvmUpgradeException);
        }
    }

    if (!nodeVersionManagerInfo['node-version']) {
        // no .node-version file found
        validations.push({
            message: `No .node-version ressource file found, you might add one`,
            source: 'NodeValidation',
            level: ValidationSeverityLevel.warning,
            patch: ['NodeVersionInstallPatch']
        });
    } else if (typeof nodeVersionManagerInfo["node-version"] === 'string') {
        // check for lts updates in .node-version
        const nodeVersionUpgradeException = await checkManagerForUpdate(nodeVersionManagerInfo["node-version"], 'node-version', 'UpdateNodeVersionPatch');
        if (nodeVersionUpgradeException) {
            validations.push(nodeVersionUpgradeException);
        }
    }

    return validations;
}

/**
 * Check if there's an LTS update for a certain manager
 * @param selectedVersion current node version from file
 * @param config configuration type (nvm or node-version)
 * @param patch patch needed if upgrade available
 */
const checkManagerForUpdate = async (selectedVersion: string, config: string, patch: string): Promise<ValidationResult | void> => {
    const checkForUpdate = await checkNewerLTSVersion('node', selectedVersion);

    if (checkForUpdate.upgradable) {
        return {
            message: `There's a newer node LTS version available for ${config}, try upgrading`,
            source: 'NodeValidation',
            level: ValidationSeverityLevel.info,
            patch: [
                [patch, {
                    current: checkForUpdate.current,
                    latest: checkForUpdate.latest
                }]
            ]
        }
    }
}