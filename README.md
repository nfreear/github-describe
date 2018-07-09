
[![Build Status][travis-icon]][travis]

# github-describe

Run 'git describe' on a GitHub repository, in the browser.
Useful for GitHub pages sites, etc.!

## Usage

```html
<a
  id="github-describe"
  data-github-describe-repo="{USER or ORG}/{REPO}"
  href="#!-Loading-Git-data..."
> ⏳ Loading ... </a>


<script src="https://unpkg.com/github-describe@%5E1"></script>
```

## Install .. build .. test

```sh
npm install
npm run build && npm test
```

## License

License: [MIT][]

---

[gh]: https://github.com/nfreear/github-describe
[mit]: https://nfreear.mit-license.org/2018#
[travis]: https://travis-ci.org/nfreear/github-describe
[travis-icon]: https://travis-ci.org/nfreear/github-describe.svg?branch=master
