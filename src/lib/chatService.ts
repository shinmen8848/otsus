import { enhancedAIService, type ConversationContext, type AIMessage, type AIResponse } from './ai';
import { supabase } from './supabase';

// Chat Service Components as per design document

interface ContextMemoryItem {
  id: string;
  user_id: string;
  context_type: string;
  context_key: string;
  context_value: unknown;
  importance_score: number;
  last_accessed: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  messageType: 'text' | 'image' | 'system';
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  userId?: string;
  sessionId: string;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface ChatSession {
  conversation: Conversation;
  context: ConversationContext;
  messages: ChatMessage[];
}

// Message Handler - Handles incoming messages and coordinates processing
export class MessageHandler {
  private contextBuilder: ContextBuilder;
  private responseGenerator: ResponseGenerator;
  private safetyModeration: SafetyModeration;

  constructor() {
    this.contextBuilder = new ContextBuilder();
    this.responseGenerator = new ResponseGenerator();
    this.safetyModeration = new SafetyModeration();
  }

  async processMessage(
    message: string,
    sessionId: string,
    userId?: string
  ): Promise<{ response: AIResponse; conversation: Conversation }> {
    try {
      console.log('[DEBUG] MessageHandler.processMessage called with:', { message, sessionId, userId });

      // 1. Safety check
      const isSafe = await this.safetyModeration.checkMessage(message);
      console.log('[DEBUG] Safety check result:', isSafe);
      if (!isSafe) {
        throw new Error('Message failed safety check');
      }

      // 2. Get or create conversation
      console.log('[DEBUG] Getting/creating conversation...');
      let conversation = await ConversationManager.getOrCreateConversation(sessionId, userId);
      console.log('[DEBUG] Conversation:', conversation);

      // 3. Build context
      console.log('[DEBUG] Building context...');
      const context = await this.contextBuilder.buildContext(sessionId, userId);
      console.log('[DEBUG] Context built:', context);

      // 4. Generate response
      console.log('[DEBUG] Generating response...');
      const response = await this.responseGenerator.generate(message, sessionId, context);
      console.log('[DEBUG] Response generated:', response);

      // 5. Store messages
      console.log('[DEBUG] Storing messages...');
      await this.storeMessage(conversation.id, 'user', message);
      await this.storeMessage(conversation.id, 'assistant', response.content, response.metadata);

      // 6. Update conversation
      console.log('[DEBUG] Updating conversation...');
      conversation = await ConversationManager.updateConversation(conversation.id);

      return { response, conversation };
    } catch (error) {
      console.error('[DEBUG] MessageHandler Error:', error);
      throw error;
    }
  }

  private async storeMessage(
    conversationId: string,
    role: 'user' | 'assistant' | 'system',
    content: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const { error } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        metadata
      });

    if (error) {
      throw new Error(`Failed to store message: ${error.message}`);
    }
  }
}

// Conversation Manager - Manages conversation lifecycle
export class ConversationManager {
  static async getOrCreateConversation(sessionId: string, userId?: string): Promise<Conversation> {
    // Try to find existing conversation
    const { data: existing, error: fetchError } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('session_id', sessionId)
      .eq('is_active', true)
      .single();

    if (existing && !fetchError) {
      return {
        id: existing.id,
        userId: existing.user_id,
        sessionId: existing.session_id,
        title: existing.title,
        createdAt: new Date(existing.created_at),
        updatedAt: new Date(existing.updated_at),
        isActive: existing.is_active
      };
    }

    // Create new conversation
    const { data: newConversation, error: createError } = await supabase
      .from('ai_conversations')
      .insert({
        user_id: userId,
        session_id: sessionId,
        title: 'New Conversation'
      })
      .select()
      .single();

    if (createError) {
      throw new Error(`Failed to create conversation: ${createError.message}`);
    }

    return {
      id: newConversation.id,
      userId: newConversation.user_id,
      sessionId: newConversation.session_id,
      title: newConversation.title,
      createdAt: new Date(newConversation.created_at),
      updatedAt: new Date(newConversation.updated_at),
      isActive: newConversation.is_active
    };
  }

  static async getConversationMessages(conversationId: string, limit: number = 50): Promise<ChatMessage[]> {
    const { data, error } = await supabase
      .from('ai_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch messages: ${error.message}`);
    }

    return data.map(msg => ({
      id: msg.id,
      conversationId: msg.conversation_id,
      role: msg.role as 'user' | 'assistant' | 'system',
      content: msg.content,
      messageType: (msg.message_type as 'text' | 'image' | 'system') || 'text',
      metadata: msg.metadata,
      createdAt: new Date(msg.created_at)
    }));
  }

