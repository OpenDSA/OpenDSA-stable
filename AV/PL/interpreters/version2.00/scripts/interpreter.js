/* global SLang : true, parser, console  */

(function () {

    "use strict";

    var A = SLang.absyn;
    var E = SLang.env;
    var ppm = "byval";   

function nth(n) {
    switch (n+1) {
    case 1: return "first";
    case 2: return "second";
    case 3: return "third";
    default: return (n+1) + "th";
    }
}
function typeCheckPrimitiveOp(op,args,typeCheckerFunctions) {
    var numArgs = typeCheckerFunctions.length;
    if (args.length !== numArgs) {
	throw "Wrong number of arguments given to '" + op + "'.";
    }
    for( var index = 0; index<numArgs; index++) {
	if ( ! (typeCheckerFunctions[index])(args[index]) ) {
	    throw "The " + nth(index) + " argument of '" + op + "' has the wrong type.";
	}
    }
}
function applyPrimitive(prim,args) {
    switch (prim) {
    case "+": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createNum( E.getNumValue(args[0]) + E.getNumValue(args[1]));
    case "-": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createNum( E.getNumValue(args[0]) - E.getNumValue(args[1]));
    case "*": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createNum( E.getNumValue(args[0]) * E.getNumValue(args[1]));
    case "/": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createNum( E.getNumValue(args[0]) / E.getNumValue(args[1]));
    case "%": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createNum( E.getNumValue(args[0]) % E.getNumValue(args[1]));
    case "<": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createBool( E.getNumValue(args[0]) < E.getNumValue(args[1]));
    case ">": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createBool( E.getNumValue(args[0]) > E.getNumValue(args[1]));
    case "===": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createBool( E.getNumValue(args[0]) === E.getNumValue(args[1]));
    case "add1": 
	typeCheckPrimitiveOp(prim,args,[E.isNum]);
	return E.createNum( 1 + E.getNumValue(args[0]) );
    case "~": 
	typeCheckPrimitiveOp(prim,args,[E.isNum]);
	return E.createNum( - E.getNumValue(args[0]) );
    case "not": 
	typeCheckPrimitiveOp(prim,args,[E.isBool]);
	return E.createBool( ! E.getBoolValue(args[0]) );
    }
}
function callByValue(exp,envir) {
    var f = evalExp(A.getAppExpFn(exp),envir);
    var args = evalExps(A.getAppExpArgs(exp),envir);
    if (E.isClo(f)) {
	if (E.getCloParams(f).length !== args.length) {		
	    throw new Error("Runtime error: wrong number of arguments in " +
                            "a function call (" + E.getCloParams(f).length +
			    " expected but " + args.length + " given)");
	} else {
	    var values = evalExps(E.getCloBody(f),
			          E.update(E.getCloEnv(f),
					   E.getCloParams(f),args));
	    return values[values.length-1];
	}
    } else {
	throw f + " is not a closure and thus cannot be applied.";
    }    
}
function callByReference(exp,envir) {

    // to be completed
}
function callByCopyRestore(exp,envir) {

    // to be completed
}

function evalExp(exp,envir) {
    if (A.isIntExp(exp)) {
	return E.createNum(A.getIntExpValue(exp));
    }
    else if (A.isVarExp(exp)) {
	return E.lookup(envir,A.getVarExpId(exp));
    } else if (A.isPrintExp(exp)) {
	console.log( JSON.stringify(
	    evalExp( A.getPrintExpExp(exp), envir )));
    } else if (A.isPrint2Exp(exp)) {
	console.log( A.getPrint2ExpString(exp) +
		     (A.getPrint2ExpExp(exp) !== null ?
		      " " + JSON.stringify( evalExp( A.getPrint2ExpExp(exp), 
						     envir ) )
		      : ""));
    } else if (A.isAssignExp(exp)) {
	var v = evalExp(A.getAssignExpRHS(exp),envir);
	E.lookupReference(
                        envir,A.getAssignExpVar(exp))[0] = v;
	return v;
    } else if (A.isFnExp(exp)) {
	return E.createClo(A.getFnExpParams(exp),
				   A.getFnExpBody(exp),envir);
    }
    else if (A.isAppExp(exp)) {
	if (exp.comesFromLetBlock) {
	    return callByValue(exp,envir);
	} else {
	    switch (ppm) {
	    case "byval" : return callByValue(exp,envir);
	    case "byref" : return callByReference(exp,envir);
	    case "bycpr" : return callByCopyRestore(exp,envir);
	    }
	}
    } else if (A.isPrimApp1Exp(exp)) {
        return applyPrimitive(A.getPrimApp1ExpPrim(exp),
			      [evalExp(A.getPrimApp1ExpArg(exp),envir)]);
    } else if (A.isPrimApp2Exp(exp)) {
        return applyPrimitive(A.getPrimApp2ExpPrim(exp),
			      [evalExp(A.getPrimApp2ExpArg1(exp),envir),
			       evalExp(A.getPrimApp2ExpArg2(exp),envir)]);
    } else if (A.isIfExp(exp)) {
	if (E.getBoolValue(evalExp(A.getIfExpCond(exp),envir))) {
	    return evalExp(A.getIfExpThen(exp),envir);
	} else {
	    return evalExp(A.getIfExpElse(exp),envir);
	}
    } else {
	throw "Error: Attempting to evaluate an invalid expression";
    }
}
function evalExps(list,envir) {
    return list.map( function(e) { return evalExp(e,envir); } );
}
function myEval(p) {
    if (A.isProgram(p)) {
	return evalExp(A.getProgramExp(p),E.initEnv());
    } else {
	window.alert( "The input is not a program.");
    }
}
function interpret(source,parameter_passing_mechanism) {
    var output='';
    var theParser = typeof grammar === 'undefined' ? parser : grammar;
    ppm = parameter_passing_mechanism;
    try {
        if (source === '') {
            window.alert('Nothing to interpret: you must provide some input!');
	} else {
	    var ast = theParser.parse(source);
	    var value = myEval( ast );
            return JSON.stringify(value);
        }
    } catch (exception) {
	window.alert(exception);
        return "No output [Runtime error]";
    }
    return output;
}


function printExps(exps) {
    return exps.reduce(function (a,e) { return a + " " + printExp(e); },"");
}
function printExp(exp) {
    var i, params, args, result = "";
    if (A.isVarExp(exp)) {
	return A.getVarExpId(exp);
    } else if (A.isFnExp(exp)) {
	result  = "fn (";
	params = A.getFnExpParams(exp);
	for(i=0; i< params.length; i++) {
	    result += params[i];
	    if (i<params.length-1) {
		result += ",";
	    }
	}
	result += ") =>" + printExps(A.getFnExpBody(exp));
	return result;
    } else if (A.isAppExp(exp)) {
	result = "(" + printExp(A.getAppExpFn(exp));	
	args = A.getAppExpArgs(exp);
	if (args.length > 0) {
	    result += " ";
	}
	for(i=0; i<args.length-1; i++) {
	    result += printExp(args[i]) + " ";
	}
	if (args.length>0) {
	    result += printExp(args[args.length-1]);
	}
	result += ")";
	return result;
    } else if (A.isPrimApp1Exp(exp)) {
	return A.getPrimApp1ExpPrim(exp) + "(" +
	    printExp(A.getPrimApp1ExpArg(exp)) + ")";
    } else if (A.isPrimApp2Exp(exp)) {
	return "(" + printExp(A.getPrimApp2ExpArg1(exp)) + 
	    A.getPrimApp2ExpPrim(exp) + printExp(A.getPrimApp2ExpArg2(exp)) + 
	    ")";
    } else if (A.isIntExp(exp)) {
	return A.getIntExpValue(exp);
    } else if (A.isAssignExp(exp)) {
	return "set " + A.getAssignExpVar(exp) + " = " + 
	    printExp(A.getAssignExpRHS(exp));
    } else if (A.isPrintExp(exp)) {
	return "print " + printExp(A.getPrintExpExp(exp));
    } else if (A.isIfExp(exp)) {
	return "if " + printExp(A.getIfExpCond(exp)) + " then " +
	    printExp(A.getIfExpThen(exp)) + " else " +
	    printExp(A.getIfExpElse(exp));
	    
    } else {
	throw new Error("Unknown expression type: " +
		       JSON.stringify(exp));
    }
}// printExp function


SLang.interpret = interpret; // make the interpreter public
SLang.printExp = printExp;
SLang.printExps = printExps;
SLang.ppm = ppm;
SLang.applyPrimitive = applyPrimitive;
}());
