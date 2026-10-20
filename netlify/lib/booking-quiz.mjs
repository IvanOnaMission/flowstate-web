const QUESTIONS = [
  ['office_staff', 'Office / admin staff'],
  ['challenge', 'Biggest business challenge'],
  ['goal', 'What they want AI to help achieve'],
  ['ai_experience', 'Current experience with AI'],
  ['timing', 'When they want to start'],
  ['investment', 'Realistic investment'],
];

export function quizAnswers(data) {
  return QUESTIONS.map(([key, question]) => {
    const choice = String(data[key] || '').trim();
    const answer = choice === 'Other' ? String(data[`${key}_other`] || '').trim() : choice;
    if (!answer || answer.length > 500) throw new Error(`Invalid quiz answer: ${key}`);
    return {question, answer};
  });
}

// Resolve the identity from Calendly, rather than trusting a submitted email or URL.
export async function verifiedQuizBooking(uri, token, fetcher = fetch) {
  const uuid = '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}';
  if (!new RegExp(`^https://api\\.calendly\\.com/scheduled_events/${uuid}/invitees/${uuid}$`, 'i').test(String(uri))) {
    throw new Error('Invalid booking reference');
  }
  if (!token) return null;
  const response = await fetcher(uri, {headers: {authorization: `Bearer ${token}`}, redirect: 'error'});
  if (!response.ok) throw new Error(`Booking lookup failed (${response.status})`);
  const {resource} = await response.json();
  if (resource?.uri !== uri || !resource.email || resource.status !== 'active') throw new Error('Booking could not be confirmed');
  return {email: resource.email, name: resource.name, uri: resource.uri};
}
