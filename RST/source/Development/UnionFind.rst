.. This file is part of the OpenDSA eTextbook project. See
.. http://algoviz.org/OpenDSA for more details.
.. Copyright (c) 2012-2013 by the OpenDSA Project Contributors, and
.. distributed under an MIT open source license.

.. avmetadata:: 
   :author: Cliff Shaffer
   :prerequisites: GenTreeIntro
   :topic: Union/Find

Union/Find and the Parent Pointer Implementation [Text]
=======================================================

A simple way to represent a general trees would be to store for each
node only a pointer to that node's parent.
We will call this the :dfn:`parent pointer` implementation.
Clearly this implementation is not general purpose, because it is
inadequate for such important operations as finding
the leftmost child or the right sibling for a node.
Thus, it may seem to be a poor idea to implement a general
tree in this way.
However, the parent pointer implementation stores precisely the
information required to answer the following, useful question:
**Given two nodes, are they in the same tree?**
To answer the question, we need only follow the series of parent
pointers from each node to its respective root.
If both nodes reach the same root, then they must be in the same tree.
If the roots are different, then the two nodes are not in the same
tree.
The process of finding the ultimate root for a given node we will call
:dfn:`FIND`.

The parent pointer representation is most often used to maintain a
collection of disjoint sets.
Two disjoint sets share no members in common (their intersection is
empty).
A collection of disjoint sets partitions some objects
such that every object is in exactly one of the disjoint sets.
There are two basic operations that we wish to support:

1. Determine if two objects are in the same set, and
2. Merge two sets together.

Because two merged sets are united, the merging operation is
called UNION and the whole process of determining if two
objects are in the same set and then merging the sets goes by the name
"UNION/FIND."

To implement UNION/FIND, we represent each disjoint set with a
separate general tree.
Two objects are in the same disjoint set if they are in the same tree.
Every node of the tree (except for the root) has precisely one parent.
Thus, each node requires the same space to represent it.
The collection of objects is typically stored in an array, where each
element of the array corresponds to one object, and each element
stores the object's value.
The objects also correspond to nodes in the various disjoint trees
(one tree for each disjoint set), so we also store the parent value
with each object in the array.
Those nodes that are the roots of their respective trees store an
appropriate indicator.
Note that this representation means that a single array is being used
to implement a collection of trees.
This makes it easy to merge trees together with UNION operations.

Here is the implementation for parent pointer trees and UNION/FIND.

.. codeinclude:: Trees/ParPtrTree.pde
   :tag: UnionFind

This class is greatly simplified from the declarations of
``GenTreeADT`` because we need only a subset of the general
tree operations.
Instead of implementing a separate node class, ``ParPtrTree``
simply stores an array where each array element corresponds to
a node of the tree.
Each position :math:`i` of the array stores the value for node
:math:`i` and the array position for the parent of node :math:`i`.
Class ``ParPtrTree`` is given two new methods, ``differ`` and
``UNION``.
Method ``differ`` checks if two objects are in different sets,
and method ``UNION`` merges two sets together.
A private method ``FIND`` is used to find the ultimate root for
an object.

An application using the UNION/FIND operations
should store a set of :math:`n` objects, where each object is assigned
a unique index in the range 0 to :math:`n-1`.
The indices refer to the corresponding parent pointers in the array.
Class ``ParPtrTree`` creates and initializes the
UNION/FIND array, and methods ``differ`` and
``UNION`` take array indices as inputs.

.. TODO::
   :type: Slideshow

   Illustration of the parent pointer implementation.
   Note that the nodes can appear in any order within the array, and
   the array can store up to n separate trees.
   For example, we show two trees stored in the same
   array.
   Thus, a single array can store a collection of items distributed among
   an arbitrary (and changing) number of disjoint subsets.

   The parent pointer array implementation.
   Each node corresponds to a position in the node array,
   which stores its value and a pointer to its parent.
   The parent pointers are represented by the position in the array
   of the parent.
   The root of any tree stores \Cref{ROOT}, represented graphically by a
   slash in the "Parent's Index" box.
   This figure shows two trees stored in the same parent pointer array,
   one rooted at~\svar{R}, and the other rooted at~\svar{W}.

Consider the problem of assigning the members of a set to
disjoint subsets called
:dfn:`equivalence classes`.
Recall from Section :numref:`<SetDef>` that an equivalence relation is
reflexive, symmetric, and transitive.
Thus, if objects :math:`A` and :math:`B` are equivalent, and objects
:math:`B` and :math:`C` are equivalent, we must be able to recognize
that objects :math:`A` and :math:`C` are also equivalent.

