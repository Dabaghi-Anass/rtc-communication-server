/**
 * Calls a function safely, returning an error if the function throws an error.
 * @param fn The promise to resolve.
 * @returns A tuple containing the error (if any) and the result of the function.
 * If the function throws an error, the error will be in the first element of the tuple.
 * If the function executes successfully, the result will be in the second element of the tuple.
 * If the function throws an error, the result will be null.
 */
export async function catchError<T>(
	promise: Promise<T>
): Promise<[undefined, T] | [Error]> {
	return promise
		.then((result) => [undefined, result] as [undefined, T])
		.catch((error) => [error]);
}
