import { NicheConfig, NicheType, OutputFormat, ToneStyle } from './types';

export const NICHE_CONFIGS: Record<NicheType, NicheConfig> = {
  podcaster: {
    id: 'podcaster',
    title: 'Podcasters',
    subtitle: 'Turn audio transcripts into show notes, tweet threads & quote cards',
    badge: 'Audio & Podcast',
    color: 'from-pink-500 to-rose-600',
    accentGradient: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/30',
    supportedFormats: [
      { id: 'show_notes', label: 'Show Notes & Timestamps', description: 'Episode overview, key takeaways, and timestamped highlights' },
      { id: 'twitter_thread', label: 'Twitter/X Thread', description: '10-tweet breakdown with hooks, takeaways, and call-to-action' },
      { id: 'quote_graphics', label: 'Quote Graphics Text', description: 'Punchy 1-2 sentence quotes designed for social graphics' },
      { id: 'linkedin_post', label: 'LinkedIn Story', description: 'Professional takeaway post highlighting guest insights' },
      { id: 'blog_post', label: 'Summary Article', description: 'Structured blog post summarizing the episode' },
    ],
    sampleTranscript: `[00:00:15] Host: Welcome back to The Growth Blueprint. Today I'm joined by Sarah Chen, founder of ScaleFast, who went from zero to $5M ARR in just 18 months. Sarah, what was the single biggest turning point?

[00:00:34] Sarah: Thanks for having me! The biggest shift was when we stopped trying to serve everyone and focused 100% on high-ticket B2B SaaS founders. We narrowed our positioning, doubled our prices from $500/mo to $2,500/mo, and actually increased our closing rate from 12% to 34%.

[00:01:05] Host: That sounds counterintuitive to most founders who fear raising prices will kill demand. How did you handle customer pushback?

[00:01:20] Sarah: Premium buyers don't buy features; they buy outcome certainty and saved time. When we raised our prices, buyers assumed our product was enterprise-grade. We also instituted a 30-day ROI guarantee which eliminated buying friction.

[00:02:10] Host: What advice would you give to someone stuck at $10k MRR today?

[00:02:25] Sarah: Audit your calendar. Most founders spend 80% of their day on low-leverage execution instead of distribution and positioning. Shift 2 hours every morning to outbound sales and audience building. That single habit doubled our pipeline in 90 days.`,
    mockOutput: {
      show_notes: `🎙️ **Episode Overview**: How Sarah Chen Scaled ScaleFast to $5M ARR in 18 Months

**Key Takeaways:**
• Why doubling prices from $500/mo to $2,500/mo tripled closing conversion rates.
• Positioning strategy: Moving from broad SMB target to laser-focused high-ticket B2B SaaS.
• Outcome Certainty vs Feature Selling: How premium pricing alters buyer perception.
• The 2-Hour Daily Habit that doubled sales pipeline in 90 days.

**Timestamps:**
• 00:15 - Introduction & ScaleFast backstory
• 00:34 - The pricing overhaul turning point
• 01:20 - Why enterprise buyers prefer premium pricing
• 02:25 - Calendar audit for founders stuck at $10k MRR`,
      twitter_thread: `1/ How Sarah Chen scaled her SaaS to $5M ARR in 18 months (by DOUBLING prices): 🧵👇

2/ The biggest mistake founders make? Trying to serve everyone.
Sarah was selling for $500/mo to any SMB.
Closing rate: 12%.

3/ The Fix:
• Narrowed ICP to high-ticket B2B SaaS
• Increased pricing to $2,500/mo
• Added a 30-day ROI guarantee

4/ The result?
Closing rate jumped from 12% ➡️ 34%.
Revenue exploded.

5/ Why did higher pricing WORK?
"Premium buyers don't buy features. They buy outcome certainty and saved time."
When you charge more, buyers perceive enterprise value.

6/ Sarah's #1 advice for founders stuck at $10k MRR:
Audit your calendar.
Shift 2 hours every morning exclusively to outbound sales and audience building.

7/ Want more insights like this? Follow @EveryPosting for daily content repurposing breakdowns!`,
      quote_graphics: `Quote #1:
"Premium buyers don't buy features; they buy outcome certainty and saved time." — Sarah Chen

Quote #2:
"If you are stuck at $10k MRR, audit your calendar. Shift 2 hours every morning to distribution." — Sarah Chen`,
    },
  },
  youtuber: {
    id: 'youtuber',
    title: 'YouTube Creators',
    subtitle: 'Turn video scripts into viral Twitter threads, blog posts & captions',
    badge: 'Video & Tech',
    color: 'from-pink-500 to-rose-600',
    accentGradient: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/30',
    supportedFormats: [
      { id: 'twitter_thread', label: 'Viral X/Twitter Thread', description: 'Hook-driven summary designed to drive retweets & views' },
      { id: 'blog_post', label: 'SEO Blog Article', description: 'Comprehensive, structured article with headers and key takeaways' },
      { id: 'instagram_captions', label: 'Short Form Reel/Short Caption', description: 'Engaging caption with CTA and high-performing hashtags' },
      { id: 'linkedin_post', label: 'LinkedIn Article', description: 'Insightful breakdown framed for professional network growth' },
      { id: 'quote_graphics', label: 'Thumbnail & Quote Text', description: 'Bold text overlays for YouTube thumbnails & Instagram carousels' },
    ],
    sampleTranscript: `Hey everyone! Today we're breaking down the 5 AI tools that are replacing $100k agency contracts in 2026. 

First up: Automated Video Editing with Submagic and Descript. 3 years ago, hiring a full-time video editor cost $4,000/month. Today, AI auto-cuts silence, generates dynamic captions, inserts B-roll, and optimizes audio in under 90 seconds.

Second tool: Content Repurposing with AI. Instead of spending 15 hours writing separate posts for Twitter, LinkedIn, and email, tools like EveryPosting take a single YouTube transcript and generate 7 days of social content in 3 clicks.

Third: Automated Lead Scoring with Claude. You can feed your inbound contact forms into Claude 3.5 Sonnet to score leads automatically and draft tailored personalized outreach responses.

The key lesson here isn't to fear AI, but to use these tools to operate as a one-person media company. If you're building a business this year, your edge is speed and leverage.`,
    mockOutput: {
      twitter_thread: `1/ How 1-person creators are replacing $100k video editing & marketing agencies using AI: 🧵

2/ 1. Video Editing AI (Descript / Submagic)
• Auto-cuts dead air instantly
• Generates dynamic animated captions
• Inserts contextual B-roll automatically
Saved: $4,000/month in editor retainer costs.

3/ 2. Automated Content Repurposing (EveryPosting)
• Paste 1 YouTube transcript
• Get Twitter threads, blog posts & LinkedIn captions
• 7 days of content generated in under 60 seconds.

4/ 3. Inbound AI Lead Scoring
• Feed inbound forms directly into Claude 3.5 Sonnet
• Instant lead qualification + personalized outreach drafts.

5/ The takeaway:
Your competitive edge in 2026 isn't headcount — it's leverage and execution speed.

6/ Hit RT if you found this valuable! 🔁`,
      blog_post: `# 5 AI Tools Replacing $100k Marketing Agencies in 2026

In 2026, solopreneurs and small creator teams are scaling faster than traditional agencies with 20 employees. The secret? High-leverage AI workflows.

## 1. AI-Powered Video Editing
Hiring a full-time editor used to cost upwards of $4,000 per month. With tools like **Descript** and **Submagic**, creators can automatically trim silence, apply captions, and render multi-platform clips in minutes.

## 2. Multi-Format Content Repurposing
Repurposing long-form YouTube transcripts into written content used to consume 15+ hours per week. Using tools like **EveryPosting**, creators generate Twitter threads, SEO blog articles, and LinkedIn updates from a single script transcript.

## 3. Automated Lead Qualification
Using advanced models like **Anthropic Claude 3.5 Sonnet**, incoming customer queries are automatically evaluated, scored, and drafted for fast human review.

### Conclusion
The goal of AI in 2026 isn't headcount reduction—it's supercharging individual creative output and execution speed.`,
    },
  },
  coach: {
    id: 'coach',
    title: 'Coaches & Consultants',
    subtitle: 'Turn client webinars & calls into high-converting LinkedIn posts & emails',
    badge: 'Consulting & B2B',
    color: 'from-pink-500 to-rose-600',
    accentGradient: 'bg-gradient-to-r from-pink-500/20 to-rose-500/20 border-pink-500/30',
    supportedFormats: [
      { id: 'linkedin_post', label: 'LinkedIn Thought Leadership', description: 'Authoritative post formatted for high engagement and client leads' },
      { id: 'blog_post', label: 'Newsletter / Client Email', description: 'Nurture email with strong story hook, lesson, and soft pitch' },
      { id: 'twitter_thread', label: 'Educational Thread', description: 'Step-by-step methodology breakdown establishing authority' },
      { id: 'quote_graphics', label: 'Framework & Quote Cards', description: 'Core principles formatted for carousel graphics' },
      { id: 'show_notes', label: 'Webinar Key Takeaways', description: 'Executive summary bullet points for webinar follow-up' },
    ],
    sampleTranscript: `Welcome to today's masterclass on High-Ticket Client Acquisition. I want to share the exact framework we used to help 14 executive coaches scale past $30k/month without running paid ads.

Step 1 is the 'Offer Clarification Framework'. Most consultants sell 'coaching sessions' or 'hourly access'. That is a death trap. High-value clients don't want hours; they want a specific transformational outcome. Instead of '12 weekly coaching calls', offer 'The 90-Day Executive Leadership Blueprint'.

Step 2 is 'The Asynchronous Value Mechanism'. Before jumping on a discovery call, send prospects a 7-minute personalized video breakdown auditing their current bottlenecks. This builds immediate authority and filters out tire-kickers.

Step 3 is 'Price with Confidence'. If your outcome generates $100,000 in enterprise value or saved executive stress, charging $10,000 for a 90-day program is a bargain. Frame price against ROI, not time spent.`,
    mockOutput: {
      linkedin_post: `Selling hourly coaching calls is a death trap. Here is how 14 executive coaches scaled to $30k/month without spending $1 on paid ads:

❌ Stop selling: "12 weekly coaching calls for $3,000"
✅ Start selling: "The 90-Day Executive Leadership Transformation for $10,000"

Here are the 3 pillars high-ticket clients actually pay for:

1. Transformational Outcome Framing
High-ticket buyers don't want your hours; they want a guaranteed result. Sell the destination, not the plane ticket.

2. The Asynchronous Audit
Before jumping on sales calls, send prospects a 7-minute audit identifying their core bottleneck. This builds instant authority.

3. Value-Based ROI Pricing
If your guidance delivers $100k in business value, a $10k investment is a no-brainer.

Are you still pricing your knowledge by the hour? Drop a comment below or DM me "TRANSFORM" for our 3-step blueprint.`,
      blog_post: `Subject: Why selling hourly coaching is holding your practice back

Hey [First Name],

If you are currently charging clients by the hour or selling "coaching packages", I have news for you:

You are capping your income and working twice as hard as you need to.

In our latest workshop, we unpacked how 14 executive coaches scaled past $30k/month without paid ads.

The main takeaway?

Shift from selling time to selling outcome certainty.

Instead of offering "12 weekly 1-on-1 sessions", offer "The 90-Day Executive Blueprint".

When you price based on business outcome ROI rather than hourly inputs, your closing rate increases and your client results soar.

Want to see the full breakdown? Check out our step-by-step masterclass here.

Best,
[Your Name]`,
    },
  },
};

