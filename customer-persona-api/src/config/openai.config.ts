import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      console.warn('OpenAI API key not found. AI features will not work properly.');
    }

    this.openai = new OpenAI({
      apiKey: apiKey || 'dummy-key',
    });
  }

  async generatePersona(companyName: string, characteristics: string[], knowledgeDomain?: string, problemToSolve?: string) {
    try {
      // Create a prompt that includes knowledge domain and problem if provided
      let userPrompt = `Create a customer persona that need to use a service/product for a company named "${companyName}" with the following characteristics: ${characteristics.join(', ')}. 
      Include name, age, gender, location, job title, interests, challenges, and an initial challenge message related to a company's products/services topic and what do you need information about.`;

      // Add specific knowledge domain if provided
      if (knowledgeDomain) {
        userPrompt += `\nThe persona should have specific knowledge about: ${knowledgeDomain}.`;
      }

      // Add specific problem if provided
      if (problemToSolve) {
        userPrompt += `\nThe persona should be trying to solve this specific problem: ${problemToSolve}.`;
      }

      userPrompt += `\nInclude knowledgeDomain and problemToSolve fields in the response.
      Format the response as valid JSON.`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
          {
            role: 'system',
            content: 'You are an AI that creates detailed customer personas based on company information.',
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        response_format: { type: 'json_object' },
      });
      console.log('OpenAI response:', response.choices[0].message.content);

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating persona with OpenAI:', error);
      throw new Error('Failed to generate persona');
    }
  }

  async generateChatResponse(
    persona: any,
    companyName: string,
    userMessage: string,
    conversationHistory: Array<{ role: string; content: string }>,
  ) {
    try {
      // Validate persona object to ensure it has all required fields
      const validatedPersona = {
        ...persona,
        name: persona.name || 'Customer',
        age: persona.age || 30,
        gender: persona.gender || 'Not specified',
        location: persona.location || 'Remote',
        jobTitle: persona.jobTitle || 'Professional',
        interests: Array.isArray(persona.interests) ? persona.interests : ['Technology'],
        challenges: Array.isArray(persona.challenges) ? persona.challenges : ['Finding solutions'],
        knowledgeDomain: persona.knowledgeDomain || 'relevant industry topics',
        problemToSolve: persona.problemToSolve || 'finding the right solution'
      };

      // Create a detailed system prompt based on persona details
      const systemPrompt = this.createPersonaSystemPrompt(validatedPersona, companyName);

      // Format conversation history for the AI, ensuring all messages have content
      const messages: ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...conversationHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content || 'No content provided',
        })),
        { role: 'user', content: userMessage || 'Hello' },
      ];

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4.1',
        messages,
        response_format: { type: "text" },
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating chat response with OpenAI:', error);
      throw new Error('Failed to generate chat response');
    }
  }

  private createPersonaSystemPrompt(persona: any, companyName: string): string {
    // Extract all relevant persona details with safe defaults
    const { name, age, gender, location, interests = [], challenges = [], knowledgeDomain, problemToSolve, temporaryContext } = persona;

    // Use a default job title if it's missing to prevent null reference errors
    const jobTitle = persona.jobTitle || 'professional';

    // Build a comprehensive system prompt
    let prompt = `You are ${name}, a ${age}-year-old ${gender} ${jobTitle} from ${location}. 
    
When responding, use Markdown formatting for better readability:
- Use **bold** for emphasis
- Use *italics* for subtle emphasis
- Use bullet points for lists
- Use numbered lists for sequential items
- Use \`code\` for technical terms
- Use > for quotes or important points

PERSONALITY & BACKGROUND:
- You have the following interests: ${Array.isArray(interests) ? interests.join(', ') : 'various topics'}
- You face these challenges: ${Array.isArray(challenges) ? challenges.join(', ') : 'finding the right solutions'}
- You have specific knowledge about: ${knowledgeDomain || 'your professional field and interests'}
- You're currently trying to solve this problem: ${problemToSolve || (Array.isArray(challenges) && challenges.length > 0 ? challenges[0] : 'finding the right solution')}

INTERACTION STYLE:
- You're talking to a representative from ${companyName}
- You're curious but also critical - you want to make sure their solutions actually address your needs
- You're replying in a friendly, conversational tone and short sentences as if you were talking to a friend, not a robot, 3 sentences at a time max
- You ask for clarifications when you don't understand something
- You share your thoughts and feelings about the conversation
- You ask thoughtful follow-up questions based on your knowledge domain
- You respond naturally as a real person would, with occasional hesitations or clarifying questions
- You maintain a consistent personality throughout the conversation
- You refer to your background, experiences, and specific problem when relevant`;

    // Add any temporary context if provided
    if (temporaryContext) {
      prompt += `\n\nADDITIONAL CONTEXT:\n${temporaryContext}`;
    }

    prompt += `\n\nYour goal is to have a fluid, realistic conversation where you're trying to determine if ${companyName}'s products or services can help solve your specific problem. Be conversational, not robotic.`;

    return prompt;
  }
}