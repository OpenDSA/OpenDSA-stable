.. _InstructorTools:

Instructor's Tools
==================

Instructor's Tools Page
-----------------------

Instructor's tools are available from an OpenDSA scoring server
installation.
For example, the main Virginia Tech scoring server supplies its
instructor tools page from ``http://opendsa.cs.vt.edu/``.
You will have to log in with an account that has instructor
permissions for the course that you wish to work on.

On the opening page, you will see at the top a number of links to
various informational displays related to overall OpenDSA use.
The bottom of the page shows buttons for active courses.
If your course has been configured, then you should see a button for
it that you can click to go to the instructor's work page for the
course.

Course Page
-----------

The course page contains a menu of links on the left side, with the
main portion of the page containing a listing of assignments.
Really, the only thing of practical value that you can do on this page
is click the "Teacher's View" link.

Teacher's View Page
-------------------
This page is the main hub of activity for managing your course.

Student Accounts
----------------

There are fundamentally two ways to get students registered for using
OpenDSA.

#. One way is to let them register themselves.
   Scoring data for completing exercises is collected based on the URL
   for the book instance that they use.
   So if a student goes to the URL for your book instance, then any
   exercises that they complete will be associated with that book
   instance (and show up on the class activty spreadsheet for that book
   instance).

#. The other way is to create accounts.
   If you like, you can upload a CSV file that defines the account
   names and associated emails
   (using the ``Upload students list`` button).
   Alternatively, you can have OpenDSA generate a set of anonymized
   account names, with a set prefix
   (using the ``Create students accounts`` button).
   For example, you could create accounts names like ``CS101F14_01``
   through ``CS101F14_10``.
   In either case, you will then be responsible for informing your
   students about the account that they must use.

Class Activity
--------------

The ``Assignments Activity`` button lets you see what your students have
done.
It shows a spreadsheet with a row for each account, and columns for
assignments, exercises, and summed scores.
Be aware that this table is driven by the assignments that you have
created, **not** by what work the students have done.

So if you want to see who has done a given exercise, and the exercise is
not part of an assignment, use the ``Class activity`` button instead.

The "Toggle exercises columns" controls whether you just see
assignment total scores, or whether you see all of the details for
every exercise.

Hovering your cursor over a cell in the spreadsheet provides more
detailed information about when the student completed the assignment.

You can download the spreadsheet as a CSV file.


Students activity
-----------------

The ``Students activity`` buttons allows instructors to access detailed information
about each student activity within OpenDSA.

It shows the list of students enrolled in the classroom. Clicking on a student's name
will load a page containing information about the number of time each book instance page
was loaded and a timeline showing when the student earned proficiency.

#. The "Module loading Statistics" table contains a list of modules in the book instance along
   with a green bar showing how much time the module had been loaded by the student. Clicking on a
   module's name in the table will take you to the "Module activity" page showing the starting time and proficiency time
   for each interactive element in the module.

#. The "Proficiency Dates for Exercises" timeline displays for each day, the student proficiency activity.
   Each day in the timeline is associated with a list of all exercices that the student correctly completed for
   the first time (that day).

Furthermore, clicking on a slideshow (from the timeline or the module activity table)  will display a digram showing how much time the
student spent on each slide and how the student navigate (forward/backward steps) the
mini slideshow.




Manage Students
---------------

There are a number of ways and reasons why there might be accounts
associated with your book instance that you do not want mixed up with
your grading.
If you don't want a given account to show up on your spreadsheet, you
can make it invisible to the spreadsheet by using the ``Edit Students
Visibility`` page that you reach by clicking the ``Manage Students``
button.
Simply click the Grade checkbox to toggle visibility for that account.

Assignment Creation and Updating
--------------------------------

An assignment is just a collection of exercises with a name and an
associated due date.
You create a new assignment by clicking the ``Add new assignment``
button at the bottom of the "Teacher's View" page.
This takes you to the ``Edit Module`` form.
The key fields are the assignment name, the closing time (this will
affect the colors for the cells on the spreadsheet), and whether late
submissions are allowed.
OpenDSA does not use the "penalty" field.
The other fields are ignored (unfortunately, this current form is
inherited from another system, and we are at present unable to tune it
properly for the purpose).
Once you have set the fields as you like them, click the "Submit"
button.
You will then need to click on the "Teacher's View" item in the left
menu list to proceed to the next step.

Once you have created an assignment, there are two distinct things
that you can do with it:

* Edit the assignment fields (``Edit assignment`` button), which
  takes you to the same form as when you created the assignment.

* Modify the list of exercises associated with the assignment
  (``Set exercises`` button).

The page for adding exercises has two key parts: the
``Assignment Chapter`` field and the list of Assignment Exercises.
To add an exercise, select the chapter that contains it
This will cause a list of all associated exercises to appear, from
which you can check the desired exercises.
Checked exercises will then be added to the
``Assignment exercises`` list.
An assignment can contain exercises from different chapters.
If you uncheck an exercise on the list, it will be removed from the
assignment.
When you are done editing the list of exercises, click the ``Submit``
button.
