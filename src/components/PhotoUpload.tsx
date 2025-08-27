import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Camera, Plus, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhotoUploadProps {
  onPhotosUploaded: (photos: File[]) => void;
  albumId?: string;
  maxFiles?: number;
  acceptedTypes?: string[];
}

interface PreviewPhoto {
  file: File;
  preview: string;
  id: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotosUploaded,
  albumId,
  maxFiles = 20,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic']
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedPhotos, setSelectedPhotos] = useState<PreviewPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPreview = useCallback((file: File): PreviewPhoto => {
    return {
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    };
  }, []);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      return acceptedTypes.includes(file.type) && file.size < 10 * 1024 * 1024; // 10MB limit
    });

    const remainingSlots = maxFiles - selectedPhotos.length;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    const newPreviews = filesToAdd.map(createPreview);
    setSelectedPhotos(prev => [...prev, ...newPreviews]);
  }, [acceptedTypes, maxFiles, selectedPhotos.length, createPreview]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removePhoto = useCallback((id: string) => {
    setSelectedPhotos(prev => {
      const updated = prev.filter(photo => photo.id !== id);
      // Clean up object URL
      const photoToRemove = prev.find(photo => photo.id === id);
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.preview);
      }
      return updated;
    });
  }, []);

  const handleUpload = async () => {
    if (selectedPhotos.length === 0) return;

    setIsUploading(true);
    try {
      const files = selectedPhotos.map(photo => photo.file);
      await onPhotosUploaded(files);
      
      // Clean up previews
      selectedPhotos.forEach(photo => URL.revokeObjectURL(photo.preview));
      setSelectedPhotos([]);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Drag & Drop Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragOver 
            ? 'border-primary bg-primary/5 shadow-3d-medium' 
            : 'border-muted-foreground/30 hover:border-primary/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
          <motion.div
            animate={{ 
              scale: isDragOver ? 1.1 : 1,
              rotate: isDragOver ? 5 : 0 
            }}
            className="mb-4"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center shadow-3d-soft">
              <Upload className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </motion.div>
          
          <h3 className="font-elegant font-bold text-xl text-title-3d mb-2">
            Upload Your Memories
          </h3>
          <p className="text-muted-foreground font-elegant text-enhanced mb-4">
            Drag & drop photos here or click to browse
          </p>
          <p className="text-sm text-muted-foreground font-elegant">
            Supports JPEG, PNG, WebP, HEIC • Max 10MB per file • Up to {maxFiles} photos
          </p>
        </div>
      </Card>

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Photo Previews */}
      <AnimatePresence>
        {selectedPhotos.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-elegant font-bold text-lg text-title-3d">
                Selected Photos ({selectedPhotos.length})
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  selectedPhotos.forEach(photo => URL.revokeObjectURL(photo.preview));
                  setSelectedPhotos([]);
                }}
                className="btn-romantic-outline-3d"
              >
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {selectedPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative group card-romantic-3d overflow-hidden"
                >
                  <div className="aspect-square bg-gradient-3d-secondary rounded-xl overflow-hidden">
                    <img
                      src={photo.preview}
                      alt={photo.file.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full p-0 shadow-3d-soft"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  
                  <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                    <p className="text-white text-xs font-elegant truncate">
                      {photo.file.name}
                    </p>
                    <p className="text-white/70 text-xs font-elegant">
                      {(photo.file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleUpload}
                disabled={isUploading || selectedPhotos.length === 0}
                className="btn-romantic-3d text-lg px-10 py-4"
              >
                {isUploading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"
                    />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 mr-3" />
                    Upload {selectedPhotos.length} Photo{selectedPhotos.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};