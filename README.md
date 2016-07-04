# coverjs loader for webpack

## Usage

``` sh
webpack-dev-server "mocha!./cover-my-client-tests.js" --options webpackOptions.js
```

```js
// webpackOptions.js
module.exports = {
	// your webpack options
	output: "bundle.js",
	publicPrefix: "/",
	debug: true,
	includeFilenames: true,
	watch: true,

	// the coverjs loader binding
	postLoaders: [{
		test: "", // every file
		exclude: [
			"node_modules.chai",
			"node_modules.coverjs-loader",
			"node_modules.webpack.buildin"
		],
		loader: "coverjs-loader"
	}]
}
```

```js
// cover-my-client-tests.js
require("./my-client-tests");

after(function() {
	require("cover-loader").reportHtml();
});
```

See [the-big-test](https://github.com/webpack/the-big-test) for an example.

You don't have to combine it with the mocha loader, it's independent. So if you want to cover a normal app usage, you can do so. The `reportHtml` function just appends the output to the body.


## License

MIT (http://www.opensource.org/licenses/mit-license.php)
