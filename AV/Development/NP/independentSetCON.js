//Written by Nabanita Maji and Cliff Shaffer
/*global ODSA, setPointerL */
 "use strict";
$(document).ready(function () {
  var av_name = "independentSetCON";

    $(".avcontainer").on("jsav-message" ,  function() {
      // invoke MathJax to do conversion again
      MathJax.Hub.Queue(["Typeset" , MathJax.Hub]);
    });
    $(".avcontainer").on("jsav-updatecounter" ,  function(){
      // invoke MathJax to do conversion again 
     MathJax.Hub.Queue(["Typeset" , MathJax.Hub]); });

  // Load the config object with interpreter and code created by odsaUtils.js
  var config = ODSA.UTILS.loadConfig({"av_name": av_name}),
      interpret = config.interpreter,       // get the interpreter
      code = config.code;                   // get the code object
  var av = new JSAV(av_name);
 
  var label1, label2 , label3, label4, label5, label6,label7,label8,label9;
  //slide2
  var y = 0;

    av.umsg("<br><b>Introduction to the Independent Set Problem </b>");
    var nl1=av.label("This slideshow introduces and explains the \""+
"Independent Set\" Problem.</b> <br><br><br> We start with some "+
"definitions  and background.",{top:0});


    av.displayInit();

    av.step();

  av.umsg("<br><b>Independent Set</b>"); 
  nl1.hide();
  nl1=av.label("An Independent Set of a graph is a set of vertices such "+
"that no two of them are connected <br>i.e. there exists no edge between any two "+
"vertices of an Independent Set.",{top:-10}); 

  av.step();

  var nl2=av.label("The largest possible Independent Set of a graph is called "+
"the \"Maximum Independent Set\".",{top:50}); 

  av.step();
  

  var  g = av.ds.graph({width: 400, height: 450,layout: "manual", directed: false,left:200,top:100});
  var x=70;
  y=0;
  var c1 = g.addNode("1", {"left": x-70, "top": y+20});
  var c2 = g.addNode("2", {"left": x+35, "top": y+20});
  var c3 = g.addNode("3", {"left": x+160,"top": y+20});
  var c4 = g.addNode("4", {"left": x-70, "top": y+120});
  var c5 = g.addNode("5", {"left": x+35, "top": y+120});
  var c6 = g.addNode("6", {"left": x+160, "top": y+120});
  var c7 = g.addNode("7", {"left": x+35, "top": y+200});
  
 
  var e1 = g.addEdge(c1, c2);
  var e2 = g.addEdge(c1, c4);
  var e3 = g.addEdge(c2, c3);
  var e4 = g.addEdge(c2, c5);
  var e5 = g.addEdge(c6, c7);
  var e6 = g.addEdge(c5, c6);
  var e7 = g.addEdge(c3, c6);
  var e8 = g.addEdge(c4, c7);

  c3.css({"background-color":"Brown"});
  e3.css({"stroke":"Brown","stroke-width":"2"});
  e7.css({"stroke":"Brown","stroke-width":"2"});

  c1.css({"background-color":"#669966"});
  e1.css({"stroke":"#669966","stroke-width":"2"});
  e4.css({"stroke":"#669966","stroke-width":"2"});

  c5.css({"background-color":"#996699"});
  e4.css({"stroke":"#996699","stroke-width":"2"});
  e6.css({"stroke":"#996699","stroke-width":"2"});

  c7.css({"background-color":"PaleVioletRed"});
  e5.css({"stroke":"PaleVioletRed","stroke-width":"2"});
  e8.css({"stroke":"PaleVioletRed","stroke-width":"2"});

  g.layout();
  g.show(); 

   av.step();
   label1 = av.label("The colored vertices in this graph form an independent set."
,{left:500,top: 150}); 
   label2 = av.label("The Independent set is {$1, 3, 5, 7$}",{left:500,top: 200}); 

   av.step();
 y=0;
 g.hide(); 
   nl1.hide();
   nl2.hide();
 label1.hide();
 label2.hide();
  av.umsg("<br><b>Example of Independent Set in graph </b>");
  nl1=av.label("The following graph contains an Independent Set of size $3$."+
" (i.e. {$2,4,5$})",{top:0}); 
 
  x=0;
  y=0;

  var  g2 = av.ds.graph({width: 400, height: 450,layout: "manual", directed: false,top:50,left:200});
  var cb1 = g2.addNode("1", {"left": x+50, "top": y+50});
  var cb2 = g2.addNode("2", {"left": x+50, "top": y+250});
  var cb3 = g2.addNode("3", {"left": x+250,"top": y+250});
  var cb4 = g2.addNode("4", {"left": x+250, "top": y+50});
  var cb5 = g2.addNode("5", {"left": x+150, "top": y+150});
  
 
  var eb1 = g2.addEdge(cb1, cb2);
  var eb2 = g2.addEdge(cb2, cb3);
  var eb3 = g2.addEdge(cb3, cb4);
  var eb4 = g2.addEdge(cb4, cb1);
  var eb5 = g2.addEdge(cb5, cb1);
  var eb6 = g2.addEdge(cb3, cb5);

  cb2.css({"background-color":"Brown"});
  eb1.css({"stroke":"Brown","stroke-width":"2"});
  eb2.css({"stroke":"Brown","stroke-width":"2"});

  cb4.css({"background-color":"#669966"});
  eb3.css({"stroke":"#669966","stroke-width":"2"});
  eb4.css({"stroke":"#669966","stroke-width":"2"});

  cb5.css({"background-color":"#996699"});
  eb6.css({"stroke":"#996699","stroke-width":"2"});
  eb5.css({"stroke":"#996699","stroke-width":"2"});

  g2.layout();
  g2.show();

 av.step();


   av.umsg("<br><b>Example of Independent Set in graph </b>");
   g2.hide();

  y=0;
  nl1.hide(); 
  nl1=av.label("The following graph contains an Independent Set"
+" of size $5$. ( i.e. {$2,3,4,6,10$} ) ",{top:-10}); 

  x=70;
  y=-10;
  var  g1 = av.ds.graph({width: 400, height: 450,layout: "manual", directed: false,top:70,left:200});

  var ca1 = g1.addNode("1", {"left": x+100, "top": y+70});
  var ca2 = g1.addNode("2", {"left": x-70, "top": y+160});
  var ca3 = g1.addNode("3", {"left": x+190,"top": y+125});
  var ca4 = g1.addNode("4", {"left": x+35, "top": y+160});
  var ca5 = g1.addNode("5", {"left": x+165, "top": y+250});
  var ca6 = g1.addNode("6", {"left": x+100, "top": y+10});
  var ca7 = g1.addNode("7", {"left": x-70, "top": y+80});
  var ca8 = g1.addNode("8", {"left": x+300, "top": y+20});
  var ca9 = g1.addNode("9", {"left": x-45, "top": y+240});
  var ca10 = g1.addNode("10", {"left": x+300, "top": y+200});
  
 
  var ea1 = g1.addEdge(ca1, ca6);
  var ea2 = g1.addEdge(ca1, ca4);
  var ea4 = g1.addEdge(ca2, ca7);
  var ea5 = g1.addEdge(ca1, ca3);
  var ea6 = g1.addEdge(ca7, ca4);
  var ea7 = g1.addEdge(ca3, ca8);
  var ea8 = g1.addEdge(ca3, ca5);
  var ea9 = g1.addEdge(ca4, ca9);
  var ea10 = g1.addEdge(ca5, ca10);

  var ea11 = g1.addEdge(ca6, ca8);
  var ea12 = g1.addEdge(ca6, ca7);
  var ea13 = g1.addEdge(ca2, ca9);
  var ea14 = g1.addEdge(ca8, ca10);
  var ea3 = g1.addEdge(ca5, ca4);


  ca6.css({"background-color":"Brown"});
  ea1.css({"stroke":"Brown","stroke-width":"2"});
  ea11.css({"stroke":"Brown","stroke-width":"2"});
  ea12.css({"stroke":"Brown","stroke-width":"2"});

  ca2.css({"background-color":"#669966"});
  ea4.css({"stroke":"#669966","stroke-width":"2"});
  ea13.css({"stroke":"#669966","stroke-width":"2"});


  ca4.css({"background-color":"#FFCC66"});
  ea2.css({"stroke":"#FFCC66","stroke-width":"2"});
  ea9.css({"stroke":"#FFCC66","stroke-width":"2"});
  ea6.css({"stroke":"#FFCC66","stroke-width":"2"});
  ea3.css({"stroke":"#FFCC66","stroke-width":"2"});



  ca3.css({"background-color":"#996699"});
  ea7.css({"stroke":"#996699","stroke-width":"2"});
  ea8.css({"stroke":"#996699","stroke-width":"2"});
  ea5.css({"stroke":"#996699","stroke-width":"2"});



  ca10.css({"background-color":"#00CCCC"});
  ea10.css({"stroke":"#00CCCC","stroke-width":"2"});
  ea14.css({"stroke":"#00CCCC","stroke-width":"2"});


  g1.layout();
  g1.show();


 //slide 5 
    av.step();
    nl1.hide();
    g1.hide();
    av.umsg("<br><b>The Independent Set Problem </b>");
    nl1=av.label("The Independent Set Problem can be defined as either "
+"of the following: <br><br><br><b>Given a graph $G = (V , E)$, find "
+"the Maximum Independent Set in $G$.</b><br><br><br>Or<br><br><br><b>"
+"Given a graph $G = (V , E)$, and a number $k$, does $G$ contain an "
+"Independent Set of size >= $k$ ?</b>",{top:0});


//silde 6 
  av.step();
  nl1.hide();
  y=0;


  label1.hide();

  av.umsg("<br><b>Example of Independent Set Problem: </b>");  

  nl1=av.label("Does the graph below have an independent set of size >=$9$ ?",{top:-10}); 
  x=70;
  y=20;

  var  g4 = av.ds.graph({width: 400, height: 450,layout: "manual", directed: false,top:40,left:200});
  var cc1 = g4.addNode("1", {"left": x+100, "top": y+70});
  var cc2 = g4.addNode("2", {"left": x+10, "top": y+125});
  var cc3 = g4.addNode("3", {"left": x+190,"top": y+125});
  var cc4 = g4.addNode("4", {"left": x+35, "top": y+200});
  var cc5 = g4.addNode("5", {"left": x+165, "top": y+200});
  var cc6 = g4.addNode("6", {"left": x+100, "top": y-20});
  var cc7 = g4.addNode("7", {"left": x-50, "top": y+30});
  var cc8 = g4.addNode("8", {"left": x+250, "top": y+30});
  var cc9 = g4.addNode("9", {"left": x-45, "top": y+250});
  var cc10 = g4.addNode("10", {"left": x+245, "top": y+250});
  var cc11 = g4.addNode("11", {"left": x-70, "top": y+180});
  
 
  var ec1 = g4.addEdge(cc1, cc6);
  var ec2 = g4.addEdge(cc1, cc4);
  var ec3 = g4.addEdge(cc1, cc5);
  var ec4 = g4.addEdge(cc2, cc7);
  var ec5 = g4.addEdge(cc2, cc3);
  var ec6 = g4.addEdge(cc2, cc5);
  var ec7 = g4.addEdge(cc3, cc1);
  var ec10 = g4.addEdge(cc5, cc10);
  var ec11 = g4.addEdge(cc2, cc6);
  var ec12 = g4.addEdge(cc2, cc9);
  var ec13 = g4.addEdge(cc3, cc6);
  var ec14 = g4.addEdge(cc3, cc10);
  var ec16 = g4.addEdge(cc4, cc10);
  var ec17 = g4.addEdge(cc10, cc9);
  var ec19 = g4.addEdge(cc1, cc7);
  var ec20 = g4.addEdge(cc1, cc8);
  var ec21 = g4.addEdge(cc11, cc9);
  var ec22 = g4.addEdge(cc11, cc7);
  var ec8 = g4.addEdge(cc10, cc8);


  g4.layout();
  g4.show();

//slide 7 
  av.step();

  y=0;

  nl2=av.label("<b>No</b>",{top:40}); 

  av.step(); 
  nl1.hide();
  nl2.hide();

  av.umsg("<br><b>Example of Independent Set Problem: </b>");  

  nl1=av.label("Does the graph below have an independent set of size >=$7$ ?",{top:-10}); 

//slide 9

  av.step();

  y=0;

  nl2=av.label("<b>Yes</b>",{top:40}); 


  cc4.css({"background-color":"Chocolate"});
  ec2.css({"stroke":"Chocolate" ,"stroke-width":"2"});
  ec16.css({"stroke":"Brown" ,"stroke-width":"2"});

  cc9.css({"background-color":"#669966"});
  ec12.css({"stroke":"#669966" ,"stroke-width":"2"});
  ec17.css({"stroke":"#669966" ,"stroke-width":"2"});
  ec21.css({"stroke":"#669966" ,"stroke-width":"2"});


  cc5.css({"background-color":"#996699"});
  ec3.css({"stroke":"#996699" ,"stroke-width":"2"});
  ec6.css({"stroke":"#996699" ,"stroke-width":"2"});
  ec10.css({"stroke":"#996699" ,"stroke-width":"2"});


  cc8.css({"background-color":"IndianRed"});
  ec20.css({"stroke":"IndianRed" ,"stroke-width":"2"});
  ec8.css({"stroke":"IndianRed" ,"stroke-width":"2"});


  cc6.css({"background-color":"Silver"});
  ec1.css({"stroke":"Silver" ,"stroke-width":"2"});
  ec11.css({"stroke":"Silver" ,"stroke-width":"2"});
  ec13.css({"stroke":"Silver" ,"stroke-width":"2"});

  cc7.css({"background-color":"Teal"});
  ec22.css({"stroke":"Teal" ,"stroke-width":"2"});
  ec4.css({"stroke":"Teal" ,"stroke-width":"2"});
  ec19.css({"stroke":"Teal" ,"stroke-width":"2"});

  cc3.css({"background-color":"SlateBlue"});
  ec7.css({"stroke":"SlateBlue" ,"stroke-width":"2"});
  ec5.css({"stroke":"SlateBlue" ,"stroke-width":"2"});
  ec14.css({"stroke":"SlateBlue" ,"stroke-width":"2"});
  g4.show();
  av.recorded();
});

