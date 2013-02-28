RM = rm -rf
CONFIG_SCRIPT = tools/configure.py
TARGET = build
CSSLINTFLAGS = --quiet --errors=empty-rules,import,errors --warnings=duplicate-background-images,compatible-vendor-prefixes,display-property-grouping,fallback-colors,duplicate-properties,shorthand,gradients,font-sizes,floats,overqualified-elements,import,regex-selectors,rules-count,unqualified-attributes,vendor-prefix,zero-units
MINIMIZE = java -jar tools/yuicompressor-2.4.7.jar

all: lint

clean:
	- $(RM) *~
	- $(RM) Doc/build
	- $(RM) Books
	# Remove minified JS and CSS files
	- $(RM) lib/*-min.*
	- $(RM) *~
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
	@csslint $(CSSLINTFLAGS) QBank/*.css
	@csslint $(CSSLINTFLAGS) RST/source/_static/opendsaMOD.css
	@csslint $(CSSLINTFLAGS) RST/source/_static/gradebook.css

jshint:
	@echo 'running jshint'
	-@jshint AV/Sorting/*.js
	-@jshint AV/Hashing/*.js
	-@jshint AV/*.js
	-@jshint Exercises/Hashing/*.js
	-@jshint lib/ODSA.js
	-@jshint RST/source/_static/opendsaMOD.js
	-@jshint RST/source/_static/gradebook.js

update:
	$(RM) AV
	cp -r dev/OpenDSA/AV AV
	$(RM) Books
	$(RM) config
	cp -r dev/OpenDSA/config config
	$(RM) Doc
	cp -r dev/OpenDSA/Doc Doc
	$(RM) Exercises
	cp -r dev/OpenDSA/Exercises Exercises
	cp dev/OpenDSA/JSAV/build/JSAV-min.js JSAV/build
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

min:
	@echo 'Minifying files'
	-@$(MINIMIZE) lib/ODSA.js -o lib/odsaUtils-min.js
	-@$(MINIMIZE) lib/site.css -o lib/site-min.css
	-@$(MINIMIZE) AV/opendsaAV.js -o lib/odsaAV-min.js
	-@$(MINIMIZE) AV/opendsaAV.css -o lib/odsaAV-min.css
	-@$(MINIMIZE) ODSAkhan-exercises/khan-exercise.js -o lib/khan-exercise-min.js
	-@$(MINIMIZE) RST/source/_static/opendsaMOD.js -o lib/odsaMOD-min.js
	-@$(MINIMIZE) RST/source/_static/opendsaMOD.css -o lib/odsaMOD-min.css
	-@$(MINIMIZE) RST/source/_static/gradebook.js -o lib/gradebook-min.js
	-@$(MINIMIZE) RST/source/_static/gradebook.css -o lib/gradebook-min.css

CS223: min
	python $(CONFIG_SCRIPT) config/CS223.json

CS3114a: min
	python $(CONFIG_SCRIPT) config/CS3114a.json

CS3114b: min
	python $(CONFIG_SCRIPT) config/CS3114b.json

OpenDSA: min
	python $(CONFIG_SCRIPT) config/OpenDSA.json

T1061220: min
	python $(CONFIG_SCRIPT) config/T1061220.json

allBooks: CS223 CS3114a CS3114b OpenDSA T1061220
