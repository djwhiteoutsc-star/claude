# Home Run Derby

A batting-only baseball prototype: step 1 toward a fuller baseball game. It's one self-contained HTML file with no assets and no build step. It runs in any modern browser on a phone or computer.

**Play:** open `index.html` in a browser, or use the published claude.ai link.

## How it plays
- **Ten outs per round.** Any swing that isn't a home run is an out, and so is a strike you don't swing at. Balls outside the box are free to take.
- **Tap the ball** as it reaches the plate.
  - **When you tap** decides timing: Perfect, Good, or early/late. Early pulls the ball left; late pushes it right. Too far either way is a foul.
  - **Where you tap** decides launch angle: under the ball lifts it, over it hits a grounder.
- Consecutive home runs multiply your score, up to ×3.
- Pitches get faster and add changeups and curves as your home runs add up.
- Career home runs unlock bats: Aluminum (10), Slugger (30), Golden (75).
- Best score and career totals are saved in the browser (`localStorage`).

## Tuning
All the numbers are near the top of the script:
- `OUTS_PER_ROUND`, `BATS`, `PITCHES`
- The `slow` factor in `makePitch()`, which stretches pitch speed for thumbs
- The timing windows and the distance formula in `swingAt()`
