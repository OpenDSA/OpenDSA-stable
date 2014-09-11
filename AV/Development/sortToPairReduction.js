"use strict";
/*global alert: true, ODSA */

(function ($) {
  var jsav;
  var input;
  var iparr;
  var pair1;
  var pair2;
  var pair11;
  var pair21;
  var pairs;
  var oparr;
  var paired;
  var line1;

function runit() {
  ODSA.AV.reset(true);
  jsav = new JSAV($('.avcontainer'));

  jsav.umsg("Sorting of a given array by reducing it to Pairing problem");
  jsav.displayInit();
  jsav.step();

  input = new Array(23,42,17,93,88,12,57,90);
  iparr = jsav.ds.array(input,  {left: 200, top: -8});
  jsav.umsg("Sorting of a given array by reducing it to Pairing problem");
  jsav.label("<b>Array to be sorted</b>",{left: 250, top: -28});
  jsav.step();

  var l1= jsav.g.line(320,45,320,75);
  l1.show();
  jsav.umsg("Transformation step to reduce into pairing problem");
  jsav.label("<b>Transformation (Cost=O(n))</b>",{left: 340, top: 35});
  var r1 = jsav.g.rect(50,75,600,80);
  r1.show();
  jsav.step();

  jsav.umsg("The input array and an array of equal size as the input array (Referred to as Position array here) is given as an input to the Pairing problem. The Position array contains a value \"k\" at the \"k\"th index");
  pair1 = jsav.ds.array([0,1,2,3,4,5,6,7],  {left: 70 , top: 80});
  jsav.label("Position array",{left: 100, top: 70});
  pair2 = jsav.ds.array(input,  {left: 370, top: 80});
  jsav.label("Input array",{left: 450, top: 70});
  jsav.step();

  jsav.umsg("The two arrays are fed into the Pairing problem as input");
  jsav.label("<b>Pairing</b>",{left: 240, top: 150});
  var l2= jsav.g.line(220,155,220,200);
  l2.show();
  var r2 = jsav.g.rect(90,200,280,130);
  r2.show();
  jsav.step();

  jsav.umsg("Pairing problem is to be solved on the two arrays");
  pair11 = jsav.ds.array([0,1,2,3,4,5,6,7],  {left: 100 , top: 190});
  pair21 = jsav.ds.array(input,  {left: 100, top: 260});
  jsav.step();
 
  jsav.umsg("Pairing problem is solved on the two arrays");
  pairs = new Array([23,2],[42,3],[17,1],[93,7],[88,5],[12,0],[57,4],[90,6]);
  var pairing = new Array();
  for(var i=0;i<8;i++){
	var x2=i*30+115;
	var x1=pairs[i][1]*30+115;
	pairing[i]=jsav.g.line([x1,245,x2,280]);
	pairing[i].show();
	
  }
  jsav.step();
	 
  jsav.umsg("Pairing problem is solved on the two arrays");
  var l3= jsav.g.line(370,220,420,220);
  l3.show();
  jsav.label("<b>Pairs generated</b>",{left: 470, top:165});
  paired = jsav.ds.array(pairs,{left: 420, top: 180});
  jsav.step();

 
  jsav.umsg("Reverse transformation is performed on the output of the Pairing problem.");
  jsav.umsg("In each pair, the second element specifies the index of the output array ");
  jsav.umsg("where the first element is to be placed.");
  var l4= jsav.g.line(540,235,540,290);
  l4.show();
  jsav.label("<b>Reverse Transformation Cost=O(n)</b>",{left: 560,top: 225});
  var r1 = jsav.g.rect(410,290,270,80);
  r1.show();
  oparr= jsav.ds.array([" "," "," "," "," "," "," "," "],  {left: 420, top: 290});
  jsav.step();

  jsav.step();
  oparr.show();
  var curr;
  for(var i=0;i<8;i++){
	if(i>0){
        	paired.unhighlight(i-1);
        	oparr.unhighlight(curr);
		//oparr.css(curr,{"background-color":"ForestGreen"});
	}
	var str=paired.value(i)+",";
	var arr=str.split(",");
	curr=arr[1];
	curr=curr*1;
        oparr.value(curr,arr[0]);
        paired.highlight(i);
        oparr.highlight(curr);
	jsav.umsg("Placing "+arr[0]+" at "+curr);
	jsav.step()
  }
  paired.unhighlight(i-1);
  oparr.unhighlight(curr);
  jsav.umsg("The output array gives the sorted array" );
  jsav.step();
  var l5= jsav.g.line(540,370,540,400);
  l4.show();
  var l6= jsav.g.line(350,400,540,400);
  l4.show();
  jsav.label("<b>Output</b>",{left: 200,top: 350});
  var op= jsav.ds.array([" "," "," "," "," "," "," "," "],  {left: 100, top: 365});
  for(var i=0;i<8;i++)
  	op.value(i,oparr.value(i)); 
  jsav.umsg("Total cost of sorting = O(n) + Cost of Pairing");
  jsav.step();
  jsav.recorded();
}

function about() {
  alert("Reduction visualization");
}
  

// Connect action callbacks to the HTML entities
$('#about').click(about);
$('#runit').click(runit);
$('#help').click(help);
$('#reset').click(ODSA.AV.reset);
}(jQuery));
