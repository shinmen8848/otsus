import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, 
  Download, 
  Upload, 
  Trash2, 
  Star, 
  StarOff, 
  Search, 
  Filter,
  Plus,
  Eye,
  Copy,
  Share
} from 'lucide-react';
import { ColorGradingPreset, ColorGradingSettings } from '@/types/color-grading';

interface PresetManagerProps {
  presets: ColorGradingPreset[];
  currentSettings: ColorGradingSettings;
  onLoadPreset: (preset: ColorGradingPreset) => void;
  onSavePreset: (name: string, description?: string, category?: ColorGradingPreset['category']) => void;
  onDeletePreset: (presetId: string) => void;
  onExportPreset?: (preset: ColorGradingPreset) => void;
  onImportPreset?: (file: File) => void;
  className?: string;
}

export const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  currentSettings,
  onLoadPreset,
  onSavePreset,
  onDeletePreset,
  onExportPreset,
  onImportPreset,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDescription, setNewPresetDescription] = useState('');
  const [newPresetCategory, setNewPresetCategory] = useState<ColorGradingPreset['category']>('custom');

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('colorGradingFavorites');
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('colorGradingFavorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  const toggleFavorite = (presetId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(presetId)) {
      newFavorites.delete(presetId);
    } else {
      newFavorites.add(presetId);
    }
    setFavorites(newFavorites);
  };

  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           selectedCategory === 'favorites' && favorites.has(preset.id) ||
                           preset.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSavePreset = () => {
    if (!newPresetName.trim()) return;
    
    onSavePreset(newPresetName, newPresetDescription, newPresetCategory);
    setNewPresetName('');
    setNewPresetDescription('');
    setNewPresetCategory('custom');
    setShowSaveDialog(false);
  };

  const handleExportPreset = (preset: ColorGradingPreset) => {
    const dataStr = JSON.stringify(preset, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${preset.name.replace(/\s+/g, '_')}_preset.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    onExportPreset?.(preset);
  };

  const handleImportPreset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImportPreset) {
      onImportPreset(file);
    }
  };

  const getCategoryIcon = (category: ColorGradingPreset['category']) => {
    switch (category) {
      case 'portrait': return '👤';
      case 'landscape': return '🏞️';
      case 'vintage': return '📸';
      case 'cinematic': return '🎬';
      default: return '⚙️';
    }
  };

  const getCategoryColor = (category: ColorGradingPreset['category']) => {
    switch (category) {
      case 'portrait': return 'bg-pink-100 text-pink-800';
      case 'landscape': return 'bg-green-100 text-green-800';
      case 'vintage': return 'bg-amber-100 text-amber-800';
      case 'cinematic': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={`p-4 card-color-grading ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-elegant font-semibold text-lg">Preset Manager</h3>
        
        <div className="flex items-center gap-2">
          <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-gradient-color-grading text-white">
                <Save className="w-4 h-4 mr-1" />
                Save Preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Color Grading Preset</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="preset-name">Preset Name</Label>
                  <Input
                    id="preset-name"
                    value={newPresetName}
                    onChange={(e) => setNewPresetName(e.target.value)}
                    placeholder="Enter preset name..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="preset-description">Description (Optional)</Label>
                  <Textarea
                    id="preset-description"
                    value={newPresetDescription}
                    onChange={(e) => setNewPresetDescription(e.target.value)}
                    placeholder="Describe this preset..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="preset-category">Category</Label>
                  <Select value={newPresetCategory} onValueChange={(value: ColorGradingPreset['category']) => setNewPresetCategory(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                      <SelectItem value="vintage">Vintage</SelectItem>
                      <SelectItem value="cinematic">Cinematic</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePreset} disabled={!newPresetName.trim()}>
                    Save Preset
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" size="sm" onClick={() => document.getElementById('import-preset')?.click()}>
            <Upload className="w-4 h-4 mr-1" />
            Import
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search presets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
              <SelectItem value="vintage">Vintage</SelectItem>
              <SelectItem value="cinematic">Cinematic</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          
          <Badge variant="outline" className="ml-auto">
            {filteredPresets.length} presets
          </Badge>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="grid gap-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredPresets.map((preset) => (
            <motion.div
              key={preset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="group"
            >
              <Card className="p-3 hover:shadow-3d-soft transition-all duration-200 cursor-pointer border border-border/50 hover:border-primary/30">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0" onClick={() => onLoadPreset(preset)}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">{getCategoryIcon(preset.category)}</span>
                      <h4 className="font-elegant font-medium text-sm truncate">{preset.name}</h4>
                      <Badge className={`text-xs ${getCategoryColor(preset.category)}`}>
                        {preset.category}
                      </Badge>
                    </div>
                    
                    {preset.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {preset.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{new Date(preset.createdAt).toLocaleDateString()}</span>
                      {preset.tags.length > 0 && (
                        <div className="flex gap-1">
                          {preset.tags.slice(0, 2).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(preset.id);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      {favorites.has(preset.id) ? (
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <StarOff className="w-3 h-3" />
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExportPreset(preset);
                      }}
                      className="h-6 w-6 p-0"
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePreset(preset.id);
                      }}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredPresets.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No presets found</p>
            <p className="text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Hidden file input for import */}
      <input
        id="import-preset"
        type="file"
        accept=".json"
        onChange={handleImportPreset}
        className="hidden"
      />
    </Card>
  );
};
