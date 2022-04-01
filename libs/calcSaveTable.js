export default function calcSaveTable({
  numOfServers,
  maxFilesProcessAtOnce = 1,
  maxFilesProcessPerServer = 1,
  maxInactiveServers,
  initialNumOfFiles,
}) {
  // const m = numOfServers;
  // const k = maxFilesProcessAtOnce;
  // const t = maxFilesProcessPerServer;
  // const r = maxInactiveServers;
  // const n = initialNumOfFiles;
  const combinations = calcCombinations({ k: maxInactiveServers + 1, n: numOfServers });
  let currentPos = 0;
  const saveTable = Array(initialNumOfFiles).fill(Array(numOfServers).fill(0));

  while (currentPos < initialNumOfFiles) {
    for (let i = 0; i < numOfServers; i++) {
      for (let j = 0; j < Math.min(combinations.size(), initialNumOfFiles - currentPos); j++) {
        saveTable[i][j + currentPos] = combinations[j][i];
      }
    }
    currentPos += Math.min(combinations.size(), n - currentPos);
  }

  return saveTable;
}

const buildCombinations = ({ checked, n, k, count, index, combinations }) => {
  if (count === k) {
    const oneCombination = checked.map((el) => (el ? 1 : 0));
    combinations.push(oneCombination);
    return;
  }
  checked.forEach((el, idx) => {
    if (el || idx < index) return;
    checked[idx] = true;
    buildCombinations({ checked, n, k, count: count + 1, index: index + 1, combinations });
    checked[idx] = false;
  });
};

const calcCombinations = ({ k, n }) => {
  const combinations = [];
  const checked = new Array(n).fill(false);
  buildCombinations({ checked, n, k, count: 0, index: 0, combinations });
  return combinations;
};
