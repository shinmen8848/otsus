import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { 
  Brain, 
  Image, 
  Heart, 
  Sparkles, 
  Wand2,
  MessageCircle,
  Calendar,
  Settings,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AIInsights } from '@/components/AIInsights';
import { AIPhotoOrganizer } from '@/components/AIPhotoOrganizer';
import { AIAnniversaryAssistant } from '@/components/AIAnniversaryAssistant';
import { ChatSection } from './ChatSection';
import floralTexture from '@/assets/floral-texture-light.jpg';

// Sample data - in a real app, this would come from Supabase
const sampleRelationshipData = {
  startDate: import.meta.env.VITE_RELATIONSHIP_START_DATE || '2023-02-14',
  recentPhotos: 23,
  journalEntries: 15,
  sharedActivities: ['movie nights', 'cooking together', 'hiking', 'anime watching', 'museum visits'],
  lastMilestone: 'Six months anniversary celebration'
};

const samplePhotos = [
  {
    id: '1',
    title: 'First Date at the Cherry Blossom Festival',
    description: 'Our magical first date surrounded by beautiful pink flowers',
    date: '2023-02-14',
    location: 'Sakura Park',
    tags: ['first-date', 'cherry-blossoms', 'special'],
    category: 'milestones',
    mood: 'romantic',
    aiAnalyzed: false
  },
  {
    id: '2',
    title: 'Cooking Together',
    description: 'Making our favorite pasta dish on a cozy Sunday',
    date: '2023-05-15',
    location: 'Our Kitchen',
    tags: ['cooking', 'home', 'cozy'],
    category: 'everyday',
    mood: 'happy',
    aiAnalyzed: false
  },
  {
    id: '3',
    title: 'Mountain Hiking Adventure',
    description: 'Reaching the summit together and watching the sunset',
    date: '2023-07-20',
    location: 'Mount Furano',
    tags: ['hiking', 'adventure', 'sunset'],
    category: 'travel',
    mood: 'adventurous',
    aiAnalyzed: false
  },
  {
    id: '4',
    title: 'Anime Marathon Night',
    description: 'Binge-watching Your Name with homemade popcorn',
    date: '2023-08-12',
    location: 'Living Room',
    tags: ['anime', 'movie-night', 'cozy'],
    category: 'dates',
    mood: 'peaceful',
    aiAnalyzed: false
  },
  {
    id: '5',
    title: 'Six Month Anniversary',
    description: 'Celebrating our love with a special dinner',
    date: '2023-08-14',
    location: 'Romantic Restaurant',
    tags: ['anniversary', 'celebration', 'milestone'],
    category: 'milestones',
    mood: 'romantic',
    aiAnalyzed: false
  }
];

const sampleAnniversaryData = {
  startDate: sampleRelationshipData.startDate,
  specialMemories: [
    'First date at cherry blossom festival',
    'Cooking pasta together on rainy Sunday',
    'Watching Your Name and crying together',
    'Mountain hiking adventure',
    'Six month anniversary dinner'
  ],
  personalizedDetails: [
    'Tomoe loves anime and photography',
    'Nanami is amazing at cooking and planning',
    'We both love Studio Ghibli movies',
    'Our favorite date activity is exploring new places'
  ]
};

