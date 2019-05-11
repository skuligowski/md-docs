export declare interface StartOptions {
	port?: number;
	theme?: string;
	watch?: boolean;
	ignored?: string|RegExp|string[]|RegExp[];
	debug?: boolean;
	docsDestDir?: string;
}

export declare function start(src: string, options?: StartOptions): void;
