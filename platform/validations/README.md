# `@namics/frontend-defaults-validations`


### Run a single validation
```ts
import { analyze } from '@namics/frontend-defaults-platform-core';
import { tslintAnalyzer, typescriptAnalyzer } from '@namics/frontend-defaults-platform-analyzers';
import { typescriptValidation } from '@namics/frontend-defaults-platform-validations';

(async () => {
    const PROJECT_PATH = './path/to/project';
    const analytics = await analyze(PROJECT_PATH, tslintAnalyzer, typescriptAnalyzer);

    typescriptValidation(PROJECT_PATH, analytics); // will return validation results
})();
```

### Run multiple validations

tbd.