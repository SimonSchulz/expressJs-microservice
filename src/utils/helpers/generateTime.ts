export default function generateTime() {
  const lastSentSmsTime = new Date(Date.now());
  const codeExpirationTime = new Date(Date.now());

  return { lastSentSmsTime, codeExpirationTime };
}
