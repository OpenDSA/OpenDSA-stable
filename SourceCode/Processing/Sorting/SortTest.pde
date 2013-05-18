final int numtests = 5;
final int testsize = 100;
boolean SUCCESS = true;
long time1, time2;         // These get set by sorttime()

void makenew(int[] A) { }
void checkorder(int[] A) { }

void setup() {
  int[] A = new int[testsize];
  int i;

  // Perform numtests trials to test this
  for (int tests=0; tests<numtests; tests++) {
    for (i=0; i<A.length; i++)
      A[i] = int(random(1000))+1;
    sorttest(A);
    for (i=1; i<A.length; i++)
      if (A[i] < A[i-1]) {
        println("Error! Value " + A[i] + " at position " + i +
                " was less than " + A[i-1] + " at position " + (i-1));
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
