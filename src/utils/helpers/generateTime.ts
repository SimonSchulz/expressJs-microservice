export default function generateTime() {
  const lastSentEmailTime = new Date(Date.now());
  const codeExpirationTime = new Date(Date.now());

  return { lastSentEmailTime, codeExpirationTime };
}
