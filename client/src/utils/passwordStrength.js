export const checkPasswordStrength = (password) => {
  const criteria = [
    { regex: /.{8,}/, description: 'At least 8 characters' },
    { regex: /[A-Z]/, description: 'Uppercase letter' },
    { regex: /[a-z]/, description: 'Lowercase letter' },
    { regex: /[0-9]/, description: 'Number' },
    { regex: /[^A-Za-z0-9]/, description: 'Special character' }
  ];

  const strength = criteria.reduce((score, criterion) => {
    return score + (criterion.regex.test(password) ? 1 : 0);
  }, 0);

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ff4d4f', '#ffa940', '#ffec3d', '#73d13d', '#40a9ff'];

  return {
    score: strength,
    label: strengthLabels[strength - 1] || 'Very Weak',
    color: strength === 0 ? '#ff4d4f' : strengthColors[strength - 1],
    criteria: criteria.map(c => ({
      description: c.description,
      met: c.regex.test(password)
    }))
  };
};
