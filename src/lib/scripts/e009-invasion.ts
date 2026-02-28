import { allStrategies } from '../strategies/index';
import { runEvolution } from '../engine/evolution';
import { runRoundRobin } from '../engine/tournament';

// Payoffs that explain TF2T collapse at eps=0.01 in Pavlov-dominated field
const t01 = runRoundRobin(allStrategies, 200, 42, 0.01);
const pav01 = t01.entries.find(e => e.name === 'Pavlov');
const tf2t01 = t01.entries.find(e => e.name === 'Tit for Two Tats');
const tft01  = t01.entries.find(e => e.name === 'Tit for Tat');

console.log('=== Payoffs vs Pavlov at eps=0.01 (per round) ===');
const checkNames = ['Pavlov', 'Tit for Two Tats', 'Tit for Tat', 'Gradual', 'Generous TFT'];
for (const n of checkNames) {
  const pm = pav01.matches.find(m => m.opponent === n);
  if (pm) console.log('Pavlov   vs ' + n.padEnd(22) + (pm.score/200).toFixed(3));
}
console.log('');
for (const n of checkNames) {
  const tm = tf2t01.matches.find(m => m.opponent === n);
  if (tm) console.log('TF2T     vs ' + n.padEnd(22) + (tm.score/200).toFixed(3));
}
console.log('');
for (const n of checkNames) {
  const tm = tft01.matches.find(m => m.opponent === n);
  if (tm) console.log('TFT      vs ' + n.padEnd(22) + (tm.score/200).toFixed(3));
}
