import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Star, 
  CheckCircle, 
  X, 
  RotateCcw, 
  Trophy,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'rating' | 'text';
  options?: string[];
  correctAnswer?: string | number;
  explanation?: string;
  category: 'compatibility' | 'memories' | 'preferences' | 'future' | 'fun';
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  category: string;
  feedback: string;
  suggestions: string[];
}

interface CoupleQuizProps {
  quizData?: QuizQuestion[];
  title?: string;
  description?: string;
  onComplete?: (result: QuizResult) => void;
}

export const CoupleQuiz: React.FC<CoupleQuizProps> = ({
  quizData,
  title = "How Well Do You Know Each Other?",
  description = "Test your knowledge about your partner!",
  onComplete
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Sample quiz questions
  const defaultQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: "What is Tomoe's favorite anime genre?",
      type: 'multiple-choice',
      options: ['Romance', 'Action', 'Slice of Life', 'Mystery'],
      correctAnswer: 'Romance',
      explanation: "Tomoe loves romantic stories that remind her of your relationship!",
      category: 'preferences'
    },
    {
      id: '2',
      question: "On a scale of 1-10, how much does Nanami love spicy food?",
      type: 'rating',
      correctAnswer: 8,
      explanation: "Nanami absolutely loves spicy food - the spicier, the better!",
      category: 'preferences'
    },
    {
      id: '3',
      question: "Tomoe prefers morning dates over evening dates.",
      type: 'true-false',
      correctAnswer: 'false',
      explanation: "Tomoe actually loves evening dates, especially sunset photography sessions!",
      category: 'preferences'
    },
    {
      id: '4',
      question: "What was the first movie you watched together?",
      type: 'multiple-choice',
      options: ['Your Name', 'Spirited Away', 'Princess Mononoke', 'Weathering with You'],
      correctAnswer: 'Your Name',
      explanation: "Your Name was your first movie together and it made you both cry!",
      category: 'memories'
    },
    {
      id: '5',
      question: "How many years do you want to be together?",
      type: 'multiple-choice',
      options: ['5 years', '10 years', 'Forever', '50 years'],
      correctAnswer: 'Forever',
      explanation: "Forever is the only correct answer when it comes to true love! 💕",
      category: 'future'
    }
  ];

  const questions = quizData || defaultQuestions;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !isCompleted) {
      interval = setInterval(() => {
        setTimeElapsed(time => time + 1);
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isCompleted]);

  const startQuiz = () => {
    setIsActive(true);
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setResult(null);
    setTimeElapsed(0);
  };

  const handleAnswer = (answer: any) => {
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: answer }));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      completeQuiz({ ...answers, [questionId]: answer });
    }
  };

  const completeQuiz = (finalAnswers: Record<string, any>) => {
    setIsActive(false);
    setIsCompleted(true);

    // Calculate score
    let score = 0;
    questions.forEach(question => {
      const userAnswer = finalAnswers[question.id];
      if (question.type === 'rating') {
        // For rating questions, allow some tolerance
        const correctAnswer = question.correctAnswer as number;
        if (Math.abs(userAnswer - correctAnswer) <= 1) {
          score += 1;
        }
      } else if (userAnswer === question.correctAnswer) {
        score += 1;
      }
    });

    const percentage = Math.round((score / questions.length) * 100);
    
    // Generate feedback based on score
    let feedback = '';
    let suggestions: string[] = [];
    
    if (percentage >= 90) {
      feedback = "Perfect Match! 💕 You know each other incredibly well!";
      suggestions = [
        "Plan a surprise date based on what you learned",
        "Create new memories together",
        "Share this achievement on your timeline"
      ];
    } else if (percentage >= 70) {
      feedback = "Great Connection! ⭐ You have a wonderful understanding of each other.";
      suggestions = [
        "Spend more quality time talking about preferences",
        "Try new activities together",
        "Ask deeper questions about dreams and goals"
      ];
    } else if (percentage >= 50) {
      feedback = "Good Start! 💖 There's always more to discover about each other.";
      suggestions = [
        "Have regular heart-to-heart conversations",
        "Try the other quizzes to learn more",
        "Plan dates that involve sharing new experiences"
      ];
    } else {
      feedback = "Learning Together! 🌱 Every couple has room to grow closer.";
      suggestions = [
        "Make time for daily check-ins",
        "Ask about each other's day in detail",
        "Explore new interests together"
      ];
    }

    const quizResult: QuizResult = {
      score,
      totalQuestions: questions.length,
      percentage,
      category: questions[0].category,
      feedback,
      suggestions
    };

    setResult(quizResult);
    onComplete?.(quizResult);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (!isActive && !isCompleted) {
    return (
      <Card className="card-romantic-3d text-center">
        <div className="space-y-6">
          <div className="w-20 h-20 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center shadow-3d-soft">
            <Heart className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          
          <div>
            <h3 className="font-accent text-3xl font-bold text-gradient-romantic-3d text-title-3d mb-3">
              {title}
            </h3>
            <p className="text-muted-foreground font-elegant text-enhanced">
              {description}
            </p>
          </div>

          <div className="glass-romantic-3d p-6 rounded-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-accent font-bold text-primary">
                  {questions.length}
                </div>
                <div className="text-sm text-muted-foreground font-elegant">Questions</div>
              </div>
              <div>
                <div className="text-2xl font-accent font-bold text-primary">
                  <Clock className="w-6 h-6 mx-auto" />
                </div>
                <div className="text-sm text-muted-foreground font-elegant">Timed</div>
              </div>
              <div>
                <div className="text-2xl font-accent font-bold text-primary">
                  <Trophy className="w-6 h-6 mx-auto" />
                </div>
                <div className="text-sm text-muted-foreground font-elegant">Scored</div>
              </div>
            </div>
          </div>

          <Button onClick={startQuiz} className="btn-romantic-3d text-lg px-8 py-4">
            <Sparkles className="w-5 h-5 mr-2" />
            Start Quiz
          </Button>
        </div>
      </Card>
    );
  }

  if (isCompleted && result) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="card-romantic-3d text-center">
          <div className="space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-3d-primary rounded-full flex items-center justify-center shadow-3d-strong">
              <Trophy className="w-12 h-12 text-white drop-shadow-lg" />
            </div>
            
            <div>
              <h3 className="font-accent text-4xl font-bold text-gradient-romantic-3d text-title-3d mb-2">
                Quiz Complete!
              </h3>
              <p className="text-xl text-foreground/80 font-elegant text-enhanced">
                {result.feedback}
              </p>
            </div>

            <div className="glass-romantic-3d p-8 rounded-xl">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-4xl font-accent font-bold text-gradient-romantic-3d">
                    {result.score}
                  </div>
                  <div className="text-sm text-muted-foreground font-elegant">Correct</div>
                </div>
                <div>
                  <div className="text-4xl font-accent font-bold text-gradient-romantic-3d">
                    {result.percentage}%
                  </div>
                  <div className="text-sm text-muted-foreground font-elegant">Score</div>
                </div>
                <div>
                  <div className="text-4xl font-accent font-bold text-gradient-romantic-3d">
                    {formatTime(timeElapsed)}
                  </div>
                  <div className="text-sm text-muted-foreground font-elegant">Time</div>
                </div>
              </div>
            </div>

            {result.suggestions.length > 0 && (
              <div className="text-left">
                <h4 className="font-elegant font-bold text-lg text-title-3d mb-3">
                  💡 Suggestions to Grow Closer:
                </h4>
                <div className="space-y-2">
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start">
                      <Heart className="w-4 h-4 text-primary mt-1 mr-3 flex-shrink-0" />
                      <p className="text-foreground/80 font-elegant text-enhanced">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              onClick={() => {
                setIsCompleted(false);
                setIsActive(false);
              }} 
              className="btn-romantic-3d"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Take Quiz Again
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  // Quiz in progress
  const question = questions[currentQuestion];

  return (
    <Card className="card-romantic-3d">
      <div className="space-y-6">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="font-elegant">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              <span className="font-elegant">{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <div className="text-sm text-muted-foreground font-elegant">
            {question.category}
          </div>
        </div>

        {/* Progress Bar */}
        <Progress value={progress} className="h-2" />

        {/* Question */}
        <div className="text-center space-y-4">
          <h3 className="font-elegant font-bold text-2xl text-title-3d leading-relaxed">
            {question.question}
          </h3>
        </div>

        {/* Answer Options */}
        <div className="space-y-4">
          {question.type === 'multiple-choice' && question.options && (
            <div className="grid gap-3">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleAnswer(option)}
                  className="w-full p-4 text-left justify-start font-elegant transition-3d hover:btn-romantic-3d"
                >
                  <div className="w-6 h-6 rounded-full border-2 border-primary mr-3 flex items-center justify-center">
                    <span className="text-sm font-semibold">{String.fromCharCode(65 + index)}</span>
                  </div>
                  {option}
                </Button>
              ))}
            </div>
          )}

          {question.type === 'true-false' && (
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => handleAnswer('true')}
                className="p-6 font-elegant transition-3d hover:btn-romantic-3d"
              >
                <CheckCircle className="w-6 h-6 mr-2" />
                True
              </Button>
              <Button
                variant="outline"
                onClick={() => handleAnswer('false')}
                className="p-6 font-elegant transition-3d hover:btn-romantic-3d"
              >
                <X className="w-6 h-6 mr-2" />
                False
              </Button>
            </div>
          )}

          {question.type === 'rating' && (
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                <Button
                  key={rating}
                  variant="outline"
                  onClick={() => handleAnswer(rating)}
                  className="w-12 h-12 p-0 font-elegant transition-3d hover:btn-romantic-3d"
                >
                  {rating}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => handleAnswer(null)}
            className="text-muted-foreground font-elegant"
            size="sm"
          >
            Skip Question
          </Button>
        </div>
      </div>
    </Card>
  );
};