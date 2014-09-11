#include "utils.h"
#include "Comparable.cpp"
#include "KVPair.cpp"
#include "Int.cpp"
#include "Checkorder.cpp"

// With KVPair
/* *** ODSATag: Insertionsort *** */
void inssort(Comparable* A[], int n) { // Insertion Sort
  for (int i = 1; i < n; i++) // Insert i'th record
    for (int j = i; (j > 0) && (*A[j] < *A[j-1]); j--) {
      swap(A, j, j-1);
    }
}
/* *** ODSAendTag: Insertionsort *** */

/* *** ODSATag: InsertionOpt *** */
// Instead of swapping, "shift" the values down the array
void inssortshift(Comparable* A[], int n) { // Insertion Sort
  for (int i=1; i<n; i++) { // Insert i'th record
    int j;
    Comparable* temp = A[i];
    for (j = i; (j > 0) && (*temp < *A[j-1]); j--)
      A[j] = A[j-1];
    A[j] = temp;
  }
}
/* *** ODSAendTag: InsertionOpt *** */
  
bool sorttest(int array[], int n, int threshold) {
  Comparable* A[n];
  int i;

  /* Sort an array of Ints */
  for (i = 0; i < n; ++i) {
    A[i] = new Int(array[i]);
  }

  //  for (i = 0; i < n; ++i) {
  //    cout << *A[i] << " ";
  //  }
  //  cout << std::endl;
  
  inssort(A, n);

  if (!checkorder(A, n)) return false;

  for (i = 0; i < n; ++i) {
    delete A[i];
  }

  /* Sort an array of KVPairs */
  
  for (i = 0; i < n; ++i) {
    A[i] = new KVPair(array[i], &array[i]);
  }

  inssort(A, n);

  if (!checkorder(A, n)) return false;

  for (i = 0; i < n; ++i) {
    delete A[i];
  }
  
  /* Sort an array of KVPairs */
  
  for (i = 0; i < n; ++i) {
    A[i] = new KVPair(array[i], &array[i]);
  }

  inssortshift(A, n);

  if (!checkorder(A, n)) return false;

  for (i = 0; i < n; ++i) {
    delete A[i];
  }
  
  delete[] array;

  return true;
}

#include "SortTest.cpp"
