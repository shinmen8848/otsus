interface GLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface PhotoAnalysis {
  tags: string[];
  category: string;
  mood: string;
  description: string;
  suggestions: string[];
}

interface RelationshipInsight {
  type: 'celebration' | 'suggestion' | 'memory' | 'improvement';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

// Enhanced AI interfaces for multi-modal capabilities
interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}

interface ConversationContext {
  userId?: string;
  relationshipData?: {
    startDate: string;
    milestones: string[];
    recentActivities: string[];
    emotionalState?: string;
  };
  conversationHistory: AIMessage[];
  preferences: {
    tone: 'romantic' | 'casual' | 'professional';
    language: 'english' | 'chinese' | 'japanese';
    responseLength: 'short' | 'medium' | 'long';
  };
}

interface AIResponse {
  content: string;
  confidence: number;
  metadata: {
    model: string;
    tokens: number;
    processingTime: number;
  };
}

interface ContextMemory {
  type: 'short_term' | 'long_term' | 'episodic' | 'semantic';
  key: string;
  value: unknown;
  importance: number;
  lastAccessed: Date;
  createdAt: Date;
}

// Export types for use in other modules
export type { ConversationContext, AIMessage, AIResponse, ContextMemory };

// Enhanced AI Service with multi-modal capabilities
export class EnhancedAIService {
  private chutesApiKey: string;
  private chutesApiUrl: string;
  private chutesModel: string;
  private glmApiKey: string;
  private glmApiUrl: string;
  private gptApiKey?: string;
  private contextMemory: Map<string, ContextMemory> = new Map();
  private conversationContexts: Map<string, ConversationContext> = new Map();

  constructor() {
    this.chutesApiKey = import.meta.env.VITE_CHUTES_API_KEY || '';
    this.chutesApiUrl = 'https://llm.chutes.ai/v1/chat/completions';
    this.chutesModel = 'zai-org/GLM-4.5-Air';
    this.glmApiKey = import.meta.env.VITE_GLM_API_KEY || '';
    this.glmApiUrl = import.meta.env.VITE_GLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/';
    this.gptApiKey = import.meta.env.VITE_OPENAI_API_KEY;
  }

  // Context Management
  setConversationContext(sessionId: string, context: ConversationContext): void {
    this.conversationContexts.set(sessionId, context);
  }

  getConversationContext(sessionId: string): ConversationContext | undefined {
    return this.conversationContexts.get(sessionId);
  }

  // Context Memory Management
  storeMemory(memory: Omit<ContextMemory, 'lastAccessed' | 'createdAt'>): void {
    const fullMemory: ContextMemory = {
      ...memory,
      lastAccessed: new Date(),
      createdAt: new Date()
    };
    this.contextMemory.set(memory.key, fullMemory);
  }

  retrieveMemory(key: string): ContextMemory | undefined {
    const memory = this.contextMemory.get(key);
    if (memory) {
      memory.lastAccessed = new Date();
      return memory;
    }
    return undefined;
  }

  // Multi-modal AI Model Selection
  private selectAIModel(query: string, context?: ConversationContext): 'chutes' | 'glm' | 'gpt' {
    // Prioritize Chutes AI as the primary model
    if (this.chutesApiKey) {
      return 'chutes'; // Chutes AI for all conversations
    }

    // Fallback to other models if Chutes AI is not available
    if (context?.preferences.language === 'chinese' || query.includes('中文')) {
      return 'glm'; // GLM for Chinese language
    }

    if (query.length > 500 || (context?.conversationHistory && context.conversationHistory.length > 10)) {
      // For complex reasoning, fall back to GPT if available, otherwise GLM
      return this.gptApiKey ? 'gpt' : 'glm';
    }

    if (this.gptApiKey) {
      return 'gpt'; // GPT for general conversation
    }

    return 'glm'; // Default to GLM
  }

