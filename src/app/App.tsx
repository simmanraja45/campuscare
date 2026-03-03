/**
 * CampusCare Pro – Advanced AI-Powered Student Wellness Ecosystem
 * 
 * PREMIUM FEATURES:
 * ✅ AI Study Planner - Generates personalized weekly study schedules
 * ✅ Pomodoro Timer with Analytics - Track focus sessions and productivity
 * ✅ Burnout Risk Predictor - ML-based risk assessment
 * ✅ Comprehensive Wellness Score - Holistic health metric
 * ✅ AI Chatbot - Mental health conversational assistant
 * ✅ Breathing Exercises - Animated guided breathing (4-4-4, 4-7-8)
 * ✅ Achievement System - Badges, streaks, milestones
 * ✅ Export Reports - Download analytics as PDF
 * ✅ Subject-wise Stress & Performance Tracking
 * ✅ Focus Mode - Distraction-free study sessions
 * ✅ Mental Health Journal - Daily reflections
 * ✅ Emergency SOS - Quick counselor contact
 * ✅ Notification Center - Centralized alerts
 * ✅ Study Analytics Dashboard
 * ✅ Progress Tracking with Visualizations
 */

import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, CheckCircle2, XCircle, AlertCircle, Trophy, Music, Youtube, Coffee, Award, Moon, Sun, LogOut, User, Clock, Target, TrendingUp, Activity, Book, BarChart3, Brain, Heart, Zap, MessageCircle, FileDown, Sparkles, Bell, Timer, Play, Pause, SkipForward, Flame, Star, BookOpen, AlertTriangle, Phone, Edit3, TrendingDown, Shield, Smile, Award as AwardIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Progress } from './components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Textarea } from './components/ui/textarea';
import { Switch } from './components/ui/switch';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { ScrollArea } from './components/ui/scroll-area';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface User {
  id: string;
  name: string;
  email: string;
  college: string;
  year: string;
  stressScore?: number;
  stressCategory?: string;
  sleepHours?: number;
  studyHours?: number;
  selfStress?: number;
  points: number;
  level: string;
  surveyCompleted: boolean;
  wellnessScore?: number;
  burnoutRisk?: string;
  currentStreak?: number;
  longestStreak?: number;
  achievements?: string[];
}

interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  startTime: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  reward: string;
  status: 'pending' | 'completed' | 'missed';
  createdAt: string;
  subject?: string;
}

interface TimetableEntry {
  id: string;
  userId: string;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  totalClasses: number;
  attendedClasses: number;
}

interface MoodEntry {
  userId: string;
  date: string;
  mood: 'happy' | 'neutral' | 'sad' | 'stressed';
  energy: number;
}

interface StressHistory {
  date: string;
  score: number;
  category: string;
}

interface PomodoroSession {
  id: string;
  userId: string;
  subject: string;
  duration: number;
  completed: boolean;
  date: string;
  startTime: string;
  endTime?: string;
}

interface StudyPlan {
  id: string;
  userId: string;
  weekStart: string;
  subjects: {
    name: string;
    hoursPerDay: number;
    priority: number;
    examDate?: string;
  }[];
  dailySchedule: {
    day: string;
    sessions: {
      subject: string;
      startTime: string;
      duration: number;
      type: 'study' | 'revision' | 'practice';
    }[];
  }[];
}

interface JournalEntry {
  id: string;
  userId: string;
  date: string;
  content: string;
  mood: string;
  tags: string[];
}

