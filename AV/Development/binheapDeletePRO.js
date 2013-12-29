(function ($) {
  "use strict";
  /*global alert: true, ODSA */
  $(document).ready(function () {
    var initData, bh,
        settings = new JSAV.utils.Settings($(".jsavsettings")),
        jsav = new JSAV($('.avcontainer'), {settings: settings}),
        swapIndex;

    jsav.recorded();

      // Process About button: Pop up a message with an Alert
    function about() {
      alert("Heap Delete Proficiency Exercise\nWritten by Ville Karavirta\nCreated as part of the OpenDSA hypertextbook project\nFor more information, see http://algoviz.org/OpenDSA\nSource and development history available at\nhttps://github.com/cashaffer/OpenDSA\nCompiled with JSAV library version " + JSAV.version());
    }

    function init() {
      var nodeNum = 10;
      if (bh) {
        bh.clear();
        swapIndex.element.remove();
      }
      $.fx.off = true;
      var test = function(data) {
        var min = 1000,
            mmax = Math.max;
        // make sure we get a collision
        data[1] = data[2];
        bh = jsav.ds.binheap(data, {size: nodeNum, stats: true, tree: false});
        bh.stats.swaps = 0;
        var swapsBefore = 0,
            maxRecursion = 0;
        for (var i = 0; i < 3; i++) {
          bh.swap(0, bh.heapsize() - 1);
          bh.element.attr("data-jsav-heap-size", bh.heapsize() - 1);
          bh.heapify(1);
          maxRecursion = mmax(maxRecursion, bh.stats.swaps - swapsBefore);
          swapsBefore = bh.stats.swaps;
        }
        var swaps = bh.stats.swaps;
        bh.clear();
        return !(swaps < 7 || swaps > 10 || !bh.stats.interrupted || maxRecursion < 3);
      };
      initData = JSAV.utils.rand.numKeys(10, 100, nodeNum, {test: test, tries: 50});

      // Log the initial state of the exercise                                  
      var exInitData = {};
      exInitData.gen_array = initData;
      ODSA.AV.logExerciseInit(exInitData);

      bh = jsav.ds.binheap(initData);
      swapIndex = jsav.variable(-1);
      $.fx.off = false;
      return bh;
    }
    
    function model(modeljsav) {
      var modelbh = modeljsav.ds.binheap(initData, {nodegap: 20});
      modelbh.origswap = modelbh.swap; // store original heap grade function
      // set all steps gradeable that include a swap
      modelbh.swap = function (ind1, ind2, opts) {
        this.origswap(ind1, ind2, opts);
        // function is executed as function of the heap instance, which
        // has jsav variable (pointing to modeljsav var of this closure)
        this.jsav.stepOption("grade", true);
      };
      modeljsav._undo = [];
      var count = 3;
      while (count > 0) {
        modelbh.swap(0, modelbh.heapsize() - 1);
        modelbh.heapsize(modelbh.heapsize() - 1);
        modeljsav.step();

        modelbh.css(modelbh.heapsize(), {"opacity": "0"})
        modelbh._treenodes[modelbh.heapsize()].edgeToParent().css("stroke", "white");
        modeljsav.stepOption("grade", true);
        modeljsav.step();
        modelbh.heapify(1);
        count--;
      }
      return modelbh;
    }
    var exercise = jsav.exercise(model, init, { css: "opacity" },
        { controls: $('.jsavexercisecontrols'), fix: fixState });
    exercise.reset();
    
    function clickHandler(index) {
      jsav._redo = []; // clear the forward stack, should add a method for this in lib
      var sIndex = swapIndex.value();
      if (sIndex === -1) { // if first click
        bh.highlight(index);
        swapIndex.value(index);
        jsav.step();
      } else if (index === sIndex) { // second click on same
        bh.unhighlight(index);
        swapIndex.value(-1);
        jsav.step();
      } else { // second click will swap
        bh.swap(sIndex, index, {});
        bh.unhighlight([sIndex, index]);
        swapIndex.value(-1);
        exercise.gradeableStep();
      }
    }

    function fixState(modelHeap) {
      var size = modelHeap.size();
      swapIndex.value(-1); // only swaps are graded so swapIndex cannot be anything else after correct step                                                    
      for (var i = 0; i < size; i++) {
        bh.css(i, {"opacity": modelHeap.css(i, "opacity")});
        bh.value(i, modelHeap.value(i));
      }
      bh.heapsize(modelHeap.heapsize());
    }

    $(".jsavcontainer").on("click", ".jsavarray .jsavindex", function() {
      var index = $(this).parent(".jsavarray").find(".jsavindex").index(this);
      clickHandler(index);
    });
    
    $(".jsavcontainer").on("click", ".jsavbinarytree .jsavbinarynode", function() {
      var index = $(this).data("jsav-heap-index") - 1;
      clickHandler(index);
    });
    
    $("#decrement").click(function() {
        var heapsize = bh.heapsize() - 1; // decrement by one
        bh.heapsize(heapsize); // set heapsize
        // hide last item and the edge in the tree
        bh.css(heapsize, {"opacity": "0"});
        bh._treenodes[heapsize].edgeToParent().css({stroke: "white"});
        if (swapIndex.value() !== -1) {
          swapIndex.value(-1);
        }
        exercise.gradeableStep();
    });
    $("#about").click(about);
  });
}(jQuery));
