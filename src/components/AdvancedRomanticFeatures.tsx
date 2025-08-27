import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Heart, 
  MessageSquare, 
  Calendar, 
  Gift, 
  Star,
  Moon,
  Sun,
  Flower,
  Camera,
  Music,
  MapPin,
  Clock,
  Send,
  Bell,
  Crown,
  Sparkles,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoveNote {
  id: string;
  message: string;
  timestamp: Date;
  scheduled?: Date;
  mood: 'sweet' | 'passionate' | 'playful' | 'deep' | 'grateful';
  delivered: boolean;
}

interface SurpriseGift {
  id: string;
  title: string;
  description: string;
  category: 'virtual' | 'experience' | 'physical';
  rarity: 'common' | 'rare' | 'legendary';
  unlocked: boolean;
  cost: number;
}

interface MoodSync {
  timestamp: Date;
  userMood: string;
  partnerMood?: string;
  suggestion: string;
}

interface AdvancedRomanticFeaturesProps {
  partnerConnected?: boolean;
  partnerName?: string;
}

export const AdvancedRomanticFeatures: React.FC<AdvancedRomanticFeaturesProps> = ({
  partnerConnected = false,
  partnerName = 'Partner'
}) => {
  const [activeFeature, setActiveFeature] = useState<'notes' | 'gifts' | 'mood' | 'surprise'>('notes');
  const [loveNotes, setLoveNotes] = useState<LoveNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedMood, setSelectedMood] = useState<LoveNote['mood']>('sweet');
  const [scheduleTime, setScheduleTime] = useState('');
  const [availableGifts, setAvailableGifts] = useState<SurpriseGift[]>([]);
  const [userCoins, setUserCoins] = useState(250);
  const [currentMoodSync, setCurrentMoodSync] = useState<MoodSync | null>(null);

  const moods = [
    { id: 'sweet', label: 'Sweet', emoji: '🥰', color: 'from-pink-400 to-rose-500' },
    { id: 'passionate', label: 'Passionate', emoji: '😍', color: 'from-red-400 to-pink-600' },
    { id: 'playful', label: 'Playful', emoji: '😘', color: 'from-yellow-400 to-orange-500' },
    { id: 'deep', label: 'Deep', emoji: '💭', color: 'from-purple-400 to-indigo-500' },
    { id: 'grateful', label: 'Grateful', emoji: '🙏', color: 'from-green-400 to-teal-500' }
  ] as const;

  const giftCategories = [
    {
      id: 'virtual',
      label: 'Virtual Gifts',
      items: [
        { id: '1', title: 'Digital Rose Bouquet', description: 'A beautiful animated rose bouquet', category: 'virtual', rarity: 'common', cost: 50, unlocked: true },
        { id: '2', title: 'Love Song Dedication', description: 'Personalized musical message', category: 'virtual', rarity: 'rare', cost: 100, unlocked: true },
        { id: '3', title: 'Starry Night Animation', description: 'Custom constellation with your names', category: 'virtual', rarity: 'legendary', cost: 200, unlocked: false }
      ]
    },
    {
      id: 'experience',
      label: 'Experiences',
      items: [
        { id: '4', title: 'Virtual Date Night', description: 'Synchronized movie or activity session', category: 'experience', rarity: 'common', cost: 75, unlocked: true },
        { id: '5', title: 'Memory Lane Journey', description: 'Guided tour through your shared memories', category: 'experience', rarity: 'rare', cost: 150, unlocked: true },
        { id: '6', title: 'Future Dreams Visualization', description: 'Interactive vision board creation', category: 'experience', rarity: 'legendary', cost: 300, unlocked: false }
      ]
    }
  ];

  useEffect(() => {
    // Initialize sample data
    const initialGifts: SurpriseGift[] = giftCategories.flatMap(cat => 
      cat.items.map(item => ({ ...item, category: item.category as any, rarity: item.rarity as any }))
    );
    setAvailableGifts(initialGifts);

    // Sample love notes
    const sampleNotes: LoveNote[] = [
      {
        id: '1',
        message: 'Good morning, beautiful! Hope your day is as amazing as you are 💕',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        mood: 'sweet',
        delivered: true
      },
      {
        id: '2',
        message: 'Thank you for being my everything. I love you more each day! 🥰',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        mood: 'grateful',
        delivered: true
      }
    ];
    setLoveNotes(sampleNotes);
  }, []);

  const sendLoveNote = () => {
    if (!currentNote.trim()) return;

    const newNote: LoveNote = {
      id: Date.now().toString(),
      message: currentNote,
      timestamp: new Date(),
      mood: selectedMood,
      delivered: partnerConnected,
      ...(scheduleTime && { scheduled: new Date(scheduleTime) })
    };

    setLoveNotes(prev => [newNote, ...prev]);
    setCurrentNote('');
    setScheduleTime('');

    // In real app, send via WebSocket/Push notification
    console.log('Love note sent:', newNote);
  };

  const purchaseGift = (giftId: string) => {
    const gift = availableGifts.find(g => g.id === giftId);
    if (!gift || userCoins < gift.cost || gift.unlocked) return;

    setUserCoins(prev => prev - gift.cost);
    setAvailableGifts(prev => prev.map(g => 
      g.id === giftId ? { ...g, unlocked: true } : g
    ));

    // In real app, send gift to partner
    console.log('Gift purchased and sent:', gift);
  };

  const getMoodEmoji = (mood: string) => {
    return moods.find(m => m.id === mood)?.emoji || '💕';
  };

  const getMoodColor = (mood: string) => {
    return moods.find(m => m.id === mood)?.color || 'from-pink-400 to-rose-500';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700';
      case 'rare': return 'bg-blue-100 text-blue-700';
      case 'legendary': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star className="w-4 h-4" />;
      case 'rare': return <Sparkles className="w-4 h-4" />;
      case 'legendary': return <Crown className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-3d-primary flex items-center justify-center shadow-3d-soft">
            <Crown className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          <div>
            <h3 className="font-accent text-3xl font-bold text-gradient-romantic-3d">
              Premium Love Features
            </h3>
            <p className="text-muted-foreground font-elegant">
              Advanced tools to deepen your romantic connection
            </p>
          </div>
        </div>
      </div>

      {/* Coins Display */}
      <Card className="card-romantic-3d">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="font-elegant font-semibold">Love Coins</h4>
              <p className="text-sm text-muted-foreground">Earn by using features together</p>
            </div>
          </div>
          <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
            {userCoins}
          </div>
        </div>
      </Card>

      {/* Feature Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { id: 'notes', label: 'Love Notes', icon: MessageSquare },
          { id: 'gifts', label: 'Surprise Gifts', icon: Gift },
          { id: 'mood', label: 'Mood Sync', icon: Heart },
          { id: 'surprise', label: 'Daily Surprise', icon: Star }
        ].map((feature) => {
          const Icon = feature.icon;
          return (
            <Button
              key={feature.id}
              variant={activeFeature === feature.id ? "default" : "outline"}
              onClick={() => setActiveFeature(feature.id as any)}
              className={`flex flex-col items-center py-4 h-auto font-elegant font-semibold transition-3d ${
                activeFeature === feature.id
                  ? 'btn-romantic-3d'
                  : 'btn-romantic-outline-3d'
              }`}
            >
              <Icon className="w-5 h-5 mb-2" />
              <span className="text-xs">{feature.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Feature Content */}
      <AnimatePresence mode="wait">
        {/* Love Notes */}
        {activeFeature === 'notes' && (
          <motion.div
            key="notes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Compose Note */}
            <Card className="card-romantic-3d">
              <h4 className="font-elegant font-semibold text-lg mb-4">Send a Love Note</h4>
              <div className="space-y-4">
                <Textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  placeholder="Write something sweet..."
                  className="font-elegant resize-none"
                  rows={3}
                />
                
                <div className="flex flex-wrap gap-2">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={selectedMood === mood.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMood(mood.id)}
                      className="font-elegant text-xs"
                    >
                      {mood.emoji} {mood.label}
                    </Button>
                  ))}
                </div>

                <div className="flex items-center space-x-4">
                  <Input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="font-elegant text-sm"
                    placeholder="Schedule for later..."
                  />
                  <Button
                    onClick={sendLoveNote}
                    disabled={!currentNote.trim() || !partnerConnected}
                    className="btn-romantic-3d"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send
                  </Button>
                </div>
              </div>
            </Card>

            {/* Love Notes History */}
            <Card className="card-romantic-3d">
              <h4 className="font-elegant font-semibold text-lg mb-4">Recent Love Notes</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {loveNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`p-4 rounded-lg border transition-3d ${
                      note.delivered ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getMoodEmoji(note.mood)}</span>
                        <Badge variant="outline" className="text-xs">
                          {note.mood}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground font-elegant">
                        {note.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                    <p className="font-elegant text-enhanced text-sm">
                      {note.message}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge 
                        variant={note.delivered ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {note.delivered ? "Delivered" : note.scheduled ? "Scheduled" : "Pending"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Surprise Gifts */}
        {activeFeature === 'gifts' && (
          <motion.div
            key="gifts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {giftCategories.map((category) => (
              <Card key={category.id} className="card-romantic-3d">
                <h4 className="font-elegant font-semibold text-lg mb-4">{category.label}</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.items.map((item) => {
                    const gift = availableGifts.find(g => g.id === item.id);
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border transition-3d ${
                          gift?.unlocked ? 'bg-green-50 border-green-200' : 'bg-card border-border'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h5 className="font-elegant font-semibold">{item.title}</h5>
                          <div className="flex items-center space-x-1">
                            <Badge className={`text-xs ${getRarityColor(item.rarity)}`}>
                              {getRarityIcon(item.rarity)}
                              {item.rarity}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground font-elegant mb-3">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="font-elegant font-semibold">{item.cost}</span>
                          </div>
                          {gift?.unlocked ? (
                            <Badge className="bg-green-500 text-white">Owned</Badge>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => purchaseGift(item.id)}
                              disabled={userCoins < item.cost}
                              className="btn-romantic-3d text-xs"
                            >
                              Purchase
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Mood Sync */}
        {activeFeature === 'mood' && (
          <motion.div
            key="mood"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="card-romantic-3d">
              <div className="text-center">
                <h4 className="font-elegant font-semibold text-lg mb-6">Mood Synchronization</h4>
                <p className="text-muted-foreground font-elegant mb-6">
                  Share your current mood and get personalized suggestions for connecting
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant="outline"
                      className="flex flex-col items-center py-4 h-auto font-elegant btn-romantic-outline-3d"
                    >
                      <span className="text-2xl mb-2">{mood.emoji}</span>
                      <span className="text-xs">{mood.label}</span>
                    </Button>
                  ))}
                </div>

                <Card className="p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
                  <h5 className="font-elegant font-semibold mb-2">Today's Mood Match</h5>
                  <div className="text-4xl mb-3">🥰❤️</div>
                  <p className="text-sm font-elegant text-enhanced">
                    You're both feeling romantic today! Perfect time for a virtual date night.
                  </p>
                </Card>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Daily Surprise */}
        {activeFeature === 'surprise' && (
          <motion.div
            key="surprise"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card className="card-romantic-3d">
              <div className="text-center">
                <h4 className="font-elegant font-semibold text-lg mb-6">Daily Love Surprise</h4>
                
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center shadow-3d-strong mb-6">
                  <Gift className="w-12 h-12 text-white drop-shadow-lg" />
                </div>

                <h5 className="font-elegant font-bold text-xl text-title-3d mb-3">
                  Love Language of the Day
                </h5>
                <p className="text-muted-foreground font-elegant text-enhanced mb-6">
                  Today's focus: <strong>Words of Affirmation</strong>
                </p>

                <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
                  <h6 className="font-elegant font-semibold mb-2">💡 Today's Challenge</h6>
                  <p className="text-sm font-elegant text-enhanced">
                    Send your partner 3 specific compliments about what you admire most about them. 
                    Be detailed and heartfelt!
                  </p>
                </Card>

                <Button className="mt-6 btn-romantic-3d">
                  <Bell className="w-4 h-4 mr-2" />
                  Remind Me Tomorrow
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};