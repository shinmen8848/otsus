import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  FolderPlus, 
  Camera, 
  Calendar,
  MapPin,
  Heart,
  Users,
  Lock,
  Globe,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoAlbum {
  id: string;
  title: string;
  description?: string;
  coverPhoto?: string;
  photoCount: number;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  visibility: 'private' | 'shared' | 'public';
  collaborators?: string[];
  category: string;
}

interface PhotoAlbumManagerProps {
  albums: PhotoAlbum[];
  onCreateAlbum: (album: Omit<PhotoAlbum, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onEditAlbum: (albumId: string, updates: Partial<PhotoAlbum>) => void;
  onDeleteAlbum: (albumId: string) => void;
  onSelectAlbum: (albumId: string) => void;
  selectedAlbumId?: string;
}

export const PhotoAlbumManager: React.FC<PhotoAlbumManagerProps> = ({
  albums,
  onCreateAlbum,
  onEditAlbum,
  onDeleteAlbum,
  onSelectAlbum,
  selectedAlbumId
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'photos'>('date');
  const [filterBy, setFilterBy] = useState<string>('all');

  const [newAlbum, setNewAlbum] = useState({
    title: '',
    description: '',
    category: 'memories',
    visibility: 'private' as const,
    tags: [] as string[],
    photoCount: 0,
    collaborators: []
  });

  const categories = [
    { id: 'memories', label: 'Memories', icon: Heart },
    { id: 'dates', label: 'Romantic Dates', icon: Calendar },
    { id: 'travel', label: 'Adventures', icon: MapPin },
    { id: 'milestones', label: 'Milestones', icon: Camera },
    { id: 'everyday', label: 'Everyday Magic', icon: Users }
  ];

  const handleCreateAlbum = () => {
    if (!newAlbum.title.trim()) return;

    onCreateAlbum({
      title: newAlbum.title,
      description: newAlbum.description,
      category: newAlbum.category,
      visibility: newAlbum.visibility,
      tags: newAlbum.tags,
      photoCount: 0,
      collaborators: newAlbum.collaborators
    });

    setNewAlbum({
      title: '',
      description: '',
      category: 'memories',
      visibility: 'private',
      tags: [],
      photoCount: 0,
      collaborators: []
    });
    setIsCreating(false);
  };

  const addTag = (tag: string) => {
    if (tag.trim() && !newAlbum.tags.includes(tag.trim())) {
      setNewAlbum(prev => ({
        ...prev,
        tags: [...prev.tags, tag.trim()]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewAlbum(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const sortedAlbums = [...albums].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'photos':
        return b.photoCount - a.photoCount;
      case 'date':
      default:
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const filteredAlbums = sortedAlbums.filter(album => {
    if (filterBy === 'all') return true;
    return album.category === filterBy;
  });

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'private': return <Lock className="w-4 h-4" />;
      case 'shared': return <Users className="w-4 h-4" />;
      case 'public': return <Globe className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-accent text-4xl font-bold text-gradient-romantic-3d text-title-3d">
            Photo Albums
          </h2>
          <p className="text-muted-foreground font-elegant text-enhanced mt-2">
            Organize your precious memories into beautiful albums
          </p>
        </div>
        
        <Button
          onClick={() => setIsCreating(true)}
          className="btn-romantic-3d"
        >
          <FolderPlus className="w-5 h-5 mr-2" />
          Create Album
        </Button>
      </div>

      {/* Filters and sorting */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label className="font-elegant text-sm">Category:</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterBy === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterBy('all')}
              className="rounded-full px-4 py-2 font-elegant"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={filterBy === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterBy(category.id)}
                className="rounded-full px-4 py-2 font-elegant"
              >
                <category.icon className="w-4 h-4 mr-1" />
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Label className="font-elegant text-sm">Sort by:</Label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border rounded-md font-elegant text-sm bg-background"
          >
            <option value="date">Last Updated</option>
            <option value="name">Name</option>
            <option value="photos">Photo Count</option>
          </select>
        </div>
      </div>

      {/* Create Album Form */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="card-romantic-3d">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-elegant font-bold text-xl text-title-3d">
                    Create New Album
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCreating(false)}
                    className="rounded-full p-2"
                  >
                    ×
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="font-elegant font-semibold">Album Title *</Label>
                      <Input
                        placeholder="Our Amazing Adventure"
                        value={newAlbum.title}
                        onChange={(e) => setNewAlbum(prev => ({ ...prev, title: e.target.value }))}
                        className="font-elegant"
                      />
                    </div>

                    <div>
                      <Label className="font-elegant font-semibold">Description</Label>
                      <Textarea
                        placeholder="Tell the story behind this album..."
                        value={newAlbum.description}
                        onChange={(e) => setNewAlbum(prev => ({ ...prev, description: e.target.value }))}
                        className="font-elegant"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label className="font-elegant font-semibold">Category</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {categories.map((category) => (
                          <Button
                            key={category.id}
                            variant={newAlbum.category === category.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setNewAlbum(prev => ({ ...prev, category: category.id }))}
                            className="justify-start font-elegant"
                          >
                            <category.icon className="w-4 h-4 mr-2" />
                            {category.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="font-elegant font-semibold">Visibility</Label>
                      <div className="space-y-2 mt-2">
                        {[
                          { id: 'private', label: 'Private', desc: 'Only you can see this album' },
                          { id: 'shared', label: 'Shared', desc: 'Share with specific people' },
                          { id: 'public', label: 'Public', desc: 'Anyone can view this album' }
                        ].map((option) => (
                          <Button
                            key={option.id}
                            variant={newAlbum.visibility === option.id ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setNewAlbum(prev => ({ ...prev, visibility: option.id as any }))}
                            className="w-full justify-start font-elegant"
                          >
                            {getVisibilityIcon(option.id)}
                            <div className="ml-3 text-left">
                              <div className="font-semibold">{option.label}</div>
                              <div className="text-xs text-muted-foreground">{option.desc}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="font-elegant font-semibold">Tags</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newAlbum.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="font-elegant cursor-pointer"
                            onClick={() => removeTag(tag)}
                          >
                            {tag} ×
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add tags (press Enter)"
                        className="mt-2 font-elegant"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreating(false)}
                    className="btn-romantic-outline-3d"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateAlbum}
                    disabled={!newAlbum.title.trim()}
                    className="btn-romantic-3d"
                  >
                    <FolderPlus className="w-5 h-5 mr-2" />
                    Create Album
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Albums Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAlbums.map((album) => (
          <motion.div
            key={album.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`card-romantic-3d cursor-pointer transition-all duration-300 ${
              selectedAlbumId === album.id ? 'ring-2 ring-primary shadow-3d-strong' : ''
            }`}
            onClick={() => onSelectAlbum(album.id)}
          >
            {/* Cover Photo */}
            <div className="aspect-video bg-gradient-3d-primary rounded-xl mb-4 overflow-hidden relative">
              {album.coverPhoto ? (
                <img
                  src={album.coverPhoto}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-white/70 drop-shadow-lg" />
                </div>
              )}
              
              {/* Album stats overlay */}
              <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
                <span className="text-white text-sm font-elegant font-semibold">
                  {album.photoCount} photos
                </span>
              </div>

              {/* Visibility indicator */}
              <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-1">
                {getVisibilityIcon(album.visibility)}
              </div>
            </div>

            {/* Album Info */}
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h3 className="font-elegant font-bold text-lg text-title-3d flex-1">
                  {album.title}
                </h3>
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAlbum(album.id);
                    }}
                    className="p-1 rounded-full"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteAlbum(album.id);
                    }}
                    className="p-1 rounded-full text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {album.description && (
                <p className="text-muted-foreground text-sm font-elegant text-enhanced line-clamp-2">
                  {album.description}
                </p>
              )}

              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 mr-1" />
                <span className="font-elegant">
                  Updated {new Date(album.updatedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Tags */}
              {album.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {album.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-elegant">
                      {tag}
                    </Badge>
                  ))}
                  {album.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs font-elegant">
                      +{album.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty state */}
      {filteredAlbums.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gradient-3d-secondary rounded-full flex items-center justify-center mb-6 shadow-3d-soft">
            <Camera className="w-12 h-12 text-white/70 drop-shadow-lg" />
          </div>
          <h3 className="font-elegant font-bold text-xl text-title-3d mb-2">
            No Albums Found
          </h3>
          <p className="text-muted-foreground font-elegant text-enhanced mb-6">
            {albums.length === 0 
              ? "Create your first album to start organizing your memories"
              : "Try adjusting your filters to see more albums"
            }
          </p>
          <Button
            onClick={() => setIsCreating(true)}
            className="btn-romantic-3d"
          >
            <FolderPlus className="w-5 h-5 mr-2" />
            Create Your First Album
          </Button>
        </div>
      )}
    </div>
  );
};