.. TODO::
   :type: Figure

   Book figure 6.6: A graph with two connected components.

   There are many practical uses for disjoint sets and representing
   equivalences.
   For example, consider Figure~\ref{UFexamp} which shows a graph of
   ten nodes labeled \svar{A} through \svar{J}.
   Notice that for nodes \svar{A} through \svar{I}, there is some series
   of edges that connects any pair of the nodes, but node \svar{J} is
   disconnected from the rest of the nodes.
   Such a graph might be used to represent connections such as wires
   between components on a circuit board, or roads between cities.
   We can consider two nodes of the graph to be equivalent if there is a
   path between them.
   Thus, nodes \svar{A}, \svar{H}, and \svar{E} would
   be equivalent in Figure~\ref{UFexamp}, but \svar{J} is not equivalent
   to any other.
   A subset of equivalent (connected) edges in a graph is called a
   \defit{connected component}.
   The goal is to quickly classify the objects
   into disjoint sets that correspond to the connected components.

Another application for UNION/FIND occurs in Kruskal's algorithm for
computing the minimal cost spanning tree for a graph
(Module :numref:`<MCSTfull>`).

The input to the UNION/FIND algorithm is typically  a series of
equivalence pairs.
In the case of the connected components example, the equivalence pairs
would simply be the set of edges in the graph.
An equivalence pair might say that object :math:`C` is equivalent to
object :math:`A`.
If so, :math:`C` and :math:`A` are placed in the same subset.
If a later equivalence relates :math:`A` and :math:`B`, then
by implication :math:`C` is also equivalent to :math:`B`.
Thus, an equivalence pair may cause two subsets to merge, each of
which contains several objects.

Equivalence classes can be managed efficiently with the UNION/FIND
algorithm.
Initially, each object is at the root of its own tree.
An equivalence pair is processed by checking to see if both objects
of the pair are in the same tree using method ``differ``.
If they are in the same tree, then no change need be made because the
objects are already in the same equivalence class.
Otherwise, the two equivalence classes should be merged by the
``UNION`` method.

.. TODO::
   :type: Slideshow

   Build this around Book Figure 6.7:

   An example of equivalence processing.
   (a) Initial configuration for the ten nodes of the graph in
   Figure~\ref{UFexamp}.
   The nodes are placed into ten independent equivalence classes.
   (b) The result of processing five edges:
   (\svar{A},~\svar{B}), (\svar{C},~\svar{H}), (\svar{G},~\svar{F}),
   (\svar{D},~\svar{E}), and (\svar{I},~\svar{F}).
   (c) The result of processing two more edges:
   (\svar{H},~\svar{A}) and (\svar{E},~\svar{G}).
   (d) The result of processing edge (\svar{H},~\svar{E}).}


   As an example of solving the equivalence class problem, consider the
   graph of Figure~\ref{UFexamp}.
   Initially, we assume that each node of the graph is in a distinct
   equivalence class.
   This is represented by storing each as the root of its own tree.
   Figure~\ref{EquivExamp}(a) shows this initial configuration using the
   parent pointer array representation.
   Now, consider what happens when equivalence relationship
   (\svar{A},~\svar{B}) is processed.
   The root of the tree containing~\svar{A} is~\svar{A}, and the root of
   the tree containing~\svar{B} is~\svar{B}.
   To make them equivalent, one of these two roots is set to be the
   parent of the other.
   In this case it is irrelevant which points to which, so we arbitrarily
   select the first in alphabetical order to be the root.
   This is represented in the parent pointer array by setting the parent
   field of~\svar{B} (the node in array position~1 of the array)
   to store a pointer to~\svar{A}.
   Equivalence pairs (\svar{C},~\svar{H}), (\svar{G},~\svar{F}), and
   (\svar{D},~\svar{E}) are processed in similar fashion.
   When processing the equivalence pair (\svar{I},~\svar{F}),
   because~\svar{I} and~\svar{F} are both their own roots,
   \svar{I}~is set to point to~\svar{F}.
   Note that this also makes \svar{G} equivalent to~\svar{I}.
   The result of processing these five equivalences is shown in
   Figure~\ref{EquivExamp}(b).

The parent pointer representation places no limit on the number of
nodes that can share a parent.
To make equivalence processing as efficient as possible, 
the distance from each node to the root of its respective tree should
be as small as possible.
Thus, we would like to keep the height of the trees small when merging
two equivalence classes together.
Ideally, each tree would have all nodes pointing directly to the root.
Achieving this goal all the time would require too much additional
processing to be worth the effort, so we must settle for getting as
close as possible.

A low-cost approach to reducing the height is to be smart about how
two trees are joined together.
One simple technique, called the
:dfn:`weighted union rule`,
joins the tree with fewer nodes to the tree with more nodes by making
the smaller tree's root point to the root of the bigger tree.
This will limit the total depth of the tree to :math:`O(\log n)`,
because the depth of nodes only in the smaller tree will now increase
by one, and the depth of the deepest node in the combined tree can
only be at most one deeper than the deepest node before the trees were
combined.
The total number of nodes in the combined tree is therefore at least
twice the number in the smaller subtree.
Thus, the depth of any node can be increased at most :math:`\log n`
times when :math:`n` equivalences are processed.

