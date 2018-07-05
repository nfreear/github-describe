/*!
  github-describe | © Nick Freear, 05-July-2018.
*/

const REQUEST = window.superagent; // OR, require('superagent');

const ELEM = document.querySelector('#id-git-describe');
const REPO = document.querySelector('[ data-git-describe-repo ]').getAttribute('data-git-describe-repo');

const GITHUB_URL = 'https://github.com/{repo}'.replace('{repo}', REPO);
const TAG_URL = 'https://api.github.com/repos/{repo}/tags'.replace('{repo}', REPO); // https://api.github.com/repos/nfreear/gaad-widget/tags;
const COMP_URL = 'https://api.github.com/repos/{repo}/compare/{tag}...HEAD'.replace('{repo}', REPO); // https://api.github.com/repos/nfreear/gaad-widget/compare/3.3.0...HEAD;
// HEAD_URL = 'https://api.github.com/repos/nfreear/gaad-widget/commits/HEAD';

console.warn('git-describe', REPO, TAG_URL, ELEM);

REQUEST.get(TAG_URL).accept('json').then(function (res) {
  // console.warn(res);

  console.assert(res.status === 200, 'HTTP status');
  console.assert(!res.clientError);
  console.assert(!res.serverError);
  console.assert(res.header[ 'x-ratelimit-remaining' ] > 10, 'x-ratelimit-remaining');

  const LAST_TAG = res.body[ 0 ].name;

  console.warn('tag:', LAST_TAG);

  const COMPARE_URL = COMP_URL.replace('{tag}', LAST_TAG);

  REQUEST.get(COMPARE_URL).accept('json').then(function (res) {
    console.warn(res);

    console.assert(res.status === 200, 'HTTP status');
    console.assert(!res.clientError);
    console.assert(!res.serverError);
    console.assert(res.body.status === 'ahead', 'Ahead?');
    console.assert(res.body.behind_by === 0);

    const AHEAD_BY = res.body.ahead_by;
    const COMMIT = res.body.commits[ 0 ]; // TODO: check !!

    const DESCRIBE = replaceObj('{tag}-{n}-g{sha}', { '{tag}': LAST_TAG, '{n}': AHEAD_BY, '{sha}': COMMIT.sha.substr(0, 7) });
    const TITLE = replaceObj('{tag} - {msg}, by {by}, on {dt}', { '{tag}': LAST_TAG, '{msg}': COMMIT.commit.message, '{by}': COMMIT.author.login, '{dt}': COMMIT.commit.author.date });

    ELEM.setAttribute('href', GITHUB_URL);
    ELEM.setAttribute('title', TITLE);
    ELEM.innerHTML = replaceObj('<b>{repo}</b> @ <i>{desc}</i>', { '{repo}': REPO, '{desc}': DESCRIBE });
  });
});

function replaceObj (str, mapObj) {
  var re = new RegExp(Object.keys(mapObj).join('|'), 'g'); // Was: "gi".

  return str.replace(re, function (matched) {
    return mapObj[ matched ]; // Was: matched.toLowerCase().
  });
}