  static async updateConversation(conversationId: string): Promise<Conversation> {
    const { data, error } = await supabase
      .from('ai_conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update conversation: ${error.message}`);
    }

    return {
      id: data.id,
      userId: data.user_id,
      sessionId: data.session_id,
      title: data.title,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      isActive: data.is_active
    };
  }

  static async getUserConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('ai_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch conversations: ${error.message}`);
    }

    return data.map(conv => ({
      id: conv.id,
      userId: conv.user_id,
      sessionId: conv.session_id,
      title: conv.title,
      createdAt: new Date(conv.created_at),
      updatedAt: new Date(conv.updated_at),
      isActive: conv.is_active
    }));
  }
}

// Context Builder - Builds conversation context from various sources
export class ContextBuilder {
  async buildContext(sessionId: string, userId?: string): Promise<ConversationContext> {
    const context: ConversationContext = {
      userId,
      conversationHistory: [],
      preferences: {
        tone: 'romantic',
        language: 'english',
        responseLength: 'medium'
      }
    };

    // Get conversation history
    const conversation = await ConversationManager.getOrCreateConversation(sessionId, userId);
    const messages = await ConversationManager.getConversationMessages(conversation.id, 20);

    context.conversationHistory = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      metadata: msg.metadata
    }));

    // Get relationship data
    if (userId) {
      context.relationshipData = await this.getRelationshipData(userId);
    }

    // Get user preferences from context memory
    if (userId) {
      context.preferences = await this.getUserPreferences(userId);
    }

    return context;
  }

  private async getRelationshipData(userId: string): Promise<ConversationContext['relationshipData']> {
    // Fetch relationship data from existing tables
    const { data: relationshipData, error } = await supabase
      .from('relationship_data')
      .select('*')
      .single();

    if (error) {
      console.warn('Failed to fetch relationship data:', error);
      return undefined;
    }

    // Get recent activities from memories
    const { data: recentMemories } = await supabase
      .from('memories')
      .select('title, date')
      .order('date', { ascending: false })
      .limit(5);

    return {
      startDate: relationshipData.start_date,
      milestones: relationshipData.milestones || [],
      recentActivities: recentMemories?.map(m => m.title) || [],
      emotionalState: 'happy' // This could be derived from various sources
    };
  }

  private async getUserPreferences(userId: string): Promise<ConversationContext['preferences']> {
    // Get preferences from context memory
    const { data: preferences } = await supabase
      .from('ai_context_memory')
      .select('context_value')
      .eq('user_id', userId)
      .eq('context_type', 'preferences')
      .eq('context_key', 'user_preferences')
      .single();

    if (preferences?.context_value) {
      return preferences.context_value as ConversationContext['preferences'];
    }

    return {
      tone: 'romantic',
      language: 'english',
      responseLength: 'medium'
    };
  }
}

// Response Generator - Coordinates AI model selection and response generation
export class ResponseGenerator {
  async generate(message: string, sessionId: string, context: ConversationContext): Promise<AIResponse> {
    try {
      // Use the enhanced AI service to generate response
      const response = await enhancedAIService.chat(message, sessionId, context);

      // Learn from the interaction for future personalization
      if (context.userId) {
        await enhancedAIService.learnFromInteraction({
          userMessage: message,
          aiResponse: response.content,
          context
        });
      }

      return response;
    } catch (error) {
      console.error('ResponseGenerator Error:', error);
      throw error;
    }
  }
}

// Personality Engine - Adapts responses based on user preferences and context
export class PersonalityEngine {
  adaptResponse(response: string, context: ConversationContext): string {
    let adaptedResponse = response;

    // Adapt tone
    if (context.preferences.tone === 'casual') {
      adaptedResponse = this.makeCasual(adaptedResponse);
    } else if (context.preferences.tone === 'professional') {
      adaptedResponse = this.makeProfessional(adaptedResponse);
    }

    // Adapt language
    if (context.preferences.language === 'chinese') {
      // Note: In a real implementation, you might use translation services
      adaptedResponse = `[Translated to Chinese]: ${adaptedResponse}`;
    }

    // Adapt response length
    if (context.preferences.responseLength === 'short') {
      adaptedResponse = this.makeShorter(adaptedResponse);
    } else if (context.preferences.responseLength === 'long') {
      adaptedResponse = this.makeLonger(adaptedResponse);
    }

    return adaptedResponse;
  }

  private makeCasual(response: string): string {
    return response.replace(/I would/g, "I'd").replace(/you will/g, "you'll");
  }

