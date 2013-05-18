"use strict";
/*global alert: true, ODSA */
(function ($) {
  var jsav,   // for JSAV library object
      arr,    // for the JSAV array
      pseudo; // for the pseudocode display

  // create a new settings panel and specify the link to show it
  var settings = new JSAV.utils.Settings($(".jsavsettings"));

  // add the layout setting preference
  var arrayLayout = settings.add("layout", {"type": "select",
                      "options": {"bar": "Bar", "array": "Array"},
                      "label": "Array layout: ", "value": "bar"});

  var LIGHT = "rgb(215, 215, 215)";  // For "greying out" array elements
  
  // Initialize the arraysize dropdown list
  ODSA.AV.initArraySize(5, 16, 8);

  // Process About button: Pop up a message with an Alert
  function about() {
    alert("Bubble Sort Algorithm Visualization\nWritten by Cliff Shaffer and Brandon Watkins\nCreated as part of the OpenDSA hypertextbook project\nFor more information, see http://algoviz.org/OpenDSA\nSource and development history available at\nhttps://github.com/cashaffer/OpenDSA\nCompiled with JSAV library version " + JSAV.version());
  }

  // Bubble Sort
  function bubblesort() {
    var i, j;
    jsav.umsg("For each pass, we will move left to right swapping adjacent elements as needed. Each pass moves the next largest element into its final position (these will be shown in lighter color).");
    pseudo.setCurrentLine(0);
    jsav.step();
    for (i = 0; i < arr.size() - 1; i++) {
      jsav.umsg("Starting pass " + i);
      pseudo.setCurrentLine(1);
      jsav.step();
      jsav.umsg("For each element moving through the list");
      pseudo.setCurrentLine(2);
      jsav.step();
      arr.highlightBlue(0);
      for (j = 1; j < arr.size() - i; j++) {
        arr.highlightBlue(j);
        jsav.umsg("Compare elements");
        pseudo.setCurrentLine(3);
        jsav.step();
        if (arr.value(j - 1) > arr.value(j)) {
          jsav.umsg("Swap");
          pseudo.setCurrentLine(4);
          arr.swap(j - 1, j);
          jsav.step();
        }
        arr.unhighlightBlue(j - 1);
      }
      arr.unhighlightBlue(j - 1);
      arr.css([j - 1], {"color": LIGHT});
      jsav.umsg("Done this pass");
      jsav.step();
    }
    arr.css([0], {"color": LIGHT});
    jsav.umsg("Done sorting!");
    pseudo.setCurrentLine(5);
    jsav.step();
  }

  // Execute the "Run" button function
  function runIt() {
    var arrValues = ODSA.AV.processArrayValues();
    
    // If arrValues is null, the user gave us junk which they need to fix
    if (arrValues) {
      ODSA.AV.reset(true);
      jsav = new JSAV($('.avcontainer'));

      // Create a new array using the layout the user has selected
      arr = jsav.ds.array(arrValues, {indexed: true, layout: arrayLayout.val()});
      pseudo = jsav.code({url: "../../SourceCode/Processing/Sorting/Bubblesort.pde",
                          startAfter: "/* *** ODSATag: Bubblesort *** */",
                          endBefore: "/* *** ODSAendTag: Bubblesort *** */"});
      jsav.umsg("Starting Bubble Sort");
      jsav.displayInit();
      bubblesort();
      arr.unhighlightBlue(true);
      jsav.recorded(); // mark the end
    }
  }

  // Connect action callbacks to the HTML entities
  $('#about').click(about);
  $('#run').click(runIt);
  $('#reset').click(ODSA.AV.reset);
}(jQuery));