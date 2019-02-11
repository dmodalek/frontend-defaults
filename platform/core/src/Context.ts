import { IPackage } from './types/Package';
import { displayPath, fileExists, getJSON } from './utils/fs';
import { join } from 'path';
// import { PackageAnalyzer } from './PackageAnalyzer';

type ContextOptions = {
    root?: string,
}

type ContextSaveOptions = {
    root: string
}

export interface IContext {
    monorepo: boolean,
    package: IPackage,
    root: string;
    bind(): Promise<IContext>;
    getPath(lookup: string): string;
}

export class Context implements IContext {
    public monorepo: boolean;
    private rawPackage: IPackage;
    private internalPackageAnalyzer: any;
    private options: ContextSaveOptions;

    constructor(options: ContextOptions) {
        // set current working directory as default root
        options.root = options.root || process.cwd();
        this.options = <ContextSaveOptions>options;
    }

    /**
     * Attach context to the virtual project location. This step
     * is needed to setup the context correctly!
     * @returns {ThisType<IContext>}
     */
    public async bind(): Promise<IContext> {
        try {
            let pkg = await getJSON<IPackage>(join(this.root, 'package.json'));
            if ((pkg as any).code === 'ENOENT') {
                // getJSON can also return an error, maybe we should type this?
                throw new Error(`No valid project found in context ${displayPath(this.root)}`);
            }

            // generate save package to use for further purposes e.g. getting dependencies
            pkg = this.savePackageAccess(pkg);
            this.rawPackage = pkg;
            // this.internalPackageAnalyzer = new PackageAnalyzer(this.rawPackage);

            // we try to guess whether this context is a monorepo or not,
            // this flag won't be 100% accurate atm, we need to find a better way
            this.monorepo = await fileExists(join(this.root, 'lerna.json')) || await fileExists(join(this.root, 'nx.json'));

            return this as any;
        } catch (err) {
            throw new Error(`Invalid context: package.json is missing in ${displayPath(this.root)}`);
        }
    }

    /**
     * Root path to the current context (absolute)
     * @type {string}
     */
    public get root(): string {
        return this.options.root;
    }

    public get package(): IPackage {
        // return package, getter because it is readonly
        return this.rawPackage;
    }

    // public get packageAnalyzer(): PackageAnalyzer {
    //     return this.internalPackageAnalyzer;
    // }

    /**
     * Resolves a path in the current context
     * @param lookup a certain path in context
     */
    public getPath(lookup: string): string {
        return join(this.root, lookup);
    }

    private savePackageAccess(pkg: IPackage | null): IPackage {
        if (!pkg) {
            pkg = {};
        }

        pkg.dependencies = pkg.dependencies || {};
        pkg.devDependencies = pkg.devDependencies || {};
        pkg.peerDependencies = pkg.peerDependencies || {};
        pkg.engines = pkg.engines || {};
        return pkg;
    }
}