.. TODO::
   :type: Slideshow

   Illustration of Weighted Union Rule.

   When processing equivalence pair (\svar{I},~\svar{F}) in
   Figure~\ref{EquivExamp}(b), \svar{F}~is the root of a tree with two
   nodes while \svar{I}~is the root of a tree with only one node.
   Thus, \svar{I}~is set to point to~\svar{F} rather than the other way
   around.
   Figure~\ref{EquivExamp}(c) shows the result of processing two more
   equivalence pairs: (\svar{H},~\svar{A}) and (\svar{E},~\svar{G}).
   For the first pair, the root for~\svar{H} is~\svar{C} while the root
   for~\svar{A} is itself.
   Both trees contain two nodes, so it is an arbitrary decision as to
   which node is set to be the root for the combined tree.
   In the case of equivalence pair (\svar{E},~\svar{G}),
   the root of~\svar{E} is~\svar{D} while the
   root of~\svar{G} is~\svar{F}.
   Because~\svar{F} is the root of the larger tree, node~\svar{D} is set
   to point to~\svar{F}.

.. TODO::
   :type: Slideshow

   Illustration of equivalence:

   Not all equivalences will combine two trees.
   If equivalence :math:`(F, G)` is processed when the
   representation is in the state shown in Figure~\ref{EquivExamp}(c),
   no change will be made because~\svar{F} is already the root
   for~\svar{G}.


The weighted union rule helps to minimize the depth of the tree, but
we can do better than this.
:dfn:`Path compression` is a method that tends to create extremely
shallow trees.
Path compression takes place while finding the root
for a given node :math:`X`.
Call this root :math:`R`.
Path compression resets the parent of every node on the path from
:math:`X` to :math:`R` to point directly to :math:`R`.
This can be implemented by first finding :math:`R`.
A second pass is then made along the path from :math:`X` to :math:`R`,
assigning the parent field of each node encountered to :math:`R`.
Alternatively, a recursive algorithm can be implemented as follows.
This version of ``FIND`` not only returns the root of the
current node, but also makes all ancestors of the current node point
to the root.

.. TODO::
   :type: Code

   Resolve the fact that the current code presentation already shows
   Path Compression, but we need to explain it somehow.

.. TODO::
   :type: Slideshow

   Demonstration of Path Compression.

   Figure~\ref{EquivExamp}(d) shows the result of processing equivalence
   pair (\svar{H},~\svar{E}) on the the representation shown in
   Figure~\ref{EquivExamp}(c) using the standard weighted union rule
   without path compression.
   Figure~\ref{PathCompFig} illustrates the path compression process for
   the same equivalence pair.
   After locating the root for node~\svar{H}, we can perform path
   compression to make~\svar{H} point directly to root object~\svar{A}.
   Likewise, \svar{E}~is set to point directly to its root,~\svar{F}.
   Finally, object~\svar{A} is set to point to root object~\svar{F}.

   Note that path compression takes place during the
   FIND operation, \emph{not} during the UNION operation.
   In Figure~\ref{PathCompFig}, this means that nodes \svar{B},
   \svar{C}, and \svar{H} have node \svar{A} remain as their parent,
   rather than changing their parent to be \svar{F}.
   While we might prefer to have these nodes point to \svar{F}, to
   accomplish this would require that additional information from the
   FIND operation be passed back to the UNION operation.
   This would not be practical.

Path compression keeps the cost of each FIND operation very
close to constant.

Notes
-----

To be more precise about what is meant by "very close to constant",
the cost of path compression for :math:`n` FIND operations on
:math:`n` nodes (when combined with the weighted union rule for
joining sets) is approximately
:math:`\Theta(n \log^* n)`.
The notation :math:`\log^* n` means the number of times that
the log of :math:`n` must be taken before :math:`n \leq 1`.
For example, :math:`\log^* 65536` is 4 because
:math:`\log 65536 = 16, \log 16 = 4, \log 4 = 2`, and finally
:math:`\log 2 = 1`.
Thus, :math:`\log^* n` grows *very* slowly, so the cost for a series
of :math:`n` FIND operations is very close to :math:`n`.

Note that this does not mean that the tree resulting from
processing :math:`n` equivalence pairs necessarily has depth
:math:`\Theta(\log^* n)`.
One can devise a series of equivalence operations that yields
:math:`\Theta(\log n)` depth for the resulting tree.
However, many of the equivalences in such a series will look only at
the roots of the trees being merged, requiring little processing time.
The *total* amount of processing time required for :math:`n`
operations will be :math:`\Theta(n \log^* n)`,
yielding nearly constant time for each equivalence operation.
This is an example of amortized analysis, discussed
further in Module :numref:`<AmortAnal>`.

The expression :math:`\log^* n` is closely related to the inverse of
Ackermann's function.
For more information about Ackermann's function and the cost of path
compression for UNION/FIND, see Robert E. Tarjan's paper
"On the efficiency of a good but not linear set merging algorithm"
\cite{Tarjan}.
The article "Data Structures and Algorithms for Disjoint Set Union
Problems" by Galil and Italiano \cite{UFind} covers many aspects of the
equivalence class problem.
