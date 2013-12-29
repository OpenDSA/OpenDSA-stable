.. _ODSAExtensions:

ReST Extensions
===============

The following custom ReST extensions have been created for the OpenDSA
project.

The documentation here presents all of the options associated with
each directive, as if the directive were to appear for direct processing
by Sphinx. However, OpenDSA modules are intended to be pre-processed
by a configuration script that dynamically loads in additional
information to tailor modules for specific eTextbook instances.
In particular, information related to grading of embedded exercises
should be controlled by the configuration files.
See :ref:`Configuration` for details.
Thus, a number of the directive options, while documented, are labeled
as not being set manually (i.e., by the module author) within the ReST
file. You just leave those options out when you create your module,
and specify them instead in your configuration file.

avembed
-------
NAME
    avembed - embed an AV or other HTML page inside a ReST document.

SYNOPSIS::

    .. avembed:: {relative_path} {type}
       [:jsav_exer_opt: {string}]
       [:long_name: {string}]
       [:module: {string}]
       [:points: {number}]
       [:required: true|false]
       [:showhide: show|hide|none]
       [:threshold: {number}]

DESCRIPTION
    ``.. avembed:: {relative_path} {type}``
      ``{relative_path}`` is the relative path (from the OpenDSA
      home directory) to the embedded page.
      ``{type}`` is the type of embedded exercise, one of the following:

        * **ka** - Khan Academy style exercises
        * **pe** - OpenDSA proficiency exercises
        * **ss** - slideshows
        * **dgm** - JSAV-based diagram

    ``:jsav_exer_opt: {string}``

      A URL-encoded string of grading options for JSAV exercises.
      **Added automatically by the configuration process, do NOT add manually.**

    ``:long_name: {string}``

      Long name for the embedded object. The "short" name is the file name.
      **Added automatically by the configuration process, do NOT add manually.**

    ``:module: {string}``

      The name of the module on which the AV is embedded.
      **Added automatically by the configuration process, do NOT add manually.**
      
    ``:points: {number}``

      Number of points this activity is worth.
      **Added automatically by the configuration process, do NOT add manually.**

    ``[:required: true|false]``

      Whether this activity is required for module credit.
      **Added automatically by the configuration process, do NOT add manually.**

    ``:showhide: show|hide|none``
      Include a button to show or hide the embedded
      content. The options are ``show`` to have the content visible
      when the page is first loaded or ``hide`` to have it hidden on
      page load.
      **Added automatically by the configuration process, do NOT add manually.**

    ``[:threshold: {number}]``

      Threshold number of points required for credit.
      **Added automatically by the configuration process, do NOT add manually.**

NOTES
    The ``.. avembed::`` directive fetches the AV's information
    (width and height, etc.) from its XML description file.
    This XML file is located in the directory ``xml`` contained
    within the same directory as the AV. If the AV is named
    ``fooAV.html`` then the XML file must be ``xml/fooAV.xml``.
    The path to the OpenDSA top-level directory should be set within
    ``conf.py`` in the source directory.

avmetadata
----------
NAME
    avmetadata - metadata information associated with this module.

SYNOPSIS::

    .. avmetadata::
       :author: {string}
       :prerequisites: {list of module_name}
       :topic: {string}
       :requires: {string}
       :satisfies: {string}

DESCRIPTION
    ``:author: {string}``
      Module author's name.
    ``:prerequisites: {list of module_name}``
      A comma-separated list of zero or more ``module_name``.
      These represent the prerequisites for this module.
    ``:topic: {string}``
      The topic covered by this module.
    ``:requires: {string}``
      A semi-colon delimited list of topics students are expected to know prior to completing the module
    ``:satisfies: {string}``
      A semi-colon delimited list of topics covered in this module that satisfy prerequisite knowledge requirements of other modules

codeinclude
-----------
NAME
    codeinclude - displays code snippets within the eTextbook.

SYNOPSIS::

    .. codeinclude:: {relative_path}
       [:tag: {mytag1} [, {mytag2}, ...]]

DESCRIPTION
    ``.. codeinclude:: {relative_path}``

      Include the contents of the file located at
      ``{relative_path}``.

    ``:tag: {my_tag}``

      Optionally, a tag or a comma separated list of tags can be
      specified. These tags must appear inside the source code file
      as specially formatted comments that delimit the block(s) of
      code that will be included.
      If tags are used, then only the code block(s) with the tags will
      appear.
      If multiple tags are used, then the multiple blocks will appear
      as though they were one continuous block of code without the
      intervening code that does not appear with the tags.
      If additional tags are hierarchically embedded within a tag
      block, then those tags will not appear (but the code will).
      Note that the source code must format the tags correctly,
      as::

         /* *** ODSATag: my_tag *** */
         /* *** ODSAendTag: my_tag *** */

