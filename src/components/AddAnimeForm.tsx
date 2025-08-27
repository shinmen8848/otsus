import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Plus,
  Upload,
  X,
  Image as ImageIcon,
  Star,
  Calendar,
  Film,
  Tv,
  Music,
  Save,
  Camera,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import type { AnimeEntry } from '@/components/AnimeCard';

interface AddAnimeFormProps {
  onAdd: (entry: Omit<AnimeEntry, 'id'>) => void;
  onClose: () => void;
  editEntry?: AnimeEntry;
  isOpen: boolean;
}

const ANIME_GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 
  'Romance', 'Sci-Fi', 'Slice of Life', 'Supernatural', 'Thriller', 'Historical',
  'Psychological', 'Sports', 'Music', 'Family', 'Crime', 'Documentary'
];

const POPULAR_TAGS = [
  'romantic', 'emotional', 'masterpiece', 'action-packed', 'funny', 'tearjerker',
  'binge-worthy', 'classic', 'modern', 'trending', 'award-winning', 'cult-classic'
];

export const AddAnimeForm: React.FC<AddAnimeFormProps> = ({ 
  onAdd, 
  onClose, 
  editEntry, 
  isOpen 
}) => {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const shouldReduceAnimations = prefersReducedMotion || isMobile;

  const [formData, setFormData] = useState<Partial<AnimeEntry>>({
    title: editEntry?.title || '',
    type: editEntry?.type || 'anime',
    status: editEntry?.status || 'plan-to-watch',
    episodes: editEntry?.episodes || { current: 0, total: 1 },
    genre: editEntry?.genre || [],
    year: editEntry?.year || new Date().getFullYear(),
    tomoeRating: editEntry?.tomoeRating || 0,
    nanamiRating: editEntry?.nanamiRating || 0,
    sharedReview: editEntry?.sharedReview || '',
    tags: editEntry?.tags || [],
    favorite: editEntry?.favorite || false,
    rewatch: editEntry?.rewatch || false,
    poster: editEntry?.poster || ''
  });

  const [newGenre, setNewGenre] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (field: keyof AnimeEntry, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEpisodesChange = (field: 'current' | 'total', value: number) => {
    setFormData(prev => ({
      ...prev,
      episodes: { ...prev.episodes!, [field]: value }
    }));
  };

  const addGenre = (genre: string) => {
    if (genre && !formData.genre?.includes(genre)) {
      setFormData(prev => ({
        ...prev,
        genre: [...(prev.genre || []), genre]
      }));
    }
    setNewGenre('');
  };

  const removeGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre?.filter(g => g !== genre) || []
    }));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags?.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(t => t !== tag) || []
    }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // Simulate image upload - in real app, upload to Supabase storage
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, poster: imageUrl }));
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageUpload(imageFile);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) return;

    const newEntry: Omit<AnimeEntry, 'id'> = {
      title: formData.title,
      type: formData.type || 'anime',
      status: formData.status || 'plan-to-watch',
      rating: ((formData.tomoeRating || 0) + (formData.nanamiRating || 0)) / 2,
      episodes: formData.episodes || { current: 0, total: 1 },
      genre: formData.genre || [],
      year: formData.year || new Date().getFullYear(),
      tomoeRating: formData.tomoeRating,
      nanamiRating: formData.nanamiRating,
      sharedReview: formData.sharedReview,
      tags: formData.tags || [],
      favorite: formData.favorite || false,
      rewatch: formData.rewatch || false,
      poster: formData.poster,
      startDate: formData.status !== 'plan-to-watch' ? new Date().toISOString().split('T')[0] : undefined
    };

    onAdd(newEntry);
    onClose();
  };

  const getTypeIcon = () => {
    switch (formData.type) {
      case 'movie': return <Film className="w-5 h-5" />;
      case 'anime': return <Tv className="w-5 h-5" />;
      case 'drama': return <Music className="w-5 h-5" />;
      default: return <Film className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    switch (formData.type) {
      case 'movie': return 'from-pink-400 to-rose-400';
      case 'anime': return 'from-purple-400 to-violet-400';
      case 'drama': return 'from-blue-400 to-cyan-400';
      default: return 'from-gray-400 to-slate-400';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`max-w-4xl max-h-[90vh] overflow-y-auto ${isMobile ? 'mx-4' : ''}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3 text-2xl">
            {getTypeIcon()}
            <span>{editEntry ? 'Edit Entry' : 'Add New Entry'}</span>
          </DialogTitle>
          <DialogDescription>
            Add your favorite anime, drama, or movie to your collection with photos and reviews! 💕
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-white/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Edit3 className="w-5 h-5" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter title..."
                  className="bg-white/70 border-white/40 min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger className="bg-white/70 border-white/40 min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anime">📺 Anime</SelectItem>
                    <SelectItem value="drama">🎭 Drama</SelectItem>
                    <SelectItem value="movie">🎬 Movie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className="bg-white/70 border-white/40 min-h-[44px]"
                  min="1900"
                  max="2030"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger className="bg-white/70 border-white/40 min-h-[44px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plan-to-watch">📅 Plan to Watch</SelectItem>
                    <SelectItem value="watching">👀 Watching</SelectItem>
                    <SelectItem value="completed">✅ Completed</SelectItem>
                    <SelectItem value="on-hold">⏸️ On Hold</SelectItem>
                    <SelectItem value="dropped">❌ Dropped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Episodes */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="currentEpisodes" className="text-sm font-medium">Current Episodes</Label>
                <Input
                  id="currentEpisodes"
                  type="number"
                  value={formData.episodes?.current || 0}
                  onChange={(e) => handleEpisodesChange('current', parseInt(e.target.value) || 0)}
                  className="bg-white/70 border-white/40 min-h-[44px]"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalEpisodes" className="text-sm font-medium">Total Episodes</Label>
                <Input
                  id="totalEpisodes"
                  type="number"
                  value={formData.episodes?.total || 1}
                  onChange={(e) => handleEpisodesChange('total', parseInt(e.target.value) || 1)}
                  className="bg-white/70 border-white/40 min-h-[44px]"
                  min="1"
                />
              </div>
            </div>
          </Card>

          {/* Photo Upload */}
          <Card className="p-6 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-white/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>Photo</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 min-h-[200px] flex flex-col items-center justify-center ${
                  dragActive 
                    ? 'border-blue-400 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400 bg-white/50'
                }`}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Upload className="w-8 h-8 text-blue-500" />
                    </motion.div>
                    <p className="mt-2 text-sm text-gray-600">Uploading...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700">Upload Poster</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Drag & drop or click to select
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Preview */}
              {formData.poster && (
                <div className="relative">
                  <img
                    src={formData.poster}
                    alt="Poster preview"
                    className="w-full h-[200px] object-cover rounded-2xl shadow-lg"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, poster: '' }))}
                    className="absolute top-2 right-2 w-8 h-8 p-0 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Ratings */}
          <Card className="p-6 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-white/30">
            <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Our Ratings</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tomoeRating" className="text-sm font-medium">Tomoe's Rating (0-10)</Label>
                <Input
                  id="tomoeRating"
                  type="number"
                  value={formData.tomoeRating || ''}
                  onChange={(e) => handleInputChange('tomoeRating', parseFloat(e.target.value) || 0)}
                  className="bg-white/70 border-white/40 min-h-[44px]"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nanamiRating" className="text-sm font-medium">Nanami's Rating (0-10)</Label>
                <Input
                  id="nanamiRating"
                  type="number"
                  value={formData.nanamiRating || ''}
                  onChange={(e) => handleInputChange('nanamiRating', parseFloat(e.target.value) || 0)}
                  className="bg-white/70 border-white/40 min-h-[44px]"
                  min="0"
                  max="10"
                  step="0.1"
                />
              </div>
            </div>
          </Card>

          {/* Genres */}
          <Card className="p-6 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-white/30">
            <h3 className="text-lg font-semibold mb-4">Genres</h3>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.genre?.map((genre) => (
                  <Badge
                    key={genre}
                    variant="secondary"
                    className="flex items-center space-x-1 bg-purple-100 text-purple-800"
                  >
                    <span>{genre}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-600"
                      onClick={() => removeGenre(genre)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {ANIME_GENRES.filter(g => !formData.genre?.includes(g)).slice(0, 8).map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="cursor-pointer hover:bg-purple-50"
                    onClick={() => addGenre(genre)}
                  >
                    + {genre}
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  placeholder="Add custom genre..."
                  className="bg-white/70 border-white/40 min-h-[44px]"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre(newGenre))}
                />
                <Button type="button" onClick={() => addGenre(newGenre)} className="min-h-[44px]">
                  Add
                </Button>
              </div>
            </div>
          </Card>

          {/* Tags */}
          <Card className="p-6 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-white/30">
            <h3 className="text-lg font-semibold mb-4">Tags</h3>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center space-x-1 bg-blue-100 text-blue-800"
                  >
                    <span>{tag}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-red-600"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.filter(t => !formData.tags?.includes(t)).slice(0, 6).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-blue-50"
                    onClick={() => addTag(tag)}
                  >
                    + {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add custom tag..."
                  className="bg-white/70 border-white/40 min-h-[44px]"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTag))}
                />
                <Button type="button" onClick={() => addTag(newTag)} className="min-h-[44px]">
                  Add
                </Button>
              </div>
            </div>
          </Card>

          {/* Review */}
          <Card className="p-6 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-sm border-white/30">
            <h3 className="text-lg font-semibold mb-4">Our Shared Review</h3>
            <Textarea
              value={formData.sharedReview}
              onChange={(e) => handleInputChange('sharedReview', e.target.value)}
              placeholder="Share your thoughts about this together... 💕"
              className="bg-white/70 border-white/40 min-h-[120px] resize-none"
              rows={5}
            />
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="min-h-[44px] px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`min-h-[44px] px-8 bg-gradient-to-r ${getTypeColor()} text-white hover:opacity-90`}
              disabled={!formData.title}
            >
              <Save className="w-5 h-5 mr-2" />
              {editEntry ? 'Update Entry' : 'Add to Collection'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};