import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Plus, 
  Search, 
  Filter, 
  Play, 
  Calendar,
  Star,
  Heart,
  TrendingUp,
  Award,
  Users,
  Grid3X3,
  List,
  BarChart3,
  Sparkles,
  Music,
  Film,
  Tv,
  SortAsc,
  SortDesc,
  Check,
  Menu,
  X,
  Edit3,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { AnimeCard, type AnimeEntry } from '@/components/AnimeCard';
import { AddAnimeForm } from '@/components/AddAnimeForm';

type ViewMode = 'grid' | 'list' | 'stats';
type FilterType = 'all' | 'anime' | 'drama' | 'movie' | 'watching' | 'completed' | 'favorites';
type SortBy = 'title' | 'rating' | 'date' | 'progress' | 'year';

export const AnimeTracker = () => {
  const [entries, setEntries] = useState<AnimeEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<AnimeEntry | undefined>();
  
  // Mobile and accessibility optimizations
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceAnimations = prefersReducedMotion || isMobile;

  // Add new entry function
  const handleAddEntry = (newEntryData: Omit<AnimeEntry, 'id'>) => {
    const newEntry: AnimeEntry = {
      ...newEntryData,
      id: Date.now().toString() // Simple ID generation - use UUID in production
    };
    setEntries(prev => [newEntry, ...prev]);
    setIsAddingNew(false);
  };

  // Edit entry function
  const handleEditEntry = (updatedEntryData: Omit<AnimeEntry, 'id'>) => {
    if (!editingEntry) return;
    
    const updatedEntry: AnimeEntry = {
      ...updatedEntryData,
      id: editingEntry.id
    };
    
    setEntries(prev => prev.map(entry => 
      entry.id === editingEntry.id ? updatedEntry : entry
    ));
    setEditingEntry(undefined);
  };

  // Delete entry function
  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Update progress function
  const handleUpdateProgress = (id: string, current: number) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, episodes: { ...entry.episodes, current } };
        // Auto-update status when completed
        if (current === entry.episodes.total && entry.status !== 'completed') {
          updated.status = 'completed';
          updated.endDate = new Date().toISOString().split('T')[0];
        }
        return updated;
      }
      return entry;
    }));
  };

  // Update status function
  const handleUpdateStatus = (id: string, status: AnimeEntry['status']) => {
    setEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, status };
        if (status === 'watching' && !entry.startDate) {
          updated.startDate = new Date().toISOString().split('T')[0];
        }
        if (status === 'completed' && !entry.endDate) {
          updated.endDate = new Date().toISOString().split('T')[0];
        }
        return updated;
      }
      return entry;
    }));
  };

  // Sample data - in real app, this would come from Supabase
  useEffect(() => {
    const sampleEntries: AnimeEntry[] = [
      {
        id: '1',
        title: 'Your Name (Kimi no Na wa)',
        type: 'movie',
        status: 'completed',
        rating: 9.5,
        episodes: { current: 1, total: 1 },
        genre: ['Romance', 'Drama', 'Supernatural'],
        year: 2016,
        tomoeRating: 10,
        nanamiRating: 9,
        sharedReview: 'This movie made us cry together! The beautiful animation and touching story about connection across time reminded us of our own love story. We watched it on our first movie night and it became our movie. The ending scene where they finally meet always gives us chills.',
        startDate: '2023-02-14',
        endDate: '2023-02-14',
        favorite: true,
        rewatch: true,
        tags: ['romantic', 'emotional', 'masterpiece']
      },
      {
        id: '2',
        title: 'Spirited Away',
        type: 'movie',
        status: 'completed',
        rating: 9.2,
        episodes: { current: 1, total: 1 },
        genre: ['Adventure', 'Family', 'Fantasy'],
        year: 2001,
        tomoeRating: 9,
        nanamiRating: 9.5,
        sharedReview: 'Studio Ghibli magic at its finest! We love how this movie balances adventure with deep emotions. The journey reminds us that love and determination can overcome any obstacle.',
        startDate: '2023-03-15',
        endDate: '2023-03-15',
        favorite: true,
        rewatch: false,
        tags: ['ghibli', 'adventure', 'childhood']
      },
      {
        id: '3',
        title: 'Attack on Titan',
        type: 'anime',
        status: 'watching',
        rating: 8.8,
        episodes: { current: 45, total: 87 },
        genre: ['Action', 'Drama', 'Fantasy'],
        year: 2013,
        tomoeRating: 9,
        nanamiRating: 8.5,
        sharedReview: 'Intense and emotional! We love watching this together and discussing all the plot twists. Nanami is better at predicting what happens next.',
        startDate: '2023-08-01',
        favorite: false,
        rewatch: false,
        tags: ['action', 'thriller', 'currently-watching']
      },
      {
        id: '4',
        title: 'Crash Landing on You',
        type: 'drama',
        status: 'completed',
        rating: 9.0,
        episodes: { current: 16, total: 16 },
        genre: ['Romance', 'Drama', 'Comedy'],
        year: 2019,
        tomoeRating: 8.5,
        nanamiRating: 9.5,
        sharedReview: 'The perfect romantic drama! We binged this in two days and could not stop talking about the characters. Their love story across borders touched our hearts.',
        startDate: '2023-06-10',
        endDate: '2023-06-12',
        favorite: true,
        rewatch: false,
        tags: ['k-drama', 'romance', 'binge-watched']
      },
      {
        id: '5',
        title: 'Demon Slayer',
        type: 'anime',
        status: 'plan-to-watch',
        rating: 0,
        episodes: { current: 0, total: 44 },
        genre: ['Action', 'Supernatural', 'Historical'],
        year: 2019,
        favorite: false,
        rewatch: false,
        tags: ['action', 'planned']
      }
    ];

    setEntries(sampleEntries);
  }, []);

  const handleToggleFavorite = (id: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, favorite: !entry.favorite } : entry
    ));
  };

  const getStats = () => {
    const completed = entries.filter(e => e.status === 'completed');
    const totalEpisodes = completed.reduce((sum, entry) => sum + entry.episodes.total, 0);
    const avgRating = completed.length > 0 
      ? completed.reduce((sum, entry) => {
          const rating = ((entry.tomoeRating || 0) + (entry.nanamiRating || 0)) / 2;
          return sum + rating;
        }, 0) / completed.length
      : 0;

    return {
      total: entries.length,
      completed: completed.length,
      totalEpisodes,
      avgRating,
      favorites: entries.filter(e => e.favorite).length
    };
  };

  const stats = getStats();

  const filteredAndSortedEntries = entries
    .filter(entry => {
      const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
        entry.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (filterBy === 'all') return matchesSearch;
      if (filterBy === 'favorites') return matchesSearch && entry.favorite;
      if (['anime', 'drama', 'movie'].includes(filterBy)) return matchesSearch && entry.type === filterBy;
      return matchesSearch && entry.status === filterBy;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title': return a.title.localeCompare(b.title);
        case 'rating': return ((b.tomoeRating || 0) + (b.nanamiRating || 0)) - ((a.tomoeRating || 0) + (a.nanamiRating || 0));
        case 'year': return b.year - a.year;
        case 'progress': return (b.episodes.current / b.episodes.total) - (a.episodes.current / a.episodes.total);
        case 'date': return new Date(b.startDate || '').getTime() - new Date(a.startDate || '').getTime();
        default: return 0;
      }
    });

  return (
    <section className="min-h-screen py-12 sm:py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden">
      {/* Mobile-Optimized Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" />
      
      {/* Simplified animations for mobile, enhanced for desktop */}
      {!shouldReduceAnimations && (
        <div className="absolute inset-0 pointer-events-none">
          {/* CSS-based floating elements - better performance */}
          <div className="animate-float-slow absolute top-20 left-10 w-4 h-4 text-pink-300/20">
            <Heart className="w-full h-full" />
          </div>
          <div className="animate-float-medium absolute top-40 right-20 w-3 h-3 text-purple-300/20">
            <Sparkles className="w-full h-full" />
          </div>
          <div className="animate-float-fast absolute bottom-32 left-20 w-5 h-5 text-blue-300/20">
            <Heart className="w-full h-full" />
          </div>
          <div className="animate-float-slow absolute bottom-20 right-10 w-3 h-3 text-yellow-300/20">
            <Sparkles className="w-full h-full" />
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Mobile-First Responsive Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceAnimations ? 0.3 : 0.8 }}
        >
          <motion.div
            className="relative inline-block mb-4 sm:mb-6"
            whileHover={!isMobile ? { scale: 1.05 } : undefined}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Fluid Typography - Mobile First */}
            <h2 className="font-accent text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 relative leading-tight">
              Our Anime & Drama Journey
              {!isMobile && (
                <motion.div
                  className="absolute -top-2 -right-2"
                  animate={{ rotate: [0, 20, -20, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-6 h-6 md:w-8 md:h-8 text-pink-400" />
                </motion.div>
              )}
            </h2>
            {!shouldReduceAnimations && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 blur-3xl -z-10"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            )}
          </motion.div>
          
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: shouldReduceAnimations ? 0.1 : 0.3, duration: shouldReduceAnimations ? 0.3 : 0.8 }}
          >
            ✨ Tracking our shared adventures through amazing stories together 💕
          </motion.p>
          
          {/* Mobile-Optimized Content Type Indicators */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-4 sm:mt-6 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduceAnimations ? 0.2 : 0.6, duration: shouldReduceAnimations ? 0.3 : 0.8 }}
          >
            {[
              { icon: Film, label: "Movies", color: "text-pink-500" },
              { icon: Tv, label: "Anime", color: "text-purple-500" },
              { icon: Music, label: "Dramas", color: "text-blue-500" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`flex items-center space-x-2 ${item.color} min-h-[44px] px-3 py-2 rounded-full bg-white/50 backdrop-blur-sm`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">{item.label}</span>
                </div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Enhanced Mobile-First Responsive Statistics Cards */}
        <motion.div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-1 sm:px-2 lg:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceAnimations ? 0.1 : 0.2, duration: shouldReduceAnimations ? 0.3 : 0.8 }}
        >
          {[
            { icon: Play, value: stats.total, label: "Total Shows", color: "from-pink-400 to-rose-400" },
            { icon: Check, value: stats.completed, label: "Completed", color: "from-green-400 to-emerald-400" },
            { icon: Film, value: stats.totalEpisodes, label: "Episodes", color: "from-blue-400 to-cyan-400" },
            { icon: Star, value: stats.avgRating.toFixed(1), label: "Avg Rating", color: "from-yellow-400 to-orange-400" }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="relative group"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: shouldReduceAnimations ? 0.1 : (0.4 + index * 0.1), duration: shouldReduceAnimations ? 0.3 : 0.5 }}
                whileHover={!isMobile ? { y: -5, scale: 1.02 } : undefined}
              >
                {/* Ensure minimum 44px touch target */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-white/10 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-lg border border-white/20 min-h-[88px] sm:min-h-[100px] md:min-h-[120px]" />
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 rounded-2xl`} />
                <div className="relative p-3 sm:p-4 md:p-6 text-center min-h-[88px] sm:min-h-[100px] md:min-h-[120px] flex flex-col justify-center">
                  <motion.div
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-1 sm:mb-2 md:mb-3 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}
                    whileHover={!isMobile ? { rotate: 360 } : undefined}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </motion.div>
                  <motion.div 
                    className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent mb-1 sm:mb-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: shouldReduceAnimations ? 0.2 : (0.6 + index * 0.1), type: "spring", stiffness: 300 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-slate-600 font-medium text-xs sm:text-sm md:text-base leading-tight">{stat.label}</div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Enhanced Mobile-First Search and Filter Interface */}
        <motion.div 
          className="mb-6 sm:mb-8 md:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceAnimations ? 0.2 : 0.4, duration: shouldReduceAnimations ? 0.3 : 0.8 }}
        >
          {isMobile ? (
            // Mobile: Enhanced Stacked Layout with Improved Bottom Sheet Filters
            <div className="space-y-3 sm:space-y-4 px-1 sm:px-2">
              {/* Enhanced Mobile Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  placeholder="Search anime, dramas & movies... 🔍"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 bg-white/80 border-white/50 rounded-xl sm:rounded-2xl text-slate-700 placeholder:text-slate-500 focus:bg-white/95 transition-all duration-300 text-sm sm:text-base min-h-[44px] sm:min-h-[48px] shadow-lg backdrop-blur-sm"
                />
              </div>
              
              {/* Enhanced Mobile Filter Button */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="bg-white/80 border-white/50 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-3 sm:py-4 min-h-[44px] sm:min-h-[48px] flex-1 shadow-lg backdrop-blur-sm transition-all duration-300 hover:bg-white/90"
                    >
                      <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                      <span className="text-sm sm:text-base font-medium">Filters</span>
                      {(filterBy !== 'all' || sortBy !== 'date') && (
                        <Badge className="ml-2 bg-pink-500 text-white text-xs px-2 py-1">Active</Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-2xl sm:rounded-t-3xl border-t-0 max-h-[85vh] overflow-y-auto">
                    <div className="py-4 sm:py-6 space-y-4 sm:space-y-6 px-2 sm:px-4">
                      <div className="text-center">
                        <div className="w-10 sm:w-12 h-1 bg-slate-300 rounded-full mx-auto mb-3 sm:mb-4" />
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800">Filters & Sorting</h3>
                        <p className="text-sm text-slate-600 mt-1">Customize your view</p>
                      </div>
                      
                      <div className="space-y-4 sm:space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2 sm:mb-3">Filter by category:</label>
                          <Select value={filterBy} onValueChange={(value: FilterType) => setFilterBy(value)}>
                            <SelectTrigger className="w-full bg-white/80 border-white/50 rounded-lg sm:rounded-xl min-h-[44px] sm:min-h-[48px] shadow-md backdrop-blur-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Shows</SelectItem>
                              <SelectItem value="favorites">💖 Favorites</SelectItem>
                              <SelectItem value="anime">📺 Anime</SelectItem>
                              <SelectItem value="drama">🎭 Drama</SelectItem>
                              <SelectItem value="movie">🎬 Movies</SelectItem>
                              <SelectItem value="watching">👀 Watching</SelectItem>
                              <SelectItem value="completed">✅ Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2 sm:mb-3">Sort by:</label>
                          <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                            <SelectTrigger className="w-full bg-white/80 border-white/50 rounded-lg sm:rounded-xl min-h-[44px] sm:min-h-[48px] shadow-md backdrop-blur-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="title">📝 Title</SelectItem>
                              <SelectItem value="rating">⭐ Rating</SelectItem>
                              <SelectItem value="date">📅 Date</SelectItem>
                              <SelectItem value="progress">📊 Progress</SelectItem>
                              <SelectItem value="year">🗓️ Year</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2 sm:mb-3">View style:</label>
                          <div className="flex space-x-2 sm:space-x-3">
                            <Button
                              variant={viewMode === 'grid' ? 'default' : 'outline'}
                              onClick={() => setViewMode('grid')}
                              className="flex-1 min-h-[44px] sm:min-h-[48px] rounded-lg sm:rounded-xl shadow-md"
                            >
                              <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              <span className="text-sm sm:text-base">Grid</span>
                            </Button>
                            <Button
                              variant={viewMode === 'list' ? 'default' : 'outline'}
                              onClick={() => setViewMode('list')}
                              className="flex-1 min-h-[44px] sm:min-h-[48px] rounded-lg sm:rounded-xl shadow-md"
                            >
                              <List className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              <span className="text-sm sm:text-base">List</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 sm:gap-3 pt-2">
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSearchTerm('');
                            setFilterBy('all');
                            setSortBy('date');
                          }}
                          className="flex-1 min-h-[44px] sm:min-h-[48px] rounded-lg sm:rounded-xl text-sm sm:text-base"
                        >
                          Clear All
                        </Button>
                        <Button 
                          onClick={() => setIsFilterOpen(false)}
                          className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white min-h-[44px] sm:min-h-[48px] rounded-lg sm:rounded-xl shadow-lg text-sm sm:text-base"
                        >
                          Apply Filters
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                {/* Enhanced Mobile View Toggle */}
                <div className="flex bg-white/80 rounded-xl sm:rounded-2xl p-1 shadow-lg backdrop-blur-sm border border-white/30">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-lg sm:rounded-xl px-2 sm:px-3 min-h-[42px] sm:min-h-[44px] min-w-[42px] sm:min-w-[44px]"
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-lg sm:rounded-xl px-2 sm:px-3 min-h-[42px] sm:min-h-[44px] min-w-[42px] sm:min-w-[44px]"
                    aria-label="List view"
                  >
                    <List className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Desktop: Enhanced Horizontal Layout with Better Spacing
            <div className="bg-white/40 backdrop-blur-lg rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white/30">
              <div className="flex flex-col lg:flex-row gap-6 items-center">
                {/* Enhanced Desktop Search Input */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="Search by title, genre, or tags... 🔍"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-white/60 border-white/40 rounded-full text-slate-700 placeholder:text-slate-500 focus:bg-white/80 transition-all duration-300 shadow-lg"
                  />
                </div>
                
                {/* Enhanced Desktop Filter Controls */}
                <div className="flex items-center space-x-3 sm:space-x-4 w-full lg:w-auto">
                  <Select value={filterBy} onValueChange={(value: FilterType) => setFilterBy(value)}>
                    <SelectTrigger className="w-40 bg-white/60 border-white/40 rounded-full shadow-lg">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Shows</SelectItem>
                      <SelectItem value="favorites">💖 Favorites</SelectItem>
                      <SelectItem value="anime">📺 Anime</SelectItem>
                      <SelectItem value="drama">🎭 Drama</SelectItem>
                      <SelectItem value="movie">🎬 Movies</SelectItem>
                      <SelectItem value="watching">👀 Watching</SelectItem>
                      <SelectItem value="completed">✅ Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                    <SelectTrigger className="w-40 bg-white/60 border-white/40 rounded-full shadow-lg">
                      <SortAsc className="w-4 h-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">📝 Title</SelectItem>
                      <SelectItem value="rating">⭐ Rating</SelectItem>
                      <SelectItem value="date">📅 Date</SelectItem>
                      <SelectItem value="progress">📊 Progress</SelectItem>
                      <SelectItem value="year">🗓️ Year</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex items-center bg-white/60 rounded-full p-1 shadow-lg border border-white/40">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-full px-3 py-2"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-full px-3 py-2"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Enhanced Fixed Cards Grid with Improved Mobile-First Sizing */}
        <AnimatePresence mode="wait">
          <motion.div 
            className={`grid gap-3 sm:gap-4 md:gap-6 lg:gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4' 
                : 'grid-cols-1 max-w-4xl mx-auto'
            }`}
            layout
          >
            {/* Enhanced Add New Entry Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={!isMobile ? { y: -4, scale: 1.02 } : undefined}
              whileTap={{ scale: 0.98 }}
              className="relative group cursor-pointer"
              onClick={() => setIsAddingNew(true)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/30 to-white/15 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-white/30" />
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400/10 via-purple-400/10 to-blue-400/10 rounded-xl sm:rounded-2xl lg:rounded-3xl" />
              
              <div className="relative p-4 sm:p-6 md:p-8 min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px] flex flex-col items-center justify-center text-center space-y-3 sm:space-y-4">
                <motion.div
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-lg"
                  whileHover={!isMobile ? { rotate: 360, scale: 1.1 } : undefined}
                  transition={{ duration: 0.6 }}
                >
                  <Plus className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white" />
                </motion.div>
                
                <div className="space-y-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Add New Entry
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed px-2">
                    Add your favorite anime, drama, or movie to your collection! ✨
                  </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-2 mt-3 sm:mt-4">
                  <div className="flex items-center space-x-1 text-pink-500 text-xs sm:text-sm">
                    <Film className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Movies</span>
                  </div>
                  <div className="flex items-center space-x-1 text-purple-500 text-xs sm:text-sm">
                    <Tv className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Anime</span>
                  </div>
                  <div className="flex items-center space-x-1 text-blue-500 text-xs sm:text-sm">
                    <Music className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Drama</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Existing Entry Cards */}
            {filteredAndSortedEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: shouldReduceAnimations ? 20 : 50, scale: shouldReduceAnimations ? 1 : 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: shouldReduceAnimations ? -20 : -50, scale: shouldReduceAnimations ? 1 : 0.9 }}
                transition={{ 
                  delay: shouldReduceAnimations ? 0 : (index + 1) * 0.1, 
                  duration: shouldReduceAnimations ? 0.3 : 0.6,
                  type: shouldReduceAnimations ? "tween" : "spring",
                  stiffness: 100
                }}
                whileHover={!isMobile ? { y: -8 } : undefined}
                layout
                className="min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px]"
              >
                <AnimeCard
                  entry={entry}
                  onToggleFavorite={handleToggleFavorite}
                  onEdit={(entry) => setEditingEntry(entry)}
                  onDelete={handleDeleteEntry}
                  onUpdateProgress={handleUpdateProgress}
                  onUpdateStatus={handleUpdateStatus}
                  compact={viewMode === 'list'}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Enhanced Beautiful Empty State */}
        {filteredAndSortedEntries.length === 0 && entries.length > 0 && (
          <motion.div 
            className="text-center py-12 sm:py-16 px-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mb-4 sm:mb-6 shadow-xl"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400" />
            </motion.div>
            <h3 className="font-bold text-xl sm:text-2xl text-slate-700 mb-3 sm:mb-4">
              No shows found! 🥺
            </h3>
            <p className="text-slate-500 text-base sm:text-lg mb-4 sm:mb-6 max-w-md mx-auto">
              Try adjusting your search or filters to find what you're looking for
            </p>
            <Button 
              onClick={() => { setSearchTerm(''); setFilterBy('all'); }}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-6 sm:px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              Clear Filters ✨
            </Button>
          </motion.div>
        )}

        {entries.length === 0 && (
          <motion.div 
            className="text-center py-16 sm:py-20 md:py-24 px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="relative w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 sm:mb-8"
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-full blur-xl opacity-50" />
              <div className="relative w-full h-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full flex items-center justify-center shadow-2xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                >
                  <Play className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-lg" />
                </motion.div>
              </div>
              <motion.div
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 text-pink-400" />
              </motion.div>
            </motion.div>
            
            <motion.h3 
              className="font-bold text-2xl sm:text-3xl md:text-4xl bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Start Your Journey Together! ✨
            </motion.h3>
            
            <motion.p 
              className="text-slate-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Create beautiful memories by tracking your favorite anime, dramas, and movies together 💕
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={() => setIsAddingNew(true)}
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 hover:from-pink-600 hover:via-purple-600 hover:to-blue-600 text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full text-base sm:text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                Add Your First Entry 🎬
              </Button>
            </motion.div>
            
            <motion.div
              className="flex justify-center space-x-6 sm:space-x-8 mt-8 sm:mt-12 text-slate-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.1, color: "#ec4899" }}
              >
                <Film className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Movies</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.1, color: "#8b5cf6" }}
              >
                <Tv className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Anime</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-2"
                whileHover={{ scale: 1.1, color: "#3b82f6" }}
              >
                <Music className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Dramas</span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      <AddAnimeForm
        isOpen={isAddingNew || !!editingEntry}
        onAdd={editingEntry ? handleEditEntry : handleAddEntry}
        onClose={() => {
          setIsAddingNew(false);
          setEditingEntry(undefined);
        }}
        editEntry={editingEntry}
      />
    </section>
  );
};