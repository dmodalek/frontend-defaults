import { getFixtureContext } from './utils';
import { repositoryAnalyzer } from '../src/repository';

const FIXTURE_LERNA = getFixtureContext('monorepo-project-lerna');
const FIXTURE_LERNA_NI = getFixtureContext('monorepo-project-lerna-not-installed');
const FIXTURE_NX = getFixtureContext('monorepo-project-nrwl');
const FIXTURE_NX_NI = getFixtureContext('monorepo-project-nrwl-not-installed');
const FIXTURE_NONE = getFixtureContext('ts-project-not-installed'); // any fixture without monrepo

describe('Analyzers', () => {
    describe('RepositoryAnalyzer', () => {
        it('should not crash the ProjectAnalyzer', async () => {
            expect(async () => await repositoryAnalyzer(FIXTURE_LERNA)).not.toThrow();
            expect(async () => await repositoryAnalyzer(FIXTURE_LERNA_NI)).not.toThrow();
            expect(async () => await repositoryAnalyzer(FIXTURE_NX)).not.toThrow();
            expect(async () => await repositoryAnalyzer(FIXTURE_NX_NI)).not.toThrow();
            expect(async () => await repositoryAnalyzer(FIXTURE_NONE)).not.toThrow();
        });

        it('should analyze a non-monorepo-ish project correctly', async () => {
            const analytics = await repositoryAnalyzer(FIXTURE_NONE);

            expect(analytics.nx).toEqual(false);
            expect(analytics.lerna).toEqual(false);
            expect(analytics.nxInstallation).toBeUndefined();
            expect(analytics.lernaInstallation).toBeUndefined();
            expect(analytics.nxProjectInformation).toBeUndefined();
            expect(analytics.lernaProjectInformation).toBeUndefined();
        });

        it('should analyze a lerna project correctly', async () => {
            const analytics = await repositoryAnalyzer(FIXTURE_LERNA);

            expect(analytics.lerna).toEqual(true);
            expect(analytics.lernaInstallation!.declared).toEqual('3.0.0');
            expect(analytics.lernaInstallation!.installed).toEqual('3.13.1');
            expect(analytics.lernaInstallation).toMatchSnapshot({
                latest: expect.any(String) // don't save latest version in snapshot
            });
            expect(analytics.lernaProjectInformation).toMatchSnapshot();
            expect(analytics.size).toMatchSnapshot();
        });

        it('should analyze a lerna project without installation correctly', async () => {
            const analytics = await repositoryAnalyzer(FIXTURE_LERNA_NI);

            expect(analytics.lerna).toEqual(true);
            expect(analytics.lernaInstallation!.declared).toEqual('3.0.0');
            expect(analytics.lernaInstallation!.installed).toBeNull();
            expect(analytics.lernaInstallation).toMatchSnapshot({
                latest: expect.any(String) // don't save latest version in snapshot
            });
        });

        it('should analyze a nrwl/nx project correctly', async () => {
            const analytics = await repositoryAnalyzer(FIXTURE_NX);

            expect(analytics.nx).toEqual(true);
            expect(analytics.nxInstallation!.declared).toEqual('6.2.0');
            expect(analytics.nxInstallation!.installed).toEqual('7.7.2');
            expect(analytics.nxInstallation).toMatchSnapshot({
                latest: expect.any(String) // don't save latest version in snapshot
            });
            expect(analytics.nxProjectInformation).toMatchSnapshot();
            expect(analytics.size).toMatchSnapshot();
        });

        it('should analyze a nrwl/nx project without installation correctly', async () => {
            const analytics = await repositoryAnalyzer(FIXTURE_NX_NI);

            expect(analytics.nx).toEqual(true);
            expect(analytics.nxInstallation!.declared).toEqual('6.2.0');
            expect(analytics.nxInstallation!.installed).toBeNull();
            expect(analytics.nxInstallation).toMatchSnapshot({
                latest: expect.any(String) // don't save latest version in snapshot
            });
        });
    });
});
