export interface IAction<T extends boolean = boolean> {
	exec: () => Promise<T>
}

export interface IShellAction extends IAction {
	commands: string[]
}

export interface IRawFileSystemCreateAction extends IAction {
	target: string,
	content: string
}

export interface IRawFileSystemChangeAction extends IAction {
	base: string;
	overrides: string;
	merged: string;
}

export interface IJSONFileSystemAction<T> extends IAction {
	base: Partial<T>;
	overrides: Partial<T>;
	merged: T;
}