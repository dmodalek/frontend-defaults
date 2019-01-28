import { ProjectAnalyzer } from '../src/ProjectAnalyzer'
import { getFixtureDir } from './utils';

describe('Core', () => {
    describe('ProjectAnalyzer', () => {
        it('should not crash on analyzation process', () => {
            expect(async () => {
                await new ProjectAnalyzer({
                    context: getFixtureDir('default-project'),
                    analyzers: []
                }).boot();
            }).not.toThrow();
        });
    });
});