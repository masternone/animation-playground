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
	const scriptPaths = [...comparisonPage.matchAll(/src="([^"]+CardStream[^"]+\.js)"/g)].map(
		([, path]) => path,
	);
	const stylesheets = await Promise.all(
		stylesheetPaths.map((path) =>
			readFile(new URL(`../dist${path.replace('/animation-playground', '')}`, import.meta.url), 'utf8'),
		),
	);
	const scripts = await Promise.all(
		scriptPaths.map((path) =>
			readFile(new URL(`../dist${path.replace('/animation-playground', '')}`, import.meta.url), 'utf8'),
		),
	);

	return [comparisonPage, ...scripts, ...stylesheets].join('\n');
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

	assert.equal(
		(comparisonPage.match(/<img [^>]*alt="[^"]+ concept illustration"/g) ?? []).length,
		12,
	);
	assert.equal((comparisonPage.match(/<img /g) ?? []).length, 13);
	assert.equal((comparisonPage.match(/<img [^>]*width="\d+"[^>]*height="\d+"/g) ?? []).length, 13);
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

test('the Motion Comparison renders its generated Hero Image', async () => {
	const comparisonPage = await readComparisonPage();

	assert.match(
		comparisonPage,
		/<img [^>]*src="[^"]*scroll-cards-hero[^"]*"[^>]*alt="Layered motion cards sweeping across a colorful browser animation stage"/,
	);
	assert.match(comparisonPage, /loading="eager"/);
});

test('the GSAP implementation gives its Card Stream a pinned viewport stage', async () => {
	const comparisonPage = await readComparisonPage();

	assert.match(
		comparisonPage,
		/data-gsap-stage[\s\S]*?class="card-stream-scene card-stream-scene--gsap"/,
	);
	assert.match(
		comparisonPage,
		/\.card-stream-scene--gsap[^{]*\{[^}]*min-height:var\(--card-stream-scene-height\)/,
	);
	assert.match(
		comparisonPage,
		/\.card-stream-scene--gsap[^{]* \.card-stream-stage[^{]*\{[^}]*min-height:100svh/,
	);
});

test('the GSAP Card Stream is wired to a scroll-scrubbed ScrollTrigger timeline', async () => {
	const comparisonPage = await readComparisonPage();
	const packageJson = JSON.parse(
		await readFile(new URL('../package.json', import.meta.url), 'utf8'),
	);

	assert.ok(packageJson.dependencies.gsap, 'GSAP should be a production dependency');
	assert.match(
		comparisonPage,
		/data-gsap-card-stream-scene[\s\S]*?data-gsap-card-stream-stage[\s\S]*?data-card-stream/,
	);
});

test('the GSAP cards follow the same staggered motion ranges as the CSS Card Stream', async () => {
	const comparisonPage = await readComparisonPage();
	const gsapSection = comparisonPage.match(/data-gsap-stage([\s\S]*?)data-css-stage/)?.[1];
	const ranges = ['4 36', '14 46', '24 56', '34 66', '44 76', '54 88'];
	const lanes = ['-10', '-4', '2', '7', '-2', '5'];

	assert.ok(gsapSection, 'the rendered GSAP section should be available');

	for (const range of ranges) {
		assert.match(gsapSection, new RegExp(`data-motion-range="${range}"`));
		assert.match(comparisonPage, new RegExp(`animation-range:${range.replace(' ', '% ')}%`));
	}

	for (const lane of lanes) {
		assert.match(gsapSection, new RegExp(`data-motion-lane="${lane}"`));
		assert.match(comparisonPage, new RegExp(`--stream-lane:\\s*${lane}svh`));
	}
});

test('the first Card Stream lane mirrors card three around card two', async () => {
	const comparisonPage = await readComparisonPage();
	const gsapSection = comparisonPage.match(/data-gsap-stage([\s\S]*?)data-css-stage/)?.[1];

	assert.ok(gsapSection, 'the rendered GSAP section should be available');
	assert.match(gsapSection, /data-motion-range="4 36"[\s\S]*?data-motion-range="14 46"[\s\S]*?data-motion-range="24 56"/);
	assert.match(gsapSection, /data-motion-lane="-10"[\s\S]*?data-motion-lane="-4"[\s\S]*?data-motion-lane="2"/);
	assert.match(comparisonPage, /--stream-lane:\s*-10svh;\s*animation-range:4% 36%/);
});

test('the Motion Comparison resolves into a follow-up panel after both Card Streams', async () => {
	const comparisonPage = await readComparisonPage();

	assert.match(
		comparisonPage,
		/data-css-stage[\s\S]*?<section class="scroll-panel" aria-label="Follow-up content"[^>]*>/,
	);
	assert.match(comparisonPage, /<h2[^>]*>Animation Playground<\/h2>/);
	assert.match(
		comparisonPage,
		/Scroll back to compare the motion contract again, then drift down to leave the Card Stream behind\./,
	);
	assert.match(comparisonPage, /\.scroll-panel[^{]*\{[^}]*min-height:100svh/);
	assert.match(comparisonPage, /\.scroll-panel[^{]*\{[^}]*background:#051719/);
	assert.match(comparisonPage, /\.stage-heading[^{]* h2[^{]*\{[^}]*line-height:\.98/);
	assert.match(comparisonPage, /\.scroll-panel[^{]* h2[^{]*\{[^}]*line-height:normal/);
});

test('the GSAP cards use the same centered coordinate origin as the CSS cards', async () => {
	const comparisonPage = await readComparisonPage();

	assert.match(comparisonPage, /xPercent:-50,yPercent:-50/);
});

test('the GSAP timeline uses the same scene-entry and scene-exit boundaries as the CSS view timeline', async () => {
	const comparisonPage = await readComparisonPage();

	assert.match(comparisonPage, /start:"top bottom",end:"bottom top",scrub:!0/);
	assert.match(comparisonPage, /start:"top top",end:"bottom bottom",pin:/);
});

test('animated Card Streams start pushing the sticky stage before the final card fully exits', async () => {
	const comparisonPage = await readComparisonPage();

	assert.equal((comparisonPage.match(/--card-stream-scene-height:\s*284\.615svh/g) ?? []).length, 2);
	assert.match(comparisonPage, /data-motion-range="54 88"/);
	assert.match(comparisonPage, /animation-range:54% 88%/);
	assert.match(comparisonPage, /x:"-96vw"/);
	assert.match(comparisonPage, /translate3d\([^)]*- 96vw/);
});

test('the CSS implementation gives its Card Stream a sticky viewport stage', async () => {
	const comparisonPage = await readComparisonPage();

	assert.match(
		comparisonPage,
		/data-css-stage[\s\S]*?class="card-stream-scene card-stream-scene--css"/,
	);
	assert.match(
		comparisonPage,
		/\.card-stream-scene--css[^{]*\{[^}]*min-height:var\(--card-stream-scene-height\)/,
	);
	assert.match(
		comparisonPage,
		/\.card-stream-scene--css[^{]* \.card-stream-stage[^{]*\{[^}]*position:sticky[^}]*min-height:100svh/,
	);
	assert.match(
		comparisonPage,
		/\.comparison-stage--gsap[^{]* \.stage-heading[^,]*,\.comparison-stage--css[^{]* \.stage-heading[^{]*\{[^}]*position:sticky[^}]*top:clamp\(/,
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
		/@keyframes css-card-flow\{[\s\S]*?opacity:0[\s\S]*?translate3d\([^)]*\+ 70vw[\s\S]*?opacity:1[\s\S]*?translate3d\([^)]*- 96vw/,
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
	const cssLongScenePosition = comparisonPage.search(
		/\.card-stream-scene--css[^{]*\{[^}]*min-height:var\(--card-stream-scene-height\)/,
	);
	assert.ok(
		cssLongScenePosition > featureQueryPosition,
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
	assert.match(reducedMotionStyles, /\.card-stream-scene--gsap[^{]*\{[^}]*min-height:auto/);
	assert.match(
		reducedMotionStyles,
		/\.card-stream-scene--gsap[^{]* \.card-stream-stage[^{]*\{[^}]*position:relative[^}]*min-height:auto/,
	);
	assert.match(
		reducedMotionStyles,
		/\.card-stream-scene--gsap[^{]* \.card-stream[^{]*\{[^}]*display:grid[^}]*height:auto/,
	);
});
