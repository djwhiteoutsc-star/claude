# HALL PASS — First Playable Build (Steam Next Fest Demo)

**Goal:** a 20–30 minute demo that four friends can play online, laugh at, and clip.
**Target:** ~24 weeks solo, part-time friendly.

## MUST (demo doesn't ship without these)

| # | Feature | Acceptance criteria |
|---|---|---|
| M1 | Host / Join lobby | Host creates game; up to 5 others join by IP (Steam lobby later). All players see each other move smoothly at 60 ms ping. |
| M2 | Player controller | Walk / sprint / crouch. Each sets a **noise radius** (crouch 2 m, walk 5 m, sprint 10 m). Interact with doors, items, desks. |
| M3 | Hide at desk | Sitting at an empty desk in a classroom makes you invisible to teachers unless they're within 1.5 m *and* already suspicious. |
| M4 | Procedural school | One school built from a pool of ~12 room pieces (hallway, classroom, cafeteria, gym, office, bathroom, library, science lab, lockers, nurse, stairwell, detention). Same seed = same layout for every client. |
| M5 | Teacher AI | State machine PATROL → SUSPICIOUS → CHASE → CATCH. Teachers *see* (cone) and *hear* (player noise radius). Suspicious lasts 1 s (seen) or 3 s (only heard) before chasing. |
| M6 | 4 teacher types | Hall Monitor (fast patrol), Coach (fast chase), Substitute (poor sight, sharp hearing), Principal (rare, catch = straight to detention). |
| M7 | Objectives | 15 objective types; 3 drawn per class period. Shared squad progress. |
| M8 | Class period timer | 10-minute period; bell ends it. Score = objectives done + snacks collected. |
| M9 | Excuse Card battle | On catch: suspicion meter (0–100) + hand of 5. Composure 3/turn. Reach 0 = released, 100 = detention. Combos double reduction. Resolves in ~15 s. |
| M10 | 30 Excuse Cards | Full first set (see `excuse-cards.md`). Starter deck of 10. |
| M11 | Detention + jailbreak | Caught players sit in detention; a free teammate interacting with the door for 3 s frees them. |
| M12 | Run summary | End-of-period screen: objectives, snacks, who got caught. |

## SHOULD (big for virality — add if on schedule)

| # | Feature | Acceptance criteria |
|---|---|---|
| S1 | Proximity voice | Voice volume falls off with distance; voice activity adds to noise radius. (GodotSteam voice or Opus addon.) |
| S2 | Back Them Up | A friend within 8 m of a card battle can play one support card from their own hand. |
| S3 | After-school shop | Spend snacks on new cards and 3 gadgets (silent sneakers, decoy phone, stink bomb). Persists between runs. |
| S4 | Detention Cam | Rolling 6 s buffer; replays the funniest catch (longest chase) at round end. |
| S5 | Yearbook awards | 6 superlatives computed from run stats. |
| S6 | Cosmetics | 10 hoodies / backpacks unlockable by play. |

## WON'T (yet)
- Locker-trading empire (full meta layer) — post-launch update
- More schools / seasonal events (Snow Day, Prom Night)
- Console ports, controller polish, mobile
- Matchmaking with strangers (friends-only at launch)

---

## Milestones

| Milestone | Weeks | Output |
|---|---|---|
| **M1 Network prototype** | 1–3 | Capsules running around a grey box, 4 clients, host/join working. *Do this first — it's the riskiest part.* |
| **M2 Stealth + AI** | 4–8 | Noise radius, hiding, 4 teachers patrolling a procedural school. |
| **M3 Card battle** | 9–12 | Catch → battle → release/detention, synced across clients. 30 cards. |
| **M4 Meta + polish** | 13–20 | Objectives, timer, shop, summary screen, art pass, sound, Detention Cam. |
| **M5 Demo** | 21–24 | Playtests with real teens, tuning, Steam page, trailer, Next Fest submission. |

## Risks
| Risk | Mitigation |
|---|---|
| Netcode eats the schedule | Host-authoritative only; no prediction beyond Godot's synchronizer. Prototype week 1. |
| Getting caught feels unfair | Clear "!" and "?" indicators over teachers; audible footsteps; generous hiding. |
| Card battle kills pacing | Hard cap ~15 s; auto-end turn after 6 s idle; tune with playtests. |
| Scope creep | Anything not in MUST waits. Keep this file honest. |
| Content-safety for a teen audience | No contraband beyond candy/phones; voice chat friends-only by default; mute/report buttons. |
