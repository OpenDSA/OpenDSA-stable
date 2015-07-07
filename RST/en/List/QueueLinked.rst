.. This file is part of the OpenDSA eTextbook project. See
.. http://algoviz.org/OpenDSA for more details.
.. Copyright (c) 2012-2013 by the OpenDSA Project Contributors, and
.. distributed under an MIT open source license.

.. avmetadata:: 
   :author: Cliff Shaffer
   :requires: queue
   :satisfies: linked queue
   :topic: Lists

.. odsalink:: AV/List/lqueueCON.css   

Linked Queues
=============

The linked queue implementation is a straightforward adaptation
of the linked list.
Here is the linked queue class declaration.

.. codeinclude:: Lists/LQueue
   :tag: LQueue1,LQueue2

|

.. inlineav:: lqueueIntroCON ss
   :output: show    
   
.. inlineav:: lqueueEnqueueCON ss
   :output: show   
   
.. inlineav:: lqueueDequeueCON ss
   :output: show 
   
.. avembed:: Exercises/List/lqueueEnqueuePRO.html ka

.. avembed:: Exercises/List/lqueueDequeuePRO.html ka

.. avembed:: Exercises/List/StckQSumm.html ka


Comparison of Array-Based and Linked Queues
-------------------------------------------

All member functions for both the array-based and linked queue
implementations require constant time.
The space comparison issues are the same as for the equivalent stack
implementations.
Unlike the array-based stack implementation, there is no convenient
way to store two queues in the same array,
unless items are always transferred directly from one queue to the other.

.. odsascript:: AV/List/llistCON.js
.. odsascript:: AV/List/lqueueIntroCON.js
.. odsascript:: AV/List/lqueueEnqueueCON.js
.. odsascript:: AV/List/lqueueDequeueCON.js
