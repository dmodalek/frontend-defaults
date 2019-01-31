import { IPackage } from "./types/Package";
import { PackageAnalyzer } from './PackageAnalyzer';
import { getJSON, displayPath } from './utils/fs';
import { join } from 'path';

type ContextOptions = {
    root?: string,
}

type ContextSaveOptions = {
    root: string
}

export interface IContext {
    package: IPackage,
    packageAnalyzer: PackageAnalyzer,
    root: string;
    bind(): Promise<IContext>;
    getPath(lookup: string): string;
}

export class Context implements IContext {
    private rawPackage: IPackage;
    private internalPackageAnalyzer: PackageAnalyzer;
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

            pkg = this.savePackageAccess(pkg);
            this.rawPackage = pkg;
            this.internalPackageAnalyzer = new PackageAnalyzer(this.rawPackage);

            return this;
        } catch (err) {
            throw new Error(`Invalid context: package.json is missing in ${displayPath(this.root)}`);
        }
    }

    public get root(): string {
        return this.options.root;
    }

    public get package(): IPackage {
        // return package, getter because it is readonly
        return this.rawPackage;
    }

    public get packageAnalyzer(): PackageAnalyzer {
        return this.internalPackageAnalyzer;
    }

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