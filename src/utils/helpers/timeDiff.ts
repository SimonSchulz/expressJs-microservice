const timeDiffInMinutes = (prevTime) => {
  const currentTime = Date.now();
  return Math.round(new Date(currentTime).getTime() - new Date(prevTime).getTime()) / 1000 / 60;
};

export default timeDiffInMinutes;
