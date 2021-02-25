/**
 * 
 * @param {object} match 
 * @param {object} player 
 * @param {boolean} win_status 
 * @param {number} total_round 
 */
exports.collectXP = (match, player, win_status, total_round) => {
  let nextLevelXP = 20;
  let initialXP = 0;
  let currentBucketLevel = parseInt(player.level / 10);
  let currentLevel = player.level;
  let currentXP = player.currentXP;
  let currentLevelXP = player.currentLevelXP;
  let roundXP = total_round * match.roundXP;
  if (win_status === true) {
    initialXP = match.winXP;
  } else {
    initialXP = match.loseXP;
  }
  let currentMatchXPGain =
    initialXP + initialXP * (0.1 * currentBucketLevel) + roundXP;
  let totalXP = Math.round(currentMatchXPGain + currentXP);
  if (currentLevel > 0) {
    nextLevelXP = currentLevelXP+Math.round(currentLevelXP * 0.1);
  }
  if (nextLevelXP <= totalXP) {
    currentLevel = currentLevel + 1;
    currentXP = Math.round(totalXP-nextLevelXP);
    currentLevelXP = Math.round(nextLevelXP);
  } else {
    currentXP = Math.round(totalXP);
  }
  return {
    currentXP: currentXP,
    currentLevel: currentLevel,
    currentLevelXP: currentLevelXP,
  };
};
