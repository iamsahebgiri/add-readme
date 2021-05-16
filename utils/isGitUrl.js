const isPlainGhUrl = (string) => {
  const re = new RegExp('(?:https?\\:\\/\\/)github.com\\/?$');
  return re.test(string);
};

// Switch to strict mode automatically if the following pattern matches passed
// string
const isStrictRequired = (string) => /git(@|:)|\.git(?:\/?|\\#[\d\w\\.\-_]+)$/.test(string);

/**
   * isGithubUrl
   * Check if a passed string is a valid GitHub URL
   *
   * @name isGithubUrl
   * @function
   *
   * @param {String} url A string to be validated
   * @param {Object} options An object containing the following fields:
   *  - `strict` (Boolean): Match only URLs ending with .git
   *  - `repository` (Boolean): Match only valid GitHub repo URLs
   * @return {Boolean} Result of validation
   */
module.exports = function isGithubUrl(url, _options) {
  const options = _options || {};
  const isStrict = options.strict || isStrictRequired(url);
  const repoRequired = options.repository || isStrict;
  const strictPattern = '\\/[\\w\\.-]+?\\.git(?:\\/?|\\#[\\w\\.\\-_]+)?$';
  const loosePattern = repoRequired
    ? '\\/[\\w\\.-]+\\/?(?!=.git)(?:\\.git(?:\\/?|\\#[\\w\\.\\-_]+)?)?$'
    : '(?:\\/[\\w\\.\\/-]+)?\\/?(?:#\\w+?|\\?.*)?$';
  const endOfPattern = isStrict ? strictPattern : loosePattern;
  const pattern = `(?:git|https?|git@)(?:\\:\\/\\/)?github.com[/|:][A-Za-z0-9-]+?${endOfPattern}`;

  if (isPlainGhUrl(url) && !repoRequired) {
    return true;
  }

  const re = new RegExp(pattern);
  return re.test(url);
};
