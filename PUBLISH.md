# Publishing
> This is intended for users at Punk Digital only

Once you're happy with the updates/changes you've made you will need to update the package.json file
with the new version number (use semver) and then publish to npm and then commit your changes to git.

Follow this on how to create an npm user: [Creating a user](https://docs.npmjs.com/getting-started/publishing-npm-packages#creating-a-user)

You can use to check if you're logged in locally as your npm user
```bash
npm whoami
```

### To publish:

When you make changes, you can update the package using npm version <update_type>, where update_type is one of the semantic versioning release types, patch, minor, or major.
e.g Your package is sitting at version 1 like this; npm-test@1.0.0 and you've made bug fixes then once you're ready to publish run 'npm version patch'.
The version will hav updated the last number like this: npm-test@1.0.1.

For semantic versioning and when to update which number read this:
*[Semantic versioning](https://docs.npmjs.com/getting-started/semantic-versioning)
*[NPM incrementing versions](http://tstringer.github.io/npm/npmjs/2015/10/29/npm-incrementing-version.html)


Test: Go to https://npmjs.com/package/<package>. You should see the information for your new package.
