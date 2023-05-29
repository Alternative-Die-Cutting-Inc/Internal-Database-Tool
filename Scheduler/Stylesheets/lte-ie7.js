/* Use this script if you need to support IE 7 and IE 6. */

window.onload = function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'iconic\'">' + entity + '</span>' + html;
	}
	var icons = {
			'icon-untitled' : '&#xe001;',
			'icon-untitled-2' : '&#xe002;',
			'icon-untitled-3' : '&#xe003;',
			'icon-untitled-4' : '&#xe005;',
			'icon-untitled-5' : '&#xe004;',
			'icon-fullscreen' : '&#xe006;',
			'icon-untitled-6' : '&#xe000;'
		},
		els = document.getElementsByTagName('*'),
		i, attr, html, c, el;
	for (i = 0; i < els.length; i += 1) {
		el = els[i];
		attr = el.getAttribute('data-icon');
		if (attr) {
			addIcon(el, attr);
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c) {
			addIcon(el, icons[c[0]]);
		}
	}
};