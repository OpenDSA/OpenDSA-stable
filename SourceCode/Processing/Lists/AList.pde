/* *** ODSATag: AList *** */
// Array-based list implementation
/* *** ODSATag: AListVars *** */
class AList implements List {
  private Object listArray[];             // Array holding list elements
  private static final int defaultSize = 10; // Default size
  private int maxSize;                    // Maximum size of list
  private int listSize;                   // Current # of list items
  private int curr;                       // Position of current element
/* *** ODSAendTag: AListVars *** */

  // Constructors
  // Create a new list object with maximum size "size"
  AList(int size) { 
    maxSize = size;
    listSize = curr = 0;
    listArray = new Object[size];         // Create listArray
  }
  // Create a list with the default capacity
  AList() { this(defaultSize); }          // Just call the other constructor

  public void clear()                     // Reinitialize the list
    { listSize = curr = 0; }              // Simply reinitialize values

/* *** ODSATag: AListInsert *** */
  // Insert "it" at current position
  void insert(Object it) {
    if (listSize >= maxSize) return;
    for (int i=listSize; i>curr; i--)  // Shift elements up
      listArray[i] = listArray[i-1];   //   to make room
    listArray[curr] = it;
    listSize++;                        // Increment list size
  }
/* *** ODSAendTag: AListInsert *** */

/* *** ODSATag: AListAppend *** */
  // Append "it" to list
  void append(Object it) {
    if (listSize >= maxSize) return;
    listArray[listSize++] = it;
  }
/* *** ODSAendTag: AListAppend *** */

/* *** ODSATag: AListRemove *** */
  // Remove and return the current element
  Object remove() {
    if ((curr<0) || (curr>=listSize))  // No current element
      return null;
    Object it = listArray[curr];       // Copy the element
    for(int i=curr; i<listSize-1; i++) // Shift them down
      listArray[i] = listArray[i+1];
    listSize--;                        // Decrement size
    return it;
  }
/* *** ODSAendTag: AListRemove *** */

  void moveToStart() { curr = 0; }       // Set to front
  void moveToEnd() { curr = listSize; }  // Set at end
  void prev() { if (curr != 0) curr--; } // Move left
  void next() { if (curr < listSize) curr++; } // Move right
  int length() { return listSize; }      // Return list size
  int currPos() { return curr; }         // Return current position
  
  // Set current list position to "pos"
  void moveToPos(int pos) {
    if ((pos < 0) || (pos > listSize)) return;
    curr = pos;
  }

  // Return true if current position is at end of the list
  Boolean isAtEnd() { return curr == listSize; }

  // Return the current element
  Object getValue() {
    if ((curr < 0) || (curr >= listSize)) // No current element
      return null;
    return listArray[curr];
  }
}
/* *** ODSAendTag: AList *** */