export const AISection = () => {
  const [activeTab, setActiveTab] = useState('insights');
  const [photos, setPhotos] = useState(samplePhotos);
  const [savedMessages, setSavedMessages] = useState<string[]>([]);

  const handlePhotosUpdated = (updatedPhotos: typeof samplePhotos) => {
    setPhotos(updatedPhotos);
  };

  const handleSaveMessage = (message: string) => {
    setSavedMessages(prev => [...prev, message]);
  };

  const handleAlbumsGenerated = (albums: Record<string, string[]>) => {
    console.log('Generated albums:', albums);
    // In a real app, this would save to Supabase
  };

  return (
    <section className="min-h-screen py-24 px-6 bg-cherry-garden relative">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${floralTexture})` }}
      />
      <div className="absolute inset-0 bg-floral-pattern opacity-30" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-3d-primary flex items-center justify-center shadow-3d-strong">
              <Brain className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="font-accent text-6xl md:text-7xl font-bold text-gradient-romantic-3d text-title-3d">
                AI Love Assistant
              </h2>
              <p className="text-2xl text-foreground/80 font-elegant font-medium text-enhanced">
                Enhance your love story with intelligent insights
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-lg text-muted-foreground font-elegant text-enhanced leading-relaxed">
              Our AI assistant learns from your journey together to provide personalized insights, 
              organize your memories, and suggest new ways to celebrate your love.
            </p>
          </motion.div>
        </div>

        {/* AI Features Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <Card className="card-romantic-3d text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center mb-4 shadow-3d-soft">
              <Sparkles className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <h3 className="font-elegant font-bold text-lg text-title-3d mb-2">
              Smart Insights
            </h3>
            <p className="text-muted-foreground font-elegant text-enhanced">
              Get personalized relationship insights and suggestions based on your journey
            </p>
          </Card>
          
          <Card className="card-romantic-3d text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-3d-secondary rounded-full flex items-center justify-center mb-4 shadow-3d-soft">
              <Image className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <h3 className="font-elegant font-bold text-lg text-title-3d mb-2">
              Photo Organization
            </h3>
            <p className="text-muted-foreground font-elegant text-enhanced">
              Automatically tag and organize your memories with AI-powered analysis
            </p>
          </Card>
          
          <Card className="card-romantic-3d text-center">
            <div className="w-12 h-12 mx-auto bg-gradient-3d-accent rounded-full flex items-center justify-center mb-4 shadow-3d-soft">
              <Heart className="w-6 h-6 text-white drop-shadow-sm" />
            </div>
            <h3 className="font-elegant font-bold text-lg text-title-3d mb-2">
              Anniversary Assistant
            </h3>
            <p className="text-muted-foreground font-elegant text-enhanced">
              Generate heartfelt messages and celebration ideas for special moments
            </p>
          </Card>
        </motion.div>

        {/* AI Features Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm rounded-xl p-1">
              <TabsTrigger
                value="chat"
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="insights"
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <Sparkles className="w-4 h-4" />
                <span>Insights</span>
              </TabsTrigger>
              <TabsTrigger
                value="photos"
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <Image className="w-4 h-4" />
                <span>Photo AI</span>
              </TabsTrigger>
              <TabsTrigger
                value="anniversary"
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <Heart className="w-4 h-4" />
                <span>Anniversary</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ChatSection onSaveMessage={handleSaveMessage} />
              </motion.div>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AIInsights
                  relationshipData={sampleRelationshipData}
                  onRefresh={() => window.location.reload()}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AIPhotoOrganizer 
                  photos={photos}
                  onPhotosUpdated={handlePhotosUpdated}
                  onAlbumsGenerated={handleAlbumsGenerated}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="anniversary" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AIAnniversaryAssistant 
                  anniversaryData={sampleAnniversaryData}
                  onSaveMessage={handleSaveMessage}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* API Configuration Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="card-romantic-3d">
            <div className="flex items-start space-x-4">
              <Info className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h4 className="font-elegant font-semibold text-lg mb-2">
                  AI Configuration
                </h4>
                <p className="text-muted-foreground font-elegant text-enhanced mb-4">
                  To enable AI features, configure your GLM-4.5-Air API key in the environment variables. 
                  The AI assistant uses advanced language models to provide personalized insights and suggestions.
                </p>
                <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm">
                  <div className="text-muted-foreground"># .env</div>
                  <div>VITE_GLM_API_KEY=your-api-key-here</div>
                  <div>VITE_GLM_API_URL=https://open.bigmodel.cn/api/paas/v4/</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Saved Messages Preview */}
        {savedMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <Card className="card-romantic-3d">
              <div className="flex items-center space-x-3 mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
                <h4 className="font-elegant font-semibold text-lg">Saved Messages</h4>
              </div>
              <div className="space-y-3">
                {savedMessages.slice(-3).map((message, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <p className="font-elegant text-enhanced text-sm line-clamp-2">
                      {message}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </section>
  );
};