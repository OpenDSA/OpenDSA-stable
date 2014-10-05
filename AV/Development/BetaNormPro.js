(function ($) 
{
	$(document).ready(function () 
	{
		var settings = new JSAV.utils.Settings($(".jsavsettings"));
		var arrayLayout = settings.add("layout", {"type": "select", "options": {"bar": "Bar", "array": "Array"}, "label": "Array layout: ", "value": "array"});
		var av = new JSAV($('.avcontainer'), {settings: settings});
		av.recorded();
		var tell = function (msg, color) { av.umsg(msg, {color: color}); };
		var incrs = [], $theExpression = $("#expression"), initialArray = [], theExpression, position, ansArray, arraySize, strArr, ansArr;
		
		function modelSolution(modeljsav) 
		{
			var modelArray = modeljsav.ds.array(ansArray);
			modeljsav.displayInit();
			for(i = 1; i < arraySize; i++)
			{
				modelArray.highlight(i);
				modelArray.unhighlight(i-1);
				modeljsav.gradeableStep();
			}
			return modelArray;
		}

		function init()
		{
			var varArr = ["a", "b", "c", "i", "j", "k", "w", "x", "y", "z"];
			var rnd = Math.floor(Math.random()*10);
			var var1 = varArr.splice(rnd, 1);
			rnd = Math.floor(Math.random()*9);
			var var2 = varArr.splice(rnd, 1);
			rnd = Math.floor(Math.random()*8);
			var var3 = varArr.splice(rnd, 1);
			strArr = ["(\u03BB"+var1+".("+var1+" "+var1+") (\u03BB"+var2+"."+var2+" "+var3+"))", 
					  "(\u03BB"+var1+"."+var1+" (\u03BB"+var2+"."+var2+" "+var3+"))",
					  "\u03BB"+var1+".(\u03BB"+var1+".("+var1+" "+var1+") "+var2+")"];
			ansArr = [["(^"+var1+".("+var1+" "+var1+") (^"+var2+"."+var2+" "+var3+"))", "((^"+var2+"."+var2+" "+var3+") (^"+var2+"."+var2+" "+var3+")", "("+var3+" "+var3+")"],
					  ["(^"+var1+"."+var1+" (^"+var2+"."+var2+" "+var3+"))", "(^"+var2+"."+var2+" "+var3+")", var3],
					  ["^"+var1+".(^"+var1+".("+var1+" "+var1+") "+var2+")", "^"+var1+".("+var2+" "+var2+")"]];
			rnd = Math.floor(Math.random()*3);
			var htmldata = strArr[rnd];
			$theExpression.html(htmldata);
			initialArray = ansArr[rnd];
			ansArray = ansArr[rnd];
			arraySize = ansArray.length;
			position = 1;
			jsavArray = av.ds.array(initialArray, {visible: false});
			return jsavArray;
		}
		
		function help() 
		{
			alert("Help");
		}

		function about() 
		{
			alert("Proficiency Exercise");
		}

		function submit()
		{
			var temp = document.getElementById('answer').value;
			//temp = temp.replace(/\s+/g, '');
			document.getElementById('answer').value = "";
			if(position < ansArray.length)
			{
				if(temp == ansArray[position])
				{
					jsavArray.highlight(position);
					jsavArray.unhighlight(position-1);
					exercise.gradeableStep();
					$theExpression.html(ansArray[position]);
					position++;
				} else
				{
					exercise.gradeableStep();
				}
			} else
			{
				exercise.gradeableStep();
			}
		}
		
		function done()
		{
			if(position < ansArray.length)
			{
				alert("There are still more reductions to be done!");
				exercise.gradeableStep();
			} else
			{
				jsavArray.highlight();
				exercise.gradeableStep();
				alert("Congratulations! You've finished!");
			}
		}
		
		function fixState(modeljsav)
		{
			if(position < ansArray.length)
			{
				jsavArray.highlight(position);
				jsavArray.unhighlight(position-1);
				$theExpression.html(ansArray[position]);
				position++;
			} else
			{
				jsavArray.highlight();
				alert("There are no more reductions to be done!");
			}
		}
		
		var exercise = 	av.exercise(modelSolution, init, { compare: {class: "jsavhighlight"}, controls: $('.jsavexercisecontrols'), fix: fixState });
		exercise.reset();

		$('#help').click(help);
		$('#about').click(about);
		$('#submit').click(submit);
		$('#done').click(done);
	});
}(jQuery));