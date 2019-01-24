export interface IPackage {
	name?: string;
	description?: string;
	version?: string;
	repository?: string;
	main?: string;
	typings?: string;
	bin?:
		| string
		| {
				[key: string]: string;
		  };
	license?: string;
	author?: string;
	contributors?: string[];
	private?: boolean;
	engines?: {
		[engine: string]: string;
	};
	files?: string[];
	scripts?: {
		[scriptName: string]: string;
	};
	devDependencies?: {
		[dependencyName: string]: string;
	};
	dependencies?: {
		[dependencyName: string]: string;
	};
	peerDependencies?: {
		[dependencyName: string]: string;
	};
}
