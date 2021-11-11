## Я хочу посмотреть или поразрабатывать что-то на основе картомагии Shadowrun 2020. Что мне делать?

Исходная картомагия зависела примерно от 7 внешних систем, но на этапе постпродакщена внешние зависимости были заменены заглушками или отключены. Поэтому можно посмотреть на картомагию на игровых данных и процентов 90 функционала будет работать.

### Скачивание картомагии и установка зависимостей

1. Необходимо установить Node.js https://nodejs.org. Вместе с ним будет установлен менеджер пакетов npm

2. Скачиваем исходники из репозитория https://github.com/sr-2020/maps-n-magic, ветка master

3. Картомагия это монорепозиторий на основе Lerna. Предполагается, что вы её установите глобально:
```
npm i -g lerna
```

4. Переходим в корень проекта и ставим корневые зависимости
```
npm i
```

5. Ставим зависимости пакетов монорепозитория
```
npm run install-package-deps
```

6. В проекте 4 компонента верхнего уровня: sr2020-mm-server, sr2020-mm-client, sr2020-mm-player-server, sr2020-mm-player-client. Каждый компонент требует настройки переменных среды, в том числе секреты. Самое простое скопировать файлы переменных по умолчанию. Этого достаточно для демо или разработки.
```
packages\sr2020-mm-server\.env.mocked => packages\sr2020-mm-server\.env
packages\sr2020-mm-client\.env.mocked => packages\sr2020-mm-client\.env
packages\sr2020-mm-player-server\.env.mocked => packages\sr2020-mm-player-server\.env
packages\sr2020-mm-player-client\.env.mocked => packages\sr2020-mm-player-client\.env
```
В файлах sr2020-mm-client\.env и sr2020-mm-player-client\.env можно указать язык клиента. Поддерживаются русский и английский. По умолчанию стоит русский язык. Язык можно переключить на лету прямо в клиенте. 

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

3. Старт игроцкого сервера
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
