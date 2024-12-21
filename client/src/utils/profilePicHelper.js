export const getProfilePicUrl = (profilePic) => {
  if (!profilePic) return null;
  
  // If it's a Google profile picture (starts with https://lh3)
  if (profilePic.startsWith('https://lh3.googleusercontent.com')) {
    return profilePic;
  }
  
  // Otherwise, it's a local upload
  return `${process.env.REACT_APP_API_URL}/uploads/${profilePic}`;
};  