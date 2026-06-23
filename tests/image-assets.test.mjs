import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import sharp from 'sharp';

const readProjectImage = (filename) =>
	readFile(new URL(`../src/images/${filename}`, import.meta.url));

const assertCardImage = async (filename) => {
	const image = await readProjectImage(filename);
	const metadata = await sharp(image).metadata();

	assert.equal(metadata.format, 'webp');
	assert.ok(metadata.width > metadata.height);
	assert.ok(metadata.width >= 1000);
	assert.ok(metadata.height >= 650);
};

test('the Motion Comparison Hero Image is a project-local landscape image', async () => {
	const image = await readProjectImage('scroll-cards-hero.webp');
	const metadata = await sharp(image).metadata();

	assert.equal(metadata.format, 'webp');
	assert.ok(metadata.width > metadata.height);
	assert.ok(metadata.width >= 1500);
	assert.ok(metadata.height >= 900);
});

test('the Pinned Stage card has a project-local image', async () => {
	await assertCardImage('motion-card-pinned-stage.webp');
});

test('the Scroll Progress card has a project-local image', async () => {
	await assertCardImage('motion-card-scroll-progress.webp');
});

test('the View Timeline card has a project-local image', async () => {
	await assertCardImage('motion-card-view-timeline.webp');
});

test('the Layered Cards card has a project-local image', async () => {
	await assertCardImage('motion-card-layered-cards.webp');
});

test('the Reduced Motion card has a project-local image', async () => {
	await assertCardImage('motion-card-reduced-motion.webp');
});

test('the Performance Budget card has a project-local image', async () => {
	await assertCardImage('motion-card-performance-budget.webp');
});
