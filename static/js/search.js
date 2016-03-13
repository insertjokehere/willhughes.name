$(document).ready(function () {
    var index;
    var docs = {};

    $.get('/search.json', function (data) {
        index = lunr.Index.load(data.index);
	docs = data.docs;
        $('input[type="search"]').removeAttr('disabled');
    });

    $('input[type="search"]').change(function (e) {
        do_search(this.value);
    });

    $('input[type="search"]').keyup(function (e) {
        do_search(this.value);
    });

    $('form').submit(function (e) {
	e.preventDefault();

	do_search($('input[type="search"]').value);
    });

    function do_search(term) {
	if (term.length > 1) {
            var results = index.search(term);
	    var results_text = '' + results.length + ' result';
	    if (results.length >= 2 || results.length == 0) {
		results_text += 's';
	    }
	    $('.results_count').text(results_text);
	    if (results.length == 0) {
		$('div.results').hide();
	    } else {
		var results_list = $('.results ol');
		results_list.empty();

		console.log(results);

		$.each(results, function () {
		    console.log(this);
		    results_list.append(
			Blog.templates.search_result(docs[this.ref])
		    );
		});

		$('div.results').show();
	    }
        }
    }

});
