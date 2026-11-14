# Crypto part 2, world picture: the shot list

Every board beat is one wordless illustrated shot (`video/sets/c2<scene>.js`), drawn with `sets/kit.js` in the world of
part 1 (`sets/bank.js`, `sets/props.js`, and the part 2 props in `sets/c2props.js`): the same night town, the same
brown book, the blue house (Ali), the pink house (Mona), the teal house (Sami), a violet house (Hoda), the laptops on the
planet, the hooded chair (Satoshi), the calendar page for every date. Host beats (`close`, `host`, `wide`) are unchanged.
`host left/right` = Peek leans in from that side, so that lower corner is kept empty. Times are seconds from the start
of the beat (`node sets/beats.cjs`), and the action is put on the word it belongs to.

Things that travel through the episode: **the page** (a cream ledger page with rows of coloured dots and numbers, the
block), **the fingerprint** (a whorl in one colour with a short hex string, `7f3a…`; a changed page gets a different
whorl and colour), **the hash machine** (a violet box with a funnel on top, a round window with gears, a slot that cards
come out of), **the gold links** between pages (the chain), **the rigs** (black boxes with two fans and green lights),
**the laptops on the planet** (the copies of the book, from part 1), **the clock** (ten minutes), **the silo of 21
million coins**, **the code case** (the rules, from part 1).

## intro (`c2intro`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 1 | 4.1 | Night square. The brown book on a lectern; beside it a guard booth, empty, a guard's cap on a hook (1.5 "no guard"). Its pages fan out and lock into a ring of gold-linked pages round the book, a seal clicks shut (3.0 "guards itself"). Out through a page. | a ledger with no guard that guards itself |
| 3 | 4.5 | The bank with the book in its arch (0.0); the book lifts out (1.6 "took the book"), and copies land on laptops all over the night planet (2.7–3.9 "thousands of devices"). | last report, in one picture |

## hash (`c2hash`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 5 | 5.8 | The hash machine. A slip "blue → pink 30" drops into the funnel (2.3 "machine"), the gears spin, a card slides out of the slot with a pink whorl (4.1 "fingerprint") and a hex string typing in `7f3a9c…` (4.7 "letters and numbers"). | words in, a fingerprint out |
| 6 | 3.6 | The slip's 30 rolls to 31, in gold (0.8 "one letter"); it goes in again; a new card comes out next to the old one: a teal whorl, `c04e1b…` (1.8–2.7 "all of it changes"); a ≠ between them. | one change, a whole new fingerprint |
| 7 | 3.0 | The card is pushed back into the slot: the machine shudders, ✗ (0.5–1.2 "can't go back"); a one-way arrow sign lights over the machine (2.1 "one direction"). | one way only |
| 8 | 4.4 | A hand-cranked mincer on a counter (host right). Meat goes in (1.2 "meat"), kofta comes out on a plate (2.0 "kofta"); a kofta is pushed back at the spout and bounces off, ✗ (3.1–4.0). | the mincer |
| 9 | 5.6 | A password card `••••••` goes into the hash machine; out comes its fingerprint card, which drops into a drawer of a server cabinet (4.1–4.9); the password card itself crumbles to dust (3.4 "not stored"). Host left. | your password is kept as its fingerprint |

## chain (`c2chain`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 10 | 6.7 | A clock's hand sweeps ten minutes (0–1.0). Slips fly from the four houses into one page (1.4–2.9); the page thickens into a block with a gold edge (3.9 "block"); a tag `≈ 3,000` pops on its side (5.9 "thousand"). | every ten minutes a page of thousands of transfers |
| 11 | 1.7 | A seal stamp with the page's whorl comes down on the bottom of the page (0.4–0.9 "sealed"). | sealed with its fingerprint |
| 12 | 4.2 | A new page slides in on the right; the first page's whorl prints at its top (1.5 "the one before"); a gold link snaps between them (2.8–3.4 "holds on"). | each page starts with the last one's fingerprint |
| 13 | 4.0 | Pull back: a row of linked pages runs off into the dark (0.7 "chain"). A label `BLOCK` drops on a page (1.1), `CHAIN` on a link (1.8); they sit there, plain (2.5 "not creative"). | block, chain |
| 14 | 6.0 | Fly along the chain while a counter rolls to `900,000+` (1.5–2.2); at the far end the first gold page `0` with the hooded chair beside it (2.9–3.8 "Satoshi"); swing back to the newest page with the clock (5.3 "ten minutes"). Host right. | more than 900,000 pages, from the first to the last |
| 15 | 5.8 | An old page: its 30 turns to 3000 in red (1.3–2.0 "changed a number"); its seal turns red (2.9 "its fingerprint changes"), the link to the next page goes red and the next seal red (3.9–4.3 "breaks"), and the next (4.8–5.0). | one change breaks everything after it |
| 16 | 2.7 | Laptops round the chain look at it: ✗ ✗ ✗ (0.9–2.0); the broken part drops away (2.0). | the network rejects it |
| 17 | 6.0 | An eraser rubs a row and nothing comes off (0.9–2.2 "not erased"); an undo key ⟲ is pressed and crossed out (2.3–2.6); a counter window with a bell: the shutter is down, the bell rings, nobody comes (3.4–3.9 "no employee"); a pin puts a note `3/5` on the page (4.5 "remember"). Host left. | what is written stays written |

