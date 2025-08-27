import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Heart, Calendar, MapPin, Plus, Upload, FolderOpen, Image as ImageIcon } from 'lucide-react';
import { PhotoUpload } from '@/components/PhotoUpload';
import { PhotoGallery } from '@/components/PhotoGallery';
import { PhotoAlbumManager } from '@/components/PhotoAlbumManager';
import { SectionLayout, ContentCard, GridLayout } from '@/components/SectionLayout';
import { StaggeredChildren } from '@/components/PageTransition';
import { motion, AnimatePresence } from 'framer-motion';
import sakuraTulipPattern from '@/assets/sakura-tulip-pattern.jpg';

interface Album {
  id: string;
  title: string;
  description?: string;
  coverPhoto?: string;
  photoCount: number;
  category: string;
  createdAt: string;
}

interface Photo {
  id: string;
  title: string;
  description?: string;
  url: string;
  albumId?: string;
  category: string;
  createdAt: string;
  tags?: string[];
}

export const MemoriesSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'albums' | 'gallery' | 'upload'>('albums');
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Memories' },
    { id: 'dates', label: 'Romantic Dates' },
    { id: 'travel', label: 'Adventures' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'everyday', label: 'Everyday Magic' }
  ];

  const viewModes = [
    { id: 'albums', label: 'Albums', icon: FolderOpen },
    { id: 'gallery', label: 'All Photos', icon: ImageIcon },
    { id: 'upload', label: 'Upload', icon: Upload }
  ];

  // Sample data - in real app, this would come from Supabase
  useEffect(() => {
    // Initialize with sample data
    const sampleAlbums = [
      {
        id: '1',
        title: 'Our First Dates',
        description: 'Beautiful moments from our early romance',
        photoCount: 12,
        createdAt: '2023-02-14T00:00:00Z',
        updatedAt: '2023-02-20T00:00:00Z',
        tags: ['romance', 'cherry-blossoms', 'first-kiss'],
        visibility: 'private' as const,
        category: 'dates',
        coverPhoto: undefined
      },
      {
        id: '2',
        title: 'Travel Adventures',
        description: 'Exploring the world together',
        photoCount: 24,
        createdAt: '2023-03-01T00:00:00Z',
        updatedAt: '2023-03-25T00:00:00Z',
        tags: ['travel', 'adventure', 'mountains'],
        visibility: 'shared' as const,
        category: 'travel',
        coverPhoto: undefined
      },
      {
        id: '3',
        title: 'Milestone Celebrations',
        description: 'Special moments in our relationship',
        photoCount: 8,
        createdAt: '2023-05-25T00:00:00Z',
        updatedAt: '2023-11-15T00:00:00Z',
        tags: ['milestones', 'celebrations', 'love'],
        visibility: 'private' as const,
        category: 'milestones',
        coverPhoto: undefined
      }
    ];

    const samplePhotos = [
      {
        id: '1',
        url: '/api/photos/cherry-blossom-kiss.jpg',
        thumbnail: '/api/photos/cherry-blossom-kiss-thumb.jpg',
        title: 'First Kiss Under Cherry Blossoms',
        description: 'The moment that started it all',
        date: '2023-02-14',
        location: 'Tokyo Park',
        tags: ['romance', 'first-kiss', 'cherry-blossoms'],
        category: 'dates',
        favorite: true,
        albumId: '1'
      },
      {
        id: '2',
        url: '/api/photos/mount-fuji-sunrise.jpg',
        thumbnail: '/api/photos/mount-fuji-sunrise-thumb.jpg',
        title: 'Sunrise at Mount Fuji',
        description: 'Watching the world wake up together',
        date: '2023-03-20',
        location: 'Mount Fuji',
        tags: ['travel', 'sunrise', 'mountains'],
        category: 'travel',
        favorite: false,
        albumId: '2'
      },
      {
        id: '3',
        url: '/api/photos/100-days-celebration.jpg',
        thumbnail: '/api/photos/100-days-celebration-thumb.jpg',
        title: '100 Days Together',
        description: 'Celebrating our first major milestone',
        date: '2023-05-25',
        location: 'Our Favorite Café',
        tags: ['milestone', 'celebration', 'cake'],
        category: 'milestones',
        favorite: true,
        albumId: '3'
      }
    ];

    setAlbums(sampleAlbums);
    setPhotos(samplePhotos);
  }, []);

  const handleCreateAlbum = async (albumData: Omit<Album, 'id' | 'createdAt'>) => {
    setIsLoading(true);
    try {
      // In real app, this would save to Supabase
      const newAlbum = {
        ...albumData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        photoCount: 0
      };
      setAlbums(prev => [newAlbum, ...prev]);
    } catch (error) {
      console.error('Failed to create album:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadPhotos = async (files: File[]) => {
    setIsLoading(true);
    try {
      // In real app, this would upload to Vercel Blob and save to Supabase
      const newPhotos = files.map((file, index) => ({
        id: `${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        thumbnail: URL.createObjectURL(file),
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: '',
        date: new Date().toISOString().split('T')[0],
        location: '',
        tags: [],
        category: selectedCategory === 'all' ? 'everyday' : selectedCategory,
        favorite: false,
        albumId: selectedAlbumId || albums[0]?.id || ''
      }));
      
      setPhotos(prev => [...newPhotos, ...prev]);
      
      // Update album photo count
      if (selectedAlbumId) {
        setAlbums(prev => prev.map(album => 
          album.id === selectedAlbumId 
            ? { ...album, photoCount: album.photoCount + files.length }
            : album
        ));
      }
    } catch (error) {
      console.error('Failed to upload photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = (photoId: string) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId ? { ...photo, favorite: !photo.favorite } : photo
    ));
  };

  const filteredPhotos = photos.filter(photo => {
    if (selectedAlbumId && viewMode === 'gallery') {
      return photo.albumId === selectedAlbumId;
    }
    return selectedCategory === 'all' || photo.category === selectedCategory;
  });

  return (
    <section className="min-h-screen py-24 px-6 bg-cherry-garden relative">
      {/* Enhanced cherry and tulip background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${sakuraTulipPattern})` }}
      />
      <div className="absolute inset-0 bg-floral-pattern opacity-40" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-accent text-6xl md:text-7xl font-bold text-gradient-romantic-3d text-title-3d mb-6">
            Our Precious Memories
          </h2>
          <p className="text-2xl text-foreground/80 max-w-3xl mx-auto font-elegant font-medium text-enhanced">
            Every moment we share becomes a treasured memory in our love story
          </p>
        </div>

        {/* Enhanced View Mode Toggle */}
        <div className="flex flex-col gap-6 mb-16">
          <div className="flex flex-wrap justify-center gap-4">
            {viewModes.map((mode) => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? "default" : "outline"}
                  onClick={() => setViewMode(mode.id as 'albums' | 'gallery' | 'upload')}
                  className={`rounded-full px-8 py-4 text-lg font-elegant font-semibold transition-3d ${
                    viewMode === mode.id
                      ? 'btn-romantic-3d'
                      : 'btn-romantic-outline-3d'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {mode.label}
                </Button>
              );
            })}
          </div>

          {/* Category Filter (shown for gallery and upload modes) */}
          {(viewMode === 'gallery' || viewMode === 'upload') && (
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`rounded-full px-6 py-3 font-elegant font-semibold transition-3d ${
                    selectedCategory === category.id
                      ? 'btn-romantic-3d'
                      : 'btn-romantic-outline-3d'
                  }`}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Content Based on View Mode */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {viewMode === 'albums' && (
              <PhotoAlbumManager
                albums={albums}
                onCreateAlbum={handleCreateAlbum}
                onEditAlbum={(albumId, updates) => {
                  setAlbums(prev => prev.map(album => 
                    album.id === albumId ? { ...album, ...updates } : album
                  ));
                }}
                onDeleteAlbum={(albumId) => {
                  setAlbums(prev => prev.filter(album => album.id !== albumId));
                  setPhotos(prev => prev.filter(photo => photo.albumId !== albumId));
                }}
                onSelectAlbum={(albumId) => {
                  setSelectedAlbumId(albumId);
                  setViewMode('gallery');
                }}
                selectedAlbumId={selectedAlbumId}
              />
            )}

            {viewMode === 'gallery' && (
              <div className="space-y-6">
                {selectedAlbumId && (
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedAlbumId(null);
                        setViewMode('albums');
                      }}
                      className="btn-romantic-outline-3d"
                    >
                      ← Back to Albums
                    </Button>
                    <h3 className="font-elegant font-bold text-2xl text-title-3d">
                      {albums.find(a => a.id === selectedAlbumId)?.title || 'Album'}
                    </h3>
                  </div>
                )}
                
                <PhotoGallery
                  photos={filteredPhotos}
                  onPhotoLike={handleToggleFavorite}
                  showFilters={true}
                  showSearch={true}
                  layoutOptions={true}
                />
              </div>
            )}

            {viewMode === 'upload' && (
              <div className="max-w-4xl mx-auto space-y-8">
                {albums.length > 0 && (
                  <div className="text-center">
                    <h3 className="font-elegant font-bold text-2xl text-title-3d mb-4">
                      Upload to Album
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3 mb-6">
                      {albums.map((album) => (
                        <Button
                          key={album.id}
                          variant={selectedAlbumId === album.id ? "default" : "outline"}
                          onClick={() => setSelectedAlbumId(album.id)}
                          className={`rounded-full px-6 py-3 font-elegant transition-3d ${
                            selectedAlbumId === album.id
                              ? 'btn-romantic-3d'
                              : 'btn-romantic-outline-3d'
                          }`}
                        >
                          {album.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <PhotoUpload
                  onPhotosUploaded={handleUploadPhotos}
                  albumId={selectedAlbumId || undefined}
                  maxFiles={20}
                />
                
                {albums.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground font-elegant text-enhanced mb-4">
                      Create an album first to organize your photos
                    </p>
                    <Button
                      onClick={() => setViewMode('albums')}
                      className="btn-romantic-3d"
                    >
                      <FolderOpen className="w-5 h-5 mr-2" />
                      Create Album
                    </Button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};