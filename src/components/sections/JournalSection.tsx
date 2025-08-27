import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Heart, 
  Calendar,
  User,
  Users,
  Star,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { JournalEntryComponent } from '@/components/JournalEntry';
import floralTexture from '@/assets/floral-texture-light.jpg';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood?: string;
  tags: string[];
  favorite: boolean;
  shared: boolean;
  author: 'tomoe' | 'nanami' | 'both';
  lastModified: string;
}

type SortBy = 'date' | 'title' | 'author' | 'favorite';
type FilterBy = 'all' | 'tomoe' | 'nanami' | 'both' | 'favorites' | 'shared';

export const JournalSection = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentUser] = useState<'tomoe' | 'nanami'>('tomoe'); // In real app, this would come from auth

  // Sample data - in real app, this would come from Supabase
  useEffect(() => {
    const sampleEntries: JournalEntry[] = [
      {
        id: '1',
        title: 'Our First Valentine\'s Day',
        content: '# The Most Magical Day ❤️\n\nToday was absolutely perfect! Nanami surprised me with homemade chocolate and the sweetest love letter. We spent the entire day together, walking through the park where we first met.\n\n> "In your eyes, I found my home" - and it\'s so true.\n\nI can\'t believe how lucky I am to have found someone who understands my heart so completely. Every moment with Nanami feels like a dream I never want to wake up from.\n\n**Things that made today special:**\n- The sunrise breakfast on the rooftop\n- Hand-written love poems\n- Dancing in the rain\n- Late night stargazing\n\nI love you, Nanami! 💕',
        date: '2023-02-14T08:00:00Z',
        mood: 'love',
        tags: ['valentine', 'romance', 'first-time', 'special'],
        favorite: true,
        shared: true,
        author: 'tomoe',
        lastModified: '2023-02-14T23:30:00Z'
      },
      {
        id: '2',
        title: 'Planning Our Dream Trip',
        content: '# Adventure Awaits! 🗺️\n\nTomoe and I spent the whole evening planning our dream trip to Japan! We\'re so excited to visit all the places we\'ve seen in anime together.\n\n**Our must-visit list:**\n- Tokyo Tower at sunset\n- Cherry blossom festivals in Kyoto\n- Traditional ryokan with hot springs\n- Studio Ghibli Museum\n- Mount Fuji hiking trail\n\nWe decided to save up together for this trip. It\'s going to be our first big adventure as a couple, and I can already imagine all the beautiful memories we\'ll create.\n\nTomoe suggested we keep a travel journal during the trip. Such a romantic idea! 📝✨',
        date: '2023-03-10T19:15:00Z',
        mood: 'excited',
        tags: ['travel', 'planning', 'japan', 'dreams'],
        favorite: false,
        shared: true,
        author: 'nanami',
        lastModified: '2023-03-10T22:45:00Z'
      },
      {
        id: '3',
        title: 'Reflecting on Our Journey',
        content: '# Six Months Together 💕\n\nWe\'ve been writing in this journal together for six months now, and reading back through our entries brings tears of joy to my eyes.\n\n**What we\'ve learned about each other:**\n- Tomoe loves taking photos of tiny flowers\n- Nanami makes the best midnight snacks\n- We both cry during the same anime scenes\n- Our dreams align perfectly\n\n> "Love grows by giving. The love we give away is the only love we keep." - Elbert Hubbard\n\nThis quote perfectly describes how we feel about sharing our thoughts in this journal. Every entry we write, every moment we share here, makes our bond stronger.\n\nHere\'s to many more months of love, laughter, and shared dreams! 🥂',
        date: '2023-08-14T16:30:00Z',
        mood: 'grateful',
        tags: ['reflection', 'milestone', 'growth', 'love'],
        favorite: true,
        shared: true,
        author: 'both',
        lastModified: '2023-08-14T18:00:00Z'
      }
    ];

    setEntries(sampleEntries);
  }, []);

  const filteredAndSortedEntries = entries
    .filter(entry => {
      const matchesSearch = searchTerm === '' || 
        entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilter = filterBy === 'all' || 
        (filterBy === 'favorites' && entry.favorite) ||
        (filterBy === 'shared' && entry.shared) ||
        entry.author === filterBy;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
        case 'favorite':
          comparison = (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
          break;
        case 'date':
        default:
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleCreateEntry = (entryData: Omit<JournalEntry, 'id' | 'lastModified'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: Date.now().toString(),
      lastModified: new Date().toISOString()
    };
    
    setEntries(prev => [newEntry, ...prev]);
    setIsCreating(false);
  };

  const handleEditEntry = (entryId: string, entryData: Omit<JournalEntry, 'id' | 'lastModified'>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entryData, id: entryId, lastModified: new Date().toISOString() }
        : entry
    ));
    setEditingId(null);
  };

  const handleDeleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== entryId));
  };

  const handleToggleFavorite = (entryId: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, favorite: !entry.favorite, lastModified: new Date().toISOString() }
        : entry
    ));
  };

  const handleToggleShare = (entryId: string) => {
    setEntries(prev => prev.map(entry => 
      entry.id === entryId 
        ? { ...entry, shared: !entry.shared, lastModified: new Date().toISOString() }
        : entry
    ));
  };

  const filters = [
    { id: 'all', label: 'All Entries', icon: BookOpen },
    { id: 'tomoe', label: 'Tomoe\'s Entries', icon: User },
    { id: 'nanami', label: 'Nanami\'s Entries', icon: User },
    { id: 'both', label: 'Our Entries', icon: Users },
    { id: 'favorites', label: 'Favorites', icon: Star },
    { id: 'shared', label: 'Shared', icon: Heart }
  ];

  const getAllTags = () => {
    const allTags = entries.flatMap(entry => entry.tags);
    return [...new Set(allTags)].sort();
  };

  return (
    <section className="min-h-screen py-24 px-6 bg-tulip-field relative">
      {/* Enhanced floral background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${floralTexture})` }}
      />
      <div className="absolute inset-0 bg-floral-pattern opacity-40" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-accent text-6xl md:text-7xl font-bold text-gradient-romantic-3d text-title-3d mb-6">
            Our Love Journal
          </h2>
          <p className="text-2xl text-foreground/80 max-w-3xl mx-auto font-elegant font-medium text-enhanced">
            A shared space for our thoughts, dreams, and daily reflections
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-6 mb-12">
          {/* Search and Create */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search entries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-elegant"
              />
            </div>
            
            <Button
              onClick={() => setIsCreating(true)}
              className="btn-romantic-3d"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Entry
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => {
                const Icon = filter.icon;
                return (
                  <Button
                    key={filter.id}
                    variant={filterBy === filter.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterBy(filter.id as FilterBy)}
                    className={`rounded-full px-4 py-2 font-elegant transition-3d ${
                      filterBy === filter.id
                        ? 'btn-romantic-3d'
                        : 'btn-romantic-outline-3d'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1" />
                    {filter.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-1 border rounded-md font-elegant text-sm bg-background"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="author">Author</option>
                <option value="favorite">Favorite</option>
              </select>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Popular Tags */}
          {getAllTags().length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-elegant font-semibold text-muted-foreground">Popular tags:</span>
              {getAllTags().slice(0, 8).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="cursor-pointer font-elegant"
                  onClick={() => setSearchTerm(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Entry */}
        <AnimatePresence>
          {(isCreating || editingId) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12"
            >
              <JournalEntryComponent
                entry={editingId ? entries.find(e => e.id === editingId) : undefined}
                isEditing={!!editingId}
                isNew={isCreating}
                onSave={isCreating ? handleCreateEntry : (data) => editingId && handleEditEntry(editingId, data)}
                onCancel={() => {
                  setIsCreating(false);
                  setEditingId(null);
                }}
                currentUser={currentUser}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Entries List */}
        <div className="space-y-8">
          {filteredAndSortedEntries.length > 0 ? (
            filteredAndSortedEntries.map((entry) => (
              <JournalEntryComponent
                key={entry.id}
                entry={entry}
                onEdit={setEditingId}
                onDelete={handleDeleteEntry}
                onToggleFavorite={handleToggleFavorite}
                onToggleShare={handleToggleShare}
              />
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-gradient-3d-secondary rounded-full flex items-center justify-center mb-6 shadow-3d-soft">
                <BookOpen className="w-12 h-12 text-white/70 drop-shadow-lg" />
              </div>
              <h3 className="font-elegant font-bold text-xl text-title-3d mb-2">
                {searchTerm || filterBy !== 'all' ? 'No Entries Found' : 'Start Your Love Journal'}
              </h3>
              <p className="text-muted-foreground font-elegant text-enhanced mb-6">
                {searchTerm || filterBy !== 'all' 
                  ? "Try adjusting your search or filters"
                  : "Share your thoughts, dreams, and daily reflections together"
                }
              </p>
              {!searchTerm && filterBy === 'all' && (
                <Button
                  onClick={() => setIsCreating(true)}
                  className="btn-romantic-3d"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Write Your First Entry
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        {entries.length > 0 && (
          <div className="mt-16 glass-romantic-3d p-8 rounded-3xl">
            <h3 className="font-elegant font-bold text-xl text-title-3d mb-6 text-center">
              Journal Statistics
            </h3>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-accent font-bold text-gradient-romantic-3d">
                  {entries.length}
                </div>
                <div className="text-muted-foreground font-elegant">Total Entries</div>
              </div>
              <div>
                <div className="text-3xl font-accent font-bold text-gradient-romantic-3d">
                  {entries.filter(e => e.favorite).length}
                </div>
                <div className="text-muted-foreground font-elegant">Favorites</div>
              </div>
              <div>
                <div className="text-3xl font-accent font-bold text-gradient-romantic-3d">
                  {entries.filter(e => e.shared).length}
                </div>
                <div className="text-muted-foreground font-elegant">Shared</div>
              </div>
              <div>
                <div className="text-3xl font-accent font-bold text-gradient-romantic-3d">
                  {getAllTags().length}
                </div>
                <div className="text-muted-foreground font-elegant">Unique Tags</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};