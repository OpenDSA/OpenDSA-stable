from array import *
from random import *
from datetime import datetime

def millis(x):
  return x.seconds*1000 + x.microseconds/1000

# Swap for int arrays
def swap(A, i, j):
  temp = A[i];
  A[i] = A[j];
  A[j] = temp;
def sorttime(B):
  A = [randrange(1,1000) for _ in range(testsize)]  # To make it create a real A for copying
  for i in range(len(B)):
    A[i] = B[i]
  time1 = datetime.now()
  inssort(A)
  time2 = datetime.now()
  checkorder(A)
  print "Standard Insertion Sort: Size ", testsize, ", Time: ", millis(time2 - time1)

  for i in range(len(B)):
    A[i] = B[i]
  time1 = datetime.now()
  inssort2(A)
  time2 = datetime.now()
  checkorder(A)
  print "Standard Insertion Sort, no swap function: Size ", testsize, ", Time: ", millis(time2 - time1)

  for i in range(len(B)):
    A[i] = B[i]
  time1 = datetime.now()
  inssortshift(A)
  time2 = datetime.now()
  checkorder(A)
  print "Shifting Insertion Sort: Size ", testsize, ", Time: ", millis(time2 - time1)

  for i in range(len(B)):
    A[i] = B[i]
  time1 = datetime.now()
  inssortshift(A)
  time2 = datetime.now()
  checkorder(A)
  print "Shifting Insertion Sort 2 (!=): Size ", testsize, ", Time: ", millis(time2 - time1)

# Instead of swapping, "shift" the values down the array
def inssortshift(A):
  for i in range(1, len(A)-1): # Insert i'th record
    temp = A[i]
    j=i
    while (j > 0) and (temp < A[j-1]):
      A[j] = A[j-1]
      j -= 1
    A[j] = temp

# Same as inssortshift, but try != instead of < for the zero test
# This will only matter to JavaScript
def inssortshift2(A):
  for i in range(1, len(A)-1): # Insert i'th record
    temp = A[i]
    j=i
    while (j != 0) and (temp < A[j-1]):
      A[j] = A[j-1]
      j -= 1
    A[j] = temp

# Same as standard insertion sort, except get rid of the swap
# function call
def inssort2(A):
  for i  in range(1, len(A)-1):  # Insert i'th record
    j = i;
    while (j != 0) and (A[j] < A[j-1]):
      temp = A[j]
      A[j] = A[j-1]
      A[j-1] = temp
      j -= 1

def success():
  print "Success! (Need to define this)"

def sorttest(A):
  inssort(A)

# /* *** ODSATag: Insertionsort *** */
def inssort(A):
  for i  in range(len(A)):  # Insert i'th record
    j = i;
    while (j != 0) and (A[j] < A[j-1]):
      swap(A, j, j - 1)
      j -= 1
# /* *** ODSAendTag: Insertionsort *** */
testsize = 10000
time1 = 0
time2 = 0

def checkorder(A):
  for i in range(1, len(A)-1):
    if (A[i] < A[i - 1]):
      print "Error! Value ", A[i], " at position ", i, " was less than ", A[i - 1], " at position ", (i - 1)

A = [randrange(1,1000) for _ in range(testsize)]
sorttime(A)
