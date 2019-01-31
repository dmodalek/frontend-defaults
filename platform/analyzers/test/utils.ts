import path from 'path';
import { IContext, Context } from '@namics/frontend-defaults-platform-core';

export const getFixtureContext = async (name: string): Promise<IContext> => {
	return await new Context({
		root: path.join(__dirname, `../node_modules/@namics/frontend-defaults-platform-test-fixtures/${name}`)
	}).bind();
};
