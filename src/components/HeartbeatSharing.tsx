import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Activity, 
  Wifi, 
  WifiOff,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Timer,
  Zap,
  Users,
  Volume2,
  VolumeX
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHapticFeedback } from '@/hooks/use-device';

interface HeartbeatData {
  bpm: number;
  timestamp: number;
  emotion: 'calm' | 'excited' | 'nervous' | 'happy' | 'romantic';
}

interface HeartbeatSession {
  id: string;
  startTime: Date;
  duration: number;
  myHeartbeats: HeartbeatData[];
  partnerHeartbeats: HeartbeatData[];
  synchronized: boolean;
}

interface HeartbeatSharingProps {
  isConnected?: boolean;
  partnerName?: string;
  onConnectionRequest?: () => void;
}

export const HeartbeatSharing: React.FC<HeartbeatSharingProps> = ({
  isConnected = false,
  partnerName = 'Partner',
  onConnectionRequest
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentBPM, setCurrentBPM] = useState(72);
  const [partnerBPM, setPartnerBPM] = useState(0);
  const [currentEmotion, setCurrentEmotion] = useState<HeartbeatData['emotion']>('calm');
  const [session, setSession] = useState<HeartbeatSession | null>(null);
  const [syncLevel, setSyncLevel] = useState(0);
  const [isVibratingWithHeartbeat, setIsVibratingWithHeartbeat] = useState(true);
  const [recordingProgress, setRecordingProgress] = useState(0);

  const { vibrate } = useHapticFeedback();

  // Simulate heartbeat detection (in real app, this would use device sensors or camera)
  const [heartbeatDetector, setHeartbeatDetector] = useState<NodeJS.Timeout | null>(null);

  const emotions = [
    { id: 'calm', label: 'Calm', color: 'from-blue-400 to-cyan-500', bpmRange: [60, 80] },
    { id: 'excited', label: 'Excited', color: 'from-yellow-400 to-orange-500', bpmRange: [90, 120] },
    { id: 'nervous', label: 'Nervous', color: 'from-purple-400 to-pink-500', bpmRange: [85, 110] },
    { id: 'happy', label: 'Happy', color: 'from-green-400 to-emerald-500', bpmRange: [75, 95] },
    { id: 'romantic', label: 'Romantic', color: 'from-pink-400 to-red-500', bpmRange: [70, 90] }
  ] as const;

  const getCurrentEmotionData = () => {
    return emotions.find(e => e.id === currentEmotion) || emotions[0];
  };

  const generateHeartbeat = useCallback(() => {
    const emotionData = getCurrentEmotionData();
    const [minBPM, maxBPM] = emotionData.bpmRange;
    const bpm = Math.floor(Math.random() * (maxBPM - minBPM + 1)) + minBPM;
    
    setCurrentBPM(bpm);
    
    // Simulate partner's heartbeat (in real app, this would come from partner's device)
    if (isConnected) {
      const partnerBpm = Math.floor(Math.random() * 20) + bpm - 10; // Similar to user's BPM
      setPartnerBPM(Math.max(50, Math.min(150, partnerBpm)));
    }

    // Update sync level based on BPM difference
    if (isConnected && partnerBPM > 0) {
      const difference = Math.abs(bpm - partnerBPM);
      const newSyncLevel = Math.max(0, 100 - (difference * 3));
      setSyncLevel(newSyncLevel);
    }

    // Vibrate with heartbeat if enabled
    if (isVibratingWithHeartbeat && isActive) {
      const intensity = Math.floor(60000 / bpm); // Convert BPM to interval
      vibrate(50);
    }

    return {
      bpm,
      timestamp: Date.now(),
      emotion: currentEmotion
    };
  }, [currentEmotion, isConnected, partnerBPM, isVibratingWithHeartbeat, isActive, vibrate]);

  const startRecording = useCallback(() => {
    if (!isConnected) {
      onConnectionRequest?.();
      return;
    }

    const newSession: HeartbeatSession = {
      id: Date.now().toString(),
      startTime: new Date(),
      duration: 0,
      myHeartbeats: [],
      partnerHeartbeats: [],
      synchronized: false
    };

    setSession(newSession);
    setIsActive(true);
    setIsRecording(true);
    setRecordingProgress(0);

    // Start heartbeat detection
    const detector = setInterval(() => {
      const heartbeatData = generateHeartbeat();
      setSession(prev => prev ? {
        ...prev,
        myHeartbeats: [...prev.myHeartbeats, heartbeatData],
        duration: Date.now() - prev.startTime.getTime()
      } : null);
    }, 1000); // Update every second

    setHeartbeatDetector(detector);

    // Progress timer for 30-second recording
    const progressTimer = setInterval(() => {
      setRecordingProgress(prev => {
        const newProgress = prev + (100 / 30); // 30 seconds total
        if (newProgress >= 100) {
          clearInterval(progressTimer);
          stopRecording();
          return 100;
        }
        return newProgress;
      });
    }, 1000);
  }, [isConnected, onConnectionRequest, generateHeartbeat]);

  const stopRecording = useCallback(() => {
    if (heartbeatDetector) {
      clearInterval(heartbeatDetector);
      setHeartbeatDetector(null);
    }

    setIsRecording(false);
    setRecordingProgress(0);

    if (session) {
      const finalSession = {
        ...session,
        duration: Date.now() - session.startTime.getTime(),
        synchronized: syncLevel > 70
      };
      
      console.log('Heartbeat session completed:', finalSession);
      // In real app, save to Supabase
    }
  }, [heartbeatDetector, session, syncLevel]);

  const endSession = useCallback(() => {
    stopRecording();
    setIsActive(false);
    setSession(null);
    setSyncLevel(0);
  }, [stopRecording]);

  // Auto-stop recording after 30 seconds
  useEffect(() => {
    if (recordingProgress >= 100) {
      stopRecording();
    }
  }, [recordingProgress, stopRecording]);

  const getBPMColor = (bpm: number) => {
    if (bpm < 70) return 'text-blue-500';
    if (bpm < 90) return 'text-green-500';
    if (bpm < 110) return 'text-yellow-500';
    return 'text-red-500';
  };

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
            <Activity className="w-6 h-6 text-white drop-shadow-sm" />
          </div>
          <div>
            <h3 className="font-accent text-3xl font-bold text-gradient-romantic-3d">
              Heartbeat Sharing
            </h3>
            <p className="text-muted-foreground font-elegant">
              Sync your hearts across any distance
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

      {/* Emotion Selection */}
      {!isRecording && (
        <Card className="card-romantic-3d">
          <h4 className="font-elegant font-semibold text-lg mb-4">How are you feeling?</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {emotions.map((emotion) => (
              <Button
                key={emotion.id}
                variant={currentEmotion === emotion.id ? "default" : "outline"}
                onClick={() => setCurrentEmotion(emotion.id)}
                className={`font-elegant font-semibold transition-3d ${
                  currentEmotion === emotion.id
                    ? 'btn-romantic-3d'
                    : 'btn-romantic-outline-3d'
                }`}
              >
                {emotion.label}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Active Session */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="space-y-6"
          >
            {/* Heartbeat Display */}
            <Card className="card-romantic-3d">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Your Heartbeat */}
                <div className="text-center">
                  <h4 className="font-elegant font-semibold text-lg mb-4">Your Heartbeat</h4>
                  <motion.div
                    animate={{
                      scale: isRecording ? [1, 1.1, 1] : 1,
                    }}
                    transition={{
                      duration: 60 / currentBPM,
                      repeat: isRecording ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                    className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getCurrentEmotionData().color} flex items-center justify-center shadow-3d-strong mb-4`}
                  >
                    <Heart className="w-12 h-12 text-white drop-shadow-lg" />
                  </motion.div>
                  <div className={`text-3xl font-accent font-bold ${getBPMColor(currentBPM)}`}>
                    {currentBPM}
                  </div>
                  <div className="text-sm text-muted-foreground font-elegant">BPM</div>
                  <Badge className="mt-2" variant="secondary">
                    {getCurrentEmotionData().label}
                  </Badge>
                </div>

                {/* Partner's Heartbeat */}
                <div className="text-center">
                  <h4 className="font-elegant font-semibold text-lg mb-4">{partnerName}'s Heartbeat</h4>
                  {isConnected && partnerBPM > 0 ? (
                    <>
                      <motion.div
                        animate={{
                          scale: isRecording ? [1, 1.1, 1] : 1,
                        }}
                        transition={{
                          duration: 60 / partnerBPM,
                          repeat: isRecording ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                        className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-3d-strong mb-4"
                      >
                        <Heart className="w-12 h-12 text-white drop-shadow-lg" />
                      </motion.div>
                      <div className={`text-3xl font-accent font-bold ${getBPMColor(partnerBPM)}`}>
                        {partnerBPM}
                      </div>
                      <div className="text-sm text-muted-foreground font-elegant">BPM</div>
                    </>
                  ) : (
                    <div className="w-24 h-24 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                      <WifiOff className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </div>

              {/* Synchronization */}
              {isConnected && partnerBPM > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <div className="text-center mb-4">
                    <h5 className="font-elegant font-semibold">Heart Synchronization</h5>
                    <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                      {syncLevel.toFixed(0)}%
                    </div>
                  </div>
                  <Progress value={syncLevel} className="h-3" />
                  <div className="text-center mt-2">
                    <Badge 
                      variant={syncLevel > 70 ? "default" : "secondary"}
                      className={syncLevel > 70 ? "bg-green-500" : ""}
                    >
                      {syncLevel > 70 ? "In Sync! 💕" : "Syncing..."}
                    </Badge>
                  </div>
                </div>
              )}
            </Card>

            {/* Recording Progress */}
            {isRecording && (
              <Card className="card-romantic-3d">
                <div className="text-center space-y-4">
                  <h4 className="font-elegant font-semibold text-lg">Recording Heartbeats...</h4>
                  <Progress value={recordingProgress} className="h-2" />
                  <p className="text-sm text-muted-foreground font-elegant">
                    {Math.ceil((100 - recordingProgress) * 30 / 100)} seconds remaining
                  </p>
                </div>
              </Card>
            )}

            {/* Controls */}
            <div className="flex justify-center space-x-4">
              {!isRecording ? (
                <Button
                  onClick={startRecording}
                  size="lg"
                  disabled={!isConnected}
                  className="btn-romantic-3d"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Recording
                </Button>
              ) : (
                <Button
                  onClick={stopRecording}
                  size="lg"
                  variant="outline"
                  className="btn-romantic-outline-3d"
                >
                  <Pause className="w-5 h-5 mr-2" />
                  Stop Recording
                </Button>
              )}
              
              <Button
                onClick={endSession}
                variant="outline"
                className="btn-romantic-outline-3d"
              >
                End Session
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Session */}
      {!isActive && (
        <div className="text-center">
          <Button
            onClick={() => setIsActive(true)}
            size="lg"
            disabled={!isConnected}
            className="btn-romantic-3d"
          >
            <Users className="w-5 h-5 mr-2" />
            Start Heartbeat Session
          </Button>
          {!isConnected && (
            <p className="text-sm text-muted-foreground mt-2 font-elegant">
              Connect with your partner to share heartbeats
            </p>
          )}
        </div>
      )}

      {/* Settings */}
      <Card className="card-romantic-3d">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isVibratingWithHeartbeat ? (
              <Volume2 className="w-5 h-5 text-primary" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="font-elegant">Vibrate with Heartbeat</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsVibratingWithHeartbeat(!isVibratingWithHeartbeat)}
            className={isVibratingWithHeartbeat ? 'btn-romantic-3d' : 'btn-romantic-outline-3d'}
          >
            {isVibratingWithHeartbeat ? 'On' : 'Off'}
          </Button>
        </div>
      </Card>

      {/* Session Stats */}
      {session && (
        <Card className="card-romantic-3d">
          <h4 className="font-elegant font-semibold text-lg mb-4">Session Stats</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                {session.myHeartbeats.length}
              </div>
              <div className="text-sm text-muted-foreground font-elegant">Heartbeats</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                {formatDuration(session.duration)}
              </div>
              <div className="text-sm text-muted-foreground font-elegant">Duration</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                {session.myHeartbeats.length > 0 
                  ? Math.round(session.myHeartbeats.reduce((sum, hb) => sum + hb.bpm, 0) / session.myHeartbeats.length)
                  : 0}
              </div>
              <div className="text-sm text-muted-foreground font-elegant">Avg BPM</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-accent font-bold text-gradient-romantic-3d">
                {syncLevel.toFixed(0)}%
              </div>
              <div className="text-sm text-muted-foreground font-elegant">Max Sync</div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};