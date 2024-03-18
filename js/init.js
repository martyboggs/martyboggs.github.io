(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-52138306-2', 'auto');
ga('send', 'pageview');

if (window.addEventListener) {
	window.addEventListener('load', downloadJSAtOnload, false);
} else if (window.attachEvent) {
	window.attachEvent('onload', downloadJSAtOnload);
} else {
	window.onload = downloadJSAtOnload;
}

function downloadJSAtOnload() {
	var element = document.createElement("script");
	var scripts = [
		'https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js',
		'https://www.gstatic.com/firebasejs/3.5.1/firebase.js',
		'js/lib/three.min.js',
		'js/lib/oimo.js',
		'js/lib/THREEx.KeyboardState.js',
		'js/lib/THREEx.FullScreen.js',
		'js/lib/dat.gui.min.js',
		'js/lib/stats.min.js',
		'js/lib/jquery-1.11.3.min.js',
		'js/lib/hammer.min.js',
		'js/lib/jquery.hammer.js',
		'js/lib/Tween.js',
		'js/lib/howler.core.js',
		'js/lib/slick.min.js',

		'js/main.js',
		'js/post.js',
	];
	for (var i = 0; i < scripts.length; i += 1) {
		element = document.createElement('script');
		element.src = scripts[i];
		element.async = false;
		document.body.appendChild(element);
	}
}