  private makeProfessional(response: string): string {
    return response.replace(/I'd/g, "I would").replace(/you'll/g, "you will");
  }

  private makeShorter(response: string): string {
    const sentences = response.split('.');
    return sentences.slice(0, 2).join('.') + '.';
  }

  private makeLonger(response: string): string {
    // In a real implementation, you might call the AI again for elaboration
    return response + " I'd be happy to elaborate on this further if you'd like.";
  }
}

// Safety & Moderation - Ensures safe and appropriate interactions
export class SafetyModeration {
  private readonly inappropriateWords = ['inappropriate', 'offensive', 'harmful'];

  async checkMessage(message: string): Promise<boolean> {
    // Basic content moderation
    const lowerMessage = message.toLowerCase();

    // Check for inappropriate content
    for (const word of this.inappropriateWords) {
      if (lowerMessage.includes(word)) {
        return false;
      }
    }

    // Check message length
    if (message.length > 2000) {
      return false;
    }

    return true;
  }

  moderateResponse(response: string): string {
    // Basic response moderation
    const moderated = response;

    // Remove any potentially harmful content
    // This is a simplified example - in production, you'd use more sophisticated moderation

    return moderated;
  }
}

// Context Memory Manager - Handles long-term memory and learning
export class ContextMemoryManager {
  async storeContextMemory(
    userId: string,
    contextType: string,
    key: string,
    value: unknown,
    importance: number = 0.5
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('ai_context_memory')
        .upsert({
          user_id: userId,
          context_type: contextType,
          context_key: key,
          context_value: value,
          importance_score: importance,
          last_accessed: new Date().toISOString()
        });

      if (error) {
        console.error('Failed to store context memory:', error);
      }
    } catch (error) {
      console.error('Context memory storage error:', error);
    }
  }

  async retrieveContextMemory(userId: string, contextType?: string): Promise<ContextMemoryItem[]> {
    try {
      let query = supabase
        .from('ai_context_memory')
        .select('*')
        .eq('user_id', userId)
        .order('importance_score', { ascending: false })
        .order('last_accessed', { ascending: false })
        .limit(10);

      if (contextType) {
        query = query.eq('context_type', contextType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to retrieve context memory:', error);
        return [];
      }

      // Update last accessed time
      if (data && data.length > 0) {
        const ids = data.map(item => item.id);
        await supabase
          .from('ai_context_memory')
          .update({ last_accessed: new Date().toISOString() })
          .in('id', ids);
      }

      return data || [];
    } catch (error) {
      console.error('Context memory retrieval error:', error);
      return [];
    }
  }

  async learnFromInteraction(
    userId: string,
    interaction: {
      userMessage: string;
      aiResponse: string;
      sentiment?: 'positive' | 'negative' | 'neutral';
      topic?: string;
    }
  ): Promise<void> {
    try {
      // Store interaction patterns
      await this.storeContextMemory(
        userId,
        'interaction_pattern',
        `interaction_${Date.now()}`,
        {
          userMessage: interaction.userMessage,
          aiResponse: interaction.aiResponse,
          sentiment: interaction.sentiment,
          topic: interaction.topic,
          timestamp: new Date().toISOString()
        },
        interaction.sentiment === 'positive' ? 0.8 : 0.4
      );

      // Extract and store preferences
      if (interaction.sentiment === 'positive') {
        const preferences = await this.extractPreferences(interaction);
        if (preferences) {
          await this.storeContextMemory(
            userId,
            'user_preferences',
            'inferred_preferences',
            preferences,
            0.9
          );
        }
      }
    } catch (error) {
      console.error('Learning from interaction error:', error);
    }
  }

  private async extractPreferences(interaction: {
    userMessage: string;
    aiResponse: string;
    sentiment?: string;
  }): Promise<ConversationContext['preferences'] | null> {
    // Simple preference extraction - in production, use NLP
    const message = interaction.userMessage.toLowerCase();

    const preferences: Partial<ConversationContext['preferences']> = {};

    if (message.includes('short') || message.includes('brief')) {
      preferences.responseLength = 'short';
    } else if (message.includes('long') || message.includes('detailed')) {
      preferences.responseLength = 'long';
    }

    if (message.includes('casual') || message.includes('friendly')) {
      preferences.tone = 'casual';
    } else if (message.includes('professional') || message.includes('formal')) {
      preferences.tone = 'professional';
    }

    return Object.keys(preferences).length > 0 ? preferences as ConversationContext['preferences'] : null;
  }
}

