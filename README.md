# Astro Media Components

[![npm version](https://img.shields.io/npm/v/@alos-no/astro-media.svg)](https://www.npmjs.com/package/@alos-no/astro-media)
[![License: Apache-2.0](https://img.shields.io/npm/l/@alos-no/astro-media.svg)](https://www.apache.org/licenses/LICENSE-2.0)

A suite of high-performance, feature-rich media components for Astro. `<SmartImage>` and `<SmartVideo>` are designed to simplify modern media workflows, and deliver optimized, responsive, and accessible images and videos with minimal configuration.

## Installation

```bash
# pnpm
pnpm add @alos-no/astro-media

# npm
npm install @alos-no/astro-media

# yarn
yarn add @alos-no/astro-media
```

---

## `SmartImage`

A highly reusable and responsive image component built on `astro:assets`. It simplifies generating multiple image formats and sizes, while providing sensible defaults and convenient features like a CSS-driven vignette and credit overlays.

### Key Features

- **Powered by `astro:assets`**: Leverages Astro's built-in image optimization pipeline for local assets.
- **Automatic Responsive Images**: Generates multiple widths and modern formats (`AVIF`, `WebP`) with graceful fallbacks.
- **Intelligent Defaults**: Automatically calculates optimal `widths` and `sizes` attributes based on the source image dimensions.
- **Local & Remote Sources**: Seamlessly handles both optimized local `ImageMetadata` imports and standard remote image URLs.
- **CSS Vignette Effect**: Apply a configurable, non-destructive vignette overlay to focus viewer attention.
- **Image Credits**: Add a clean, unobtrusive credit overlay with configurable positioning.
- **Advanced Layout Control**: Full control over `object-fit` and `object-position` via `fit` and `position` props.
- **Correct Corner Clipping**: Intelligently handles CSS `border-radius` to ensure overlays and effects are clipped correctly.

### Usage

#### Basic Local Image

Import your image and pass it to the `src` prop. The component handles the rest.

```astro
---
import { SmartImage } from "@alos-no/astro-media";
import heroImage from "../assets/hero.jpg";
---

<SmartImage src={heroImage} alt="A beautiful landscape." class="rounded-lg" />
```

#### Remote Image

When you pass a URL string to `src`, `SmartImage` renders a standard `<img>` tag without optimization.

```astro
---
import { SmartImage } from "@alos-no/astro-media";
---

<SmartImage
  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"
  alt="A remote image of a winding road."
  class="w-full h-auto rounded-lg"
/>
```

#### Vignette Effect

Apply a subtle vignette to focus the viewer's attention. The `rounded-*` classes are automatically handled to ensure correct clipping.

```astro
---
import { SmartImage } from "@alos-no/astro-media";
import heroImage from "../assets/hero.jpg";
---

<SmartImage
  src={heroImage}
  alt="A landscape with a vignette effect."
  class="rounded-xl"
  vignetteRadius={70}
  vignetteStrength={0.4}
/>
```

#### Credit Overlay

Add a credit line to your image with configurable positioning.

```astro
---
import { SmartImage } from "@alos-no/astro-media";
import heroImage from "../assets/hero.jpg";
---

<SmartImage
  src={heroImage}
  alt="A landscape with a credit overlay."
  class="rounded-lg"
  credit="Photo by John Doe"
  creditAnchor="bottom-left"
/>
```

### `SmartImage` Props

| Prop               | Type                          | Default            | Description                                                                        |
| :----------------- | :---------------------------- | :----------------- | :--------------------------------------------------------------------------------- |
| `src`              | `ImageMetadata \| string`     | **Required**       | Local image import or a remote image URL.                                          |
| `alt`              | `string`                      | **Required**       | Alt text for accessibility and SEO.                                                |
| `sizes`            | `string`                      | `(generated)`      | The `sizes` attribute. Defaults to a value generated from `widths`.                |
| `widths`           | `number[]`                    | `(generated)`      | Array of widths to generate. Defaults to optimal widths based on the source image. |
| `formats`          | `('avif' \| 'webp' \| ...)`   | `['avif', 'webp']` | Array of image formats to generate.                                                |
| `quality`          | `number`                      | `80`               | Quality setting (1-100) for generated images.                                      |
| `class`            | `string`                      | `''`               | CSS classes for the root element. `rounded-*` classes are handled automatically.   |
| `style`            | `string`                      | `''`               | Inline styles for the component.                                                   |
| `loading`          | `"lazy" \| "eager"`           | `'lazy'`           | The loading strategy for the image.                                                |
| `vignetteRadius`   | `number`                      | `undefined`        | The vignette's transparent center as a percentage (0-100).                         |
| `vignetteStrength` | `number`                      | `undefined`        | The vignette's dark outer edge opacity (0-1).                                      |
| `fit`              | `'cover' \| 'contain' \| ...` | `'cover'`          | Maps to CSS `object-fit`.                                                          |
| `position`         | `string`                      | `'center'`         | Maps to CSS `object-position`.                                                     |
| `credit`           | `string`                      | `undefined`        | Optional credit text overlay.                                                      |
| `creditAnchor`     | `'top-left' \| ...`           | `'bottom-right'`   | Position of the credit overlay.                                                    |
| `creditClass`      | `string`                      | `undefined`        | Override default CSS classes for the credit overlay.                               |
| `creditStyle`      | `string`                      | `undefined`        | Override default inline styles for the credit overlay.                             |

---

## `SmartVideo`

A component for rendering robust, performant, and SEO-friendly background videos. It handles modern streaming formats, browser autoplay policies, and provides multiple playback modes.

### Key Features

- **Adaptive HLS Streaming**: Uses `hls.js` for adaptive bitrate streaming, delivering the best quality for the user's connection.
- **Graceful Fallbacks**: Automatically falls back to standard `.mp4` and `.webm` sources if HLS is unsupported or fails.
- **Native HLS on Apple Devices**: Utilizes native HLS playback on Safari for optimal performance and battery life.
- **Posters**: Supports configuring a poster for loading (typically low-quality placeholder) and on playback error (typically HQ poster that replaces the video).
- **Performance-Aware Playback**:
  - **IntersectionObserver**: Autoplays video only when it's in the viewport to save resources and bandwidth.
  - **Play on Hover**: An alternative, engaging playback mode that plays video on mouseover.
- **Optimized Poster Images**: Uses `<SmartImage>` internally for the poster, enabling full optimization and effects like vignettes.
- **Enhanced SEO**: Injects a JSON-LD `VideoObject` schema when `metadata` is provided, improving search engine visibility.
- **Flexible Sizing**: The `sizeStrategy` prop controls container behavior for intrinsic, fill, or CSS-driven dimensions.
- **Advanced Poster Control**: Configure separate, optimized images for the initial "loading" state and a higher-quality version for "error" states.
- **Mobile-Specific Sources**: Provide an alternate `hlsMobileSrc` for optimized delivery on mobile devices.

### Usage

#### Basic HLS with Fallback

Provide an HLS source and a fallback path (without extension). The component will attempt HLS streaming and fall back to MP4/WebM if needed.

```astro
---
import { SmartVideo } from "@alos-no/astro-media";
import posterImage from "../assets/video-poster.jpg";
---

<div class="h-screen">
  <SmartVideo hlsSrc="/videos/stream/index.m3u8" src="/videos/fallback/drone-video" poster={posterImage} />
</div>
```

#### Play on Hover

The video will only play when the user's mouse is over the component.

```astro
---
import { SmartVideo } from "@alos-no/astro-media";
import posterImage from "../assets/video-poster.jpg";
---

<div class="aspect-video">
  <SmartVideo src="/videos/drone-video" poster={posterImage} playOnHover={true} />
</div>
```

#### **Standard Controls**

Disable autoplay and give the user full control with the browser's native video controls.

```astro
---
import { SmartVideo } from "@alos-no/astro-media";
import posterImage from "../assets/video-poster.jpg";
---

<div class="aspect-video">
  <SmartVideo src="/videos/drone-video" poster={posterImage} controls={true} autoplay={false} />
</div>
```

#### SEO Metadata

Provide structured data to generate a JSON-LD `VideoObject` schema that helps search engines understand your video content.

```astro
---
import { SmartVideo } from "@alos-no/astro-media";
import posterImage from "../assets/video-poster.jpg";
---

<SmartVideo
  src="/videos/drone-video"
  poster={posterImage}
  controls={true}
  autoplay={false}
  metadata={{
    title: "Drone Footage of Norwegian Fjords",
    description: "A beautiful aerial shot of the fjords.",
    uploadDate: new Date("2024-01-01"),
    duration: "PT1M30S",
  }}
/>
```

### `SmartVideo` Props

| Prop                 | Type                              | Default      | Description                                                                                                     |
| :------------------- | :-------------------------------- | :----------- | :-------------------------------------------------------------------------------------------------------------- |
| `src`                | `string`                          | `undefined`  | Base path for fallback `.mp4` and `.webm` video files (without extension).                                      |
| `hlsSrc`             | `string`                          | `undefined`  | URL to the HLS manifest (`.m3u8`).                                                                              |
| `hlsMobileSrc`       | `string`                          | `undefined`  | Alternate HLS manifest for mobile devices.                                                                      |
| `poster`             | `string \| ImageMetadata`         | `undefined`  | Poster image to display before playback.                                                                        |
| `class`              | `string`                          | `''`         | CSS classes for the root container.                                                                             |
| `autoplay`           | `boolean`                         | `true`       | Whether the video should attempt to autoplay.                                                                   |
| `loop`               | `boolean`                         | `true`       | Whether the video should loop.                                                                                  |
| `muted`              | `boolean`                         | `true`       | Whether the video should be muted (required for autoplay in most browsers).                                     |
| `controls`           | `boolean`                         | `false`      | Whether to display native video controls.                                                                       |
| `playsinline`        | `boolean`                         | `true`       | Prevents fullscreen playback on iOS.                                                                            |
| `preload`            | `'none' \| 'metadata' \| 'auto'`  | `'metadata'` | How aggressively to preload the video.                                                                          |
| `playOnHover`        | `boolean`                         | `false`      | If true, video plays only on mouse hover.                                                                       |
| `posterLoadStrategy` | `'eager' \| 'on-error'`           | `'eager'`    | When to render the poster: immediately (`eager`) or only on video error (`on-error`).                           |
| `metadata`           | `MetadataProps`                   | `undefined`  | Rich metadata for SEO (JSON-LD `VideoObject`).                                                                  |
| `fit`                | `'cover' \| 'contain' \| ...`     | `'cover'`    | CSS `object-fit` for the video and poster.                                                                      |
| `objectPosition`     | `string`                          | `'center'`   | CSS `object-position` for the video and poster.                                                                 |
| `sizeStrategy`       | `'fill' \| 'none' \| 'intrinsic'` | `'fill'`     | Defines how the component is sized within its parent.                                                           |
| `tracks`             | `Track[]`                         | `[]`         | An array of text tracks (`<track>`) to add to the video.                                                        |
| `img...`             | `various`                         |              | All props from `<SmartImage>` are accepted for the poster (e.g., `imgSizes`, `imgWidths`, `imgVignetteRadius`). |
| `errorImg...`        | `various`                         |              | Override `<SmartImage>` props for the error poster (e.g., `errorImgSizes`, `errorImgQuality`).                  |

## License

[Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
