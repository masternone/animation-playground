import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readComparisonPage = () =>
	readFile(new URL('../dist/scroll-cards/index.html', import.meta.url), 'utf8');

const cardTitles = [
	'Pinned Stage',
	'Scroll Progress',
	'View Timeline',
	'Layered Cards',
	'Reduced Motion',
	'Performance Budget',
];

test('both implementations present the same six Motion Concept Cards', async () => {
	const comparisonPage = await readComparisonPage();

	for (const title of cardTitles) {
		const occurrences = comparisonPage.match(new RegExp(`>${title}</h3>`, 'g')) ?? [];

		assert.equal(occurrences.length, 2, `${title} should appear once in each Card Stream`);
	}
});

test('each Motion Concept Card presents an optimized image with useful alternative text', async () => {
	const comparisonPage = await readComparisonPage();

	for (const title of cardTitles) {
		const altText = `alt="${title} concept illustration"`;
		const occurrences = comparisonPage.match(new RegExp(altText, 'g')) ?? [];

		assert.equal(occurrences.length, 2, `${title} should have an image in each Card Stream`);
	}

	assert.equal((comparisonPage.match(/<img /g) ?? []).length, 12);
	assert.equal((comparisonPage.match(/<img [^>]*width="\d+"[^>]*height="\d+"/g) ?? []).length, 12);
});

test('both implementations expose the same accessible staggered Card Stream contract', async () => {
	const comparisonPage = await readComparisonPage();

	assert.equal((comparisonPage.match(/data-card-stream/g) ?? []).length, 2);
	assert.equal((comparisonPage.match(/role="list"/g) ?? []).length, 2);
	assert.equal((comparisonPage.match(/role="listitem"/g) ?? []).length, 12);

	for (const index of cardTitles.keys()) {
		const stagger = `style="--stream-index: ${index}"`;
		assert.equal((comparisonPage.match(new RegExp(stagger, 'g')) ?? []).length, 2);
	}
});