  // Enhanced NLP Processor
  private processIntent(query: string): {
    intent: string;
    entities: Record<string, unknown>;
    sentiment: 'positive' | 'neutral' | 'negative';
  } {
    // Simple NLP processing - in production, use more sophisticated NLP libraries
    const lowerQuery = query.toLowerCase();

    let intent = 'general_conversation';
    const entities: Record<string, unknown> = {};

    // Intent recognition
    if (lowerQuery.includes('date') || lowerQuery.includes('plan')) {
      intent = 'date_planning';
    } else if (lowerQuery.includes('photo') || lowerQuery.includes('memory')) {
      intent = 'memory_discussion';
    } else if (lowerQuery.includes('anniversary') || lowerQuery.includes('celebrate')) {
      intent = 'celebration_planning';
    }

    // Entity extraction
    const dateMatch = query.match(/\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}/);
    if (dateMatch) {
      entities.date = dateMatch[0];
    }

    // Sentiment analysis (simplified)
    const positiveWords = ['love', 'happy', 'excited', 'wonderful', 'amazing'];
    const negativeWords = ['sad', 'worried', 'stressed', 'difficult', 'problem'];

    const positiveCount = positiveWords.filter(word => lowerQuery.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerQuery.includes(word)).length;

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    if (negativeCount > positiveCount) sentiment = 'negative';

