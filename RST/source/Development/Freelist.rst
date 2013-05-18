.. This file is part of the OpenDSA eTextbook project. See
.. http://algoviz.org/OpenDSA for more details.
.. Copyright (c) 2012-2013 by the OpenDSA Project Contributors, and
.. distributed under an MIT open source license.

.. avmetadata:: 
   :author: Cliff Shaffer
   :prerequisites:
   :topic: Lists

Freelists [Text]
================

The ``new`` operator is relatively expensive to use.
Garbage collection is also expensive.
Module :numref:`MemoryMan` discusses how general-purpose memory
managers are implemented.
The expense comes from the fact that free-store routines must be
capable of handling requests to and from free store with no particular
pattern, as well as memory requests of vastly different sizes.
This, combined with unpredictable freeing of space by the garbage
collector, makes them inefficient compared to what might be
implemented for more controlled patterns of memory access.

List nodes are created and deleted in a linked list implementation in
a way that allows the ``Link`` class programmer
to provide simple but efficient memory management routines.
Instead of making repeated calls to ``new``, 
the ``Link`` class can handle its own :dfn:`freelist`.
A freelist holds those list nodes that are not currently being used.
When a node is deleted from a linked list, it is placed at the
head of the freelist.
When a new element is to be added to a linked list, the freelist
is checked to see if a list node is available.
If so, the node is taken from the freelist.
If the freelist is empty, the standard ``new`` operator must then
be called.

Freelists are particularly useful for linked lists that periodically
grow and then shrink.
The freelist will never grow larger than the largest size yet reached
by the linked list.
Requests for new nodes (after the list has shrunk) can be handled by
the freelist.
Another good opportunity to use a freelist occurs when a program uses
multiple lists.
So long as they do not all grow and shrink together, the free list can
let link nodes move between the lists.

In the implementation shown here, the link class is augmented with
methods ``get`` and ``release``. [#]_
Here is the code to reimplement the ``Link`` class
to support these methods.

.. codeinclude:: Lists/Freelink.pde
   :tag: Freelink

The ``freelist`` variable declaration uses the keyword ``static``.
This creates a single variable shared among all instances of the
``Link`` nodes.
In this way, a single freelist shared by all ``Link`` nodes.

Note how simple they are, because they need only remove and add an
element to the front of the freelist, respectively.
The freelist methods ``get`` and ``release`` both run in
:math:`\Theta(1)` time, except in the case where the freelist is
exhausted and the ``new`` operation must be called.
Here are the necessary modifications to members of the linked list
class to make use of the freelist version of the link class.

.. TODO::
   :type: Text

   Run timings on Freelist operators to see the speedup: On my
   computer, a call to the overloaded ``new`` and ``delete``
   operators requires about one tenth of the time required by the
   system free-store operators.

.. codeinclude:: Lists/Freelist.pde
   :tag: Freelist

Notes
-----

.. [#] A language like C++ could use operator overloading to redefine
   the ``new`` and ``delete`` operators.
