# Home Run Derby

A batting-only baseball prototype: step 1 toward a fuller baseball game. It's one HTML file plus four art images in `assets/`, with no build step. It runs in any modern browser on a phone or computer.

**Play:** use the published claude.ai link, or serve this folder locally (for example `python3 -m http.server`) and open `index.html`. Opening the file directly also works in most browsers.

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

## Art and the batter rig
| File | What it is |
|---|---|
| `assets/sandlot.webp` | Background |
| `assets/batter-body.webp` | Batter without arms |
| `assets/batter-arms.webp` | Both arms, separated, gloved fists together |
| `assets/bat.webp` | Bat, barrel up |

The batter is built from three layers, bottom to top:
1. **Body**
2. **Bat**: its grip sits behind the fists
3. **Arms**: one per shoulder.
   - At load time the arms image is cut into four pieces: the two arms are split along `ASSETS.arms.separator`, then each is split at the cuff into a sleeve and a forearm.
   - Each frame, each arm bends at its elbow to put its fist on the bat (two-bone IK). Elbows bend downward.
   - The forearm's rounded end tucks under the sleeve.
   - The top hand belongs to the back arm, the bottom hand to the front arm.

The bat is posed in 3D (elevation and direction) and drawn foreshortened, so it sweeps around the body. When it points backward it's drawn behind the body.

The motion runs in this order:
- **Anticipation**: weight shifts back and the hands load as the ball comes in.
- **Swing**: 70 ms from tap to contact.
- **Follow-through**, then a short hold.
- **Recovery** back to the stance.
- Throughout: a subtle lean, tilt and breathing bob.

Everything you'd want to adjust is in one place near the top of the script:
- **`ASSETS`**: each image's anchor and pivot points in its own pixels, plus the scales:
  - where the batter stands on the background
  - body height and both shoulder sockets
  - each arm's shoulder, elbow, cuff cut and fist, plus the arm separator line
  - bat grip, tip and sweet spot
  - fence line and machine spot
- **`POSES`**: keyframes for stance, load, contact and finish.
  - `hx, hy` is the hands position in body pixels from the feet.
  - `e, a` is the bat's elevation and direction.
  - `lean`, `tilt` and `squash` control body movement.
- **`MOTION`**: timing for the load, follow-through, hold and recovery.

**Alignment overlay:** add `#rig` to the end of the link, or press **G** while playing. It marks every anchor and pivot on screen, plus where the pitched ball arrives. The arrival point is computed from the contact pose, so the ball always meets the barrel.

## Tuning gameplay
These numbers are near the top of the script:
- `ROUND_SECONDS`
- `CONTACT_MS`
- `WINDOWS` (perfect, good and okay timing in ms)
- `BATS`
- Pitch speed in `queuePitch()`
- The distance formula in `swing()`
