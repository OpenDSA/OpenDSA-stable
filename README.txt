This is the official release version for the OpenDSA project. Note
that active development for OpenDSA occurs in a separate repostory
available at https://github.com/cashaffer/OpenDSA.

The goal of the OpenDSA project is to create open-source courseware
for use in Data Structures and Algorithms courses, that deeply
integrate textbook-quality content with algorithm visualizations and
automated assessment exercises.

An outline of the major components in the directory structure is as
follows:

AV: Source code for various algorithm visualizations. Subdirectories
divide the content by topical areas.

Doc: Documentation. Currently contains a template for Khan Academy
multiple choice questions, and documentation for using the various
Sphinx directives that we have created.

Exercises: Our Khan Academy-style exercises. Subdirectories divide the
content by topic.

JSAV: The JavaScript Algorithm Visualization library (JSAV). This is a
submodule for the OpenDSA repository, linked to:
https://github.com/vkaravir/JSAV. Thus, when you check out OpenDSA,
you must get the JSAV submodule by doing the following:
  git submodule init
  git submodule update

lib: System-wide library

Makefile: Primarily for source file validation

MIT-license.txt: The license file. OpenDSA is distributed under an MIT
open source license.

ODSAkhan-exercises: Our somewhat modified version of the
khan-exercises distribution (the original is also available at
GitHub).
Note that you can view and run the exercises with just
this distribution. However, you must be running a webserver on the
machine from which you access the exercises. So most people using
their own personal computer won't see the exercises, it will either be
a blank page or some gibberish. You can always see the exercises
within their proper context from our mirror site at:
http://algoviz.org/OpenDSA/dev/OpenDSA/Exercises.

README.txt: This file

RST: The source for tutorial content, in reStructuredText (RST) format.

Scripts: Scripts used to process the content.
  
SourceCode: The sourcecode for code snippits contained in the
tutorials. Ultimately, we hope to support code snippits in Processing
(a Java dialect), Python, and JavaScript. In this way, instructors
would be able to generate versions of tutorials that support any of
these three languages.

Webserver: A command for invoking a simple python-based web server
that will enable you to run the Khan Academy exercises if your machine
is not running a true web server. You only need to have python installed
for this to work.


In order to pull a more recent copy of JSAV than what is in the submodule:
   cd JSAV
   git pull https://github.com/vkaravir/JSAV 

To check out a read-only copy of this repository:
  git clone git://github.com/cashaffer/OpenDSA-stable.git OpenDSA

To check out a read-write copy of this repository (requires permission
to commit to the repo):
  git clone https://YOURGITHUBID@github.com/cashaffer/OpenDSA-stable.git OpenDSA