## trip (`c2trip`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 19 | 4.3 | A slip leaves the blue house (1.0–1.8 "one transfer"); a ring spreads over the night planet and lights the laptops one by one (2.4–4.0 "broadcast"). | sent to the whole network |
| 20 | 5.5 | A waiting room full of slips on benches, each with a stack of fee coins; a door with a page behind it. The slips with the tallest stacks step to the door first (3.3–4.9 "higher fee first"); ours waits. | the waiting room and the fee |
| 21 | 1.2 | Our slip goes through the door and becomes a row in the page (0.4–0.8). | written in a page |
| 22 | 9.7 | Pages stack on top of ours one by one, a ✓ counter 1…6 (0.3–4.1 "six pages"); a clock sweeps sixty minutes (4.8–5.0 "an hour"). | six pages, an hour |
| 24 | 7.3 | Two roads: a narrow lane with a gate where slips pass one by one, `7 / s` (1.0–2.3); beside it a highway full of cards, `1000s / s` (2.7–4.1). A big padlock lights over the lane (4.6–5.8 "security over speed"). Host right. | slow, but safe |
| 25 | 8.0 | The waiting room overflows (0.6 "crowded"); the fee tag catches fire and rolls `$1` → `$55`, calendar DEC 2017 (1.3–4.6 "tens of dollars"); a coffee cup `$3` beside it slides away (6.0–7.6). Host left. | fees, and why no one buys coffee |
| 26 | 7.7 | A bright bolt-shaped line above the chain (2.9 "Lightning"); little coins zip back and forth on it between the blue and pink houses (3.5–4.3 "instantly"); a tab notebook sums them, and one row drops down into the big page (4.4–5.7 "later"); a grocer's counter with the same tab notebook (6.2–7.1). Host right. | Lightning, like a tab at the grocer |

