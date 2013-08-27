.. This file is part of the OpenDSA eTextbook project. See
.. http://algoviz.org/OpenDSA for more details.
.. Copyright (c) 2012-2013 by the OpenDSA Project Contributors, and
.. distributed under an MIT open source license.

.. avmetadata::
   :author: Cliff Shaffer
   :prerequisites: Sorting
   :topic: Sorting

.. slideconf::
   :autoslides: False


.. index:: ! Insertion Sort

==============
Insertion Sort
==============

.. slide:: Insertion Sort
   :level: 1

   What would you do if you have a stack of phone bills from the past
   two years and you want to order by date?
   A fairly natural way to handle this is to look at the first two
   bills and put them in order.
   Then take the third bill and put it into the right position with
   respect to the first two, and so on.


Overview
========

.. slide:: Title 1  
   :level: 3 
 
   Consider this start to the process.

   .. inlineav:: InssortCON1 ss
      :output: show

Overview
========

.. slide:: Title 2
   :level: 3

   Next, process the record in position 2.
   Swap it to the left until it reaches a value smaller than it is.

   .. inlineav:: InssortCON2 ss
      :output: show



Overview
========

.. slide:: Title 3
   :level: 3 

   And now the record in position 3.

   .. inlineav:: InssortCON3 ss
      :output: show


Insertion Sort Analysis
=======================

.. slide:: Title 4
   :level: 3

   The body of ``inssort`` consists of two nested
   ``for`` loops.
   The outer ``for`` loop is executed :math:`n-1` times.
   The inner ``for`` loop is harder to analyze because the
   number of times it executes depends on how many records in positions
   0 to :math:`i-1` have a value less than that of the record in
   position :math:`i`.
   In the worst case, each record must make its way to the start of the
   array.
   Thus, the total number of comparisons will be
 
   .. math::
      \sum_{i=1}^{n-1} i = \frac{n(n-1)}{2} \approx n^2/2 = \Theta(n^2).

   So, the average case is no better than the worst case in
   its growth rate :num:`Figure #TOH456`.


   .. odsascript:: AV/Sorting/insertionsortCON.js
