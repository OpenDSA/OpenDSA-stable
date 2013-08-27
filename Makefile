RM = rm -rf
CONFIG_SCRIPT = tools/configure.py
TARGET = build
CSSLINTFLAGS = --quiet --errors=empty-rules,import,errors --warnings=duplicate-background-images,compatible-vendor-prefixes,display-property-grouping,fallback-colors,duplicate-properties,shorthand,gradients,font-sizes,floats,overqualified-elements,import,regex-selectors,rules-count,unqualified-attributes,vendor-prefix,zero-units
MINIMIZE = java -jar tools/yuicompressor-2.4.7.jar --nomunge

.PHONY: all clean lint csslint jshint min CS3114 CS3114AM CS3114PM OpenDSA allBooks nomin pull

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

update:
	$(RM) AV
	cp -r dev/OpenDSA/AV AV
	$(RM) config
	cp -r dev/OpenDSA/config config
	$(RM) Doc
	cp -r dev/OpenDSA/Doc Doc
	$(RM) Exercises
	cp -r dev/OpenDSA/Exercises Exercises
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
	$(RM) lib
	cp -r dev/OpenDSA/lib lib
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

min: lib/odsaUtils-min.js lib/site-min.css lib/odsaAV-min.js lib/odsaAV-min.css lib/khan-exercise-min.js lib/odsaMOD-min.js lib/odsaMOD-min.css lib/gradebook-min.js lib/gradebook-min.css

CS3114: min
	python $(CONFIG_SCRIPT) config/CS3114.json

CS3114AM: min
	python $(CONFIG_SCRIPT) config/CS3114AM.json

CS3114PM: min
	python $(CONFIG_SCRIPT) config/CS3114PM.json

OpenDSA: min
	python $(CONFIG_SCRIPT) config/OpenDSA.json

test: min
	python $(CONFIG_SCRIPT) config/test.json

Dev: min
	python $(CONFIG_SCRIPT) config/Dev.json

Everything: min
	python $(CONFIG_SCRIPT) config/Everything.json

invalid: min
	python $(CONFIG_SCRIPT) config/invalid.json

allBooks: CS3114 OpenDSA Dev Everything

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
