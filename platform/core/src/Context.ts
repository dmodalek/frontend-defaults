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
    root: string
}

export class Context {
    public package: IPackage;
    public packageAnalyzer: PackageAnalyzer;
    private options: ContextSaveOptions;

    constructor(options: ContextOptions) {
        // set current working directory as default root
        options.root = options.root || process.cwd();
        this.options = <ContextSaveOptions>options;
    }

    public async bind() {
        try {
            let pkg = await getJSON<IPackage>(join(this.root, 'package.json'));

            if ((this.package as NodeJS.ErrnoException).code === 'ENOENT') {
                throw new Error(`No valid project found in context ${displayPath(this.root)}`);
            }

            pkg = this.savePackageAccess(pkg);
            this.package = pkg;
            this.packageAnalyzer = new PackageAnalyzer(this.package);

            return this;
        } catch (err) {
            throw new Error(`Invalid context: package.json is missing in ${displayPath(this.root)}`);
        }
    }

    public get root(): string {
        return this.options.root;
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