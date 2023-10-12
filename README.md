# Fake Devicedb

[![npm](https://img.shields.io/npm/v/@seamapi/fake-devicedb.svg)](https://www.npmjs.com/package/@seamapi/fake-devicedb)
[![GitHub Actions](https://github.com/seamapi/fake-devicedb/actions/workflows/check.yml/badge.svg)](https://github.com/seamapi/fake-devicedb/actions/workflows/check.yml)

Fake for Seam Devicedb. Use with Fake Seam Connect.

## Description

This module allows you to spin up an in-memory server
for the Seam Devicedb.

## 📓 Notes

### Text Search

Full-text search on real devicedb API (using the `?text_search` parameter) is far more flexible than the simple matching provided by this fake.

### Seeding with Data

This fake can be seeded with data from the live API. To do so, either call `POST /_fake/seed_from_live_api` or use the exported helper:

```ts
import axios from "axios"
import { createDatabase, seedFromLiveApi } from "@seamapi/fake-devicedb"

const db = createDatabase()

// You could create a client that goes through the Seam Connect devicedb proxy instead
const live_client = axios.create({
  baseURL: "https://devicedb.seam.tube",
  headers: {
    "x-vercel-protection-bypass": "<secret>",
  },
})

await seedFromLiveApi(db, live_client)
```

### Images

There is a single bundled image available for testing. To test with more images, populate the database using the method described above. The `image_id`s in the fake database will then point to `image_id`s from the live API and requests to the fake's `/images/view` endpoint will proxy through to the live API.

## Installation

Add this as a dependency to your project using [npm] with

```
$ npm install @seamapi/fake-devicedb
```

[npm]: https://www.npmjs.com/

## Development and Testing

### Quickstart

```
$ git clone https://github.com/seamapi/fake-devicedb.git
$ cd fake-devicedb
$ nvm install
$ npm install
$ npm run test:watch
```

Primary development tasks are defined under `scripts` in `package.json`
and available via `npm run`.
View them with

```
$ npm run
```

### Source code

The [source code] is hosted on GitHub.
Clone the project with

```
$ git clone git@github.com:seamapi/fake-devicedb.git
```

[source code]: https://github.com/seamapi/fake-devicedb

### Requirements

You will need [Node.js] with [npm] and a [Node.js debugging] client.

Be sure that all commands run under the correct Node version, e.g.,
if using [nvm], install the correct version with

```
$ nvm install
```

Set the active version for each shell session with

```
$ nvm use
```

Install the development dependencies with

```
$ npm install
```

[Node.js]: https://nodejs.org/
[Node.js debugging]: https://nodejs.org/en/docs/guides/debugging-getting-started/
[npm]: https://www.npmjs.com/
[nvm]: https://github.com/creationix/nvm

### Publishing

#### Automatic

New versions are released automatically with [semantic-release]
as long as commits follow the [Angular Commit Message Conventions].

[Angular Commit Message Conventions]: https://semantic-release.gitbook.io/semantic-release/#commit-message-format
[semantic-release]: https://semantic-release.gitbook.io/

#### Manual

Publish a new version by triggering a [version workflow_dispatch on GitHub Actions].
The `version` input will be passed as the first argument to [npm-version].

This may be done on the web or using the [GitHub CLI] with

```
$ gh workflow run version.yml --raw-field version=<version>
```

[GitHub CLI]: https://cli.github.com/
[npm-version]: https://docs.npmjs.com/cli/version
[version workflow_dispatch on GitHub Actions]: https://github.com/seamapi/fake-devicedb/actions?query=workflow%3Aversion

## GitHub Actions

_GitHub Actions should already be configured: this section is for reference only._

The following repository secrets must be set on [GitHub Actions]:

- `NPM_TOKEN`: npm token for installing and publishing packages.
- `GH_TOKEN`: A personal access token for the bot user with
  `packages:write` and `contents:write` permission.
- `GIT_USER_NAME`: The GitHub bot user's real name.
- `GIT_USER_EMAIL`: The GitHub bot user's email.
- `GPG_PRIVATE_KEY`: The GitHub bot user's [GPG private key].
- `GPG_PASSPHRASE`: The GitHub bot user's GPG passphrase.

[GitHub Actions]: https://github.com/features/actions
[GPG private key]: https://github.com/marketplace/actions/import-gpg#prerequisites

## Contributing

> If using squash merge, edit and ensure the commit message follows the [Angular Commit Message Conventions] specification.
> Otherwise, each individual commit must follow the [Angular Commit Message Conventions] specification.

1. Create your feature branch (`git checkout -b my-new-feature`).
2. Make changes.
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Create a new draft pull request.
6. Ensure all checks pass.
7. Mark your pull request ready for review.
8. Wait for the required approval from the code owners.
9. Merge when ready.

[Angular Commit Message Conventions]: https://semantic-release.gitbook.io/semantic-release/#commit-message-format

## License

This npm package is Copyright (c) 2021-2023 Seam Labs, Inc.

## Warranty

This software is provided by the copyright holders and contributors "as is" and
any express or implied warranties, including, but not limited to, the implied
warranties of merchantability and fitness for a particular purpose are
disclaimed. In no event shall the copyright holder or contributors be liable for
any direct, indirect, incidental, special, exemplary, or consequential damages
(including, but not limited to, procurement of substitute goods or services;
loss of use, data, or profits; or business interruption) however caused and on
any theory of liability, whether in contract, strict liability, or tort
(including negligence or otherwise) arising in any way out of the use of this
software, even if advised of the possibility of such damage.
