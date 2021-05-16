#! /usr/bin/env node

const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const origin = require('remote-origin-url');

const isGitUrl = require('../utils/isGitUrl');
const parseGithubUrl = require('../utils/parseGithubUrl');

// eslint-disable-next-line import/no-dynamic-require
const packageJSON = require(path.join(process.cwd(), 'package.json'));

inquirer
  .prompt([
    {
      type: 'input',
      name: 'authorName',
      message: "What's your full name? ",
      default: packageJSON.author,
    },
    {
      type: 'input',
      name: 'githubURL',
      message: 'Enter your github repository URL',
      default: origin.sync(),
      validate: (value) => {
        const pass = isGitUrl(value, { repository: true });
        if (pass) {
          return true;
        }

        return 'Please enter a valid github repo URL.';
      },
    },
  ])
  .then((answers) => {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, '../templates/default.md'), 'utf8');
      const { owner, name, repo } = parseGithubUrl(answers.githubURL);
      const output = ejs.render(data, {
        projectAuthor: answers.authorName,
        projectAuthorGithubLink: `https://github.com/${owner}`,
        projectAuthorUsername: owner,
        projectDescription: packageJSON.description,
        projectLicense: packageJSON.license,
        projectName: name,
        projectRepo: repo,
        projectYear: new Date().getFullYear(),
      });
      fs.writeFileSync('README.md', output, { flag: 'a+' });
      // eslint-disable-next-line no-console
      console.log('🚀️ README created successfully!');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  });
