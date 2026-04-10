// @/lib/pastelColor.ts

function getHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

export function generatePastelBg(str: string): string {
  return `hsl(${getHash(str)}, 70%, 90%)`;
}

export function generatePastelText(str: string): string {
  return `hsl(${getHash(str)}, 50%, 35%)`;
}