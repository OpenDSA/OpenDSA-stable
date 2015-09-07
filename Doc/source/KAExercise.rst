.. _KAExercise:

Using OpenDSA with the Khan Academy infrastructure
==================================================

We use the Khan Academy (KA) infrastructure for writing questions.
KA supplies some documentation at their
`wiki <https://github.com/Khan/khan-exercises/wiki/>`_.

Using the Multiple Choice Question Template
-------------------------------------------

A template for writing multiple choice questions is available in
``OpenDSA/Doc/TemplateLessonMC.html``.
This page walks you through how to use the template to write your own
multiple choice (or T/F) questions.
When complete, your file should go in the
``OpenDSA/Exercises/Development`` directory.

#. Copy the file "TemplateLessonMC.html" and open it in any text editor.

#. Set the height and width of the exercise by adding / updating the ``data-height`` and ``data-width`` attributes of the ``body`` element

#. For each Multiple Choice question, start with a copy of the following code::

    <div id="problem-type-or-description">
      <p class="question"> <<QUESTION TEXT>></p>
      <div class="solution"><var>"<<QUESTION ANSWER>>"</var></div>
      <ul class="choices">
        <li><var>"<<INCORRECT CHOICE 1>>"</var></li>
        <li><var>"<<INCORRECT CHOICE 2>>"</var></li>
        <li><var>"<<INCORRECT CHOICE 3>>"</var></li>
      </ul>
      <div class="hints">
        <p><<ANY HINTS YOU HAVE>></p>
      </div>
    </div>

#. For each T/F question, start with a copy the following code::

    <div id="problem-type-or-description">
      <p class="question"> <<QUESTION TEXT>></p>
      <div class="solution"><var>"<<QUESTION ANSWER: TRUE/FALSE>>"</var></div>
      <ul class="choices" data-category="true">
        <li><var>"True"</var></li>
        <li><var>"False"</var></li>
      </ul>
      <div class="hints">
        <p><<ANY HINTS YOU HAVE>></p>
      </div>
    </div>

#. Within the template file, replace the text in brackets ``<< >>`` as follows:

   * ``<title><<ADD LESSON NAME>></title>``

     Modify the lesson name that appears at the top.

   * ``<p class="question"><<QUESTION TEXT>></p>``

     For a question, replace ``<<QUESTION TEXT>>`` with the text of the question

   * ``<div class="solution"><var>"<<QUESTION ANSWER>>"</var></div>``
        Replace ``<<QUESTION ANSWER>>`` with the text for the correct
        answer to the question

   * ``<li><var>"<<INCORRECT CHOICE 1>>"</var></li>``
       For each incorrect choice replace ``<<INCORRECT CHOICE 1>>``
       with your selected incorrect answer

   * If any question text, question answer, or incorrect answer
     has a mathematical formula (in latex format), put the formula
     between ``<code></code>`` tags as in these examples::

        <code>\log n</code>
        <code>n</code>
        <code>\Theta(n \sqrt{n})</code>

   * For T/F questions you will not need to add choices. You only
     need to add the answer (True or False) using **one** of the following
     lines::

      <div class="solution"><var>"True"</var></div>
      <div class="solution"><var>"False"</var></div>

   * Replace ``<<ANY HINTS YOU HAVE>>`` with hints that you think will
     be useful to the student. If you don't have any just delete this
     code from this question. If you have multiple hints, you can add
     as many as you like, each within its own ``<p></p>`` tags.


Using JSAV within the Khan Academy Framework
--------------------------------------------

* To change the height of the area that JSAV can work within, set the
  height for ``jsavcanvas`` within a style block.
  For example::

     <style>
       .jsavcanvas { height: 470px;}
     </style>

* Do not include ``"use strict";`` in the JavaScript for exercises
  that you want to include in summary exercises. This breaks for some
  reason.

Notes
-----

* If you want to use LaTeX within a multiple choice distractor (but as
  only part of the text, math being not the entire text), then be sure
  NOT to use <var></var> tags, and do not use quote marks.
