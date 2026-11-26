import type { Post } from "@/lib/post-rules";

/**
 * Jordan's first post, as he wrote it (docs/interviews/ai-receptionist-for-tradies-answers-jordan.md).
 * Replaces the old /ai-receptionist-for-tradies/ answer page, which now 301s here (public/_redirects).
 */
const post: Post = {
  slug: "ai-receptionist-for-tradies",
  h1: "Is an AI receptionist any use to a tradie?",
  metaTitle: "Is an AI Receptionist Any Use to a Tradie? | Flow State",
  description:
    "Flow State's take for trades: an AI receptionist is useful on email, weak on the phone. In Jordan Statham's electrical business, about half of callers hang up.",
  card: "An honest look at AI receptionists for trade businesses: where they help, where callers hang up, and why people still want people.",
  author: "jordan",
  published: "2026-11-27",
  intro:
    "If you're a tradie on the tools, you've probably had an AI receptionist pitched to you. I run one in my own electrical business, and Flow State has set them up for clients, though they aren't the core of what Flow State sells. The examples here come from electrical work, because that's my trade, but the problem of missing calls while you're on the tools is common to any trade. This is an honest take, including the parts the sellers leave out.",
  directAnswer:
    "Yes, but not as a replacement for a person. It's genuinely useful on email and web enquiries. On the phone, Flow State recommends it only as a smart voicemail. It takes the details and a person calls back, because many callers hang up the moment they hear it's an AI.",
  sections: [
    {
      q: "Does an AI receptionist actually work?",
      a: [
        "It can, for most of what it's asked to do. But it doesn't take the place of a person for anything complex. Think of it as a layer between your callers and whoever runs your office, not a swap for them.",
        "The biggest thing Flow State has learned is that people still want people. Humans want to deal with humans. It's the background tasks, the tedious work, and the manual entry that are most beneficial to automate.",
        "The overseas evidence says the same. Klarna said AI was doing the work of 700 staff, then [started hiring people again](https://www.entrepreneur.com/business-news/klarna-ceo-reverses-course-by-hiring-more-humans-not-ai/491396) because quality fell. Commonwealth Bank in Australia cut 45 call centre roles for a voice bot, then [reversed it](https://www.cyberdaily.au/digital-transformation/12531-cba-rolls-back-ai-related-job-cuts-following-union-and-worker-backlash) when the calls didn't drop. Taco Bell [slowed its voice AI](https://www.techspot.com/news/109248-taco-bell-slows-down-ai-drive-thru-push.html) at drive-throughs. And in a 2026 Gartner survey of 3,566 customers, [87% said a way through to a person is essential](https://www.gartner.com/en/newsroom/press-releases/2026-07-08-gartner-survey-finds-customers-are-three-times-more-likely-to-use-third-party-genai-than-company-provided-chatbots-for-customer-service).",
        "How well it works depends on the channel. Email and phone are two different jobs.",
        { h3: "On email and web enquiries" },
        "This is where an AI receptionist earns its keep. Say a quote request comes in through your website. It can reply straight away: thanks, we're working on your quote, it'll be with you within the hour. Then it starts the automations behind that reply. It can put together a first draft of the quote, ready for you to check.",
        "Flow State always recommends keeping a person in the loop before a quote goes out, because a quote is a legal document. The AI replies, sorts, and routes. A person signs off. Then the quote goes to the client.",
        { h3: "On the phone" },
        "An AI can answer the call, write down what the caller says, and act on it. But on the phone, the results are much weaker. A lot of callers don't trust that an AI will get it right. Some think it's a novelty for now, and that will wear off.",
        "So in the businesses where Flow State has set up a phone receptionist, it's kept to a much better version of voicemail. It takes the basic details and starts the work behind the scenes. Then a person either picks up or calls back to finish the conversation.",
      ],
    },
    {
      q: "What's it actually like running an AI receptionist for 30 days?",
      a: [
        "I record every call to the AI receptionist in my own electrical business, so I can see what callers make of it. The same kinds of caller come up again and again:",
        {
          list: [
            "People who hang up as soon as they hear it's an AI.",
            "People who get frustrated with it partway through.",
            "People who push through, and end up liking it.",
            "People who ask for a real person straight away.",
            "People who just want a callback.",
          ],
        },
        "The numbers are hard to argue with. From late August to mid October 2026, 90 callers reached it and 51 of them hung up without leaving their details. That's 57%. In October my business changed the greeting so it says up front that it's an AI. A [study of 450,702 calls](https://www.devdiscourse.com/article/business/3957545-ai-customer-service-enters-next-phase-as-businesses-focus-on-optimisation-rather-than-adoption-report) by Upfirst, a company that sells AI receptionists, reported in July 2026, had found that being upfront went with about 20% fewer hang-ups. A stricter count, which leaves out staff and test calls, then compared the two greetings: 52.5% hung up before the change (52 of 99 calls) and 53.8% in the four weeks after (28 of 52). That's no real change. 52 calls is a small sample, but it lines up with what the recordings show: most callers hear the whole greeting, then leave.",
        "My business has changed how the AI talks over time, in response to what the recordings showed. It still loses about half the callers it answers. That's why Flow State keeps a phone AI to taking the details for a person to call back.",
      ],
    },
    {
      q: "Can it answer calls while I'm on the tools?",
      a: [
        "Yes, and this is what it's best at. A voicemail asks for a name and number. An AI receptionist can ask for the name, the number, the site address, and the basics of the job. It can go as deep as you like.",
        "Flow State doesn't recommend it goes too deep. It works best as a very capable voicemail that collects more than a normal one would. Anything more complex still needs a person. But if you're on the tools, it gets you better leads, and the caller feels like someone is actually going to get back to them.",
      ],
    },
    {
      q: "When you're up a ladder or in the middle of a job, who's answering?",
      a: [
        "Flow State's advice: if you can stop and take the call, take the call. You'll win more work, especially on a sales call. Picking up and getting the details while the caller is keen beats any machine.",
        "Here's the maths. Say only 25% of callers hang up when they realise it's an AI. That's 25% of those potential clients gone. So the AI should only answer when you really can't. How fast you get back to people yourself is what wins the work.",
        "It's different for an existing client. If you can see who's calling and you don't have time, the AI is far more useful than voicemail. It can start automations, add notes to the job, and pass on everything they tell it. It just won't build the relationship. People aren't going to build rapport with machines. They build rapport with humans.",
      ],
    },
    {
      q: "Does an AI receptionist suit a one-man trade business or only larger teams?",
      a: [
        "Flow State's view is that it can suit a one-man band. A standalone AI receptionist costs around $200 a month: [Talkify](https://talkify.nz/pricing), a New Zealand one, listed its main plan at $199 a month in November 2026 (its pricing page doesn't say whether that includes GST). If it captures just one extra lead that converts to a decent job, it more than pays for itself.",
        "With the right setup, such as an always-on computer or server, a voice agent can run for less than that each month. But the setup and the equipment cost money up front, so Flow State's view is that it's only worth it as part of a much bigger AI system.",
        "Where a sole trader should be careful is how far they push it. Keep it to taking details and passing them on. Training it to answer in depth takes a lot of your time, which is the next point.",
      ],
    },
    {
      q: "Will an AI receptionist understand the technical details of my services?",
      a: [
        "It can, if you put a lot of time into training it. You build a knowledge base for each service you offer. Then you review the calls, say every week, find where it gave a wrong or shaky answer, and correct it. Over time it gets better.",
        "But it is never foolproof. However well it's trained, an AI can still make things up. And anything your AI tells a caller is your business telling them. Overseas, a tribunal has already held [Air Canada liable for bad fare advice its chatbot gave](https://www.cbc.ca/news/canada/british-columbia/air-canada-chatbot-lawsuit-1.7116416). That's a big reason Flow State doesn't recommend using a voice agent for in-depth technical answers.",
        "For a large company fielding a lot of calls, training it properly can pay off, because the work scales. For a small business, the sums don't work. You'd spend a lot of time getting the answers right, for much less reward than a team of a hundred would get.",
      ],
    },
    {
      q: "Why is call triage hard in a trade like electrical work?",
      a: [
        "In electrical work, there are just so many services, and so many versions of each one. Think about an experienced tradie, say an electrician with ten years or more in the trade. When they talk to a client on the phone, they're drawing on all of that experience at once.",
        "Getting all of that written down and organised well enough for a machine to do a comparable job is close to impossible. You can give it the basics, and it will make a decent attempt. That's why Flow State only recommends in-depth call handling for a big call centre, where the cost makes sense.",
      ],
    },
    {
      q: "What happens if the AI receptionist can't answer a technical question?",
      a: [
        "The ones Flow State has set up simply pass the question on. The usual line is something like: \"Sorry, I'm not qualified to answer that. But we have all your details, and one of our qualified staff will call you back to talk it through.\"",
        "It thanks the caller, takes any extra contact details it needs, and ends the call. Then it emails everything to the right person. That might be a sales consultant, a technician, or you if you work on your own. You've got plenty to go on when you call back.",
      ],
    },
    {
      q: "Can an AI actually handle a heat pump enquiry, or does it just take a message?",
      a: [
        "It can handle it. Flow State knows of an electrical business in Northland whose AI agent answers heat pump calls. It asks how big the room is, how much window there is, and everything else about the install. Then it recommends a unit and gives an estimate at the end. The estimate still depends on a site visit and a check by a person.",
        "When a caller stays on and gives all those details, you win more of those jobs, because you already have everything you need to act on. But be wary. Some callers rang to talk to a person. A few steps in, they hang up, frustrated. Every bit of friction the AI adds costs you callers, and each one could be a lost sale.",
      ],
    },
    {
      q: "Does a person win more jobs than AI when the caller is panicking?",
      a: [
        "Yes, 100%. When a caller is upset, an AI can pick it up from the words they use. When that happens, it should put the call straight through to a person, or tell the caller a person will ring them back.",
        "Get this wrong and it hurts. Flow State has seen clients get bad reviews because of how talking to an AI made callers feel. It just wasn't getting them on a human level. So Flow State's advice is to keep these systems on a short leash, with clear limits on what they handle.",
      ],
    },
    {
      q: "Can I switch the AI receptionist off when I am free?",
      a: [
        "Yes, easily. Most of the AI receptionists Flow State sets up sit inside an internet phone system that routes calls. A call rings your office person first. If they're busy, it rings other staff. Only if nobody can answer does it go to the AI, which takes the caller's details in full and tells them someone will call back.",
        "That's a good way to run it. And when you're back at your desk, you can switch the AI off.",
      ],
    },
  ],
  inShort:
    "An AI receptionist is worth having for email and web enquiries. On the phone, use it as a better voicemail for the calls you genuinely can't take, and nothing more. For most small and medium trade businesses in New Zealand, Flow State's view is that going deeper isn't worth the time or the risk. The real gains are in the background work: the data entry, the paperwork, and the tasks nobody wants to do. That frees you up for the part a machine can't do, which is talking to your clients.",
  faq: [
    {
      q: "Are AI receptionists any good?",
      a: "On email and web enquiries, yes, in Flow State's view. On the phone, they work best as a smarter voicemail that takes the details for a person to call back. In my own electrical business, about half of the callers who reach my AI receptionist hang up.",
    },
    {
      q: "Can AI answer phone calls for my business?",
      a: "Yes. It can answer, take the caller's details, and pass them on by email. Flow State recommends a person picks up or calls back to finish the conversation, because many callers would rather talk to a person.",
    },
    {
      q: "Can I use AI for after-hours and overflow calls only?",
      a: "Yes, and that's how Flow State recommends it. A phone system can ring your staff first and only send the call to the AI when nobody can answer. You can switch it off when you're free.",
    },
    {
      q: "Will an AI receptionist work for a sole trader without any staff?",
      a: "Yes. A standalone AI receptionist costs around $200 a month. One extra captured lead that converts to a decent job more than pays for it. Flow State's advice is to keep it to taking details, not answering in depth.",
    },
    {
      q: "Will the AI receptionist know enough about my trade to qualify calls?",
      a: "It can learn the basics, and it gets better with regular training. But it can't match years of experience in the trade, and it can still get things wrong. For a small business, Flow State recommends using it to collect details and leaving the judgement to a person.",
    },
    {
      q: "Is an AI receptionist a good fit for tradies?",
      a: "For capturing calls you can't take, yes. For in-depth triage, not really. A trade like electrical work has too many services and variations for a machine to judge well, so the ones Flow State sets up stick to taking details.",
    },
  ],
  closing:
    "If you want to see where the background work is hiding in your trade business, [we're happy to have a look](https://flowstate.net.nz/services/). A quick chat, no pitch deck.",
  figures: ["87%", "57%", "20%", "52.5%", "53.8%", "25%", "100%", "$200 a month", "$199 a month"],
  claims: [
    "Every line of the post: Jordan's copy, docs/interviews/ai-receptionist-for-tradies-answers-jordan.md (sent 2026-11-27), published as written",
    "Byline, title \"Partner, Business Strategy\" and the author bio (registered electrician, electrical inspector, runs an Auckland electrical contracting business, built its office automations): Jordan's own statement, D46",
    "Client lines (Flow State has set receptionists up for clients; seen clients get bad reviews; most it sets up sit inside an internet phone system; the Northland heat pump business): Jordan's copy, D46",
    "87%: Gartner survey of 3,566 customers, July 2026, linked inline; third-party research figure, D45",
    "57% (51 of 90 callers), 52.5% (52 of 99) and 53.8% (28 of 52): call recordings in Jordan's own electrical business, August to November 2026; author's own business data, D45",
    "20%: Upfirst study of 450,702 calls, reported July 2026, linked inline; third-party research figure, D45",
    "25%: a hypothetical in Jordan's worked example (\"Say only 25%\"), not a measured result, D45",
    "100%: figure of speech (\"Yes, 100%\"), not a statistic, D45",
    "$199 a month: Talkify's published price (talkify.nz/pricing, November 2026), another company's price, linked inline, D45",
    "$200 a month: Jordan's rounded market estimate for a standalone AI receptionist, next to the Talkify price that supports it; not a Flow State price, D45",
    "Klarna, Commonwealth Bank, Taco Bell, Air Canada: news reports linked inline",
  ],
};

export default post;
