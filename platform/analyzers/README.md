# `@namics/frontend-defaults-analyzers`
Location for pluggable core analyzers which will do an async validation job against the files located in the regarding project context and return meta information.

### Usage

```ts
import { ProjectAnalyzer } from '@namics/frontend-defaults-platform-core';
import {
    EditorconfigAnalyzer, EditorConfigAnalyzerResult,
    WebpackAnalyzer, WebpackAnalyzerResult,
    LicenseAnalyzer, LicenseAnalyzerResult
} from '@namics/frontend-defaults-analyzers';

type AnalyzerResult = 
    EditorConfigAnalyzerResult &
    WebpackAnalyzerResult &
    LicenseAnalyzerResult;

(async () => {
    const analyzer = await new ProjectAnalyzer<AnalyzerResult>({
        context: '/path/to/project',
        analyzers: [
            EditorconfigAnalyzer,
            WebpackAnalyzer,
            LicenseAnalyzer
        ]
    }).boot();

    analyzer.analytics.editorconfig; // true
    analyzer.analytics.webpackConfigs; // ['webpack.config.dev.js', ...]
})();
```

### Bundle conents

> Each analyzer compes with a related result type, which is most common the name of the analyer with a 'Result' appendix e.G. `BentoAnalyzer` will export the correct result type as `BentoAnalyzerResult`.

| Analyzer               | Implemented | Comments / Todo's            |
|------------------------|-------------|------------------------------|
| [BentoAnalyzer](src/#) | :x: | - |
| [CommitlintAnalyzer](src/#) | :x: | - |
| [ContributeBuddyAnalyzer](src/#) | :x: | - |
| [ConventionalChangelogAnalyzer](src/#) | :x: | - |
| [EditorconfigAnalyzer](src/editorconfig.ts) | :white_check_mark: | - |
| [ESLintAnalyzer](src/eslint.ts) | :white_check_mark: | - |
| [GitAttributesAnalyzer](src/#) | :x: | - |
| [GitHooksAnalyzer](src/githooks.ts) | :white_check_mark: | - |
| [GitIgnoreAnalyzer](src/gitignore.ts)  | :white_check_mark: | - |
| [LicenseAnalyzer](src/license.ts) | :white_check_mark: | - |
| [NitroAnalyzer](src/nitro.ts) | :white_check_mark: | - |
| [NodeAnalyzer](src/node.ts) | :white_check_mark: | - |
| [NPMRCAnalyzer](src/npmrc.ts) | :white_check_mark: | - |
| [ReadmeAnalyzer](src/radme.ts) | :white_check_mark: | - |
| [TSLintAnalyzer](src/tslint.ts) | :white_check_mark: | - |
| [TypeScriptAnalyzer](src/typescript.ts) | :white_check_mark: | - |
| [WebpackAnalyzer](src/webpack.ts) | :white_check_mark: | - |
