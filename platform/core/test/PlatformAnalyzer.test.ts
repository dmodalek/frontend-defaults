import { ProjectAnalyzer } from '../src/ProjectAnalyzer'
import { getFixtureContext } from './utils';

describe('Core', () => {
    describe('ProjectAnalyzer', () => {
        it('should not crash on analyzation process', () => {
            expect(async () => {
                await new ProjectAnalyzer({
                    context: await getFixtureContext('default-project'),
                    analyzers: []
                }).boot();
            }).not.toThrow();
        });
    });
});