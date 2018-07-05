/*!
  github-describe | © Nick Freear.
*/

const GET_FN = window.require ? require('superagent').get : ajaxGet;
const THEN_FN = window.$ ? 'done' : 'then';

const ELEM = document.querySelector('#github-describe');
const REPO = document.querySelector('[ data-github-describe-repo ]').getAttribute('data-github-describe-repo');

const GITHUB_URL = 'https://github.com/{repo}/commit/{sha}'.replace('{repo}', REPO);
const TAG_URL = 'https://api.github.com/repos/{repo}/tags'.replace('{repo}', REPO);
const COMP_URL = 'https://api.github.com/repos/{repo}/compare/{tag}...HEAD'.replace('{repo}', REPO);

console.warn('github-describe:', REPO, TAG_URL, ELEM);

GET_FN(TAG_URL)[ THEN_FN ](function (res) {
  // console.warn(res);

  console.assert(res.status === 200, 'HTTP status');
  console.assert(!res.clientError);
  console.assert(!res.serverError);
  console.assert(res.header[ 'x-ratelimit-remaining' ] > 2, 'x-ratelimit-remaining');

  const LAST_TAG = res.body[ 0 ].name;
  const COMPARE_URL = COMP_URL.replace('{tag}', LAST_TAG);

  console.warn('GD tag:', LAST_TAG, COMPARE_URL);

  GET_FN(COMPARE_URL)[ THEN_FN ](function (res) {
    console.assert(res.status === 200, 'HTTP status');
    console.assert(res.body.status === 'ahead', 'Ahead?');
    console.assert(res.body.behind_by === 0);

    const AHEAD_BY = res.body.ahead_by;
    const COMMIT = res.body.commits[ 0 ]; // TODO: check !!

    const DESCRIBE = replaceObj('{tag}-{num}-g{sha}', { '{tag}': LAST_TAG, '{num}': AHEAD_BY, '{sha}': COMMIT.sha.substr(0, 7) });
    const TITLE = replaceObj('{tag} - {msg}, by {by}, on {dt}', { '{tag}': LAST_TAG, '{msg}': COMMIT.commit.message, '{by}': COMMIT.author.login, '{dt}': COMMIT.commit.author.date });

    ELEM.setAttribute('href', GITHUB_URL.replace('{sha}', COMMIT.sha));
    ELEM.setAttribute('title', TITLE);
    ELEM.innerHTML = replaceObj('<b>{repo}</b> @ <i>{desc}</i>', { '{repo}': REPO, '{desc}': DESCRIBE });
  });
});

function ajaxGet (url) {
  const W = window;
  return W.jQuery ? W.$.get(url) : W.superagent.get(url)/* .accept('json') */;
}

function replaceObj (str, mapObj) {
  const RE = new RegExp(Object.keys(mapObj).join('|'), 'g'); // Was: "gi".

  return str.replace(RE, function (matched) {
    return mapObj[ matched ];
  });
}