## mine (`c2mine`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 28 | 6.1 | A target board over the hash machine. A page goes in, a card comes out `7f3a…` and gets ✗ (2.0–3.3 "contest"); the target lights `0000…` (3.7–5.4 "zeros"). | the contest |
| 29 | 8.2 | A dial on the page spins 1, 2, 3…; cards spit out ✗ ✗ ✗ faster and faster (1.3–2.6 "number after number"). Pull back to the planet covered in machines, each spitting cards; a counter rolls to `1,000,000,000,000,000,000,000 / s` (4.5–7.9). | a thousand billion billion tries a second |
| 30 | 4.9 | One card comes out `0000a1…` ✓ (0.5–1.4 "wins"); its page flies to the end of the chain and the link clicks (1.9–2.6); new coins pop out to its rig (3.3–4.5 "new bitcoin"). | the winner and its prize |
| 31 | 4.2 | Every laptop checks the card in a blink: ✓ ✓ ✓ (0.5–1.1). A haystack: a needle hidden in it (1.6–2.2 "hard to find"), then held up, glinting (2.8–3.8 "easy to check"). | hard to find, easy to check |
| 32 | 5.7 | A pickaxe and a mine cart roll in and are swept off (1.3–2.0 "no pickaxe, no mine"); a warehouse with rows of rigs blinking (2.4–4.1), fans turning, heat shimmering over the roof (4.7 "fans"). Host right. | what mining really is |
| 33 | 6.8 | The winning card unrolls into a certificate with a gold seal, `PROOF OF WORK` (0.9); a power pylon's bolt runs into it (1.8–4.3 "burned electricity"); a forger's pen tries to copy it and the copy burns up ✗ (5.0–6.0). Host left. | proof of work |
| 34 | 6.1 | More rigs roll in (0.2–0.9 "more devices"); the clock races (1.4 "easier"); by itself a dial on the target turns `0000` → `000000`, calendar `14` (2.1–2.9 "every two weeks"); the clock is back to an even ten minutes (4.1–5.8). Host left. | difficulty adjusts itself |
| 35 | 6.7 | The hooded chair at a home laptop, calendar 2009, one coin now and then (0.7–2.4). Pull back: a warehouse as big as the stadium beside it (3.6–6.0). Host left. | from a laptop to warehouses |
| 36 | 8.6 | A balance: an electricity bill against the prize coins; the bill goes down, the rig's lights go out (0.8–2.8 "shuts down"). Rigs in containers travel over the planet: to a dam (5.6), a gas flare (6.3–7.1), a volcano (7.9). Host right. | chasing cheap power |
| 37 | 7.4 | The planet with `CHINA`: containers piled there; calendar 2021 and a ban sign (1.7–3.4); the containers fly off to `USA` and `RUSSIA` (3.4–5.0); they are boxes with fans (5.9–6.8). | the 2021 ban and the move |
| 38 | 4.3 | Back on `CHINA`: one container under a tarp, still blinking (1.4–2.4 "in secret"); the ban sign droops and turns (2.8–3.4). Host right. | still mining there |
| 39 | 5.3 | Small rigs join lines into team hubs (0.8–2.1 "teams"); a pie of pages, two big slices together `≈ 50%` (3.0–4.6). | pools; two win about half |
| 40 | 3.9 | A network of small dots; two swell into giants (1.0–1.5 "big ones"); the small ones shiver (2.0–3.4 "worried"). Host left. | no manager, but big players |
| 41 | 7.1 | Laptops with the book and a magnifier check each page as it passes (2.6–4.5); a gavel pops on each (5.0 "judges"); an empty pay envelope `$0` (6.0–6.6). Host left. | the nodes, unpaid judges |

## secure (`c2secure`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 43 | 7.1 | A lone red rig against the planet of rigs. Two chains race: the honest one gains a page after page, the red one falls behind (2.3–6.6 "time after time"). | a forger must beat everyone |
| 44 | 7.9 | A bar with a `50%` mark; the red side must pass it (1.4–2.5 "half"); a heap of rigs and money bags (3.0–4.1 "billions"); a balance: the heap against a small loot bag, the heap far heavier (4.8–7.4 "costs more"). Host right. | the price of an attack |
| 45 | 5.2 | `51%` (1.0–2.1); small coins crack under a red chain (2.2–3.1 "small coins"); the big ₿ coin with a shield while calendar pages fly 2009 → 2026, `0` (3.7–4.8 "never"). Host left. | the 51% attack |
| 46 | 6.1 | The chain splits at its tip into two (0–1.3 "same moment"); the next page lands on one (1.9–3.1 "longer"); the other tip greys and drops (3.7–4.1); an empty meeting table, its chairs pushed in (4.6–5.7 "no committee"). Host right. | the longest chain wins |
| 47 | 13.5 | Power lines into a warehouse of rigs (1.0); a balance with the network on one pan and a mid-size country (an island of lit towns) on the other, level (3.2–4.2); a small `Cambridge` tag (5.4); the planet's power ring with a thin gold slice `≈ 0.5%` (6.2–8.0). | electricity like a country |
| 49 | 5.4 | A gas flare that burned into the air bends into a pipe to a rig, ✓ (0.0–2.0 "would be wasted"); a smoking chimney into a rig (2.4–2.7 "part not"); ✓ and ✗ signs flip back and forth (3.0–5.0 "still argued"). Host left. | wasted energy, and the argument |
| 50 | 5.3 | A newer, shinier rig shoves an old one off the rack (0.4–2.5 "newer wins"); the old ones pile up into a mountain of scrap (2.9–4.8). Host right. | e-waste |