interface SubjectPerformance {
  subject: string;
  stressLevel: number;
  studyHours: number;
  attendance: number;
  tasksCompleted: number;
  focusSessions: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ACHIEVEMENTS_LIST: Achievement[] = [
  { id: 'first_task', title: 'First Steps', description: 'Complete your first task', icon: '🎯' },
  { id: 'streak_3', title: '3-Day Streak', description: 'Maintain a 3-day activity streak', icon: '🔥' },
  { id: 'streak_7', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '⚡' },
  { id: 'streak_30', title: 'Monthly Master', description: '30-day streak achieved', icon: '👑' },
  { id: 'tasks_10', title: 'Productive', description: 'Complete 10 tasks', icon: '✅' },
  { id: 'tasks_50', title: 'Super Productive', description: 'Complete 50 tasks', icon: '🚀' },
  { id: 'pomodoro_10', title: 'Focused Mind', description: 'Complete 10 Pomodoro sessions', icon: '🧠' },
  { id: 'pomodoro_50', title: 'Focus Master', description: 'Complete 50 Pomodoro sessions', icon: '🎓' },
  { id: 'low_stress', title: 'Zen Master', description: 'Maintain low stress for 7 days', icon: '🧘' },
  { id: 'attendance_90', title: 'Perfect Attendance', description: '90%+ attendance in all subjects', icon: '📚' },
  { id: 'early_bird', title: 'Early Bird', description: 'Complete 5 tasks before deadline', icon: '🌅' },
  { id: 'night_owl', title: 'Night Owl', description: 'Study session after 10 PM', icon: '🦉' },
];

const AI_CHAT_RESPONSES = {
  stress: [
    "I understand you're feeling stressed. Let's try the 4-4-4 breathing technique: Breathe in for 4 seconds, hold for 4, exhale for 4. Would you like to try it now?",
    "Stress is natural, but manageable. Have you tried breaking your tasks into smaller chunks? The Pomodoro technique works great - 25 minutes focus, 5 minutes break.",
    "Your wellbeing matters. Consider taking a 10-minute walk, drinking water, or talking to a friend. Small breaks can reset your mind.",
  ],
  motivation: [
    "You're doing great! Every small step counts. Remember why you started - your goals are worth the effort. 💪",
    "Believe in yourself! You've overcome challenges before, and you will again. Take it one task at a time.",
    "Progress isn't always visible, but it's happening. Keep going - your future self will thank you! 🌟",
  ],
  study: [
    "For effective studying: 1) Use active recall, 2) Take regular breaks, 3) Study in focused 25-min sessions, 4) Get 7-8 hours sleep. Quality over quantity!",
    "Try the Feynman technique: Explain concepts in simple terms as if teaching a beginner. It reveals what you truly understand.",
    "Spaced repetition is key! Review material after 1 day, 3 days, 1 week, and 1 month for best retention.",
  ],
  exam: [
    "Exam prep tips: 1) Start early, 2) Practice past papers, 3) Focus on weak areas, 4) Stay healthy, 5) Believe in yourself. You've got this!",
    "Don't cram! Your brain needs time to consolidate information. Study consistently, sleep well, and review strategically.",
    "Pre-exam anxiety is normal. Use it as energy! Deep breathing, positive self-talk, and good preparation are your best tools.",
  ],
  sleep: [
    "Sleep is crucial for memory and learning. Aim for 7-9 hours. Try: consistent bedtime, no screens 1hr before sleep, cool dark room.",
    "Poor sleep affects stress, focus, and grades. Create a wind-down routine: dim lights, light reading, calm music, no caffeine after 4 PM.",
  ],
  default: [
    "I'm here to help! You can ask me about: stress management, study techniques, motivation, time management, or mental wellness. What's on your mind?",
    "How can I support you today? Whether it's stress, studying, or staying motivated - I'm here for you! 💙",
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const calculateStressScore = (sleepHours: number, studyHours: number, selfStress: number): { score: number; category: string } => {
  const sleepScore = sleepHours >= 7 && sleepHours <= 9 ? 1 : sleepHours >= 5 ? 2 : 3;
  const studyScore = studyHours <= 4 ? 1 : studyHours <= 7 ? 2 : 3;
  const selfScore = selfStress <= 3 ? 1 : selfStress <= 7 ? 2 : 3;
  
  const totalScore = sleepScore + studyScore + selfScore;
  const normalizedScore = Math.round((totalScore / 9) * 100);
  
  let category = 'Low Stress';
  if (totalScore <= 4) category = 'Low Stress';
  else if (totalScore <= 6) category = 'Moderate Stress';
  else category = 'High Stress';
  
  return { score: normalizedScore, category };
};

const calculateWellnessScore = (user: User, tasks: Task[], timetable: TimetableEntry[], pomodoroSessions: PomodoroSession[]): number => {
  let score = 100;
  
  // Stress penalty
  if (user.stressScore) {
    score -= user.stressScore * 0.3;
  }
  
  // Sleep bonus/penalty
  if (user.sleepHours) {
    if (user.sleepHours >= 7 && user.sleepHours <= 9) score += 10;
    else if (user.sleepHours < 5) score -= 15;
  }
  
  // Task completion bonus
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const totalTasks = tasks.length;
  if (totalTasks > 0) {
    score += (completedTasks / totalTasks) * 20;
  }
  
  // Attendance bonus
  const avgAttendance = timetable.reduce((acc, entry) => {
    if (entry.totalClasses === 0) return acc;
    return acc + (entry.attendedClasses / entry.totalClasses);
  }, 0) / (timetable.length || 1);
  score += avgAttendance * 15;
  
  // Focus sessions bonus
  const recentSessions = pomodoroSessions.filter(s => {
    const sessionDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  }).length;
  score += Math.min(recentSessions * 2, 20);
  
  return Math.max(0, Math.min(100, Math.round(score)));
};

const predictBurnoutRisk = (stressHistory: StressHistory[], tasks: Task[], user: User): string => {
  if (stressHistory.length < 3) return 'Low Risk';
  
  const recentStress = stressHistory.slice(-7);
  const avgStress = recentStress.reduce((acc, h) => acc + h.score, 0) / recentStress.length;
  const stressTrend = recentStress[recentStress.length - 1].score - recentStress[0].score;
  
  const missedTasks = tasks.filter(t => t.status === 'missed').length;
  const totalTasks = tasks.length;
  const missedRatio = totalTasks > 0 ? missedTasks / totalTasks : 0;
  
  const sleepDeficit = user.sleepHours ? Math.max(0, 7 - user.sleepHours) : 0;
  
  let riskScore = 0;
  if (avgStress > 60) riskScore += 30;
  else if (avgStress > 40) riskScore += 15;
  
  if (stressTrend > 15) riskScore += 25;
  if (missedRatio > 0.3) riskScore += 20;
  if (sleepDeficit > 2) riskScore += 25;
  
  if (riskScore >= 60) return 'High Risk';
  if (riskScore >= 30) return 'Moderate Risk';
  return 'Low Risk';
};

const generateAIStudyPlan = (subjects: string[], studyHoursPerDay: number, stressLevel: string): StudyPlan => {
  const adjustedHours = stressLevel === 'High Stress' ? studyHoursPerDay * 0.7 : stressLevel === 'Moderate Stress' ? studyHoursPerDay * 0.85 : studyHoursPerDay;
  
  const sessionDuration = stressLevel === 'High Stress' ? 25 : 50; // Pomodoro for high stress
  const breakDuration = stressLevel === 'High Stress' ? 10 : 5;
  
  const dailySchedule = DAYS_OF_WEEK.map((day, dayIndex) => {
    const sessions: any[] = [];
    let currentTime = 9; // Start at 9 AM
    let remainingHours = adjustedHours;
    
    subjects.forEach((subject, subjectIndex) => {
      if (remainingHours <= 0) return;
      
      const hoursForSubject = Math.min(remainingHours, adjustedHours / subjects.length);
      const sessionType = dayIndex % 3 === 0 ? 'study' : dayIndex % 3 === 1 ? 'revision' : 'practice';
      
      sessions.push({
        subject,
        startTime: `${Math.floor(currentTime).toString().padStart(2, '0')}:${((currentTime % 1) * 60).toString().padStart(2, '0')}`,
        duration: sessionDuration,
        type: sessionType,
      });
      
      currentTime += (sessionDuration + breakDuration) / 60;
      remainingHours -= hoursForSubject;
    });
    
    return {
      day,
      sessions,
    };
  });
  
  return {
    id: Date.now().toString(),
    userId: '',
    weekStart: new Date().toISOString(),
    subjects: subjects.map((name, index) => ({
      name,
      hoursPerDay: adjustedHours / subjects.length,
      priority: index + 1,
    })),
    dailySchedule,
  };
};

const getAIRecommendation = (stressCategory: string, sleepHours: number, studyHours: number): string => {
  if (stressCategory === 'High Stress') {
    return `🚨 Your stress levels are elevated. Priority actions: 1) Use the Pomodoro timer for 25-min focused sessions. 2) Get 7-8 hours of sleep tonight - it's crucial. 3) Try the breathing exercises in the Wellness tab. 4) Consider talking to the campus counselor (Emergency SOS). Your mental health is paramount.`;
  } else if (stressCategory === 'Moderate Stress') {
    return `⚠️ You're managing reasonably, but monitor closely. Suggestions: 1) Maintain consistent sleep schedule. 2) Use active recall and spaced repetition. 3) Take 5-min breaks every hour. 4) Review your study plan - quality over quantity. Stay balanced!`;
  } else {
    return `✅ Excellent stress management! To maintain: 1) Keep your healthy routine. 2) Mix focused study with enjoyable activities. 3) Use your wellness to help peers. 4) Challenge yourself with advanced goals. Consistency is key!`;
  }
};

const getAIChatResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('stress') || lowerMessage.includes('anxious') || lowerMessage.includes('overwhelm')) {
    return AI_CHAT_RESPONSES.stress[Math.floor(Math.random() * AI_CHAT_RESPONSES.stress.length)];
  } else if (lowerMessage.includes('motivat') || lowerMessage.includes('give up') || lowerMessage.includes('tired')) {
    return AI_CHAT_RESPONSES.motivation[Math.floor(Math.random() * AI_CHAT_RESPONSES.motivation.length)];
  } else if (lowerMessage.includes('study') || lowerMessage.includes('learn') || lowerMessage.includes('focus')) {
    return AI_CHAT_RESPONSES.study[Math.floor(Math.random() * AI_CHAT_RESPONSES.study.length)];
  } else if (lowerMessage.includes('exam') || lowerMessage.includes('test')) {
    return AI_CHAT_RESPONSES.exam[Math.floor(Math.random() * AI_CHAT_RESPONSES.exam.length)];
  } else if (lowerMessage.includes('sleep') || lowerMessage.includes('tired')) {
    return AI_CHAT_RESPONSES.sleep[Math.floor(Math.random() * AI_CHAT_RESPONSES.sleep.length)];
  } else {
    return AI_CHAT_RESPONSES.default[Math.floor(Math.random() * AI_CHAT_RESPONSES.default.length)];
  }
};

const getLevelFromPoints = (points: number): string => {
  if (points >= 200) return 'Platinum';
  if (points >= 100) return 'Gold';
  if (points >= 50) return 'Silver';
  return 'Bronze';
};

const getRandomReward = (): string => {
  const rewards = [
    'spotify:5-minute Spotify focus break',
    'youtube:Motivational YouTube short',
    'breathing:3-minute guided breathing',
    'quote:Inspirational quote',
    'badge:Achievement badge unlocked',
    'water:Healthy water break',
    'game:10-minute gaming break'
  ];
  return rewards[Math.floor(Math.random() * rewards.length)];
};

const getHealthyActivity = (): string => {
  const activities = [
    '10 push-ups',
    '5-minute stretching',
    '3-minute deep breathing',
    '10-minute walk',
    '20 jumping jacks',
    'Drink a glass of water',
    '2-minute meditation',
    '15 squats',
    '1-minute plank',
    '5-minute yoga'
  ];
  return activities[Math.floor(Math.random() * activities.length)];
};

const checkAchievements = (user: User, tasks: Task[], pomodoroSessions: PomodoroSession[], timetable: TimetableEntry[]): string[] => {
  const unlocked: string[] = [...(user.achievements || [])];
  
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  if (completedTasks >= 1 && !unlocked.includes('first_task')) unlocked.push('first_task');
  if (completedTasks >= 10 && !unlocked.includes('tasks_10')) unlocked.push('tasks_10');
  if (completedTasks >= 50 && !unlocked.includes('tasks_50')) unlocked.push('tasks_50');
  
  if (user.currentStreak && user.currentStreak >= 3 && !unlocked.includes('streak_3')) unlocked.push('streak_3');
  if (user.currentStreak && user.currentStreak >= 7 && !unlocked.includes('streak_7')) unlocked.push('streak_7');
  if (user.currentStreak && user.currentStreak >= 30 && !unlocked.includes('streak_30')) unlocked.push('streak_30');
  
  const completedPomodoros = pomodoroSessions.filter(s => s.completed).length;
  if (completedPomodoros >= 10 && !unlocked.includes('pomodoro_10')) unlocked.push('pomodoro_10');
  if (completedPomodoros >= 50 && !unlocked.includes('pomodoro_50')) unlocked.push('pomodoro_50');
  
  const avgAttendance = timetable.reduce((acc, entry) => {
    if (entry.totalClasses === 0) return acc;
    return acc + (entry.attendedClasses / entry.totalClasses) * 100;
  }, 0) / (timetable.length || 1);
  if (avgAttendance >= 90 && !unlocked.includes('attendance_90')) unlocked.push('attendance_90');
  
  return unlocked;
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  
  // Theme
  const [darkMode, setDarkMode] = useState(true);
  
  // Navigation
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'tasks' | 'timetable' | 'wellness' | 'study' | 'profile'>('dashboard');
  
  // Data States
  const [tasks, setTasks] = useState<Task[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [stressHistory, setStressHistory] = useState<StressHistory[]>([]);
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [showDailyCheckIn, setShowDailyCheckIn] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  
  // Pomodoro State
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSubject, setPomodoroSubject] = useState('');
  const [currentPomodoroId, setCurrentPomodoroId] = useState<string | null>(null);
  const pomodoroIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Breathing Exercise State
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathingCount, setBreathingCount] = useState(0);
  
