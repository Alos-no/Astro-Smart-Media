# @alos-no/astro-media

Alos’s reusable Astro media components: optimized images, and background video with HLS fallback.

## Install

```bash
pnpm add @alos-no/astro-media
# or npm i / yarn add
```

> Requires **Astro 5+** (peer dependency). Components ship as `.astro` source. ([Astro Docs][1])

## Quick start

```astro
---
import { SmartImage, SmartVideo } from "@alos-no/astro-media";
import hero from "../assets/hero.jpg";
---

<SmartImage src={hero} alt="Example" class="rounded-lg shadow" />

<SmartVideo hlsSrc="/videos/stream/index.m3u8" src="/videos/fallback/drone" poster={hero} class="h-[60vh] rounded-xl" />
```

### `SmartImage` props

- `src: ImageMetadata | string`, `alt: string`
- `sizes?: string`, `widths?: number[]`, `formats?: ('avif'|'webp'|'png'|'jpg')[]`, `quality?: number`
- `class?: string`, `loading?: 'lazy'|'eager'`
- `vignetteRadius?: number`, `vignetteStrength?: number`

### `SmartVideo` props

- `hlsSrc?: string` (HLS manifest), `src?: string` (base path for `.webm`/`.mp4` fallback)
- `poster?: string|ImageMetadata`
- Playback: `autoplay`, `loop`, `muted`, `controls`, `playsinline`, `playOnHover`
- Poster image tuning: `imgVignetteRadius`, `imgVignetteStrength`, `imgSizes`, `imgWidths`, `imgFormats`, `imgQuality`

> HLS playback uses `hls.js` (`Hls.isSupported()`, `MANIFEST_PARSED`, `ERROR`) and falls back to MP4/WEBM when needed. ([hlsjs.video-dev.org][3])

## Testing

- **Unit**: Vitest + Astro Container API (`experimental_AstroContainer`) renders components to strings.
- **E2E**: Playwright against the `demo/` site (optional but recommended). ([Astro Docs][4])
