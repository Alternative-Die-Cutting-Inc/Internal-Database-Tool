# Intranet javascript for the Production Page

## History

In 2013 Peter Tran used a MacOS tool called Codekit to minify and concatenate javascript and css. This allowed the production page to pull down a single javascript file making it simplier for file management and speed. Codekit worked by reading app.js and based on the import statements it would glue together the files. The issue now is to quickly modify javascript code a developer would need to buy a Codekit license and repeat the above steps. This is not ideal because it doesn't allow quick fixes and in 2021 it's unclear if Codekit works the same way so there may be compatibility issues.

## Current State

* app-ck.js.bak is the backup of the minified and concatenated js file
* app.js reflects Codekit's original configuration
* compile_app_ck.sh is a bash script that compiles a new app-ck.js based on the files listed in app.js

To make changes to javascript within the Production Page:
* run compile_app_ck.sh	 after changing javascript code listed in app.js


