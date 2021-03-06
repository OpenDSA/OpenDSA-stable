/* *** ODSATag: BSTNode *** */
// Binary tree node implementation: supports comparable objects
class BSTNode implements BinNode {
  private Comparable element; // Element for this node
  private BSTNode left;       // Pointer to left child
  private BSTNode right;      // Pointer to right child

  // Constructors
  BSTNode() {left = right = null; }
  BSTNode(Comparable val) { left = right = null; element = val; }
  BSTNode(Comparable val, BSTNode l, BSTNode r)
    { left = l; right = r; element = val; }

  // Get and set the element value
  Comparable element() { return element; }
  void setElement(Comparable v) { element = v; }
  void setElement(Object v) { // We need this one to satisfy BinNode interface
    if (!(v instanceof Comparable))
      throw new ClassCastException("A Comparable object is required.");
    element = (Comparable)v;
  }

  // Get and set the left child
  BSTNode left() { return left; }
  void setLeft(BSTNode p) { left = p; }

  // Get and set the right child
  BSTNode right() { return right; }
  void setRight(BSTNode p) { right = p; }

  // return TRUE if a leaf node, FALSE otherwise
  boolean isLeaf() { return (left == null) && (right == null); }
}
/* *** ODSAendTag: BSTNode *** */
