#include <stdio.h>
#include <iostream>
#include <cmath>
#include <vector>
#include <algorithm>
#include <map>

using namespace std;

int k, t, r, n, m, pos, initialNumOfFiles;
int *visited, *assigned;
vector<vector<int>> trace;
vector<vector<int>> combination;
/**
 * Print to screen result of saved files to servers
 * 
 * @param int** result matrix
 * @param int number of row
 * @param int number of column
 * @return void
 */
void printResult(int **arr, int row, int column)
{
  cout << "\n         ";
  for (int i = 0; i < column; i++)
  {
    cout << "F" << i + 1 << "  ";
  }
  cout << endl;
  for (int i = 0; i < row; i++)
  {
    cout << "Server " << i + 1 << "  ";
    for (int j = 0; j < column; j++)
    {
      cout << arr[i][j] << "   ";
      if (j > 8)
      {
        cout << " ";
      }
    }
    cout << endl;
  }
}

void buildCombination(bool *checked, int n, int k, int count, int index)
{
  if (count == k)
  {
    vector<int> oneCombination;
    for (int i = 0; i < n; i++)
    {
      oneCombination.push_back(checked[i] ? 1 : 0);
    }
    combination.push_back(oneCombination);
    return;
  }
  for (int i = index; i < n; i++)
  {
    if (!checked[i])
    {
      checked[i] = true;
      buildCombination(checked, n, k, count + 1, i + 1);
      checked[i] = false;
    }
  }
}

void calcCombination(int k, int n)
{
  bool *checked = new bool[n];
  for (int i = 0; i < n; i++)
  {
    checked[i] = false;
  }
  buildCombination(checked, n, k, 0, 0);
}

int min(int a, int b)
{
  return a > b ? b : a;
}

int **processSaveFile(int m, int k, int r, int n)
{
  int **arr = new int *[n];
  for (int i = 0; i < n; i++)
  {
    arr[i] = new int[m];
  }
  // calcCombination(r + 1, m);
  // for (int i = 0; i < m; i++)
  // {
  //   for (int j = 0; j < combination.size(); j++)
  //   {
  //     arr[i][j] = combination[j][i];
  //   }
  // }
  int currentPos = 0;
  combination.clear();
  calcCombination(r + 1, m);
  while (currentPos < n)
  {
    for (int i = 0; i < m; i++)
    {
      for (int j = 0; j < min(combination.size(), n - currentPos); j++)
      {
        arr[i][j + currentPos] = combination[j][i];
      }
    }
    currentPos += min(combination.size(), n - currentPos);
  }
  return arr;
}

/**
 * Take k, t, r, n from keyboard input and save files to servers
 * 
 * @param none
 * @return Matrix of saved files, if file i is saved at server j, then a[i][j] equal 1, else 0
 */
int **saveFilesToServers()
{
  // input
  cout << "Enter number of servers (m): ";
  cin >> m;
  cout << "Enter number of files need to access (k): ";
  cin >> k;
  cout << "Enter number of maximum hit per server (t): ";
  cin >> t;
  cout << "Enter number of maxium inactive server (r): ";
  cin >> r;
  cout << "Enter number of files (n): ";
  cin >> n;
  initialNumOfFiles = n;

  // handle
  int **arr = processSaveFile(m, k, r, n);

  printResult(arr, m, n);
  return arr;
}

vector<map<int, vector<int>>> convertToList(int **arr, int m, int n)
{
  vector<map<int, vector<int>>> result;
  for (int i = 0; i < m; i++)
  {
    map<int, vector<int>> row;
    for (int j = 0; j < n; j++)
    {
      if (arr[i][j] == 1)
      {
        vector<int> temp;
        temp.push_back(j);
        row[j] = temp;
      }
    }
    result.push_back(row);
  }
  return result;
}

int **filterArray(int **arr, int *listFile, int *listErrorServer)
{
  int **filterArray = new int *[m * t];
  for (int i = 0; i < m * t; i++)
  {
    filterArray[i] = new int[initialNumOfFiles];
  }

  for (int i = 0; i < m; i++)
  {
    for (int j = 0; j < initialNumOfFiles; j++)
    {
      filterArray[i][j] = 0;
    }
  }

  for (int i = 0; i < m; i++)
  {
    for (int j = 0; j < k; j++)
    {
      filterArray[i][listFile[j]] = arr[i][listFile[j]];
    }
  }

  for (int i = 0; i < r; i++)
  {
    for (int j = 0; j < initialNumOfFiles; j++)
    {
      filterArray[listErrorServer[i]][j] = 0;
    }
  }

  for (int i = 0; i < m * t; i++)
  {

    for (int j = 0; j < initialNumOfFiles; j++)
    {
      filterArray[i][j] = filterArray[i % m][j];
    }
  }
  return filterArray;
}

bool visit(int u, int **arr)
{
  if (visited[u] != pos)
  {
    visited[u] = pos;
  }
  else
  {
    return false;
  }
  for (int i = 0; i < initialNumOfFiles; i++)
  {
    if (arr[u][i] && (assigned[i] == -1 || visit(assigned[i], arr)))
    {
      assigned[i] = u;
      return true;
    }
  }
  return false;
}

void findFiles(int **arr)
{
  visited = new int[m * t];
  assigned = new int[initialNumOfFiles];
  for (int i = 0; i < m * t; i++)
  {
    visited[i] = 0;
  }
  for (int i = 0; i < initialNumOfFiles; i++)
  {
    assigned[i] = -1;
  }
  for (int i = 0; i < m; i++)
  {
    trace.push_back(vector<int>());
  }

  int *listFile = new int[k];
  cout << "Enter index of files want to access: ";
  for (int i = 0; i < k; i++)
  {
    int x;
    cin >> x;
    listFile[i] = (x - 1) % initialNumOfFiles;
  }
  cout << "Enter index of inactive servers : ";
  int *listErrorServer = new int[r];
  for (int i = 0; i < r; i++)
  {
    int x;
    cin >> x;
    listErrorServer[i] = x - 1;
  }
  int **fArray = filterArray(arr, listFile, listErrorServer);
  pos = 0;
  int count = 0;
  for (int i = 0; i < m * t; i++)
  {
    pos++;
    count += visit(i, fArray);
  }
  for (int i = 0; i < initialNumOfFiles; i++)
  {
    int j = assigned[i];
    if (j != -1)
    {
      trace[j % m].push_back(i);
    }
  }

  for (int i = 0; i < m; i++)
  {
    if (trace[i].size() > 0)
    {
      cout << "Server " << i + 1 << ": ";
      for (int j = 0; j < trace[i].size(); j++)
      {
        cout << trace[i][j] + 1 << " ";
      }
      cout << endl;
    }
  }
  for (int i = 0; i < m * t; i++)
  {
    delete[] fArray[i];
  }
  delete[] fArray;
}

void addFile(int **saveTable, vector<map<int, vector<int>>> &listServer)
{
  n++;
  int fileIndex = (n % initialNumOfFiles - 1 + initialNumOfFiles) % initialNumOfFiles;
  for (int i = 0; i < m; i++)
  {
    if (saveTable[i][fileIndex] == 1)
    {
      listServer[i][fileIndex].push_back(n);
    }
  }
}

int main()
{
  int **saveTable = saveFilesToServers();
  vector<map<int, vector<int>>> listServer = convertToList(saveTable, m, n);
  addFile(saveTable, listServer);
  
  findFiles(saveTable);

  for (int i = 0; i < m; i++)
  {
    delete[] saveTable[i];
  }
  delete[] saveTable;
  delete[] assigned;
  delete[] visited;
  return 0;
}