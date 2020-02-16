export function randomInteger (min, max) {
  const rand = min - 0.5 + Math.random() * (max - min)
  return Math.round(rand)
}
