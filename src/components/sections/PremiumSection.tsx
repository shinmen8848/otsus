import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Heart, 
  Activity, 
  Zap, 
  Sparkles,
  Star,
  Gift,
  Smartphone,
  Wifi,
  WifiOff,
  Users,
  Info,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ThumbKiss } from '@/components/ThumbKiss';
import { HeartbeatSharing } from '@/components/HeartbeatSharing';
import { AdvancedRomanticFeatures } from '@/components/AdvancedRomanticFeatures';
import floralTexture from '@/assets/floral-texture-light.jpg';

interface PremiumSectionProps {
  isPremiumUser?: boolean;
  onUpgrade?: () => void;
}

export const PremiumSection: React.FC<PremiumSectionProps> = ({
  isPremiumUser = false,
  onUpgrade
}) => {
  const [activeTab, setActiveTab] = useState('thumbkiss');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionCode, setConnectionCode] = useState('');

  // Simulate connection process
  const handleConnect = () => {
    // In real app, this would establish WebSocket connection
    setIsConnected(true);
    console.log('Connected to partner');
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    console.log('Disconnected from partner');
  };

  const premiumFeatures = [
    {
      id: 'thumbkiss',
      title: 'ThumbKiss Technology',
      description: 'Feel each other\'s touch through synchronized vibrations',
      icon: Smartphone,
      premium: true
    },
    {
      id: 'heartbeat',
      title: 'Heartbeat Sharing',
      description: 'Sync your hearts across any distance',
      icon: Activity,
      premium: true
    },
    {
      id: 'advanced',
      title: 'Love Suite',
      description: 'Advanced romantic tools and features',
      icon: Crown,
      premium: true
    }
  ];

  if (!isPremiumUser) {
    return (
      <section className="min-h-screen py-24 px-6 bg-cherry-garden relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${floralTexture})` }}
        />
        <div className="absolute inset-0 bg-floral-pattern opacity-30" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Premium Upgrade Hero */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-3d-strong">
                <Crown className="w-8 h-8 text-white drop-shadow-lg" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="font-accent text-6xl md:text-7xl font-bold text-gradient-romantic-3d text-title-3d mb-6">
                Premium Love Features
              </h2>
              <p className="text-2xl text-foreground/80 font-elegant font-medium text-enhanced mb-8">
                Unlock advanced romantic technologies to deepen your connection
              </p>
            </motion.div>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {premiumFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="card-romantic-3d h-full relative overflow-hidden">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    
                    <div className="text-center pt-6">
                      <div className="w-16 h-16 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center mb-4 shadow-3d-soft">
                        <Icon className="w-8 h-8 text-white drop-shadow-sm" />
                      </div>
                      <h3 className="font-elegant font-bold text-xl text-title-3d mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground font-elegant text-enhanced leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Benefits List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="card-romantic-3d">
              <div className="text-center mb-8">
                <h3 className="font-elegant font-bold text-2xl text-title-3d mb-4">
                  What's Included in Premium
                </h3>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {[
                    'ThumbKiss vibration technology',
                    'Real-time heartbeat sharing',
                    'Advanced mood synchronization',
                    'Unlimited love notes & gifts'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-elegant text-enhanced">{benefit}</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  {[
                    'Priority AI insights & suggestions',
                    'Premium photo organization',
                    'Exclusive anniversary templates',
                    '24/7 love support'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-elegant text-enhanced">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center mt-8 pt-8 border-t">
                <div className="mb-6">
                  <div className="text-4xl font-accent font-bold text-gradient-romantic-3d mb-2">
                    $9.99<span className="text-lg font-elegant">/month</span>
                  </div>
                  <p className="text-muted-foreground font-elegant">
                    Cancel anytime • 7-day free trial
                  </p>
                </div>
                
                <Button
                  onClick={onUpgrade}
                  size="lg"
                  className="btn-romantic-3d"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Start Free Trial
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center shadow-3d-strong">
              <Crown className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="font-accent text-6xl md:text-7xl font-bold text-gradient-romantic-3d text-title-3d">
                Premium Love Suite
              </h2>
              <p className="text-2xl text-foreground/80 font-elegant font-medium text-enhanced">
                Advanced romantic technologies at your fingertips
              </p>
            </div>
          </motion.div>
        </div>

        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="card-romantic-3d">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                <div>
                  <h3 className="font-elegant font-semibold text-lg">
                    Partner Connection
                  </h3>
                  <p className="text-muted-foreground font-elegant">
                    {isConnected ? 'Connected with Nanami' : 'Not connected'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isConnected ? (
                  <>
                    <Wifi className="w-5 h-5 text-green-500" />
                    <Button
                      variant="outline"
                      onClick={handleDisconnect}
                      className="btn-romantic-outline-3d"
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-5 h-5 text-red-500" />
                    <Button
                      onClick={handleConnect}
                      className="btn-romantic-3d"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Connect
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Premium Features Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-white/20 backdrop-blur-sm rounded-xl p-1">
              <TabsTrigger 
                value="thumbkiss" 
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <Smartphone className="w-4 h-4" />
                <span>ThumbKiss</span>
              </TabsTrigger>
              <TabsTrigger 
                value="heartbeat"
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <Activity className="w-4 h-4" />
                <span>Heartbeat</span>
              </TabsTrigger>
              <TabsTrigger 
                value="advanced"
                className="flex items-center space-x-2 font-elegant font-semibold data-[state=active]:bg-white data-[state=active]:shadow-3d-soft"
              >
                <Crown className="w-4 h-4" />
                <span>Love Suite</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="thumbkiss" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <ThumbKiss 
                  isConnected={isConnected}
                  partnerName="Nanami"
                  onConnectionRequest={handleConnect}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="heartbeat" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <HeartbeatSharing 
                  isConnected={isConnected}
                  partnerName="Nanami"
                  onConnectionRequest={handleConnect}
                />
              </motion.div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <AdvancedRomanticFeatures 
                  partnerConnected={isConnected}
                  partnerName="Nanami"
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Premium Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <Card className="card-romantic-3d">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Crown className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-elegant font-semibold">Premium Member</h4>
                  <p className="text-sm text-muted-foreground">
                    All premium features unlocked
                  </p>
                </div>
              </div>
              
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </Card>
        </motion.div>

        {/* Usage Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          <Card className="card-romantic-3d">
            <div className="flex items-start space-x-4">
              <Info className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <h4 className="font-elegant font-semibold text-lg mb-2">
                  Premium Tips
                </h4>
                <ul className="space-y-2 text-muted-foreground font-elegant text-enhanced">
                  <li>• Connect with your partner for the best experience</li>
                  <li>• Use ThumbKiss during video calls for added intimacy</li>
                  <li>• Record heartbeats during special moments</li>
                  <li>• Set up scheduled love notes for surprises</li>
                  <li>• Check daily for new romantic challenges</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};