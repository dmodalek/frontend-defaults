import { checkInternetConnection, getFixtureDir, getLatestVersion } from './utils';
import { nodeValidation } from '../src/node';
import { nodeAnalyzer, NodeAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { analyze } from '@namics/frontend-defaults-platform-core';

const generateAnalyticsFor = async (fixtureContext: string): Promise<NodeAnalyzerResult> => {
    return await analyze(fixtureContext, nodeAnalyzer);
};

const FIXTURE_VERSION_MANAGER = getFixtureDir('version-manager-project');
const FIXTURE_NO_MANAGER = getFixtureDir('default-project');
const FIXTURE_NVM = getFixtureDir('nvm-only-project');
const FIXTURE_NODE_VERSION = getFixtureDir('node-version-only-project');

beforeAll(async () => {
    if (!(await checkInternetConnection())) {
        console.debug(`Please only run tests while connected to the internet!`);
        process.exit(1); // kill child worker
    }
});

describe('Validations', () => {
    describe('NodeValidations', () => {
        it('should not thorw any error', async () => {
            expect(async () => {
                const analytics = await generateAnalyticsFor(FIXTURE_VERSION_MANAGER);
                nodeValidation(FIXTURE_VERSION_MANAGER, analytics);
            }).not.toThrow();
        });

        it('should recognize need to install both managers', async () => {
            const analytics = await generateAnalyticsFor(FIXTURE_NO_MANAGER);
            const exceptions = await nodeValidation(FIXTURE_NO_MANAGER, analytics);


            expect(exceptions).toHaveLength(1);
            expect(exceptions).toMatchSnapshot();
            expect(exceptions[0].patch).toEqual(['NVMInstallPatch', 'NodeVersionInstallPatch']);
        });

        it('should recognize both managers and their updates', async () => {
            const analytics = await generateAnalyticsFor(FIXTURE_VERSION_MANAGER);
            const exceptions = await nodeValidation(FIXTURE_VERSION_MANAGER, analytics);

            expect(exceptions).toHaveLength(2);
            expect(exceptions).toMatchSnapshot();

            const [nvmUpdate, nodeVersionUpdate] = exceptions;
            expect(nvmUpdate.patch![0]).toEqual(['UpdateNVMPatch', {
                current: '9.0.0',
                latest: await getLatestVersion('node', true)
            }]);
            expect(nodeVersionUpdate.patch![0]).toEqual(['UpdateNodeVersionPatch', {
                current: '9.0.0',
                latest: await getLatestVersion('node', true)
            }]);
        });

        it('should recognize the nvm manager, nvm update and node-version installation', async () => {
            const analytics = await generateAnalyticsFor(FIXTURE_NVM);
            const exceptions = await nodeValidation(FIXTURE_VERSION_MANAGER, analytics);

            expect(exceptions).toHaveLength(2);
            expect(exceptions).toMatchSnapshot();

            const [nvmUpdate, nodeVersionInstall] = exceptions;
            expect(nvmUpdate.patch![0]).toEqual(['UpdateNVMPatch', {
                current: '10.0.0',
                latest: await getLatestVersion('node', true)
            }]);
            expect(nodeVersionInstall.patch![0]).toEqual('NodeVersionInstallPatch');
        });

        it('should recognize the node-version manager, node-version update and nvm installation', async () => {
            const analytics = await generateAnalyticsFor(FIXTURE_NODE_VERSION);
            const exceptions = await nodeValidation(FIXTURE_VERSION_MANAGER, analytics);

            expect(exceptions).toHaveLength(2);
            expect(exceptions).toMatchSnapshot();

            const [nvmInstall, nodeVersionUpdate] = exceptions;
            expect(nvmInstall.patch![0]).toEqual('NVMInstallPatch');
            expect(nodeVersionUpdate.patch![0]).toEqual(['UpdateNodeVersionPatch', {
                current: '10.0.0',
                latest: await getLatestVersion('node', true)
            }]);
        });
    });
});