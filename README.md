[ENG](#eng) [RUS](#rus)

# ENG

## I want to see or develop something with Shadowrun 2020 maps-n-magic. What should I do?

Production maps-n-magic depends on 7 external systems but during postproduction all external dependencies were mocked or disabled. So you see maps-n-magic on real game data and 90% of functions will work.

### Downloading and dependency installment

1. You should install Node.js https://nodejs.org. Automatically it will install package manager npm

2. Download sources from repo https://github.com/sr-2020/maps-n-magic, branch sr2020_final

3. Maps-n-magic is the Lerna monorepo. Supposed that you install it globally:
```
npm i -g lerna
```

4. Go to the project root directory and install dependencies:
```
npm run default-install-n-configure
```

This call installs main project dependencies, package dependencies and initializes packages env files.

In files sr2020-mm-client\.env and sr2020-mm-player-client\.env you can specify default client lang. Supported English and Russian. English is the default language. You can switch language in the client on fly.

### How to build and start maps-n-magic in demo mode?

1. This command compiles all TypeScript code, build web clients (made with create-react-app) and copy clients to necessary server directories.
```
npm run build-and-deploy
```

2. Start the main server
```
npm run start:server
```
You will login with any login/password in http://localhost:3001

3. Start the player server (requires running main server)
```
npm run start:player-server
```
You will login with any login/password in http://localhost:3002
Don't forget to decrease sound volume - mana ocean sound may be loud.


### How to build and start maps-n-magic in development mode?

1. Start incremental TypeScript build for the server packages and the core:
```
cd packages\sr2020-mm-deploy-scripts
npm run ts:watch-all
```

2. Start the main server in watch mode
```
cd packages\sr2020-mm-server
npm run watch:server
```

3. Start the main client (requires running main server)
```
cd packages\sr2020-mm-client
npm run start
```
It will open client page http://localhost:3020/. Use any login/password to login.

4. Start the player server (requires running main server)
```
cd packages\sr2020-mm-player-server
npm run watch:player-server
```

5. Start the player client (requires running player server)
```
cd packages\sr2020-mm-player-client
npm run start
```
It will open client page http://localhost:3040/. Use any login/password to login.
Don't forget to decrease sound volume - mana ocean sound may be loud.

# RUS

## Я хочу посмотреть или поразрабатывать что-то на основе картомагии Shadowrun 2020. Что мне делать?

Исходная картомагия зависела примерно от 7 внешних систем, но на этапе постпродакшена внешние зависимости были заменены заглушками или отключены. Поэтому можно посмотреть на картомагию на игровых данных и процентов 90 функционала будет работать.

### Скачивание картомагии и установка зависимостей

1. Необходимо установить Node.js https://nodejs.org. Вместе с ним будет установлен менеджер пакетов npm

2. Скачиваем исходники из репозитория https://github.com/sr-2020/maps-n-magic, ветка sr2020_final

3. Картомагия это монорепозиторий на основе Lerna. Предполагается, что вы её установите глобально:
```
npm i -g lerna
```

4. Переходим в корень проекта и ставим зависимости
```
npm run default-install-n-configure
```

Этот скрипт установит корневые зависимости, зависимости пакетов и скопирует локальные env файлы.

В файлах sr2020-mm-client\.env и sr2020-mm-player-client\.env можно указать язык клиента. Поддерживаются русский и английский. По умолчанию стоит английский язык. Язык можно переключить на лету прямо в клиенте.

### Как собрать и запустить картомагию в демо режиме?

1. Эта команда скомпилирует весь TypeScript, соберёт клиенты (сделано на create-react-app) и скопирует клиенты в папки серверов.
```
npm run build-and-deploy
```

2. Старт главного сервера:
```
npm run start:server
```
Вход в браузере с любым логином паролем http://localhost:3001

3. Старт игроцкого сервера (требует работающего главного сервера)
```
npm run start:player-server
```
Вход в браузере с любым логином паролем http://localhost:3002
Не забудьте приглущить звук из-за громкого прибоя океана маны.


### Как собрать и запустить картомагию в режиме разработки?

1. Запуск инкрементальной сборки серверных пакетов и ядра:
```
cd packages\sr2020-mm-deploy-scripts
npm run ts:watch-all
```

2. Старт главного сервера
```
cd packages\sr2020-mm-server
npm run watch:server
```

3. Старт главного клиента (требует работающего главного сервера)
```
cd packages\sr2020-mm-client
npm run start
```

Откроется страница в браузере по адресу http://localhost:3020/. Вход с любым логином паролем.

4. Старт игроцкого сервера (требует работающего главного сервера)
```
cd packages\sr2020-mm-player-server
npm run watch:player-server
```

5. Старт игроцкого клиента (требует работающего игроцкого сервера)
```
cd packages\sr2020-mm-player-client
npm run start
```

Откроется страница в браузере по адресу http://localhost:3040/. Вход с любым логином паролем.