NOTES
    The ``codeinclude`` directive closely matches the standard ReST
    directive ``literalinclude``.::

        .. codeinclude:: {relative_path}
           [:tag: my_tag]

    will (logically) map to:::

        .. literalinclude:: <relative_path>
           :start-after: /* *** ODSATag: my_tag *** */
           :end-before: /* *** ODSAendTag: my_tag *** */

inlineav
-----------
NAME
    inlineav - used to embed an AV (in particular "slideshows") into the document

SYNOPSIS::

    .. inlineav:: {avId} {type}
       [:output: show|hide]
       :points: {number}
       :required: true|false
       :threshold: {number}
       :align: left|right|center|justify|inherit

DESCRIPTION
    ``.. inlineav:: avId type``

      Create a container for an inline AV with the given ID and type.
      If the type is ``ss`` a slideshow will be created and if it is
      ``dgm`` a diagram will be created. inlineav diagrams behave like 
      typicall reStructuredText figures. Cross reference target and 
      caption are declared using the standard syntax.

      ``<type>`` **is automatically appended to the inlineav directive
      by the configuration process and should not be added manually.**

    ``[:output: show|hide]``

      If the AV is a slideshow, controls whether or not the message box is displayed
      Note the 'output' argument is only valid for slideshows.

    ``:long_name:``

      Long-form name for a slideshow object.
      **Added automatically by the configuration process, do NOT add manually.**

    ``:points: {number}``

      Number of points this activity is worth.
      **Added automatically by the configuration process, do NOT add manually.**

    ``:required: true|false``

      Whether this activity is required for module credit.
      **Added automatically by the configuration process, do NOT add manually.**

    ``:threshold: {number}``

      Threshold number of points required for credit.
      **Added automatically by the configuration process, do NOT add manually.**


    ``:align: left|right|center|justify|inherit``

      The alignment of the caption within the page.

.. _numref:

numref
------
NAME
    numref - adds numbered cross references to modules.

SYNOPSIS::

    :numref: {caption} <{reference_label}>
    :numref: {reference_label}

DESCRIPTION
    ``:numref: {caption} <{reference_label}>``

    A custom interpreted text role. ``numref`` adds numbered cross
    references within ODSA documents.

    ``{caption}``

    Text to be displayed next to the numbered reference.

    ``{reference_label}``

    Reference name (unique) of the referenced object. Should be
    enclose in brackets (``<>``) when a caption is provided. It is
    specified via the standard ReST referencing mechanisms.

NOTES
    The ODSA preprocessor creates a table of all referenced objects
    with numbers and writes it into a file that is read by the ``numref``
    role.
    When referencing equation (declared with ``math`` directive), 'equation-' 
    need to be added in front of the label to work, eg to reference the equation with label 'sum2' you write
    ``:numref:`<equation-sum2>``` 


.. _chap:

chap/numchap
-------------
NAME
    chap/numchap - adds a reference to the first (introduction) module
    of a chapter. 

SYNOPSIS::

    :chap: {chapter_name}
    :numchap: {chapter_name}

DESCRIPTION
    ``:chap: {chapter_name}``

    A custom interpreted role that adds the chapter name as the label
    for a link to the first module of the indicated chapter.

    ``:numchap: {chapter_name}``

    A custom interpreted role that adds a chapter number as the label
    for a link to the first module of the indicated chapter.

    ``{chapter_name}``
  
    The name of the chapter. It should be identical (case sensitive)
    to the one specified in the json configuration file.


TODO
----
NAME
    TODO - adds a todo box in the output HTML file, and is
    also used by the ODSA preprocessor script to create a separate
    HTML page containing the collated list of desired AVs and
    Exercises.
    (NOTE: Can also be called as ``todo``.)

SYNOPSIS::

    .. TODO::
       [:type: {type label of the desired artifact}]