## cap (`c2cap`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 51 | 4.2 | A page with its prize heap `50`, calendar 2009 (1.0 "fifty"); a blade comes down and halves the heap (3.5–4.2 "divided by two"). | the prize halves |
| 52 | 4.1 | Stacks step down: `50` 2009, `25` 2012, `12.5` 2016, `6.25` 2020, `3.125` 2024 (0.0–3.6). Host right. | 50, 25, 12.5 … 3 and a bit |
| 53 | 6.3 | The `3.125` stack is cut again: `1.5625`, calendar 2028 (1.3–3.9 "next halving"); a rig with a big bill switches off, its container is loaded on a truck and driven off (4.3–5.7). Host left. | 2028, and who leaves |
| 54 | 4.9 | A silo of coins with a lid line `21,000,000` (1.2–2.6); a lid clamps on (3.2 "no more"); the code case glows behind it (3.7 "in the code"). | the 21 million cap |
| 55 | 5.0 | The silo fills to `≈ 95%` (0.3–1.6); a long road from it to a calendar `2140` (2.2–3.8). | 95% mined, last coin 2140 |
| 56 | 5.9 | A counter rolls to `20,000,000`, calendar `MAR 2026` (0.5–2.3); the last thin slice of the silo; an hourglass, `100+` years (3.3–5.4). Host right. | the 20 millionth coin, a century for the last million |
| 57 | 6.3 | The prize coins dwindle to nothing; only small fee coins drip into the miner's bowl (0.0–2.5); a guard booth with a flickering lamp (2.9–3.5 "enough to guard?"); a big `?` (4.1–6.0). Host left. | an open question |
| 58 | 4.6 | A coin slices into a grid of tiny dots, `100,000,000` (1.0–1.7); one dot lifts off and floats to the empty hooded chair (2.8–3.9 "named after the absent one"). Host right. | the satoshi |

## rules (`c2rules`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 61 | 4.1 | The code case; copies of the code fly to the laptops on the planet (1.0–2.1); each laptop's switch flips on by itself (2.6–3.5 "by its own choice"). | rules are a program each one runs |
| 62 | 4.1 | A new code card `v2` in another colour (1.2 "new version"); some laptops switch to it, others keep `v1` (2.8–3.4 "who is convinced"). | changing a rule |
| 63 | 5.8 | The chain splits into a Y (0.8–1.6 "splits in two"); the Y turns into a table fork (2.5–3.3 "fork"), which lands on a plate next to the kofta (4.2–5.3 "always hungry"). | a fork |
| 64 | 6.1 | Calendar 2017 (0.6); company towers and rig warehouses tug the page wider and wider (1.9–5.6 "bigger page"). | the block-size war |
| 65 | 6.2 | The laptops raise ✗ (0.8 "refused"); the page snaps back to its size (1.6); a branch of the chain veers off with its own coin, `Bitcoin Cash` (2.3–5.5). Host right. | the users refused; Bitcoin Cash left |
| 66 | 15.7 | Calendar `AUG 2010` (1.7); a page whose counter rolls past the silo to `184,000,000,000` with coins bursting out (2.8–5.6 "from thin air"); an alarm; a wrench fixes the code and every laptop's switch flips (6.7–8.6 "five hours", a clock `5 h`); scissors cut the page out and the chain rejoins (9.4–10.2 "removed from history"). Host left. | the 2010 overflow bug |
| 68 | 7.2 | The silo with its `21,000,000` lid; a lever tries to lift the lid (1.4–2.3 "in theory"); houses and laptops hold it down, more and more join (3.5–6.1 "convince"); a tiny white flag (6.6 "good luck"). Host left. | the cap in practice |

## dict (`c2dict`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 69 | 5.9 | `NODE` (1.8): a laptop with the book, a magnifier and a gavel; an empty wallet `$0` (4.6–5.5 "no salary"). | node |
| 70 | 6.5 | `HALVING` (0.5): a coin cut in two (1.4–2.8); four calendar pages flip (3.5–4.1); a countdown board 3 · 2 · 1 with confetti (4.6–6.0). Host right. | halving |

## recap (`c2recap`)

| # | len | what is seen, what happens | why |
|---|---|---|---|
| 71 | 11.2 | Camera travels left to right over three stops: (1, 1.4–4.1) linked pages, a red change bounces off; (2, 4.8–7.5) the warehouse of rigs with a bolt, the book under its ring of links; (3, 8.4–10.7) the code case, every laptop ✓. Host right. | the three points |

## end card

`endnext`, `NEXT 3 / 5` with the key, the safe and the mask: keys, wallets, and a ledger that is not anonymous.
