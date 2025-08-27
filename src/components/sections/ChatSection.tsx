import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageCircle,
  Send,
  Brain,
  Sparkles,
  Heart,
  Settings,
  History,
  Plus,
  Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { chatService, type ChatMessage, type Conversation } from '@/lib/chatService';
import floralTexture from '@/assets/floral-texture-light.jpg';

interface ChatSectionProps {
  onSaveMessage?: (message: string) => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ onSaveMessage }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load conversations on mount
    const loadConversations = async () => {
      try {
        // For demo purposes, we'll use a placeholder userId
        const userConversations = await chatService.getUserConversations('demo-user');
        setConversations(userConversations);

        if (userConversations.length > 0) {
          setCurrentConversation(userConversations[0]);
          await loadConversationMessages(userConversations[0].id);
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
      }
    };

    loadConversations();
  }, []);

  const loadConversationMessages = async (conversationId: string) => {
    try {
      const conversationMessages = await chatService.getConversationHistory(conversationId);
      setMessages(conversationMessages);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    console.log('[DEBUG] ChatSection.handleSendMessage called with message:', message);
    setIsLoading(true);
    try {
      console.log('[DEBUG] Calling chatService.sendMessage...');
      const result = await chatService.sendMessage(message, sessionId, 'demo-user');
      console.log('[DEBUG] chatService.sendMessage returned:', result);

      // Add the user message and AI response to the local state
      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        conversationId: result.conversation.id,
        role: 'user',
        content: message,
        messageType: 'text',
        createdAt: new Date()
      };

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        conversationId: result.conversation.id,
        role: 'assistant',
        content: result.response.content,
        messageType: 'text',
        createdAt: new Date()
      };

      console.log('[DEBUG] Adding messages to state:', { userMessage, aiMessage });
      setMessages(prev => [...prev, userMessage, aiMessage]);
      setCurrentConversation(result.conversation);
      setMessage('');

      // Save message if callback provided
      if (onSaveMessage) {
        onSaveMessage(result.response.content);
      }
    } catch (error) {
      console.error('[DEBUG] Failed to send message:', error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: `error_${Date.now()}`,
        conversationId: currentConversation?.id || '',
        role: 'system',
        content: 'Sorry, I encountered an error. Please try again.',
        messageType: 'system',
        createdAt: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setCurrentConversation(null);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.role === 'user';
    const isSystem = message.role === 'system';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`flex items-start space-x-2 max-w-[80%] ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {!isUser && !isSystem && (
            <div className="w-8 h-8 rounded-full bg-gradient-3d-primary flex items-center justify-center shadow-3d-soft">
              <Brain className="w-4 h-4 text-white" />
            </div>
          )}
          <div
            className={`px-4 py-2 rounded-2xl ${
              isUser
                ? 'bg-gradient-3d-primary text-white'
                : isSystem
                ? 'bg-muted text-muted-foreground'
                : 'bg-white shadow-3d-soft'
            }`}
          >
            <p className="font-elegant text-enhanced">{message.content}</p>
            <p className="text-xs opacity-70 mt-1">
              {message.createdAt.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="min-h-screen py-24 px-6 bg-cherry-garden relative">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${floralTexture})` }}
      />
      <div className="absolute inset-0 bg-floral-pattern opacity-30" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-3d-primary flex items-center justify-center shadow-3d-strong">
              <MessageCircle className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="font-accent text-6xl md:text-7xl font-bold text-gradient-romantic-3d text-title-3d">
                AI Chat Companion
              </h2>
              <p className="text-2xl text-foreground/80 font-elegant font-medium text-enhanced">
                Your personal relationship assistant
              </p>
            </div>
          </motion.div>
        </div>

        {/* Chat Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-sm rounded-xl p-1">
              <TabsTrigger
                value="chat"
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <History className="w-4 h-4" />
                <span>History</span>
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <Card className="card-romantic-3d h-[600px] flex flex-col">
                {/* Messages Area */}
                <div className="flex-1 p-6">
                  <ScrollArea className="h-full">
                    <div className="space-y-4">
                      {messages.length === 0 && (
                        <div className="text-center py-12">
                          <Brain className="w-16 h-16 mx-auto text-primary/50 mb-4" />
                          <h3 className="font-elegant font-semibold text-lg mb-2">
                            Start a conversation
                          </h3>
                          <p className="text-muted-foreground font-elegant text-enhanced">
                            Ask me anything about your relationship, dates, or memories!
                          </p>
                        </div>
                      )}
                      {messages.map((msg) => (
                        <MessageBubble key={msg.id} message={msg} />
                      ))}
                      {isLoading && (
                        <div className="flex justify-start mb-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-3d-primary flex items-center justify-center">
                              <Brain className="w-4 h-4 text-white animate-pulse" />
                            </div>
                            <div className="bg-white shadow-3d-soft rounded-2xl px-4 py-2">
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Input Area */}
                <div className="p-6 border-t">
                  <div className="flex space-x-4">
                    <Button
                      onClick={handleNewConversation}
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="flex-1"
                      disabled={isLoading}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!message.trim() || isLoading}
                      className="shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="card-romantic-3d">
                <div className="p-6">
                  <h3 className="font-elegant font-semibold text-lg mb-4 flex items-center space-x-2">
                    <History className="w-5 h-5" />
                    <span>Conversation History</span>
                  </h3>
                  <div className="space-y-3">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer"
                        onClick={() => {
                          setCurrentConversation(conversation);
                          loadConversationMessages(conversation.id);
                        }}
                      >
                        <div>
                          <p className="font-elegant font-medium">
                            {conversation.title || 'Untitled Conversation'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {conversation.updatedAt.toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    {conversations.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No conversations yet. Start chatting!
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card className="card-romantic-3d">
                <div className="p-6">
                  <h3 className="font-elegant font-semibold text-lg mb-4 flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Chat Settings</span>
                  </h3>
                  <p className="text-muted-foreground font-elegant text-enhanced">
                    Chat settings will be available in future updates. For now, enjoy your conversations!
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
};