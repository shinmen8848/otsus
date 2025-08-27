import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wand2, 
  Image, 
  Tags, 
  FolderOpen, 
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Star,
  Calendar,
  MapPin,
  Sparkles,
  Brain,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiService } from '@/lib/ai';

interface Photo {
  id: string;
  title: string;
  description?: string;
  date: string;
  location?: string;
  tags: string[];
  category?: string;
  mood?: string;
  aiAnalyzed?: boolean;
}

interface PhotoAnalysis {
  tags: string[];
  category: string;
  mood: string;
  description: string;
  suggestions: string[];
}

interface AIPhotoOrganizerProps {
  photos: Photo[];
  onPhotosUpdated?: (photos: Photo[]) => void;
  onAlbumsGenerated?: (albums: Record<string, string[]>) => void;
}

export const AIPhotoOrganizer: React.FC<AIPhotoOrganizerProps> = ({
  photos,
  onPhotosUpdated,
  onAlbumsGenerated
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPhoto, setCurrentPhoto] = useState<string>('');
  const [analyzedPhotos, setAnalyzedPhotos] = useState<Photo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [suggestedAlbums, setSuggestedAlbums] = useState<Record<string, string[]>>({});

  const unanalyzedPhotos = photos.filter(photo => !photo.aiAnalyzed);
  const analysisNeeded = unanalyzedPhotos.length > 0;

  const analyzePhotos = async () => {
    if (unanalyzedPhotos.length === 0) return;

    setIsAnalyzing(true);
    setError(null);
    setProgress(0);
    setShowResults(false);

    const updatedPhotos = [...photos];
    const newlyAnalyzed: Photo[] = [];

    try {
      for (let i = 0; i < unanalyzedPhotos.length; i++) {
        const photo = unanalyzedPhotos[i];
        setCurrentPhoto(photo.title);

        try {
          const analysis: PhotoAnalysis = await aiService.analyzePhoto({
            title: photo.title,
            description: photo.description,
            date: photo.date,
            location: photo.location,
            existingTags: photo.tags
          });

          // Update photo with AI analysis
          const photoIndex = updatedPhotos.findIndex(p => p.id === photo.id);
          if (photoIndex !== -1) {
            updatedPhotos[photoIndex] = {
              ...updatedPhotos[photoIndex],
              tags: [...new Set([...photo.tags, ...analysis.tags])],
              category: analysis.category,
              mood: analysis.mood,
              description: analysis.description,
              aiAnalyzed: true
            };
            newlyAnalyzed.push(updatedPhotos[photoIndex]);
          }
        } catch (photoError) {
          console.error(`Error analyzing photo ${photo.id}:`, photoError);
          // Mark as analyzed even if failed to avoid re-processing
          const photoIndex = updatedPhotos.findIndex(p => p.id === photo.id);
          if (photoIndex !== -1) {
            updatedPhotos[photoIndex].aiAnalyzed = true;
          }
        }

        setProgress(((i + 1) / unanalyzedPhotos.length) * 100);
      }

      // Generate album suggestions
      try {
        const albums = await aiService.organizePhotos(
          updatedPhotos.map(p => ({
            id: p.id,
            title: p.title,
            description: p.description,
            date: p.date,
            tags: p.tags
          }))
        );
        setSuggestedAlbums(albums);
        onAlbumsGenerated?.(albums);
      } catch (albumError) {
        console.error('Error generating album suggestions:', albumError);
      }

      setAnalyzedPhotos(newlyAnalyzed);
      onPhotosUpdated?.(updatedPhotos);
      setShowResults(true);
    } catch (err) {
      setError('Failed to analyze photos. Please try again.');
      console.error('Photo analysis error:', err);
    } finally {
      setIsAnalyzing(false);
      setCurrentPhoto('');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'dates': return <Calendar className="w-4 h-4" />;
      case 'travel': return <MapPin className="w-4 h-4" />;
      case 'milestones': return <Star className="w-4 h-4" />;
      default: return <Image className="w-4 h-4" />;
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'text-yellow-600 bg-yellow-100';
      case 'romantic': return 'text-pink-600 bg-pink-100';
      case 'adventurous': return 'text-blue-600 bg-blue-100';
      case 'peaceful': return 'text-green-600 bg-green-100';
      case 'nostalgic': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-3d-primary flex items-center justify-center shadow-3d-soft">
            <Wand2 className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
          <div>
            <h3 className="font-accent text-2xl font-bold text-gradient-romantic-3d">
              AI Photo Organizer
            </h3>
            <p className="text-muted-foreground font-elegant">
              Let AI organize and enhance your photo memories
            </p>
          </div>
        </div>
      </div>

      {/* Analysis Status */}
      <Card className="card-romantic-3d">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <h4 className="font-elegant font-semibold text-lg">Analysis Status</h4>
              <p className="text-sm text-muted-foreground">
                {photos.length} total photos • {photos.filter(p => p.aiAnalyzed).length} analyzed
              </p>
            </div>
          </div>
          
          {analysisNeeded && (
            <Button
              onClick={analyzePhotos}
              disabled={isAnalyzing}
              className="btn-romantic-3d"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analyze {unanalyzedPhotos.length} Photos
                </>
              )}
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <div className="space-y-3">
            <Progress value={progress} className="h-2" />
            <div className="flex items-center text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              Analyzing: {currentPhoto}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center space-x-2 text-destructive bg-destructive/10 p-3 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <span className="font-elegant">{error}</span>
          </div>
        )}

        {/* No Analysis Needed */}
        {!analysisNeeded && !isAnalyzing && (
          <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span className="font-elegant">All photos have been analyzed!</span>
          </div>
        )}
      </Card>

      {/* Analysis Results */}
      <AnimatePresence>
        {showResults && analyzedPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Recently Analyzed Photos */}
            <Card className="card-romantic-3d">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <h4 className="font-elegant font-semibold text-lg">Recently Analyzed</h4>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyzedPhotos.slice(0, 6).map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-card hover:shadow-3d-soft transition-3d"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h5 className="font-elegant font-semibold text-sm truncate flex-1">
                        {photo.title}
                      </h5>
                      {photo.category && (
                        <div className="flex items-center ml-2">
                          {getCategoryIcon(photo.category)}
                        </div>
                      )}
                    </div>
                    
                    {photo.mood && (
                      <Badge className={`text-xs mb-2 ${getMoodColor(photo.mood)}`}>
                        {photo.mood}
                      </Badge>
                    )}
                    
                    <div className="flex flex-wrap gap-1">
                      {photo.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {photo.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{photo.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Suggested Albums */}
            {Object.keys(suggestedAlbums).length > 0 && (
              <Card className="card-romantic-3d">
                <div className="flex items-center space-x-3 mb-4">
                  <FolderOpen className="w-6 h-6 text-primary" />
                  <h4 className="font-elegant font-semibold text-lg">Suggested Albums</h4>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries(suggestedAlbums).map(([albumName, photoIds], index) => (
                    <motion.div
                      key={albumName}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card hover:shadow-3d-soft transition-3d"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-3d-secondary flex items-center justify-center shadow-3d-soft">
                          <FolderOpen className="w-4 h-4 text-white drop-shadow-sm" />
                        </div>
                        <div>
                          <h5 className="font-elegant font-semibold">{albumName}</h5>
                          <p className="text-sm text-muted-foreground">
                            {photoIds.length} photo{photoIds.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="btn-romantic-outline-3d">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats */}
      {photos.length > 0 && (
        <Card className="card-romantic-3d">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                {photos.filter(p => p.category).length}
              </div>
              <div className="text-sm text-muted-foreground font-elegant">Categorized</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                {photos.reduce((sum, p) => sum + p.tags.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground font-elegant">Total Tags</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                {photos.filter(p => p.mood).length}
              </div>
              <div className="text-sm text-muted-foreground font-elegant">Mood Tagged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                {Object.keys(suggestedAlbums).length}
              </div>
              <div className="text-sm text-muted-foreground font-elegant">Suggested Albums</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};