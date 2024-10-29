const isValidDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

export const formatDate = (date) => {
  if (!isValidDate(date)) return null;
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }); // DD-MM-YYYY format
};

export const formatDateTime = (date) => {
  if (!isValidDate(date)) return null;
  const d = new Date(date);
  return d.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }); // DD-MM-YYYY HH:mm:ss format
};

// Helper function for DatePicker
export const toDatePickerFormat = (date) => {
  if (!isValidDate(date)) return null;
  const d = new Date(date);
  return {
    $d: d,  // antd DatePicker expects this format
    toDate: () => d
  };
};

export { isValidDate };
