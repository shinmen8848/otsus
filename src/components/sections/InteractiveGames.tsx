import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Star, 
  Gamepad2, 
  Users, 
  Trophy,
  Zap,
  Brain,
  Dice1,
  MessageSquare,
  Camera,
  Music,
  Sparkles,
  Play,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CoupleQuiz } from '@/components/CoupleQuiz';
import floralTexture from '@/assets/floral-texture-light.jpg';

interface GameActivity {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  category: 'quiz' | 'creative' | 'conversation' | 'memory' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  players: number;
  featured?: boolean;
}

export const InteractiveGames = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const games: GameActivity[] = [
    {
      id: 'compatibility-quiz',
      title: 'Compatibility Quiz',
      description: 'Test how well you know each other with fun relationship questions',
      icon: Heart,
      category: 'quiz',
      difficulty: 'easy',
      duration: '10-15 min',
      players: 2,
      featured: true
    },
    {
      id: 'memory-challenge',
      title: 'Memory Lane Challenge',
      description: 'Quiz each other about your favorite shared memories',
      icon: Brain,
      category: 'memory',
      difficulty: 'medium',
      duration: '15-20 min',
      players: 2,
      featured: true
    },
    {
      id: 'dream-builder',
      title: 'Dream House Builder',
      description: 'Design your perfect home together and compare visions',
      icon: Star,
      category: 'creative',
      difficulty: 'medium',
      duration: '20-30 min',
      players: 2
    },
    {
      id: 'conversation-cards',
      title: 'Deep Talk Cards',
      description: 'Random conversation starters to discover new things about each other',
      icon: MessageSquare,
      category: 'conversation',
      difficulty: 'easy',
      duration: '30+ min',
      players: 2,
      featured: true
    },
    {
      id: 'photo-story',
      title: 'Photo Story Game',
      description: 'Create stories using your couple photos as inspiration',
      icon: Camera,
      category: 'creative',
      difficulty: 'easy',
      duration: '15-25 min',
      players: 2
    },
    {
      id: 'playlist-battle',
      title: 'Playlist Battle',
      description: 'Create the perfect date playlist and vote on favorites',
      icon: Music,
      category: 'creative',
      difficulty: 'easy',
      duration: '20-30 min',
      players: 2
    },
    {
      id: 'future-predictions',
      title: 'Future Predictions',
      description: 'Predict funny things about your future together',
      icon: Zap,
      category: 'conversation',
      difficulty: 'medium',
      duration: '15-20 min',
      players: 2
    },
    {
      id: 'random-challenge',
      title: 'Random Couple Challenge',
      description: 'Get surprised with fun mini-challenges to do together',
      icon: Dice1,
      category: 'challenge',
      difficulty: 'hard',
      duration: '10-60 min',
      players: 2
    }
  ];

  const categories = [
    { id: 'all', label: 'All Games', icon: Gamepad2 },
    { id: 'quiz', label: 'Quizzes', icon: Brain },
    { id: 'creative', label: 'Creative', icon: Star },
    { id: 'conversation', label: 'Talk', icon: MessageSquare },
    { id: 'memory', label: 'Memory', icon: Heart },
    { id: 'challenge', label: 'Challenge', icon: Trophy }
  ];

  const filteredGames = activeCategory === 'all' 
    ? games 
    : games.filter(game => game.category === activeCategory);

  const featuredGames = games.filter(game => game.featured);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderGameContent = () => {
    if (!selectedGame) return null;

    switch (selectedGame) {
      case 'compatibility-quiz':
        return (
          <CoupleQuiz
            title="How Compatible Are You?"
            description="Answer questions about each other and see how well you match!"
            onComplete={(result) => {
              console.log('Quiz completed:', result);
            }}
          />
        );
      
      case 'conversation-cards':
        return <ConversationCards />;
        
      case 'memory-challenge':
        return <MemoryChallenge />;
        
      default:
        return <ComingSoonGame gameId={selectedGame} />;
    }
  };

  return (
    <section className="min-h-screen py-24 px-6 bg-tulip-field relative">
      {/* Enhanced floral background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${floralTexture})` }}
      />
      <div className="absolute inset-0 bg-floral-pattern opacity-40" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-accent text-6xl md:text-7xl font-bold text-gradient-romantic-3d text-title-3d mb-6">
            Interactive Corner
          </h2>
          <p className="text-2xl text-foreground/80 max-w-3xl mx-auto font-elegant font-medium text-enhanced">
            Fun games, quizzes, and activities designed to bring you closer together
          </p>
        </div>

        <AnimatePresence mode="wait">
          {selectedGame ? (
            <motion.div
              key="game-content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-elegant font-bold text-3xl text-title-3d">
                  {games.find(g => g.id === selectedGame)?.title}
                </h3>
                <Button
                  onClick={() => setSelectedGame(null)}
                  variant="outline"
                  className="btn-romantic-outline-3d"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Back to Games
                </Button>
              </div>
              
              {renderGameContent()}
            </motion.div>
          ) : (
            <motion.div
              key="game-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Featured Games */}
              <div>
                <h3 className="font-elegant font-bold text-2xl text-title-3d mb-6 text-center">
                  ⭐ Featured Games
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {featuredGames.map((game) => {
                    const Icon = game.icon;
                    return (
                      <Card 
                        key={game.id} 
                        className="card-romantic-3d cursor-pointer transition-all duration-300 hover:shadow-3d-strong"
                        onClick={() => setSelectedGame(game.id)}
                      >
                        <div className="text-center space-y-4">
                          <div className="w-16 h-16 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center shadow-3d-soft">
                            <Icon className="w-8 h-8 text-white drop-shadow-lg" />
                          </div>
                          
                          <div>
                            <h4 className="font-elegant font-bold text-xl text-title-3d mb-2">
                              {game.title}
                            </h4>
                            <p className="text-muted-foreground font-elegant text-enhanced text-sm">
                              {game.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-center space-x-4 text-sm">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${getDifficultyColor(game.difficulty)} mr-2`} />
                              <span className="font-elegant capitalize">{game.difficulty}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Users className="w-4 h-4 mr-1" />
                              <span className="font-elegant">{game.players}</span>
                            </div>
                          </div>

                          <Button 
                            className="btn-romantic-3d w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedGame(game.id);
                            }}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Play Now
                          </Button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? 'default' : 'outline'}
                      onClick={() => setActiveCategory(category.id)}
                      className={`rounded-full px-6 py-3 font-elegant font-semibold transition-3d ${
                        activeCategory === category.id
                          ? 'btn-romantic-3d'
                          : 'btn-romantic-outline-3d'
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.label}
                    </Button>
                  );
                })}
              </div>

              {/* All Games Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredGames.map((game) => {
                  const Icon = game.icon;
                  return (
                    <Card 
                      key={game.id} 
                      className="card-romantic-3d cursor-pointer transition-all duration-300 hover:shadow-3d-medium group"
                      onClick={() => setSelectedGame(game.id)}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="w-12 h-12 bg-gradient-3d-secondary rounded-lg flex items-center justify-center shadow-3d-soft">
                            <Icon className="w-6 h-6 text-white drop-shadow-lg" />
                          </div>
                          {game.featured && (
                            <Badge variant="secondary" className="bg-gradient-3d-primary text-white border-0">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <div>
                          <h4 className="font-elegant font-bold text-lg text-title-3d mb-2 group-hover:text-primary transition-colors">
                            {game.title}
                          </h4>
                          <p className="text-muted-foreground font-elegant text-enhanced text-sm line-clamp-2">
                            {game.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${getDifficultyColor(game.difficulty)} mr-2`} />
                            <span className="font-elegant">{game.duration}</span>
                          </div>
                          <Badge variant="outline" className="text-xs font-elegant">
                            {game.category}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

// Simple conversation cards component
const ConversationCards = () => {
  const [currentCard, setCurrentCard] = useState(0);
  
  const conversationStarters = [
    "If we could travel anywhere in the world right now, where would you want to go and why?",
    "What's one thing about me that always makes you smile?", 
    "If we could have any superpower as a couple, what would it be?",
    "What's your favorite memory of us together so far?",
    "If you could plan the perfect date for us, what would it include?",
    "What's one goal you'd like us to achieve together this year?",
    "What song always reminds you of our relationship?",
    "If we had a theme song, what would it be?"
  ];

  return (
    <Card className="card-romantic-3d text-center">
      <div className="space-y-6">
        <div className="w-16 h-16 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center shadow-3d-soft">
          <MessageSquare className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
        
        <div>
          <h3 className="font-elegant font-bold text-2xl text-title-3d mb-4">
            Deep Talk Cards
          </h3>
          <p className="text-lg font-elegant text-enhanced leading-relaxed max-w-2xl mx-auto">
            "{conversationStarters[currentCard]}"
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            onClick={() => setCurrentCard((prev) => (prev - 1 + conversationStarters.length) % conversationStarters.length)}
            variant="outline"
            className="btn-romantic-outline-3d"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentCard((prev) => (prev + 1) % conversationStarters.length)}
            className="btn-romantic-3d"
          >
            Next Card
          </Button>
        </div>

        <div className="text-sm text-muted-foreground font-elegant">
          Card {currentCard + 1} of {conversationStarters.length}
        </div>
      </div>
    </Card>
  );
};

// Simple memory challenge component
const MemoryChallenge = () => {
  return (
    <Card className="card-romantic-3d text-center">
      <div className="space-y-6">
        <div className="w-16 h-16 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center shadow-3d-soft">
          <Brain className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
        
        <div>
          <h3 className="font-elegant font-bold text-2xl text-title-3d mb-4">
            Memory Lane Challenge
          </h3>
          <p className="text-muted-foreground font-elegant text-enhanced">
            Coming Soon! This will include challenges about your shared memories, dates, and special moments.
          </p>
        </div>

        <Button className="btn-romantic-3d">
          <Star className="w-5 h-5 mr-2" />
          Preview Available Soon
        </Button>
      </div>
    </Card>
  );
};

// Coming soon placeholder
const ComingSoonGame = ({ gameId }: { gameId: string }) => {
  return (
    <Card className="card-romantic-3d text-center">
      <div className="space-y-6">
        <div className="w-16 h-16 mx-auto bg-gradient-3d-secondary rounded-full flex items-center justify-center shadow-3d-soft">
          <Sparkles className="w-8 h-8 text-white drop-shadow-lg" />
        </div>
        
        <div>
          <h3 className="font-elegant font-bold text-2xl text-title-3d mb-4">
            Coming Soon!
          </h3>
          <p className="text-muted-foreground font-elegant text-enhanced">
            This amazing game is being crafted with love and will be available soon.
          </p>
        </div>

        <Button className="btn-romantic-3d">
          <Heart className="w-5 h-5 mr-2" />
          Get Notified
        </Button>
      </div>
    </Card>
  );
};