    return { intent, entities, sentiment };
  }

  // Context Enrichment
  private enrichContext(query: string, context?: ConversationContext): string {
    let enrichedPrompt = query;

    if (context?.relationshipData) {
      enrichedPrompt = `
Relationship Context:
- Started: ${context.relationshipData.startDate}
- Recent activities: ${context.relationshipData.recentActivities.join(', ')}
- Current emotional state: ${context.relationshipData.emotionalState || 'happy'}

User Query: ${query}
      `;
    }

    // Add conversation history for better context
    if (context?.conversationHistory && context.conversationHistory.length > 0) {
      const recentHistory = context.conversationHistory.slice(-5);
      enrichedPrompt = `
Recent Conversation:
${recentHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

${enrichedPrompt}
      `;
    }

    return enrichedPrompt;
  }

  // Multi-model AI Request Handler
  private async makeAIRequest(
    model: 'chutes' | 'glm' | 'gpt',
    messages: AIMessage[],
    context?: ConversationContext
  ): Promise<AIResponse> {
    const startTime = Date.now();

    switch (model) {
      case 'chutes':
        return await this.makeChutesRequest(messages, context);

      case 'glm':
        return await this.makeGLMRequest(messages, context);

      case 'gpt':
        return await this.makeGPTRequest(messages, context);

      default:
        throw new Error(`Unsupported AI model: ${model}`);
    }
  }

  private async makeGLMRequest(messages: AIMessage[], context?: ConversationContext): Promise<AIResponse> {
    if (!this.glmApiKey) {
      throw new Error('GLM API key not configured');
    }

    const lastMessage = messages[messages.length - 1];
    const enrichedContent = context ? this.enrichContext(lastMessage.content, context) : lastMessage.content;

    const startTime = Date.now();
    const response = await fetch(`${this.glmApiUrl}chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.glmApiKey}`,
      },
      body: JSON.stringify({
        model: 'glm-4-air',
        messages: [
          {
            role: 'system',
            content: 'You are a romantic AI assistant helping couples enhance their relationship. Provide thoughtful, loving, and personalized suggestions. Always respond in a warm, caring tone. Consider the relationship context and conversation history when responding.'
          },
          {
            role: 'user',
            content: enrichedContent
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`GLM API error: ${response.statusText}`);
    }

    const data: GLMResponse = await response.json();
    const processingTime = Date.now() - startTime;

    return {
      content: data.choices[0]?.message?.content || '',
      confidence: 0.8,
      metadata: {
        model: 'glm-4-air',
        tokens: data.choices[0]?.message?.content?.length || 0,
        processingTime
      }
    };
  }

  private async makeGPTRequest(messages: AIMessage[], context?: ConversationContext): Promise<AIResponse> {
    if (!this.gptApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const lastMessage = messages[messages.length - 1];
    const enrichedContent = context ? this.enrichContext(lastMessage.content, context) : lastMessage.content;

    const startTime = Date.now();
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.gptApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a romantic AI assistant helping couples enhance their relationship. Provide thoughtful, loving, and personalized suggestions.'
          },
          {
            role: 'user',
            content: enrichedContent
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;

    return {
      content: data.choices[0]?.message?.content || '',
      confidence: 0.85,
      metadata: {
        model: 'gpt-4',
        tokens: data.usage?.total_tokens || 0,
        processingTime
      }
    };
  }

  private async makeChutesRequest(messages: AIMessage[], context?: ConversationContext): Promise<AIResponse> {
    if (!this.chutesApiKey) {
      throw new Error('Chutes AI API key not configured');
    }

    const lastMessage = messages[messages.length - 1];
    const enrichedContent = context ? this.enrichContext(lastMessage.content, context) : lastMessage.content;

    const startTime = Date.now();
    const response = await fetch(this.chutesApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.chutesApiKey}`,
      },
      body: JSON.stringify({
        model: this.chutesModel,
        messages: [
          {
            role: 'system',
            content: 'You are a romantic AI assistant helping couples enhance their relationship. Provide thoughtful, loving, and personalized suggestions. Always respond in a warm, caring tone. Consider the relationship context and conversation history when responding.'
          },
          {
            role: 'user',
            content: enrichedContent
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Chutes AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const processingTime = Date.now() - startTime;

    return {
      content: data.choices[0]?.message?.content || '',
      confidence: 0.85,
      metadata: {
        model: this.chutesModel,
        tokens: (data as { usage?: { total_tokens?: number } }).usage?.total_tokens || data.choices[0]?.message?.content?.length || 0,
        processingTime
      }
    };
  }

  private async makeClaudeRequest(messages: AIMessage[], context?: ConversationContext): Promise<AIResponse> {
    // Placeholder for Claude integration
    throw new Error('Claude integration not yet implemented');
  }

  // Main chat method
  async chat(message: string, sessionId: string, context?: ConversationContext): Promise<AIResponse> {
    try {
      // Process intent and enrich context
      const { intent, entities, sentiment } = this.processIntent(message);

      // Store user message in context
      const userMessage: AIMessage = {
        role: 'user',
        content: message,
        metadata: { intent, entities, sentiment }
      };

      // Get or create conversation context
      let conversationContext = context || this.getConversationContext(sessionId);
      if (!conversationContext) {
        conversationContext = {
          conversationHistory: [],
          preferences: {
            tone: 'romantic',
            language: 'english',
            responseLength: 'medium'
          }
        };
      }

      // Add message to history
      conversationContext.conversationHistory.push(userMessage);

      // Select appropriate AI model
      const selectedModel = this.selectAIModel(message, conversationContext);

      // Make AI request
      const response = await this.makeAIRequest(selectedModel, conversationContext.conversationHistory, conversationContext);

      // Store AI response in context
      const assistantMessage: AIMessage = {
        role: 'assistant',
        content: response.content,
        metadata: response.metadata
      };
      conversationContext.conversationHistory.push(assistantMessage);

      // Update conversation context
      this.setConversationContext(sessionId, conversationContext);

      // Store important information in memory
      if (sentiment === 'positive' || intent !== 'general_conversation') {
        this.storeMemory({
          type: 'episodic',
          key: `${sessionId}_${Date.now()}`,
          value: {
            message,
            response: response.content,
            intent,
            sentiment
          },
          importance: sentiment === 'positive' ? 0.7 : 0.5
        });
      }

      return response;
    } catch (error) {
      console.error('Enhanced AI Service Error:', error);
      throw error;
    }
  }

  // Learning and personalization methods
  async learnFromInteraction(interaction: {
    userMessage: string;
    aiResponse: string;
    userFeedback?: 'positive' | 'negative' | 'neutral';
    context: ConversationContext;
  }): Promise<void> {
    // Store learning data for future personalization
    const learningKey = `learning_${interaction.context.userId}_${Date.now()}`;

    this.storeMemory({
      type: 'long_term',
      key: learningKey,
      value: {
        userMessage: interaction.userMessage,
        aiResponse: interaction.aiResponse,
        feedback: interaction.userFeedback,
        context: {
          relationshipData: interaction.context.relationshipData,
          preferences: interaction.context.preferences
        }
      },
      importance: interaction.userFeedback === 'positive' ? 0.8 : 0.4
    });
  }
}

// Legacy GLMAIService for backward compatibility
export class GLMAIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GLM_API_KEY || '';
    this.apiUrl = import.meta.env.VITE_GLM_API_URL || 'https://open.bigmodel.cn/api/paas/v4/';
  }

  private async makeRequest(prompt: string, maxTokens: number = 1000): Promise<string> {
    if (!this.apiKey) {
      throw new Error('GLM API key not configured');
    }

    try {
      const response = await fetch(`${this.apiUrl}chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'glm-4-air',
          messages: [
            {
              role: 'system',
              content: 'You are a romantic AI assistant helping couples enhance their relationship. Provide thoughtful, loving, and personalized suggestions. Always respond in a warm, caring tone.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`GLM API error: ${response.statusText}`);
      }

      const data: GLMResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('GLM AI Service Error:', error);
      throw error;
    }
  }

  async analyzePhoto(photoData: {
    title: string;
    description?: string;
    date: string;
    location?: string;
    existingTags: string[];
  }): Promise<PhotoAnalysis> {
    const prompt = `
    Analyze this romantic photo from a couple's journey:
    
    Title: ${photoData.title}
    Description: ${photoData.description || 'No description provided'}
    Date: ${photoData.date}
    Location: ${photoData.location || 'No location provided'}
    Current tags: ${photoData.existingTags.join(', ') || 'None'}
    
    Please provide:
    1. 3-5 relevant tags for better organization
    2. A category (dates, travel, milestones, everyday, special_moments)
    3. The mood/emotion of the photo (happy, romantic, adventurous, peaceful, nostalgic, etc.)
    4. A brief romantic description (1-2 sentences)
    5. 2-3 suggestions for how this memory could inspire future activities
    
    Format your response as JSON with fields: tags, category, mood, description, suggestions
    `;

    try {
      const response = await this.makeRequest(prompt);
      return JSON.parse(response);
    } catch (error) {
      // Fallback analysis if AI fails
      return {
        tags: [...photoData.existingTags, 'memory'],
        category: 'everyday',
        mood: 'happy',
        description: 'A beautiful moment captured in time.',
        suggestions: ['Create more memories like this', 'Visit this location again']
      };
    }
  }

  async generateRelationshipInsights(data: {
    relationshipDays: number;
    recentPhotos: number;
    journalEntries: number;
    sharedActivities: string[];
    lastMilestone?: string;
  }): Promise<RelationshipInsight[]> {
    const prompt = `
    Generate relationship insights for a couple with the following data:
    
    Days together: ${data.relationshipDays}
    Recent photos: ${data.recentPhotos}
    Journal entries: ${data.journalEntries}
    Shared activities: ${data.sharedActivities.join(', ')}
    Last milestone: ${data.lastMilestone || 'None recorded'}
    
    Provide 3-4 insights including:
    1. A celebration of their journey
    2. A suggestion for creating new memories
    3. A recommendation for deepening their connection
    4. An idea for an upcoming milestone or activity
    
    Each insight should have: type, title, content (2-3 sentences), priority, actionable (boolean)
    Format as JSON array.
    `;

    try {
      const response = await this.makeRequest(prompt);
      return JSON.parse(response);
    } catch (error) {
      // Fallback insights
      return [
        {
          type: 'celebration',
          title: 'Celebrating Your Journey',
          content: `Amazing! You've been together for ${data.relationshipDays} days. Your love story continues to grow stronger with each passing moment.`,
          priority: 'high',
          actionable: false
        },
        {
          type: 'suggestion',
          title: 'Create New Memories',
          content: 'Consider planning a special photo session or visit a new place together to add fresh memories to your collection.',
          priority: 'medium',
          actionable: true
        }
      ];
    }
  }

  async suggestDateIdeas(preferences: {
    location: 'indoor' | 'outdoor' | 'any';
    budget: 'low' | 'medium' | 'high';
    mood: 'romantic' | 'adventurous' | 'relaxing' | 'cultural';
    previousDates: string[];
  }): Promise<string[]> {
    const prompt = `
    Suggest 5 creative date ideas based on these preferences:
    
    Location preference: ${preferences.location}
    Budget: ${preferences.budget}
    Desired mood: ${preferences.mood}
    Previous dates they've enjoyed: ${preferences.previousDates.join(', ')}
    
    Provide unique, thoughtful date ideas that would create lasting memories. 
    Consider the couple's history and suggest activities that build on their interests.
    Format as a simple array of strings, each being a complete date idea.
    `;

    try {
      const response = await this.makeRequest(prompt);
      return JSON.parse(response);
    } catch (error) {
      // Fallback suggestions
      const fallbackIdeas = {
        romantic: ['Candlelit dinner at home', 'Sunset picnic', 'Star gazing'],
        adventurous: ['Hiking trail exploration', 'Cooking challenge', 'Mini road trip'],
        relaxing: ['Spa day at home', 'Movie marathon', 'Garden visit'],
        cultural: ['Museum visit', 'Art gallery tour', 'Local theater show']
      };
      return fallbackIdeas[preferences.mood] || fallbackIdeas.romantic;
    }
  }

  async generateAnniversaryMessage(data: {
    monthsOrYears: number;
    isYears: boolean;
    specialMemories: string[];
    personalizedDetails: string[];
  }): Promise<string> {
    const timeUnit = data.isYears ? 'year' : 'month';
    const timeValue = data.monthsOrYears;
    
    const prompt = `
    Write a heartfelt anniversary message for a couple celebrating ${timeValue} ${timeUnit}${timeValue !== 1 ? 's' : ''} together.
    
    Include references to:
    - Special memories: ${data.specialMemories.join(', ')}
    - Personal details: ${data.personalizedDetails.join(', ')}
    
    Make it warm, personal, and celebratory. Keep it 2-3 paragraphs.
    The message should feel genuine and specific to their relationship.
    `;

    try {
      const response = await this.makeRequest(prompt);
      return response;
    } catch (error) {
      return `Happy ${timeValue} ${timeUnit}${timeValue !== 1 ? 's' : ''} anniversary! Your love story continues to inspire and grow stronger with each passing day. Here's to many more beautiful memories together! 💕`;
    }
  }

  async organizePhotos(photos: Array<{
    id: string;
    title: string;
    description?: string;
    date: string;
    tags: string[];
  }>): Promise<Record<string, string[]>> {
    const prompt = `
    Help organize these photos into meaningful albums for a couple:

    Photos:
    ${photos.map(p => `- ${p.title} (${p.date}) - Tags: ${p.tags.join(', ')}`).join('\n')}

    Suggest album categories and which photos belong in each.
    Create romantic, meaningful album names.
    Format as JSON object where keys are album names and values are arrays of photo IDs.
    `;

    try {
      const response = await this.makeRequest(prompt, 1500);
      return JSON.parse(response);
    } catch (error) {
      // Fallback organization by date
      const albumsByYear: Record<string, string[]> = {};
      photos.forEach(photo => {
        const year = new Date(photo.date).getFullYear().toString();
        const albumName = `Memories from ${year}`;
        if (!albumsByYear[albumName]) {
          albumsByYear[albumName] = [];
        }
        albumsByYear[albumName].push(photo.id);
      });
      return albumsByYear;
    }
  }

  // Enhanced methods for context-aware responses
  async generateProactiveSuggestions(context: ConversationContext): Promise<string[]> {
    const prompt = `
    Based on this couple's relationship context, generate 3-5 proactive suggestions:

    Relationship started: ${context.relationshipData?.startDate}
    Recent activities: ${context.relationshipData?.recentActivities?.join(', ')}
    Emotional state: ${context.relationshipData?.emotionalState}
    Communication patterns: ${context.conversationHistory.slice(-10).map(m => `${m.role}: ${m.content}`).join('\n')}

    Generate personalized, actionable suggestions that would enhance their relationship.
    Focus on their interests and current emotional state.
    Format as a simple array of strings.
    `;

    try {
      const response = await this.makeRequest(prompt);
      return JSON.parse(response);
    } catch (error) {
      return [
        'Plan a special date night based on your shared interests',
        'Create a new memory by trying something new together',
        'Express appreciation for each other through small gestures'
      ];
    }
  }

  // Learning method moved to EnhancedAIService
}

export const aiService = new GLMAIService();
export const enhancedAIService = new EnhancedAIService();