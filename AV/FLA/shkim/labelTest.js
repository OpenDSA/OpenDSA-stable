(function ($) {
	var jsav = new JSAV("av"),
		saved = false,
		//startState,
		selectedNode = null,
		arr,
		g;
	//Empty string can be set to anything when initializing the graph:
	//e.g. initGraph({layout: "automatic", emptystring: epsilon})
	//By default it is set to lambda.
	var lambda = String.fromCharCode(955),
		epsilon = String.fromCharCode(949),
		square = String.fromCharCode(9633),
		emptystring;
	
	var initGraph = function(opts) {
		g = jsav.ds.fa($.extend({width: '90%', height: 440}, opts));
		emptystring = g.emptystring;
		var gWidth = g.element.width(),
			gHeight = g.element.height();
  		var a = g.addNode({left: 0.10 * gWidth, top: 0.5 * gHeight}),		
      		b = g.addNode({left: 0.35 * gWidth, top: 0.5 * gHeight}),
      		c = g.addNode({left: 0.60 * gWidth, top: 0.5 * gHeight}),
      		d = g.addNode({left: 0.85 * gWidth, top: 0.5 * gHeight});
      	g.makeInitial(a);
      	d.addClass('final');

	    g.addEdge(a, b, {weight: 'a:' + emptystring + ":a"});
	    g.addEdge(a, b, {weight: 'a:' + "a" + ":a"});
	    g.addEdge(a, b, {weight: 'a:' + "b" + ":a"});
	    g.addEdge(a, b, {weight: 'a:' + "c" + ":a"});
	    g.addEdge(a, b, {weight: 'a:' + "d" + ":a"});
	    //g.addEdge(a, d); 		it's a FA, need to always provide a weight

	    g.addEdge(b, b, {weight: 'a:a:aa'});
	    g.addEdge(b, c, {weight: 'b:a:' + emptystring});

	    g.addEdge(c, b, {weight: 'a:a:a'});
	    g.addEdge(c, b, {weight: 'a:b:a'});
	    g.addEdge(c, b, {weight: 'a:c:a'});

	    g.addEdge(c, c, {weight: 'b:a:' + emptystring});
	    g.addEdge(c, d, {weight: 'b:' + emptystring + ':' + emptystring});
	    g.addEdge(d, d, {weight: 'b:' + emptystring + ':' + emptystring});	
	
    	$(".jsavgraph").click(graphClickHandler);
    	g.click(nodeClickHandler);
		g.click(edgeClickHandler, {edge: true});
		$('.jsavedgelabel').click(labelClickHandler);
		return g;
    };

    var labelClickHandler = function(e) {
		if ($(".jsavgraph").hasClass("editNodes") && !$(".jsavgraph").hasClass("working")) {
				$(".jsavgraph").addClass("working");
			var self = this;
				var values = $(this).html().split('<br>');
				var createForm = '<form id="editedgelabel"><select class="labelmenu" id="edgelabelselect" size="' + values.length + '">'
				for (var i = 0; i < values.length; i++) {
					createForm += '<option>' + values[i] + '</option>';
				}
				createForm += '</select><br><input type="button" class="labelmenu" id="changetransitionbutton" value="Change transition"><input type="button" class="labelmenu" id="deletetransitionbutton" value="Delete transition"><input type="button" class="labelmenu" id="donelabelbutton" value="Done"></form>'
			$(createForm).appendTo($('.jsavgraph'));
			var xBound = $('.jsavgraph').offset().left + $('.jsavgraph').width(),
				yBound = $('.jsavgraph').offset().top + $('.jsavgraph').height(),
				xOffset = e.pageX,
				yOffset = e.pageY,
				xWidth = $('#editedgelabel').width(),
				yHeight = $('#editedgelabel').height();
			if (xBound < xOffset + xWidth) {
				xOffset -= xWidth;
			}
			if (yBound < yOffset + yHeight) {
				yOffset -= yHeight;
			}
			$('#editedgelabel').offset({top: yOffset, left: xOffset});
			var changeTransition = function() {
				var x = document.getElementById("edgelabelselect").selectedIndex;
				if (x !== -1) {
					var y = document.getElementById('edgelabelselect').options[x].text;
					var n = prompt("New transition label?", y);
					if (n) {
						var nSplit = n.split(':');
						for (var i = 0; i < nSplit.length; i++) {
							if (nSplit[i] === "") {
								nSplit[i] = emptystring;
							}
						}
						n = nSplit.join(':');
						document.getElementById('edgelabelselect').options[x].innerHTML = n;
					}
				}
			};
			var deleteTransition = function() {
				var x = document.getElementById('edgelabelselect').selectedIndex;
				if (x !== -1) {
					document.getElementById('edgelabelselect').remove(x);
					document.getElementById('edgelabelselect').size--;
					if (document.getElementById('edgelabelselect').size === 0) {
						$('#donelabelbutton').trigger("click");
					}
				}
			};
			var finishEdgeLabel = function() {
				var newVal = [];
				for (var j = 0; j < $('#edgelabelselect > option').length; j++) {
					newVal.push(document.getElementById('edgelabelselect').options[j].text);
				}
				newVal = newVal.join('<br>');
				$(self).html(newVal);
				$('#editedgelabel').remove();
				g.layout({layout: "manual"});
				$('.jsavgraph').removeClass("working");
				updateAlphabet();
			};
			$('#changetransitionbutton').click(changeTransition);
			$('#deletetransitionbutton').click(deleteTransition);
			$('#donelabelbutton').click(finishEdgeLabel);
		}
		};
		var graphClickHandler = function(e) {
		if ($(".jsavgraph").hasClass("addNodes")) {
			var newNode = g.addNode(),
			    nodeX = newNode.element.width()/2.0,
				nodeY = newNode.element.height()/2.0;
			$(newNode.element).offset({top: e.pageY - nodeY, left: e.pageX - nodeX});
		} 
		else if ($('.jsavgraph').hasClass('moveNodes') && selectedNode != null) {
			var nodeX = selectedNode.element.width()/2.0,
				nodeY = selectedNode.element.height()/2.0,
				edges = g.edges();
			$(selectedNode.element).offset({top: e.pageY - nodeY, left: e.pageX - nodeX});
			selectedNode.stateLabelPositionUpdate();
			for (var next = edges.next(); next; next = edges.next()) {
				if (next.start().equals(selectedNode) || next.end().equals(selectedNode)) {
					next.layout();
				}
			}
			selectedNode.unhighlight();
			selectedNode = null;
			e.stopPropagation();
			jsav.umsg("Click a node");
		}
	};
	var nodeClickHandler = function(e) {	
		if ($(".jsavgraph").hasClass("editNodes")) {
			this.highlight();
			var input = prompt("Delete state, make state initial, make state final, or give state a label? d, i, f, or l");
			if (input === null) {
				this.unhighlight();
				return;
			}
			input = input.toUpperCase();
			if (input == 'D') {
				g.removeNode(this);
				updateAlphabet();
			}
			else if (input == 'I') {
				var nodes = g.nodes();
				for (var next = nodes.next(); next; next = nodes.next()) {
					g.removeInitial(next);
				}
				g.makeInitial(this);
			} else if (input == 'F') {
				this.toggleClass('final');
			} 
			//adds labels to states
			else if (input == 'L') {
				var input2 = prompt("Label?");
				if (input2 !== null) {
					this.stateLabel(input2);
					this.stateLabelPositionUpdate();
				}
			}
   			this.unhighlight();
			} else if ($(".jsavgraph").hasClass("addEdges")) {
				this.highlight();
				if (!$(".jsavgraph").hasClass("working")) {
				first = this;
				$('.jsavgraph').addClass("working");
				jsav.umsg("Select a node to make an edge to");
   			} else {
   				var input2 = prompt("Accepted character?");
   				var input3 = prompt('Stack symbol(s) to pop?');
   				var input4 = prompt('Stack symbol(s) to push?');
   				var newEdge;
   				if (!input2) {
   					input2 = emptystring;
   				}
   				if (!input3) {
   					input3 = emptystring;
   				}
   				if (!input4) {
   					input4 = emptystring;
   				}
   				var w = input2 + ':' + input3 + ':' + input4;
				if (input2 != null) {
					newEdge = g.addEdge(first, this, {weight: w});
					if (newEdge) {
						$(newEdge._label.element).click(labelClickHandler);
					}
				} 
				if (!(typeof newEdge === 'undefined')) {
					newEdge.layout();
				}
				$('.jsavgraph').removeClass("working");
				first.unhighlight();
				this.unhighlight();
				updateAlphabet();
				jsav.umsg("Click a node");
   			}
			} else if ($('.jsavgraph').hasClass('moveNodes')) {
				if (selectedNode) {
					selectedNode.unhighlight();
				}
				this.highlight();
				selectedNode = this;
				jsav.umsg("Click to place node");
				e.stopPropagation();
			}
	};
	var edgeClickHandler = function(e) {
		if ($('.jsavgraph').hasClass('editNodes')) {
			this.highlight();
			var input = confirm("Delete edge?");
			if (input === null) {
				this.unhighlight();
				return;
			}
			if (input) {
				g.removeEdge(this);
			}
			updateAlphabet();
			this.unhighlight();
		}
	};
	
	localStorage.clear();
    var g = initGraph({layout: "manual"});
		g.layout();
		jsav.displayInit();

		//===============================
		var updateAlphabet = function() {
			g.updateAlphabet();
		$("#alphabet").html("" + Object.keys(g.alphabet).sort());
	};
	updateAlphabet();
		//===============================
		//editing modes

		var addNodesMode = function() {
			removeEdgeSelect();
			removeLabelMenu();
			$(".jsavgraph").removeClass("working");
			$(".jsavgraph").removeClass("addEdges");
			$(".jsavgraph").removeClass("moveNodes");
			$(".jsavgraph").removeClass("editNodes");
			$(".jsavgraph").addClass("addNodes");
			$("#mode").html('Adding nodes');
			jsav.umsg("Click to add nodes");
		};
		var addEdgesMode = function() {
			removeEdgeSelect();
			removeLabelMenu();
			$(".jsavgraph").removeClass("working");
			$(".jsavgraph").removeClass("addNodes");
			$(".jsavgraph").removeClass("moveNodes");
			$(".jsavgraph").removeClass("editNodes");
			$(".jsavgraph").addClass("addEdges");
			$("#mode").html('Adding edges');
			jsav.umsg("Click a node");
		};
		var moveNodesMode = function() {
			removeEdgeSelect();
			removeLabelMenu();
			$(".jsavgraph").removeClass("working");
			$(".jsavgraph").removeClass("addNodes");
			$(".jsavgraph").removeClass("addEdges");
			$(".jsavgraph").removeClass("editNodes");
			$(".jsavgraph").addClass("moveNodes");
			$("#mode").html('Moving nodes');
			jsav.umsg("Click a node");
		};
		var editNodesMode = function() {
			$(".jsavgraph").removeClass("working");
			$(".jsavgraph").removeClass("addNodes");
			$(".jsavgraph").removeClass("addEdges");
			$(".jsavgraph").removeClass("moveNodes");
			$(".jsavgraph").addClass("editNodes");
			$("#mode").html('Editing nodes and edges');
			addEdgeSelect();
			jsav.umsg("Click a node or edge");
		};
		var changeEditingMode = function() {
			removeLabelMenu();
			$(".jsavgraph").removeClass("working");
			$(".jsavgraph").removeClass("addNodes");
			$(".jsavgraph").removeClass("addEdges");
			$(".jsavgraph").removeClass("moveNodes");
			$('.jsavgraph').removeClass('editNodes');
			removeEdgeSelect();
			$("#mode").html('Editing');
			if ($(".notEditing").is(":visible")) {
				$('#changeButton').html('Done editing');
			} else {
				$('#changeButton').html('Edit');
			}
			$('.notEditing').toggle();
			$('.editing').toggle();
		};

		var addEdgeSelect = function () {
			var edges = g.edges();
			for (var next = edges.next(); next; next= edges.next()) {
				next.addClass('edgeSelect');
				next.layout();
			}
		};
		var removeEdgeSelect = function () {
			var edges = g.edges();
			for (var next = edges.next(); next; next = edges.next()) {
				if (next.hasClass('edgeSelect')) {
					next.removeClass('edgeSelect');
					next.layout();
				}
			}
		};
		var removeLabelMenu = function() {
			if ($('#editedgelabel')) {
				$('#editedgelabel').remove();
			}
		};

		//====================
		//tests

		var testND = function() {
			$('#changeButton').toggleClass("highlightingND");
			if ($('#changeButton').hasClass("highlightingND") || $('#changeButton').hasClass("highlightingL")) {
				$('#changeButton').hide();
			} else{
				$('#changeButton').show();
			}
			var nodes = g.nodes();
			for(var next = nodes.next(); next; next = nodes.next()) {
				var edges = next.getOutgoing();
				var weights = _.map(edges, function(e) {return e.weight().split('<br>')});
				for (var i = 0; i < weights.length; i++) {
					var findLambda = _.find(weights[i], function(e) {return e.split(':')[0] === emptystring});
					if (findLambda) { break; }
				}
				var dup = _.map(_.flatten(weights), function(e) {return _.initial(e.split(':')).join()})
			if (findLambda || _.uniq(dup).length < dup.length) {
				next.toggleClass('testingND');
			}
			}
		};
		var testLambda = function() {
			$('#changeButton').toggleClass("highlightingL");
			if ($('#changeButton').hasClass("highlightingND") || $('#changeButton').hasClass("highlightingL")) {
				$('#changeButton').hide();
			} else{
				$('#changeButton').show();
			}
			var edges = g.edges();
			for (var next = edges.next(); next; next = edges.next()) {
				wSplit = next.weight().split('<br>');
				for (var i = 0; i < wSplit.length; i++) {
					if (_.every(wSplit[i].split(':'), function(x) {return x === emptystring})) {
						next.g.element.toggleClass('testingLambda');
						break;
					}
				}
			}
		};


	//====================
	//temp:

	var play = function() {
		jsav.umsg("");
		var textArray = [];
		$("button").hide();			//disable buttons
		$("#mode").html('');
		if (arr) {
			arr.clear();
			}
			$('.jsavcontrols').show();
		var inputString = prompt("Input string?", "abb");
		if (inputString == null) {
			return;
		}

		var currentState = g.initial,
			cur;
		currentState.addClass('current');
		for (var i = 0; i < inputString.length; i++) {
			textArray.push(inputString[i]);
			}
			arr = jsav.ds.array(textArray, {element: $('.arrayPlace')});

			jsav.displayInit();

		for (var i = 0; i < inputString.length; i++) {
		   	cur = g.takePushdownTransition(currentState, inputString[i]);
		   	if (cur == null) {
		   		arr.css(i, {"background-color": "red"});
		   		jsav.step();
		   		break;
		   	}
		   	currentState.removeClass('current');
			currentState = cur;
			currentState.addClass('current');
			arr.css(i, {"background-color": "yellow"});
			jsav.step();
		}
		if (currentState.hasClass('final') && cur != null) {
				arr.css(inputString.length - 1, {"background-color": "green"});
				jsav.umsg("Accepted");
		} else {
			//arr.css(inputString.length - 1, {"background-color": "red"});
			jsav.umsg("Rejected");
		}
		jsav.step();
		jsav.recorded();	
	};

	//======================
	$('#playbutton').click(play);
	$('#layoutbutton').click(function() {g.layout()});
	$('#testNDbutton').click(testND);
	$('#testlambdabutton').click(testLambda);
	$('#addnodesbutton').click(addNodesMode);
	$('#changeButton').click(changeEditingMode);
	$('#addedgesbutton').click(addEdgesMode);
	$('#movenodesbutton').click(moveNodesMode);
	$('#editnodesbutton').click(editNodesMode);
}(jQuery));	