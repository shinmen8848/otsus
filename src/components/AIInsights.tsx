import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Heart, 
  Lightbulb, 
  Star, 
  RefreshCw, 
  Calendar, 
  Camera, 
  BookOpen,
  Sparkles,
  TrendingUp,
  Award,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '@/lib/ai';

interface RelationshipInsight {
  type: 'celebration' | 'suggestion' | 'memory' | 'improvement';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

interface AIInsightsProps {
  relationshipData: {
    startDate: string;
    recentPhotos: number;
    journalEntries: number;
    sharedActivities: string[];
    lastMilestone?: string;
  };
  onRefresh?: () => void;
}

export const AIInsights: React.FC<AIInsightsProps> = ({
  relationshipData,
  onRefresh
}) => {
  const [insights, setInsights] = useState<RelationshipInsight[]>([]);
  const [dateIdeas, setDateIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRelationshipDays = () => {
    const start = new Date(relationshipData.startDate);
    const now = new Date();
    return Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  const generateInsights = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const days = calculateRelationshipDays();
      
      // Generate relationship insights
      const relationshipInsights = await aiService.generateRelationshipInsights({
        relationshipDays: days,
        recentPhotos: relationshipData.recentPhotos,
        journalEntries: relationshipData.journalEntries,
        sharedActivities: relationshipData.sharedActivities,
        lastMilestone: relationshipData.lastMilestone
      });

      // Generate date suggestions
      const suggestions = await aiService.suggestDateIdeas({
        location: 'any',
        budget: 'medium',
        mood: 'romantic',
        previousDates: relationshipData.sharedActivities
      });

      setInsights(relationshipInsights);
      setDateIdeas(suggestions);
    } catch (err) {
      setError('Unable to generate AI insights. Please try again later.');
      console.error('AI Insights Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    generateInsights();
  }, [relationshipData]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'celebration': return <Award className="w-5 h-5" />;
      case 'suggestion': return <Lightbulb className="w-5 h-5" />;
      case 'memory': return <Camera className="w-5 h-5" />;
      case 'improvement': return <TrendingUp className="w-5 h-5" />;
      default: return <Heart className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-500/20 text-green-700 border-green-200';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-200';
    }
  };

  if (error) {
    return (
      <Card className="card-romantic-3d">
        <div className="text-center py-8">
          <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-elegant font-semibold text-lg mb-2">AI Insights Unavailable</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={generateInsights} variant="outline" className="btn-romantic-outline-3d">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-3d-primary flex items-center justify-center shadow-3d-soft">
            <Brain className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          <div>
            <h3 className="font-accent text-2xl font-bold text-gradient-romantic-3d">
              AI Relationship Insights
            </h3>
            <p className="text-muted-foreground font-elegant">
              Personalized suggestions powered by AI
            </p>
          </div>
        </div>
        <Button
          onClick={generateInsights}
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="btn-romantic-outline-3d"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card className="card-romantic-3d">
          <div className="text-center py-12">
            <div className="w-12 h-12 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center mb-4 animate-pulse shadow-3d-soft">
              <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <p className="font-elegant text-muted-foreground">
              Generating personalized insights...
            </p>
          </div>
        </Card>
      )}

      {/* Insights Grid */}
      {!isLoading && insights.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          <AnimatePresence>
            {insights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="card-romantic-3d h-full">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-3d-secondary flex items-center justify-center shadow-3d-soft">
                      {getInsightIcon(insight.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-elegant font-semibold text-lg text-title-3d">
                          {insight.title}
                        </h4>
                        <Badge className={`text-xs ${getPriorityColor(insight.priority)}`}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground font-elegant text-enhanced leading-relaxed">
                        {insight.content}
                      </p>
                      {insight.actionable && (
                        <div className="mt-4">
                          <Button size="sm" className="btn-romantic-3d">
                            <Target className="w-4 h-4 mr-2" />
                            Take Action
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Date Ideas Section */}
      {!isLoading && dateIdeas.length > 0 && (
        <Card className="card-romantic-3d">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-3d-accent flex items-center justify-center shadow-3d-soft">
              <Calendar className="w-4 h-4 text-white drop-shadow-sm" />
            </div>
            <h4 className="font-elegant font-semibold text-xl text-title-3d">
              AI-Suggested Date Ideas
            </h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {dateIdeas.map((idea, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-4 rounded-lg bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10 transition-3d hover:shadow-3d-soft"
              >
                <div className="w-2 h-2 rounded-full bg-gradient-3d-primary shadow-3d-soft" />
                <p className="font-elegant text-enhanced text-foreground/90">
                  {idea}
                </p>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Stats */}
      <Card className="card-romantic-3d">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {calculateRelationshipDays()}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Days Together</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {relationshipData.recentPhotos}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Recent Photos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {relationshipData.journalEntries}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Journal Entries</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {insights.filter(i => i.actionable).length}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Action Items</div>
          </div>
        </div>
      </Card>
    </div>
  );
};