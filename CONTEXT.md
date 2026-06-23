# Animation Playground

Animation Playground is a place for focused motion experiments that can be composed into an Astro page.

## Language

**Animated Hero**:
A first-screen visual composition whose motion is the primary experience.
_Avoid_: Banner, landing section

**Hero Image**:
A first-screen visual composition whose still image establishes the page before a separate motion experiment begins.
_Avoid_: Banner, static hero

**Scroll Card Gallery**:
A scroll-driven motion experiment where image-led cards travel through the viewport as the user moves down the page.
_Avoid_: Carousel, slider, card list

**Motion Comparison**:
A page that presents multiple implementations of the same motion idea so their behavior and trade-offs can be evaluated.
_Avoid_: Demo page, benchmark

**Motion Contract**:
The shared choreography, content, and scroll boundaries used by each implementation in a **Motion Comparison**.
_Avoid_: Animation spec, demo behavior

**Motion Concept Card**:
An image-led card that names and briefly explains a browser motion concept inside a **Scroll Card Gallery**.
_Avoid_: Feature card, content tile

**Card Stream**:
A **Scroll Card Gallery** arrangement where multiple **Motion Concept Card** entries remain visible at staggered positions as they move through the viewport.
_Avoid_: Slideshow, carousel

**Gift Box**:
The central box image that transitions from closed to open before releasing celebratory elements.
_Avoid_: Crate, package

**Confetti**:
Playful decorative elements that burst from the **Gift Box**, briefly hang, and then fall away as the page scrolls.
_Avoid_: Particles, debris

## Relationships

- An **Animated Hero** contains exactly one **Gift Box**
- A **Hero Image** can introduce a **Scroll Card Gallery**
- A **Motion Comparison** contains multiple implementations of the same motion idea
- Each implementation in a **Motion Comparison** follows the same **Motion Contract**
- A **Scroll Card Gallery** contains **Motion Concept Card** entries
- A **Card Stream** keeps multiple **Motion Concept Card** entries visible at once
- A **Gift Box** releases many **Confetti** elements
- **Confetti** falls away when the **Animated Hero** leaves the viewport

## Example Dialogue

> **Dev:** "Should the **Confetti** fall after a timer?"
> **Domain expert:** "No, it should hang after the **Gift Box** opens, then fall once the **Animated Hero** scrolls away."

## Flagged Ambiguities

- "box" resolved to **Gift Box** for this animation.
- "fly out and hang" resolved to **Confetti** entering a suspended celebratory state until scroll progress changes it.
- "another page" resolved to a **Hero Image** introducing a separate **Scroll Card Gallery**.
- "technology exploration" resolved to a **Motion Comparison** between implementations of the same motion idea.
- Card content resolved to **Motion Concept Card** entries about browser motion concepts.
- "a bunch of cards aligned horizontal" resolved to a staggered **Card Stream**, not a slideshow.
