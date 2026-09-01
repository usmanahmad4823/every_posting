import Anthropic from '@anthropic-ai/sdk';
import { GenerationRequest, OutputFormat } from './types';
import { buildSystemPrompt, NICHE_CONFIGS } from './prompts';

export async function generateContentWithClaude(
  request: GenerationRequest
): Promise<Record<string, string>> {
  // Use user's custom API key if provided, or environment variable, or fallback to mock
  const apiKey = request.customApiKey || process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey.includes('xxxx') || apiKey === 'sk-ant-api03-xxxx-xxxx-xxxx') {
    return generateMockResponse(request);
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const systemPrompt = buildSystemPrompt(
      request.niche,
      request.selectedFormats,
      request.tone || 'energetic',
      request.brandVoice
    );

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Here is the transcript to repurpose:\n\n${request.transcript}\n\nGenerate requested formats: ${request.selectedFormats.join(
            ', '
          )}`,
        },
      ],
    });

    const responseText = message.content[0]?.type === 'text' ? message.content[0].text : '';

    // Clean up potential markdown formatting wrappers if model adds any
    const cleanedText = responseText
      .replace(/^```json\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    const parsedJson = JSON.parse(cleanedText);
    return parsedJson;
  } catch (error) {
    console.warn('Anthropic API Call Warning / Fallback to Demo Mode Generator:', error);
    return generateMockResponse(request);
  }
}

function generateMockResponse(request: GenerationRequest): Record<string, string> {
  const nicheConfig = NICHE_CONFIGS[request.niche];
  const results: Record<string, string> = {};

  const transcriptSnippet = request.transcript.slice(0, 120);

  request.selectedFormats.forEach((format: OutputFormat) => {
    if (nicheConfig.mockOutput[format]) {
      results[format] = nicheConfig.mockOutput[format]!;
    } else {
      results[format] = `### Repurposed ${format.replace('_', ' ').toUpperCase()} (${nicheConfig.title})

Tone: ${request.tone || 'Energetic & Punchy'}

Based on your transcript starting with: "${transcriptSnippet}..."

1. **Core Insight**: High-impact strategy extracted from transcript.
2. **Actionable Takeaway**: Execute high-leverage marketing actions for ${request.niche}.
3. **Key Call to Action**: Follow EveryPosting for more AI-powered content repurposing!`;
    }
  });

  return results;
}
