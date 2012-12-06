RM = rm -rf
TARGET = build
CSSLINTFLAGS = --quiet --errors=empty-rules,import,errors --warnings=duplicate-background-images,compatible-vendor-prefixes,display-property-grouping,fallback-colors,duplicate-properties,shorthand,gradients,font-sizes,floats,overqualified-elements,import,regex-selectors,rules-count,unqualified-attributes,vendor-prefix,zero-units

all: lint

clean:
	- $(RM) *~
	- $(RM) Doc/build
	- $(RM) RST/build

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
	$(RM) Doc
	cp -r dev/OpenDSA/Doc Doc
	$(RM) Exercises
	cp -r dev/OpenDSA/Exercies Exercises
	$(RM) lib
	cp -r dev/OpenDSA/lib lib
	$(RM) RST
	$(RM) ODSAkhan-exercises
	cp -r dev/OpenDSA/ODSAkhan-exercises ODSAkhan-exercises
	cp -r dev/OpenDSA/RST RST
	$(RM) Scripts
	cp -r dev/OpenDSA/Scripts Scripts
	$(RM) SourceCode
	cp -r dev/OpenDSA/SourceCode SourceCode
	cp dev/OpenDSA/WebServer .
	- $(RM) Doc/build
	- $(RM) RST/build
