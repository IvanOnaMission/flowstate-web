---
title: Answers Batch 1
purpose: Ivan's answers to the 20 customer questions, source material for site pages and posts
read_when: writing site pages, LinkedIn posts, FAQ
updated: 2026-11-25
---

Ivan answered all 20 questions on 2026-11-23; check the flagged answers against `docs/decisions.md` before publishing.

Source: Ivan, message to Johan, 2026-11-23. Text below is Ivan's; only the Q9 list is joined into one line.

| answer | check before publishing |
|---|---|
| Q4 | D16 (settled): leave the limit line out of public copy |
| Q11 | D24 (settled): drop the last sentence, use Jordan's business as the proof point. See "Updates from Ivan" |
| Q12 | D14 (settled): ServiceM8 counts too. See "Updates from Ivan" |
| Q17 | D13 (open): confirm "10+ clients" and "six years" |
| Q18 | D15 (settled): foundation set up in 2 to 3 days. See "Updates from Ivan" |
| Q20 | D12 (settled): the Auckland client stats may be used |

## Updates from Ivan (2026-11-25)

Source: Ivan, message to Johan, 2026-11-25. These change the answers below; the original text is kept as written.

- **Q11:** "the 'no full Simpro build yet' line in Q11 is out of date. Jordan's business is fully automated through Simpro, so take that limit out and lead with it as a proof point." (D24)
- **Q12:** "yes, ServiceM8 counts. Flowstate can work with any job management software." (D14)
- **Q18:** "the foundation is set up in 2 to 3 days" (D15)
- **Q20:** the Auckland client stats are "all good, you can use them." (D12)

## Cost and value

### Q1. How much does AI automation cost for a small trade business in NZ?
It depends on what you're after. If it's a one-off build, it's one fee up front. If you want ongoing help, so us maintaining it and building more over time, we put a monthly retainer in place. The price comes down to the size of the business and how much work you want done, and we work it out from what the problem is costing you. If someone's losing five hours a week to quoting, that's the number we start from, and the build has to pay for itself off that. On top of that you pay your own running costs for hosting and AI, which go on your own card so you own the system.

### Q2. How long until AI automation pays for itself?
It depends on what you do with the time you get back. The build pays for itself when the owner puts those hours into work that pushes the business forward. Say AI lets your estimator get five more quotes out each week. If you've got the demand, that's five more chances to win a job every week, and the build pays for itself pretty quickly. If the saved time just disappears into other admin, it takes a lot longer. Before we build anything we work it out as hours saved a week times your hourly rate times 52, so you know what it's worth going in.

### Q3. Is AI worth it for a business with 1 to 5 staff?
Yes. AI is worth it for any size of business, from one person up to a big company. What it does is take the repetitive parts of someone's job off them, the stuff they don't need to be doing anymore, so they can spend that time on the higher-priority work that grows the business. In a 1 to 5 person business that's usually the owner doing the quoting, invoicing and chasing on top of the actual work, so that's where it helps the most. For a small team we'd start with the one or two jobs that eat the most time rather than building everything at once.

### Q4. Is an AI receptionist worth it for a tradie?
Honestly, as a backstop, yes, as a replacement for a person, not yet. What Jordan's found running one is about half of callers are fine with it, a quarter hate it, and the rest push through. It's better than voicemail. If you set one up, have it take basic details and then you ring them back as a human. Flowstate doesn't sell a standalone AI receptionist right now.

## What it does

### Q5. Can AI answer my phone and book jobs while I'm on site?
It can answer and take the details, and then you or the office call back and book it. I wouldn't have it booking jobs straight into your calendar on its own, customers don't trust it with that yet and you lose control of the diary. The way Flowstate sets things up, the AI captures the job and puts it in front of you, and you say yes.

### Q6. Can AI write my quotes and invoices?
It can prepare them, you approve them. The way Flowstate builds it, the AI drafts the quote or invoice in Xero or your job software from your price list and the job notes, and anything it can't price gets marked CHECK instead of a made-up number. You look over it and press send. For the first month a person checks every draft. It works best on repeatable jobs, big tender-style jobs still need your judgement. We can also pull in your supplier pricing and put the quote together as a proper PDF quote pack from a proposal template, so the customer can see you've put time and effort into it.

### Q7. How can AI follow up leads I don't have time to call back?
New enquiries get a reply drafted within minutes, asking the right questions, and quotes with no reply get followed up at 3 and 7 days until the customer answers. Flowstate sets these up as drafts first that you approve, then once you trust it you can switch it to send on its own. It stops as soon as someone replies or says stop.

### Q8. Can AI get me more Google reviews?
Yeah, it can make sure you actually ask every customer. When a job's paid, it drafts a review request that goes from your own phone or email, signed by you, and it skips anyone you've already asked in the last year. It runs in the background, so asking stops relying on you remembering at the end of a long day. One rule we stick to: never ask for a 5-star review and never only ask the happy customers. Google bans both, and it can get reviews taken down.

### Q9. What admin can a tradie hand over to AI today?
Start with whatever is slowing your growth down the most. For most trade businesses it's one of these: getting new leads; pricing quotes faster; landing more jobs; speeding up admin; answering emails; bringing everything together so it's all on one screen. Whatever's costing you the most is the first thing we look at. All of these can be handed to AI today, as long as it drafts and you approve. What it can't do is price jobs on its own or sign off compliance paperwork, that stays with you.

