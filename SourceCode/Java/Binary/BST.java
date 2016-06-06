/* *** ODSATag: BST *** */
/* *** ODSATag: BSTa *** */
// Binary Search Tree implementation
class BST {
  private BSTNode root; // Root of the BST
  private int nodecount; // Number of nodes in the BST

  // constructor
  BST() { root = null; nodecount = 0; }

  // Reinitialize tree
  public void clear() { root = null; nodecount = 0; }

  // Insert a record into the tree.
  // Records can be anything, but they must be Comparable
  // e: The record to insert.
  public void insert(Comparable e) {
    root = inserthelp(root, e);
    nodecount++;
  }
/* *** ODSAendTag: BSTa *** */

/* *** ODSATag: BSTb *** */
  // Remove a record from the tree
  // key: The key value of record to remove
  // Returns the record removed, null if there is none.
  public Comparable remove(Comparable key) {
    Comparable temp = findhelp(root, key); // First find it
    if (temp != null) {
      root = removehelp(root, key); // Now remove it
      nodecount--;
    }
    return temp;
  }

  // Return the record with key value k, null if none exists
  // key: The key value to find
  public Comparable find(Comparable key) { return findhelp(root, key); }

  // Return the number of records in the dictionary
  public int size() { return nodecount; }
/* *** ODSAendTag: BSTb *** */
/* *** ODSAendTag: BST *** */

  // Return a record that matches the key value
/* *** ODSATag: findhelp *** */
  private Comparable findhelp(BSTNode rt, Comparable key) {
    if (rt == null) return null;
    if (rt.element().compareTo(key) > 0)
      return findhelp(rt.left(), key);
    else if (rt.element().compareTo(key) == 0)
      return rt.element();
    else return findhelp(rt.right(), key);
  }
/* *** ODSAendTag: findhelp *** */


  // Return the current subtree,
  // modified to contain the new item
/* *** ODSATag: inserthelp *** */
  private BSTNode inserthelp(BSTNode rt, Comparable e) {
    if (rt == null) return new BSTNode(e);
    if (rt.element().compareTo(e) >= 0)
      rt.setLeft(inserthelp(rt.left(), e));
    else
      rt.setRight(inserthelp(rt.right(), e));
    return rt;
  }
/* *** ODSAendTag: inserthelp *** */

/* *** ODSATag: deletemax *** */
  // Delete the maximum valued element in a subtree
  private BSTNode deletemax(BSTNode rt) {
    if (rt.right() == null) return rt.left();
    rt.setRight(deletemax(rt.right()));
    return rt;
  }
/* *** ODSAendTag: deletemax *** */

/* *** ODSATag: getmax *** */
  // Get the maximum valued element in a subtree
  private BSTNode getmax(BSTNode rt) {
    if (rt.right() == null) return rt;
    return getmax(rt.right());
  }
/* *** ODSAendTag: getmax *** */

  // Remove a node with the key value
  // Return the tree with the node removed
/* *** ODSATag: removehelp *** */
  private BSTNode removehelp(BSTNode rt, Comparable key) {
    if (rt == null) return null;
    if (rt.element().compareTo(key) > 0)
      rt.setLeft(removehelp(rt.left(), key));
    else if (rt.element().compareTo(key) < 0)
      rt.setRight(removehelp(rt.right(), key));
    else { // Found it
      if (rt.left() == null) return rt.right();
      else if (rt.right() == null) return rt.left();
      else { // Two children
        BSTNode temp = getmax(rt.left());
        rt.setElement(temp.element());
        rt.setLeft(deletemax(rt.left()));
      }
    }
    return rt;
  }
/* *** ODSAendTag: removehelp *** */

/* *** ODSATag: printhelp *** */
  private void printhelp(BSTNode rt) {
    if (rt == null) return;
    printhelp(rt.left());
    printVisit(rt.element());
    printhelp(rt.right());
  }
/* *** ODSAendTag: printhelp *** */

// Used for testing
  private void printVisit(Comparable e) { System.out.print(e + " "); }

// Used for testing
public BSTNode root() {
  return root;
}
}
