// object "model" will be inserted here to be consumed within the rest of the script

(function (model) {
	window._gaq = [['_setAccount', model["tracking-code"]], ['_trackPageview']];
})({
	"tracking-code": "UA-1234567"
});

(function (d, t) {
	var g = d.createElement(t),
		s = d.getElementsByTagName(t)[0];
	g.src = '//www.google-analytics.com/ga.js';
	s.parentNode.insertBefore(g, s);
}(document, 'script'));