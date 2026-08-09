import fs from "fs";
import path from "path";

const testsDir = new URL("./", import.meta.url).pathname + "";

async function run() {
	const files = fs
		.readdirSync(path.join(process.cwd(), "tests"))
		.filter((f) => f.endsWith(".mjs") && f !== "run-tests.mjs");
	let failed = 0;
	for (const f of files) {
		process.stdout.write(`Running ${f}... `);
		try {
			await import(`./${f}`);
			console.log("ok");
		} catch (e) {
			failed += 1;
			console.log("FAILED");
			console.error(e);
		}
	}
	if (failed > 0) {
		console.error(`${failed} test file(s) failed.`);
		process.exit(1);
	}
	console.log("All tests passed.");
}

run();
