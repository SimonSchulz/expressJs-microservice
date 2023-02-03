export const timeDiffInMinutes = (prevTime) => {
  const currentTime = Date.now();
  return Math.round(new Date(currentTime).getTime() - new Date(prevTime).getTime()) / 1000 / 60;
};

export const timeDiffInHours = (prevTime) => {
  const currentTime = Date.now();
  return Math.round((new Date(currentTime).getTime() - new Date(prevTime).getTime()) / 1000 / 60 / 60);
}
