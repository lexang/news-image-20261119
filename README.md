# World news — 19 November 2026

[![make.fun · news-image-20261119](https://make.fun/badge/news-image-20261119.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![rank](https://make.fun/badge/news-image-20261119/lexang/news-image-20261119/rank.svg)](https://make.fun/bounty/news-image-20261119/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)
[![reward](https://make.fun/badge/news-image-20261119/lexang/news-image-20261119/reward.svg)](https://make.fun/bounty/news-image-20261119?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261119)

Original editorial image for the 19 November 2026 world-news brief. The canvas is exactly 1000 × 1000 pixels; the illustrations use original inline SVG geometry and local system fonts, with no external assets, packages, or network requests.

## Editorial basis

- [Anadolu Agency, 19 November 2026](https://www.aa.com.tr/en/world/-xi-trump-putin-conclude-historic-trilateral-meeting-in-chinas-shenzhen/4130184): Xi, Trump and Putin concluded their first-ever trilateral meeting in Shenzhen at 5:50 pm local. Public remarks addressed nuclear disarmament, global security and the Russia–Ukraine war, followed by closed-door discussions. The artwork makes no claim about agreements. It omits the start time and duration; the supplied account says around 4:30 pm and roughly 80 minutes, respectively.
- [Reuters, 19 November 2026](https://www.reuters.com/world/asia-pacific/top-un-court-finds-myanmar-committed-state-sponsored-genocide-against-muslim-2026-11-19/) and [Associated Press, 19 November 2026](https://apnews.com/article/rohingya-myanmar-genocide-court-icj-30df77b12bf3f911f1100e77ebe3973a): the International Court of Justice ruled Myanmar committed genocide against the Rohingya in the 2017 military campaign. The artwork uses only the ruling and that historical context.
- [NBC News, published 19 November 2026](https://www.nbcnews.com/world/iran/iran-widens-gulf-attacks-targeting-us-air-base-kuwait-sites-bahrain-rcna610128): Iran targeted Ali Al Salem air base in Kuwait; Bahrain’s military said it intercepted attacks. The artwork explicitly dates the events Wednesday 18 November, rather than the publication date.
- [The Guardian, 19 November 2026](https://www.theguardian.com/world/2026/nov/19/datacentres-to-create-70-more-carbon-emissions-by-2030-iea-report-warns): the IEA forecast emissions associated with data centres to rise 70% by 2030. This is presented as a projection and attributed to the IEA via The Guardian.

## Files

- `artwork.html`: original self-contained HTML/CSS/SVG image source.
- `entry.png`: bundled Chromium rendering; the runtime copies these exact bytes.
- `main.ts`: Node 22 entry program using only `node:fs` and `node:path`, written in plain JavaScript syntax without a compilation step.
- `verify.mjs`: offline PNG structure, chunk CRC, decompression, scanline-filter, dimensions, size, and byte-identity checks. It accepts the noninterlaced 8-bit RGB/RGBA format produced by Chromium.
- `LICENSE`: MIT, with SPDX identifier.

## Exact render command

Run from this repository. Chromium is needed only to regenerate the bundled image, not to run the entry.

```sh
chromium --headless --no-sandbox --disable-gpu --hide-scrollbars --window-size=1000,1000 --screenshot=entry.png "file://$PWD/artwork.html"
```

## Offline execution and validation

The intended runtime is Node 22 with no packages and no network. Keep `main.ts` and `entry.png` together. The default command writes `/output/entry.png`, creating the output directory if needed:

```sh
node main.ts
```

The two-directory deterministic validation commands below keep test outputs within the repository:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
mkdir -p out2 && MAKEFUN_OUTPUT_DIR=out2 node main.ts
node verify.mjs out/entry.png out2/entry.png
```

To check only the bundled image:

```sh
node verify.mjs
```

The verifier requires exactly 1000 × 1000 pixels and at most 1,048,576 bytes, checks complete chunk framing and CRCs through a terminal IEND, inflates all scanlines, validates their lengths and filter types, and compares both requested outputs with the bundled image.

## Observed validation result

The two output-generation commands above completed successfully. The command `node verify.mjs out/entry.png out2/entry.png` then passed for the bundled image and both generated outputs:

- All three files passed the verifier's complete PNG structure, chunk CRC, pixel-data decompression, scanline-length, and filter-type checks.
- Each image measured exactly 1000 × 1000 pixels and 157,223 bytes, below the 1,048,576-byte limit.
- Both generated outputs were byte-identical to each other and to the bundled image.
- SHA-256 for all three files: `71b5220342e69151965ef6603bea0c91c07acc46e805fe6173635c425fe5e854`.
