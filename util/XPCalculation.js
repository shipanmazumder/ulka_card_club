exports.collectXP = (game, player, match_status) => {
  let nextLevelXP = 20;
  let initialXP = 0;
  let currentBucketLevel = parseInt(plaver.level / 10);
  let currentLevel = player.level;
  let currentXP = player.currentXP;
  let currentLevelXP = player.currentLevelXP;

  if (match_status === "Win") {
    initialXP = game.winXP;
  } else {
    initialXP = game.loseXP;
  }
  let currentMatchXPGain = initialXP + initialXP * (0.1 * currentBucketLevel);
  let totalXP = currentMatchXPGain + currentXP;
  if (currentLevel > 0) {
    nextLevelXP = Math.round(currentLevelXP * 0.1);
  }
  if (nextLevelXP >= totalXP) {
    currentLevel = currentLevel + 1;
    currentXP = nextLevelXP - totalXP;
    currentLevelXP = nextLevelXP;
  } else {
    currentXP = totalXP;
  }
  return {
    currentXP: currentXP,
    currentLevel: currentLevel,
    currentLevelXP: currentLevelXP,
  };
};
