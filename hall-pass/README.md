# HALL PASS

A 1–6 player online co-op stealth comedy for teens. You sneak around school during class to finish ridiculous missions before the bell. If a teacher catches you, you fight their suspicion with a deck of **Excuse Cards**, or you end up in detention until a friend breaks you out.

- **Store pitch:** [docs/steam-store-pitch.md](docs/steam-store-pitch.md)
- **First playable build scope and milestones:** [docs/mvp-feature-list.md](docs/mvp-feature-list.md)
- **Card design (first 30 cards and rules):** [docs/excuse-cards.md](docs/excuse-cards.md)

## Running it

1. Install **Godot 4.3** (standard build, no .NET needed).
2. Open the `hall-pass/` folder in Godot (*Import → project.godot*) and press **F5**.
3. Click **Host game**, then **Start class**. To test with a friend on your network, they run the game too, enter your IP, and click **Join** (port 7777).

To test the school alone without the menus, open `scenes/school/school.tscn` and press **F6**.

**Controls:**
- **WASD**: move
- **Shift**: sprint (loud)
- **C / Ctrl**: crouch (quiet)
- **Mouse**: look
- **E**: interact, hide at a desk, or hold at the detention door to break friends out
- **Esc**: free the mouse
- **In a card battle:** **1–5** plays a card, **Space** ends your turn

## Tests

```bash
# Card rules (pure logic)
godot --headless --path . -s tests/test_excuse_battle.gd

# Full period offline: spawning, navmesh, patrols, objectives, catch -> battle -> detention
godot --headless --path . res://tests/school_smoke.tscn

# Real host + client over localhost
godot --headless --path . res://tests/net_smoke.tscn -- --host &
godot --headless --path . res://tests/net_smoke.tscn -- --client
```

Each test exits with code 0 if it passed and 1 if it failed. On the first run, do `godot --headless --path . --import` first.

## How it fits together

```
scripts/
  autoload/network.gd        ENet host/join and the player list (Steam goes in here later)
  autoload/game_state.gd     seed, objectives, snacks, caught/detention status, bell timer, key bindings
  school/school.gd           waits for every peer, then spawns students and teachers
  school/school_generator.gd seeded layout: hallway, 12 rooms, detention, objective targets, navmesh
  school/room.gd             grey-box room tile (floor, walls, doors, desks you can hide at)
  player/player.gd           movement, noise radius, hiding, interacting, jailbreak
  teachers/teacher.gd        PATROL -> SUSPICIOUS -> CHASE -> CATCH, sight cone and hearing (runs on the host)
  cards/excuse_card.gd       card data (Resource)
  cards/excuse_battle.gd     card battle rules, kept separate from nodes and UI so they can be tested
  objectives/                objective data and the in-world target
  ui/                        main menu, lobby, HUD, battle screen
data/cards, data/objectives  .tres content: add cards and objectives here without code
```

**Networking model:**
- The host is authoritative over teachers, objectives and who is caught.
- Each client moves its own student. That's fine for co-op and keeps movement responsive.
- Only the seed is sent over the network. Every peer builds the identical school from it.

**Adding content:**
- **A new card:** add a `.tres` file in `data/cards/` (copy an existing one), then add it to `STARTER_DECK` in `game_state.gd`, or to the shop later.
- **A new objective:** add a `.tres` file in `data/objectives/`. Its `room_type` must be one of the keys in `Room.COLORS`.

## Next steps (from the feature list)

- Back Them Up support cards over the network
- Proximity voice chat (GodotSteam)
- After-school shop and saving progress between runs
- Detention Cam replays
- Art pass to replace the grey boxes
