#!/usr/bin/env node
var fs = require("fs");
var path = require("path");
var input = process.argv;
var inputDir = input[2];
var inputMinType = input[3] || "uglifyjs";
var continueOnError = input[4] || false;

var compressor = require("node-minify");

var walk = function(currentDirPath, callback) {
    fs.readdirSync(currentDirPath).forEach(function(name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walk(filePath, callback);
        }
    });
}

var minifyAll = function(dir, options, callback){
    options = options || {};
    options.type = options.type || inputMinType;

    walk(dir, function(path, result){
        var fileParts = path.split(".");
        
        if (fileParts[1] === "js" || fileParts[1] === "css" || fileParts[1] === "resource"){
            if (!options.silent){
                console.log("found file: " + path);
            }
            new compressor.minify({
                type: options.type, 
                fileIn: path, 
                fileOut: path,
                callback: callback || function(err, min){
-                        if(err && !continueOnError){
-                            console.log(err);
-                        }
-                    }
            });
        }
    });
};

if (inputDir){
    minifyAll(inputDir);
}

module.exports = minifyAll;
