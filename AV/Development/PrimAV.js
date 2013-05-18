"use strict";
/*global alert: true, ODSA */

(function ($) {
  var jsav;
  var graph;
  var mst;   //A graph representing the resulted MST
  var gnodes = [];
  var mstnodes = [];
  var distances;
  var labels;
  var arr;     //Used to initialize the distance and labels arrays.

  function runit() {
    var i;
    ODSA.AV.reset(true);
    jsav = new JSAV($('.avcontainer'));
    graph = jsav.ds.graph({width: 600, height: 400, layout: "manual", directed: false});
    mst = jsav.ds.graph({width: 600, height: 400, layout: "manual", directed: true});
    initGraph();
    graph.layout();
    arr = new Array(graph.nodeCount());
    for (i = 0; i < arr.length; i++) {
      arr[i] = Infinity;
    }
    distances = jsav.ds.array(arr, {layout: "vertical", left: 600, top: 20});
    for (i = 0; i < arr.length; i++) {
      arr[i] = gnodes[i].value();
    }
    labels = jsav.ds.array(arr, {layout: "vertical", left: 555, top: 20});
    jsav.displayInit();
    prim(gnodes[0]);            // Run Prim's algorithm from start node.
    displayMST();
    jsav.recorded();
  }

  function displayMST() {
    var next;
    var edges = mst.edges();
    graph.hide();
    mst.layout();
    jsav.umsg("Complete minimum spanning tree");
  }

  // Mark a node in the graph.
  function markIt(node) {
    node.addClass("visited");
    jsav.umsg("Add node " + node.value() + " to the MST");
    distances.highlight(gnodes.indexOf(node));
    labels.highlight(gnodes.indexOf(node));
    node.highlight();
    jsav.step();
  }

  // Find the unvisited vertex with the smalled distance
  function minVertex() {
    var v;    // The closest node seen so far
    var next; // Current node being looked at
    gnodes.reset();
    for (next = gnodes.next(); next; next = gnodes.next()) {
      if (!next.hasClass("visited")) {
        v = next;
        break;
      }
    }
    for (next = gnodes.next(); next; next = gnodes.next()) {
      if (!(next.hasClass("visited")) && distances.value(next.index) < distances.value(v.index)) {
        v = next;
      }
    }
    //console.log("v is " + v.value() + ", Distance for v is " + distances.value(v.index));
    return v;
  }

  // Compute Prim's algorithm and return edges
  function prim(s) {
    var v;         // The current node added to the MST
    var neighbors = []; // The neighbors of a specific node
    var weight;         // Weight of current edge
    var next, i;

  // Initialize the MST "parents" to dummy values
    for (next = gnodes.next(); next; next = gnodes.next()) {
      next.parent = next;
    }
    distances.value(s.index, 0);
    jsav.umsg("Update the distance value of node " + s.value());
    jsav.step();
    for (i = 0; i < graph.nodeCount(); i++) {
      v = minVertex();
      markIt(v);
      if (distances.value(v.index) === Infinity) {
        jsav.umsg("No other nodes are reachable, so quit.");
        jsav.step();
        return;
      }
      if (v !== s) {
        //Add an edge to the MST
        var edge = graph.getEdge(v.parent, v);
        edge.css({"stroke-width": "4", "stroke": "red"});
        var mstedge = mst.addEdge(mstnodes[v.parent.index], mstnodes[v.index], {"weight": edge.weight()});
        mstedge.css({"stroke-width": "2", "stroke": "red"});
        jsav.umsg("Add edge (" + v.parent.value() + "," + v.value() + ") to the MST");
        jsav.step();
      }
      neighbors = v.neighbors();
      for (var j = 0; j < neighbors.length; j++) {
        if (!neighbors[j].hasClass("visited")) {
          var w = neighbors[j];
          weight = v.edgeTo(w).weight();
          //Update Distances Of neighbors not in the minimum spanning tree
          var msg = "<u>Processing edge (" + v.value() + "," + w.value() + "): </u>";
          if (distances.value(w.index) > weight) {
            w.parent = v;
            distances.value(w.index, weight);
            msg += "Update the distance value of node (" + w.value() + ")";
          }
          else {
            msg += "Leave the distance value of node (" + w.value() + ") unchanged";
          }
          jsav.umsg(msg);
          jsav.step();
        }
      }
    }
  }

  function about() {
    var mystring = "Prim's Algorithm Visualization\nWritten by Mohammed Fawzy and Cliff Shaffer\nCreated as part of the OpenDSA hypertextbook project.\nFor more information, see http://algoviz.org/OpenDSA\nWritten during Spring, 2013\nLast update: March, 2013\nJSAV library version " + JSAV.version();
    alert(mystring);
  }

  // Initialize the graph.
  function initGraph() {

    //Nodes of the original graph
    var a = graph.addNode("A", {"left": 25, "top": 50});
    var b = graph.addNode("B", {"left": 325, "top": 50});
    var c = graph.addNode("C", {"left": 145, "top": 75});
    var d = graph.addNode("D", {"left": 145, "top": 200});
    var e = graph.addNode("E", {"left": 0, "top": 300});
    var f = graph.addNode("F", {"left": 325, "top": 250});
    //Nodes of the MST
    mst.addNode("A", {"left": 25, "top": 50});
    mst.addNode("B", {"left": 325, "top": 50});
    mst.addNode("C", {"left": 145, "top": 75});
    mst.addNode("D", {"left": 145, "top": 200});
    mst.addNode("E", {"left": 0, "top": 300});
    mst.addNode("F", {"left": 325, "top": 250});
    //Original graph edges
    graph.addEdge(a, c, {"weight": 7});
    graph.addEdge(a, e, {"weight": 9});
    graph.addEdge(c, b, {"weight": 5});
    graph.addEdge(c, d, {"weight": 1});
    graph.addEdge(c, f, {"weight": 2});
    graph.addEdge(f, b, {"weight": 6});
    graph.addEdge(d, f, {"weight": 2});
    graph.addEdge(e, f, {"weight": 1});

    gnodes = graph.nodes();
    mstnodes = mst.nodes();
    for (var i = 0; i < mstnodes.length; i++) {
      gnodes[i].index = i;
    }
  }
  // Connect action callbacks to the HTML entities
  $('#about').click(about);
  $('#runit').click(runit);
  //$('#help').click(help);
  $('#reset').click(ODSA.AV.reset);
}(jQuery));
