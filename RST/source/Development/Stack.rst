.. This file is part of the OpenDSA eTextbook project. See
.. http://algoviz.org/OpenDSA for more details.
.. Copyright (c) 2012-2013 by the OpenDSA Project Contributors, and
.. distributed under an MIT open source license.

.. avmetadata:: 
   :author: Cliff Shaffer
   :prerequisites:
   :topic: Lists

Stacks [Text]
=============

Stack terminology
-----------------

The :dfn:`stack` is a list-like structure
in which elements may be inserted or removed from only one end.
While this restriction makes stacks less flexible than lists,
it also makes stacks both efficient (for those operations they can do)
and easy to implement.
Many applications require only the limited form of
insert and remove operations that stacks provide.
In such cases, it is more efficient to use the simpler stack data
structure rather than the generic list.
For example, the freelist of Module :numref:`<Freelist>` is really a
stack.

Despite their restrictions, stacks have many uses.
Thus, a special vocabulary for stacks has developed.
Accountants used stacks long before the invention
of the computer.
They called the stack a "LIFO" list
which stands for "Last-In, First-Out."
Note that one implication of the LIFO policy is that stacks
remove elements in reverse order of their arrival.

The accessible element of the stack is called
the ``top`` element.
Elements are not said to be inserted, they are
:dfn:`pushed` onto the stack.
When removed, an element is said to be
:dfn:`popped` from the stack.
Here is a simple stack ADT.

.. codeinclude:: Lists/Stack.pde
   :tag: Stack

As with lists, there are many variations on stack implementation.
The two approaches presented here are :dfn:`array-based` and
:dfn:`linked stacks`, 
which are analogous to array-based and linked lists, respectively.

Array-Based Stacks
------------------

Here is a complete implementation for
the array-based stack class.

.. codeinclude:: Lists/AStack.pde
   :tag: AStack

As with the array-based list implementation, ``listArray`` must be
declared of fixed size when the stack is created.
In the stack constructor, ``size`` serves to indicate this size.
Method ``top`` acts somewhat like a current position value
(because the "current" position is always at the top 
of the stack), as well as indicating the number of elements
currently in the stack.

The array-based stack implementation is essentially
a simplified version of the array-based list.
The only important design decision to be made is which end of the
array should represent the top of the stack.
One choice is to make the top be at position 0 in the array.
In terms of list functions, all ``insert`` and ``remove``
operations would then be on the element in position 0.
This implementation is inefficient, because now every
``push`` or ``pop`` operation will require that all elements currently
in the stack be shifted one position in the array, for a cost of
:math:`\Theta(n)` if there are :math:`n` elements.
The other choice is have the top element be at position :math:`n-1`
when there are :math:`n` elements in the stack.
In other words, as elements are pushed onto the stack, they are
appended to the tail of the list.
Method :math:`pop` removes the tail element.
In this case, the cost for each :math:`push` or :math:`pop` operation
is only :math:`\Theta(1)`.

For the implementation of ``AStack``,
``top`` is defined to be the array index of the
first free position in the stack.
Thus, an empty stack has ``top`` set to 0, the first available
free position in the array.
(Alternatively, ``top`` could have been defined to be
the index for the top element in the stack, rather than the
first free position.
If this had been done, the empty list would initialize ``top``
as -1.)
Methods ``push`` and ``pop`` simply place an element into, or remove
an element from, the array position indicated by ``top``.
Because ``top`` is assumed to be at the first free position,
``push`` first inserts its value into the top position and then
increments ``top``, while ``pop`` first decrements ``top``
and then removes the top element.

Linked Stacks
-------------

The linked stack implementation is quite simple.
The freelist of Module `<Freelist>` is an example
of a linked stack.
Elements are inserted and removed only from the head of the list.
A header node is not used because no special-case code is required
for lists of zero or one elements.
Here is the complete linked stack implementation.

.. codeinclude:: Lists/LStack.pde
   :tag: LStack

The only data member is ``top``, a pointer to the
first (top) link node of the stack.
Method ``push`` first modifies the ``next``
field of the newly created link node to point to the top of the
stack and then sets ``top`` to point to the new link node.
Method ``pop`` is also quite simple.
Variable ``temp`` stores the top nodes' value,
while ``ltemp`` links to the top node as it is removed from
the stack.
The stack is updated by setting ``top`` to point to the
next link in the stack.
The old top node is then returned to free store (or the freelist),
and the element value is returned.

Comparison of Array-Based and Linked Stacks
-------------------------------------------

All operations for the array-based and linked stack implementations
take constant time, so from a time efficiency perspective,
neither has a significant advantage.
Another basis for comparison is the total space
required.
The analysis is similar to that done for list implementations.
The array-based stack must declare a fixed-size array initially, and
some of that space is wasted whenever the stack is not full.
The linked stack can shrink and grow but requires the overhead of a
link field for every element.

When multiple stacks are to be
implemented, it is possible to take advantage of the one-way growth of
the array-based stack.
This can be done by using a single array to store two stacks.
One stack grows inward from each end as illustrated by
Figure :num:`Figure #TwoArrayStacks`, hopefully leading to less wasted
space.
However, this only works well when the space requirements of the two
stacks are inversely correlated.
In other words, ideally when one stack grows, the other will shrink.
This is particularly effective when elements are taken from
one stack and given to the other.
If instead both stacks grow at the same time, then the free space
in the middle of the array will be exhausted
quickly.

.. _TwoArrayStacks:

.. odsafig:: Images/TwoArray.png
   :width: 500
   :align: center
   :capalign: justify
   :figwidth: 90%
   :alt: Two stacks implemented within a single array

   Two stacks implemented within in a single array, both growing
   toward the middle.
