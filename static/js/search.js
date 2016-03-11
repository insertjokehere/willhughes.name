$(document).ready(function () {
    var index;

    $.get('/search.json', function (data) {
        index = lunr.Index.load(data.index);
    });

    $('.search').keypress(function (e) {
        if (this.value.length > 1) {
            console.log(index.search(this.value));
        }
    });
});