// Proactive Suggestions Engine
export class ProactiveSuggestionsEngine {
  private contextMemoryManager: ContextMemoryManager;

  constructor() {
    this.contextMemoryManager = new ContextMemoryManager();
  }

  async generateProactiveSuggestions(userId: string): Promise<string[]> {
    try {
      // Get recent interactions
      const recentInteractions = await this.contextMemoryManager.retrieveContextMemory(
        userId,
        'interaction_pattern'
      );

      // Get relationship data
      const relationshipMemories = await this.contextMemoryManager.retrieveContextMemory(
        userId,
        'relationship_data'
      );

      // Generate suggestions based on context
      const suggestions = [];

      // Check for milestone anniversaries
      const relationshipData = relationshipMemories.find(
        m => m.context_key === 'relationship_data'
      );
      if (relationshipData) {
        const contextValue = relationshipData.context_value as { startDate?: string };
        if (contextValue.startDate) {
          const startDate = new Date(contextValue.startDate);
          const now = new Date();
          const monthsDiff = (now.getFullYear() - startDate.getFullYear()) * 12 +
                             (now.getMonth() - startDate.getMonth());

          if (monthsDiff > 0 && monthsDiff % 6 === 0) {
            suggestions.push(`Celebrate your ${monthsDiff}-month anniversary!`);
          }
        }
      }

      // Check interaction patterns
      const positiveInteractions = recentInteractions.filter(
        i => {
          const contextValue = i.context_value as { sentiment?: string };
          return contextValue.sentiment === 'positive';
        }
      );

      if (positiveInteractions.length > 3) {
        suggestions.push('You seem to enjoy our conversations! Would you like to share a special memory?');
      }

      // Default suggestions
      if (suggestions.length === 0) {
        suggestions.push(
          'How about planning a special date night?',
          'Would you like me to help organize your photos?',
          'Tell me about your favorite memory together'
        );
      }

      return suggestions.slice(0, 3);
    } catch (error) {
      console.error('Proactive suggestions error:', error);
      return [
        'How about planning a special date night?',
        'Would you like me to help organize your photos?',
        'Tell me about your favorite memory together'
      ];
    }
  }
}

// Main Chat Service - Orchestrates all components
export class ChatService {
  private messageHandler: MessageHandler;
  private contextMemoryManager: ContextMemoryManager;
  private proactiveSuggestionsEngine: ProactiveSuggestionsEngine;

  constructor() {
    this.messageHandler = new MessageHandler();
    this.contextMemoryManager = new ContextMemoryManager();
    this.proactiveSuggestionsEngine = new ProactiveSuggestionsEngine();
  }

  async sendMessage(
    message: string,
    sessionId: string,
    userId?: string
  ): Promise<{ response: AIResponse; conversation: Conversation }> {
    console.log('[DEBUG] ChatService.sendMessage called with:', { message, sessionId, userId });

    const result = await this.messageHandler.processMessage(message, sessionId, userId);
    console.log('[DEBUG] ChatService.sendMessage result:', result);

    // Learn from the interaction
    if (userId) {
      console.log('[DEBUG] Learning from interaction...');
      await this.contextMemoryManager.learnFromInteraction(userId, {
        userMessage: message,
        aiResponse: result.response.content,
        sentiment: 'neutral', // Would be determined by NLP in production
        topic: this.extractTopic(message)
      });
    }

    return result;
  }

  async getConversationHistory(conversationId: string): Promise<ChatMessage[]> {
    return await ConversationManager.getConversationMessages(conversationId);
  }

  async getUserConversations(userId: string): Promise<Conversation[]> {
    return await ConversationManager.getUserConversations(userId);
  }

  async getProactiveSuggestions(userId: string): Promise<string[]> {
    return await this.proactiveSuggestionsEngine.generateProactiveSuggestions(userId);
  }

  async getContextMemories(userId: string, contextType?: string): Promise<ContextMemoryItem[]> {
    return await this.contextMemoryManager.retrieveContextMemory(userId, contextType);
  }

  private extractTopic(message: string): string {
    // Simple topic extraction - in production, use NLP
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('date') || lowerMessage.includes('dinner')) {
      return 'dating';
    } else if (lowerMessage.includes('photo') || lowerMessage.includes('memory')) {
      return 'memories';
    } else if (lowerMessage.includes('anniversary') || lowerMessage.includes('celebrate')) {
      return 'celebration';
    }

    return 'general';
  }
}

// Export singleton instance
export const chatService = new ChatService();
export const contextMemoryManager = new ContextMemoryManager();
export const proactiveSuggestionsEngine = new ProactiveSuggestionsEngine();