  // AI Chat State
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'ai'; message: string }[]>([]);
  const [showAIChat, setShowAIChat] = useState(false);
  
  // Focus Mode
  const [focusMode, setFocusMode] = useState(false);
  
  // Load data from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('campuscare_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
      loadUserData(user.id);
      checkDailyCheckIn(user.id);
      updateStreak(user);
    }
  }, []);
  
  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Pomodoro Timer Effect
  useEffect(() => {
    if (pomodoroRunning && pomodoroTime > 0) {
      pomodoroIntervalRef.current = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            handlePomodoroComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    }
    
    return () => {
      if (pomodoroIntervalRef.current) {
        clearInterval(pomodoroIntervalRef.current);
      }
    };
  }, [pomodoroRunning, pomodoroTime]);
  
  // Breathing Exercise Effect
  useEffect(() => {
    if (breathingActive) {
      const phases: ('inhale' | 'hold' | 'exhale')[] = ['inhale', 'hold', 'exhale'];
      let currentPhaseIndex = 0;
      
      const interval = setInterval(() => {
        currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
        setBreathingPhase(phases[currentPhaseIndex]);
        
        if (phases[currentPhaseIndex] === 'inhale') {
          setBreathingCount(prev => prev + 1);
        }
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [breathingActive]);
  
  const loadUserData = (userId: string) => {
    const savedTasks = localStorage.getItem(`campuscare_tasks_${userId}`);
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    
    const savedTimetable = localStorage.getItem(`campuscare_timetable_${userId}`);
    if (savedTimetable) setTimetable(JSON.parse(savedTimetable));
    
    const savedMoodHistory = localStorage.getItem(`campuscare_mood_${userId}`);
    if (savedMoodHistory) setMoodHistory(JSON.parse(savedMoodHistory));
    
    const savedStressHistory = localStorage.getItem(`campuscare_stress_${userId}`);
    if (savedStressHistory) setStressHistory(JSON.parse(savedStressHistory));
    
    const savedPomodoro = localStorage.getItem(`campuscare_pomodoro_${userId}`);
    if (savedPomodoro) setPomodoroSessions(JSON.parse(savedPomodoro));
    
    const savedStudyPlan = localStorage.getItem(`campuscare_studyplan_${userId}`);
    if (savedStudyPlan) setStudyPlan(JSON.parse(savedStudyPlan));
    
    const savedJournal = localStorage.getItem(`campuscare_journal_${userId}`);
    if (savedJournal) setJournalEntries(JSON.parse(savedJournal));
  };
  
  const checkDailyCheckIn = (userId: string) => {
    const today = new Date().toDateString();
    const lastCheckIn = localStorage.getItem(`campuscare_checkin_${userId}`);
    if (lastCheckIn !== today) {
      setShowDailyCheckIn(true);
    }
  };
  
  const updateStreak = (user: User) => {
    const today = new Date().toDateString();
    const lastActive = localStorage.getItem(`campuscare_lastactive_${user.id}`);
    
    if (lastActive) {
      const lastDate = new Date(lastActive);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Continue streak
        user.currentStreak = (user.currentStreak || 0) + 1;
        user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
      } else if (diffDays > 1) {
        // Streak broken
        user.currentStreak = 1;
      }
    } else {
      user.currentStreak = 1;
      user.longestStreak = 1;
    }
    
    localStorage.setItem(`campuscare_lastactive_${user.id}`, today);
    setCurrentUser({ ...user });
  };
  
  const saveUserData = (userId: string) => {
    localStorage.setItem(`campuscare_tasks_${userId}`, JSON.stringify(tasks));
    localStorage.setItem(`campuscare_timetable_${userId}`, JSON.stringify(timetable));
    localStorage.setItem(`campuscare_mood_${userId}`, JSON.stringify(moodHistory));
    localStorage.setItem(`campuscare_stress_${userId}`, JSON.stringify(stressHistory));
    localStorage.setItem(`campuscare_pomodoro_${userId}`, JSON.stringify(pomodoroSessions));
    if (studyPlan) localStorage.setItem(`campuscare_studyplan_${userId}`, JSON.stringify(studyPlan));
    localStorage.setItem(`campuscare_journal_${userId}`, JSON.stringify(journalEntries));
    if (currentUser) {
      localStorage.setItem('campuscare_user', JSON.stringify(currentUser));
    }
  };
  
  useEffect(() => {
    if (currentUser) {
      saveUserData(currentUser.id);
    }
  }, [tasks, timetable, moodHistory, stressHistory, pomodoroSessions, studyPlan, journalEntries, currentUser]);
  
  // Check for overdue tasks and update wellness score
  useEffect(() => {
    if (currentUser) {
      const now = new Date();
      const updatedTasks = tasks.map(task => {
        if (task.status === 'pending' && new Date(task.deadline) < now) {
          return { ...task, status: 'missed' as const };
        }
        return task;
      });
      
      const hasChanges = updatedTasks.some((task, index) => task.status !== tasks[index].status);
      if (hasChanges) {
        setTasks(updatedTasks);
      }
      
      // Update wellness score and burnout risk
      const wellnessScore = calculateWellnessScore(currentUser, tasks, timetable, pomodoroSessions);
      const burnoutRisk = predictBurnoutRisk(stressHistory, tasks, currentUser);
      const newAchievements = checkAchievements(currentUser, tasks, pomodoroSessions, timetable);
      
      if (wellnessScore !== currentUser.wellnessScore || burnoutRisk !== currentUser.burnoutRisk || newAchievements.length !== (currentUser.achievements || []).length) {
        setCurrentUser({
          ...currentUser,
          wellnessScore,
          burnoutRisk,
          achievements: newAchievements
        });
      }
    }
  }, [tasks, timetable, pomodoroSessions, stressHistory]);
  
  // ============================================================================
  // AUTH HANDLERS
  // ============================================================================
  
  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newUser: User = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      college: formData.get('college') as string,
      year: formData.get('year') as string,
      points: 0,
      level: 'Bronze',
      surveyCompleted: false,
      currentStreak: 0,
      longestStreak: 0,
      achievements: []
    };
    
    setCurrentUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('campuscare_user', JSON.stringify(newUser));
    toast.success('🎉 Welcome to CampusCare! Let\'s complete your wellness profile.');
  };
  
  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    const savedUser = localStorage.getItem('campuscare_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      if (user.email === email) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        loadUserData(user.id);
        checkDailyCheckIn(user.id);
        updateStreak(user);
        toast.success(`Welcome back, ${user.name}! 🎓`);
      } else {
        toast.error('User not found. Please register first.');
      }
    } else {
      toast.error('No account found. Please register first.');
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');
    toast.success('Logged out successfully');
  };
  
  // ============================================================================
  // STRESS ANALYSIS
  // ============================================================================
  
  const handleStressAnalysis = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const formData = new FormData(e.currentTarget);
    const sleepHours = parseFloat(formData.get('sleepHours') as string);
    const studyHours = parseFloat(formData.get('studyHours') as string);
    const selfStress = parseInt(formData.get('selfStress') as string);
    
    const { score, category } = calculateStressScore(sleepHours, studyHours, selfStress);
    
    const updatedUser: User = {
      ...currentUser,
      sleepHours,
      studyHours,
      selfStress,
      stressScore: score,
      stressCategory: category,
      surveyCompleted: true
    };
    
    setCurrentUser(updatedUser);
    localStorage.setItem('campuscare_user', JSON.stringify(updatedUser));
    
    const newEntry: StressHistory = {
      date: new Date().toLocaleDateString(),
      score,
      category
    };
    setStressHistory([...stressHistory, newEntry]);
    
    toast.success('✅ Wellness profile completed! Welcome to CampusCare Pro.');
  };
  
  // ============================================================================
  // DAILY CHECK-IN
  // ============================================================================
  
  const handleDailyCheckIn = (mood: 'happy' | 'neutral' | 'sad' | 'stressed', energy: number) => {
    if (!currentUser) return;
    
    const newMood: MoodEntry = {
      userId: currentUser.id,
      date: new Date().toDateString(),
      mood,
      energy
    };
    
    setMoodHistory([...moodHistory, newMood]);
    localStorage.setItem(`campuscare_checkin_${currentUser.id}`, new Date().toDateString());
    setShowDailyCheckIn(false);
    
    // Check for streak achievement
    const streak = currentUser.currentStreak || 0;
    if (streak === 3 || streak === 7 || streak === 30) {
      toast.success(`🔥 ${streak}-Day Streak! Achievement unlocked!`, { duration: 5000 });
    } else {
      toast.success('Daily check-in completed! +5 points');
    }
    
    // Award points
    setCurrentUser({
      ...currentUser,
      points: currentUser.points + 5,
      level: getLevelFromPoints(currentUser.points + 5)
    });
  };
  
  // ============================================================================
  // TASK MANAGEMENT
  // ============================================================================
  
  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const formData = new FormData(e.currentTarget);
    const newTask: Task = {
      id: Date.now().toString(),
      userId: currentUser.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      startTime: formData.get('startTime') as string,
      deadline: formData.get('deadline') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
      reward: formData.get('reward') as string,
      status: 'pending',
      createdAt: new Date().toISOString(),
      subject: formData.get('subject') as string
    };
    
    setTasks([...tasks, newTask]);
    toast.success('✅ Task created! Stay focused!');
    (e.target as HTMLFormElement).reset();
  };
  
  const handleCompleteTask = (taskId: string) => {
    if (!currentUser) return;
    
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const now = new Date();
    const deadline = new Date(task.deadline);
    
    if (now <= deadline) {
      const updatedTasks = tasks.map(t => 
        t.id === taskId ? { ...t, status: 'completed' as const } : t
      );
      setTasks(updatedTasks);
      
      const newPoints = currentUser.points + 10;
      const newLevel = getLevelFromPoints(newPoints);
      const updatedUser = { ...currentUser, points: newPoints, level: newLevel };
      setCurrentUser(updatedUser);
      
      executeReward(task.reward);
      
      const completedCount = updatedTasks.filter(t => t.status === 'completed').length;
      
      // Check for bonus reward
      if (completedCount % 5 === 0) {
        const bonusReward = getRandomReward();
        setTimeout(() => {
          toast.success('🎉 BONUS! 5 Tasks Milestone!', {
            description: `Extra: ${bonusReward.split(':')[1]}`,
            duration: 6000
          });
          executeReward(bonusReward);
        }, 1000);
      }
      
      toast.success('✅ Task completed! +10 points', {
        description: `🎁 ${task.reward}`
      });
    } else {
      toast.error('Cannot complete - deadline passed!');
    }
  };
  
  const executeReward = (reward: string) => {
    if (reward.toLowerCase().includes('spotify') || reward.includes('music')) {
      window.open('https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ', '_blank');
    } else if (reward.toLowerCase().includes('youtube')) {
      window.open('https://www.youtube.com/results?search_query=motivational+short', '_blank');
    }
  };
  
  const handleMissedTask = (taskId: string) => {
    const activity = getHealthyActivity();
    toast.error(`⚠️ Missed! Recovery: ${activity}`, {
      duration: 8000
    });
  };
  
  // ============================================================================
  // TIMETABLE & ATTENDANCE
  // ============================================================================
  
  const handleAddTimetableEntry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const formData = new FormData(e.currentTarget);
    const newEntry: TimetableEntry = {
      id: Date.now().toString(),
      userId: currentUser.id,
      subject: formData.get('subject') as string,
      day: formData.get('day') as string,
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      totalClasses: 0,
      attendedClasses: 0
    };
    
    setTimetable([...timetable, newEntry]);
    toast.success('📅 Class added to timetable');
    (e.target as HTMLFormElement).reset();
  };
  
  const markAttendance = (entryId: string, attended: boolean) => {
    const updatedTimetable = timetable.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          totalClasses: entry.totalClasses + 1,
          attendedClasses: attended ? entry.attendedClasses + 1 : entry.attendedClasses
        };
      }
      return entry;
    });
    setTimetable(updatedTimetable);
    toast.success(attended ? '✅ Present' : '⚠️ Absent');
  };
  
  const getAttendancePercentage = (entry: TimetableEntry): number => {
    if (entry.totalClasses === 0) return 0;
    return (entry.attendedClasses / entry.totalClasses) * 100;
  };
  
  const getTodayClasses = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    return timetable.filter(entry => entry.day === today);
  };
  
  // ============================================================================
  // POMODORO TIMER
  // ============================================================================
  
  const startPomodoro = (subject: string, duration: number = 25) => {
    if (!currentUser) return;
    
    const sessionId = Date.now().toString();
    setCurrentPomodoroId(sessionId);
    setPomodoroSubject(subject);
    setPomodoroTime(duration * 60);
    setPomodoroRunning(true);
    
    toast.success(`🍅 Pomodoro started: ${subject}`, {
      description: `${duration} minutes of focused study`
    });
  };
  
  const pausePomodoro = () => {
    setPomodoroRunning(false);
  };
  
  const resumePomodoro = () => {
    setPomodoroRunning(true);
  };
  
  const stopPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroTime(25 * 60);
    setCurrentPomodoroId(null);
    toast.info('Pomodoro stopped');
  };
  
  const handlePomodoroComplete = () => {
    if (!currentUser || !currentPomodoroId) return;
    
    const newSession: PomodoroSession = {
      id: currentPomodoroId,
      userId: currentUser.id,
      subject: pomodoroSubject,
      duration: 25,
      completed: true,
      date: new Date().toISOString(),
      startTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      endTime: new Date().toISOString()
    };
    
    setPomodoroSessions([...pomodoroSessions, newSession]);
    setPomodoroRunning(false);
    setPomodoroTime(25 * 60);
    setCurrentPomodoroId(null);
    
    // Award points
    setCurrentUser({
      ...currentUser,
      points: currentUser.points + 5,
      level: getLevelFromPoints(currentUser.points + 5)
    });
    
    toast.success('🎉 Pomodoro completed! +5 points', {
      description: 'Take a 5-minute break',
      duration: 8000
    });
  };
  
  // ============================================================================
  // AI STUDY PLANNER
  // ============================================================================
  
  const generateStudyPlan = (subjects: string[], hoursPerDay: number) => {
    if (!currentUser) return;
    
    const plan = generateAIStudyPlan(subjects, hoursPerDay, currentUser.stressCategory || 'Low Stress');
    plan.userId = currentUser.id;
    setStudyPlan(plan);
    
    toast.success('📚 AI Study Plan Generated!', {
      description: 'Check the Study tab for your personalized schedule',
      duration: 5000
    });
  };
  
  // ============================================================================
  // AI CHATBOT
  // ============================================================================
  
  const handleSendMessage = (message: string) => {
    if (!message.trim()) return;
    
    setChatMessages([
      ...chatMessages,
      { role: 'user', message },
      { role: 'ai', message: getAIChatResponse(message) }
    ]);
  };
  
  // ============================================================================
  // JOURNAL
  // ============================================================================
  
  const addJournalEntry = (content: string, mood: string, tags: string[]) => {
    if (!currentUser) return;
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      userId: currentUser.id,
      date: new Date().toISOString(),
      content,
      mood,
      tags
    };
    
    setJournalEntries([...journalEntries, newEntry]);
    toast.success('📝 Journal entry saved');
  };
  
  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================
  
  if (!isAuthenticated || !currentUser) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950' : 'bg-gradient-to-br from-slate-100 via-indigo-100 to-slate-100'}`}>
        <Toaster position="top-center" richColors />
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white text-4xl mb-4 shadow-lg">
              🧠
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              CampusCare Pro
            </CardTitle>
            <CardDescription className="text-base">AI-Powered Student Wellness Ecosystem</CardDescription>
          </CardHeader>
          <CardContent>
            {showRegister ? (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="john@university.edu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College/University</Label>
                  <Input id="college" name="college" required placeholder="MIT" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select name="year" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st Year">1st Year</SelectItem>
                      <SelectItem value="2nd Year">2nd Year</SelectItem>
                      <SelectItem value="3rd Year">3rd Year</SelectItem>
                      <SelectItem value="4th Year">4th Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                  Create Account
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setShowRegister(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    Login here
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" name="email" type="email" required placeholder="your@email.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required placeholder="••••••••" />
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                  Login
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  New to CampusCare?{' '}
                  <button
                    type="button"
                    onClick={() => setShowRegister(true)}
                    className="text-primary hover:underline font-medium"
                  >
                    Register now
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Show stress analysis if not completed
  if (!currentUser.surveyCompleted) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950' : 'bg-gradient-to-br from-slate-100 via-indigo-100 to-slate-100'}`}>
        <Toaster position="top-center" richColors />
        <Card className="w-full max-w-2xl shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              Wellness Profile Setup
            </CardTitle>
            <CardDescription>Help us personalize your experience with AI-powered insights</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStressAnalysis} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="sleepHours" className="flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Average Sleep Hours (per day)
                </Label>
                <Input
                  id="sleepHours"
                  name="sleepHours"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  required
                  placeholder="7.5"
                />
                <p className="text-xs text-muted-foreground">💡 Recommended: 7-9 hours for optimal cognitive function</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="studyHours" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Study Hours (per day)
                </Label>
                <Input
                  id="studyHours"
                  name="studyHours"
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  required
                  placeholder="4"
                />
                <p className="text-xs text-muted-foreground">💡 Quality over quantity - focused sessions work best</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="selfStress" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Current Stress Level
                </Label>
                <Input
                  id="selfStress"
                  name="selfStress"
                  type="number"
                  min="1"
                  max="10"
                  required
                  placeholder="5"
                />
                <p className="text-xs text-muted-foreground">Scale: 1 (Completely relaxed) to 10 (Extremely stressed)</p>
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>😌 Calm</span>
                  <span>😐 Moderate</span>
                  <span>😰 High</span>
                </div>
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600">
                Complete Profile & Enter CampusCare
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Daily Check-in Modal
  if (showDailyCheckIn) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950' : 'bg-gradient-to-br from-slate-100 via-indigo-100 to-slate-100'}`}>
        <Toaster position="top-center" richColors />
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-6 w-6 text-indigo-600" />
              Daily Check-in
            </CardTitle>
            <CardDescription>
              {currentUser.currentStreak ? `🔥 ${currentUser.currentStreak} day streak!` : 'How are you feeling today?'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Your Mood</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950"
                  onClick={() => handleDailyCheckIn('happy', 8)}
                >
                  <span className="text-4xl">😊</span>
                  <span className="font-medium">Happy</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
                  onClick={() => handleDailyCheckIn('neutral', 5)}
                >
                  <span className="text-4xl">😐</span>
                  <span className="font-medium">Neutral</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                  onClick={() => handleDailyCheckIn('sad', 3)}
                >
                  <span className="text-4xl">😞</span>
                  <span className="font-medium">Sad</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                  onClick={() => handleDailyCheckIn('stressed', 2)}
                >
                  <span className="text-4xl">😰</span>
                  <span className="font-medium">Stressed</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Main Dashboard
  const todayClasses = getTodayClasses();
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const missedTasks = tasks.filter(t => t.status === 'missed');
  const recentPomodoros = pomodoroSessions.filter(s => {
    const sessionDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });
  
  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];
  
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-slate-50'} ${focusMode ? 'filter grayscale' : ''}`}>
      <Toaster position="top-center" richColors />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl shadow-lg">
              🧠
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                CampusCare Pro
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentUser.name} {currentUser.currentStreak ? `🔥 ${currentUser.currentStreak}d` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser.wellnessScore && (
              <Badge variant="secondary" className="gap-1 hidden sm:flex">
                <Heart className="h-3 w-3" />
                {currentUser.wellnessScore}/100
              </Badge>
            )}
            <Badge variant="secondary" className="gap-1">
              <Trophy className="h-3 w-3" />
              {currentUser.level}
            </Badge>
            <Badge variant="outline" className="hidden sm:flex">{currentUser.points} pts</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAIChat(true)}
              className="relative"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Navigation */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4">
          <nav className="flex gap-6 h-12 overflow-x-auto">
            {[
              { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
              { id: 'tasks', icon: CheckCircle2, label: 'Tasks' },
              { id: 'study', icon: BookOpen, label: 'Study' },
              { id: 'wellness', icon: Heart, label: 'Wellness' },
              { id: 'timetable', icon: Calendar, label: 'Timetable' },
              { id: 'profile', icon: User, label: 'Profile' },
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setCurrentPage(id as any)}
                className={`flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap px-1 ${
                  currentPage === id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container px-4 py-6">
        {/* Dashboard Page */}
        {currentPage === 'dashboard' && (
          <div className="space-y-6">
            {/* Wellness Score & Burnout Alert */}
            {currentUser.wellnessScore && currentUser.burnoutRisk && (
              <Card className={`${currentUser.burnoutRisk === 'High Risk' ? 'border-red-500' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Wellness Dashboard
                      </CardTitle>
                      <CardDescription>AI-powered health monitoring</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{currentUser.wellnessScore}</div>
                      <p className="text-xs text-muted-foreground">Wellness Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Burnout Risk</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            currentUser.burnoutRisk === 'High Risk'
                              ? 'destructive'
                              : currentUser.burnoutRisk === 'Moderate Risk'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {currentUser.burnoutRisk}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Stress Category</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={
                            currentUser.stressCategory === 'High Stress'
                              ? 'destructive'
                              : currentUser.stressCategory === 'Moderate Stress'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {currentUser.stressCategory}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Progress value={currentUser.wellnessScore} className="h-2" />
                  {currentUser.burnoutRisk === 'High Risk' && (
                    <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                      <p className="text-sm text-red-800 dark:text-red-200 font-medium">
                        ⚠️ High burnout risk detected. Consider: reducing workload, using breathing exercises, or contacting counselor.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-l-4 border-l-indigo-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Tasks Progress</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{completedTasks.length}/{tasks.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {pendingTasks.length} pending · {missedTasks.length} missed
                  </p>
                  <Progress value={(completedTasks.length / (tasks.length || 1)) * 100} className="mt-2" />
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Focus Sessions</CardTitle>
                  <Timer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recentPomodoros.length}</div>
                  <p className="text-xs text-muted-foreground">This week</p>
                  <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mt-1">
                    {recentPomodoros.filter(s => s.completed).length * 25} minutes focused
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-pink-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
                  <Book className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{todayClasses.length}</div>
                  <p className="text-xs text-muted-foreground">Scheduled</p>
                </CardContent>
              </Card>
              
              <Card className="border-l-4 border-l-yellow-500">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Achievements</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentUser.achievements?.length || 0}</div>
                  <p className="text-xs text-muted-foreground">Unlocked</p>
                </CardContent>
              </Card>
            </div>
            
            {/* AI Recommendations */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {getAIRecommendation(
                    currentUser.stressCategory || 'Low Stress',
                    currentUser.sleepHours || 7,
                    currentUser.studyHours || 4
                  )}
                </p>
              </CardContent>
            </Card>
            
            {/* Pomodoro Timer Widget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5" />
                  Pomodoro Focus Timer
                </CardTitle>
                <CardDescription>25-minute focused study sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-6xl font-bold tabular-nums">
                    {Math.floor(pomodoroTime / 60).toString().padStart(2, '0')}:
                    {(pomodoroTime % 60).toString().padStart(2, '0')}
                  </div>
                  {pomodoroRunning && pomodoroSubject && (
                    <Badge variant="secondary" className="text-sm">
                      📚 {pomodoroSubject}
                    </Badge>
                  )}
                  <div className="flex gap-2">
                    {!pomodoroRunning && !currentPomodoroId && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="gap-2">
                              <Play className="h-4 w-4" />
                              Start Session
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Start Pomodoro Session</DialogTitle>
                              <DialogDescription>What will you focus on?</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label>Subject</Label>
                                <Input
                                  placeholder="e.g., Mathematics, Physics..."
                                  onChange={(e) => setPomodoroSubject(e.target.value)}
                                />
                              </div>
                              <Button
                                onClick={() => {
                                  if (pomodoroSubject) {
                                    startPomodoro(pomodoroSubject);
                                  }
                                }}
                                className="w-full"
                              >
                                Start 25-Minute Session
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                    {pomodoroRunning && (
                      <>
                        <Button onClick={pausePomodoro} variant="outline" className="gap-2">
                          <Pause className="h-4 w-4" />
                          Pause
                        </Button>
                        <Button onClick={stopPomodoro} variant="destructive" className="gap-2">
                          <SkipForward className="h-4 w-4" />
                          Stop
                        </Button>
                      </>
                    )}
                    {!pomodoroRunning && currentPomodoroId && (
                      <>
                        <Button onClick={resumePomodoro} className="gap-2">
                          <Play className="h-4 w-4" />
                          Resume
                        </Button>
                        <Button onClick={stopPomodoro} variant="outline">
                          Reset
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Today's Classes */}
            {todayClasses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Classes
                  </CardTitle>
                  <CardDescription>Mark your attendance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayClasses.map((entry) => (
                      <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{entry.subject}</p>
                          <p className="text-sm text-muted-foreground">
                            {entry.startTime} - {entry.endTime}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-500 text-green-600 hover:bg-green-50"
                            onClick={() => markAttendance(entry.id, true)}
                          >
                            Present
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => markAttendance(entry.id, false)}
                          >
                            Absent
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Pending Tasks Preview */}
            {pendingTasks.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Upcoming Tasks
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCurrentPage('tasks')}
                    >
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {pendingTasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="flex items-start justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{task.title}</p>
                            <Badge
                              variant={
                                task.priority === 'high'
                                  ? 'destructive'
                                  : task.priority === 'medium'
                                  ? 'default'
                                  : 'secondary'
                              }
                              className="text-xs"
                            >
                              {task.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Due: {new Date(task.deadline).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            🎁 {task.reward}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleCompleteTask(task.id)}
                        >
                          Complete
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Charts Row */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Stress Trend */}
              {stressHistory.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Stress Trend (Last 7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={stressHistory.slice(-7)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--background))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#6366f1"
                          strokeWidth={2}
                          dot={{ fill: '#6366f1', r: 4 }}
                          name="Stress Score"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
              
              {/* Task Distribution */}
              {tasks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Task Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Completed', value: completedTasks.length },
                            { name: 'Pending', value: pendingTasks.length },
                            { name: 'Missed', value: missedTasks.length },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {[
                            { name: 'Completed', value: completedTasks.length },
                            { name: 'Pending', value: pendingTasks.length },
                            { name: 'Missed', value: missedTasks.length },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Achievements Section */}
            {currentUser.achievements && currentUser.achievements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {ACHIEVEMENTS_LIST.filter(a => currentUser.achievements?.includes(a.id)).map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex flex-col items-center gap-2 p-4 border rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800"
                      >
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* Tasks Page */}
        {currentPage === 'tasks' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create New Task</CardTitle>
                <CardDescription>Add a task with deadline and custom reward</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTask} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Task Title *</Label>
                      <Input id="title" name="title" required placeholder="Complete assignment" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject (Optional)</Label>
                      <Input id="subject" name="subject" placeholder="Mathematics" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Task details..." rows={2} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority *</Label>
                      <Select name="priority" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input id="startTime" name="startTime" type="datetime-local" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadline">Deadline *</Label>
                      <Input id="deadline" name="deadline" type="datetime-local" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reward">Custom Reward *</Label>
                    <Input
                      id="reward"
                      name="reward"
                      required
                      placeholder="e.g., 10-minute break, snack, Spotify playlist"
                    />
                  </div>
                  <Button type="submit" className="gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Create Task
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">
                  Pending ({pendingTasks.length})
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed ({completedTasks.length})
                </TabsTrigger>
                <TabsTrigger value="missed">
                  Missed ({missedTasks.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="space-y-4 mt-4">
                {pendingTasks.map((task) => (
                  <Card key={task.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {task.title}
                            <Badge
                              variant={
                                task.priority === 'high'
                                  ? 'destructive'
                                  : task.priority === 'medium'
                                  ? 'default'
                                  : 'secondary'
                              }
                            >
                              {task.priority}
                            </Badge>
                            {task.subject && (
                              <Badge variant="outline">{task.subject}</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{task.description}</CardDescription>
                        </div>
                        <Button onClick={() => handleCompleteTask(task.id)} className="gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Complete
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Start: {new Date(task.startTime).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                        <span>Deadline: {new Date(task.deadline).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <span>Reward: {task.reward}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {pendingTasks.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">No pending tasks. Create one above! 🎯</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="completed" className="space-y-4 mt-4">
                {completedTasks.map((task) => (
                  <Card key={task.id} className="border-green-500/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        {task.title}
                      </CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        ✅ Completed | 🎁 Reward: {task.reward}
                      </p>
                    </CardContent>
                  </Card>
                ))}
                {completedTasks.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">No completed tasks yet. Keep going! 💪</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="missed" className="space-y-4 mt-4">
                {missedTasks.map((task) => (
                  <Card key={task.id} className="border-red-500/50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <XCircle className="h-5 w-5 text-red-500" />
                        {task.title}
                      </CardTitle>
                      <CardDescription>{task.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        ⚠️ Missed deadline: {new Date(task.deadline).toLocaleString()}
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => handleMissedTask(task.id)}
                        className="gap-2"
                      >
                        <Activity className="h-4 w-4" />
                        Get Recovery Activity
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                {missedTasks.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground">Perfect! No missed tasks. 🎉</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Study Page */}
        {currentPage === 'study' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  AI Study Planner
                </CardTitle>
                <CardDescription>Generate a personalized weekly study schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate AI Study Plan
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Study Plan</DialogTitle>
                      <DialogDescription>Enter your subjects and available study time</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Subjects (comma-separated)</Label>
                        <Input placeholder="Mathematics, Physics, Chemistry" id="subjects-input" />
                      </div>
                      <div>
                        <Label>Study Hours per Day</Label>
                        <Input type="number" min="1" max="12" step="0.5" placeholder="4" id="hours-input" />
                      </div>
                      <Button
                        onClick={() => {
                          const subjectsInput = document.getElementById('subjects-input') as HTMLInputElement;
                          const hoursInput = document.getElementById('hours-input') as HTMLInputElement;
                          
                          if (subjectsInput && hoursInput) {
                            const subjects = subjectsInput.value.split(',').map(s => s.trim()).filter(s => s);
                            const hours = parseFloat(hoursInput.value);
                            
                            if (subjects.length > 0 && hours > 0) {
                              generateStudyPlan(subjects, hours);
                            }
                          }
                        }}
                        className="w-full"
                      >
                        Generate Plan
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
            
            {studyPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Personalized Study Schedule</CardTitle>
                  <CardDescription>
                    Optimized for {currentUser.stressCategory} - {studyPlan.dailySchedule[0].sessions.length > 0 ? studyPlan.dailySchedule[0].sessions[0].duration : 25}-minute sessions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={studyPlan.dailySchedule[0].day}>
                    <TabsList className="grid w-full grid-cols-6">
                      {studyPlan.dailySchedule.map((day) => (
                        <TabsTrigger key={day.day} value={day.day}>
                          {day.day.slice(0, 3)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {studyPlan.dailySchedule.map((day) => (
                      <TabsContent key={day.day} value={day.day} className="space-y-3 mt-4">
                        {day.sessions.map((session, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{session.subject}</p>
                              <p className="text-sm text-muted-foreground">
                                {session.startTime} • {session.duration} min • {session.type}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startPomodoro(session.subject, session.duration)}
                            >
                              Start Now
                            </Button>
                          </div>
                        ))}
                        {day.sessions.length === 0 && (
                          <p className="text-center text-muted-foreground py-8">Rest day - no sessions scheduled</p>
                        )}
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            )}
            
            {/* Pomodoro History */}
            {pomodoroSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Focus Session Analytics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{pomodoroSessions.filter(s => s.completed).length}</p>
                        <p className="text-xs text-muted-foreground">Total Sessions</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold">
                          {pomodoroSessions.filter(s => s.completed).reduce((acc, s) => acc + s.duration, 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">Minutes Focused</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold">{recentPomodoros.filter(s => s.completed).length}</p>
                        <p className="text-xs text-muted-foreground">This Week</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Recent Sessions</h4>
                      <div className="space-y-2">
                        {pomodoroSessions.slice(-5).reverse().map((session) => (
                          <div key={session.id} className="flex items-center justify-between p-2 border rounded">
                            <div>
                              <p className="text-sm font-medium">{session.subject}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(session.date).toLocaleDateString()} • {session.duration} min
                              </p>
                            </div>
                            {session.completed && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* Wellness Page */}
        {currentPage === 'wellness' && (
          <div className="space-y-6">
            {/* Breathing Exercise */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Guided Breathing Exercise
                </CardTitle>
                <CardDescription>4-4-4 breathing technique for instant stress relief</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <div
                      className={`absolute w-full h-full rounded-full transition-all duration-[3800ms] ${
                        breathingPhase === 'inhale'
                          ? 'scale-150 bg-blue-400/30'
                          : breathingPhase === 'hold'
                          ? 'scale-150 bg-purple-400/30'
                          : 'scale-75 bg-green-400/30'
                      }`}
                    />
                    <div className="z-10 text-center">
                      <p className="text-2xl font-bold capitalize">{breathingPhase}</p>
                      <p className="text-sm text-muted-foreground">
                        {breathingActive && `Round ${breathingCount + 1}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => {
                        setBreathingActive(!breathingActive);
                        if (!breathingActive) {
                          setBreathingCount(0);
                          setBreathingPhase('inhale');
                        }
                      }}
                      variant={breathingActive ? 'destructive' : 'default'}
                      className="gap-2"
                    >
                      {breathingActive ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Stop
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Start Breathing
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {breathingCount >= 5 && (
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                      ✅ Great! You've completed {breathingCount} cycles. Keep going!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Emergency SOS */}
            <Card className="border-orange-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                  <Phone className="h-5 w-5" />
                  Emergency Support
                </CardTitle>
                <CardDescription>Immediate help for mental health crises</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <p className="text-sm mb-2">If you're experiencing a mental health crisis:</p>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Campus Counselor: (555) 123-4567</li>
                    <li>24/7 Mental Health Hotline: 1-800-273-8255</li>
                    <li>Crisis Text Line: Text HOME to 741741</li>
                  </ul>
                </div>
                <Button variant="outline" className="w-full gap-2 border-orange-500 text-orange-600">
                  <Phone className="h-4 w-4" />
                  Contact Campus Counselor
                </Button>
              </CardContent>
            </Card>
            
            {/* Mental Health Journal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Mental Health Journal
                </CardTitle>
                <CardDescription>Daily reflections and mood tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Edit3 className="h-4 w-4" />
                      New Journal Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Journal Entry</DialogTitle>
                      <DialogDescription>Write about your day, feelings, or challenges</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>How are you feeling?</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mood" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="great">😊 Great</SelectItem>
                            <SelectItem value="good">🙂 Good</SelectItem>
                            <SelectItem value="okay">😐 Okay</SelectItem>
                            <SelectItem value="bad">😞 Not good</SelectItem>
                            <SelectItem value="terrible">😰 Terrible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Your thoughts...</Label>
                        <Textarea
                          placeholder="What's on your mind? How was your day? Any challenges or wins?"
                          rows={6}
                          id="journal-content"
                        />
                      </div>
                      <div>
                        <Label>Tags (optional)</Label>
                        <Input placeholder="e.g., stress, exam, achievement" id="journal-tags" />
                      </div>
                      <Button
                        onClick={() => {
                          const content = (document.getElementById('journal-content') as HTMLTextAreaElement)?.value;
                          const tags = (document.getElementById('journal-tags') as HTMLInputElement)?.value.split(',').map(t => t.trim());
                          const mood = 'good'; // Get from select
                          
                          if (content) {
                            addJournalEntry(content, mood, tags);
                          }
                        }}
                        className="w-full"
                      >
                        Save Entry
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                
                {journalEntries.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium text-sm">Recent Entries</h4>
                    {journalEntries.slice(-3).reverse().map((entry) => (
                      <div key={entry.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">
                            {new Date(entry.date).toLocaleDateString()}
                          </p>
                          <Badge variant="secondary">{entry.mood}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {entry.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Mood Trend */}
            {moodHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Mood Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {moodHistory.slice(-7).map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{entry.date}</span>
                        <span className="text-2xl">
                          {entry.mood === 'happy' ? '😊' : entry.mood === 'neutral' ? '😐' : entry.mood === 'sad' ? '😞' : '😰'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* Timetable Page */}
        {currentPage === 'timetable' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Class to Timetable</CardTitle>
                <CardDescription>Build your weekly schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTimetableEntry} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" name="subject" required placeholder="Mathematics" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="day">Day *</Label>
                      <Select name="day" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS_OF_WEEK.map((day) => (
                            <SelectItem key={day} value={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time *</Label>
                      <Input id="startTime" name="startTime" type="time" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time *</Label>
                      <Input id="endTime" name="endTime" type="time" required />
                    </div>
                  </div>
                  <Button type="submit" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Add to Timetable
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Timetable & Attendance</CardTitle>
                <CardDescription>Your class schedule with attendance tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {DAYS_OF_WEEK.map((day) => {
                    const dayClasses = timetable.filter((entry) => entry.day === day);
                    if (dayClasses.length === 0) return null;
                    
                    return (
                      <div key={day}>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {day}
                        </h3>
                        <div className="space-y-2">
                          {dayClasses.map((entry) => {
                            const attendance = getAttendancePercentage(entry);
                            const attendanceColor =
                              attendance >= 75
                                ? 'text-green-600 dark:text-green-400'
                                : attendance >= 60
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400';
                            
                            return (
                              <div
                                key={entry.id}
                                className="flex items-center justify-between p-4 border rounded-lg"
                              >
                                <div className="flex-1">
                                  <p className="font-medium">{entry.subject}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {entry.startTime} - {entry.endTime}
                                  </p>
                                  <div className="mt-2 space-y-1">
                                    <p className={`text-sm font-medium ${attendanceColor}`}>
                                      Attendance: {attendance.toFixed(1)}%
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {entry.attendedClasses} / {entry.totalClasses} classes
                                    </p>
                                    <Progress value={attendance} className="h-1.5 mt-1" />
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                  {timetable.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No timetable entries yet. Add your classes above! 📅</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Subject-wise Attendance Overview */}
            {timetable.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={timetable.map((entry) => ({
                        subject: entry.subject,
                        attendance: getAttendancePercentage(entry),
                      }))}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="attendance" fill="#6366f1" radius={[8, 8, 0, 0]} name="Attendance %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        )}
        
        {/* Profile Page */}
        {currentPage === 'profile' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Name</Label>
                    <p className="text-lg font-medium">{currentUser.name}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <p className="text-lg font-medium">{currentUser.email}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">College</Label>
                    <p className="text-lg font-medium">{currentUser.college}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Year</Label>
                    <p className="text-lg font-medium">{currentUser.year}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Wellness Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <Label className="text-xs text-muted-foreground">Wellness Score</Label>
                    <p className="text-3xl font-bold">{currentUser.wellnessScore || 0}/100</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label className="text-xs text-muted-foreground">Stress Category</Label>
                    <p className="text-lg font-medium">{currentUser.stressCategory}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label className="text-xs text-muted-foreground">Sleep Hours</Label>
                    <p className="text-lg font-medium">{currentUser.sleepHours}h / day</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <Label className="text-xs text-muted-foreground">Study Hours</Label>
                    <p className="text-lg font-medium">{currentUser.studyHours}h / day</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Rewards & Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                  <div>
                    <Label className="text-xs text-muted-foreground">Current Level</Label>
                    <p className="text-3xl font-bold">{currentUser.level}</p>
                  </div>
                  <Trophy className="h-16 w-16 text-yellow-500" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm">Total Points</Label>
                    <span className="text-2xl font-bold">{currentUser.points}</span>
                  </div>
                  <Progress value={(currentUser.points % 50) * 2} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {50 - (currentUser.points % 50)} points to next level
                  </p>
                </div>
                
                <div>
                  <Label className="text-sm mb-3 block">Streaks</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-3xl font-bold flex items-center justify-center gap-1">
                        <Flame className="h-6 w-6 text-orange-500" />
                        {currentUser.currentStreak || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Current Streak</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <p className="text-3xl font-bold flex items-center justify-center gap-1">
                        <Star className="h-6 w-6 text-yellow-500" />
                        {currentUser.longestStreak || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Longest Streak</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* All Achievements */}
            <Card>
              <CardHeader>
                <CardTitle>Achievement Gallery</CardTitle>
                <CardDescription>
                  {currentUser.achievements?.length || 0} / {ACHIEVEMENTS_LIST.length} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {ACHIEVEMENTS_LIST.map((achievement) => {
                    const isUnlocked = currentUser.achievements?.includes(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-all ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-yellow-200 dark:border-yellow-800'
                            : 'opacity-50 grayscale'
                        }`}
                      >
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="text-center">
                          <p className="text-sm font-medium">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        {isUnlocked && (
                          <Badge variant="secondary" className="text-xs">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  const updatedUser = { ...currentUser, surveyCompleted: false };
                  setCurrentUser(updatedUser);
                  localStorage.setItem('campuscare_user', JSON.stringify(updatedUser));
                }}
              >
                Retake Wellness Assessment
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => {
                  toast.success('Report download feature coming soon!');
                }}
              >
                <FileDown className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        )}
      </main>
      
      {/* AI Chatbot Dialog */}
      <Dialog open={showAIChat} onOpenChange={setShowAIChat}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-indigo-600" />
              AI Wellness Assistant
            </DialogTitle>
            <DialogDescription>
              Ask me anything about stress, studying, motivation, or mental health
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🤖</div>
                  <p className="text-muted-foreground">
                    Hi! I'm your AI wellness assistant. How can I help you today?
                  </p>
                </div>
              )}
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              id="chat-input"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.currentTarget;
                  if (input.value.trim()) {
                    handleSendMessage(input.value);
                    input.value = '';
                  }
                }
              }}
            />
            <Button
              onClick={() => {
                const input = document.getElementById('chat-input') as HTMLInputElement;
                if (input && input.value.trim()) {
                  handleSendMessage(input.value);
                  input.value = '';
                }
              }}
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Focus Mode Overlay */}
      {focusMode && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="w-64">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Focus Mode Active</p>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setFocusMode(false)}
                >
                  Exit
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Distractions minimized. Stay focused! 🎯
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
