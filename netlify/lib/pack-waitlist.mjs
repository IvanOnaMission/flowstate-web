// The /pack/ page puts electrical business owners on the waitlist for the free AI systems pack
// (Jordan's catalogue of 127 systems). Same shape as /live/, two Netlify forms:
//   "pack-waitlist"          name, email, optional mobile + tracking. This is the lead (Meta Lead fires on it).
//   "pack-waitlist-answers"  the optional "just before you go" questions, same fields as /essentials/.
// When the pack is ready, send a Kit broadcast to the pack-waitlist tag.
import {clean} from './messages.mjs';
import {essentialsAnswers, essentialsCustomerType} from './essentials-quiz.mjs';

export const OFFER = 'Pack waitlist';
export const FORM = 'pack-waitlist';
export const ANSWERS_FORM = 'pack-waitlist-answers';
export const SOURCE = 'Pack waitlist page';
// Kit tag "pack-waitlist": everyone to email when the pack is ready. KIT_TAG_PACK_WAITLIST overrides it.
export const waitlistTag = () => process.env.KIT_TAG_PACK_WAITLIST || '26237252';
// Kit sequence "Pack waitlist — welcome (fires on signup)": one "you're on the list" email.
// KIT_SEQUENCE_PACK_WAITLIST overrides it.
export const welcomeSequence = () => process.env.KIT_SEQUENCE_PACK_WAITLIST || '2980406';
// Shown in the Telegram alert instead of the Calendly "extra details" line.
export const EXTRA = 'Joined the waitlist for the free AI systems pack';
export const HEADLINE = 'New pack waitlist signup';

// Same questions, labels and order as the /essentials/ quiz. No business name on this page.
export const packAnswers = (data = {}) => essentialsAnswers({...data, business: ''});

// Only meaningful once they've said their role; the signup itself has no answers.
export const packCustomerType = (data = {}) => (clean(data.role) ? essentialsCustomerType(data) : undefined);
