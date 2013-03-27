/* *** ODSATag: Queue *** */
// Linked queue implementation
class LQueue implements Queue {
  private Link front; // Pointer to front queue node
  private Link rear; // Pointer to rear queuenode
  private int size; // Number of elements in queue

  // Constructors
  LQueue() { init(); }
  LQueue(int size) { init(); } // Ignore size

  // Initialize queue
  private void init() {
    front = rear = new Link(null);
    size = 0;
  }

  // Reinitialize queue
  public void clear() { init(); }

  // Put element on rear
  public void enqueue(Object it) {
    rear.setnext(new Link(it, null));
    rear = rear.next();
    size++;
  }

  // Remove and return element from front
  public Object dequeue() {
    if (size == 0) return null;
    Object it = front.next().element(); // Store dequeued value
    front.setnext(front.next().next()); // Advance front
    if (front.next() == null) rear = front; // Last Object
    size--;
    return it; // Return Object
  }

  // Return front element
  public Object frontValue() {
    if (size == 0) return null;
    return front.next().element();
  }

  // Return queue size
  public int length() { return size; }
}
