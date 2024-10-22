let chalk = null;
export async function getLogger() {
	if (!chalk) {
		chalk = (await import("chalk")).default;
	}
	const logger = {
		info: async (message: string, ...rest) => {
			console.log(chalk.blueBright.bold(`[INFO] ${message}`), ...rest);
		},
		error: async (message: string, ...rest) => {
			console.log(chalk.redBright.bold(`[ERROR] ${message}`), ...rest);
		},
		warn: async (message: string, ...rest) => {
			console.log(chalk.yellowBright.bold(`[WARN] ${message}`), ...rest);
		},
		debug: async (message: string, ...rest) => {
			console.log(chalk.greenBright.bold(`[DEBUG] ${message}`), ...rest);
		},
		trace: async (message: string, ...rest) => {
			console.log(
				chalk.magentaBright.bold(`[TRACE] ${message}`),
				...rest
			);
		},
		success: async (message: string, ...rest) => {
			console.log(
				chalk.greenBright.bold(`[SUCCESS] ${message}`),
				...rest
			);
		},
	};
	return logger;
}
