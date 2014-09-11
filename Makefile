RM = rm -rf
CONFIG_SCRIPT = tools/configure.py
TARGET = build
CSSLINTFLAGS = --quiet --errors=empty-rules,import,errors --warnings=duplicate-background-images,compatible-vendor-prefixes,display-property-grouping,fallback-colors,duplicate-properties,shorthand,gradients,font-sizes,floats,overqualified-elements,import,regex-selectors,rules-count,unqualified-attributes,vendor-prefix,zero-units
MINIMIZE = java -jar tools/yuicompressor-2.4.7.jar --nomunge

.PHONY: all clean lint csslint jshint min CS2114 CS223 CS3114 CS5114 CS3114AM CS3114PM CS150 OpenDSA allBooks nomin pull CSCI204 CSCI102 CS2401 COP3530 CS208

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
	$(RM) JSAV/doc
	cp -r dev/OpenDSA/JSAV/doc JSAV/doc
	$(RM) JSAV/examples
	cp -r dev/OpenDSA/JSAV/examples JSAV/examples

update: jsav
	$(RM) AV
	cp -r dev/OpenDSA/AV AV
	$(RM) config
	cp -r dev/OpenDSA/config config
	$(RM) Doc
	cp -r dev/OpenDSA/Doc Doc
	$(RM) Exercises
	cp -r dev/OpenDSA/Exercises Exercises
	$(RM) lib
	mkdir lib
	-cp dev/OpenDSA/lib/* lib
	cp dev/OpenDSA/lib/.htaccess lib
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

CSCI102: min
	python $(CONFIG_SCRIPT) config/CSCI102.json

CS150: min
	python $(CONFIG_SCRIPT) config/CS150.json

CSCI204: min
	python $(CONFIG_SCRIPT) config/CSCI204.json

CS208: min
	python $(CONFIG_SCRIPT) config/CS208.json

CS223: min
	python $(CONFIG_SCRIPT) config/CS223.json

CSE-A1140: min
	python $(CONFIG_SCRIPT) config/CSE-A1140.json

CSE-A1141: min
	python $(CONFIG_SCRIPT) config/CSE-A1141.json

CS2114: min
	python $(CONFIG_SCRIPT) config/CS2114.json

CS2401: min
	python $(CONFIG_SCRIPT) config/CS2401.json

CS3114: min
	python $(CONFIG_SCRIPT) config/CS3114.json

CS3114AM: min
	python $(CONFIG_SCRIPT) config/CS3114AM.json

CS3114PM: min
	python $(CONFIG_SCRIPT) config/CS3114PM.json

CS3114notes: min
	python $(CONFIG_SCRIPT) s config/CS3114notes.json

COP3530: min
	python $(CONFIG_SCRIPT) config/COP3530.json

CS5114: min
	python $(CONFIG_SCRIPT) config/CS5114.json

OpenDSA: min
	python $(CONFIG_SCRIPT) config/OpenDSA.json

test: min
	python $(CONFIG_SCRIPT) config/test.json

testcmap: min
	python $(CONFIG_SCRIPT) config/testcmap.json

Dev: min
	python $(CONFIG_SCRIPT) config/Dev.json

Everything: min
	python $(CONFIG_SCRIPT) config/Everything.json

good: min
	python $(CONFIG_SCRIPT) config/good.json

invalid: min
	python $(CONFIG_SCRIPT) config/invalid.json

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
