import { toilet, bottles, gasCloud, propDefs, brush } from "./props.js";
import { G, T } from "./kit.js"; import { C } from "./palette.js";
export const frame = (t) => `<defs>${propDefs}</defs><rect width="1080" height="1920" fill="${C.indigo}"/>
 ${G(T(230, 700), toilet({ lid: 1, shine: 1, t }))}${G(T(620, 700), toilet({ lid: 0.1 }))}${G(T(900, 700, 0, .8), toilet({ lid: 1, doctor: 1, cap: 1, t }))}
 ${G(T(140, 1150), bottles.bleach())}${G(T(380, 1150), bottles.toilet())}${G(T(600, 1150), bottles.vinegar())}${G(T(820, 1150), bottles.glass())}${G(T(980, 1150,20), brush())}
 ${gasCloud(300, 1550, 220, t, { skull: 1 })}${gasCloud(800, 1560, 160, t, { seed: 4, grow: .7 })}`;
