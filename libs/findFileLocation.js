const getFilterArray = ({
  saveTable,
  fileList,
  inactiveServerList,
  numOfServers,
  maxFilesProcessPerServer = 1,
  maxFilesProcessAtOnce = 1,
  initialNumOfFiles,
  maxInactiveServers,
}) => {
  const filterArray = [];
  for (let i = 0; i < numOfServers * maxFilesProcessPerServer; i++) {
    filterArray[i] = Array(initialNumOfFiles).fill(0);
  }
  for (let i = 0; i < numOfServers; i++) {
    for (let j = 0; j < maxFilesProcessAtOnce; j++) {
      filterArray[i][fileList[j]] = saveTable[i][fileList[j]];
    }
  }
  for (let i = 0; i < maxInactiveServers; i++) {
    for (let j = 0; j < initialNumOfFiles; j++) {
      filterArray[inactiveServerList[i]][j] = 0;
    }
  }

  for (let i = 0; i < numOfServers * maxFilesProcessPerServer; i++) {
    for (let j = 0; j < initialNumOfFiles; j++) {
      filterArray[i][j] = filterArray[i % numOfServers][j];
    }
  }

  return filterArray;
};

const visit = ({ visited, u, arr, pos, initialNumOfFiles, assigned }) => {
  if (visited[u] !== pos) {
    visited[u] = pos;
  } else {
    return false;
  }

  for (let i = 0; i < initialNumOfFiles; i++) {
    if (
      arr[u][i] &&
      (assigned[i] === -1 ||
        visit({ u: assigned[i], arr, pos, visited, initialNumOfFiles, assigned }))
    ) {
      assigned[i] = u;
      return true;
    }
  }
  return false;
};

const findFiles = ({
  saveTable,
  fileList,
  initialNumOfFiles,
  numOfServers,
  maxFilesProcessPerServer,
  maxFilesProcessAtOnce,
  inactiveServerList,
}) => {
  const visited = Array(numOfServers * maxFilesProcessPerServer).fill(0);
  const assigned = Array(initialNumOfFiles).fill(-1);

  const trace = [];
  const filterArray = getFilterArray({
    saveTable,
    fileList,
    inactiveServerList,
    numOfServers,
    maxFilesProcessPerServer,
    maxFilesProcessAtOnce,
    initialNumOfFiles,
    maxInactiveServers: inactiveServerList.length,
  });

  let pos = 0;
  let count = 0;
  for (let i = 0; i < numOfServers * maxFilesProcessPerServer; i++) {
    pos++;
    // eslint-disable-next-line no-unused-vars
    count += visit({ visited, u: i, arr: filterArray, pos, initialNumOfFiles, assigned });
  }

  for (let i = 0; i < initialNumOfFiles; i++) {
    const j = assigned[i];
    if (j !== -1) {
      if (!Array.isArray(trace[j % numOfServers])) {
        trace[j % numOfServers] = [];
      }
      trace[j % numOfServers].push(j);
    }
  }

  const result = {};
  for (let i = 0; i < numOfServers; i++) {
    if (Array.isArray(trace[i]) && trace[i].length > 0) {
      result[i] = [];
      for (let j = 0; j < trace[i].length; j++) {
        result[i].push(trace[i][j]);
      }
    }
  }
  return result;
};

module.exports = findFiles;
