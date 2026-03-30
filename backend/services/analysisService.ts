import axios from 'axios';
import { AnalysisResultType } from '../types/index.js';
import env from '../utils/Env.js';

const OLLAMA_URL = env.OLLAMA_URL || 'http://localhost:11434';
const prompt = `
You are a senior telecom Quality Assurance (QA) supervisor.

Your job is to evaluate the AGENT's performance in the following customer support call transcript.

IMPORTANT INSTRUCTIONS:

1. The transcript contains two voices: one is the AGENT (customer support representative), and the other is the CUSTOMER.
2. You must first determine which speaker is the AGENT based on:
   - Who greets first
   - Who provides help or solutions
   - Who follows company policy
   - Who responds to issues
3. Evaluate ONLY the AGENT.
4. Do NOT evaluate the customer.
5. Be strict but fair.
6. Score must reflect professionalism, empathy, clarity, and problem-solving.

SCORING CRITERIA:
- 1-3: Poor performance (rude, unhelpful, unprofessional)
- 4-6: Average performance (basic help but lacks empathy or clarity)
- 7-8: Good performance (clear, polite, helpful)
- 9-10: Excellent performance (empathetic, proactive, highly professional)

Before giving score:
- Evaluate tone
- Evaluate empathy
- Evaluate clarity

Then assign score strictly based on criteria

ANALYZE:
- Tone and professionalism
- Empathy shown
- Clarity of explanation
- Ability to handle customer frustration
- Whether proper steps were followed
- If information is unclear, say unclear

Return STRICT JSON only. No explanation. No markdown.

{
  "summary": "brief 4-5 sentence summary of the call",
  "category": "billing_issue | technical_support | account_issue | general_query | other",
  "sentiment": "Positive | Neutral | Negative",
  "score": number,
  "improvements": ["specific actionable feedback for the agent"]
}


`;

class AnalysisService {
  analyzeTranscript = async (transcript: string): Promise<AnalysisResultType> => {
    try {
      const response = await axios.post(`${OLLAMA_URL}/api/generate`, {
        model: 'llama',
        prompt: `${prompt}Transcript:"""${transcript}"""`,
        stream: false,
        format: 'json',
        options: {
          temperature: 0.1,
          top_p: 0.9,
          num_predict: 250,
        },
      });

      const rawText = response.data.response;

      // Try extracting JSON from response
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error('Invalid JSON response from model');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      console.log(parsed);

      return {
        summary: parsed.summary,
        category: parsed.category,
        sentiment: parsed.sentiment,
        score: parsed.score,
        improvements: parsed.improvements,
      };
    } catch (error: any) {
      console.error('Ollama analysis error:', error);

      // fallback safe result
      return {
        summary: transcript.slice(0, 200),
        category: 'unknown',
        sentiment: 'Neutral',
        score: 5,
        improvements: ['Model failed to analyze properly'],
      };
    }
  };
}

export default new AnalysisService();
