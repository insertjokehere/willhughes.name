# willhughes.name

Source for my personal blog, built with [Hugo](https://gohugo.io).

## Local development

Tool versions come from `.mise.toml`:

```sh
mise install
hugo server -D
```

The build is just `hugo` -- there is no node, npm, gulp or webpack step. The
theme lives in `themes/blackburn/` as vendored files, and its CSS/JS bundle
(`themes/blackburn/static/blackburn.js`) is pre-built and committed; see
`themes/blackburn/README.md` if it ever needs regenerating.

Post images are committed twice: the originals live in `assets/img/post/<slug>/`
and the optimised copies actually served by the site (plus 250px-wide
thumbnails) live in `static/img/post/<slug>/`. The `{{< post_img >}}` shortcode
reads from the latter. Run `./strip_exif.sh` over a new photo before committing
it.

## Publishing

CI runs on Gitea Actions (`.gitea/workflows/`):

* Every push builds the site.
* Pushes to `master` publish to preprod at <https://whn-preprod.hhome.me>.
* Running the **promote** workflow from the Actions UI on `master` advances the
  `published` branch, which publishes to production at
  <https://www.willhughes.name> and mirrors the source to GitHub.
