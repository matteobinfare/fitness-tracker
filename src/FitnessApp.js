import React, { useState, useEffect } from 'react';
import { Plus, X, TrendingUp, Activity, Zap, Heart, Target, BarChart3, ChevronDown, Dumbbell, Wind, TrendingUpIcon, LogOut } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const FitnessApp = () => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginName, setLoginName] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerCode, setRegisterCode] = useState('');
  const [authError, setAuthError] = useState('');

  // App state
  const [activeTab, setActiveTab] = useState('workout');
  const [workoutSessions, setWorkoutSessions] = useState([]);
  const [cardioSessions, setCardioSessions] = useState([]);
  const [bodyWeightEntries, setBodyWeightEntries] = useState([]);
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [currentExercises, setCurrentExercises] = useState([]);
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [goal, setGoal] = useState(75);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const REGISTRATION_CODE = 'pennypasta';

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Check if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('fitness-current-user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  // Load user data when logged in
  useEffect(() => {
    if (currentUser) {
      const userDataKey = `fitness-data-${currentUser.id}`;
      const saved = localStorage.getItem(userDataKey);
      if (saved) {
        const data = JSON.parse(saved);
        setWorkoutSessions(data.workouts || []);
        setCardioSessions(data.cardio || []);
        setBodyWeightEntries(data.bodyWeight || []);
        setGoal(data.goal || 75);
      }
    }
  }, [currentUser]);

  // Save user data
  useEffect(() => {
    if (currentUser) {
      const userDataKey = `fitness-data-${currentUser.id}`;
      localStorage.setItem(userDataKey, JSON.stringify({
        workouts: workoutSessions,
        cardio: cardioSessions,
        bodyWeight: bodyWeightEntries,
        goal
      }));
    }
  }, [workoutSessions, cardioSessions, bodyWeightEntries, goal, currentUser]);

  const handleLogin = () => {
    setAuthError('');
    if (!loginName || !loginPassword) {
      setAuthError('Please enter name and password');
      return;
    }
    const users = JSON.parse(localStorage.getItem('fitness-users') || '[]');
    const user = users.find(u => u.name === loginName && u.password === loginPassword);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('fitness-current-user', JSON.stringify(user));
      setLoginName('');
      setLoginPassword('');
    } else {
      setAuthError('Invalid name or password');
    }
  };

  const handleRegister = () => {
    setAuthError('');
    if (!registerName || !registerPassword || !registerCode) {
      setAuthError('Please fill in all fields');
      return;
    }
    if (registerCode !== REGISTRATION_CODE) {
      setAuthError('Invalid registration code');
      return;
    }
    const users = JSON.parse(localStorage.getItem('fitness-users') || '[]');
    if (users.find(u => u.name === registerName)) {
      setAuthError('Name already exists');
      return;
    }
    const newUser = { id: Date.now(), name: registerName, password: registerPassword };
    users.push(newUser);
    localStorage.setItem('fitness-users', JSON.stringify(users));
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    localStorage.setItem('fitness-current-user', JSON.stringify(newUser));
    setRegisterName('');
    setRegisterPassword('');
    setRegisterCode('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('fitness-current-user');
    setActiveTab('workout');
  };

  // Cardio
  const [cardioType, setCardioType] = useState('Running');
  const [cardioDistance, setCardioDistance] = useState('');
  const [cardioTime, setCardioTime] = useState('');
  const [cardioCalories, setCardioCalories] = useState('');
  const [cardioDate, setCardioDate] = useState(new Date().toISOString().split('T')[0]);

  // Body weight
  const [bodyWeight, setBodyWeight] = useState('');
  const [bodyWeightDate, setBodyWeightDate] = useState(new Date().toISOString().split('T')[0]);

  const allExercises = [
    // Chest
    { name: 'Machine Chest Press', category: 'Chest' },
    { name: 'Incline Machine Chest Press', category: 'Chest' },
    { name: 'Flat Dumbbell Bench Press', category: 'Chest' },
    { name: 'Incline Dumbbell Bench Press', category: 'Chest' },
    { name: 'Neutral-Grip Dumbbell Bench Press', category: 'Chest' },
    { name: 'Dumbbell Squeeze Press', category: 'Chest' },
    { name: 'Pec-Deck Fly', category: 'Chest' },
    { name: 'Cable Chest Fly', category: 'Chest' },
    
    // Back and Lats
    { name: 'Lat Pulldown', category: 'Back' },
    { name: 'Neutral-Grip Lat Pulldown', category: 'Back' },
    { name: 'Single-Arm Cable Pulldown', category: 'Back' },
    { name: 'Assisted Pull-Up Machine', category: 'Back' },
    { name: 'Seated Cable Row', category: 'Back' },
    { name: 'Chest-Supported Row Machine', category: 'Back' },
    { name: 'Plate-Loaded High-Row Machine', category: 'Back' },
    { name: 'Single-Arm Machine Row', category: 'Back' },
    { name: 'One-Arm Dumbbell Row', category: 'Back' },
    { name: 'Chest-Supported Dumbbell Row', category: 'Back' },
    
    // Shoulders, Rear Delts, and Traps
    { name: 'Seated Dumbbell Shoulder Press', category: 'Shoulders' },
    { name: 'Shoulder Press Machine', category: 'Shoulders' },
    { name: 'Arnold Press', category: 'Shoulders' },
    { name: 'Dumbbell Lateral Raise', category: 'Shoulders' },
    { name: 'Machine Lateral Raise', category: 'Shoulders' },
    { name: 'Single-Arm Cable Lateral Raise', category: 'Shoulders' },
    { name: 'Reverse Pec-Deck Rear-Delt Fly', category: 'Shoulders' },
    { name: 'Chest-Supported Dumbbell Rear-Delt Fly', category: 'Shoulders' },
    { name: 'Dumbbell Shrug', category: 'Shoulders' },
    
    // Biceps
    { name: 'Alternating Dumbbell Curl', category: 'Biceps' },
    { name: 'Dumbbell Hammer Curl', category: 'Biceps' },
    { name: 'Incline Dumbbell Curl', category: 'Biceps' },
    { name: 'Preacher-Curl Machine', category: 'Biceps' },
    { name: 'Cable Biceps Curl', category: 'Biceps' },
    { name: 'Dumbbell Concentration Curl', category: 'Biceps' },
    
    // Triceps
    { name: 'Rope Cable Pushdown', category: 'Triceps' },
    { name: 'Straight-Bar Cable Pushdown', category: 'Triceps' },
    { name: 'Single-Arm Cable Pushdown', category: 'Triceps' },
    { name: 'Overhead Dumbbell Triceps Extension', category: 'Triceps' },
    { name: 'Assisted or Weighted Dip Machine', category: 'Triceps' },
    { name: 'Dumbbell Skull Crusher', category: 'Triceps' },
    
    // Quadriceps
    { name: 'Leg Extension', category: 'Quads' },
    { name: 'Bilateral Leg Press', category: 'Quads' },
    { name: 'Single-Leg Leg Press', category: 'Quads' },
    { name: 'Hack-Squat Machine', category: 'Quads' },
    { name: 'Pendulum-Squat Machine', category: 'Quads' },
    { name: 'Smith-Machine Squat', category: 'Quads' },
    { name: 'Dumbbell Goblet Squat', category: 'Quads' },
    { name: 'Dumbbell Bulgarian Split Squat', category: 'Quads' },
    { name: 'Dumbbell Step-Up', category: 'Quads' },
    
    // Hamstrings
    { name: 'Dumbbell Romanian Deadlift', category: 'Hamstrings' },
    { name: 'Single-Leg Dumbbell Romanian Deadlift', category: 'Hamstrings' },
    { name: 'Seated Leg Curl', category: 'Hamstrings' },
    { name: 'Lying Leg Curl', category: 'Hamstrings' },
    { name: 'Standing Single-Leg Curl Machine', category: 'Hamstrings' },
    { name: 'Forty-Five-Degree Back Extension', category: 'Hamstrings' },
    
    // Glutes and Hips
    { name: 'Hip-Thrust Machine', category: 'Glutes' },
    { name: 'Smith-Machine Hip Thrust', category: 'Glutes' },
    { name: 'Dumbbell Hip Thrust', category: 'Glutes' },
    { name: 'Dumbbell Glute Bridge', category: 'Glutes' },
    { name: 'Hip-Abduction Machine', category: 'Glutes' },
    { name: 'Hip-Adduction Machine', category: 'Glutes' },
    { name: 'Cable Glute Kickback', category: 'Glutes' },
    
    // Calves
    { name: 'Standing Calf-Raise Machine', category: 'Calves' },
    { name: 'Seated Calf-Raise Machine', category: 'Calves' },
    { name: 'Leg-Press Calf Press', category: 'Calves' },
    { name: 'Dumbbell Calf Raise', category: 'Calves' },
    
    // Core and Loaded Carries
    { name: 'Machine Abdominal Crunch', category: 'Core' },
    { name: 'Kneeling Cable Crunch', category: 'Core' },
    { name: 'Cable Pallof Press', category: 'Core' },
    { name: 'Cable Wood Chop', category: 'Core' },
    { name: 'Hanging Knee Raise', category: 'Core' },
    { name: 'Dumbbell Suitcase Carry', category: 'Core' },
    { name: 'Dumbbell Farmer Carry', category: 'Core' }
  ];

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem('fitness-data-v2');
    if (saved) {
      const data = JSON.parse(saved);
      setWorkoutSessions(data.workouts || []);
      setCardioSessions(data.cardio || []);
      setBodyWeightEntries(data.bodyWeight || []);
      setGoal(data.goal || 75);
    }
  }, []);

  // Load exercises for selected date
  useEffect(() => {
    const existing = workoutSessions.find(s => s.date === selectedDate);
    if (existing) {
      setCurrentExercises(existing.exercises);
    } else {
      setCurrentExercises([]);
    }
  }, [selectedDate, workoutSessions]);

  // Save data
  useEffect(() => {
    localStorage.setItem('fitness-data-v2', JSON.stringify({
      workouts: workoutSessions,
      cardio: cardioSessions,
      bodyWeight: bodyWeightEntries,
      goal
    }));
  }, [workoutSessions, cardioSessions, bodyWeightEntries, goal]);

  const addExerciseToWorkout = (exerciseName) => {
    const newExercise = {
      id: Date.now(),
      name: exerciseName,
      sets: [{ weight: 0, reps: 8 }]
    };
    setCurrentExercises([...currentExercises, newExercise]);
    setShowAddExercise(false);
  };

  const removeExercise = (id) => {
    setCurrentExercises(currentExercises.filter(ex => ex.id !== id));
  };

  const updateExerciseSet = (id, setIndex, field, value) => {
    setCurrentExercises(currentExercises.map(ex => {
      if (ex.id === id) {
        const newSets = [...ex.sets];
        newSets[setIndex] = { ...newSets[setIndex], [field]: parseFloat(value) || 0 };
        return { ...ex, sets: newSets };
      }
      return ex;
    }));
  };

  const addSetToExercise = (id) => {
    setCurrentExercises(currentExercises.map(ex => {
      if (ex.id === id) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return { ...ex, sets: [...ex.sets, { ...lastSet }] };
      }
      return ex;
    }));
  };

  const removeSetFromExercise = (id, setIndex) => {
    setCurrentExercises(currentExercises.map(ex => {
      if (ex.id === id) {
        return { ...ex, sets: ex.sets.filter((_, idx) => idx !== setIndex) };
      }
      return ex;
    }));
  };

  const saveWorkout = () => {
    if (currentExercises.length === 0) {
      alert('Add at least one exercise');
      return;
    }
    const newSessions = workoutSessions.filter(s => s.date !== selectedDate);
    newSessions.push({ date: selectedDate, exercises: currentExercises });
    setWorkoutSessions(newSessions.sort((a, b) => new Date(b.date) - new Date(a.date)));
    alert('Workout logged! 💪');
  };

  const addCardio = () => {
    if (!cardioDistance && !cardioTime) {
      alert('Add distance or time');
      return;
    }
    setCardioSessions([...cardioSessions, {
      date: cardioDate,
      type: cardioType,
      distance: parseFloat(cardioDistance) || 0,
      time: cardioTime,
      calories: parseFloat(cardioCalories) || 0
    }]);
    setCardioDistance('');
    setCardioTime('');
    setCardioCalories('');
    alert('Cardio logged! 🏃');
  };

  const addBodyWeight = () => {
    if (!bodyWeight) {
      alert('Enter your weight');
      return;
    }
    setBodyWeightEntries([...bodyWeightEntries, {
      date: bodyWeightDate,
      weight: parseFloat(bodyWeight)
    }]);
    setBodyWeight('');
    alert('Weight logged! ⚖️');
  };

  const getRecentWorkouts = () => {
    return workoutSessions.slice().reverse().slice(0, 10);
  };

  const bodyWeightTrend = bodyWeightEntries.sort((a, b) => new Date(a.date) - new Date(b.date));

  const getStats = () => {
    return {
      totalWorkouts: workoutSessions.length,
      totalCardio: cardioSessions.length,
      currentWeight: bodyWeightTrend.length > 0 ? bodyWeightTrend[bodyWeightTrend.length - 1].weight : null,
      weeklyDistance: cardioSessions
        .filter(c => {
          const today = new Date();
          const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
          return new Date(c.date) >= weekStart;
        })
        .reduce((sum, c) => sum + c.distance, 0)
    };
  };

  const getExerciseProgressData = (exerciseName) => {
    const progressByDate = {};
    workoutSessions.forEach(session => {
      const exercise = session.exercises.find(ex => ex.name === exerciseName);
      if (exercise) {
        const totalWeight = exercise.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
        const maxWeight = Math.max(...exercise.sets.map(s => s.weight));
        const totalReps = exercise.sets.reduce((sum, set) => sum + set.reps, 0);
        
        if (!progressByDate[session.date]) {
          progressByDate[session.date] = { totalVolume: 0, maxWeight: 0, sets: 0, totalReps: 0 };
        }
        progressByDate[session.date].totalVolume = totalWeight;
        progressByDate[session.date].maxWeight = Math.max(progressByDate[session.date].maxWeight, maxWeight);
        progressByDate[session.date].sets += exercise.sets.length;
        progressByDate[session.date].totalReps = totalReps;
      }
    });
    
    return Object.entries(progressByDate).map(([date, data]) => ({
      date: date.slice(5),
      fullDate: date,
      ...data
    })).sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
  };

  const getMostUsedExercises = () => {
    const exerciseCount = {};
    workoutSessions.forEach(session => {
      session.exercises.forEach(ex => {
        exerciseCount[ex.name] = (exerciseCount[ex.name] || 0) + 1;
      });
    });
    return Object.entries(exerciseCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const getVolumeByDate = () => {
    const volumeByDate = {};
    workoutSessions.forEach(session => {
      let totalVolume = 0;
      session.exercises.forEach(ex => {
        totalVolume += ex.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
      });
      volumeByDate[session.date] = totalVolume;
    });
    
    return Object.entries(volumeByDate)
      .map(([date, volume]) => ({
        date: date.slice(5),
        volume: volume
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const stats = getStats();
  const usedExercises = new Set(currentExercises.map(ex => ex.name));
  const availableExercises = allExercises.filter(ex => !usedExercises.has(ex.name));
  const mostUsedExercises = getMostUsedExercises();
  const volumeData = getVolumeByDate();

  // Login/Register UI
  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: darkMode ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>💪</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, color: '#fff' }}>FitTrack</h1>
            <p style={{ margin: '8px 0 0 0', color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>Your personal fitness companion</p>
          </div>

          {/* Card */}
          <div style={{ background: darkMode ? '#1e1e2e' : '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            {!isRegistering ? (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 24px 0', color: darkMode ? '#fff' : '#333' }}>Login</h2>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: darkMode ? '#b0b0b0' : '#666', marginBottom: '6px' }}>Name</label>
                  <input
                    type="text"
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${darkMode ? '#333' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'border 0.2s',
                      background: darkMode ? '#2a2a3e' : '#fff',
                      color: darkMode ? '#fff' : '#333'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = darkMode ? '#333' : '#e0e0e0'}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: darkMode ? '#b0b0b0' : '#666', marginBottom: '6px' }}>Password</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Your password"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: `2px solid ${darkMode ? '#333' : '#e0e0e0'}`,
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      transition: 'border 0.2s',
                      background: darkMode ? '#2a2a3e' : '#fff',
                      color: darkMode ? '#fff' : '#333'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = darkMode ? '#333' : '#e0e0e0'}
                  />
                </div>

                {authError && (
                  <div style={{ padding: '12px', background: '#fee', borderRadius: '8px', color: '#d32f2f', fontSize: '13px', marginBottom: '16px' }}>
                    {authError}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '12px',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setIsRegistering(true);
                    setAuthError('');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#f5f5f5',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#efefef'}
                  onMouseOut={(e) => e.target.style.background = '#f5f5f5'}
                >
                  Create Account
                </button>
              </div>
            ) : (
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 24px 0', color: darkMode ? '#e0e0e0' : '#333' }}>Create Account</h2>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: darkMode ? '#b0b0b0' : '#666', marginBottom: '6px' }}>Name</label>
                  <input
                    type="text"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    placeholder="Your name"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: darkMode ? '#b0b0b0' : '#666', marginBottom: '6px' }}>Password</label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="Create password"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: darkMode ? '#b0b0b0' : '#666', marginBottom: '6px' }}>Registration Code</label>
                  <input
                    type="password"
                    value={registerCode}
                    onChange={(e) => setRegisterCode(e.target.value)}
                    placeholder="Registration code"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#667eea'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {authError && (
                  <div style={{ padding: '12px', background: '#fee', borderRadius: '8px', color: '#d32f2f', fontSize: '13px', marginBottom: '16px' }}>
                    {authError}
                  </div>
                )}

                <button
                  onClick={handleRegister}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginBottom: '12px'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Create Account
                </button>

                <button
                  onClick={() => {
                    setIsRegistering(false);
                    setAuthError('');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#f5f5f5',
                    color: '#667eea',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#efefef'}
                  onMouseOut={(e) => e.target.style.background = '#f5f5f5'}
                >
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main App UI
  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f0f1e' : '#f8f9fa', paddingBottom: '40px' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '24px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💪</span> FitTrack
          </h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '13px' }}>Welcome, {currentUser.name}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: darkMode ? '#1a1a2e' : '#fff', borderBottom: `2px solid ${darkMode ? '#333' : '#e8eaed'}`, display: 'flex', overflowX: 'auto', padding: '0 16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        {[
          { id: 'workout', label: 'Workout', icon: Dumbbell },
          { id: 'cardio', label: 'Cardio', icon: Wind },
          { id: 'bodyweight', label: 'Weight', icon: Heart },
          { id: 'analytics', label: 'Analytics', icon: TrendingUpIcon }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
                color: activeTab === tab.id ? '#667eea' : (darkMode ? '#888' : '#999'),
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 16px' }}>
        {/* WORKOUT TAB */}
        {activeTab === 'workout' && (
          <div>
            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)', color: '#fff' }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: 0, marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Workouts</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{stats.totalWorkouts}</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)', color: '#fff' }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: 0, marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Cardio</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{stats.totalCardio}</p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)', color: '#fff' }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: 0, marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Weight</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>
                  {stats.currentWeight ? stats.currentWeight.toFixed(1) : '—'}
                </p>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(67, 233, 123, 0.3)', color: '#fff' }}>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', margin: 0, marginBottom: '6px', fontWeight: '600', textTransform: 'uppercase' }}>Wk Distance</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{stats.weeklyDistance.toFixed(1)}</p>
              </div>
            </div>

            {/* Main Workout Logger */}
            <div style={{ background: darkMode ? '#1a1a2e' : '#fff', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ padding: '20px', borderBottom: '2px solid #f0f0f0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: 0, color: '#fff' }}>Log Your Workout</h2>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontWeight: '500',
                    background: 'rgba(255,255,255,0.1)',
                    color: '#fff'
                  }}
                />
              </div>

              {/* Exercises List */}
              <div style={{ padding: '20px' }}>
                {currentExercises.length === 0 ? (
                  <p style={{ textAlign: 'center', color: darkMode ? '#888' : '#999', margin: '20px 0' }}>No exercises added yet</p>
                ) : (
                  <div style={{ display: 'grid', gap: '16px', marginBottom: '16px' }}>
                    {currentExercises.map((exercise) => (
                      <div key={exercise.id} style={{ border: '1px solid #eee', borderRadius: '6px', padding: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 'bold', margin: 0, color: darkMode ? '#e0e0e0' : '#333' }}>{exercise.name}</h4>
                          <button
                            onClick={() => removeExercise(exercise.id)}
                            style={{ background: 'none', border: 'none', color: '#d32f2f', cursor: 'pointer', fontSize: '20px', padding: 0 }}
                          >
                            ×
                          </button>
                        </div>

                        {/* Sets */}
                        <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                          {exercise.sets.map((set, setIdx) => (
                            <div key={setIdx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: '8px', alignItems: 'flex-end' }}>
                              <div>
                                <label style={{ display: 'block', fontSize: '11px', color: darkMode ? '#888' : '#999', marginBottom: '4px', fontWeight: '600' }}>
                                  Set {setIdx + 1} Weight
                                </label>
                                <input
                                  type="number"
                                  step="0.5"
                                  value={set.weight}
                                  onChange={(e) => updateExerciseSet(exercise.id, setIdx, 'weight', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: `1px solid ${darkMode ? '#333' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                  }}
                                  placeholder="0"
                                />
                              </div>
                              <div>
                                <label style={{ display: 'block', fontSize: '11px', color: darkMode ? '#888' : '#999', marginBottom: '4px', fontWeight: '600' }}>
                                  Reps
                                </label>
                                <input
                                  type="number"
                                  value={set.reps}
                                  onChange={(e) => updateExerciseSet(exercise.id, setIdx, 'reps', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '8px',
                                    border: `1px solid ${darkMode ? '#333' : '#ddd'}`,
                                    borderRadius: '4px',
                                    fontSize: '14px',
                                    boxSizing: 'border-box'
                                  }}
                                  placeholder="8"
                                />
                              </div>
                              <span style={{ fontSize: '12px', color: darkMode ? '#888' : '#999' }}>lbs</span>
                              {exercise.sets.length > 1 && (
                                <button
                                  onClick={() => removeSetFromExercise(exercise.id, setIdx)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#d32f2f',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    padding: 0,
                                    width: '24px'
                                  }}
                                >
                                  ×
                                </button>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Add Set Button */}
                        <button
                          onClick={() => addSetToExercise(exercise.id)}
                          style={{
                            fontSize: '12px',
                            padding: '6px 10px',
                            background: '#f0f0f0',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontWeight: '500',
                            color: '#667eea'
                          }}
                        >
                          + Add Set
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Exercise Dropdown / Modal */}
                <div style={{ position: 'relative', marginBottom: '16px' }}>
                  <button
                    onClick={() => setShowAddExercise(!showAddExercise)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      border: '2px dashed #667eea',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#667eea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.target.style.background = 'rgba(102, 126, 234, 0.15)'; }}
                    onMouseOut={(e) => { e.target.style.background = 'rgba(102, 126, 234, 0.1)'; }}
                  >
                    <Plus size={18} /> Add Exercise
                  </button>

                  {showAddExercise && isMobile && (
                    <>
                      <div
                        style={{
                          position: 'fixed',
                          inset: 0,
                          background: 'rgba(0,0,0,0.5)',
                          zIndex: 999,
                          top: 0
                        }}
                        onClick={() => setShowAddExercise(false)}
                      />
                      <div style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        background: darkMode ? '#1a1a2e' : '#fff',
                        borderRadius: '12px 12px 0 0',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        zIndex: 1000,
                        padding: '20px 16px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <h3 style={{ margin: 0, color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>Add Exercise</h3>
                          <button
                            onClick={() => setShowAddExercise(false)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: darkMode ? '#888' : '#999' }}
                          >
                            ×
                          </button>
                        </div>
                        {availableExercises.length === 0 ? (
                          <p style={{ textAlign: 'center', color: darkMode ? '#888' : '#999' }}>All exercises added</p>
                        ) : (
                          <div style={{ display: 'grid', gap: '8px' }}>
                            {['Push', 'Pull', 'Legs'].map(category => {
                              const categoryExercises = availableExercises.filter(ex => ex.category === category);
                              return categoryExercises.length > 0 ? (
                                <div key={category}>
                                  <p style={{ fontSize: '12px', fontWeight: '600', color: darkMode ? '#888' : '#999', textTransform: 'uppercase', margin: '12px 0 8px 0' }}>{category}</p>
                                  {categoryExercises.map(ex => (
                                    <button
                                      key={ex.name}
                                      onClick={() => {
                                        addExerciseToWorkout(ex.name);
                                        setShowAddExercise(false);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: `1px solid ${darkMode ? '#333' : '#ddd'}`,
                                        background: darkMode ? '#252535' : '#f9f9f9',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        color: darkMode ? '#e0e0e0' : '#333',
                                        borderRadius: '4px',
                                        marginBottom: '8px',
                                        transition: 'background 0.2s'
                                      }}
                                      onTouchStart={(e) => e.target.style.background = '#f0f0f0'}
                                      onTouchEnd={(e) => e.target.style.background = '#f9f9f9'}
                                    >
                                      {ex.name}
                                    </button>
                                  ))}
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {showAddExercise && !isMobile && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      width: 'calc(100vw - 40px)',
                      maxWidth: '600px',
                      background: darkMode ? '#1a1a2e' : '#fff',
                      border: `1px solid ${darkMode ? '#333' : '#ddd'}`,
                      borderRadius: '6px',
                      marginTop: '4px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      zIndex: 10,
                      maxHeight: '450px',
                      overflowY: 'auto',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr 1fr'
                    }}>
                      {availableExercises.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: darkMode ? '#888' : '#999', gridColumn: '1 / -1' }}>All exercises added</div>
                      ) : (
                        <>
                          {['Push', 'Pull', 'Legs'].map(category => {
                            const categoryExercises = availableExercises.filter(ex => ex.category === category);
                            return categoryExercises.length > 0 ? (
                              <div key={category} style={{ gridColumn: '1 / -1' }}>
                                <div style={{ padding: '10px 16px', background: darkMode ? '#252535' : '#f9f9f9', fontWeight: '600', fontSize: '11px', color: darkMode ? '#888' : '#999', textTransform: 'uppercase', borderBottom: `1px solid ${darkMode ? '#333' : '#eee'}`, position: 'sticky', top: 0 }}>
                                  {category}
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0 }}>
                                  {categoryExercises.map(ex => (
                                    <button
                                      key={ex.name}
                                      onClick={() => addExerciseToWorkout(ex.name)}
                                      style={{
                                        padding: '12px',
                                        border: '1px solid #eee',
                                        background: 'none',
                                        textAlign: 'left',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        color: darkMode ? '#e0e0e0' : '#333',
                                        transition: 'background 0.2s'
                                      }}
                                      onMouseOver={(e) => e.target.style.background = '#f5f5f5'}
                                      onMouseOut={(e) => e.target.style.background = 'none'}
                                    >
                                      {ex.name}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : null;
                          })}
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Log Button */}
                <button
                  onClick={saveWorkout}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Log Workout 💪
                </button>
              </div>
            </div>

            {/* Recent Workouts */}
            {getRecentWorkouts().length > 0 && (
              <div style={{ marginTop: '24px', background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#667eea' }}>Recent Workouts</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {getRecentWorkouts().map((session, idx) => (
                    <div key={idx} style={{ padding: '12px', background: darkMode ? '#252535' : '#f9f9f9', borderRadius: '6px', borderLeft: '3px solid #2c3e50' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: darkMode ? '#e0e0e0' : '#333' }}>{session.exercises.length} exercises</p>
                        <p style={{ margin: 0, fontSize: '12px', color: darkMode ? '#888' : '#999' }}>
                          {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <p style={{ margin: 0, fontSize: '12px', color: darkMode ? '#b0b0b0' : '#666' }}>
                        {session.exercises.map(ex => ex.name).join(' • ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CARDIO TAB */}
        {activeTab === 'cardio' && (
          <div>
            <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>Log Cardio</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: darkMode ? '#888' : '#999', marginBottom: '6px', fontWeight: '600' }}>Date</label>
                    <input
                      type="date"
                      value={cardioDate}
                      onChange={(e) => setCardioDate(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: `1px solid ${darkMode ? '#333' : '#ddd'}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: darkMode ? '#888' : '#999', marginBottom: '6px', fontWeight: '600' }}>Type</label>
                    <select
                      value={cardioType}
                      onChange={(e) => setCardioType(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: `1px solid ${darkMode ? '#333' : '#ddd'}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                    >
                      <option>Running</option>
                      <option>Cycling</option>
                      <option>Rowing</option>
                      <option>Swimming</option>
                      <option>Elliptical</option>
                      <option>Climbing</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: darkMode ? '#888' : '#999', marginBottom: '6px', fontWeight: '600' }}>Distance (mi)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={cardioDistance}
                      onChange={(e) => setCardioDistance(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: `1px solid ${darkMode ? '#333' : '#ddd'}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: darkMode ? '#888' : '#999', marginBottom: '6px', fontWeight: '600' }}>Time (mm:ss)</label>
                    <input
                      type="text"
                      placeholder="30:45"
                      value={cardioTime}
                      onChange={(e) => setCardioTime(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: `1px solid ${darkMode ? '#333' : '#ddd'}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: darkMode ? '#888' : '#999', marginBottom: '6px', fontWeight: '600' }}>Calories</label>
                    <input
                      type="number"
                      value={cardioCalories}
                      onChange={(e) => setCardioCalories(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: `1px solid ${darkMode ? '#333' : '#ddd'}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <button
                  onClick={addCardio}
                  style={{
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(245, 87, 108, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Log Cardio
                </button>
              </div>
            </div>

            {cardioSessions.length > 0 && (
              <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>Recent Sessions</h3>
                <div style={{ display: 'grid', gap: '12px' }}>
                  {cardioSessions.slice().reverse().slice(0, 10).map((session, idx) => (
                    <div key={idx} style={{ padding: '12px', background: darkMode ? '#252535' : '#f9f9f9', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ margin: 0, fontWeight: 'bold', color: darkMode ? '#e0e0e0' : '#333' }}>{session.type}</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: darkMode ? '#888' : '#999' }}>{session.date}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#667eea' }}>{session.distance} mi</p>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: darkMode ? '#888' : '#999' }}>{session.time} {session.calories ? `• ${session.calories} cal` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BODY WEIGHT TAB */}
        {activeTab === 'bodyweight' && (
          <div>
            <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>Log Weight</h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: darkMode ? '#888' : '#999', marginBottom: '6px', fontWeight: '600' }}>Weight (lbs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={bodyWeight}
                      onChange={(e) => setBodyWeight(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: `1px solid ${darkMode ? '#333' : '#ddd'}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: darkMode ? '#888' : '#999', marginBottom: '6px', fontWeight: '600' }}>Date</label>
                    <input
                      type="date"
                      value={bodyWeightDate}
                      onChange={(e) => setBodyWeightDate(e.target.value)}
                      style={{ width: '100%', padding: '8px', border: `1px solid ${darkMode ? '#333' : '#ddd'}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', color: darkMode ? '#888' : '#999', marginBottom: '6px', fontWeight: '600' }}>Goal (lbs)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={goal}
                      onChange={(e) => setGoal(parseFloat(e.target.value))}
                      style={{ width: '100%', padding: '8px', border: `1px solid ${darkMode ? '#333' : '#ddd'}`, borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
                <button
                  onClick={addBodyWeight}
                  style={{
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Log Weight
                </button>
              </div>
            </div>

            {bodyWeightTrend.length > 0 && (
              <div>
                <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', marginBottom: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>Weight Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={bodyWeightTrend.map(e => ({ date: e.date.slice(5), weight: e.weight, goal: goal }))}>
                      <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#eee'} />
                      <XAxis dataKey="date" stroke={darkMode ? '#666' : '#999'} style={{ fontSize: '12px' }} />
                      <YAxis stroke={darkMode ? '#666' : '#999'} style={{ fontSize: '12px' }} />
                      <Tooltip contentStyle={{ background: darkMode ? '#252535' : '#f8f8f8', border: 'none', borderRadius: '6px' }} />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#667eea" name="Your Weight" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="goal" stroke="#ddd" name="Goal" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>History</h3>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {bodyWeightTrend.slice().reverse().map((entry, idx) => (
                      <div key={idx} style={{ padding: '12px', background: darkMode ? '#252535' : '#f9f9f9', borderRadius: '6px', display: 'flex', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold', color: darkMode ? '#e0e0e0' : '#333' }}>{entry.weight} lbs</p>
                          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: darkMode ? '#888' : '#999' }}>{entry.date}</p>
                        </div>
                        {bodyWeightTrend.length > 1 && idx < bodyWeightTrend.length - 1 && (
                          <p style={{ margin: 0, fontSize: '12px', color: bodyWeightTrend[bodyWeightTrend.length - 1 - idx - 1].weight > entry.weight ? '#d32f2f' : '#4caf50' }}>
                            {Math.abs((bodyWeightTrend[bodyWeightTrend.length - 1 - idx - 1].weight - entry.weight).toFixed(1))} {bodyWeightTrend[bodyWeightTrend.length - 1 - idx - 1].weight > entry.weight ? '↓' : '↑'}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div>
            {workoutSessions.length === 0 && cardioSessions.length === 0 ? (
              <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '40px 20px', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <p style={{ color: darkMode ? '#888' : '#999', margin: 0 }}>Start logging workouts and cardio to see analytics</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Summary Stats */}
                <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>📊 Summary</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                    <div style={{ padding: '12px', background: darkMode ? '#252535' : '#f9f9f9', borderRadius: '6px' }}>
                      <p style={{ margin: 0, color: darkMode ? '#888' : '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Total Workouts</p>
                      <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', color: '#667eea', fontSize: '24px' }}>{workoutSessions.length}</p>
                    </div>
                    <div style={{ padding: '12px', background: darkMode ? '#252535' : '#f9f9f9', borderRadius: '6px' }}>
                      <p style={{ margin: 0, color: darkMode ? '#888' : '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Cardio Sessions</p>
                      <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', color: '#667eea', fontSize: '24px' }}>{cardioSessions.length}</p>
                    </div>
                    <div style={{ padding: '12px', background: darkMode ? '#252535' : '#f9f9f9', borderRadius: '6px' }}>
                      <p style={{ margin: 0, color: darkMode ? '#888' : '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Total Distance</p>
                      <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', color: '#667eea', fontSize: '24px' }}>{cardioSessions.reduce((sum, c) => sum + c.distance, 0).toFixed(1)}</p>
                      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: darkMode ? '#888' : '#999' }}>miles</p>
                    </div>
                    <div style={{ padding: '12px', background: darkMode ? '#252535' : '#f9f9f9', borderRadius: '6px' }}>
                      <p style={{ margin: 0, color: darkMode ? '#888' : '#999', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>Exercises</p>
                      <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', color: '#667eea', fontSize: '24px' }}>{new Set(workoutSessions.flatMap(s => s.exercises.map(e => e.name))).size}</p>
                    </div>
                  </div>
                </div>

                {/* Latest Workout Breakdown */}
                {workoutSessions.length > 0 && (
                  <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>💪 Latest Workout Details</h3>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {workoutSessions[workoutSessions.length - 1].exercises.map((ex, idx) => {
                        const totalVolume = ex.sets.reduce((sum, set) => sum + (set.weight * set.reps), 0);
                        const maxWeight = Math.max(...ex.sets.map(s => s.weight));
                        const totalReps = ex.sets.reduce((sum, set) => sum + set.reps, 0);
                        return (
                          <div key={idx} style={{ padding: '12px', background: darkMode ? '#252535' : '#f9f9f9', borderRadius: '6px' }}>
                            <p style={{ margin: 0, fontWeight: 'bold', color: darkMode ? '#e0e0e0' : '#333', fontSize: '14px' }}>{ex.name}</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginTop: '8px', fontSize: '12px' }}>
                              <div>
                                <p style={{ margin: 0, color: darkMode ? '#888' : '#999' }}>Max Weight</p>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: '#667eea' }}>{maxWeight} lbs</p>
                              </div>
                              <div>
                                <p style={{ margin: 0, color: darkMode ? '#888' : '#999' }}>Total Reps</p>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: '#667eea' }}>{totalReps}</p>
                              </div>
                              <div>
                                <p style={{ margin: 0, color: darkMode ? '#888' : '#999' }}>Sets</p>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: '#667eea' }}>{ex.sets.length}</p>
                              </div>
                              <div>
                                <p style={{ margin: 0, color: darkMode ? '#888' : '#999' }}>Volume</p>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 'bold', color: '#667eea' }}>{totalVolume}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Total Volume Over Time - Show even with 1 workout */}
                {volumeData.length > 0 && (
                  <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>📊 Total Volume Per Workout</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={volumeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#eee'} />
                        <XAxis dataKey="date" stroke={darkMode ? '#666' : '#999'} style={{ fontSize: '12px' }} />
                        <YAxis stroke={darkMode ? '#666' : '#999'} style={{ fontSize: '12px' }} />
                        <Tooltip contentStyle={{ background: darkMode ? '#252535' : '#f8f8f8', border: 'none', borderRadius: '6px' }} formatter={(value) => value.toFixed(0)} />
                        <Bar dataKey="volume" fill="#667eea" name="Volume (lbs×reps)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    {workoutSessions.length === 1 && (
                      <p style={{ fontSize: '12px', color: darkMode ? '#888' : '#999', margin: '12px 0 0 0', textAlign: 'center' }}>Log more workouts to see trends over time</p>
                    )}
                  </div>
                )}

                {/* Most Used Exercises */}
                {mostUsedExercises.length > 0 && (
                  <div style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '16px', fontWeight: 'bold' }}>🎯 Most Used Exercises</h3>
                    <ResponsiveContainer width="100%" height={Math.max(200, mostUsedExercises.length * 40)}>
                      <BarChart data={mostUsedExercises} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#eee'} />
                        <XAxis type="number" stroke={darkMode ? '#666' : '#999'} style={{ fontSize: '12px' }} />
                        <YAxis dataKey="name" type="category" stroke={darkMode ? '#666' : '#999'} style={{ fontSize: '11px' }} width={150} />
                        <Tooltip contentStyle={{ background: darkMode ? '#252535' : '#f8f8f8', border: 'none', borderRadius: '6px' }} />
                        <Bar dataKey="count" fill="#667eea" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Exercise Progress Section */}
                {mostUsedExercises.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 16px 0', color: '#667eea' }}>📈 Exercise Progress</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {mostUsedExercises.slice(0, 4).map((exercise) => {
                        const progressData = getExerciseProgressData(exercise.name);
                        if (progressData.length === 0) return null;
                        return (
                          <div key={exercise.name} style={{ background: darkMode ? '#1a1a2e' : '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                            <h4 style={{ margin: '0 0 16px 0', color: '#667eea', fontSize: '14px', fontWeight: 'bold' }}>{exercise.name}</h4>
                            {progressData.length === 1 ? (
                              <div style={{ padding: '20px', background: darkMode ? '#252535' : '#f9f9f9', borderRadius: '6px', textAlign: 'center' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                  <div>
                                    <p style={{ margin: 0, color: darkMode ? '#888' : '#999', fontSize: '12px' }}>Max Weight</p>
                                    <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', color: '#667eea', fontSize: '20px' }}>{progressData[0].maxWeight} lbs</p>
                                  </div>
                                  <div>
                                    <p style={{ margin: 0, color: darkMode ? '#888' : '#999', fontSize: '12px' }}>Total Volume</p>
                                    <p style={{ margin: '6px 0 0 0', fontWeight: 'bold', color: '#667eea', fontSize: '20px' }}>{progressData[0].totalVolume}</p>
                                  </div>
                                </div>
                                <p style={{ fontSize: '12px', color: darkMode ? '#888' : '#999', margin: '12px 0 0 0' }}>Log more to see progress charts</p>
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={progressData}>
                                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#333' : '#eee'} />
                                  <XAxis dataKey="date" stroke={darkMode ? '#666' : '#999'} style={{ fontSize: '12px' }} />
                                  <YAxis stroke={darkMode ? '#666' : '#999'} style={{ fontSize: '12px' }} yAxisId="left" />
                                  <YAxis stroke={darkMode ? '#666' : '#999'} style={{ fontSize: '12px' }} yAxisId="right" orientation="right" />
                                  <Tooltip contentStyle={{ background: darkMode ? '#252535' : '#f8f8f8', border: 'none', borderRadius: '6px' }} />
                                  <Legend />
                                  <Line yAxisId="left" type="monotone" dataKey="maxWeight" stroke="#667eea" name="Max Weight" strokeWidth={2} dot={false} />
                                  <Line yAxisId="right" type="monotone" dataKey="totalVolume" stroke="#f5576c" name="Total Volume" strokeWidth={2} dot={false} />
                                </LineChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FitnessApp;
