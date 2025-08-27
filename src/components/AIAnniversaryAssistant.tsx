import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  Calendar, 
  Gift, 
  Sparkles, 
  Copy, 
  Download, 
  Share2,
  RefreshCw,
  Star,
  MessageCircle,
  PenTool,
  Lightbulb,
  Clock,
  Cake
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '@/lib/ai';

interface AnniversaryData {
  startDate: string;
  specialMemories: string[];
  personalizedDetails: string[];
}

interface CelebrationIdea {
  title: string;
  description: string;
  category: 'romantic' | 'adventure' | 'creative' | 'relaxing';
  budget: 'low' | 'medium' | 'high';
  duration: string;
}

interface AIAnniversaryAssistantProps {
  anniversaryData: AnniversaryData;
  onSaveMessage?: (message: string) => void;
}

export const AIAnniversaryAssistant: React.FC<AIAnniversaryAssistantProps> = ({
  anniversaryData,
  onSaveMessage
}) => {
  const [generatedMessage, setGeneratedMessage] = useState<string>('');
  const [celebrationIdeas, setCelebrationIdeas] = useState<CelebrationIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customDetails, setCustomDetails] = useState<string>('');
  const [customMemories, setCustomMemories] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'message' | 'celebration'>('message');

  const calculateAnniversary = () => {
    const start = new Date(anniversaryData.startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    
    return {
      years,
      months,
      totalDays: diffDays,
      isYears: years > 0,
      nextAnniversary: getNextAnniversary(start)
    };
  };

  const getNextAnniversary = (startDate: Date) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let nextAnniversary = new Date(currentYear, startDate.getMonth(), startDate.getDate());
    
    if (nextAnniversary < now) {
      nextAnniversary = new Date(currentYear + 1, startDate.getMonth(), startDate.getDate());
    }
    
    const daysUntil = Math.ceil((nextAnniversary.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return { date: nextAnniversary, daysUntil };
  };

  const generateAnniversaryMessage = async () => {
    setIsGenerating(true);
    
    try {
      const anniversary = calculateAnniversary();
      const timeValue = anniversary.isYears ? anniversary.years : anniversary.months;
      
      const allMemories = [
        ...anniversaryData.specialMemories,
        ...(customMemories ? customMemories.split(',').map(m => m.trim()) : [])
      ];
      
      const allDetails = [
        ...anniversaryData.personalizedDetails,
        ...(customDetails ? [customDetails] : [])
      ];

      const message = await aiService.generateAnniversaryMessage({
        monthsOrYears: timeValue,
        isYears: anniversary.isYears,
        specialMemories: allMemories,
        personalizedDetails: allDetails
      });

      setGeneratedMessage(message);
    } catch (error) {
      console.error('Error generating anniversary message:', error);
      setGeneratedMessage('Happy anniversary! Your love story continues to inspire us every day. Here\'s to many more beautiful memories together! 💕');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCelebrationIdeas = async () => {
    setIsGenerating(true);
    
    try {
      const ideas = await aiService.suggestDateIdeas({
        location: 'any',
        budget: 'medium',
        mood: 'romantic',
        previousDates: anniversaryData.specialMemories
      });

      // Transform simple ideas into detailed celebration ideas
      const detailedIdeas: CelebrationIdea[] = ideas.map((idea, index) => ({
        title: idea,
        description: `A special way to celebrate your love with ${idea.toLowerCase()}`,
        category: ['romantic', 'adventure', 'creative', 'relaxing'][index % 4] as any,
        budget: ['low', 'medium', 'high'][index % 3] as any,
        duration: ['2-3 hours', 'Half day', 'Full day', 'Weekend'][index % 4]
      }));

      setCelebrationIdeas(detailedIdeas);
    } catch (error) {
      console.error('Error generating celebration ideas:', error);
      // Fallback ideas
      setCelebrationIdeas([
        {
          title: 'Romantic dinner at home',
          description: 'Cook your favorite meal together with candles and music',
          category: 'romantic',
          budget: 'low',
          duration: '2-3 hours'
        },
        {
          title: 'Memory lane photo session',
          description: 'Recreate your first date or visit meaningful places',
          category: 'romantic',
          budget: 'medium',
          duration: 'Half day'
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast notification here
  };

  const anniversary = calculateAnniversary();

  useEffect(() => {
    if (activeTab === 'message') {
      generateAnniversaryMessage();
    } else {
      generateCelebrationIdeas();
    }
  }, [activeTab, anniversaryData]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'romantic': return <Heart className="w-4 h-4" />;
      case 'adventure': return <Star className="w-4 h-4" />;
      case 'creative': return <PenTool className="w-4 h-4" />;
      case 'relaxing': return <Cake className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  const getBudgetColor = (budget: string) => {
    switch (budget) {
      case 'low': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'high': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-3d-primary flex items-center justify-center shadow-3d-soft">
            <Heart className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          <div>
            <h3 className="font-accent text-3xl font-bold text-gradient-romantic-3d">
              AI Anniversary Assistant
            </h3>
            <p className="text-muted-foreground font-elegant">
              Personalized messages and celebration ideas
            </p>
          </div>
        </div>

        {/* Anniversary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center card-romantic-3d">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {anniversary.years}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Years</div>
          </Card>
          <Card className="p-4 text-center card-romantic-3d">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {anniversary.months}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Months</div>
          </Card>
          <Card className="p-4 text-center card-romantic-3d">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {anniversary.totalDays}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Total Days</div>
          </Card>
          <Card className="p-4 text-center card-romantic-3d">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {anniversary.nextAnniversary.daysUntil}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Days Until Next</div>
          </Card>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 bg-muted p-1 rounded-lg">
        <Button
          onClick={() => setActiveTab('message')}
          variant={activeTab === 'message' ? 'default' : 'ghost'}
          className="flex-1 btn-romantic-3d"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Anniversary Message
        </Button>
        <Button
          onClick={() => setActiveTab('celebration')}
          variant={activeTab === 'celebration' ? 'default' : 'ghost'}
          className="flex-1 btn-romantic-3d"
        >
          <Gift className="w-4 h-4 mr-2" />
          Celebration Ideas
        </Button>
      </div>

      {/* Message Tab */}
      <AnimatePresence mode="wait">
        {activeTab === 'message' && (
          <motion.div
            key="message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Customization Inputs */}
            <Card className="card-romantic-3d">
              <h4 className="font-elegant font-semibold text-lg mb-4">Customize Your Message</h4>
              <div className="space-y-4">
                <div>
                  <label className="font-elegant font-medium text-sm mb-2 block">
                    Additional Memories (comma-separated)
                  </label>
                  <Input
                    value={customMemories}
                    onChange={(e) => setCustomMemories(e.target.value)}
                    placeholder="First kiss, vacation in Paris, movie night..."
                    className="font-elegant"
                  />
                </div>
                <div>
                  <label className="font-elegant font-medium text-sm mb-2 block">
                    Personal Details
                  </label>
                  <Textarea
                    value={customDetails}
                    onChange={(e) => setCustomDetails(e.target.value)}
                    placeholder="Inside jokes, shared dreams, special nicknames..."
                    className="font-elegant resize-none"
                    rows={2}
                  />
                </div>
                <Button
                  onClick={generateAnniversaryMessage}
                  disabled={isGenerating}
                  className="btn-romantic-3d"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Message
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Generated Message */}
            {generatedMessage && (
              <Card className="card-romantic-3d">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-elegant font-semibold text-lg">Your Anniversary Message</h4>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generatedMessage)}
                      className="btn-romantic-outline-3d"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="btn-romantic-outline-3d"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    {onSaveMessage && (
                      <Button
                        size="sm"
                        onClick={() => onSaveMessage(generatedMessage)}
                        className="btn-romantic-3d"
                      >
                        Save
                      </Button>
                    )}
                  </div>
                </div>
                <div className="prose prose-pink max-w-none">
                  <p className="font-elegant text-enhanced leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {generatedMessage}
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        )}

        {/* Celebration Tab */}
        {activeTab === 'celebration' && (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-elegant font-semibold text-lg">Celebration Ideas</h4>
              <Button
                onClick={generateCelebrationIdeas}
                disabled={isGenerating}
                size="sm"
                className="btn-romantic-3d"
              >
                {isGenerating ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Lightbulb className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {celebrationIdeas.map((idea, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="card-romantic-3d h-full">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-3d-secondary flex items-center justify-center shadow-3d-soft">
                        {getCategoryIcon(idea.category)}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-elegant font-semibold text-lg mb-2">
                          {idea.title}
                        </h5>
                        <p className="text-muted-foreground font-elegant text-enhanced mb-4">
                          {idea.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs">
                            {idea.category}
                          </Badge>
                          <Badge className={`text-xs ${getBudgetColor(idea.budget)}`}>
                            {idea.budget} budget
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {idea.duration}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {isGenerating && celebrationIdeas.length === 0 && (
              <Card className="card-romantic-3d">
                <div className="text-center py-12">
                  <div className="w-12 h-12 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center mb-4 animate-pulse shadow-3d-soft">
                    <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
                  </div>
                  <p className="font-elegant text-muted-foreground">
                    Generating celebration ideas...
                  </p>
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};