## Job software

### Q10. What can you automate in Fergus?
Inside Fergus, we can use the API to create quotes from you talking into your phone, update jobs, schedule work and pull your job and financial info together. Fergus's API doesn't let you create invoices or record payments, so that side runs through Xero. But Fergus on its own only adds so much value. Where you really see it is when it's connected to everything else, your AI, your calendar, your email and a company brain that holds all the information about how your business runs. Then the AI sees the whole picture instead of one piece of it.

### Q11. What can you automate in SimPRO?
Simpro's API goes further than Fergus. You can do quotes, invoices, payments, suppliers, purchase orders and stock. The catch is you need Simpro's Premium plan for the API and for quotes, and Simpro has to approve the connection. One handy thing about Simpro is you can set up your own drop-down options and statuses inside it, and each one can trigger an automation, so when a job moves to a new status the next step happens on its own. Jordan runs his electrical business on Simpro and has his AI pulling supplier pricing into his catalogue and building pre-builds. Same as Fergus though, the big benefit comes when it's connected to all your other software, so the AI can see everything your business is doing. Flowstate hasn't done a full Simpro client build end to end yet, so the first one is the test.

### Q12. Does it work with Tradify, ServiceM8, AroFlo or Xero?
Pretty much, yes. The easiest is software with full API access, which is a proper way for other systems to plug into it. Xero has that, and so does AroFlo. Tradify doesn't have full API access, so there we automate through the browser, with the AI clicking through the screens like a person would. That works, it's just more fiddly and can break when they change their screens. If you're not sure about your job software, check whether it has full API access. Either way, the main thing is connecting it to everything else so the AI has full visibility of the business.

## Trust and risk

### Q13. Will AI sound robotic to my customers?
Not if you set it up right. We build what we call a voice DNA skill. It goes through your meetings, emails and text messages, works out how you actually talk to customers and clients, and builds a voice profile from that. The profile can change depending on who you're replying to, so a supplier gets a different tone to a new customer. You can also tell it which words, phrases and symbols to use and which to never use. Everything still goes out from your own email or phone, signed by you, and you see the draft before it's sent.

### Q14. What happens if the AI makes a mistake with a customer?
That's why nothing goes to a customer without you approving it. The AI drafts, you check and press send. Anything it isn't sure about gets marked CHECK rather than guessed. Every helper gets tested on real past jobs before it goes live, and for the first month a person checks every draft. If something we built isn't working right, Flowstate fixes it.

### Q15. Is my customer data safe?
Your data stays in your own accounts. You host the system on your own account and card and we're invited in to build it, Flowstate doesn't keep a copy of your business. Business AI plans don't train on your data, and each automation only gets access to what it needs. I won't say it's zero risk, the real risks are a breach at one of the providers, same as your accounting software, or a leaked password, so you type your own passwords and nothing goes out without your approval. Hosting is offshore by default, Singapore is the closest region, there are NZ options if you want it onshore.

### Q16. Do I need to be good with tech to use this?
No, you don't need to be a tech person. You can't be an elephant on a keyboard, but if you can use a phone and send an email you'll be fine. It runs in the background on the software you already use, and the drafts come to you to approve. We do all the setup, then two training sessions on your real jobs, a one-page cheat sheet and 30 days of support while you get used to it.

## Getting started

### Q17. Who can automate my trade business in NZ, and what makes Flowstate different?
Flowstate is trained and backed by a real electrical company that's been automating its own business for the last six years, so what we build has already been tested in a working trade business. We've delivered for 10+ clients across different trades, and the goal is to be New Zealand's go-to for AI in trade businesses. We build on the software you already use, it runs on your own accounts so you own it, and if AI isn't the answer for something we'll tell you straight.

### Q18. What does getting set up look like, and how long does it take?
First a 30-minute call to work out where the time's going. Stage one is building the foundation. We set up the accounts in your name, connect your job software and Xero, and build the AI brain, which is everything about how you run things, your prices, your rules and your processes, so the AI actually knows your business. Part of that stage is making sure you understand what's going on and how it all fits together. Once the foundation's in, we build the helpers on top one at a time, each one tested on real past jobs before it goes live.

### Q19. What do you need from me to get started?
Just 30 minutes of your time to start. We sit down together and work out what's costing your business the most and where AI can help. If it's a fit, we build a custom implementation plan from there. Once we get into the build, we'll need things like your price list, some past quotes and invoices, and access to your job software and Xero, which you log into yourself.

## Industry

### Q20. How are NZ builders, plumbers and electricians using AI in 2026?
The ones getting ahead are using it on the admin, not the tools. One Auckland electrical business we work with has quotes coming back 95% built, an AI assistant with its own email and phone line, and a review system that added 150 reviews in three months. Most trade businesses I talk to are still using ChatGPT to write scopes or emails, which is a start, but it doesn't know their prices or connect to their software. The ones doing it properly treat AI as part of how the business runs, not a tool on the side. They think of it like a new employee: you bring it in, train it on your systems and software, and once it's learned something it doesn't forget. That's what takes the repetitive admin off people who don't need to be doing it anymore.
