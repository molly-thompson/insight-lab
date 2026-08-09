import assert from "assert";
import {
	processResultsData,
	getTopScores,
} from "../assets/js/modules/results-data.js";

function makeQuestion(id, options) {
	return { id, text: `Q${id}`, options };
}

function testAggregatesNumericVals() {
	const q = makeQuestion(1, [
		{ ansId: "a", text: "A", vals: { one: 2, two: 1 } },
		{ ansId: "b", text: "B", vals: { one: 3 } },
	]);
	const result = processResultsData([q, q], ["a", "b"]);
	assert.strictEqual(result.scores.one, 5);
	assert.strictEqual(result.scores.two, 1);
}

function testMissingAnswerHandled() {
	const q = makeQuestion(2, [{ ansId: "x", text: "X", type: "Foo" }]);
	const result = processResultsData([q], [undefined]);
	assert.strictEqual(result.answers[0].choice, "(no answer)");
	assert.strictEqual(result.scores.Unknown, 1);
}

function testTypeFallback() {
	const q = makeQuestion(3, [{ ansId: "y", text: "Y", type: "Bar" }]);
	const result = processResultsData([q], ["y"]);
	assert.strictEqual(result.scores.Bar, 1);
}

function testTiesProduceBalanced() {
	const q1 = makeQuestion(4, [
		{ ansId: "a", vals: { A: 2 } },
		{ ansId: "b", vals: { B: 2 } },
	]);
	const r = processResultsData([q1, q1], ["a", "b"]);
	assert.strictEqual(r.overall, "Balanced");
}

function testGetTopScores() {
	const scores = { a: 10, b: 5, c: 7 };
	const top = getTopScores(scores, 2);
	assert.strictEqual(top.length, 2);
	assert.strictEqual(top[0].category, "a");
	assert.strictEqual(top[1].category, "c");
}

// run tests
testAggregatesNumericVals();
testMissingAnswerHandled();
testTypeFallback();
testTiesProduceBalanced();
testGetTopScores();

console.log("test-results-data.mjs: all assertions passed");
