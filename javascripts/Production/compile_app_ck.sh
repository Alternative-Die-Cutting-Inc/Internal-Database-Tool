#!/bin/bash

COMPILED_LOCATION=app-ck.js
JAVASCRIPT_FILES=( \
	../vendor/jquery.js \
	../foundation/foundation.js \
	../angular.js \
	Controllers/WorkOrder.js \
	../HomePage/Services/ProductionService.js \
	Controllers/Production.js \
)

compile_files() {
	rm app-ck.js
	for file in "${JAVASCRIPT_FILES[@]}"; do
		cat "$file" >> app-ck.js
	done
}

main() {
  compile_files
}
main