export function buildSystemPrompt(
  niche: NicheType,
  selectedFormats: OutputFormat[],
  tone: ToneStyle = 'energetic',
  brandVoice?: string
): string {
  const nicheTitles: Record<NicheType, string> = {
    podcaster: 'Podcaster Content Repurposer (energetic, engaging, listener-oriented)',
    youtuber: 'YouTube & Social Video Strategist (hook-driven, viral formatting, sharp copy)',
    coach: 'Executive Coach & B2B Consultant Marketer (authoritative, high-value, outcome-focused)',
  };

  const toneInstructions: Record<ToneStyle, string> = {
    energetic: 'High energy, enthusiastic, punchy short sentences, engaging call-to-actions.',
    professional: 'Authoritative, polished, executive tone, data-backed insights, professional formatting.',
    viral: 'Strong curiosity-driven hooks, bold linebreaks, short punchy bullet points, optimized for shares & retweets.',
    storytelling: 'Narrative-driven, relatable personal lesson arc, emotional resonance, narrative conclusion.',
  };

  return `You are an expert ${nicheTitles[niche]}.
Your task is to analyze the provided long-form transcript and generate repurposed content for the requested formats: ${selectedFormats.join(
    ', '
  )}.

TONE SPECIFICATION: ${toneInstructions[tone]}
${brandVoice ? `CUSTOM BRAND VOICE RULES: ${brandVoice}` : ''}

CRITICAL OUTPUT REQUIREMENTS:
1. Tone & Voice: Match the exact style and conventions of a top-tier ${niche} content creator.
2. Return format: Return ONLY valid, raw JSON (no markdown triple backticks around the JSON, no preamble, no explanatory text).
3. The JSON object keys MUST match the requested format strings exactly.
Example output shape:
{
  ${selectedFormats.map((f) => `"${f}": "Generated text content formatted with clean markdown linebreaks..."`).join(',\n  ')}
}

Make the content punchy, high-converting, and immediately ready to post!`;
}
