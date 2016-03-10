#!/usr/bin/nodejs

var lunr = require('lunr');
var $ = require('cheerio');
var fs = require('fs');
var walk = require('fs-walk');

var index = lunr(function(){
    this.field('title', {boost: 10})
    this.field('body')
    this.ref('href')
})

var outfile = 'public/search.json';

index_directory(index, 'public/post');
index_directory(index, 'public/repo');
index_file(index, 'public/repo/index.html');

function index_directory(index, directory) {
    walk.walkSync(directory, function(basedir, filename, stat) {
        if (!stat.isDirectory()) {
            if (filename.match(/\.html$/) &&
                !(filename == "index.html" && basedir == directory)) {
                index_file(index, basedir + '/' + filename);
            }
        }
    });
}

function index_file(index, filepath) {
    var htmlString = fs.readFileSync(filepath).toString();
    var page = $.load(htmlString);

    var title = page('div.header h1').text();
    page('div.post-meta').remove();
    page('div.prev-next-post').remove();
    var content = page('div.content');

    var body = content.text();

    var href = filepath;

    index.add({
        href: href,
        title: title,
        body: body
    });
}

var stream = fs.createWriteStream(outfile);
stream.write(JSON.stringify({
    index: index.toJSON()
}));
stream.end();
