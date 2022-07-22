const port = 80,
	__dirname = process.cwd();
import express from 'express';
const app = express();
import zipper from "zip-local";
import csso from 'csso';
const { minify: MinifyCSS } = csso;
import sass from 'sass';
const Sass = file => new Promise((resolver, reject) => sass.render({ file }, (err, res) => {
	if (err) reject(err)
	else resolver(res.css.toString());
}));

app.use((req, res, next) => {
	console.log(req.ip, req.path, req.ip == '::ffff:192.168.86.40');
	if (req.ip == '::ffff:192.168.86.40') next()
	else res.status(400).end();
})

app.get('/download', (req, res) =>
	zipper.zip(__dirname, (error, zipped) => {
		if (!error) {
			zipped.compress();
			zipped.save("../KonkenBoten.zip", error => {
				if (!error) res.download("../KonkenBoten.zip");
			});
		} else console.log(error);
	}));

app.use(async (req, res) => {
	if (req.path.endsWith('.scss')) {
		console.time('scss');
		var css = MinifyCSS(await Sass(__dirname + req.path).catch(err => console.log(err))).css;
		console.timeEnd('scss');
		res.type('css').send(css)
	} else {
		res.download(__dirname + req.path)
	}
});

app.listen(port, () => console.log(`listening on ${port}`));