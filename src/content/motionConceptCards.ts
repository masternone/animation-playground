import layeredCardsImage from '../images/motion-card-layered-cards.webp';
import performanceBudgetImage from '../images/motion-card-performance-budget.webp';
import pinnedStageImage from '../images/motion-card-pinned-stage.webp';
import reducedMotionImage from '../images/motion-card-reduced-motion.webp';
import scrollProgressImage from '../images/motion-card-scroll-progress.webp';
import viewTimelineImage from '../images/motion-card-view-timeline.webp';

export const motionConceptCards = [
	{
		title: 'Pinned Stage',
		description: 'Hold the viewing stage steady while scroll progress drives the composition.',
		image: pinnedStageImage,
	},
	{
		title: 'Scroll Progress',
		description: 'Map the page journey to a continuous timeline instead of a fixed-duration playback.',
		image: scrollProgressImage,
	},
	{
		title: 'View Timeline',
		description: 'Let an element animate according to its own passage through the viewport.',
		image: viewTimelineImage,
	},
	{
		title: 'Layered Cards',
		description: 'Keep several ideas visible at once to create depth, rhythm, and continuity.',
		image: layeredCardsImage,
	},
	{
		title: 'Reduced Motion',
		description: 'Preserve the story and reading order when a visitor asks for calmer movement.',
		image: reducedMotionImage,
	},
	{
		title: 'Performance Budget',
		description: 'Spend browser work deliberately so rich motion still feels immediate and responsive.',
		image: performanceBudgetImage,
	},
] as const;
