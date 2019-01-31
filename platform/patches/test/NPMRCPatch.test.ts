import { getFixtureContext } from './utils';
import { NPMRCPatch } from '../src/NPMRCPatch';
import { buildSinglePatch } from '@namics/frontend-defaults-platform-core';

const FIXTURE_NPMRC = getFixtureContext('npmrc-project');
const FIXTURE_NONE = getFixtureContext('default-project');

describe('Patches', () => {
    describe('NPMRCPatch', async () => {
        it('should be buildable', () => {
            expect(async () => {
                buildSinglePatch(await FIXTURE_NONE, NPMRCPatch);
            }).not.toThrow();
        });
    });
});