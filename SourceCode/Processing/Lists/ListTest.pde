final int testsize = 0;
long time1, time2;

boolean SUCCESS = true;

void doSomething(Object it) { }

String toString(List L) {
  // Save the current position of the list
  int oldPos = L.currPos();
  StringBuffer out = new StringBuffer((L.length() + 1) * 4);

  L.moveToStart();
  out.append("< ");
  for (int i = 0; i < oldPos; i++) {
    out.append(L.getValue());
    out.append(" ");
    L.next();
  }
  out.append("| ");
  for (int i = oldPos; i < L.length(); i++) {
    out.append(L.getValue());
    out.append(" ");
    L.next();
  }
  out.append(">");
  L.moveToPos(oldPos); // Reset the fence to its original position
  return out.toString();
}

/* *** ODSATag: listfind *** */
// Return true if k is in list L, false otherwise
boolean find(List L, int k) {
  for (L.moveToStart(); !L.isAtEnd(); L.next())
    if (k == (Integer)L.getValue()) return true; // Found k
  return false;                                  // k not found
}
/* *** ODSAendTag: listfind *** */

void test(List L) {
  L.moveToStart();
  L.insert(5);
  L.insert(7);
  L.next();
  L.next();
  L.insert(3);
  L.insert(17);
  String temp = toString(L);
  if (!temp.equals("< 7 5 | 17 3 >"))
    SUCCESS = false;

  Object it;
/* *** ODSATag: listiter *** */
for (L.moveToStart(); !L.isAtEnd(); L.next()) {
  it = L.getValue();
  doSomething(it);
}
/* *** ODSAendTag: listiter *** */

  if (!find(L, 5))
    SUCCESS = false;
  if (!find(L, 3))
    SUCCESS = false;
  if (find(L, 10))
    SUCCESS = false;

  L.moveToPos(2);
  it = L.remove();
  temp = toString(L);
  if (!temp.equals("< 7 5 | 3 >"))
    SUCCESS = false;
}

void setup() {
  AList AL = new AList();
  LList LL = new LList();

  test(AL);
  test(LL);
  if (SUCCESS) {
    PrintWriter output = createWriter("success");
    output.println("Success");
    output.flush();
    output.close();
  } else {
    println("Testing failed");
  }

  if (testsize == 0) {
    exit();
    return;
  }
  println("Do the timing test");
  LList LT = new LList();
  time1 = millis();
  for (int i = 0; i < testsize; i++) {
    LL.insert(10);
    LL.insert(15);
    LL.insert(20);
    LL.insert(25);
    LL.clear();
  }
  time2 = millis();
  long totaltime = (time2-time1);
  println("Timing test on " + testsize + " iterations: " + totaltime);

  time1 = millis();
  for (int i = 0; i < testsize; i++) {
    Link temp = new Link(null, null);
    temp = new Link(null, null);
    temp = new Link(null, null);
    temp = new Link(null, null);
    temp = new Link(null, null);
  }
  time2 = millis();
  totaltime = (time2-time1);
  println("Timing test2 on " + testsize + " iterations: " + totaltime);
  exit();
}
