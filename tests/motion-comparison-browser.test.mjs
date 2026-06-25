import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import test from 'node:test';
import { chromium } from 'playwright';

const distRoot = new URL('../dist', import.meta.url);
const basePath = '/animation-playground';
const origin = 'http://animation-playground.test';
const contentTypes = {
	'.css': 'text/css; charset=utf-8',
	'.html': 'text/html; charset=utf-8',
	'.ico': 'image/x-icon',
	'.js': 'text/javascript; charset=utf-8',
	'.webp': 'image/webp',
};

const withSite = async (callback, { launchOptions = {}, contextOptions = {}, transformStylesheet } = {}) => {
	const browser = await chromium.launch(launchOptions);
	const context = await browser.newContext(contextOptions);

	await context.route('**/*', async (route) => {
		const url = new URL(route.request().url());
		const pathname = url.pathname.startsWith(basePath)
			? url.pathname.slice(basePath.length) || '/'
			: url.pathname;
		const normalizedPath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
		const relativePath = normalizedPath === '/' ? 'index.html' : normalizedPath.replace(/^\//, '');
		const filePath = join(distRoot.pathname, relativePath.endsWith('/') ? `${relativePath}index.html` : relativePath);

		try {
			const fileStat = await stat(filePath);
			if (!fileStat.isFile()) throw new Error('Not a file');

			const body = await readFile(filePath);
			const isStylesheet = extname(filePath) === '.css';

			await route.fulfill({
				body: isStylesheet && transformStylesheet ? transformStylesheet(body.toString()) : body,
				contentType: contentTypes[extname(filePath)] ?? 'application/octet-stream',
				status: 200,
			});
		} catch {
			await route.fulfill({
				body: 'Not found',
				contentType: 'text/plain; charset=utf-8',
				status: 404,
			});
		}
	});

	try {
		await callback({ browser, context, origin });
	} finally {
		await browser.close();
	}
};

const pageUrl = (origin, path = '/') => `${origin}${basePath}${path}`;

const visibleCardTitles = (page, sectionSelector) =>
	page.locator(`${sectionSelector} .motion-concept-card`).evaluateAll((cards) =>
		cards
			.filter((card) => {
				const rect = card.getBoundingClientRect();
				const style = window.getComputedStyle(card);
				return (
					Number(style.opacity) > 0.35 &&
					rect.right > 0 &&
					rect.left < window.innerWidth &&
					rect.bottom > 0 &&
					rect.top < window.innerHeight
				);
			})
			.map((card) => card.querySelector('h3')?.textContent?.trim())
			.filter(Boolean),
	);

const scrollStageToProgress = async (page, sectionSelector, progress) => {
	const y = await page.locator(sectionSelector).evaluate((section, nextProgress) => {
		const rect = section.getBoundingClientRect();
		const top = rect.top + window.scrollY;
		const maxScroll = Math.max(1, rect.height - window.innerHeight);

		return top + maxScroll * nextProgress;
	}, progress);

	await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
	await page.waitForTimeout(120);
};

const assertCardsAreReadable = async (page) => {
	const unreadable = await page.locator('.motion-concept-card').evaluateAll((cards) =>
		cards
			.filter((card) => {
				const rect = card.getBoundingClientRect();
				const style = window.getComputedStyle(card);

				return (
					Number(style.opacity) > 0.35 &&
					rect.right > 0 &&
					rect.left < window.innerWidth &&
					rect.bottom > 0 &&
					rect.top < window.innerHeight
				);
			})
			.map((card) => {
				const heading = card.querySelector('h3')?.getBoundingClientRect();
				const copy = card.querySelector('p')?.getBoundingClientRect();
				const cardRect = card.getBoundingClientRect();

				return {
					title: card.querySelector('h3')?.textContent?.trim(),
					headingOverlapsCopy: Boolean(heading && copy && heading.bottom - copy.top > 2),
					copyEscapesCard: Boolean(copy && copy.bottom > cardRect.bottom),
				};
			})
			.filter(({ headingOverlapsCopy, copyEscapesCard }) => headingOverlapsCopy || copyEscapesCard),
	);

	assert.deepEqual(unreadable, []);
};

test('a browser can navigate between the home page and Motion Comparison', async () => {
	await withSite(async ({ context, origin }) => {
		const page = await context.newPage();

		await page.goto(pageUrl(origin), { waitUntil: 'networkidle' });
		await page.getByRole('link', { name: 'Scroll Cards' }).click();
		await page.waitForURL('**/animation-playground/scroll-cards/');
		await assert.rejects(
			page.getByRole('heading', { name: 'Scroll Card Gallery' }).waitFor({ state: 'hidden', timeout: 1 }),
		);

		await page.getByRole('link', { name: 'Gift Box' }).click();
		await page.waitForURL('**/animation-playground/');
		await assert.rejects(
			page.getByRole('link', { name: 'Scroll Cards' }).waitFor({ state: 'hidden', timeout: 1 }),
		);
	});
});

test('the GSAP Card Stream shows readable cards at representative scroll positions', async () => {
	await withSite(async ({ context, origin }) => {
		const page = await context.newPage();

		await page.goto(pageUrl(origin, '/scroll-cards/'), { waitUntil: 'networkidle' });

		await scrollStageToProgress(page, '[data-gsap-stage]', 0.22);
		assert.ok((await visibleCardTitles(page, '[data-gsap-stage]')).includes('Pinned Stage'));

		await scrollStageToProgress(page, '[data-gsap-stage]', 0.48);
		assert.ok((await visibleCardTitles(page, '[data-gsap-stage]')).includes('View Timeline'));

		await scrollStageToProgress(page, '[data-gsap-stage]', 0.78);
		assert.ok((await visibleCardTitles(page, '[data-gsap-stage]')).includes('Reduced Motion'));
	});
});

test('the CSS Card Stream shows readable cards at representative scroll positions', async () => {
	await withSite(async ({ context, origin }) => {
		const page = await context.newPage();

		await page.goto(pageUrl(origin, '/scroll-cards/'), { waitUntil: 'networkidle' });

		await scrollStageToProgress(page, '[data-css-stage]', 0.22);
		assert.ok((await visibleCardTitles(page, '[data-css-stage]')).includes('Pinned Stage'));

		await scrollStageToProgress(page, '[data-css-stage]', 0.48);
		assert.ok((await visibleCardTitles(page, '[data-css-stage]')).includes('View Timeline'));

		await scrollStageToProgress(page, '[data-css-stage]', 0.78);
		assert.ok((await visibleCardTitles(page, '[data-css-stage]')).includes('Reduced Motion'));
	});
});

test('reduced-motion visitors can read both Card Streams without pinned motion', async () => {
	await withSite(
		async ({ context, origin }) => {
			const page = await context.newPage();

			await page.goto(pageUrl(origin, '/scroll-cards/'), { waitUntil: 'networkidle' });

			assert.equal(await page.locator('[data-gsap-stage] .motion-concept-card').count(), 6);
			assert.equal(await page.locator('[data-css-stage] .motion-concept-card').count(), 6);
			assert.equal(
				await page.locator('[data-gsap-stage] .card-stream-stage').evaluate((stage) => getComputedStyle(stage).position),
				'relative',
			);
			assert.equal(
				await page.locator('[data-css-stage] .card-stream-stage').evaluate((stage) => getComputedStyle(stage).position),
				'relative',
			);
			assert.ok(await page.getByRole('heading', { name: 'Animation Playground' }).isVisible());
			await assertCardsAreReadable(page);
		},
		{ contextOptions: { reducedMotion: 'reduce' } },
	);
});

test('unsupported CSS Scroll-Driven Animations receive the readable CSS fallback', async () => {
	await withSite(
		async ({ context, origin }) => {
			const page = await context.newPage();

			await page.goto(pageUrl(origin, '/scroll-cards/'), { waitUntil: 'networkidle' });

			assert.ok(await page.locator('.motion-support-note').isVisible());
			assert.equal(
				await page.locator('[data-css-stage] .card-stream-stage').evaluate((stage) => getComputedStyle(stage).position),
				'relative',
			);
			assert.equal(
				await page.locator('[data-css-stage] .motion-concept-card').first().evaluate((card) => getComputedStyle(card).opacity),
				'1',
			);
		},
		{
			transformStylesheet: (css) =>
				css.replaceAll('@supports (animation-timeline:view())', '@supports not (animation-timeline:view())')
					.replaceAll('@supports (animation-timeline: view())', '@supports not (animation-timeline: view())'),
		},
	);
});

for (const viewport of [
	{ label: 'desktop', width: 1440, height: 1000 },
	{ label: 'mobile', width: 390, height: 844 },
]) {
	test(`the Motion Comparison has no horizontal overflow or unreadable card text on ${viewport.label}`, async () => {
		await withSite(
			async ({ context, origin }) => {
				const page = await context.newPage();

				await page.goto(pageUrl(origin, '/scroll-cards/'), { waitUntil: 'networkidle' });

				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
				);
				assert.equal(overflow, 0);

				await scrollStageToProgress(page, '[data-gsap-stage]', 0.48);
				await assertCardsAreReadable(page);
				await scrollStageToProgress(page, '[data-css-stage]', 0.48);
				await assertCardsAreReadable(page);
			},
			{ contextOptions: { viewport } },
		);
	});
}
