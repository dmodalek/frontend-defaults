import { Validation, ValidationException, ValidationExceptionLevel, getLatestLTSVersion, checkNewerLTSVersion } from '@namics/frontend-defaults-platform-core';
import { NodeAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';

// await latestVersion('node', { version: 'lts' });
export class NodeValidation extends Validation<NodeAnalyzerResult> {
    async validate(): Promise<ValidationException[]> {
        const { nodeVersion, nodeVersionManagerInfo } = this.analyzer.analytics;

        if (!nodeVersion || !nodeVersionManagerInfo) {
            return [
                new ValidationException({
                    message: `No node version manager used, integrate node-version or/and nvm`,
                    level: ValidationExceptionLevel.error,
                    source: 'NodeValidation',
                    patches: [{
                        patch: 'NVMInstallPatch'
                    }, {
                        patch: 'NodeVersionInstallPatch'
                    }]
                })
            ];
        }

        const validationExceptions: ValidationException[] = [];

        if (!nodeVersionManagerInfo.nvm) {
            // no .nvmrc file found
            validationExceptions.push(new ValidationException({
                message: `No .nvmrc ressource file found, you might add one`,
                source: 'NodeValidation',
                level: ValidationExceptionLevel.info,
                patches: [{
                    patch: 'NVMInstallPatch'
                }]
            }));
        } else if (typeof nodeVersionManagerInfo.nvm === 'string') {
            // check for lts updates in .nvmrc
            const nvmUpgradeException = await this.checkManagerForUpdate(nodeVersionManagerInfo.nvm, 'nvm', 'UpdateNVMPatch');
            if (nvmUpgradeException) {
                validationExceptions.push(nvmUpgradeException);
            }
        }

        if (!nodeVersionManagerInfo['node-version']) {
            // no .node-version file found
            validationExceptions.push(new ValidationException({
                message: `No .node-version ressource file found, you might add one`,
                source: 'NodeValidation',
                level: ValidationExceptionLevel.warning,
                patches: [{
                    patch: 'NodeVersionInstallPatch'
                }]
            }));
        } else if (typeof nodeVersionManagerInfo["node-version"] === 'string') {
            // check for lts updates in .node-version
            const nodeVersionUpgradeException = await this.checkManagerForUpdate(nodeVersionManagerInfo["node-version"], 'node-version', 'UpdateNodeVersionPatch');
            if (nodeVersionUpgradeException) {
                validationExceptions.push(nodeVersionUpgradeException);
            }
        }

        return validationExceptions;
    }

    /**
     * Check if there's an LTS update for a certain manager
     * @param selectedVersion current node version from file
     * @param config configuration type (nvm or node-version)
     * @param patch patch needed if upgrade available
     */
    async checkManagerForUpdate(selectedVersion: string, config: string, patch: string): Promise<ValidationException | void> {
        const checkForUpdate = await checkNewerLTSVersion('node', selectedVersion);

        if (checkForUpdate.upgradable) {
            return new ValidationException({
                message: `There's a newer node LTS version available for ${config}, try upgrading`,
                source: 'NodeValidation',
                level: ValidationExceptionLevel.info,
                patches: [{
                    patch,
                    arguments: {
                        current: checkForUpdate.current,
                        latest: checkForUpdate.latest
                    }
                }]
            })
        }
    }
}