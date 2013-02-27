.. _ODSAExtensions:

OpenDSA ReST Extensions
=======================

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
                      
    .. avembed:: <AV_Path> type
       [:showbutton: {show|hide}]
       [:long_name: ]
       [:points: #]
       [:required: <true | false>]
       [:threshold: #]
       
DESCRIPTION
    ``.. avembed:: <AV_Path> type``
      Parameters are the relative path (from the OpenDSA
      home directory) to the embedded page, and its type ('ss' for
      slideshow, 'pe' for proficiency exercise,
      or 'ka' for Khan Academy exercise).
      
      ```Note:``` The ``points``, ``required``, and ``threshold``
      arguments are automatically appended to the ``avembed``
      directive by the configuration process and should not be added
      manually.

    ``[:showbutton: {show|hide}]`` 
      Include a button to show or hide the embedded
      content. The options are ``show`` to have the content visible
      when the page is first loaded or ``hide`` to have it hidden on
      page load.
    
    ``[:long_name: ]``
    
      Long name for the embedded object. The "short name" is the file name.
      **Added automatically by the configuration process, do NOT add manually.**
    
    ``[:points: #]``
    
      Number of points this activity is worth.
      **Added automatically by the configuration process, do NOT add manually.**
    
    ``[:required: <true | false>]``
    
      Whether this activity is required for module credit.
      **Added automatically by the configuration process, do NOT add manually.**
    
    ``[:threshold: #]``
    
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
    avmetadata - metadata information associated with this
    module. 

SYNOPSIS::             
        
    .. avmetadata::
       :author:
       :prerequisites:
       :topic:

DESCRIPTION
    ``:author:``
      Module author's name.
    ``:prerequisites:``
      A comma-separated list of ``module_name``.
      These represent the prerequisites for this module.
    ``:topic:``
      The topic covered by this module.

codeinclude
-----------
NAME
    codeinclude - displays code snippets within the eTextbook.

SYNOPSIS::

    .. codeinclude:: <relative path>
       [:tag: <my tag>]    

DESCRIPTION
    ``.. codeinclude:: <relative path>``

      Include the code present inside the file located at
      ``<relative path>``.

    ``:tag: <my tag>``

      A tag inside the source code file that delimits the block
      of code that will be included.
      Note that the source code must use the tags correctly, as shown
      below.

NOTES
    The ``codeinclude`` directive closely matches the standard ReST
    directive ``literalinclude``.::

        .. codeinclude:: <relative path>
           [:tag: <my tag>]  

    will (logically) map to:::

        .. literalinclude:: <relative path>
           :start-after: /* *** ODSATag: <my tag> *** */
           :end-before: /* *** ODSAendTag: <my tag> *** */

inlineav
-----------
NAME
    inlineav - displays code snippets within the eTextbook.

SYNOPSIS::

    .. inlineav:: avId type
       :output: [show | hide]
       :points: #
       :required: [true | false]
       :threshold: #

DESCRIPTION
    ``.. inlineav:: avId type``

      Create a container for an inline AV with the given ID and type ('ss' or 'dgm').
      If the type is 'ss' a slideshow will be created and if it is 'dgm' a diagram will be created

      The points, required, threshold and type arguments are automatically
      appended to the inlineav directive by the configuration process and
      should not be added manually

    ``:output: [show | hide]``

      If the AV is a slideshow, controls whether or not the message box is displayed
      Note the 'output' argument is only valid for slideshows.
    
    ``:points: #``
    
      Added automatically by the configuration process, do NOT add manually
    
    ``:required: [true | false]``
    
      Added automatically by the configuration process, do NOT add manually
    
    ``:threshold: #``
    
      Added automatically by the configuration process, do NOT add manually

numref
------
NAME
    numref - adds numbered cross references to modules.

SYNOPSIS::

    :numref:`[caption] <reference_label>`
    :numref:`reference_label`

DESCRIPTION
    ``:numref:``               

    A custom interpreted text role. ``numref`` adds numbered cross
    references within ODSA documents.

    ``caption``      

    Text that will be display next to the numbered reference.    

    ``reference_label``

    Reference name (unique) of the referenced object. Should be
    enclose in brackets ('<>') when a caption is provided. It is
    specified via the standard ReST referencing mechanisms.

NOTES
    The ODSA preprocessor creates a table of all referenced objects
    with numbers and writes it into a file that is read by the ``numref``
    role.


TODO
----
NAME
    TODO - adds a todo box in the output HTML file, and is
    also used by the ODSA preprocessor script to create a HTML
    page containing the collated list of desired AVs and Exercises.
    (NOTE: Can also be called as ``todo``.)

SYNOPSIS::

    .. TODO::
       [:type: <type label of the desired artifact>]  

DESCRIPTION

    ``.. TODO::``

    Within the module, this behaves like the standard Sphinx
    TODO (or todo) directive. The ODSA version also creates a
    separate page TODO.html that includes a listing of all TODO
    blocks from all of the modules.

    ``:type: <type label of the desired artifact>``    

    The type of the desired artifact (AV, Proficiency Exercise,
    etc). This is just a label, so it can be anything. Each
    separate label will collate together all TODO entries with
    that label on the TODO.html page.

NOTES
    The ODSA preprocessor collects the description of the TODO
    directive (inside rst files) to create a TODO.rst file that lists
    all the desired AVs and Exercises grouped by type.
    The TODO.rst file should be included in the index.rst file to be
    part of the table of contents for the eBook. 

   
odsalink  
--------
NAME  
    ODSALINK - adds the code to include an OpenDSA CSS file in the
    final HTML eTextBook.
      
SYNOPSIS::   

   .. odsalink:: <path to file>      

DESCRIPTION 
    ``.. odsalink::``  
    The directive injects the code to include a file in the outputted
    html files.
    It gets the path to ODSA directory from the ``odsa_path`` variable
    in the ``conf.py`` file.

    ``<path to file>``  
    The path (relative to ODSA directory root as defined by the
    ``odsa_path`` variable in the ``conf.py`` file) to the script file
    to be include.

NOTES
    The directory containing the file to be included should be hosted
    within ODSA folder.
    Example:

    ``.. odsalink:: JSAV/css/JSAV.css``

    will produce something like

    ``<link href="../../../JSAV/css/JSAV.css" rel="stylesheet" type="text/css" />``

    in html files.    


odsascript  
----------
NAME
    ODSASCRIPT - adds the code to include an OpenDSA script file in
    the final HTML eTextBook.

SYNOPSIS::

   .. odsascript:: <path to file>

DESCRIPTION
    ``.. odsascript::``
    The directive injects the code to include a file in the outputted
    html files.
    It gets the path to ODSA directory from the ``odsa_path`` variable
    in the ``conf.py`` file.

    ``<path to file>``
    The path (relative to ODSA directory root as defined by the
    ``odsa_path`` variable in the ``conf.py`` file) to the script file
    to be include.

NOTES
    The directory containing the file to be included should be hosted
    within the ODSA folder.
    Example:
    
    ``.. odsascript:: JSAV/build/JSAV-min.js``

    will produce something like

    ``<script type="text/javascript" src="../../../JSAV/build/JSAV-min.js"></script>``

    in html files.
