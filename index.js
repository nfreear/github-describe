// wrap-start

/*!
  github-describe | © Nick Freear | MIT license.
*/

if (!('fetch' in window)) throw new Error('github-describe requires the "fetch" API.');

const fetch = window.fetch;

const ELEM = document.querySelector('#github-describe');
const REPO = document.querySelector('[ data-github-describe-repo ]').getAttribute('data-github-describe-repo');

const GITHUB_URL = 'https://github.com/{repo}/commit/{sha}'.replace('{repo}', REPO);
const TAG_URL = 'https://api.github.com/repos/{repo}/tags'.replace('{repo}', REPO);
const COMP_URL = 'https://api.github.com/repos/{repo}/compare/{tag}...HEAD'.replace('{repo}', REPO);

console.warn('github-describe:', REPO, TAG_URL, ELEM);

var lastTag;

fetch(TAG_URL)
  .then(function (resp) {
    console.warn('Fetch tag:', resp, resp.headers.get('x-ratelimit-remaining'));

    console.assert(resp.status === 200, 'HTTP status');
    console.assert(resp.ok, 'Ok?');
    console.assert(resp.type === 'cors', 'CORS?');
    console.assert(resp.bodyUsed, 'body?');
    // console.assert(typeof resp.body === 'ReadableStream', 'body?');

    console.assert(resp.headers.get('x-ratelimit-remaining') > 4, 'x-ratelimit-remaining');

    if (!resp.ok) return Promise.reject(resp);

    return resp.json();
  })
  .then(function (body) {
    console.assert(body.length > 0, 'tag count');

    if (!body.length) return Promise.reject(new Error({ statusText: 'No git tags found', url: TAG_URL }));

    const LAST_TAG = body[ 0 ].name;
    const COMPARE_URL = COMP_URL.replace('{tag}', LAST_TAG);

    console.warn('GD tag:', LAST_TAG, COMPARE_URL);

    lastTag = LAST_TAG;

    return fetch(COMPARE_URL);
  })
  .then(function (resp) {
    console.warn('Fetch compare:', resp);

    console.assert(resp.status === 200, 'HTTP status');
    console.assert(resp.ok, 'Ok?');
    console.assert(resp.type === 'cors', 'CORS?');
    // console.assert(resp.bodyUsed, 'body?');

    if (!resp.ok) return Promise.reject(resp);

    return resp.json();
  })
  .then(function (body) {
    console.assert(body.status === 'ahead', 'Ahead');
    // console.assert(body.behind_by === 0);
    console.assert(lastTag);

    const LAST_TAG = lastTag;

    const AHEAD_BY = body.ahead_by;
    const COMMIT = body.commits[ 0 ]; // TODO: check !!

    const DESCRIBE = replaceObj('{tag}-{num}-g{sha}', { '{tag}': LAST_TAG, '{num}': AHEAD_BY, '{sha}': COMMIT.sha.substr(0, 7) });
    const TITLE = replaceObj('{tag} - {msg}, by {by}, on {dt}', { '{tag}': LAST_TAG, '{msg}': COMMIT.commit.message, '{by}': COMMIT.author.login, '{dt}': COMMIT.commit.author.date });

    ELEM.setAttribute('href', GITHUB_URL.replace('{sha}', COMMIT.sha));
    ELEM.setAttribute('title', TITLE);
    ELEM.innerHTML = replaceObj('<b>{repo}</b> @ <i>{desc}</i>', { '{repo}': REPO, '{desc}': DESCRIBE });
  })
  .catch(errResp => console.error('Fetch error:', errResp.statusText, errResp));

function replaceObj (str, mapObj) {
  const RE = new RegExp(Object.keys(mapObj).join('|'), 'g'); // Was: "gi".

  return str.replace(RE, function (matched) {
    return mapObj[ matched ];
  });
}

// wrap-end
