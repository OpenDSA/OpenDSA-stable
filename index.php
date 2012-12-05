<!DOCTYPE html>
<html>
<head>
<title>OpenDSA Project Homepage</title>
<link href="lib/site.css" rel="stylesheet" type="text/css">
</head>

<body>
<div id="content">
<h1 style="background: url(site/OpenDSALogo64.png) no-repeat 20px 50%; text-align: center; font-size: 32pt">
OpenDSA: An Active-eBook for <br /> Data Structures and Algorithms</h1>

<h5>Click on the images to try things out.</h5>

<p>
Welcome to the homepage for the OpenDSA Active-eBook Project.
Our goal is to develop a complete online textbook for data structures
and algorithms (DSA) courses.
This will include:

<ul>

<li >
Hundreds of instructional modules, where each
module is the equivalent to one topic, such as one sorting algorithm,
corresponding to a couple of pages in a standard textbook.
Each module is of textbook quality.
Here are some sample images, but you can see
<a href="RST/build/html">our current content</a>.
<br clear=all />

<p></p>
<a href="RST/build/html/InsertionSort.html" target="_blank">
<img border="1px" src="site/Inssort.png" width="400" /></a>
<p></p>
</li>

<li>
Every algorithm or data structure is illustrated by an
interactive algorithm visualization. Students could enter their own
test cases to see how the algorithm or data structure works on that
input, and they can control the pacing of the visualization.
<br clear=all />

<p></p>
<a href="AV/Sorting/insertionsortAV.html" target="_blank">
<img border="1px" src="site/insertionsort.png" width="400" /></a>
<br clear=all />
<p></p>

</li>

<li>
Every module contains multiple interactive assessment activities
that give students immediate feedback on their proficiency with the
material.
This means many hundreds of exercises.
<br clear=all />

<p></p>
<a href="AV/Sorting/ShellsortProficiency.html" target="_blank">
<img border="1px" src="site/Shellsort_prof.png" width="400" /></a>
<a href="AV/Sorting/heapsortProficiency.html" target="_blank">
<img border="1px" src="site/heapsort.png" width="400" /></a>
<br clear=all />
</li>

</ul>
</p>

<p>
We will accomplish this through an open-source, creative commons
environment.
"Open Source" means that not only can anyone use the materials,
they can also access the source code that generates the materials.
"Creative Commons" means that anyone has permission to modify or remix
the materials for their own purposes.
You as an instructor (or even a student or professional who wants to
self study) will be able to pick and choose from the
selection of modules and exercises, automatically generating a custom
textbook that contains exactly the topics you want.
Since all materials are open source, you can rewrite any part
if you don't like what is already there.
Infrastructure will be included that lets you register
students and then track their progress through the modules and exercises.
</p>

<p>
A major complaint of students in DSA classes is that they do
not get enough practice problems, or sufficient other means of testing
their proficiency.
One of the most important aspects of our vision is a rich
set of exercise that ensure that the student is understanding the
material as he/she progresses through the book.
Our modules will contain a mix of content, visualizations, and
exercises.
We make extensive use of the
<a href="http://khanacademy.org/exercisedashboard">
Khan Academy exercise infrastructure</a> to build interactive
exercises.
</p>

<a href="Exercises/Development/ODSAindex.html" target="_blank">
<img border=1px src="site/ka.png" height="250" /></a>
<img border=1px src="site/huffman.png" height="250" /></a>

<p>
For more details on our project infrastructure, status, and issues,
see the <a href="http://algoviz.org/ebook">OpenDSA Wiki</a>.
</p>

<p>
The <a href="http://algoviz.org/forum/277">OpenDSA Forum</a> contains
discussions by the participants related to the project.

<p>
If you are a new developer on the project, see
<a href="http://algoviz.org/algoviz-wiki/index.php/The_OpenDSA_Developer%27s_Getting_Started_Guide">The OpenDSA Developer's Getting Started Guide</a>.
</p>

<a href="http://algoviz.org/OpenDSA/AV/Sorting/ShellsortPerformance.html" target="_blank">
<img border=1px src="site/Shellsort_perf.png" height="300" /></a>

<h2>Publications and Presentations</h2>

<ol>
<li>
E. Fouh, M. Sun, and C.A. Shaffer,
<a href="http://people.cs.vt.edu/~shaffer/Presentations/ODSA_SIGCSE12.pdf">OpenDSA:
A Creative Commons Active-eBook</a>,
a poster presented at SIGCSE 2012, Raleigh, NC, March 2012.

<li>
C.A. Shaffer, V. Karavirta, A. Korhonen and T.L. Naps,
<a href="http://people.cs.vt.edu/~shaffer/Papers/Koli2011.pdf">
OpenDSA: Beginning a Community Hypertextbook Project</a>
in <i>Proceedings of 11th Koli Calling International Conference on
Computing Education Research</i>,
November 17-20, 2011, Koli National Park, Finland, 112--117.

<li>
C.A. Shaffer, T.L. Naps, and E. Fouh,
<a href="http://people.cs.vt.edu/~shaffer/Papers/pvw1.pdf">
Interactive Textbooks for Computer Science Education</a>
in <i>Proceedings of the Sixth Program Visualization Workshop</i>,
June 30, 2011, Darmstadt, Germany, 97-103.

</ol>

<img src="site/IMG_2457.JPG" align="right" height="100" alt="Team members" />
<h2>Contact</h2>

For more information, or to get involved, please contact
Cliff Shaffer at
<tt><script type="text/javascript" language="JavaScript">
shaffer = new String (String.fromCharCode
(115,104,97,102,102,101,114,64,99,115,46,118,116,46,101,100,117))
document.write (shaffer.link ("mailto:" + shaffer))
</script></tt>.

<h2>Support</h2>

<p>
The OpenDSA Project is supported by the National Science Foundation
(<a href="support.php">see more</a>).
 <img src="site/nsf1.gif" align="right" height="64" alt="NSF Logo" />
</p>

</div>

<div id="footer">
<hr />

<p class="footertext">
[Last updated: <? echo date( "m/d/Y", filemtime( __FILE__ )); ?>]
</p>
</div>

</body>
</html>
