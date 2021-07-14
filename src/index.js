#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const origin = require('remote-origin-url');
const parseGithubUrl = require('../utils/parseGithubUrl');

let data = {
  name: 'Hey',
  author: 'John Doe',
  username: 'johndoe',
  githubUrl: 'https://github.com/johndoe/example',
  repo: 'johndoe/example',
  description: 'Another awesome project to make the world a better place.',
  license: 'MIT',
  year: new Date().getFullYear(),
};

try {
  if (fs.existsSync(path.join(process.cwd(), 'package.json'))) {
    const pathToPackageJson = path.resolve(process.cwd(), 'package.json');
    const packageJson = fs.readFileSync(pathToPackageJson, 'utf8');
    const { name, description, author, license } = JSON.parse(packageJson);
    if (name) {
      data.name = name;
    }
    if (description) {
      data.description = description;
    }
    if (author) {
      data.author = author;
    }
    if (license) {
      data.license = license;
    }
  }
} catch (err) {
  console.error(err);
}

try {
  const pathToTemplate = path.resolve(__dirname, '../templates/default.md');
  const template = fs.readFileSync(pathToTemplate, 'utf8');

  if (origin.sync()) {
    data.githubUrl = origin.sync();
  }
  const { owner, name, repo } = parseGithubUrl(data.githubUrl);
  data.username = owner;
  data.name = name;
  data.repo = repo;

  const output = ejs.render(template, data);

  fs.writeFileSync('PREVIEW.md', output, { flag: 'a+' });
  console.log('🚀️ README created successfully!');
} catch (err) {
  console.log(err);
}
