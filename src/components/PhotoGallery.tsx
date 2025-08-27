import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  Grid3X3, 
  Grid2X2, 
  List, 
  Calendar, 
  MapPin, 
  Heart, 
  Download, 
  Share2, 
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  tags: string[];
  category: string;
  favorite: boolean;
  albumId: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onPhotoClick?: (photo: Photo) => void;
  onPhotoLike?: (photoId: string) => void;
  onPhotoDelete?: (photoId: string) => void;
  showFilters?: boolean;
  showSearch?: boolean;
  layoutOptions?: boolean;
}

type LayoutType = 'grid-large' | 'grid-medium' | 'grid-small' | 'masonry';
type FilterType = 'all' | 'favorites' | 'recent' | string;

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  onPhotoClick,
  onPhotoLike,
  onPhotoDelete,
  showFilters = true,
  showSearch = true,
  layoutOptions = true
}) => {
  const [layout, setLayout] = useState<LayoutType>('grid-medium');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const categories = ['all', 'dates', 'travel', 'milestones', 'everyday', 'favorites'];

  // Filter and search photos
  const filteredPhotos = photos.filter(photo => {
    const matchesSearch = searchTerm === '' || 
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filter === 'all' || 
      (filter === 'favorites' && photo.favorite) ||
      (filter === 'recent' && isRecent(photo.date)) ||
      photo.category === filter;

    return matchesSearch && matchesFilter;
  });

  const isRecent = (date: string) => {
    const photoDate = new Date(date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return photoDate > thirtyDaysAgo;
  };

  const openLightbox = (photo: Photo) => {
    setSelectedPhoto(photo);
    setCurrentPhotoIndex(filteredPhotos.findIndex(p => p.id === photo.id));
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next' 
      ? (currentPhotoIndex + 1) % filteredPhotos.length
      : (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    
    setCurrentPhotoIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const getGridClasses = () => {
    switch (layout) {
      case 'grid-large': return 'grid-cols-1 md:grid-cols-2 gap-8';
      case 'grid-medium': return 'grid-cols-2 md:grid-cols-3 gap-6';
      case 'grid-small': return 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';
      case 'masonry': return 'columns-2 md:columns-3 lg:columns-4 gap-4';
      default: return 'grid-cols-2 md:grid-cols-3 gap-6';
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedPhoto) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigatePhoto('prev');
          break;
        case 'ArrowRight':
          navigatePhoto('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, currentPhotoIndex]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      {(showSearch || showFilters || layoutOptions) && (
        <div className="space-y-4">
          {/* Search */}
          {showSearch && (
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search memories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 font-elegant"
              />
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filters */}
            {showFilters && (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={filter === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(category)}
                    className={`rounded-full px-4 py-2 font-elegant font-semibold transition-3d ${
                      filter === category
                        ? 'btn-romantic-3d'
                        : 'btn-romantic-outline-3d'
                    }`}
                  >
                    {category === 'all' ? 'All' : 
                     category === 'favorites' ? 'Favorites' :
                     category === 'recent' ? 'Recent' :
                     category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            )}

            {/* Layout Options */}
            {layoutOptions && (
              <div className="flex items-center gap-2">
                <Button
                  variant={layout === 'grid-large' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLayout('grid-large')}
                  className="p-2"
                >
                  <Grid2X2 className="w-4 h-4" />
                </Button>
                <Button
                  variant={layout === 'grid-medium' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLayout('grid-medium')}
                  className="p-2"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={layout === 'grid-small' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setLayout('grid-small')}
                  className="p-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground font-elegant text-enhanced">
          {filteredPhotos.length} photo{filteredPhotos.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Photo Grid */}
      <div className={layout === 'masonry' ? getGridClasses() : `grid ${getGridClasses()}`}>
        {filteredPhotos.map((photo) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group cursor-pointer ${layout === 'masonry' ? 'break-inside-avoid mb-4' : ''}`}
            onClick={() => openLightbox(photo)}
          >
            <Card className="overflow-hidden card-romantic-3d">
              <div className="relative">
                <div className={`
                  ${layout === 'grid-large' ? 'aspect-video' : 
                    layout === 'grid-medium' ? 'aspect-square' : 
                    layout === 'grid-small' ? 'aspect-square' : 
                    'aspect-auto'} 
                  bg-gradient-3d-secondary overflow-hidden
                `}>
                  <img
                    src={photo.thumbnail}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                {/* Overlay with actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-3">
                    <Button size="sm" variant="secondary" className="rounded-full p-2">
                      <ZoomIn className="w-4 h-4" />
                    </Button>
                    {onPhotoLike && (
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="rounded-full p-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPhotoLike(photo.id);
                        }}
                      >
                        <Heart className={`w-4 h-4 ${photo.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                    )}
                    <Button size="sm" variant="secondary" className="rounded-full p-2">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Favorite badge */}
                {photo.favorite && (
                  <div className="absolute top-2 right-2">
                    <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                  </div>
                )}
              </div>

              {/* Photo Info */}
              {layout !== 'grid-small' && (
                <div className="p-4 space-y-2">
                  <h4 className="font-elegant font-semibold text-lg text-title-3d">
                    {photo.title}
                  </h4>
                  
                  <div className="flex items-center text-sm text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="font-elegant">
                        {new Date(photo.date).toLocaleDateString()}
                      </span>
                    </div>
                    {photo.location && (
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="font-elegant">{photo.location}</span>
                      </div>
                    )}
                  </div>

                  {photo.description && layout === 'grid-large' && (
                    <p className="text-muted-foreground text-sm font-elegant text-enhanced">
                      {photo.description}
                    </p>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs font-elegant">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={closeLightbox}
                className="absolute top-4 right-4 z-10 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('prev');
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-2"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  navigatePhoto('next');
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full p-2"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>

              {/* Photo */}
              <motion.div
                key={selectedPhoto.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="max-w-4xl max-h-full"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-3d-strong"
                />
                
                {/* Photo details */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-6 rounded-b-lg">
                  <h3 className="text-white font-elegant font-bold text-xl mb-2">
                    {selectedPhoto.title}
                  </h3>
                  {selectedPhoto.description && (
                    <p className="text-white/80 font-elegant mb-3">
                      {selectedPhoto.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-white/70 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-elegant">
                          {new Date(selectedPhoto.date).toLocaleDateString()}
                        </span>
                      </div>
                      {selectedPhoto.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          <span className="font-elegant">{selectedPhoto.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {onPhotoLike && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onPhotoLike(selectedPhoto.id)}
                          className="rounded-full p-2"
                        >
                          <Heart className={`w-4 h-4 ${selectedPhoto.favorite ? 'fill-red-500 text-red-500' : ''}`} />
                        </Button>
                      )}
                      <Button variant="secondary" size="sm" className="rounded-full p-2">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" size="sm" className="rounded-full p-2">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};