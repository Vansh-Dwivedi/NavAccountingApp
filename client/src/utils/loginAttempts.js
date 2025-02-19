const LOGIN_ATTEMPTS_KEY = 'loginAttempts';
const COOLDOWN_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_ATTEMPTS = 3;

export const trackLoginAttempt = (email, success) => {
  const now = Date.now();
  const attempts = getLoginAttempts();

  if (success) {
    // Reset attempts on successful login
    localStorage.removeItem(LOGIN_ATTEMPTS_KEY);
    return { blocked: false, remainingAttempts: MAX_ATTEMPTS };
  }

  // Clean up old attempts
  const recentAttempts = attempts.filter(
    attempt => now - attempt.timestamp < COOLDOWN_TIME
  );

  // Add new failed attempt
  recentAttempts.push({
    email,
    timestamp: now
  });

  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(recentAttempts));

  const userAttempts = recentAttempts.filter(attempt => attempt.email === email);
  const isBlocked = userAttempts.length >= MAX_ATTEMPTS;
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - userAttempts.length);

  return {
    blocked: isBlocked,
    remainingAttempts,
    cooldownRemaining: isBlocked ? 
      COOLDOWN_TIME - (now - userAttempts[0].timestamp) : 0
  };
};

export const getLoginAttempts = () => {
  try {
    return JSON.parse(localStorage.getItem(LOGIN_ATTEMPTS_KEY)) || [];
  } catch {
    return [];
  }
};

export const checkLoginStatus = (email) => {
  const now = Date.now();
  const attempts = getLoginAttempts();
  
  // Clean up old attempts
  const recentAttempts = attempts.filter(
    attempt => now - attempt.timestamp < COOLDOWN_TIME
  );
  
  const userAttempts = recentAttempts.filter(attempt => attempt.email === email);
  const isBlocked = userAttempts.length >= MAX_ATTEMPTS;
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - userAttempts.length);

  return {
    blocked: isBlocked,
    remainingAttempts,
    cooldownRemaining: isBlocked ? 
      COOLDOWN_TIME - (now - userAttempts[0].timestamp) : 0
  };
};
