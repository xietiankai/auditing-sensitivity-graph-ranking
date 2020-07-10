#!/bin/bash
checkIndex=$(cat node_modules/d3/index.js | grep -c "lasso")

if [[ $checkIndex -eq 0 ]]
then
    echo "node_module fix 1/2 ..."
    echo 'export * from "d3-lasso";' >> ./node_modules/d3/index.js
fi

checkD3Require=$(cat node_modules/d3-lasso/build/d3-lasso.js | grep -c "require(\"d3\")")



if [[ $checkD3Require -eq 0 ]]
then
    echo "node_module fix 2/2 ...."
    sed -i '774s/^/            let d3 = require("d3");\n/' ./node_modules/d3-lasso/build/d3-lasso.js
fi

echo "node_modules fixed."


