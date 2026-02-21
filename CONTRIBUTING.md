# Contributing

Contributions are **welcome**. 😄👍🏻🍀🦋

Please read and understand the [contribution guide](https://yiitap.pileax.ai/guide/contributing) before creating an issue or pull request.


## 😄 Welcome examples
- Failing regression tests as bug reports.
- Documentation improvements, e. g. fix a typo, add a section.
- New features for existing extensions, e. g. a new configureable option.
- Well explained, non-breaking changes to the core.

## 🛠️ Set up the development environment

### Prerequisites
You'll need following installed first:
- Git
- Node
- pnpm
- git-cz

```shell
# pnpm
sudo npm install -g pnpm

# git-cz
sudo npm install -g git-cz
```

### Fork and clone the repo to your local machine
```shell
git clone git@github.com:yourname/yiitap.git
```

### Install dependencies
```shell
cd yiitap
pnpm install
```

### Run dev
Build all package first:
```shell
pnpm build
```

Run vue app by default:
```shell
pnpm dev
```
Open http://localhost:5173/yiitap in your favorite browser.

## 🧑🏻‍💻 Develop and Commit
### Create new feature branch
```shell
git checkout -b feat/new-feature
```

### Code changes
Make specific code changes for your new feature.

### lint, test and build
#### lint
```shell
pnpm lint
```
Make sure there are no lint issues, fix it using:
```shell
pnpm lint-fix
```

#### test
```shell
pnpm test-ci
```

#### build
```shell
pnpm build
```

### Preview
```shell
pnpm preview
```
You may go to http://localhost:4173/yiitap to check if your changes work as expected.

### Generate changeset
```shell
pnpm changeset
```

### Commit
Now, it is safe to commit.
```shell
git add .
git cz
```

## 🚀‍ Pull Request
### Push your branch
```shell
git push origin feat/new-feature
```

### Creat PR
We recommend create pr using template:
```shell
gh pr create --title "feat: new feature" --body-file .github/pull_request_template.md
```
Or create [pull request](https://github.com/pileax-ai/yiitap/pulls) at Github.

## 📃 Documentation
Documentation is as important as code. Please update the documentation repository corresponding to any alterations you make in the code.

- [Code Repo](https://github.com/pileax-ai/yiitap): Modify the code here.
- [Documentation Repo](https://github.com/pileax-ai/yiitap-docs): Update or add documentation here to reflect changes made in the Yiitap repository.
