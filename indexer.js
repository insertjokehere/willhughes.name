'use strict';

var $ = require('cheerio');
var through = require('through');
var gutil = require('gulp-util');
var lunr = require('lunr');
var File = gutil.File;
var PluginError = gutil.PluginError;

module.exports = function(targetFile) {

    var index;
    var docs = {};

    function add(file) {

	if (!index) {
	    index = lunr(function() {
		this.field('title', {boost: 10})
		this.field('tags', {boost: 5})
		this.field('body')
		this.ref('href')
	    });
	}

	var page = $.load(file.contents.toString());

	var title = page('div.header h1').text();
	var tags = "";
	page('a.post-taxonomy-tag').each(function (i, elem) {
	    tags += $(elem).text() + ' ';
	});

	console.log(tags);

	page('div.post-meta').remove();
	page('div.prev-next-post').remove();
	var content = page('div.content');

	var body = content.text();

	var href = '/' + file.relative;
	href = href.slice(0, href.length - 10);  // remove index.html

	console.log(href);

	index.add({
	    body: body,
	    href: href,
	    tags: tags,
	    title: title
	});

	docs[href] = {
	    href: href,
	    title: title
	};

	return;
    }

    function end() {

	var content = new Buffer(JSON.stringify({
	    index: index.toJSON(),
	    docs: docs
	}));

	var target = new File();

	target.path = targetFile;
	target.contents = content;

	this.emit('data', target);
	this.emit('end');
    }

    return through(add, end);
};
