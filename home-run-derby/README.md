# Home Run Derby

A batting-only baseball prototype: step 1 toward a fuller baseball game. It's one self-contained HTML file with no assets and no build step. It runs in any modern browser on a phone or computer.

**Play:** open `index.html` in a browser, or use the published claude.ai link.

## How it plays
- **60-second derby at a sandlot.** A pitching machine feeds you balls; hit as many home runs as you can before time runs out.
- **Swing** by tapping anywhere, pressing the SWING button, or pressing Space. The **TIME YOUR SWING** meter shows the timing: swing when the red arrow is in the light green.
  - **Perfect** timing is always a home run.
  - **Good** timing usually carries.
  - Early pulls the ball left and late slices it right. Too far either way is foul.
- Three or more home runs in a row get a callout.
- Career home runs unlock bats: Aluminum (10), Slugger (30), Golden (75).
- Records are saved in the browser (`localStorage`): most home runs, longest hit, career total.
- **Pause** with the pause button, Esc or P. The game also pauses when the tab is hidden.

## Tuning
All the numbers are near the top of the script:
- `ROUND_SECONDS`, `METER_MS`, `BATS`
- Pitch speed in `queuePitch()`
- Timing windows and the distance formula in `swing()`
