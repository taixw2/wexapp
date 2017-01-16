var path = require('path');
var fs = require('fs');
var ora = require('ora');
var cwd = process.cwd();

var pkg = {
    pagesPath: "./pages"
};


try {
    pkg = Object.assign(pkg, require(path.resolve(cwd, "package.json")));
} catch (e) {}



var pagesPath = path.resolve(cwd, pkg.pagesPath);

var appPath = path.resolve(cwd,"./app.json");

if (!pagesPath) {
    ora(pkg.pagesPath + " 目录不存在").fail();
    process.exit(1);
}


function copyDir(source, target, targetName, callback) {

    var sourcePath;
    var targetPath;
    var readStream;
    var writeStream;
    var suffix;

    fs.readdir(source, function(err, paths) {

        if (err) {
            ora(err).fail();
            process.exit(1);
        }

        paths.forEach(function(_path) {

          suffix = /(\.\w+)$/.exec(_path)[1];

          sourcePath = path.resolve( source,_path );
          targetPath = path.join( target, targetName + suffix);

          readStream = fs.createReadStream( sourcePath );

          writeStream = fs.createWriteStream( targetPath );

          readStream.pipe( writeStream );

        });

        callback();

    });

}

module.exports = function(pageName) {

    if (typeof pageName != "string") pageName = "wexapp_" + Math.random().toString(16).substr(2);

    var targetPath = path.resolve(pagesPath, pageName);
    var sourcePath = path.join(__dirname, "./temp");

    if (!fs.existsSync(sourcePath)) {
        ora("源目录不存在").fail();
        process.exit(1);
    }

    if (fs.existsSync(targetPath)) {
        ora(pageName + "目录已经存在").fail();
        process.exit(1);
    }

    var spin = ora(pageName + "==>生成...").start();
    var app;
    fs.mkdir(targetPath,copyDir.bind(this,sourcePath,targetPath,pageName, function(){
        app = require(appPath);
        app.pages.push("pages/" + pageName + "/" + pageName);

        fs.writeFile(appPath,JSON.stringify(app),function(){
            spin.succeed();
        });
        
    }));

};
