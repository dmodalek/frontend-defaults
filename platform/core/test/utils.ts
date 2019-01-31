import { join } from 'path';
import { Context, IContext } from '../src/Context';

export async function getFixtureContext(fixture: string): Promise<IContext> {
    return await new Context({
        root: join(__dirname, `../node_modules/@namics/frontend-defaults-platform-test-fixtures/`, fixture)
    }).bind();
}