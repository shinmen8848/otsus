import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Star, 
  Heart, 
  Play, 
  Pause, 
  Check, 
  Clock, 
  Calendar,
  Users,
  MessageSquare,
  Edit3,
  Trash2,
  ExternalLink,
  Sparkles,
  Trophy,
  ChevronDown,
  Film,
  Tv,
  Music,
  MoreHorizontal,
  Share2,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface AnimeEntry {
  id: string;
  title: string;
  type: 'anime' | 'drama' | 'movie';
  poster?: string;
  status: 'watching' | 'completed' | 'plan-to-watch' | 'dropped' | 'on-hold';
  rating: number; // 0-10
  episodes: {
    current: number;
    total: number;
  };
  genre: string[];
  year: number;
  tomoeRating?: number;
  nanamiRating?: number;
  sharedReview?: string;
  personalNotes?: string;
  startDate?: string;
  endDate?: string;
  favorite: boolean;
  rewatch: boolean;
  tags: string[];
}

interface AnimeCardProps {
  entry: AnimeEntry;
  onEdit?: (entry: AnimeEntry) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onUpdateProgress?: (id: string, current: number) => void;
  onUpdateStatus?: (id: string, status: AnimeEntry['status']) => void;
  compact?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  entry,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUpdateProgress,
  onUpdateStatus,
  compact = false
}) => {
  const [showReview, setShowReview] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  // Mobile and accessibility optimizations
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceAnimations = prefersReducedMotion || isMobile;

  const getStatusColor = (status: AnimeEntry['status']) => {
    switch (status) {
      case 'watching': return 'bg-green-500';
      case 'completed': return 'bg-blue-500';
      case 'plan-to-watch': return 'bg-yellow-500';
      case 'dropped': return 'bg-red-500';
      case 'on-hold': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: AnimeEntry['status']) => {
    switch (status) {
      case 'watching': return <Play className="w-4 h-4" />;
      case 'completed': return <Check className="w-4 h-4" />;
      case 'plan-to-watch': return <Clock className="w-4 h-4" />;
      case 'dropped': return <Pause className="w-4 h-4" />;
      case 'on-hold': return <Pause className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getProgressPercentage = () => {
    return entry.episodes.total > 0 ? (entry.episodes.current / entry.episodes.total) * 100 : 0;
  };

  const getAverageRating = () => {
    const ratings = [entry.tomoeRating, entry.nanamiRating].filter(r => r !== undefined);
    return ratings.length > 0 ? ratings.reduce((a, b) => a! + b!, 0)! / ratings.length : entry.rating;
  };

  const getTypeIcon = () => {
    switch (entry.type) {
      case 'movie': return <Film className="w-4 h-4" />;
      case 'anime': return <Tv className="w-4 h-4" />;
      case 'drama': return <Music className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getTypeColor = () => {
    switch (entry.type) {
      case 'movie': return 'from-pink-400 to-rose-400';
      case 'anime': return 'from-purple-400 to-violet-400';
      case 'drama': return 'from-blue-400 to-cyan-400';
      default: return 'from-gray-400 to-slate-400';
    }
  };

  const handleProgressUpdate = (increment: number) => {
    const newCurrent = Math.max(0, Math.min(entry.episodes.total, entry.episodes.current + increment));
    onUpdateProgress?.(entry.id, newCurrent);
    
    // Auto-update status when completed
    if (newCurrent === entry.episodes.total && entry.status !== 'completed') {
      onUpdateStatus?.(entry.id, 'completed');
    }
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, x: shouldReduceAnimations ? 0 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: shouldReduceAnimations ? 0 : 20 }}
        whileHover={!isMobile ? { scale: 1.02, x: 5 } : undefined}
        whileTap={{ scale: 0.98 }}
        className="relative group overflow-hidden"
      >
        {/* Enhanced Beautiful Background with Multiple Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/40 to-white/20 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-white/30" />
        <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor()} opacity-[0.06] group-hover:opacity-[0.12] rounded-2xl sm:rounded-3xl transition-all duration-500`} />
        
        {/* Enhanced Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl sm:rounded-3xl" />
        
        {/* Floating Hearts Animation for Favorites */}
        {entry.favorite && (
          <motion.div
            className="absolute top-2 right-2 pointer-events-none z-10"
            animate={{
              y: [0, -8, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-400/60 fill-pink-400/60" />
          </motion.div>
        )}
        
        <div className="relative p-3 sm:p-4 md:p-5">
          <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-5">
            {/* Enhanced Mobile-Optimized Poster with Glow Effect */}
            <motion.div 
              className="relative w-14 h-20 sm:w-16 sm:h-24 md:w-18 md:h-28 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl group-hover:shadow-pink-500/20 flex-shrink-0"
              whileHover={!isMobile ? { scale: 1.05, rotateY: 5 } : undefined}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: entry.favorite 
                  ? '0 8px 25px -5px rgba(236, 72, 153, 0.3), 0 0 15px rgba(236, 72, 153, 0.1)'
                  : '0 8px 25px -5px rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Enhanced Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor()} shadow-inner`} />
              
              {/* Gloss Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent" />
              
              {entry.poster ? (
                <img 
                  src={entry.poster} 
                  alt={entry.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-white">
                  <motion.div
                    animate={!shouldReduceAnimations ? { rotate: 360 } : undefined}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  >
                    {getTypeIcon()}
                  </motion.div>
                </div>
              )}
              
              {/* Enhanced Favorite Indicator with Pulse */}
              {entry.favorite && (
                <motion.div 
                  className="absolute top-1 right-1 sm:top-2 sm:right-2"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="bg-gradient-to-br from-pink-500/90 to-red-500/90 backdrop-blur-sm rounded-full p-1 shadow-lg">
                    <Heart className="w-2 h-2 sm:w-3 sm:h-3 text-white fill-white" />
                  </div>
                </motion.div>
              )}
              
              {/* Floating Type Badge with Better Design */}
              <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gradient-to-r ${getTypeColor()} text-white border-0 shadow-lg text-xs px-1.5 py-1 sm:px-2 sm:py-1 rounded-lg sm:rounded-full backdrop-blur-sm flex items-center space-x-1`}
                >
                  {React.cloneElement(getTypeIcon(), { className: "w-2 h-2 sm:w-3 sm:h-3" })}
                  <span className="font-medium capitalize text-xs hidden sm:inline">{entry.type}</span>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Enhanced Mobile-Optimized Content */}
            <div className="flex-1 min-w-0 space-y-2 sm:space-y-3">
              <div>
                <h4 className="font-bold text-base sm:text-lg md:text-xl text-slate-800 truncate leading-tight mb-1 sm:mb-2">
                  {entry.title}
                </h4>
                <div className="flex items-center flex-wrap gap-2 sm:gap-3 mt-1 sm:mt-2">
                  {/* Enhanced Status Indicator */}
                  <motion.div 
                    className={`flex items-center space-x-1 px-2 sm:px-3 py-1 rounded-full ${getStatusColor(entry.status)} shadow-lg text-white text-xs font-medium`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {React.cloneElement(getStatusIcon(entry.status), { className: "w-3 h-3" })}
                    <span className="capitalize text-xs sm:text-sm">{entry.status.replace('-', ' ')}</span>
                  </motion.div>
                  
                  {/* Episode Counter with Better Design */}
                  <div className="flex items-center space-x-1 bg-white/50 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full shadow-md">
                    <Play className="w-3 h-3 text-slate-600" />
                    <span className="text-xs sm:text-sm text-slate-700 font-semibold">
                      {entry.episodes.current}/{entry.episodes.total}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Enhanced Mobile Progress with Glow */}
              <div className="space-y-1 sm:space-y-2">
                <div className="relative">
                  <Progress 
                    value={getProgressPercentage()} 
                    className="h-1.5 sm:h-2 bg-slate-200/60 backdrop-blur-sm shadow-inner rounded-full"
                    style={{
                      background: `linear-gradient(to right, 
                        hsl(var(--primary)) 0%, 
                        hsl(var(--primary)) ${getProgressPercentage()}%, 
                        rgba(148, 163, 184, 0.3) ${getProgressPercentage()}%, 
                        rgba(148, 163, 184, 0.3) 100%)
                      `
                    }}
                  />
                  
                  {/* Progress Glow Effect */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-400/40 to-purple-400/40 rounded-full blur-sm"
                    style={{ width: `${getProgressPercentage()}%` }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-600 font-medium bg-white/40 px-2 py-0.5 sm:py-1 rounded-full">
                    {getProgressPercentage().toFixed(0)}% Complete
                  </span>
                  <motion.div 
                    className="flex items-center space-x-1 bg-gradient-to-r from-amber-400 to-yellow-400 px-2 py-0.5 sm:py-1 rounded-full shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white fill-white" />
                    <span className="text-xs font-bold text-white">
                      {getAverageRating().toFixed(1)}
                    </span>
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Mobile Action Button */}
            {onToggleFavorite && (
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleFavorite(entry.id)}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] flex-shrink-0 backdrop-blur-sm shadow-lg transition-all duration-300 ${
                    entry.favorite 
                      ? 'bg-gradient-to-br from-pink-500/20 to-red-500/20 hover:from-pink-500/30 hover:to-red-500/30' 
                      : 'bg-white/30 hover:bg-white/40'
                  }`}
                  aria-label={entry.favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  <motion.div
                    animate={entry.favorite ? {
                      scale: [1, 1.2, 1],
                      rotate: [0, 15, -15, 0]
                    } : {}}
                    transition={{
                      duration: 0.6,
                      repeat: entry.favorite ? Infinity : 0,
                      repeatDelay: 3
                    }}
                  >
                    <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${
                      entry.favorite ? 'fill-red-500 text-red-500' : 'text-slate-500 hover:text-red-400'
                    }`} />
                  </motion.div>
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceAnimations ? 20 : 30, scale: shouldReduceAnimations ? 1 : 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: shouldReduceAnimations ? -20 : -30, scale: shouldReduceAnimations ? 1 : 0.95 }}
      whileHover={!isMobile ? { y: -12, scale: 1.03 } : undefined}
      whileTap={{ scale: 0.98 }}
      className="relative group overflow-hidden"
    >
      {/* Enhanced Multi-Layer Background with Beautiful Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/75 via-white/45 to-white/25 backdrop-blur-2xl rounded-2xl sm:rounded-3xl lg:rounded-[2rem] shadow-2xl group-hover:shadow-3xl transition-all duration-700 border border-white/40" />
      <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor()} opacity-[0.06] group-hover:opacity-[0.12] rounded-2xl sm:rounded-3xl lg:rounded-[2rem] transition-all duration-700`} />
      
      {/* Magical Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1200 ease-out rounded-2xl sm:rounded-3xl lg:rounded-[2rem]" />
      
      {/* Floating Sparkles for Favorites */}
      {entry.favorite && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2rem]">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-pink-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${15 + i * 10}%`
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3
              }}
            />
          ))}
        </div>
      )}
      
      {/* Enhanced Border Glow Effect */}
      <div className={`absolute inset-0 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] bg-gradient-to-r ${getTypeColor()} opacity-0 group-hover:opacity-15 blur-xl transition-all duration-700`} />
      
      <div className="relative p-4 sm:p-5 md:p-6 lg:p-7 xl:p-9 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-7">
        {/* Enhanced Header Section with Beautiful Layout */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-5 md:space-x-6 lg:space-x-7">
          {/* Stunning Enhanced Poster with 3D Effects */}
          <motion.div 
            className="relative w-24 h-36 sm:w-28 sm:h-42 md:w-32 md:h-48 lg:w-36 lg:h-54 mx-auto sm:mx-0 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-pink-500/30 flex-shrink-0"
            whileHover={!isMobile ? { 
              scale: 1.08, 
              rotateY: 8,
              rotateX: 2,
              z: 50
            } : undefined}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{
              transformStyle: 'preserve-3d',
              boxShadow: entry.favorite 
                ? '0 15px 40px -10px rgba(236, 72, 153, 0.4), 0 0 30px rgba(236, 72, 153, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                : '0 15px 40px -10px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
            }}
          >
            {/* Enhanced Background with Multiple Gradients */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getTypeColor()}`} />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-white/10" />
            
            {/* Magical Gloss Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-transparent opacity-60" />
            
            {entry.poster ? (
              <img 
                src={entry.poster} 
                alt={entry.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <motion.div
                  animate={!shouldReduceAnimations ? { 
                    rotate: 360,
                    scale: [1, 1.1, 1]
                  } : undefined}
                  transition={{ 
                    rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                    scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  {React.cloneElement(getTypeIcon(), { className: "w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" })}
                </motion.div>
              </div>
            )}
            
            {/* Animated Favorite Heart with Magical Effects */}
            {entry.favorite && (
              <motion.div 
                className="absolute top-2 right-2 sm:top-3 sm:right-3" 
                initial={{ scale: 0, rotate: -180 }} 
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  y: [0, -5, 0]
                }}
                transition={{
                  scale: { duration: 0.6, type: "spring", stiffness: 300 },
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-red-500 rounded-full blur-md opacity-60" />
                  <div className="relative bg-gradient-to-br from-pink-500/95 to-red-500/95 backdrop-blur-sm rounded-full p-1.5 sm:p-2 shadow-xl border border-white/30">
                    <Heart className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white fill-white" />
                  </div>
                </div>
              </motion.div>
            )}
            
            {/* Enhanced Floating Type Badge */}
            <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                className={`bg-gradient-to-r ${getTypeColor()} text-white border-0 shadow-2xl text-xs px-2 py-1 sm:px-3 sm:py-2 rounded-xl sm:rounded-2xl backdrop-blur-sm flex items-center space-x-1 sm:space-x-2 border border-white/30`}
              >
                {React.cloneElement(getTypeIcon(), { className: "w-2.5 h-2.5 sm:w-3 sm:h-3" })}
                <span className="font-semibold capitalize text-xs sm:text-sm">{entry.type}</span>
              </motion.div>
            </div>
            
            {/* Rim Light Effect */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.div>
          
          {/* Enhanced Title and Info Section */}
          <div className="flex-1 space-y-3 sm:space-y-4 md:space-y-5 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
              <div className="space-y-2 sm:space-y-3">
                <motion.h3 
                  className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-slate-800 leading-tight"
                  whileHover={!isMobile ? { scale: 1.02 } : undefined}
                >
                  {entry.title}
                </motion.h3>
                <div className="flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 flex-wrap gap-2 sm:gap-3">
                  <motion.div 
                    className="flex items-center space-x-2 bg-white/50 backdrop-blur-sm px-3 py-2 rounded-xl sm:rounded-2xl shadow-lg"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                    <span className="text-slate-600 font-semibold text-xs sm:text-sm md:text-base">{entry.year}</span>
                  </motion.div>
                  
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-slate-400 rounded-full hidden sm:block" />
                  
                  <motion.div 
                    className="flex items-center space-x-2 bg-gradient-to-r from-amber-400 to-yellow-400 px-3 py-2 rounded-xl sm:rounded-2xl shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    <span className="text-white font-bold text-xs sm:text-sm md:text-base">
                      {getAverageRating().toFixed(1)}
                    </span>
                  </motion.div>
                </div>
              </div>
              
              {/* Enhanced Action Buttons with Beautiful Design */}
              <div className="flex items-center justify-center sm:justify-end space-x-3 sm:space-x-4">
                {onToggleFavorite && (
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleFavorite(entry.id)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full min-h-[44px] min-w-[44px] backdrop-blur-sm shadow-xl transition-all duration-500 border-2 ${
                        entry.favorite 
                          ? 'bg-gradient-to-br from-pink-500/30 to-red-500/30 hover:from-pink-500/40 hover:to-red-500/40 border-pink-300/50' 
                          : 'bg-white/40 hover:bg-white/50 border-white/40 hover:border-pink-300/50'
                      }`}
                      aria-label={entry.favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <motion.div
                        animate={entry.favorite ? {
                          scale: [1, 1.3, 1],
                          rotate: [0, 20, -20, 0]
                        } : {}}
                        transition={{
                          duration: 1,
                          repeat: entry.favorite ? Infinity : 0,
                          repeatDelay: 2
                        }}
                      >
                        <Heart className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                          entry.favorite ? 'fill-red-500 text-red-500' : 'text-slate-500 hover:text-red-400'
                        }`} />
                      </motion.div>
                    </Button>
                  </motion.div>
                )}
                
                {(onEdit || onDelete) && (
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMenu(!showMenu)}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/40 hover:bg-white/50 backdrop-blur-sm min-h-[44px] min-w-[44px] shadow-xl border-2 border-white/40 hover:border-slate-300/50 transition-all duration-300"
                      aria-label="More options"
                    >
                      <MoreHorizontal className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Enhanced Status and Progress Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
                <motion.div 
                  className={`flex items-center space-x-2 sm:space-x-3 px-4 sm:px-5 py-3 rounded-xl sm:rounded-2xl text-white text-sm font-semibold shadow-xl ${getStatusColor(entry.status)} min-h-[44px] backdrop-blur-sm border border-white/30`}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {React.cloneElement(getStatusIcon(entry.status), { className: "w-4 h-4 sm:w-5 sm:h-5" })}
                  <span className="capitalize text-sm sm:text-base">{entry.status.replace('-', ' ')}</span>
                </motion.div>
                
                <div className="flex items-center space-x-2 sm:space-x-3 bg-white/50 backdrop-blur-sm px-3 sm:px-4 py-3 rounded-xl sm:rounded-2xl shadow-lg">
                  <Play className="w-3 h-3 sm:w-4 sm:h-4 text-slate-600" />
                  <span className="text-slate-700 font-bold text-sm sm:text-base text-center sm:text-left">
                    Episode {entry.episodes.current} of {entry.episodes.total}
                  </span>
                </div>
              </div>
              
              {/* Beautiful Enhanced Progress Bar */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
                  <div className="flex-1 relative w-full sm:w-auto">
                    {/* Progress Bar with Glow Effect */}
                    <div className="relative h-3 sm:h-4 bg-gradient-to-r from-slate-200/60 to-slate-200/40 backdrop-blur-sm rounded-full shadow-inner overflow-hidden">
                      <motion.div
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getTypeColor()} rounded-full shadow-lg`}
                        initial={{ width: 0 }}
                        animate={{ width: `${getProgressPercentage()}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      
                      {/* Animated Shine Effect */}
                      <motion.div
                        className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
                      />
                      
                      {/* Glow Effect */}
                      <div 
                        className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getTypeColor()} opacity-50 blur-md rounded-full`}
                        style={{ width: `${getProgressPercentage()}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Enhanced Progress Controls */}
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProgressUpdate(-1)}
                        disabled={entry.episodes.current <= 0}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] bg-white/50 backdrop-blur-sm border-white/60 hover:bg-white/70 shadow-lg font-bold text-base sm:text-lg"
                        aria-label="Decrease episode count"
                      >
                        −
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleProgressUpdate(1)}
                        disabled={entry.episodes.current >= entry.episodes.total}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full min-h-[40px] min-w-[40px] sm:min-h-[44px] sm:min-w-[44px] bg-white/50 backdrop-blur-sm border-white/60 hover:bg-white/70 shadow-lg font-bold text-base sm:text-lg"
                        aria-label="Increase episode count"
                      >
                        +
                      </Button>
                    </motion.div>
                  </div>
                </div>
                
                {/* Beautiful Progress Indicator */}
                <motion.div 
                  className="text-center sm:text-left"
                  whileHover={{ scale: 1.02 }}
                >
                  <span className="inline-flex items-center space-x-2 bg-gradient-to-r from-slate-700 to-slate-600 text-white px-3 sm:px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{getProgressPercentage().toFixed(0)}% Complete</span>
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Beautiful Ratings Section */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { label: "Tomoe's Rating", value: entry.tomoeRating, color: "from-pink-500 to-rose-500", icon: "💕" },
            { label: "Nanami's Rating", value: entry.nanamiRating, color: "from-purple-500 to-violet-500", icon: "💜" },
            { label: "Together", value: getAverageRating(), color: "from-amber-500 to-yellow-500", icon: "✨" }
          ].map((rating, index) => (
            <motion.div 
              key={rating.label} 
              className="text-center group/rating cursor-pointer"
              whileHover={{ scale: 1.05, y: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-xs sm:text-sm text-slate-600 font-semibold mb-2 sm:mb-3 flex items-center justify-center space-x-1 sm:space-x-2">
                <span>{rating.icon}</span>
                <span>{rating.label}</span>
              </div>
              <motion.div 
                className={`relative inline-flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 md:px-5 py-2 sm:py-3 md:py-4 rounded-xl sm:rounded-2xl bg-gradient-to-r ${rating.color} text-white shadow-xl group-hover/rating:shadow-2xl border border-white/30 backdrop-blur-sm`}
                whileHover={{ rotate: [0, 2, -2, 0] }}
                transition={{ duration: 0.5 }}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r ${rating.color} opacity-50 blur-lg group-hover/rating:opacity-70 transition-opacity duration-300`} />
                
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-white relative z-10" />
                </motion.div>
                <span className="font-bold text-sm sm:text-base md:text-lg relative z-10">
                  {rating.value ? rating.value.toFixed(1) : 'N/A'}
                </span>
                
                {/* Shimmer Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl sm:rounded-2xl"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Beautiful Genres Section */}
        <motion.div 
          className="space-y-3 sm:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-2 sm:space-x-3 text-slate-700">
            <motion.div
              animate={{ rotate: [0, 180, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
            </motion.div>
            <span className="font-bold text-sm sm:text-base md:text-lg">Genres & Vibes</span>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {entry.genre.slice(0, 6).map((genre, index) => (
              <motion.div
                key={genre}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className="group/genre"
              >
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-white/70 to-white/50 backdrop-blur-sm border-white/60 text-slate-700 hover:bg-white/90 transition-all duration-300 px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-lg font-medium cursor-pointer group-hover/genre:shadow-xl text-xs sm:text-sm"
                >
                  {genre}
                </Badge>
              </motion.div>
            ))}
            
            {entry.genre.length > 6 && (
              <motion.div
                whileHover={{ scale: 1.1, y: -2 }}
                className="group/more"
              >
                <Badge 
                  variant="outline" 
                  className="bg-gradient-to-r from-slate-100/70 to-slate-200/50 backdrop-blur-sm border-slate-300/60 text-slate-600 hover:bg-slate-200/90 transition-all duration-300 px-2 sm:px-3 py-1 sm:py-2 rounded-full shadow-lg font-medium cursor-pointer group-hover/more:shadow-xl text-xs sm:text-sm"
                >
                  +{entry.genre.length - 6} more ✨
                </Badge>
              </motion.div>
            )}
          </div>
          
          {/* Tags Section */}
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
              {entry.tags.slice(0, 4).map((tag, index) => (
                <motion.div
                  key={tag}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="inline-flex items-center space-x-1 bg-gradient-to-r from-blue-100/90 to-cyan-100/90 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-xs text-blue-700 font-medium border border-blue-200/60 shadow-md">
                    <span>#{tag}</span>
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Enhanced Beautiful Review Section */}
        {entry.sharedReview && (
          <motion.div 
            className="space-y-3 sm:space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReview(!showReview)}
                className="w-full justify-between bg-gradient-to-r from-white/60 to-white/40 hover:from-white/80 hover:to-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg border border-white/50 transition-all duration-300 group/review"
              >
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-1.5 sm:p-2 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </motion.div>
                  <span className="font-bold text-sm sm:text-base md:text-lg text-slate-700">Our Shared Review 💕</span>
                </div>
                <motion.div
                  animate={{ rotate: showReview ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600 group-hover/review:text-slate-800 transition-colors" />
                </motion.div>
              </Button>
            </motion.div>
            
            <AnimatePresence>
              {showReview && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -20 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-white/60 via-white/40 to-white/20 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-xl border border-white/50">
                    {/* Quote Decoration */}
                    <div className="relative">
                      <motion.div
                        className="absolute -top-2 -left-2 text-4xl text-pink-300/60 font-serif"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        "
                      </motion.div>
                      
                      <motion.p 
                        className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium italic relative z-10 pl-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {entry.sharedReview}
                      </motion.p>
                      
                      <motion.div
                        className="absolute -bottom-4 -right-2 text-4xl text-purple-300/60 font-serif rotate-180"
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 180 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                      >
                        "
                      </motion.div>
                    </div>
                    
                    {/* Heart Decoration */}
                    <motion.div 
                      className="flex justify-center mt-3 sm:mt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <div className="flex space-x-1 sm:space-x-2">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{
                              scale: [1, 1.2, 1],
                              opacity: [0.6, 1, 0.6]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                          >
                            <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400 fill-pink-400" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Enhanced Beautiful Dates Section */}
        {(entry.startDate || entry.endDate) && (
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-between pt-4 sm:pt-6 border-t border-white/40 space-y-2 sm:space-y-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {entry.startDate && (
              <motion.div 
                className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-green-100/90 to-emerald-100/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg border border-green-200/60"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                </motion.div>
                <span className="text-xs sm:text-sm font-semibold text-green-700">
                  Started: {new Date(entry.startDate).toLocaleDateString()}
                </span>
              </motion.div>
            )}
            
            {entry.endDate && (
              <motion.div 
                className="flex items-center space-x-2 sm:space-x-3 bg-gradient-to-r from-blue-100/90 to-cyan-100/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 rounded-xl sm:rounded-2xl shadow-lg border border-blue-200/60"
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                </motion.div>
                <span className="text-xs sm:text-sm font-semibold text-blue-700">
                  Finished: {new Date(entry.endDate).toLocaleDateString()}
                </span>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};