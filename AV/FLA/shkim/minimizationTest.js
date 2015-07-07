(function ($) {
	var getLeaves = function(node) {
		var arr = [];
		if (node.childnodes == false) {
			return arr.concat([node.value()]);
		} else { 
			for (var i = 0; i < node.childnodes.length; i++) {
				arr = arr.concat(getLeaves(node.child(i)));
			}
			return arr;
		}
	};
	var settings = new JSAV.utils.Settings($('.jsavsettings'));
    // settings.add("speed", {"type": "range",
      //                  "value": "10",
      //                  "min": 1,
      //                  "max": 10,
      //                  "step": 1});
	var jsav = new JSAV("av", {"settings": settings}),
		input,
		selectedNode = null,
		expanded,
		g1,		//reference (original DFA); assumes its a DFA
		g,		//working conversion
		bt,		//tree
		alphabet,
		partitions = [],
		checkNodeArr = [],
		minimizedEdges = {};	//adjlist of minimized DFA
	
	var lambda = String.fromCharCode(955),
		epsilon = String.fromCharCode(949);

	function initGraph() {
		var graph = jsav.ds.fa({width: '45%', height: 440, layout: 'manual', element: $('#reference')});
		var gWidth = graph.element.width();
		var a = graph.addNode({left: 0.05*gWidth, top: 50}),		
      		b = graph.addNode({left: 0.2*gWidth, top: 300}),
      		c = graph.addNode({left: 0.2*gWidth, top: 10}),
      		d = graph.addNode({left: 0.85*gWidth, top: 30}),
      		e = graph.addNode({left: 0.25*gWidth, top: 200}),
      		f = graph.addNode({left: 0.1*gWidth, top: 370}),
      		h = graph.addNode({left: 0.55*gWidth, top: 300}),
      		i = graph.addNode({left: 0.55*gWidth, top: 100}),
      		j = graph.addNode({left: 0.85*gWidth, top: 350});

      	graph.makeInitial(a);
      	d.addClass("final");
      	h.addClass('final');
      	j.addClass('final');

	    graph.addEdge(a, f, {weight: 'a'});
	    graph.addEdge(a, c, {weight: 'b'});
	    graph.addEdge(b, e, {weight: 'a'});
	    graph.addEdge(b, a, {weight: 'b'});
	    graph.addEdge(c, d, {weight: 'a'});
	    graph.addEdge(c, e, {weight: 'b'});
	    graph.addEdge(d, i, {weight: 'b'});
	    graph.addEdge(d, j, {weight: 'a'});
	    graph.addEdge(e, a, {weight: 'b'});
	    graph.addEdge(e, i, {weight: 'a'});
	    graph.addEdge(f, b, {weight: 'b'});
	    graph.addEdge(f, j, {weight: 'a'});
	    graph.addEdge(h, h, {weight: 'a'});
	    graph.addEdge(h, b, {weight: 'b'});
	    graph.addEdge(i, a, {weight: 'b'});
	    graph.addEdge(i, e, {weight: 'a'});
	    graph.addEdge(j, h, {weight: 'a'});
	    graph.addEdge(j, i, {weight: 'b'});
		graph.layout();
		a.stateLabelPositionUpdate();
		graph.updateAlphabet();
			alphabet = Object.keys(graph.alphabet).sort();
		$("#alphabet").html("" + alphabet);

		graph.click(refClickHandlers);
		return graph;
	};

	function initialize() {
		if (bt) {
			//g.clear();		this doesn't seem to work
			$('#editable').empty();
		}
		bt = jsav.ds.tree();
		var val = [],
			finals = [],
			nonfinals = [];
		var reachable = [g1.initial];
		dfs(reachable, g1.initial);
		for (var i = 0; i < reachable.length; i++) {
			val.push(reachable[i].value());
			if (reachable[i].hasClass('final')) {
				finals.push(reachable[i].value());
			} else {
				nonfinals.push(reachable[i].value());
			}
		}
		bt.root(val.sort().join());
		//bt.layout();
		bt.root().child(0, nonfinals.sort().join());
		bt.root().child(1, finals.sort().join());
		bt.root().child(1).addClass('final');
		bt.layout();
		bt.click(treeClickHandlers);
		return bt;
	};

	function done() {
		if (selectedNode) {
			selectedNode.unhighlight();
			selectedNode = null;
		}
		unhighlightAll(g1);
		var leaves = getLeaves(bt.root());
		for (var i = 0; i < leaves.length; i++) {
			var leaf = leaves[i].split(',');
			for (var k = 0; k < alphabet.length; k++) {
				var dArr = [],
					letter = alphabet[k];
				for (var j = 0 ; j < leaf.length; j++) {
					var node = g1.getNodeWithValue(leaf[j]);
					var next = g1.transitionFunction(node, letter);
					
					dArr.push(next[0]);
				}
				if (!_.find(leaves, function(v){return _.difference(dArr, v.split(',')).length === 0})) {
					jsav.umsg("There are distinguishable states remaining");
					return;
				}
			}
		}

		$('.split').hide();
		$('#autobutton').hide();
		$('.hide').show();
		$('#editable').empty();
		var graph = jsav.ds.fa({width: '45%', height: 440, layout: 'automatic', element: $('#editable')});
		for (var i = 0; i < leaves.length; i ++) {
			var node = graph.addNode();
			node.stateLabel(leaves[i]);
			var leaf = leaves[i].split(',');
			for (var j = 0; j < leaf.length; j++) {
				var n = g1.getNodeWithValue(leaf[j]);
				if (n.equals(g1.initial)) {
					graph.makeInitial(node);
					break;
				}
				else if (n.hasClass('final')) {
					node.addClass('final');
					break;
				}
			}
		}
		var edges = g1.edges();
		for (var next = edges.next(); next; next = edges.next()) {
			//get nodes make edges
			var ns = next.start().value(),
				ne = next.end().value(),
				nodes = graph.nodes(),
				node1, 
				node2;
			for (var next2 = nodes.next(); next2; next2 = nodes.next()) {
				if (next2.stateLabel().split(',').indexOf(ns) !== -1) {
					node1 = next2;
				} 
				if (next2.stateLabel().split(',').indexOf(ne) !== -1) {
					node2 = next2;
				}
			}
			//graph.addEdge(node1, node2, {weight: next.weight()});
			if(!minimizedEdges.hasOwnProperty(node1.value())) {
				minimizedEdges[node1.value()] = [];
			}
			minimizedEdges[node1.value()] = _.union(minimizedEdges[node1.value()], 
					[""+node2.value()+','+next.weight()])
		}
		graph.layout();
		
		$("#editable").click(graphClickHandlers);
		graph.click(nodeClickHandlers);
		jsav.umsg("Finish the DFA");
		g = graph;
		return graph;
	};
	

	var refClickHandlers = function(e) {
		if (selectedNode && $('#editable').hasClass('working')) {
			if (!_.contains(partitions.join().split(','), this.value())) {
				alert('The group being split does not contain ' + this.value());
				return;
			}
			var values = selectedNode.value().split(',');
			if (selectedNode.value() === "") {
				selectedNode.value(this.value());
			} else if (_.contains(values, this.value())) {
				selectedNode.value(_.without(values, this.value()).join());
			} else {
				selectedNode.value(_.union(values, [this.value()]).sort().join());
			}
			bt.layout();
		}
	};

	var treeClickHandlers = function(e) {
		var leaves = getLeaves(bt.root());
		if (!_.contains(leaves, this.value())) {
			return;
		}
		if (!$('#editable').hasClass('working')) {
			if (selectedNode) {
				selectedNode.unhighlight();
				unhighlightAll(g1);
			}
			var val = this.value().split(',');
			var hNodes = g1.nodes();
			for (var next = hNodes.next(); next; next = hNodes.next()) {
				if (_.contains(val, next.value())) {
					next.highlight();
				}
			}
			selectedNode = this;
			this.highlight();
		} else {
			if (!_.contains(checkNodeArr, this)) {
				return;
			}
			if (selectedNode) {
				selectedNode.unhighlight();
			}
			selectedNode = this;
			this.highlight();
		}
	};

	var graphClickHandlers = function(e) {
		if ($('.jsavgraph').hasClass('moveNodes') && selectedNode) {
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
			jsav.umsg("Click a state");
		} 
	};

	var nodeClickHandlers = function(e) {
		if ($('.jsavgraph').hasClass('moveNodes')) {
			if (selectedNode) {
				selectedNode.unhighlight();
			}
			this.highlight();
				selectedNode = this;
				jsav.umsg("Click to place state");
				e.stopPropagation();
			} else if ($(".jsavgraph").hasClass("addEdges")) {
				this.highlight();
				if (!$(".jsavgraph").hasClass("working")) {
				first = this;
				$('.jsavgraph').addClass("working");
				jsav.umsg("Select a state to make a transition to");
   			} else {
   				var input2 = prompt("Accepted character?");
   				var newEdge;
				if (_.contains(minimizedEdges[first.value()], "" + this.value() +','+ input2)) {
					newEdge = g.addEdge(first, this, {weight: input2});
					if (!(typeof newEdge === 'undefined')) {
						newEdge.layout();
					}
				} else {
					alert("That transition is incorrect!");
				}
				$('.jsavgraph').removeClass("working");
				first.unhighlight();
				this.unhighlight();
				jsav.umsg("Click a state");
   			}
			}
	};
	jsav.umsg('Split a leaf node');
    g1 = initGraph();
    bt = initialize();

    //================================
	// DFA editing modes

	var moveNodesMode = function() {
		$(".jsavgraph").removeClass("addEdges");
		$(".jsavgraph").addClass("moveNodes");
		$("#mode").html('Moving states');
		jsav.umsg("Click a state");
	};
	var addEdgesMode = function() {
		$(".jsavgraph").removeClass("moveNodes");
		$(".jsavgraph").addClass("addEdges");
		$("#mode").html('Adding edges');
		jsav.umsg("Click a state");
	};

	//DFA hint functions
	var hint = function() {
		for (var i in minimizedEdges) {
			for (var j = 0; j < minimizedEdges[i].length; j++) {
				var n1 = g.getNodeWithValue(i),
					n2 = g.getNodeWithValue(minimizedEdges[i][j].split(',')[0]),
					w = minimizedEdges[i][j].split(',')[1];
				if (!g.hasEdge(n1, n2) || !_.contains(g.getEdge(n1, n2).weight().split(','), w)) {
					var newEdge = g.addEdge(n1, n2, {weight: w});
					if (newEdge) {
						newEdge.layout();
					}
					return;
				}
			}
		}
	};
	var complete = function() {
		for (var i in minimizedEdges) {
			for (var j = 0; j < minimizedEdges[i].length; j++) {
				var n1 = g.getNodeWithValue(i),
					n2 = g.getNodeWithValue(minimizedEdges[i][j].split(',')[0]),
					w = minimizedEdges[i][j].split(',')[1];
			var newEdge = g.addEdge(n1, n2, {weight: w});
			if (newEdge) {
				newEdge.layout();
			}
			}
		}
	};
	var dfaDone = function() {
		var edges = g.edges(),
			currentCount = 0,
			minimizedCount = 0;
		for (var next = edges.next(); next; next = edges.next()) {
			currentCount += next.weight().split(',').length;
		}
		for (var i in minimizedEdges) {
			minimizedCount += minimizedEdges[i].length;
		}
		if (currentCount !== minimizedCount) {
			alert("" + (minimizedCount - currentCount) + ' transitions remain to be placed.')
		} else {
			jsav.umsg("You got it!");
			alert("Congratulation!");
		}
	};

	// tree editing functions
	var unhighlightAll = function(graph) {		//unhighlights the reference DFA
		var nodes = graph.nodes();
		for (var next = nodes.next(); next; next = nodes.next()) {
			next.unhighlight();
		}
	};
	var checkNodes = function() {
		var checker = [];
		//console.log(checkNodeArr);
		for (var i = 0; i < checkNodeArr.length; i++) {
			checker.push(checkNodeArr[i].value());
		}
		if (_.difference(checker, partitions).length === 0) {
			if (selectedNode) {selectedNode.unhighlight();}
			unhighlightAll(g1);
			selectedNode = null;
			$('#editable').removeClass("working");
		$('.treework').hide();
		$('.split').show();
		jsav.umsg("The expansion is correct - Split a leaf node");
		} else {
			//console.log(checker);
			alert('Those partitions are incorrect');
		}
	};
	var addAnotherChild = function() {
		var par = checkNodeArr[0].parent(),
			i = checkNodeArr.length;
		checkNodeArr.push(par.child(i, "", {edgeLabel: input}).child(i));
		bt.layout();
	};
	var removeTreeNode = function() {
		if (selectedNode) {
			checkNodeArr = _.without(checkNodeArr, selectedNode);
			//console.log(checkNodeArr);
		selectedNode.remove();
		selectedNode = null;
		bt.layout();
		}
	};

	var setTerminal = function() {
		if (!selectedNode) {return;}
		var leaves = getLeaves(bt.root());
	var val = selectedNode.value().split(',');
	
	input = prompt("Set terminal");
	if (input === null) {
		selectedNode.unhighlight();
		unhighlightAll(g1);
		return;
	} else if (!_.contains(alphabet, input)) {
		alert("That terminal is not in the alphabet!");
		selectedNode.unhighlight();
		unhighlightAll(g1);
		return;
	} else {
		var nObj = {};
		var sets = {};
		partitions = [];
		for (var i = 0 ; i < val.length; i++) {
			var node = g1.getNodeWithValue(val[i]);
			var next = g1.transitionFunction(node, input);
			if (!nObj.hasOwnProperty(next[0])) {
				nObj[next[0]] = [];
			}
			nObj[next[0]].push(node.value());
		}
		var nArr = Object.keys(nObj);
		for (var i = 0; i < leaves.length; i++) {
			var leaf = leaves[i].split(',');
			if (_.difference(nArr, leaf).length === 0) {
				alert(input + " does not distinguish these states");
				selectedNode.unhighlight();
				unhighlightAll(g1);
				return;
			}
		}
		for (var i = 0; i < leaves.length; i++) {
			var leaf = leaves[i].split(',');
			for (var j = 0; j < nArr.length; j++) {
				if (!sets.hasOwnProperty(leaves[i])) {
					sets[leaves[i]] = [];
				}
				if (_.contains(leaf, nArr[j])) {
					sets[leaves[i]] = _.union(sets[leaves[i]], nObj[nArr[j]]);
				}
			}
		}
		var sArr = Object.keys(sets);
		for (var i = 0; i < sArr.length; i++) {
			var nVal = sets[sArr[i]].sort().join();
			if (nVal) {
				partitions.push(nVal);
			}
		}
		checkNodeArr = [];
		checkNodeArr.push(selectedNode.child(0, "", {edgeLabel: input}).child(0));	//.child returns the parent
		checkNodeArr.push(selectedNode.child(1, "", {edgeLabel: input}).child(1));

		$('#editable').addClass("working");
		$('.treework').show();
		$('.split').hide();
		selectedNode.unhighlight();
		selectedNode = null;
		//unhighlightAll(g1);
		jsav.umsg('Enter states');
		bt.layout();
		return;
	}
	};
	var autoPartition = function() {
		if ($('#editable').hasClass('working')) {
		selectedNode = checkNodeArr[0].parent();
		for (var i = 0; i < checkNodeArr.length; i++) {
			checkNodeArr[i].remove();
		}
	}		
		if (!selectedNode) {return;}
		var leaves = getLeaves(bt.root());
	var val = selectedNode.value().split(',');
	var nObj = {},
		sets = {},
		letter;
	for (var k = 0; k < alphabet.length; k++) {
		nObj = {};
		letter = alphabet[k];
		for (var j = 0 ; j < val.length; j++) {
			var node = g1.getNodeWithValue(val[j]);
			var next = g1.transitionFunction(node, letter);
			if (!nObj.hasOwnProperty(next[0])) {
				nObj[next[0]] = [];
			}
			nObj[next[0]].push(node.value());
		}
		var nArr = Object.keys(nObj);
		if (!_.find(leaves, function(v){return _.difference(nArr, v.split(',')).length === 0})) {
			break;
		}
		else if (k === alphabet.length - 1) {
			alert('Cannot split this node');
			selectedNode.unhighlight();
			unhighlightAll(g1);
			return;
		}
	}
	var nArr = Object.keys(nObj);
	for (var i = 0; i < leaves.length; i++) {
		var leaf = leaves[i].split(',');
		for (var j = 0; j < nArr.length; j++) {
			if (!sets.hasOwnProperty(leaves[i])) {
				sets[leaves[i]] = [];
			}
			if (_.contains(leaf, nArr[j])) {
				sets[leaves[i]] = _.union(sets[leaves[i]], nObj[nArr[j]]);
			}
		}
	}
	var sArr = Object.keys(sets);
	for (var i = 0; i < sArr.length; i++) {
		var nVal = sets[sArr[i]].sort().join();
		if (nVal) {
			selectedNode.addChild(nVal, {edgeLabel: letter});
		}
	}
	selectedNode.unhighlight();
	selectedNode = null;
	unhighlightAll(g1);
	if ($('#editable').hasClass('working')) {
		$('#editable').removeClass("working");
		$('.treework').hide();
		$('.split').show();
	} 
	jsav.umsg('Split a leaf node');
	bt.layout();
	return;
	};

	$('#movebutton').click(moveNodesMode);
	$('#edgebutton').click(addEdgesMode);
	$('#donebutton').click(done);
	$('#hintbutton').click(hint);
	$('#completebutton').click(complete);
	$('#checkbutton').click(checkNodes);
	$('#addchildbutton').click(addAnotherChild);
	$('#removetreenodebutton').click(removeTreeNode);
	$('#setterminalbutton').click(setTerminal);
	$('#autobutton').click(autoPartition);
	$('#layoutRef').click(function(){g1.layout()});
	$('#dfadonebutton').click(dfaDone);
}(jQuery));