type Analyzer<T> = (cwd: string) => Promise<T>;

function analyze(cwd: string): Object;
function analyze<A1>(cwd: string, a1: Analyzer<A1>): A1;
function analyze<A1, A2>(cwd: string, a1: Analyzer<A1>, a2: Analyzer<A2>): A1 & A2;
function analyze<A1, A2, A3>(cwd: string, a1: Analyzer<A1>, a2: Analyzer<A2>, a3: Analyzer<A3>): A1 & A2 & A3;
function analyze<A1, A2, A3, A4>(
	cwd: string,
	a1: Analyzer<A1>,
	a2: Analyzer<A2>,
	a3: Analyzer<A3>,
	a4: Analyzer<A4>
): A1 & A2 & A3 & A4;
function analyze<A1, A2, A3, A4, A5>(
	cwd: string,
	a1: Analyzer<A1>,
	a2: Analyzer<A2>,
	a3: Analyzer<A3>,
	a4: Analyzer<A4>,
	a5: Analyzer<A5>
): A1 & A2 & A3 & A4 & A5;
function analyze<A1, A2, A3, A4, A5, A6>(
	cwd: string,
	a1: Analyzer<A1>,
	a2: Analyzer<A2>,
	a3: Analyzer<A3>,
	a4: Analyzer<A4>,
	a5: Analyzer<A5>,
	a6: Analyzer<A6>
): A1 & A2 & A3 & A4 & A5 & A6;
function analyze<A1, A2, A3, A4, A5, A6, A7>(
	cwd: string,
	a1: Analyzer<A1>,
	a2: Analyzer<A2>,
	a3: Analyzer<A3>,
	a4: Analyzer<A4>,
	a5: Analyzer<A5>,
	a6: Analyzer<A6>,
	a7: Analyzer<A7>
): A1 & A2 & A3 & A4 & A5 & A6 & A7;
function analyze<A1, A2, A3, A4, A5, A6, A7, A8>(
	cwd: string,
	a1: Analyzer<A1>,
	a2: Analyzer<A2>,
	a3: Analyzer<A3>,
	a4: Analyzer<A4>,
	a5: Analyzer<A5>,
	a6: Analyzer<A6>,
	a7: Analyzer<A7>,
	a8: Analyzer<A8>
): A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8;
function analyze<A1, A2, A3, A4, A5, A6, A7, A8, A9>(
	cwd: string,
	a1: Analyzer<A1>,
	a2: Analyzer<A2>,
	a3: Analyzer<A3>,
	a4: Analyzer<A4>,
	a5: Analyzer<A5>,
	a6: Analyzer<A6>,
	a7: Analyzer<A7>,
	a8: Analyzer<A8>,
	a9: Analyzer<A9>
): A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9;
function analyze<A1, A2, A3, A4, A5, A6, A7, A8, A9, A10>(
	cwd: string,
	a1: Analyzer<A1>,
	a2: Analyzer<A2>,
	a3: Analyzer<A3>,
	a4: Analyzer<A4>,
	a5: Analyzer<A5>,
	a6: Analyzer<A6>,
	a7: Analyzer<A7>,
	a8: Analyzer<A8>,
	a9: Analyzer<A9>,
	a10: Analyzer<A10>
): A1 & A2 & A3 & A4 & A5 & A6 & A7 & A8 & A9 & A10;
function analyze<Result extends Object = object>(cwd: string, ...analyzers: Analyzer<any>[]): Result {
	if (!analyzers || analyzers.length === 0) {
		return {} as Result;
	}

	return analyzers.reduce(
		async (prev: any, curr: Analyzer<any>) => ({
			...(await prev),
			...(await curr(cwd)),
		}),
		Promise.resolve({} as any)
	);
}

export { analyze };
