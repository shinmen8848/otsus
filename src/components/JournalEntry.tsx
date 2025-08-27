import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  Calendar, 
  Clock, 
  Heart, 
  Edit3, 
  Trash2, 
  Share2, 
  Lock,
  BookOpen,
  Tag,
  Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { RichTextEditor } from '@/components/RichTextEditor';

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

interface JournalEntryProps {
  entry?: JournalEntry;
  isEditing?: boolean;
  isNew?: boolean;
  onSave?: (entry: Omit<JournalEntry, 'id' | 'lastModified'>) => void;
  onEdit?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
  onToggleFavorite?: (entryId: string) => void;
  onToggleShare?: (entryId: string) => void;
  onCancel?: () => void;
  currentUser?: 'tomoe' | 'nanami';
}

export const JournalEntryComponent: React.FC<JournalEntryProps> = ({
  entry,
  isEditing = false,
  isNew = false,
  onSave,
  onEdit,
  onDelete,
  onToggleFavorite,
  onToggleShare,
  onCancel,
  currentUser = 'tomoe'
}) => {
  const [editData, setEditData] = useState({
    title: entry?.title || '',
    content: entry?.content || '',
    mood: entry?.mood || '',
    tags: entry?.tags || [],
    favorite: entry?.favorite || false,
    shared: entry?.shared || false,
    author: entry?.author || currentUser
  });

  const [newTag, setNewTag] = useState('');

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'love', emoji: '❤️', label: 'In Love' },
    { id: 'excited', emoji: '🎉', label: 'Excited' },
    { id: 'peaceful', emoji: '😌', label: 'Peaceful' },
    { id: 'nostalgic', emoji: '🥺', label: 'Nostalgic' },
    { id: 'grateful', emoji: '🙏', label: 'Grateful' },
    { id: 'dreamy', emoji: '💭', label: 'Dreamy' },
    { id: 'romantic', emoji: '💕', label: 'Romantic' }
  ];

  const handleSave = () => {
    if (!editData.title.trim() || !editData.content.trim() || !onSave) return;

    onSave({
      title: editData.title,
      content: editData.content,
      date: entry?.date || new Date().toISOString(),
      mood: editData.mood,
      tags: editData.tags,
      favorite: editData.favorite,
      shared: editData.shared,
      author: editData.author
    });
  };

  const addTag = () => {
    if (newTag.trim() && !editData.tags.includes(newTag.trim())) {
      setEditData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const getAuthorColor = (author: string) => {
    switch (author) {
      case 'tomoe': return 'from-primary to-secondary';
      case 'nanami': return 'from-secondary to-accent';
      case 'both': return 'from-primary via-secondary to-accent';
      default: return 'from-primary to-secondary';
    }
  };

  if (isEditing || isNew) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="card-romantic-3d">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-accent text-2xl font-bold text-gradient-romantic-3d">
                {isNew ? 'New Journal Entry' : 'Edit Entry'}
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={onCancel}
                  className="btn-romantic-outline-3d"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!editData.title.trim() || !editData.content.trim() || !onSave}
                  className="btn-romantic-3d"
                >
                  {isNew ? 'Create Entry' : 'Save Changes'}
                </Button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="font-elegant font-semibold text-title-3d mb-2 block">
                Title
              </label>
              <Input
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="What's on your mind today?"
                className="font-elegant text-lg"
              />
            </div>

            {/* Author & Settings */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="font-elegant font-semibold text-title-3d mb-2 block">
                  Author
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'tomoe', label: 'Tomoe' },
                    { id: 'nanami', label: 'Nanami' },
                    { id: 'both', label: 'Both of Us' }
                  ].map((author) => (
                    <Button
                      key={author.id}
                      variant={editData.author === author.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditData(prev => ({ ...prev, author: author.id as any }))}
                      className="w-full justify-start font-elegant"
                    >
                      {author.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-elegant font-semibold text-title-3d mb-2 block">
                  Mood
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {moods.map((mood) => (
                    <Button
                      key={mood.id}
                      variant={editData.mood === mood.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setEditData(prev => ({ ...prev, mood: mood.id }))}
                      className="justify-start text-xs font-elegant"
                    >
                      {mood.emoji} {mood.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-elegant font-semibold text-title-3d mb-2 block">
                  Settings
                </label>
                <div className="space-y-2">
                  <Button
                    variant={editData.favorite ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditData(prev => ({ ...prev, favorite: !prev.favorite }))}
                    className="w-full justify-start font-elegant"
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Favorite
                  </Button>
                  <Button
                    variant={editData.shared ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setEditData(prev => ({ ...prev, shared: !prev.shared }))}
                    className="w-full justify-start font-elegant"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Shared
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="font-elegant font-semibold text-title-3d mb-2 block">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {editData.tags.map((tag) => (
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
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="font-elegant"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                />
                <Button onClick={addTag} variant="outline" size="sm">
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Rich Text Editor */}
        <RichTextEditor
          value={editData.content}
          onChange={(content) => setEditData(prev => ({ ...prev, content }))}
          placeholder="Share your thoughts, dreams, and feelings..."
          onSave={() => handleSave()}
        />
      </motion.div>
    );
  }

  // Display mode
  if (!entry) return null;

  const selectedMood = moods.find(m => m.id === entry.mood);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-romantic-3d"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getAuthorColor(entry.author)} shadow-3d-soft`} />
            <h2 className="font-elegant font-bold text-2xl text-title-3d">
              {entry.title}
            </h2>
            {entry.favorite && (
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="font-elegant">
                {new Date(entry.date).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-elegant">
                {new Date(entry.lastModified).toLocaleTimeString()}
              </span>
            </div>
            {selectedMood && (
              <div className="flex items-center">
                <span className="mr-2">{selectedMood.emoji}</span>
                <span className="font-elegant">{selectedMood.label}</span>
              </div>
            )}
            <div className="flex items-center">
              {entry.shared ? (
                <Share2 className="w-4 h-4 text-green-500" />
              ) : (
                <Lock className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(entry.id)}
              className="p-2 rounded-full"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleFavorite(entry.id)}
              className="p-2 rounded-full"
            >
              <Heart className={`w-4 h-4 ${entry.favorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
          )}
          {onToggleShare && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleShare(entry.id)}
              className="p-2 rounded-full"
            >
              <Share2 className={`w-4 h-4 ${entry.shared ? 'text-green-500' : ''}`} />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(entry.id)}
              className="p-2 rounded-full text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {entry.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="font-elegant">
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Content */}
      <RichTextEditor
        value={entry.content}
        onChange={() => {}}
        isReadOnly={true}
      />
    </motion.div>
  );
};