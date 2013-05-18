"use strict";
/*global console */

// Swap for int arrays
function swap(A, i, j) {
  var temp = A[i];
  A[i] = A[j];
  A[j] = temp;
}
function sorttime(B) {
  var i;
  var A = [];
  A.length = B.length;

  for(i = 0; i < B.length; i++) A[i] = B[i];
  time1 = new Date();
  selsort(A);
  time2 = new Date();
  checkorder(A);
  console.log("Standard Selection Sort: Size " + testsize + ", Time: " + (time2 - time1));

  for(i = 0; i < B.length; i++) A[i] = B[i];
  time1 = new Date();
  selsortcheck(A);
  time2 = new Date();
  checkorder(A);
  console.log("Selection Sort/Check swaps: Size " + testsize + ", Time: " + (time2 - time1));
}

// Same as selsort, but check if the swap is necessary
function selsortcheck(A) {
  for (var i = 0; i < A.length - 1; i++) { // Select i'th biggest record
    var bigindex = 0;                // Current biggest index
    for (var j = 1; j < A.length - i; j++) // Find the max value
      if (A[j] > A[bigindex])        // Found something bigger  
        bigindex = j;                // Remember bigger index
    if (bigindex != A.length - i - 1)
      swap(A, bigindex, A.length - i - 1); // Put it into place
  }
}

function success() {
  var bw = require("buffered-writer");
  bw.open("SelsortTestSuccess").write("Success").close();
}

function sorttest(A) {
  selsort(A);
}

/* *** ODSATag: Selectionsort *** */
function selsort(A) {
  for (var i = 0; i < A.length - 1; i++) { // Select i'th biggest record
    var bigindex = 0;                // Current biggest index
    for (var j = 1; j < A.length - i; j++) // Find the max value
      if (A[j] > A[bigindex])        // Found something bigger  
        bigindex = j;                // Remember bigger index
    swap(A, bigindex, A.length - i - 1); // Put it into place
  }
}
/* *** ODSAendTag: Selectionsort *** */
var testsize = 10000;
var time1, time2;         // These get set by sorttime()

function checkorder(A) {
  for (var i = 1; i < A.length; i++) {
    if (A[i] < A[i - 1]) {
      console.log("Error! Value " + A[i] + " at position " + i +
              " was less than " + A[i - 1] + " at position " + (i - 1));
    }
  }
}

var A = [];
A.length = testsize;
for (var i = 0; i < A.length; i++)
  A[i] = Math.floor(Math.random() * 1000) + 1;
// for (var i = 0; i < A.length; i++)
//   A[i] = i + 1;
// for (var i = 0; i < A.length; i++)
//   A[i] = 200000 - i;

sorttime(A);
