import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Smartphone, 
  Zap, 
  Wifi, 
  WifiOff,
  Users,
  Timer,
  Volume2,
  VolumeX,
  Settings,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/use-device';

interface ThumbKissSession {
  id: string;
  startTime: Date;
  duration: number;
  kisses: number;
  partner?: string;
}

interface ThumbKissProps {
  isConnected?: boolean;
  partnerName?: string;
  onConnectionRequest?: () => void;
}

export const ThumbKiss: React.FC<ThumbKissProps> = ({
  isConnected = false,
  partnerName = 'Partner',
  onConnectionRequest
}) => {
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState<ThumbKissSession | null>(null);
  const [sessionsToday, setSessionsToday] = useState(0);
  const [totalKisses, setTotalKisses] = useState(0);
  const [lastKissTime, setLastKissTime] = useState<Date | null>(null);
  const [isVibrationEnabled, setIsVibrationEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState(50);

  const { vibrate, lightTap, success } = useHapticFeedback();

  // Check if device supports vibration
  const supportsVibration = 'vibrate' in navigator;

  const startSession = useCallback(() => {
    if (!isConnected) {
      onConnectionRequest?.();
      return;
    }

    const session: ThumbKissSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 0,
      kisses: 0,
      partner: partnerName
    };

    setCurrentSession(session);
    setIsActive(true);
    
    if (isVibrationEnabled) {
      success(); // Success vibration pattern when starting
    }
  }, [isConnected, partnerName, onConnectionRequest, isVibrationEnabled, success]);

  const sendKiss = useCallback(() => {
    if (!isActive || !currentSession) return;

    // Update current session
    const updatedSession = {
      ...currentSession,
      kisses: currentSession.kisses + 1,
      duration: Date.now() - currentSession.startTime.getTime()
    };
    setCurrentSession(updatedSession);

    // Update totals
    setTotalKisses(prev => prev + 1);
    setLastKissTime(new Date());

    // Haptic feedback based on sensitivity
    if (isVibrationEnabled && supportsVibration) {
      const intensity = Math.max(10, (sensitivity / 100) * 200);
      vibrate([intensity, 50, intensity]);
    }

    // Visual feedback
    lightTap();

    // In a real app, this would send the kiss signal to the partner via WebSocket/Socket.io
    console.log('Kiss sent to', partnerName);
  }, [isActive, currentSession, partnerName, isVibrationEnabled, sensitivity, supportsVibration, vibrate, lightTap]);

  const endSession = useCallback(() => {
    if (!currentSession) return;

    const finalSession = {
      ...currentSession,
      duration: Date.now() - currentSession.startTime.getTime()
    };

    // Save session (in real app, save to Supabase)
    setSessionsToday(prev => prev + 1);
    setIsActive(false);
    setCurrentSession(null);

    if (isVibrationEnabled) {
      success(); // End session vibration
    }

    console.log('Session ended:', finalSession);
  }, [currentSession, isVibrationEnabled, success]);

  // Auto-end session after 5 minutes of inactivity
  useEffect(() => {
    if (!isActive) return;

    const timeout = setTimeout(() => {
      endSession();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timeout);
  }, [isActive, endSession]);

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-3d-primary flex items-center justify-center shadow-3d-soft">
            <Heart className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          <div>
            <h3 className="font-accent text-3xl font-bold text-gradient-romantic-3d">
              ThumbKiss
            </h3>
            <p className="text-muted-foreground font-elegant">
              Feel each other's touch across any distance
            </p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <Card className="card-romantic-3d">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
            <div>
              <h4 className="font-elegant font-semibold">Connection Status</h4>
              <p className="text-sm text-muted-foreground">
                {isConnected ? `Connected with ${partnerName}` : 'Not connected'}
              </p>
            </div>
          </div>
          {isConnected ? (
            <Wifi className="w-5 h-5 text-green-500" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-500" />
          )}
        </div>
      </Card>

      {/* Active Session */}
      <AnimatePresence>
        {isActive && currentSession && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card className="card-romantic-3d">
              <div className="text-center space-y-6">
                <div>
                  <h4 className="font-elegant font-bold text-xl text-title-3d mb-2">
                    Active Session with {partnerName}
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                        {currentSession.kisses}
                      </div>
                      <div className="text-sm text-muted-foreground font-elegant">Kisses</div>
                    </div>
                    <div>
                      <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                        {formatDuration(currentSession.duration)}
                      </div>
                      <div className="text-sm text-muted-foreground font-elegant">Duration</div>
                    </div>
                  </div>
                </div>

                {/* ThumbKiss Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex justify-center"
                >
                  <Button
                    onClick={sendKiss}
                    size="lg"
                    className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-purple-600 hover:from-pink-600 hover:via-red-600 hover:to-purple-700 shadow-3d-strong hover:shadow-3d-strong transform transition-all duration-200"
                  >
                    <div className="text-center">
                      <Heart className="w-8 h-8 mx-auto mb-2 text-white drop-shadow-lg" />
                      <span className="font-elegant font-bold text-white drop-shadow-sm">
                        Kiss
                      </span>
                    </div>
                  </Button>
                </motion.div>

                <Button
                  onClick={endSession}
                  variant="outline"
                  className="btn-romantic-outline-3d"
                >
                  End Session
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Session */}
      {!isActive && (
        <div className="text-center">
          <Button
            onClick={startSession}
            size="lg"
            disabled={!isConnected}
            className="btn-romantic-3d"
          >
            <Users className="w-5 h-5 mr-2" />
            Start ThumbKiss Session
          </Button>
          {!isConnected && (
            <p className="text-sm text-muted-foreground mt-2 font-elegant">
              Connect with your partner to start a session
            </p>
          )}
        </div>
      )}

      {/* Settings */}
      <Card className="card-romantic-3d">
        <div className="space-y-4">
          <h4 className="font-elegant font-semibold text-lg flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </h4>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isVibrationEnabled ? (
                <Volume2 className="w-5 h-5 text-primary" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="font-elegant">Vibration</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVibrationEnabled(!isVibrationEnabled)}
              className={isVibrationEnabled ? 'btn-romantic-3d' : 'btn-romantic-outline-3d'}
            >
              {isVibrationEnabled ? 'On' : 'Off'}
            </Button>
          </div>

          {isVibrationEnabled && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-elegant text-sm">Sensitivity</span>
                <span className="text-sm text-muted-foreground">{sensitivity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={sensitivity}
                onChange={(e) => setSensitivity(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider-romantic"
              />
            </div>
          )}
        </div>

        {/* Device Support Info */}
        {!supportsVibration && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-start space-x-3">
              <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h5 className="font-elegant font-semibold text-yellow-800">
                  Vibration Not Supported
                </h5>
                <p className="text-sm text-yellow-700 font-elegant">
                  Your device doesn't support vibration. Visual feedback will still work.
                </p>
              </div>
            </div>
          </Card>
        )}
      </Card>

      {/* Stats */}
      <Card className="card-romantic-3d">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {sessionsToday}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Today's Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {totalKisses}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Total Kisses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
              {lastKissTime ? formatDuration(Date.now() - lastKissTime.getTime()) : '—'}
            </div>
            <div className="text-sm text-muted-foreground font-elegant">Last Kiss</div>
          </div>
        </div>
      </Card>
    </div>
  );
};