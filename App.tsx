import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useStore } from './store/useStore';
import { translations, Language } from './data/i18n';
import { classroomCodes } from './data/curriculum';
import ActivityRunner from './pages/ActivityRunner';
import { Star, Clock, LogOut, Settings as SettingsIcon, BookOpen, Hash, Eye, RotateCcw, Home, Type, Cloud, Sun, Users, Shapes, Palette, Apple, ShirtIcon as Shirt, Gamepad2, CloudRain, PenTool, Heart } from 'lucide-react';

const Login: React.FC = () => {
  const { login, setLanguage, language, isAuthenticated } = useStore();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  
  const t = translations[language];

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = () => {
    if (classroomCodes[code]) {
      if (name.trim()) {
        login(code, name);
      } else {
        login(code, "Little Learner");
      }
      navigate('/');
    } else {
      setError(t.invalidCode);
      setTimeout(() => setError(''), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-cream-50 relative overflow-hidden">
      {/* Background Animations */}
      <div className="absolute top-10 left-10 text-peach-400 opacity-40 animate-float pointer-events-none">
        <Cloud size={80} fill="currentColor" />
      </div>
      <div className="absolute top-1/3 right-10 text-blue-200 opacity-60 animate-float-slow pointer-events-none">
        <Cloud size={120} fill="currentColor" />
      </div>
      <div className="absolute bottom-20 left-20 text-green-200 opacity-50 animate-float pointer-events-none" style={{ animationDelay: '2s' }}>
        <Cloud size={90} fill="currentColor" />
      </div>
      <div className="absolute -top-20 -right-20 text-yellow-300 opacity-80 animate-spin-slow pointer-events-none">
        <Sun size={200} fill="currentColor" />
      </div>

      <header className="mb-8 text-center animate-bounce-slight relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold text-green-500 mb-2 drop-shadow-sm">NexToddlers</h1>
      </header>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-4 border-peach-400 space-y-6 relative z-10">
        <div className="flex justify-center gap-2 mb-4">
          {(['en', 'ru', 'tr'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1 rounded-full font-bold uppercase text-sm transition-transform active:scale-95 ${
                language === lang 
                  ? 'bg-green-500 text-white shadow-md' 
                  : 'bg-cream-50 text-midnight-900 border border-gray-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-midnight-900 mb-1 ml-2">{t.enterCode}</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="LUM123"
              className="w-full p-4 rounded-xl bg-cream-50 border-2 border-gray-200 focus:border-green-500 text-xl font-bold text-center outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-midnight-900 mb-1 ml-2">{t.pickNickname}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alice"
              className="w-full p-4 rounded-xl bg-cream-50 border-2 border-gray-200 focus:border-green-500 text-xl font-bold text-center outline-none transition-colors"
            />
          </div>
          
          {error && <p className="text-peach-400 text-center font-bold animate-pulse">{error}</p>}

          <button
            onClick={handleLogin}
            className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-xl shadow-lg transform transition active:scale-95"
          >
            {t.start}
          </button>
        </div>
      </div>

      {/* TEACHER MESSAGE */}
      <div className="mt-8 w-full max-w-md bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border-4 border-indigo-300 shadow-xl relative z-10 backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
            <BookOpen className="h-8 w-8 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              {t.teacherWelcome}
              <span className="text-2xl">👋</span>
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3 text-sm">
              {t.teacherMessage}
            </p>
            <div className="flex items-center gap-2 bg-white/80 rounded-full px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600 font-medium">📞 {t.teacherContact}</span>
              <a 
                href="tel:+905318598494" 
                className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors text-sm"
              >
                +90 (531) 859 84 94
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

const Dashboard: React.FC = () => {
  const { nickname, stars, logout, language, sessionDuration, setSessionDuration } = useStore();
  const t = translations[language];
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream-50 p-4 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pt-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-peach-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
            {nickname?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-midnight-900 leading-tight">{t.hello},</h2>
            <p className="text-midnight-900 opacity-70 leading-tight">{nickname}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
          <Star className="text-yellow-400 fill-yellow-400" size={20} />
          <span className="font-bold text-lg text-midnight-900">{stars}</span>
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-8">
        {/* Settings Card */}
        <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3 opacity-60">
            <SettingsIcon size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{t.settings}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-midnight-900">
              <Clock size={20} />
              <span className="font-medium">Session</span>
            </div>
            <div className="flex bg-cream-50 rounded-lg p-1">
              {[5, 10].map(mins => (
                <button
                  key={mins}
                  onClick={() => setSessionDuration(mins)}
                  className={`px-3 py-1 rounded-md text-sm font-bold transition-all ${
                    sessionDuration === mins 
                      ? 'bg-white shadow text-green-500' 
                      : 'text-gray-400'
                  }`}
                >
                  {mins} {t.minutes}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => navigate('/categories/letters-reading')}
            className="group relative h-32 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 text-white overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-green-500/40"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
              <BookOpen size={80} />
            </div>
            <div className="relative z-10 text-left">
              <span className="block text-5xl mb-1">📚</span>
              <span className="opacity-90 font-medium text-lg">{t.groupLettersReading}</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/categories/numbers')}
            className="group relative h-32 bg-gradient-to-br from-peach-400 to-orange-500 rounded-3xl p-6 text-white overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-peach-400/40"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
              <Hash size={80} />
            </div>
            <div className="relative z-10 text-left">
              <span className="block text-5xl mb-1">🔢</span>
              <span className="opacity-90 font-medium text-lg">{t.groupNumbers}</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/categories/everyday')}
            className="group relative h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-6 text-white overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-blue-400/40"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-500 group-hover:scale-110">
              <Apple size={80} />
            </div>
            <div className="relative z-10 text-left">
              <span className="block text-5xl mb-1">🌍</span>
              <span className="opacity-90 font-medium text-lg">{t.groupEveryday}</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/categories/people')}
            className="group relative h-32 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/40"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-500 group-hover:scale-110">
              <Users size={80} />
            </div>
            <div className="relative z-10 text-left">
              <span className="block text-5xl mb-1">👨‍👩‍👧</span>
              <span className="opacity-90 font-medium text-lg">{t.groupPeople}</span>
            </div>
          </button>

          <button 
            onClick={() => navigate('/categories/art')}
            className="group relative h-32 bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-6 text-white overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/40"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
              <Palette size={80} />
            </div>
            <div className="relative z-10 text-left">
              <span className="block text-5xl mb-1">🎨</span>
              <span className="opacity-90 font-medium text-lg">{t.groupArt}</span>
            </div>
          </button>
        </section>

        <button 
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-4 text-gray-400 hover:text-peach-400 transition-colors"
        >
          <LogOut size={18} />
          <span className="font-bold">{t.logOut}</span>
        </button>
      </main>
    </div>
  );
};

const CategoryGroup: React.FC = () => {
  const { group } = useParams<{ group: string }>();
  const { language } = useStore();
  const t = translations[language];
  const navigate = useNavigate();

  console.log('CategoryGroup - group param:', group);
  console.log('CategoryGroup - language:', language);
  console.log('CategoryGroup - translations:', t);

  // Define category groups and their activities
  const categoryGroups: Record<string, { title: string; activities: Array<{ id: string; name: string; emoji: string; color: string; icon: any }> }> = {
    'letters-reading': {
      title: t.groupLettersReading,
      activities: [
        { id: 'tracing', name: t.tracing, emoji: '✍️', color: 'bg-indigo-500', icon: PenTool },
        { id: 'letters', name: t.letters, emoji: '📝', color: 'bg-green-500', icon: BookOpen },
        { id: 'sightWords', name: t.sightWords, emoji: '👀', color: 'bg-midnight-900', icon: Eye },
        { id: 'spelling', name: t.spelling, emoji: '🔠', color: 'bg-pink-500', icon: Type },
      ],
    },
    'numbers': {
      title: t.groupNumbers,
      activities: [
        { id: 'numbers', name: t.numbers, emoji: '🔢', color: 'bg-peach-400', icon: Hash },
      ],
    },
    'everyday': {
      title: t.groupEveryday,
      activities: [
        { id: 'food', name: t.food, emoji: '🍎', color: 'bg-red-400', icon: Apple },
        { id: 'clothes', name: t.clothes, emoji: '👕', color: 'bg-teal-500', icon: Shirt },
        { id: 'toys', name: t.toys, emoji: '🧸', color: 'bg-yellow-400', icon: Gamepad2 },
        { id: 'weather', name: t.weather, emoji: '☀️', color: 'bg-cyan-400', icon: CloudRain },
        { id: 'seasons', name: t.seasons, emoji: '🍂', color: 'bg-amber-500', icon: Sun },
        { id: 'bodyParts', name: t.bodyParts, emoji: '👂', color: 'bg-rose-400', icon: Users },
      ],
    },
    'people': {
      title: t.groupPeople,
      activities: [
        { id: 'family', name: t.family, emoji: '👨‍👩‍👧‍👦', color: 'bg-purple-500', icon: Users },
        { id: 'feelings', name: t.feelings, emoji: '😊', color: 'bg-pink-400', icon: Heart },
      ],
    },
    'art': {
      title: t.groupArt,
      activities: [
        { id: 'shapes', name: t.shapes, emoji: '🔺', color: 'bg-blue-400', icon: Shapes },
        { id: 'colors', name: t.colors, emoji: '🎨', color: 'bg-orange-400', icon: Palette },
      ],
    },
  };

  const currentGroup = group ? categoryGroups[group] : null;

  if (!currentGroup) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-xl text-midnight-900 mb-4">Category not found</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-green-500 text-white rounded-xl font-bold">
            {t.goHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 p-4 pb-20">
      {/* Header */}
      <header className="flex items-center gap-4 mb-8 pt-2">
        <button 
          onClick={() => navigate('/')} 
          className="p-2 rounded-full bg-white border-2 border-peach-400 text-midnight-900 hover:bg-peach-400 transition-colors"
        >
          <Home size={24} />
        </button>
        <h1 className="text-2xl md:text-3xl font-bold text-midnight-900">{currentGroup.title}</h1>
      </header>

      {/* Activities Grid */}
      <main className="max-w-md mx-auto">
        <section className="grid grid-cols-1 gap-4">
          {currentGroup.activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <button 
                key={activity.id}
                onClick={() => navigate(`/practice/${activity.id}`)}
                className={`group relative h-32 ${activity.color} rounded-3xl p-6 text-white overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-20 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <Icon size={80} />
                </div>
                <div className="relative z-10 text-left">
                  <span className="block text-5xl mb-1">{activity.emoji}</span>
                  <span className="opacity-90 font-medium text-lg">{activity.name}</span>
                </div>
              </button>
            );
          })}
        </section>
      </main>
    </div>
  );
};

const LessonComplete: React.FC = () => {
  const { language } = useStore();
  const t = translations[language];
  const navigate = useNavigate();
  const location = useLocation();
  const { stars, topic } = location.state || { stars: 0, topic: '' };

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center p-4 space-y-8 animate-bounce-slight">
      <h1 className="text-4xl md:text-5xl font-bold text-green-500 text-center">{t.lessonComplete}</h1>
      
      <div className="bg-white p-8 rounded-[2rem] shadow-xl border-4 border-peach-400 flex flex-col items-center w-full max-w-sm transform transition-transform hover:scale-105">
        <Star size={80} className="text-yellow-400 fill-yellow-400 mb-4 animate-pulse" />
        <span className="text-7xl font-bold text-midnight-900 mb-2">{stars}</span>
        <span className="text-xl text-gray-500 font-bold uppercase tracking-widest">{t.starsEarned}</span>
      </div>

      <div className="flex flex-col w-full max-w-xs gap-4 mt-8">
        <button 
          onClick={() => navigate(`/practice/${topic}`)}
          className="w-full py-4 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-2xl font-bold text-xl shadow-lg flex items-center justify-center gap-3 transition-colors"
        >
          <RotateCcw size={24} />
          {t.practiceMore}
        </button>
        
        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 bg-white hover:bg-gray-50 text-midnight-900 border-2 border-gray-200 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-colors"
        >
          <Home size={24} />
          {t.goHome}
        </button>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/categories/:group" element={
          <ProtectedRoute>
            <CategoryGroup />
          </ProtectedRoute>
        } />
        <Route path="/practice/:topic" element={
          <ProtectedRoute>
            <ActivityRunner />
          </ProtectedRoute>
        } />
        <Route path="/complete" element={
          <ProtectedRoute>
            <LessonComplete />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;