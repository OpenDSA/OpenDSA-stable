final int numtests = 5;
final int testsize = 100;
boolean SUCCESS = true;
final int MaxKeyValue = 200;

// The following are dummy declarations to keep the compiler happy.
// Need to implement this for real when there is a list class
// available.
interface List {
  void append(Object it);

  void next();

  void moveToStart();

  Object getValue();
}

class LinkedList implements List {
  LinkedList() {}

  void append(Object it) {}

  void next() {}

  void moveToStart() {}

  Object getValue() { return null; }
}

void output(Object x) {}

/* *** ODSATag: Binsort *** */
void binsort(int[] A) {
  List[] B = new LinkedList[MaxKeyValue+1];
  Object item;
  for (int i=0; i<=MaxKeyValue; i++)
    B[i] = new LinkedList();
  for (int i=0; i<A.length; i++) B[A[i]].append(new Integer(A[i]));
  int pos = 0;
  for (int i=0; i<=MaxKeyValue; i++)
    for (B[i].moveToStart(); (item = B[i].getValue()) != null; B[i].next())
      A[pos++] = (Integer)item;
}
/* *** ODSAendTag: Binsort *** */


void simplebinsort(int[] A, int[] B) {
  int i;
/* *** ODSATag: simplebinsort *** */
  for (i=0; i<A.length; i++)
    B[A[i]] = A[i];
/* *** ODSAendTag: simplebinsort *** */
}

void setup() {
  int[] A = new int[testsize];
  int[] B = new int[testsize];
  int i;

  // Perform numtests trials to test this
  for (int tests=0; tests<numtests; tests++) {
    for (i=0; i<A.length; i++) {
      A[i] = i;
      B[i] = 0;
    }
    permute(A);
    simplebinsort(A, B);
    for (i=1; i<A.length; i++)
      if (B[i] < B[i-1]) {
        println("Error! Value " + B[i] + " at position " + i +
                " was less than " + B[i-1] + " at position " + (i-1));
        SUCCESS = false;
      }
  }

  if (SUCCESS) {
    PrintWriter output = createWriter("success");
    output.println("Success");
    output.flush();
    output.close();
  }
  exit();
}
