import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const readComparisonPage = async () => {
	const comparisonPage = await readFile(
		new URL('../dist/scroll-cards/index.html', import.meta.url),
		'utf8',
	);
	const stylesheetPaths = [...comparisonPage.matchAll(/href="([^"]+scroll-cards\.[^"]+\.css)"/g)].map(
		([, path]) => path,
	);
	const stylesheets = await Promise.all(
		stylesheetPaths.map((path) =>
			readFile(new URL(`../dist${path.replace('/animation-playground', '')}`, import.meta.url), 'utf8'),
		),
	);

	return [comparisonPage, ...stylesheets].join('\n');
};

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

test('the CSS implementation gives its Card Stream a sticky viewport stage', async () => {
	const comparisonPage = await readComparisonPage();

	assert.match(
		comparisonPage,
		/data-css-stage[\s\S]*?class="card-stream-scene card-stream-scene--css"/,
	);
	assert.match(comparisonPage, /\.card-stream-scene--css[^{]*\{[^}]*min-height:600svh/);
	assert.match(
		comparisonPage,
		/\.card-stream-scene--css[^{]* \.card-stream-stage[^{]*\{[^}]*position:sticky[^}]*min-height:100svh/,
	);
	assert.match(
		comparisonPage,
		/\.comparison-stage--css[^{]* \.stage-heading[^{]*\{[^}]*position:sticky[^}]*top:clamp\(/,
	);
});

test('the CSS implementation moves staggered cards through a native scroll timeline', async () => {
	const comparisonPage = await readComparisonPage();

	assert.match(comparisonPage, /view-timeline-name:\s*--css-card-stream/);
	assert.match(comparisonPage, /animation-timeline:\s*--css-card-stream/);
	assert.equal((comparisonPage.match(/animation-range:\s*\d+%\s+\d+%/g) ?? []).length, 6);
	assert.match(comparisonPage, /@keyframes css-card-flow\s*\{/);
	assert.match(
		comparisonPage,
		/@keyframes css-card-flow\{[\s\S]*?opacity:0[\s\S]*?translate3d\([^)]*\+ 70vw[\s\S]*?opacity:1[\s\S]*?translate3d\([^)]*- 70vw/,
	);
	assert.match(comparisonPage, /38%,54%\{z-index:3;opacity:1/);
	assert.match(
		comparisonPage,
		/54%\{[\s\S]*?translate3d\([^)]*\+ 18vw[\s\S]*?68%\{[\s\S]*?opacity:\.48[\s\S]*?80%\{[\s\S]*?opacity:\.1/,
	);
});

test('animated cards retain a focused reading width while crossing the viewport', async () => {
	const comparisonPage = await readComparisonPage();
	const featureQueryPosition = comparisonPage.search(
		/@supports\s*\(animation-timeline:\s*view\(\)\)/,
	);
	const animatedStyles = comparisonPage.slice(featureQueryPosition);

	assert.match(
		animatedStyles,
		/\.motion-concept-card[^{]*\{[^}]*width:clamp\(260px,29vw,420px\)/,
	);
});

test('unsupported browsers receive a readable, non-sticky Card Stream fallback', async () => {
	const comparisonPage = await readComparisonPage();

	assert.match(
		comparisonPage,
		/class="motion-support-note"[^>]*>[\s\S]*?shown without scroll-linked motion/,
	);
	assert.match(comparisonPage, /\.motion-support-note[^{]*\{[^}]*display:block/);
	assert.match(
		comparisonPage,
		/@supports\s*\(animation-timeline:\s*view\(\)\)\s*\{[\s\S]*?\.motion-support-note[^{]*\{display:none/,
	);
	const featureQueryPosition = comparisonPage.search(
		/@supports\s*\(animation-timeline:\s*view\(\)\)/,
	);
	assert.ok(
		comparisonPage.indexOf('min-height:600svh') > featureQueryPosition,
		'the long sticky scene should only apply when scroll timelines are supported',
	);
});

test('reduced-motion visitors receive every card without sticky or animated movement', async () => {
	const comparisonPage = await readComparisonPage();
	const reducedMotionStyles = comparisonPage.match(
		/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]+)\}\s*$/,
	)?.[1];

	assert.ok(reducedMotionStyles, 'a reduced-motion override should be emitted');
	assert.match(reducedMotionStyles, /\.card-stream-scene--css[^{]*\{[^}]*min-height:auto/);
	assert.match(
		reducedMotionStyles,
		/\.card-stream-scene--css[^{]* \.card-stream-stage[^{]*\{[^}]*position:relative[^}]*min-height:auto/,
	);
	assert.match(
		reducedMotionStyles,
		/\.motion-concept-card[^{]*\{[^}]*position:relative[^}]*opacity:1[^}]*transform:none[^}]*animation:none/,
	);
});
