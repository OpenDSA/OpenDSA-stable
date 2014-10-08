/*global ODSA */
"use strict";
// Sequential Tree serialization visualization slideshow
$(document).ready(function () {
  var av_name = "SequentialTreeCON";
  var av = new JSAV(av_name);
  var temp1;
  var msg = av.label(" A B / D / / C E G / / / F H / / I / /",{bottom: 50});
  var bt = av.ds.binarytree({visible: true, nodegap: 35});
  bt.root('A');
  var cur = av.g.rect(0, 338,13, 25);
  var a = bt.root();
  bt.layout();

  var ptr = av.pointer("rt", a, {anchor: "middle top", top: -10});

  //Slide 1
  av.umsg("We begin with the first node in the string 'A' which will be the root node");
  av.displayInit();

  //Slide 2
  av.umsg("The next character in the serialized string represents A's left child");
  cur.hide();
  var cur = av.g.rect(12, 338,13, 25);
  av.step();

  //Slide 3
  av.umsg("We insert B as the left child of A");
  a.left('B'); //<--- HERE IS THE LINE IN QUESTION
  var b = a.left();
  bt.layout();
  ptr.target(b);
  av.step();

  //Slide 4
  av.umsg("The next character in the serialized string says B has no left child ('/') ");
  cur.hide();
  var cur = av.g.rect(24, 338,13, 25);
  av.step();

  //Slide 5
  av.umsg("The next token 'D' is the right child of 'B' ");
  var d = a.left().right('D');
  bt.layout();
  ptr.target(d);
  cur.hide();
  var cur = av.g.rect(36, 338,13, 25);
  //point to D
  av.step();

  //Slide 6
  cur.hide();
  var cur = av.g.rect(49, 338,18, 25);
  av.umsg("The two slashes imply D has no children and is a leaf node");
  av.step();

  //Slide 7
  av.umsg("We pop back up to the parent of D");
  //point to B
  ptr.target(b);
  av.step();

  //Slide 8
  av.umsg("Since we have already processed both of B's children, we continue popping up to the root.");
  //point to A
  ptr.target(a);
  av.step();

  //Slide 9
  av.umsg("The next character in the string represents A's right child 'C' ");
  var c = a.right('C');
  bt.layout();
  ptr.target(c);
  cur.hide();
  var cur = av.g.rect(68, 338,13, 25);
  //point to C
  av.step();

  //Slide 10
  av.umsg("'E' must be C's left child");
  var e = a.right().left('E');
  bt.layout();
  ptr.target(e);
  cur.hide();
  var cur = av.g.rect(82, 338,13, 25);
  //point to E
  av.step(); 

  //Slide 11
  av.umsg("The next character 'G' represents E's left child");
  var g = a.right().left().left('G');
  bt.layout();
  ptr.target(g);
  cur.hide();
  var cur = av.g.rect(97, 338,13, 25);
  //point to G
  av.step();

  //Slide 12
  av.umsg("Double slashes implies G has no children");
  cur.hide();
  var cur = av.g.rect(112, 338,17, 25);
  av.step();

  //Slide 13
  av.umsg("Pop back up to G's parent ('E') ");
  ptr.target(e);
  //point to E
  av.step(); 

  //Slide 14
  av.umsg("The next character in the serialized string ('/') represents E's right child");
  cur.hide();
  var cur = av.g.rect(126, 338,13, 25);
  av.step();

  //Slide 15
  av.umsg("It is a slash, so no right child for E");
  av.step();  

  //Slide 16
  av.umsg("We pop back up to E's parent ('C') ");
  ptr.target(c);
  //point to C
  av.step();  

  //Slide 17
  av.umsg("F represents C's right child");
  var f = a.right().right('F');
  bt.layout();
  ptr.target(f);
  cur.hide();
  var cur = av.g.rect(138, 338,13, 25);
  //point to F
  av.step();

  //Slide 18
  av.umsg("H represents F's left child");
  var h = a.right().right().left('H');
  bt.layout();
  ptr.target(h);
  cur.hide();
  var cur = av.g.rect(152, 338,13, 25);
  //point to H
  av.step();

  //Slide 19
  av.umsg("Double slash implies H is a leaf node with no children. Pop back up to F");
  ptr.target(f);
  cur.hide();
  var cur = av.g.rect(165, 338,17, 25);
  av.step();

  //Slide 20
  av.umsg("I must be the right child of F");
  var i = a.right().right().right('I');
  bt.layout();
  ptr.target(i);
  //point to I
  cur.hide();
  var cur = av.g.rect(181, 338,11, 25);
  av.step();

  //Slide 21
  av.umsg("Double slashes implies I is a leaf node with no children");
  cur.hide();
  var cur = av.g.rect(191, 338,17, 25);
  av.step();
  av.recorded();

});
