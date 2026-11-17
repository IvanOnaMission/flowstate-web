// The /live/ page signs electrical business owners up for Jordan's free live session.
// Two Netlify forms:
//   "live-session"          name, email, phone + ad tracking. This is the lead (Meta Lead fires on it).
//   "live-session-answers"  the optional "just before you go" questions, same fields as /essentials/.
// The answers are saved as a CRM note and, while the lead's Telegram alert is still on hold,
// folded into that alert so Ivan gets one message with everything.
import {clean} from './messages.mjs';
import {essentialsAnswers, essentialsCustomerType} from './essentials-quiz.mjs';

export const OFFER = 'Live session';
export const FORM = 'live-session';
export const ANSWERS_FORM = 'live-session-answers';
export const SOURCE = 'Live session page';
// Kit sequence "Live session 24 Nov — welcome (fires on signup)": one email with the Google Meet link.
// KIT_SEQUENCE_LIVE_SESSION overrides it for a later session.
export const welcomeSequence = () => process.env.KIT_SEQUENCE_LIVE_SESSION || '2975201';
// Shown in the Telegram alert instead of the Calendly "extra details" line.
export const EXTRA = 'Signed up for the free live session, Tue 24 Nov 10am';
export const HEADLINE = 'New live session signup (Jordan, Tue 24 Nov)';

// Same questions, labels and order as the /essentials/ quiz. No business name on this page.
export const liveAnswers = (data = {}) => essentialsAnswers({...data, business: ''});

// Only meaningful once they've said their role; the signup itself has no answers.
export const liveCustomerType = (data = {}) => (clean(data.role) ? essentialsCustomerType(data) : undefined);
