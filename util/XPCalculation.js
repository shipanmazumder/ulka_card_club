exports.collect = (
  currentLevel,
  difference = 200,
  scoreDifference,
  currentXP,
  loose = true
) => {
  const START_XP = 100;
  let nextLevel = currentLevel;
  let currentMatchGainXP = START_XP + currentLevel * 20;
  difference = ((currentLevel + 1) % 3) == 0 ? difference * 2 : difference;
  if (loose) {
    currentMatchGainXP = currentMatchGainXP - scoreDifference * 10;
    let minimumGainXp = Math.round(currentMatchGainXP * 0.25);
    if (currentMatchGainXP < minimumGainXp) {
      currentMatchGainXP = minimumGainXp;
    }
  }
  let needNextLevelXp = START_XP + currentLevel * difference;
  currentXP = currentXP + gainXp;
  if (currentXP >= needNextLevelXp) {
    nextLevel = currentLevel + 1;
    currentXP = 0;
  }
  return {
    currentLevel: nextLevel,
    currentXP: currentXP,
    difference: difference,
  };
};
