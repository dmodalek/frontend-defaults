# `@namics/frontend-defaults-analyzers`
Location for pluggable core analyzers which will do an async validation job against the files located in the regarding project context and return meta information.

### Usage

```ts
import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import { editorConfigAnalyzer, webpackAnalyzer, licenseAnalyzer } from '@namics/frontend-defaults-analyzers';

(async () => {
    const results = analyze(
        '/path/to/project', 
        editorConfigAnalyzer,
        webpackAnalyzer,
        licenseAnalyzer
    );

    results.editorconfig; // true
    results.webpackConfigs; // ['webpack.config.dev.js', ...]
})();
```

### Bundle conents

> Each analyzer compes with a related result type, which is most common the name of the analyer with a 'Result' appendix e.G. `BentoAnalyzer` will export the correct result type as `BentoAnalyzerResult`.

| Analyzer               | Implemented | Comments / Todo's            |
|------------------------|-------------|------------------------------|
| [BentoAnalyzer](src/#) | :x: | How can we determine a bento repo? |
| [CommitlintAnalyzer](src/#) | :x: | How should we determine the installation |
| [ContributeBuddyAnalyzer](src/#) | :x: | Talk back with author |
| [ConventionalChangelogAnalyzer](src/#) | :x: | - |
| [EditorconfigAnalyzer](src/editorconfig.ts) | :white_check_mark: | - |
| [ESLintAnalyzer](src/eslint.ts) | :white_check_mark: | - |
| [GitAttributesAnalyzer](src/#) | :x: | Really needed? |
| [GitHooksAnalyzer](src/githooks.ts) | :white_check_mark: | - |
| [GitIgnoreAnalyzer](src/gitignore.ts)  | :white_check_mark: | - |
| [LicenseAnalyzer](src/license.ts) | :white_check_mark: | - |
| [NitroAnalyzer](src/nitro.ts) | :white_check_mark: | - |
| [NodeAnalyzer](src/node.ts) | :white_check_mark: | - |
| [NPMRCAnalyzer](src/npmrc.ts) | :white_check_mark: | - |
| [ReadmeAnalyzer](src/radme.ts) | :white_check_mark: | - |
| [RepositoryAnalyzer](src/repository.ts) | :white_check_mark: | - |
| [StylelintAnalyzer](src/stylelint.ts) | :white_check_mark: | - |
| [TSLintAnalyzer](src/tslint.ts) | :white_check_mark: | - |
| [TypeScriptAnalyzer](src/typescript.ts) | :white_check_mark: | - |
| [WebpackAnalyzer](src/webpack.ts) | :white_check_mark: | - |