DESCRIPTION

    ``.. TODO::``

    Within the module, this behaves like the standard Sphinx
    TODO (or todo) directive. As with the standard TODO directive, the
    author should then include (indented) text that describes the task
    to be done. The ODSA version will in addition create a
    separate page TODO.html that includes a listing of all TODO
    blocks from all of the modules.

    ``:type: {type label of the desired artifact}``

    The type of the desired artifact (AV, Proficiency Exercise,
    etc). This is just a label, so it can be anything. Each
    separate label will collate together all TODO entries with
    that label on the TODO.html page.

NOTES
    The ODSA preprocessor collects the descriptions (i.e., the text
    that follows the TODO directive) from the complete collection of
    RST files to create a separate TODO.rst file that lists all the
    desired AVs and Exercises grouped by type.
    The TODO.rst file should be included in the index.rst file to be
    part of the table of contents for the eBook.


odsalink
--------
NAME
    odsalink - adds the code to include a CSS file in the
    HTML output file.

SYNOPSIS::

   .. odsalink:: {path to file}

DESCRIPTION
    ``.. odsalink::``
    The directive injects the code to include a linked file in the
    outputted HTML files.
    It gets the path to ODSA directory from the ``odsa_path`` variable
    in the ``conf.py`` file.

    ``{path to file}``
    The path (relative to ODSA directory root as defined by the
    ``odsa_path`` variable in the ``conf.py`` file) to the linked file
    to be include.

NOTES
    The directory containing the file to be included should be hosted
    within the ODSA directory.
    Example, if ``odsa_path`` is defined to be ``..\..\..``, then

    ``.. odsalink:: JSAV/css/JSAV.css``

    will produce

    ``<link href="../../../JSAV/css/JSAV.css" rel="stylesheet" type="text/css" />``

    in the HTML output file.


odsascript
----------
NAME
    odsascript - adds the code to include a script file in the
    HTML output file.

SYNOPSIS::

   .. odsascript:: {path to file}

DESCRIPTION
    ``.. odsascript::``
    The directive injects the code to include a script file in the
    outputted HTML files.
    It gets the path to ODSA directory from the ``odsa_path`` variable
    in the ``conf.py`` file.

    ``{path to file}``
    The path (relative to ODSA directory root as defined by the
    ``odsa_path`` variable in the ``conf.py`` file) to the script file
    to be include.

NOTES
    The directory containing the file to be included should be hosted
    within the ODSA directory.
    Example, if ``odsa_path`` is defined to be ``..\..\..``, then

    ``.. odsascript:: JSAV/build/JSAV-min.js``

    will produce

    ``<script type="text/javascript" src="../../../JSAV/build/JSAV-min.js"></script>``

    in the HTML output file.

odsafig
--------
NAME
    odsafig - provides the ability to specify caption alignment to figures.

SYNOPSIS::

    .. odsafig:: {path to image}
       :capalign: left|right|center|justify|inherit

DESCRIPTION
    ``.. odsafig::``
    The directive behaves exactly as the standard ``.. figure::`` directive.
    It allows you to specify the positioning of figure caption on the page

    ``:capalign: left|right|center|justify|inherit``
      The alignment of the caption on the page.  

NOTES
    The directive closely matches the standard ReST ``figure`` directive. The only addition
    is the ``:capalign:`` argument.


odsatab
--------
NAME
    odsatab - provides the ability to create tables (with ``math`` directive) that behave like figures. Caption is display above the table, and the position of the caption can be specified by the user.

SYNOPSIS::

    .. odsatab:: 
       :capalign: left|right|center|justify|inherit
       :align: left|right|center

DESCRIPTION
    ``.. odsatab::``
    The directive allows the user to create tables using ``math`` directives. The directive numbers tables and allows numbered cross refences. 
    It allows users to specify the positioning of the table and the table caption on the page

    ``:capalign: left|right|center|justify|inherit``
      The alignment of the caption on the page.
    ``:align: left|right|cente``
      The alignment of the table on the page.

NOTES
    The first paragraph of the directive content is used as table caption.




topic (special case)
--------------------

The syntax of the  ``topic`` is not changed in OpenDSA. We are using the directive to display
``examples, tables, and theorems``.
To insert an example in your module, just use the keyword ``Example`` as topic title.
To insert a theorem in your module, just use the keyword ``Theorem`` as topic title.
The example/table/theorem can be referenced using standard Sphinx mechanism, for numbered reference,
use the ``:num:`` directive.

EXAMPLE::

    (1) to add  an example with an anchor
    .. _example1:

    .. topic:: Example

    This is our first example
     

    (2) to reference the example
    See Example :num: `Example #example1`. 
