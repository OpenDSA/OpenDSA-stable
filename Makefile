RM = rm -rf
CONFIG_SCRIPT = tools/configure.py
TARGET = build
CSSLINTFLAGS = --quiet --errors=empty-rules,import,errors --warnings=duplicate-background-images,compatible-vendor-prefixes,display-property-grouping,fallback-colors,duplicate-properties,shorthand,gradients,font-sizes,floats,overqualified-elements,import,regex-selectors,rules-count,unqualified-attributes,vendor-prefix,zero-units
MINIMIZE = java -jar tools/yuicompressor-2.4.7.jar --nomunge

.PHONY: all clean lint csslint jshint min CS2114 CS2114F15 CS223 CS5114 CS3114 CS3114F15 CS3114notes CS150 OpenDSA test testX IS allBooks nomin pull CPSC270S15 CS2401 COP3530 CS208 ECE252 Tutorial TDDD86F15 TDDC91F15 S15 CSCI115 CS316 CSE017F15

all: lint

clean:
	- $(RM) *~
	- $(RM) Books
	@# Remove minified JS and CSS files
	- $(RM) lib/*-min.*
	- $(RM) Doc/*~
	- $(RM) Scripts/*~
	- $(RM) config/*~

lint: csslint jshint

csslint:
	@echo 'running csslint'
	@csslint $(CSSLINTFLAGS) AV/Sorting/*.css
	@csslint $(CSSLINTFLAGS) AV/Hashing/*.css
	@csslint $(CSSLINTFLAGS) AV/*.css
	@csslint $(CSSLINTFLAGS) Doc/*.css
	@csslint $(CSSLINTFLAGS) lib/*.css

jshint:
	@echo 'running jshint'
	-@jshint AV/Sorting/*.js
	-@jshint AV/Hashing/*.js
	-@jshint Exercises/Hashing/*.js
	-@jshint lib/odsaUtils.js
	-@jshint lib/odsaAV.js
	-@jshint lib/odsaMOD.js
	-@jshint lib/gradebook.js

jsav:
	cp dev/OpenDSA/JSAV/build/JSAV-min.js JSAV/build
	cp dev/OpenDSA/JSAV/build/JSAV.js JSAV/build
	$(RM) JSAV/lib
	cp -r dev/OpenDSA/JSAV/lib JSAV/lib
	$(RM) JSAV/css
	cp -r dev/OpenDSA/JSAV/css JSAV/css
	$(RM) JSAV/extras
	cp -r dev/OpenDSA/JSAV/extras JSAV/extras
	$(RM) JSAV/examples
	cp -r dev/OpenDSA/JSAV/examples JSAV/examples

update: jsav docopy min

docopy:
	$(RM) AV
	cp -r dev/OpenDSA/AV AV
	$(RM) DataStructures
	cp -r dev/OpenDSA/DataStructures DataStructures
	$(RM) config
	cp -r dev/OpenDSA/config config
	$(RM) Doc
	cp -r dev/OpenDSA/Doc Doc
	$(RM) Exercises
	cp -r dev/OpenDSA/Exercises Exercises
	$(RM) lib
	mkdir lib
	-cp dev/OpenDSA/lib/* lib
	cp -r dev/OpenDSA/lib/codemirror lib/codemirror
	$(RM) lib/*-min.*
	$(RM) tools
	cp -r dev/OpenDSA/tools tools
	$(RM) RST
	cp -r dev/OpenDSA/RST RST
	$(RM) ODSAkhan-exercises
	cp -r dev/OpenDSA/ODSAkhan-exercises ODSAkhan-exercises
	$(RM) SourceCode
	cp -r dev/OpenDSA/SourceCode SourceCode
	cp dev/OpenDSA/WebServer .
	- $(RM) Doc/build
	cd Doc; make

min: nomin
# lib/odsaUtils-min.js lib/site-min.css lib/odsaAV-min.js lib/odsaAV-min.css lib/khan-exercise-min.js lib/odsaMOD-min.js lib/odsaMOD-min.css lib/gradebook-min.js lib/gradebook-min.css

nomin:
	@cp JSAV/build/JSAV.js JSAV/build/JSAV-min.js
	@cp lib/odsaUtils.js lib/odsaUtils-min.js
	@cp lib/odsaMOD.js lib/odsaMOD-min.js
	@cp lib/odsaAV.js lib/odsaAV-min.js
	@cp lib/gradebook.js lib/gradebook-min.js
	@cp ODSAkhan-exercises/khan-exercise.js lib/khan-exercise-min.js
	@cp lib/registerbook.js lib/registerbook-min.js
	@cp lib/site.css lib/site-min.css
	@cat lib/normalize.css lib/odsaAV.css > lib/odsaAV-min.css
	@cp lib/odsaMOD.css lib/odsaMOD-min.css
	@cp lib/odsaStyle.css lib/odsaStyle-min.css
	@cp lib/gradebook.css lib/gradebook-min.css

F15: CS2114F15 CS3114F15 CS316 TDDD86F15 TDDC91F15 TDDI16F15 CSE017F15 CPSC270 COP3530 CISC-187 C2GEN

Tutorial: min
	python $(CONFIG_SCRIPT) config/Tutorial.json

TDDD86F15: min
	python $(CONFIG_SCRIPT) config/TDDD86F15.json

TDDC91F15: min
	python $(CONFIG_SCRIPT) config/TDDC91F15.json

TDDI16F15: min
	python $(CONFIG_SCRIPT) config/TDDI16F15.json

RecurTutor: min
	python $(CONFIG_SCRIPT) config/RecurTutor.json

RecurTutor2: min
	python $(CONFIG_SCRIPT) config/RecurTutor2.json

CISC-187: min
	python $(CONFIG_SCRIPT) config/CISC-187.json

CSCI102: min
	python $(CONFIG_SCRIPT) config/CSCI102.json

CSCI115: min
	python $(CONFIG_SCRIPT) config/CSCI115S15.json

CS150: min
	python $(CONFIG_SCRIPT) config/CS150.json

CSE017F15: min
	python $(CONFIG_SCRIPT) config/CSE017F15.json

CPSC270: min
	python $(CONFIG_SCRIPT) config/CPSC270F15.json

CSCI204: min
	python $(CONFIG_SCRIPT) config/CSCI204S15.json

CS208: min
	python $(CONFIG_SCRIPT) config/CS208.json

CS223: min
	python $(CONFIG_SCRIPT) config/CS223.json

CSE-A1140: min
	python $(CONFIG_SCRIPT) config/CSE-A1140.json

CSE-A1141: min
	python $(CONFIG_SCRIPT) config/CSE-A1141.json

CSE-A1141eng: min
	python $(CONFIG_SCRIPT) config/CSE-A1141eng.json

CS2114: min
	python $(CONFIG_SCRIPT) config/CS2114SS215.json

CS2114F15: min
	python $(CONFIG_SCRIPT) config/CS2114F15.json

CS2401: min
	python $(CONFIG_SCRIPT) config/CS2401.json

CS3114: min
	python $(CONFIG_SCRIPT) config/CS3114.json

CS3114F15: min
	python $(CONFIG_SCRIPT) config/CS3114F15Cao.json
	python $(CONFIG_SCRIPT) config/CS3114F15Barnette.json

CS3114notes: min
	python $(CONFIG_SCRIPT) s config/CS3114notes.json

CS316: min
	python $(CONFIG_SCRIPT) config/CS316.json

COP3530: min
	python $(CONFIG_SCRIPT) config/COP3530F15.json

CS4104S15: min
	python $(CONFIG_SCRIPT) config/CS4104S15.json

CS5114: min
	python $(CONFIG_SCRIPT) config/CS5114.json

CS5114S15: min
	python $(CONFIG_SCRIPT) config/CS5114S15.json

ECE252: min
	python $(CONFIG_SCRIPT) config/ECE252S15.json

OpenDSA: min
	python $(CONFIG_SCRIPT) config/OpenDSA.json

test: min
	python $(CONFIG_SCRIPT) config/test.json

testfi: min
	python $(CONFIG_SCRIPT) config/testfi.json

testpt: min
	python $(CONFIG_SCRIPT) config/testpt.json

testcmap: min
	python $(CONFIG_SCRIPT) config/testcmap.json

uwosh-pl: min
	python $(CONFIG_SCRIPT) config/uwosh-pl.json

Dev: min
	python $(CONFIG_SCRIPT) config/Dev.json

Everything: min
	python $(CONFIG_SCRIPT) config/Everything.json

good: min
	python $(CONFIG_SCRIPT) config/good.json

invalid: min
	python $(CONFIG_SCRIPT) config/invalid.json

C2GEN: min
	python $(CONFIG_SCRIPT) config/C2GEN.json

allBooks: CS2114 CS2401 CS3114 OpenDSA Everything testcmap

lib/odsaUtils-min.js: lib/odsaUtils.js
	@echo 'Minimizing lib/odsaUtils.js'
	@$(MINIMIZE) lib/odsaUtils.js -o lib/odsaUtils-min.js

lib/site-min.css: lib/site.css
	@echo 'Minimizing lib/site.css'
	-@$(MINIMIZE) lib/site.css -o lib/site-min.css

lib/odsaAV-min.js: lib/odsaAV.js
	@echo 'Minimizing lib/odsaAV.js'
	@$(MINIMIZE) lib/odsaAV.js -o lib/odsaAV-min.js

lib/odsaAV-min.css: lib/odsaAV.css
	@echo 'Minimizing lib/odsaAV.css'
	@$(MINIMIZE) lib/odsaAV.css -o lib/odsaAV-min.css

lib/khan-exercise-min.js: ODSAkhan-exercises/khan-exercise.js
	@echo 'Minimizing lib/khan-exercise.js'
	@$(MINIMIZE) ODSAkhan-exercises/khan-exercise.js -o lib/khan-exercise-min.js

lib/odsaMOD-min.js: lib/odsaMOD.js
	@echo 'Minimizing lib/odsaMOD.js'
	@$(MINIMIZE) lib/odsaMOD.js -o lib/odsaMOD-min.js

lib/odsaMOD-min.css: lib/odsaMOD.css
	@echo 'Minimizing lib/odsaMOD.css'
	@$(MINIMIZE) lib/odsaMOD.css -o lib/odsaMOD-min.css

lib/gradebook-min.js: lib/gradebook.js
	@echo 'Minimizing lib/gradebook.js'
	@$(MINIMIZE) lib/gradebook.js -o lib/gradebook-min.js

lib/gradebook-min.css: lib/gradebook.css
	@echo 'Minimizing lib/gradebook.css'
	@$(MINIMIZE) lib/gradebook.css -o lib/gradebook-min.css
