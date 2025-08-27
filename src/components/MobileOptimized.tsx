import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useIsMobile, useIsTouchDevice, useHapticFeedback } from '@/hooks/use-device';
import { 
  MoreVertical, 
  Share, 
  Download, 
  Heart,
  Menu,
  X
} from 'lucide-react';

interface MobileOptimizedProps {
  children: React.ReactNode;
  showMobileNav?: boolean;
  title?: string;
  showShareButton?: boolean;
  onShare?: () => void;
}

export const MobileOptimized: React.FC<MobileOptimizedProps> = ({
  children,
  showMobileNav = true,
  title,
  showShareButton = true,
  onShare
}) => {
  const isMobile = useIsMobile();
  const isTouchDevice = useIsTouchDevice();
  const { lightTap, success } = useHapticFeedback();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);

  // PWA Install prompt handling
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        success();
        setIsInstallable(false);
      }
      
      setDeferredPrompt(null);
    }
  };

  const handleShare = async () => {
    lightTap();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Tomoe & Nanami - Our Love Journey',
          text: 'Check out our romantic couple website!',
          url: window.location.href,
        });
        success();
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        success();
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Error copying to clipboard:', error);
      }
    }
    
    onShare?.();
  };

  if (!isMobile && !isTouchDevice) {
    return <>{children}</>;
  }

  return (
    <div className="mobile-optimized min-h-screen">
      {/* Mobile Header */}
      {showMobileNav && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              {title && (
                <h1 className="font-elegant font-semibold text-lg text-title-3d truncate">
                  {title}
                </h1>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {showShareButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="p-2"
                >
                  <Share className="w-5 h-5" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  lightTap();
                  setShowMobileMenu(!showMobileMenu);
                }}
                className="p-2"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <MoreVertical className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              className="absolute top-0 left-0 right-0 bg-background border-b border-border p-4 pt-16"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                {isInstallable && (
                  <Button
                    onClick={handleInstallApp}
                    className="w-full btn-romantic-3d"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Install App
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  onClick={handleShare}
                  className="w-full"
                >
                  <Share className="w-5 h-5 mr-2" />
                  Share Our Love Story
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    lightTap();
                    // Add to home screen or bookmark
                  }}
                  className="w-full"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Add to Favorites
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile content wrapper */}
      <div className={showMobileNav ? 'pt-14 pb-24 lg:pt-20 lg:pb-6' : 'pb-24 lg:pb-6'}>
        {children}
      </div>

      {/* PWA Install Banner */}
      <AnimatePresence>
        {isInstallable && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 left-4 right-4 z-40"
          >
            <div className="bg-gradient-3d-primary rounded-xl p-4 shadow-3d-strong">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-elegant font-semibold mb-1">
                    Install Our Love App
                  </h4>
                  <p className="text-white/80 text-sm font-elegant">
                    Get quick access to your memories anytime
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsInstallable(false)}
                    className="text-white hover:bg-white/20"
                  >
                    Later
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleInstallApp}
                    className="bg-white text-primary hover:bg-white/90"
                  >
                    Install
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};