# RN-play-New user microservice

### Установка:

> - npm install -g **ts-node**
> - npm install

### Что ставилось и зачем:

- [eslint](https://eslint.org/docs/user-guide/getting-started 'eslint')
  > Следит за тем, что бы все писали код в едином стандарте
- [prettier](https://prettier.io/ 'prettier')
  > форматирует код, убирает все лишнее, типа пробелов. Переформатирует и оптимизирует код.
- [husky](https://typicode.github.io/husky/#/ 'husky')
  > добавляет git hooks. Не позволит вам закомитить код написаный не постандартам.
- [ express.js](https://expressjs.com/ru/ 'express.js')
- [nodemon](https://github.com/remy/nodemon 'nodemon')
  > так как нода не видет изменений в коде после запуска, то нужен инструмент, который помогает следить за изменениями в коде и перезагружать ноду. nodemon как раз этим и занимается.
- [typescript](https://www.typescriptlang.org/ 'typescript')
- [jest](https://jestjs.io/ru/docs/getting-started 'jest')
  > пакет для юнитестов, что бы юнитесты можно было писать на тайпскрипте, нужно доставить модуль - ts-jest, @types/jest, babel-jest и добавить конфигурацию в package.json
- [express-validator](https://www.npmjs.com/package/express-validator 'express-validator')
  > пакет для валидации приходящих значений
- [cors](https://www.npmjs.com/package/cors/ 'cors')

  > пакет для CORS policy

  - [uuid](https://www.npmjs.com/package/uuid 'uuid')
    > пакет для генерации id
  - [bcrypt](https://www.npmjs.com/package/bcrypt 'bcrypt')
    > пакет для криптографии данных(паролей)
  - [сlass-transformer](https://www.npmjs.com/package/class-transformer 'class-transformer')
    > пакет для пребразования DTO в класс
  - [class-validator](https://www.npmjs.com/package/class-validator 'class-validator')

    > пакет для валидации классов с помощью декораторов

    - [json-web-token](https://www.npmjs.com/package/json-web-token 'json-web-token')
      > пакет для работы с токенами

### npm

- [@types/express](https://github.com/DefinitelyTyped/DefinitelyTyped '@types/express')
- [ @types/node](https://www.typescriptlang.org/dt/search?search= ' @types/node')
  > модули нужные чтобы подружить ноду и экспресс с тайпскриптом

### config files

.eslintrc.js

> конфигурация линтера,
> генерируется : eslint --init

.prettierrc.json

> конфигурация prettier,
> генерируется : echo {}> .prettierrc.json

tsconfig.json

> конфигурация TypeScript,
> генерируется : tsc --init

.eslintignore

> всё что описано в этом файле будет игнорироватся линтером,
> генерируется : echo .eslintignore

.gitignore

> всё что описано в этом файле будет игнорироватся git,
> генерируется : echo > .gitignore

package.json

> конфигурация npm,
> генерируется : npm init

.env

> конфигурация переменных окружения
> Переменные .env для User Service

- EXPRESS_PORT=8080
  AUTH=yes
  POSTGRES_USER=nodanorm
  POSTGRES_PASSWORD=nodanormpass
  POSTGRES_DB=NodanormDB
  POSTGRES_PORT=5432
  POSTGRES_HOST=localhost
  VERIFICATION_CODE='111325'
  CODE_EXPIRATION_TIME=10
  SMS_BLOCK_EXPIRATION=1
  USER_BLOCK_EXPIRATION=1
  MAX_CODE_TRIES=5
  COOLDOWN_TIME=1
  JWT_ACCESS_SECRET=SECRET_KEY_NODANORM
  JWT_REFRESH_SECRET=SECRET_KEY_NODANORM
  JWT_ACCESS_EXPIRES_IN=7m
  JWT_REFRESH_EXPIRES_IN=7d
-

### команды:

`npm run tsc` - транспилирует TypeScript в JS,

`npm run dev` - запускает сервер в дев режиме

`npm run test` - запускает тестировани на основе написанных тестов

`npm run seed:run` - запускает seeding базы данных значениями

`npm run schema:drop` - удаляет схему

`npm run lint:fix` - запускает линтер, линтер исправит частично код по правилам стандартов, и выведет ошибки требующие исправления с вашей стороны.
Эта же команда запускается при попытке коммита и прерывает коммит если обнаружены ошибки. Поэтому команда обязательна к запуску перед любым коммитом.

`docker-compose -f .\docker-compose.dev.yml up -d` - создает базу данных для микросервиса(Выполнить команду для работы с БД при инициализации проекта).

### после клона репозитория:

> изменить имя файла "dot.env" на ".env" и изменить содержимое на вышеуказанные переменные
> иметь установленную систему для работы с БД например PG Admin.
> Создать с помощью PSQL Shell роль nodanorm с паролем из ЕНВ переменных с супер юзером,создать БД NodanormDB,РЕГИСТР ОБЯЗАТЕЛЕН!
> Запустить проект с помощью npm run dev
> Если запустилось проверить БД с помощью установленной системы контроля БД.
> Если бд работает нормально запустить скрипт npm run seed:run,для заполнения таблицы security-questions.
