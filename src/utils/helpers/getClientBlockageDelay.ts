export default function getClientBlockageDelaySec(factor: number): number {
  const MIN_DELAY_SEC = 30 * 60;
  const DELAY_INCREMENT_SEC = 15 * 60;

  return MIN_DELAY_SEC + (factor - 1) * DELAY_INCREMENT_SEC;
}
