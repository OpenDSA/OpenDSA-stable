RM = rm -rf
TARGET = build
CSSLINTFLAGS = --quiet --errors=empty-rules,import,errors --warnings=duplicate-background-images,compatible-vendor-prefixes,display-property-grouping,fallback-colors,duplicate-properties,shorthand,gradients,font-sizes,floats,overqualified-elements,import,regex-selectors,rules-count,unqualified-attributes,vendor-prefix,zero-units

all: lint

clean:
	- $(RM) *~
	- $(RM) Doc/build
	- $(RM) Books

lint: csslint jshint

csslint:
	@echo 'running csslint'
	@csslint $(CSSLINTFLAGS) AV/*.css
	@csslint $(CSSLINTFLAGS) AV/Sorting/*.css
	@csslint $(CSSLINTFLAGS) AV/Hashing/*.css
	@csslint $(CSSLINTFLAGS) Doc/*.css

jshint:
	@echo 'running jshint'
	@jshint AV/*.js
	@jshint AV/Hashing/*.js
	@jshint AV/Sorting/*.js
	@jshint Exercises/Hashing/*.js
	@jshint Exercises/Sorting/*.js
	@jshint lib/ODSA.js
	@jshint RST/source/_static/opendsaMOD.js

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
	$(RM) RST
	cp -r dev/OpenDSA/RST RST
	$(RM) ODSAkhan-exercises
	cp -r dev/OpenDSA/ODSAkhan-exercises ODSAkhan-exercises
	$(RM) SourceCode
	cp -r dev/OpenDSA/SourceCode SourceCode
	cp dev/OpenDSA/WebServer .
	- $(RM) Doc/build
	cd Doc; make

CS3114:
	python lib/configure.py config/CS3114.json

OpenDSA:
	python lib/configure.py config/OpenDSA.json

T1061220:
	python lib/configure.py config/T1061220.json

allBooks: CS3114 OpenDSA T1061220
