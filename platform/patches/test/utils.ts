import { Context, IContext } from '@namics/frontend-defaults-platform-core';
import { join } from 'path';

export const getFixtureContext = async (name: string): Promise<IContext> => {
    return await new Context({
        root: join(__dirname, `../node_modules/@namics/frontend-defaults-platform-test-fixtures/${name}`)
    }).bind();
};
