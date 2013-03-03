.. This file is part of the OpenDSA eTextbook project. See
.. http://algoviz.org/OpenDSA for more details.
.. Copyright (c) 2012-2013 by the OpenDSA Project Contributors, and
.. distributed under an MIT open source license.

.. avmetadata::
   :author: Cliff Shaffer
   :prerequisites: Sorting, InsertionSort
   :topic: Sorting

.. _BubbleSort:

.. index:: ! Bubble Sort

.. odsalink:: AV/slideCON.css

Bubble Sort
===========

Our next sorting algorithm is called :dfn:`Bubble Sort`.
Bubble Sort is often taught to novice programmers in
introductory computer science courses.
This is unfortunate, because Bubble Sort has no redeeming features
whatsoever.
It is a relatively slow sort, it is no
easier to understand than Insertion Sort,
it has no intuitive counterpart in "everyday" use,
and it has a poor best-case running time.
However, Bubble Sort can serve as the inspiration for a better sorting
algorithm that will be presented in
Module :numref:`Selection Sort <SelectionSort>`.

Like Insetion Sort, Bubble Sort consists of a simple double ``for``
loop.
The inner ``for`` loop moves through the record array from left to
right, comparing adjacent keys.
If the a record's key value is greater than the key of its right
neighbor, then the two records are swapped.
Once the largest value is encountered, this process will cause it
to "bubble" up to the right of the array
(which is where Bubble Sort gets its name).
The second pass through the array repeats this process.
However, because we know that the largest value already reached the
right of the array on the first pass, there is no need to compare the
rightmost two records on the second pass.
Likewise, each succeeding pass through the array compares adjacent
records, looking at one less value toward the end than did the
preceding pass.
An implementation is as follows.

.. codeinclude:: Sorting/Bubblesort/Bubblesort.pde 
   :tag: Bubblesort        

Consider the example of the following array.

.. inlineav:: BubsortCON1 ss
   :output: show

Now we continue with the second pass. However, since the largest
record has "bubbled" to the very right, we will not need to look at
it again.

.. inlineav:: BubsortCON2 ss
   :output: show

Bubble Sort continues in this way until the entire array is sorted.
The following visualization puts it all together.

.. avembed:: AV/Sorting/bubblesortAV.html ss

Now try for yourself to see if you understand how Bubble Sort works.

.. avembed:: Exercises/Sorting/BubsortPRO.html ka

Determining Bubble Sort's number of comparisons is easy.
Regardless of the arrangement of the values in the array, the number
of comparisons made by the inner ``for`` loop is always
:math:`i`, leading to a total cost of

.. math::
   \sum_{i=1}^n i \approx n^2/2 = \Theta(n^2).

Thus, Bubble Sort's running time is roughly the same
in the best, average, and worst cases.

The number of swaps required depends on how often a
record's value is less than that of the record immediately preceding
it in the array.
We can expect this to occur for about half the comparisons in the
average case, leading to :math:`\Theta(n^2)` for the
expected number of swaps.
The actual number of swaps performed by Bubble Sort will be identical
to that performed by Insertion Sort.

.. avembed:: Exercises/Sorting/BubsortSumm.html ka

.. odsascript:: AV/Sorting/bubblesortCON.js
