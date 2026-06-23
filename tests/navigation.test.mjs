import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readBuiltPage = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');

test('the home page links to the Scroll Card Gallery experiment', async () => {
	const homePage = await readBuiltPage('index.html');

	assert.match(homePage, /href="\/animation-playground\/scroll-cards\/"/);
	assert.match(homePage, />Explore scroll cards</);
});

test('the Motion Comparison page links back to the playground', async () => {
	const comparisonPage = await readBuiltPage('scroll-cards/index.html');

	assert.match(comparisonPage, /<h1[^>]*>Scroll Card Gallery<\/h1>/);
	assert.match(comparisonPage, /href="\/animation-playground\/"/);
	assert.match(comparisonPage, />Back to playground</);
});

test('the Motion Comparison presents GSAP before native CSS', async () => {
	const comparisonPage = await readBuiltPage('scroll-cards/index.html');
	const gsapPosition = comparisonPage.indexOf('GSAP ScrollTrigger');
	const cssPosition = comparisonPage.indexOf('CSS Scroll-Driven Animations');

	assert.notEqual(gsapPosition, -1);
	assert.notEqual(cssPosition, -1);
	assert.ok(gsapPosition < cssPosition);
});
