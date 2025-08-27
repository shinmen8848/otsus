import { useEffect, useState, useMemo } from 'react';
import { Heart, Calendar, Star, Gift, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Milestone {
  days: number;
  title: string;
  description: string;
  icon: string;
}

export const RelationshipCounter = () => {
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [nextMilestone, setNextMilestone] = useState<Milestone | null>(null);

  // Get relationship start date from environment or use default
  const relationshipStart = useMemo(() =>
    new Date(import.meta.env.VITE_RELATIONSHIP_START_DATE || '2023-02-14'),
    []
  );

  // Define major milestones
  const milestones = useMemo(() => [
    { days: 100, title: "100 Days of Love", emoji: "💕", description: "Our first major milestone!" },
    { days: 200, title: "200 Days Together", emoji: "🌸", description: "Growing stronger every day" },
    { days: 365, title: "One Amazing Year", emoji: "🎉", description: "365 days of pure happiness" },
    { days: 500, title: "500 Days of Magic", emoji: "✨", description: "Every day feels magical with you" },
    { days: 730, title: "Two Beautiful Years", emoji: "💖", description: "Two years of endless love" },
    { days: 1000, title: "1000 Days Forever", emoji: "👑", description: "A thousand days of perfection" },
    { days: 1095, title: "Three Years Strong", emoji: "🌟", description: "Three incredible years together" },
    { days: 1461, title: "Four Years of Bliss", emoji: "💎", description: "Four years of pure bliss" },
    { days: 1826, title: "Five Years of Love", emoji: "🏆", description: "Half a decade of beautiful memories" }
  ], []);

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date();
      const difference = now.getTime() - relationshipStart.getTime();
      
      const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const totalMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      
      setDays(totalDays);
      setHours(totalHours);
      setMinutes(totalMinutes);

      // Check for milestone celebrations
      const reachedMilestone = milestones.find(m => m.days === totalDays);
      if (reachedMilestone && !currentMilestone) {
        setCurrentMilestone(reachedMilestone);
        setShowCelebration(true);
        // Auto-hide celebration after 5 seconds
        setTimeout(() => setShowCelebration(false), 5000);
      }

      // Find next milestone
      const upcoming = milestones.find(m => m.days > totalDays);
      setNextMilestone(upcoming);
    };

    updateCounter();
    const interval = setInterval(updateCounter, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [milestones, relationshipStart, currentMilestone]);

  return (
    <div className="relative">
      {/* Milestone Celebration Animation */}
      <AnimatePresence>
        {showCelebration && currentMilestone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-full shadow-3d-strong text-center min-w-max"
          >
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{currentMilestone.emoji}</span>
              <div>
                <div className="font-bold text-lg">{currentMilestone.title}</div>
                <div className="text-sm opacity-90">{currentMilestone.description}</div>
              </div>
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="card-romantic-3d p-12 max-w-lg mx-auto romantic-glow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex items-center justify-center mb-8"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Heart className="w-12 h-12 text-primary mr-4 love-pulse" />
          </motion.div>
          <h3 className="font-accent text-4xl font-bold text-gradient-romantic-3d text-title-3d">
            Together Since
          </h3>
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <Heart className="w-12 h-12 text-primary ml-4 love-pulse" />
          </motion.div>
        </motion.div>
        
        <div className="flex items-center justify-center mb-8 text-muted-foreground">
          <Calendar className="w-5 h-5 mr-3" />
          <span className="text-base font-elegant font-medium text-enhanced">
            {relationshipStart.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <motion.div 
              className="text-4xl font-bold text-gradient-romantic-3d font-display text-title-3d mb-2"
              key={days}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {days.toLocaleString()}
            </motion.div>
            <div className="text-sm text-muted-foreground font-elegant font-semibold text-enhanced">Days</div>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-4xl font-bold text-gradient-romantic-3d font-display text-title-3d mb-2"
              key={hours}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {hours}
            </motion.div>
            <div className="text-sm text-muted-foreground font-elegant font-semibold text-enhanced">Hours</div>
          </div>
          <div className="text-center">
            <motion.div 
              className="text-4xl font-bold text-gradient-romantic-3d font-display text-title-3d mb-2"
              key={minutes}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {minutes}
            </motion.div>
            <div className="text-sm text-muted-foreground font-elegant font-semibold text-enhanced">Minutes</div>
          </div>
        </div>

        {/* Next Milestone Display */}
        {nextMilestone && (
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center space-x-3 text-center">
              <Gift className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-primary">Next Milestone</div>
                <div className="text-xs text-muted-foreground">
                  {nextMilestone.title} in {nextMilestone.days - days} days
                </div>
              </div>
              <span className="text-lg">{nextMilestone.emoji}</span>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-base text-muted-foreground italic font-elegant text-enhanced leading-relaxed">
            "Every moment with you is a beautiful memory in the making"
          </p>
        </div>
      </motion.div>
    </div>
  );
};