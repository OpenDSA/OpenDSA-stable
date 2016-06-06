/* global SLang : true, parser */

(function () {

"use strict";

    var A = window.SLang.absyn;
    var E = window.SLang.env;

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
	throw new Error("Wrong number of arguments given to '" + op + "'.");
    }
    for( var index = 0; index<numArgs; index++) {
	if ( ! (typeCheckerFunctions[index])(args[index]) ) {
	    throw new Error("The " + nth(index) + " argument of '" + op + "' has the wrong type.");
	}
    }
}

function applyPrimitive(prim,args) {
    switch (prim) {
    case "+": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createNum( E.getNumValue(args[0]) + E.getNumValue(args[1]));
    case "*": 
	typeCheckPrimitiveOp(prim,args,[E.isNum,E.isNum]);
	return E.createNum( E.getNumValue(args[0]) * E.getNumValue(args[1]));
    case "add1": 
	typeCheckPrimitiveOp(prim,args,[E.isNum]);
	return E.createNum( 1 + E.getNumValue(args[0]) );
    }
}
function evalExp(exp,envir) {
    if (A.isIntExp(exp)) {
	return E.createNum(A.getIntExpValue(exp));
    }
    else if (A.isVarExp(exp)) {
	return E.lookup(envir,A.getVarExpId(exp));
    }
    else if (A.isFnExp(exp)) {
	return E.createClo(A.getFnExpParams(exp),A.getFnExpBody(exp),envir);
    }
    else if (A.isAppExp(exp)) {
	var f = evalExp(A.getAppExpFn(exp),envir);
	var args = A.getAppExpArgs(exp).map( function(arg) { return evalExp(arg,envir); } );
	if (E.isClo(f)) {
	    if (E.getCloParams(f).length !== args.length) {		
		throw new Error("Runtime error: wrong number of arguments in " +
                        "a function call (" + E.getCloParams(f).length +
			" expected but " + args.length + " given)");
	    } else {
		return evalExp(E.getCloBody(f),
			       E.update(E.getCloEnv(f),
						E.getCloParams(f),args));
	    }
	} else {
	    throw new Error(f + " is not a closure and thus cannot be applied.");
	}
    } else if (A.isPrimAppExp(exp)) {
        return applyPrimitive(A.getPrimAppExpPrim(exp),
			      A.getPrimAppExpArgs(exp).map( function(arg) { 
                                  return evalExp(arg,envir); } ));
    } else {
	throw new Error("Error: Attempting to evaluate an invalid expression");
    }
}
function myEval(p) {
    if (A.isProgram(p)) {
	return evalExp(A.getProgramExp(p),E.initEnv());
    } else {
	window.alert( "The input is not a program.");
    }
}
function interpret(source) {
    var output='';

    try {
        if (source === '') {
            window.alert('Nothing to interpret: you must provide some input!');
	} else {
	    var ast = parser.parse(source);
	    var value = myEval( ast );
            return JSON.stringify(value);
        }
    } catch (exception) {
	window.alert(exception);
        return "No output [Runtime error]";
    }
    return output;
}

function printExp(exp) {
    var i, params, args, result = "";
    if (A.isVarExp(exp)) {
	return A.getVarExpId(exp);
    } else if (A.isFnExp(exp)) {
	result  = "fn(";
	params = A.getFnExpParams(exp);
	for(i=0; i< params.length; i++) {
	    result += params[i];
	    if (i<params.length-1) {
		result += ",";
	    }
	}
	result += ")=>" + printExp(A.getFnExpBody(exp));
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
    } else if (A.isPrimAppExp(exp)) {
	result = A.getPrimAppExpPrim(exp) + "(";
	args = A.getPrimAppExpArgs(exp);
	for(i=0; i<args.length-1; i++) {
	    result += printExp(args[i]) + ",";
	}
	if (args.length>0) {
	    result += printExp(args[args.length-1]);
	}
	result += ")";
	return result;
    } else if (A.isIntExp(exp)) {
	return A.getIntExpValue(exp);
    } else { 
	throw new Error("Unknown expression type: " +
		       JSON.stringify(exp));
    }
}// printExp function

SLang.interpret = interpret; // make the interpreter public
SLang.evalExp = evalExp;
SLang.printExp = printExp;
SLang.applyPrimitive = applyPrimitive;
}());
