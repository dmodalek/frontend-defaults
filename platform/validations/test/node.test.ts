import { ProjectAnalyzer, ProjectValidator } from "@namics/frontend-defaults-platform-core";
import { NodeAnalyzer, NodeAnalyzerResult } from '@namics/frontend-defaults-platform-analyzers';
import { checkInternetConnection, getFixtureDir, getLatestVersion } from './utils';
import { NodeValidation } from '../src/node';

const getAnalyzerFor = async (fixtureContext: string): Promise<ProjectAnalyzer<NodeAnalyzerResult>> => {
    return new ProjectAnalyzer<NodeAnalyzerResult>({
        context: fixtureContext,
        analyzers: [NodeAnalyzer],
    }).boot();
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
                const analyzer = await getAnalyzerFor(FIXTURE_VERSION_MANAGER);
                new ProjectValidator({
                    analyzer,
                    validations: [NodeValidation]
                })
            }).not.toThrow();
        });

        it('should recognize need to install both managers', async () => {
            const analyzer = await getAnalyzerFor(FIXTURE_NO_MANAGER);
            const validator = new ProjectValidator({
                analyzer,
                validations: [NodeValidation]
            });

            const patches = await validator.validate();
            expect(patches).toHaveLength(2);
            expect(patches).toMatchSnapshot();

            const [nvmInstall, nodeVersionInstall] = patches;
            expect(nvmInstall.patch).toEqual('NVMInstallPatch');
            expect(nodeVersionInstall.patch).toEqual('NodeVersionInstallPatch');
        });

        it('should recognize both managers and their updates', async () => {
            const analyzer = await getAnalyzerFor(FIXTURE_VERSION_MANAGER);
            const validator = new ProjectValidator({
                analyzer,
                validations: [NodeValidation]
            });

            const patches = await validator.validate();
            expect(patches).toHaveLength(2);
            expect(patches).toMatchSnapshot();

            const [nvmUpdate, nodeVersionUpdate] = patches;
            expect(nvmUpdate.patch).toEqual('UpdateNVMPatch');
            expect(nvmUpdate.arguments.current).toEqual('9.0.0');
            expect(nvmUpdate.arguments.latest).toEqual(await getLatestVersion('node', true));
            expect(nodeVersionUpdate.patch).toEqual('UpdateNodeVersionPatch');
            expect(nodeVersionUpdate.arguments.current).toEqual('9.0.0');
            expect(nodeVersionUpdate.arguments.latest).toEqual(await getLatestVersion('node', true));
        });

        it('should recognize the nvm manager, nvm update and node-version installation', async () => {
            const analyzer = await getAnalyzerFor(FIXTURE_NVM);
            const validator = new ProjectValidator({
                analyzer,
                validations: [NodeValidation]
            });

            const patches = await validator.validate();
            expect(patches).toHaveLength(2);
            expect(patches).toMatchSnapshot();

            const [nvmUpdate, nodeVersionInstall] = patches;
            expect(nvmUpdate.patch).toEqual('UpdateNVMPatch');
            expect(nvmUpdate.arguments.current).toEqual('10.0.0');
            expect(nvmUpdate.arguments.latest).toEqual(await getLatestVersion('node', true));
            expect(nodeVersionInstall.patch).toEqual('NodeVersionInstallPatch');
        });

        it('should recognize the node-version manager, node-version update and nvm installation', async () => {
            const analyzer = await getAnalyzerFor(FIXTURE_NODE_VERSION);
            const validator = new ProjectValidator({
                analyzer,
                validations: [NodeValidation]
            });

            const patches = await validator.validate();
            expect(patches).toHaveLength(2);
            expect(patches).toMatchSnapshot();

            const [nvmInstall, nodeVersionUpdate] = patches;
            expect(nvmInstall.patch).toEqual('NVMInstallPatch');
            expect(nodeVersionUpdate.patch).toEqual('UpdateNodeVersionPatch');
            expect(nodeVersionUpdate.arguments.current).toEqual('10.0.0');
            expect(nodeVersionUpdate.arguments.latest).toEqual(await getLatestVersion('node', true));
        });
    });
});