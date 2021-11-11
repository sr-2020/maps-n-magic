import { Feature } from "sr2020-mm-event-engine";

export const features: Feature[] = [
  {
    "id": "ip-code",
    "humanReadableName": "",
    "description": "Ты можешь написать запрос мастеру и получить идентификатор какого-либо хоста. Работает раз в 3 часа",
    "prerequisites": [
      "arch-digital",
      "alpha-code"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "agnus-dei",
    "humanReadableName": "Agnus dei (P)",
    "description": "В ритуальных практиках соучастия ты считаешься за 3х человек",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "ai-researcher",
    "humanReadableName": "AI eXpand",
    "description": "Этот ИИ занимается Расширением в Цифровом мире и Проектами. Все способности этой ветки требуют обращения к мастеру-региональщику.",
    "prerequisites": [
      "arch-digital",
      "sub-ai"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "ai-manager",
    "humanReadableName": "AI eXploit",
    "description": "Этот ИИ занимается Эксплуатацией. ВАЖНО. Все способности этой ветки требуют при активации обращения к мастеру-региональщику.",
    "prerequisites": [
      "arch-digital",
      "sub-ai"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "ai-explorer",
    "humanReadableName": "AI eXplore",
    "description": "Этот ИИ занимается не-цифровым миром.",
    "prerequisites": [
      "arch-digital",
      "sub-ai"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "ai-troubleshooter",
    "humanReadableName": "AI eXterminate",
    "description": "Этот ИИ занимается Уничтожением и Техномантами.",
    "prerequisites": [
      "arch-digital",
      "sub-ai"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "ai-runaway",
    "humanReadableName": "AI Бегство из Основания",
    "description": "Ты можешь покинуть основание когда захочешь. В процессе выхода тебя никто не может остановить или как-то с тобой взаимодейстовать. Ты не можешь взаимодействовать с другими персонажами или объектами. ",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "ai-add-time-1",
    "humanReadableName": "AI больше времени +1",
    "description": "У вашей группы на 3 минуты больше времени в данже. Покажи это при входе в данж.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "ai-add-time-2",
    "humanReadableName": "AI больше времени +2",
    "description": "У вашей группы еще на 3 минуты больше времени в данже. (итого +6) Покажи это при входе в данж.",
    "prerequisites": [
      "ai-techno-copy",
      "ai-add-time-1"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "ai-add-time-3",
    "humanReadableName": "AI больше времени +3",
    "description": "У вашей группы еще на 4 минуты больше времени в данже. (итого +10) Покажи это при входе в данж.",
    "prerequisites": [
      "ai-techno-copy",
      "ai-add-time-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "ai-add-basement",
    "humanReadableName": "AI добавить опору",
    "description": "Ты можешь создать дополнительную \"опору\" (круг 20 см). Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "ai-levitation",
    "humanReadableName": "AI левитация",
    "description": "Ты можешь спокойно обойти препятствие или топь по земле, считается, что ты летишь. Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy",
      "ai-magnetism",
      "ai-add-basement"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "ai-magnetism",
    "humanReadableName": "AI магнетизм",
    "description": "У тебя в руках магнит, он притягивает любой предмет, который надо собрать в этой комнате, но только один. Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "ai-bell-silence",
    "humanReadableName": "AI молчание колокольчиков",
    "description": "Ты можешь задевать колокольчики, матрица их не услышит. Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "ai-one-for-all",
    "humanReadableName": "AI один за всех",
    "description": "Ты можешь пройти эту комнату один за всю свою команду. Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "ai-bond-breaker",
    "humanReadableName": "AI освобождение от пут",
    "description": "Ты можешь освободить одну руку себе или товарищу. Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy",
      "ai-remove-excees"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "ai-remove-excees",
    "humanReadableName": "AI убрать все лишнее",
    "description": "Теперь матрица подскажет тебе, какие детали лишние.  Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy",
      "ai-remove-half"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "ai-remove-half",
    "humanReadableName": "AI убрать половину ",
    "description": "Теперь матрица убирает половину деталей, чтобы уменьшить сложность конструкции.  Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "ai-photo-memory",
    "humanReadableName": "AI фото память",
    "description": "Ты можешь сфотографировать объект и переслать фото другому участнику команды.  Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "ai-second-sight",
    "humanReadableName": "AI ясновидение",
    "description": "Теперь матрица (в лице игротеха) может подсказать тебе расположение двух деталей конструкции.  Работает раз в 10 минут.",
    "prerequisites": [
      "arch-digital",
      "ai-techno-copy",
      "ai-photo-memory"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "allo-homorus",
    "humanReadableName": "Allo, homorus! (A)",
    "description": "Активация дает возможность тихо открыть один замок за 1 минуту - все это время надо держаться рукой за сертификат замка.\nТребуемая эссенция: больше 2. Кулдаун 20 минут",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "arpscan",
    "humanReadableName": "arpscan",
    "description": "новая команда:arpscan\nВыводит список всех Персон, находящихся на хосте\n\nВысокие значения Sleaze обмануть эту команду",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "arrowgant",
    "humanReadableName": "Arrowgant (A)",
    "description": "Активируемая защита от дистанционного легкого оружия. Требуемая эссенция: больше 4. Время действия \"5+уровень маны в локации\" минут. Кулдаун 15 минут.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "arrowgant-effect",
    "humanReadableName": "Arrowgant эффект",
    "description": "Ты защищён от дистанционных атак (только от нерфов).",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "astralopithecus",
    "humanReadableName": "Astralopithecus (A)",
    "description": "Ты можешь из реала видеть и изгонять сущности, находящиеся в астрале. Требуемая эссенция: больше 3. Время действия 20 минут. Кулдаун 30 минут",
    "prerequisites": [
      "arch-mage",
      "allo-homorus"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "astralopithecus-rage",
    "humanReadableName": "AstralopithecusRage эффект",
    "description": "Ты можешь видеть сущности, находящиеся в астрале (красный дождевик), и изгонять их из помещения, в котором вы находитесь, или отгонять на длину твоего выпада холодным оружием Попадание по ним не снимает у них хитов, но вынуждает отойти за пределы твоей атаки. Они не могут действовать на тебя физически.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "auto-link-lock",
    "humanReadableName": "autolock",
    "description": "новая команда: autolock [target]\nАвтоматически атакует указанного декера при встрече(то есть без ручного ввода команды)",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-2"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "avalanche-able",
    "humanReadableName": "Avalanche эффект",
    "description": "У всех персонажей, присутствовавших в момент активации заклинания в реале в радиусе 5 метров от заклинателя (либо в рамках помещения, если оно меньше)  и взаимодействующих с ним (слышащих/видящих/нападающих на него), хиты снижаются на {{ amount }}. Эффект не действует на самого заклинателя и тех, кого он вслух укажет",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "back-up-ai",
    "humanReadableName": "BackUp",
    "description": "После смерти в Красной комнате вы восстанавливаетесь в полных хитах как на начало боя и можете продолжить сражаться. Работает один раз в 6 часов.",
    "prerequisites": [
      "arch-digital",
      "ai-troubleshooter"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "bathory-charger",
    "humanReadableName": "Bathory Charger (P)",
    "description": "Можно использовать людей в тяжране (сканируя их QR) для увеличения (по времени, а не на один каст) доступной Мощи и снижения Отката",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 40
  },
  {
    "id": "birds",
    "humanReadableName": "Birds (S)",
    "description": "В течение Мощь*3 минут каждую минуту со всех в реале в радиусе 5 метров от точки активации спелла (либо в пределах этого помещения) снимается по 1 хиту (рекомендуется привлекать для подтверждения эффекта представителя МГ). Если маг отходит от точки произнесения заклинания больше чем на 2 метра - действие заклинания прекращается.",
    "prerequisites": [
      "arch-mage",
      "live-long-and-prosper",
      "shtopping",
      "mene",
      "suit-up"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "birds-able",
    "humanReadableName": "Birds effect",
    "description": "Каждые 60 секунд в течение {{ amount }} минут у всех присутствующих в реале  (мясо/экто/дрон) в радиусе 5 метров от точки активации спелла (либо в пределах этого помещения, если оно меньше) текущие хиты уменьшаются на 1 на срок 30 минут. Эффект не действует на самого заклинателя и тех, кого он вслух укажет.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "black-matter",
    "humanReadableName": "Black matter",
    "description": "У духа в эктоплазменном теле 6 хитов.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "brasilia",
    "humanReadableName": "Brasilia (S)",
    "description": "В течение Мощь*6 минут все следы всех заклинаний в этой локации, попадающих в интервал \"последние 10 минут\", будут каждую минуту сдвигаться в прошлое на 5 минут.",
    "prerequisites": [
      "arch-mage",
      "tempus-fugit"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "hack-deck-broadcast",
    "humanReadableName": "broadcast",
    "description": "Новая команда: broadcast\nПозволяет послать фразу всем собравшимся собрашився на одном хосте с тобой",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "hack-deck-burn",
    "humanReadableName": "burn",
    "description": "новая команда: burn\nПозволяет повредить кибердеку поверженного хакера. Подлый удар по кошельку!",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "bypass",
    "humanReadableName": "bypass",
    "description": "новая команда: bypass\nты переходишь в ghost режим, который сохранится до следующего входа в хотсим\nВ нем, в зависимости от значения Sleaze, ты сможешь обойти некоторое число ICE, запустить несколько команд deploy и useapi\nПри этом ты не сможешь атаковать и применять практически все остальные команды\nОСТОРОЖНО! Помни про путь назад. Ведь считается каждый проход ноды, и ты можешь крепко застрять!",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-3"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "cacophony",
    "humanReadableName": "Cacophony (S)",
    "description": "В течение Мощь*2 минуты каждую минуту все в астрале в радиусе 5 метров от точки активации спелла (либо в пределах этого помещения) кроме самого мага и его друзей должны сделать 20 приседаний. Кто не делает - должен немедленно покинуть астральное тело (рекомендуется привлекать для подтверждения эффекта представителя МГ)",
    "prerequisites": [
      "arch-mage",
      "astralopithecus"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "cacophony-able",
    "humanReadableName": "Cacophony effect",
    "description": "Каждые 60 секунд в течение {{ amount }} минут всем присутствующим в астрале (кроме самого мага и тех, кого он вслух укажет) в радиусе 5 метров от точки активации спелла (либо в пределах этого помещения) необходимо сделать 20 приседаний.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "charm",
    "humanReadableName": "Charm (S)",
    "description": "Повысить цели Харизму на 1 на период=Мощь*5 минут. Если Мощь < 4, то эффекта не будет.  Цель должна предоставить QR-код добровольно.",
    "prerequisites": [
      "arch-mage",
      "tax-free"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "binding",
    "humanReadableName": "Cвязывание",
    "description": " Ты можешь связать человека, который не сопротивляется (добровольно) или оглушен или тяжело ранен. Для моделирования связывания человеку надевают на кисти рук две веревочные петли (чисто символические, на самом деле ничего связывать не надо). Эти петли запрещено прятать, по человеку всегда должно быть понятно, что он связан.",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "sprites-basic",
    "humanReadableName": "Cпрайты в Основании",
    "description": "\"Ты можешь пользоваться спрайтом \"строительные перчатки\" в основании\"",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "hack-deck-deanon",
    "humanReadableName": "deanon",
    "description": "новая команда: deanon\nОтображает адрес PAN хоста и SIN поверженного (выброшенного в ходе боя из Матрицы) декера",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "death-touch",
    "humanReadableName": "Death Touch (S)",
    "description": "В течение Мощь*3 минуты маг способен касанием и криком \"Смертный час!\" лишить всех хитов одно любое мясное/эктоплазменное тело - игнорируя любую броню.",
    "prerequisites": [
      "arch-mage",
      "ground-heal"
    ],
    "availability": "open",
    "karmaCost": 80
  },
  {
    "id": "death-touch-effect",
    "humanReadableName": "Death Touch эффект",
    "description": "Ты можешь касанием (рукой или кинжалом) И криком \"Смертный час!\" лишить всех хитов одно любое мясное/эктоплазменное тело - игнорируя любую броню",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "deploy",
    "humanReadableName": "deploy",
    "description": "новая команда: deploy\nУстанавливает агента (софт) на Ноду Хоста",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "dictator-control",
    "humanReadableName": "Dictator Control (P)",
    "description": "При чтении астральных следов ты извлекаешь на 20% больше ауры",
    "prerequisites": [
      "arch-mage",
      "trackpoint"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "ai-techno-copy",
    "humanReadableName": "Digital Techno Copyrast",
    "description": "Этот ИИ научился подражать способностям Техноманта. Все эти способности работают только в Основании.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "dispirit",
    "humanReadableName": "Dispirit",
    "description": "Вылезти из духа\n*Применяется для нормального выхода из эктотела*",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "dual-layer-suit",
    "humanReadableName": "Dual layer suit (P)",
    "description": "У духов, которых ты призываешь на 1 хит больше",
    "prerequisites": [
      "arch-mage",
      "suit-up"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "dumbie",
    "humanReadableName": "Dumbie (S)",
    "description": "Понизить Интеллект. На Мощь*10 минут понизить на 1, если Мощь <4, иначе на 2 Интеллект цели, указанной добровольно предоставленным qr-кодом.",
    "prerequisites": [
      "arch-mage",
      "shtopping"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "dumpty-humpty",
    "humanReadableName": "Dumpty-Humpty (S)",
    "description": "Перманентно понизить на 1 имеющийся штраф от дамп-шока цели, указанной добровольно предоставленным qr-кодом. При Мощи 4+ дамп-шок удаляется весь",
    "prerequisites": [
      "arch-mage",
      "tax-free"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "persistent-deploy",
    "humanReadableName": "Durable deployments",
    "description": "Разблокирует ключ команды deploy: --durable\n\nПозволяет агенту переживать обновление хоста",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-3",
      "deploy"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "hack-deck-echo",
    "humanReadableName": "echo",
    "description": "Новая команда: echo\nПослать фразу всем собравшимся на одной ноде с тобой",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-hackerman-decker",
      "level": 1
    }
  },
  {
    "id": "enlarge-my-pencil",
    "humanReadableName": "Enlarge My Pencil (S)",
    "description": "На Мощь*20 минут выдаёт магу способность \"Pencil, large!\" (одно холодное оружие в руках 5 минут будет считаться тяжёлым), потребуется её активация перед использованием. Чем больше Мощь, тем дольше сроки хранения",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "enlarge-your-pencil",
    "humanReadableName": "Enlarge Your Pencil (S)",
    "description": "Большой карандаш. На Мощь*20 минут выдаёт другому существу способность \"Pencil, large!\" (одно холодное оружие в руках 1 минуту будет считаться тяжёлым), потребуется её активация перед использованием.",
    "prerequisites": [
      "arch-mage",
      "charm",
      "dumpty-humpty",
      "smartie"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "faerbol",
    "humanReadableName": "Faerbol (A)",
    "description": "У мага на 10 минут появляется пассивная способность Fireball-Эффект, позволяющая кинуть 1 файербол. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие).",
    "prerequisites": [
      "arch-mage",
      "arrowgant"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "fares",
    "humanReadableName": "Fares (S)",
    "description": "Узнать ауру локации",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "fast-charge",
    "humanReadableName": "Fast charge (S)",
    "description": "У мага на Мощь*10 минут появляется пассивная способность Fast Charge, позволяющая кидать молнии. Молния должна выглядеть как обшитый мягким теннисный шар с красной лентой и длинным (не менее 2м) хвостом, её попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных молний: Мощь + 1 (но не меньше 1),",
    "prerequisites": [
      "arch-mage",
      "arrowgant"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "fast-charge-able",
    "humanReadableName": "Fast Charge эффект",
    "description": "Можете кинуть {{ amount }} молний.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "feelmatrix",
    "humanReadableName": "feelmatrix",
    "description": "новая команда:feelmatrix\nТы теперь просто нутром чувствуешь, где в Основании можно надрать кому-то цифровой зад!\nВыдает список хостов, на которых есть другие декеры.\n\nВысокие значения Sleaze обмануть эту команду",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-3",
      "arpscan"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "fine-hearing",
    "humanReadableName": "Fine hearing (P)",
    "description": "Ты знаешь, какими способностями обладают духи вокруг тебя",
    "prerequisites": [
      "arch-mage",
      "spirit-master-1"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "hack-deck-fire",
    "humanReadableName": "fire",
    "description": "новая команда: fire\nпозволяет применять эксплойты типа \"бомба\"",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "fireball",
    "humanReadableName": "Fireball (S)",
    "description": "У мага на Мощь*4 минуты появляется пассивная способность Fireball-Эффект, позволяющая кидать файерболы. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных файерболов: Мощь/2 с округлением вверх",
    "prerequisites": [
      "arch-mage",
      "arrowgant"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "fireball-able",
    "humanReadableName": "Fireball эффект",
    "description": "Можете кинуть {{ amount }} огненных шаров.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "firestarter",
    "humanReadableName": "Firestarter",
    "description": "Можешь кинуть в одном бою до 5 файерболов",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "flee",
    "humanReadableName": "flee",
    "description": "новая команда:flee\nПозволяет попытаться сбежать из софт-лока (мягкого линклока). \nШанс успеха зависит от Sleaze",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "frog-skin",
    "humanReadableName": "Frog skin (S)",
    "description": "Понизить Харизму. На Мощь*10 минут понизить на 1, если Мощь <4, иначе на 2 Харизму цели, указанной добровольно предоставленным qr-кодом.",
    "prerequisites": [
      "arch-mage",
      "shtopping"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "geomancy",
    "humanReadableName": "Geomancy (P)",
    "description": "Ты можешь изучить заклинания геомантии.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "getdump",
    "humanReadableName": "getdump",
    "description": "новая команда: getdump\nЕсли ваш навык Firewall достаточно высок, вы сможете найти уязвимость в сканируемом ICE",
    "prerequisites": [
      "arch-hackerman-decker",
      "breacher-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "hack-deck-globalcast",
    "humanReadableName": "globalcast",
    "description": "Новая команда: globalcast\nПозволяет послать фразу ВСЕМ подключенным к Матрице. \nНе злоупотребляй, матрица обидчива",
    "prerequisites": [
      "arch-hackerman-decker",
      "hack-deck-broadcast"
    ],
    "availability": "closed",
    "karmaCost": 15
  },
  {
    "id": "god-mode",
    "humanReadableName": "god mode",
    "description": "GOD mode. Для откладки.\nДает персонажу декеру ВСЕ команды и дополнительные способности",
    "prerequisites": [
      "master-of-the-universe",
      "arch-hackerman-decker"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "grey-matter",
    "humanReadableName": "Grey matter",
    "description": "У духа в эктоплазменном теле 4 хита",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "ground-heal",
    "humanReadableName": "Ground Heal (S)",
    "description": "У мага появляется на время T/на одно использование (что раньше закончится) способность поднять другого персонажа из тяжрана. T=Мощь*10 минут",
    "prerequisites": [
      "arch-mage",
      "keep-yourself"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "ground-heal-ability",
    "humanReadableName": "Ground Heal эффект",
    "description": "Поднимает одну цель из тяжрана в полные хиты.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "hammer-of-justice",
    "humanReadableName": "Hammer of Justice (A)",
    "description": "Активируемый статус \"тяжелое\" для одноручного холодного оружия.  Требуемая эссенция: больше 3. Время действия \"10+3*уровень маны в локации\" минут. Кулдаун 25 минут.",
    "prerequisites": [
      "arch-mage",
      "i-will-survive"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "hammer-of-justice-effect",
    "humanReadableName": "Hammer of Justice эффект",
    "description": "Одноручное холодное оружие считается тяжёлым.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "hack-deck-harm",
    "humanReadableName": "harm",
    "description": "новая команда: harm\nПозволяет добить(КС) поверженного хакера биофидбеком.  грязная штука.",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-2"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "healton",
    "humanReadableName": "Healton (S)",
    "description": "Ты получаешь свойство Healtouch (касанием в течение минуты восстанавливать другим мясным/экто телам текущие хиты до максимума. Из тяжрана не поднимает) на Мощь*20 минут. Чем больше Мощь, тем больше срок",
    "prerequisites": [
      "arch-mage",
      "ground-heal"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "healtouch",
    "humanReadableName": "Healtouch (P)",
    "description": "Все мясные/экто тела, касающиеся владельца абилки на протяжении минуты, в конце этой минуты восстанавливают текущие хиты до максимума. Из тяжрана не поднимает.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "meta-vampire",
    "humanReadableName": "HMHVV, тип 1. Вампир",
    "description": "Ты пережил заражение HMHVV вирусом типа 1. Ты уверен, что ты теперь сверх-мета-человек. Иногда хочется кушать и тебе нужны другие металюди - в качестве обеда. ",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 20,
    "pack": {
      "id": "gen-meta-vampire",
      "level": 1
    }
  },
  {
    "id": "meta-ghoul",
    "humanReadableName": "HMHVV, тип 3. Гуль",
    "description": "Ты пережил заражение HMHVV вирусом типа 3 и стал Гулем. Ты ешь мясо металюдей. Вкусно, как курочка!",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 20,
    "pack": {
      "id": "gen-meta-ghoul",
      "level": 1
    }
  },
  {
    "id": "how-much-is-the-pssh",
    "humanReadableName": "How much is the pssh (A)",
    "description": "Увидеть уровень маны в локации",
    "prerequisites": [
      "arch-mage",
      "geomancy"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "i-will-survive",
    "humanReadableName": "I will survive (A)",
    "description": "Возможность самому в течение \"5+2*уровень маны в локации\" минут один раз автоматически перейти из тяжрана в состояние Здоров. Требуемая эссенция: больше 2. Кулдаун 20 минут.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "input-stream",
    "humanReadableName": "InputStream (S)",
    "description": "В течение Мощь*3 минут мана из соседних локаций периодически будет призываться в эту  (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
    "prerequisites": [
      "arch-mage",
      "geomancy"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "jack-in",
    "humanReadableName": "Jack-in",
    "description": "Джекнуться (jack-in) в кибердеку. \nОтсканируй QR код своей деки",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-hackerman-decker",
      "level": 1
    }
  },
  {
    "id": "jack-out",
    "humanReadableName": "Jack-out",
    "description": "Выстегнуться из деки (jack-out).\nВНИМАНИЕ: ты получишь дампшок, если находишься в HotSim",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "keep-yourself",
    "humanReadableName": "Keep yourself (S)",
    "description": "Ты можешь увеличить себе максимальные и текущие хиты на N на время T. N=Мощь. T=10*Мощь минут. Хиты не могут стать больше 6 (согласно правилам по боевке)",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "hack-deck-kill",
    "humanReadableName": "kill",
    "description": "новая команда: kill\nУБИВАЕТ(АС) поверженного хакера. Да, наглухо \nДля применения понадобится специальный эксплойт",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "leisure-suit",
    "humanReadableName": "Leisure suit (P)",
    "description": "Увеличивает продолжительность призыва духа еще на 30 минут",
    "prerequisites": [
      "arch-mage",
      "nice-suit"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "let-it-go",
    "humanReadableName": "Let it go (S)",
    "description": "В течение 1 минуты сможешь изгнать одного материализованного духа. Потребуется коснуться его рукой или кинжалом с возгласом \"Изыди!\"\nПосле этого дух теряет все хиты.",
    "prerequisites": [
      "arch-mage",
      "leisure-suit"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "let-it-go-effect",
    "humanReadableName": "Let it go Effect",
    "description": "В течение 1 минуты ты можешь изгнать одного материализованного духа. Потребуется коснуться его рукой или кинжалом с возгласом \"Изыди!\"\r\nПосле этого дух теряет все хиты.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "light-step",
    "humanReadableName": "Light Step (P)",
    "description": "В астральном следе твоих заклинаний остается только 60% ауры. ",
    "prerequisites": [
      "arch-mage",
      "trackpoint"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "live-long-and-prosper",
    "humanReadableName": "Live long and prosper (S)",
    "description": "Маг увеличивает указанному во время каста другому персонажу количество максимальных и текущих хитов на N на время T. N=Мощь. T=10*Мощь минут. Общее количество хитов не может быть больше 6 (согласно правилам по боевке)",
    "prerequisites": [
      "arch-mage",
      "keep-yourself"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "magic-shield",
    "humanReadableName": "Magic Shield",
    "description": "Активирован магический щит (раскрытым прозрачным зонтиком можно защищаться от попаданий любого оружия).\nC раскрытым маг.щитом нельзя перемещаться. Если такое случилось, эффект заклинания заканчивается, маг.щит нужно сложить и в этом бою раскрывать больше нельзя.\nПока активен эффект - складывать/раскладывать маг.щит можно сколько угодно раз\nКасание раскрытого маг.щита, в том числе оружием (кроме снарядов) приводит в тяжран нападающего",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "mene",
    "humanReadableName": "Mene (S)",
    "description": "Узнать 90% ауры не сопротивляющегося человека",
    "prerequisites": [
      "arch-mage",
      "fares"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "nice-suit",
    "humanReadableName": "Nice suit (P)",
    "description": "Увеличивает продолжительность призыва духа на 30 минут",
    "prerequisites": [
      "arch-mage",
      "suit-up"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "nothing-special",
    "humanReadableName": "Nothing special (S)",
    "description": "На 60 минут усилить цели маску ауры на Мощь*2.",
    "prerequisites": [
      "arch-mage",
      "mene"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "odus",
    "humanReadableName": "Odus (S)",
    "description": "Понизить Резонанс. На Мощь*10 минут понизить на Мощь -1 (но не меньше 1) Резонанс цели, указанной добровольно предоставленным qr-кодом.",
    "prerequisites": [
      "arch-mage",
      "shtopping"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "output-stream",
    "humanReadableName": "OutputStream (S)",
    "description": "В течение Мощь*3 минут мана из этой локации будет изгоняться в соседние (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
    "prerequisites": [
      "arch-mage",
      "geomancy"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "own-spirit",
    "humanReadableName": "Own spirit",
    "description": "Попытаться поймать духа, находящегося в этой локации. Потребуется свободное духохранилище. При неудаче будет временный штраф на Магию. Вероятность зависит от Сопротивляемости духа (базовой и лично этому магу) и от Мощи заклинания (чем мощнее, тем вероятнее)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "mage-summon-spirit",
      "level": 1
    }
  },
  {
    "id": "paralizard",
    "humanReadableName": "Paralizard (S)",
    "description": "В течение Мощь*2 минуты маг способен касанием и криком \"Паралич!\" парализовать одно любое мясное (не эктоплазменное) тело на 90 секунд - игнорируя любую броню.\nПарализованное тело не способно передвигаться, уклоняться, применять какие-либо способности. Может говорить, может являться целью чужих способностей (в том числе, требующих скана QR).",
    "prerequisites": [
      "arch-mage",
      "hammer-of-justice"
    ],
    "availability": "open",
    "karmaCost": 80
  },
  {
    "id": "paralizard-effect",
    "humanReadableName": "Paralizard-effect",
    "description": "Ты можешь касанием (рукой или кинжалом) И криком \"Паралич!\" парализовать одно любое мясное/эктоплазменное тело на 90 секунд.\nПарализованное тело не способно передвигаться, уклоняться, применять какие-либо способности. Может говорить, может являться целью чужих способностей (в том числе, требующих скана QR).",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "hack-deck-pecho",
    "humanReadableName": "pecho",
    "description": "Новая команда: pecho\nПозволяет шепнуть фразу другому декеру на том же хосте",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-hackerman-decker",
      "level": 1
    }
  },
  {
    "id": "pencil",
    "humanReadableName": "PENCIL",
    "description": "Одно холодное оружие в руках считается тяжёлым",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "pencil-large",
    "humanReadableName": "Pencil, large!",
    "description": "Получить силу - одно холодное оружие в руках будет считаться тяжёлым. После активации действует 5 минут.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "reactivate",
    "humanReadableName": "reactivate",
    "description": "новая команда: reactivate <target>\nвключает назад вырубленный лед",
    "prerequisites": [
      "arch-hackerman-decker",
      "breacher-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "lockpicking",
    "humanReadableName": "Real: вскрытие замков",
    "description": "Ты можешь вскрыть замок за 30 секунд. fading +25",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "bond-breaker"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "attack-drone-2",
    "humanReadableName": "Real: нападение на дрона",
    "description": "Ты можешь зарядить два энергетических Импульса, которые являются аналогом фаерболла, действуют только на дронов (Импульс снимает 4 хита с дрона в легкой броне, 1 хит с дрона в тяжелой броне).  Импульс рассеивается через 20 минут после активации способности.\nfading +200",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sword-short"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "attack-drone",
    "humanReadableName": "Real: паралич дрона",
    "description": "Ты можешь касанием кинжала, с криком \"Паралич!\" обездвижить любого дрона на 90 секунд.\nfading +200",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "attack-drone-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "riotment",
    "humanReadableName": "Riotment",
    "description": "Неуязвим для снарядов. Можешь кинуть в бою 1 файербол. Оружие в руках считается тяжёлым",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "hack-deck-rungc",
    "humanReadableName": "rungc",
    "description": "Новая команда: rungc\nПозволяет принудительно активировать сборку мусора в памяти деки, эффективно \"оживляя\" канал связи\n\nвосстанавливает матричные хиты в зависимости от значения Firewall",
    "prerequisites": [
      "arch-hackerman-decker",
      "breacher-3"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "scan",
    "humanReadableName": "scan",
    "description": "новая команда: scan\nСканирует ноду и выводит список обнаруженных в ней агентов\nУспешность определяется по Sleaze",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-1"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "scum-stoner",
    "humanReadableName": "Scum stoner (S)",
    "description": "Каменная кожа. На Мощь*20 минут выдаёт другому существу способность \"Skin, Stone!\" (надетая согласно остальным правилам лёгкая броня 1 минуту считается тяжёлой). Потребуется её активация и маркировка красной лентой",
    "prerequisites": [
      "arch-mage",
      "odus",
      "frog-skin",
      "dumbie"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "shtopping",
    "humanReadableName": "Shtopping (S)",
    "description": "Повысить цены. На Мощь*10 минут повысить стоимость всех покупок цели, указанной добровольно предоставленным qr-кодом.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "silentium-est-aurum",
    "humanReadableName": "Silentium est aurum (A)",
    "description": "На 60 минут частично изменить другому персонажу его ауру. Требуемая эссенция мага: больше 4\n(В том числе телу в КС)",
    "prerequisites": [
      "arch-mage",
      "nothing-special"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "stone-skin",
    "humanReadableName": "Skin stoner (S)",
    "description": "На Мощь*20 минут выдаёт магу способность \"Skin, Stone!\" (надетая согласно остальным правилам лёгкая броня 5 минут считается тяжёлой). Потребуется её активация и маркировка красной лентой",
    "prerequisites": [
      "arch-mage",
      "enlarge-my-pencil"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "skin-stone",
    "humanReadableName": "Skin, Stone!",
    "description": "Поднять щиты - надетая согласно остальным правилам лёгкая броня будет считаться тяжёлой. После активации действует 5 минут.  Потребуется маркировка красной лентой",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "smartie",
    "humanReadableName": "Smartie (S)",
    "description": "Повысить цели Интеллект на 1 на период=Мощь*5 минут. Если Мощь < 4, то эффекта не будет.  Цель должна предоставить QR-код добровольно.",
    "prerequisites": [
      "arch-mage",
      "tax-free"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "soul-exhaustion",
    "humanReadableName": "Soul exhaustion",
    "description": "Ты слишком устал, чтобы участвовать в ритуале",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "spirit-master-1",
    "humanReadableName": "Spirit Apprentice (P)",
    "description": "Ты можешь ловить духов 1го ранга",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "spirit-catcher",
    "humanReadableName": "Spirit catcher (S)",
    "description": "В течение Мощь*2 минут можно три раза попытаться поймать духа. С увеличением Мощи растут и шансы на поимку",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "spirit-master-2",
    "humanReadableName": "Spirit Disciple (P)",
    "description": "Ты можешь ловить духов 2го ранга",
    "prerequisites": [
      "arch-mage",
      "spirit-master-1"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "spirit-master-3",
    "humanReadableName": "Spirit Master (P)",
    "description": "Ты можешь ловить духов 3го ранга",
    "prerequisites": [
      "arch-mage",
      "spirit-master-2"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "spirit-suit",
    "humanReadableName": "Spirit Suit (S)",
    "description": "На Мощь*10 минут появится способность Own Spirit, с её помощью можно попытаться поймать духа в текущей локации и поместить его в телохранилище (можно создать с помощью Spirit Jar). Чем больше Мощь, тем больше вероятность поимки.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "stand-up-and-fight",
    "humanReadableName": "Stand up and fight (A)",
    "description": "Мгновенное поднятие другого персонажа из тяжрана. Требуемая эссенция: больше 5. Кулдаун 15 минут.",
    "prerequisites": [
      "arch-mage",
      "agnus-dei"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "steal",
    "humanReadableName": "steal",
    "description": "новая команда: steal\nНаходясь на ноде PAN хоста с определенным API, позволяет осуществить перевод автоматически определяемой суммы денег\n\nСумма зависит от вашего проффесионализма и DataProccessing",
    "prerequisites": [
      "arch-hackerman-decker",
      "miner-1"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "stone-skin-result",
    "humanReadableName": "Stone skin",
    "description": "Надетая согласно остальным правилам лёгкая броня 5 минут считается тяжелым (необходима её маркировка красной лентой)",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "strong-blood",
    "humanReadableName": "Strong blood",
    "description": "В жертвенных ритуальных практиках ты считаешься за 3 человек",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 20,
    "pack": {
      "id": "gen-meta-ork",
      "level": 1
    }
  },
  {
    "id": "strongest-blood",
    "humanReadableName": "Strongest blood",
    "description": "В жертвенных ритуальных практиках ты считаешься за 5 человек",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 20,
    "pack": {
      "id": "gen-meta-troll",
      "level": 1
    }
  },
  {
    "id": "suit-up",
    "humanReadableName": "Suit Up (P)",
    "description": "Даёт возможность временно надеть тело духа из тотема. Своё мясное тело маг должен оставить в телохранилище. Продолжительность призыва духа - 30 минут. (время может быть увеличено)",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 30,
    "pack": {
      "id": "mage-summon-spirit",
      "level": 1
    }
  },
  {
    "id": "sub-surge",
    "humanReadableName": "SURGE",
    "description": "Ты болеешь SURGE.  (необъяснимая генетическая экспрессия). Некоторые части твоего тела превратились в звериные.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "take-no-harm",
    "humanReadableName": "Take no harm",
    "description": "Доступна активация магического щита",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "tax-free",
    "humanReadableName": "Tax free (S)",
    "description": "Понизить цены. На Мощь*10 минут понизить стоимость всех покупок цели, указанной добровольно предоставленным qr-кодом.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "tease-lesser-mind",
    "humanReadableName": "Tease lesser mind (S)",
    "description": "На Мощь*10 минут выдаёт магу способность \"раскрыть магический щит\" (в течение 5 минут можно защищаться раскрытым прозрачным зонтиком от любого оружия), потребуется её активация перед использованием.\nC раскрытым маг.щитом нельзя перемещаться. Если такое случилось, эффект заклинания заканчивается, маг.щит нужно сложить и в этом бою раскрывать больше нельзя.\nПока активен эффект - складывать/раскладывать маг.щит можно сколько угодно раз\nКасание раскрытого маг.щита, в том числе оружием (кроме снарядов) приводит в тяжран нападающего.",
    "prerequisites": [
      "arch-mage",
      "enlarge-my-pencil"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "tempus-fugit",
    "humanReadableName": "Tempus Fugit (S)",
    "description": "Единоразово сдвинуть в текущей локации следы всех заклинаний за последние Мощь*5 минут на Мощь*4 минут в прошлое. Чем больше Мощь, тем больше следов захватит заклинание и тем дальше сдвинет",
    "prerequisites": [
      "arch-mage",
      "light-step"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "tincasm",
    "humanReadableName": "Think as a master (A)",
    "description": "Последнее китайское предупреждение уже было.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 300
  },
  {
    "id": "tincasm-able",
    "humanReadableName": "Think as a master эффект",
    "description": "После крика мага \"Замри\" все в этой локации, кто видит или слышит мага, столбенеют на месте.\nВ этом состоянии нельзя двигаться, атаковать, защищаться, пользоваться способностями - но можно быть целью для чужих способностей.\nМаг может вывести одну цель из остолбенения, погладив её по голове.\nОстолбеневшие снова могут двигаться через 60с или после потери хитов по любой причине.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "totoro",
    "humanReadableName": "Totoro",
    "description": "Ты неуязвим для снарядов. Можешь лечить мясным телам хиты до их максимума прикосновением в течение 5с",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "trackball",
    "humanReadableName": "Trackball (S)",
    "description": "Получить данные обо всех заклинаниях, обнаруженных в этой локации за последний час. Ауры считываются на 20+(Мощь*10, но не более 60)%",
    "prerequisites": [
      "arch-mage",
      "trackpoint"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "trackpoint",
    "humanReadableName": "Trackpoint (S)",
    "description": "Получить данные обо всех заклинаниях, обнаруженных в этой локации за последние 10+Мощь минут.  Ауры считываются на 10+(Мощь*5, но не более 40)%",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "trollton",
    "humanReadableName": "Trollton (A)",
    "description": "На время активности повяжи на себя красную ленту - считается, что на тебе тяжёлая броня. Требуемая эссенция: больше 2.  Время действия \"5+2*уровень маны в локации\" минут. Кулдаун 30 минут.",
    "prerequisites": [
      "arch-mage",
      "stand-up-and-fight"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "trollton-effect",
    "humanReadableName": "Trollton (P)",
    "description": "На тебя действует эффект тяжёлой брони.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "uninstall",
    "humanReadableName": "undeploy",
    "description": "новая команда: undeploy <target>\nУдаляет агента (софт) с Ноды",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "useapi",
    "humanReadableName": "useapi",
    "description": "новая команда: useapi\nБазовая команда для работы API",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-hackerman-decker",
      "level": 1
    }
  },
  {
    "id": "vr-better-vr",
    "humanReadableName": "VR Better VR",
    "description": "[только для VR] Возможность времени в VR увеличена на 30 минут.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "vr-more-better-vr",
    "humanReadableName": "VR More Better VR",
    "description": "[только для VR] Возможность времени в VR увеличена еще на 30 минут.",
    "prerequisites": [
      "vr-better-vr"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "vr-who-is",
    "humanReadableName": "VR Who Is",
    "description": "[только для VR] Ты можешь спросить чаммера кто он - и он должен назвать тебе имя, метатип и регион. Абилка Режим Инкогнито защищает от проверки.",
    "prerequisites": [
      "!arch-mage"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "vr-employee-long-time",
    "humanReadableName": "VR Больше VR сотрудникам",
    "description": "[только для VR] Твое время в VR увеличено на 2 часа.",
    "prerequisites": [
      "vr-employee"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "vr-hot-connected",
    "humanReadableName": "VR в режиме хотсим!",
    "description": "Ты можешь быть в VR в режиме хотсим. Все твои способности техноманта  работают.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "exit-vr",
    "humanReadableName": "VR Выйти из Виар",
    "description": "[только для VR] вернись к телохранилищу, чтобы покинуть VR. активируй способность и забери свое тело.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "vr-deanon",
    "humanReadableName": "VR Деанон",
    "description": "[только для VR] Ты можешь спросить чаммера кто он (даже с режимом Инкогнито)  - и он должен назвать тебе имя, метатип, регион и SIN. От проверки защищает только абилка режим Firewall.",
    "prerequisites": [
      "vr-who-is"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "enter-vr-hot",
    "humanReadableName": "VR Зайти в VR (хотсим)",
    "description": "[Вход в VR, Хотсим] При активации ты можешь зайти в VR в режиме горячего подключения, HotSim. Режим ХотСим необходим Техноманту для  использования абилок в VR, входа в Основание и использование там КФ и спрайтов. Переход разрешен только в точке c Виар-телохранилищами. Для выхода из Виар ничего нажимать не надо. ",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "enter-vr",
    "humanReadableName": "VR Зайти в Виар (колдсим)",
    "description": "[только для VR]  Активируй, чтобы зайти в VR (колдсим). Надо отсканировать телохранилище. Помни, что время пребывания в Виар ограничено. Если ты опоздаешь - можешь получить биофидбек (хиты, тяжран или КС).",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "chummer_zero",
      "level": 1
    }
  },
  {
    "id": "compile-coldsim",
    "humanReadableName": "VR Перейти в КолдСим",
    "description": "Активируй, чтобы подключиться в Колдсим (ты спрячешься в аватарку,  станешь беспомощным, но анонимным)",
    "prerequisites": [
      "arch-digital",
      "compile-hotsim",
      "sub-ai"
    ],
    "availability": "open",
    "karmaCost": 0
  },
  {
    "id": "vr-incognito",
    "humanReadableName": "VR Режим Инкогнито",
    "description": "[только для VR] Если ты находишься в VR в аватарке (плащ, очки, или зачипованная аватарка), то тебя нельзя узнать без применения специальных абилок или способностей. Абилка Who is на вас не действует.",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "vr-firewall",
    "humanReadableName": "VR Режим Фаервол",
    "description": "[только для VR] Ты нарисовал себе классную аватарку. Молодец! Тебя нельзя деанонимировать никаким способом. Если кто-то пытается - покажи ему этот текст. И да, у тебя +30 минут в VR! Развлекайся, чаммер!",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 20
  },
  {
    "id": "vr-employee",
    "humanReadableName": "VR Сотрудник VR",
    "description": "[только для VR] Сотрудник заведения VR, подтвержденный мастером региона",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "longer-vr-stays-1",
    "humanReadableName": "VR: можно быть дольше",
    "description": "Ты можешь находиться в VR на 20 минут дольше",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "longer-vr-stays-2",
    "humanReadableName": "VR: можно еще дольше!",
    "description": "Ты можешь находиться в VR на 300 минут дольше",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "identity-hide",
    "humanReadableName": "VR: сокрытие личности",
    "description": "Работает только в VR, Способность \"узнать личность\" на тебя не работает.",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "identity-scan",
    "humanReadableName": "VR: узнать личность",
    "description": "Работает только в VR. Покажи это персонажу, к которому ты хочешь узнать личность, он должен показать тебе свой SIN.\nfading +100",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "identity-hide"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "want-to-speak",
    "humanReadableName": "А поговорить?",
    "description": "Покажи только что активированную способность на персонажа в Виар. Он должен быть с тобой рядом и поддерживать разговор не менее чем 5 минут. Будь вежлив и интересен! ",
    "prerequisites": [
      "arch-digital",
      "sub-eghost"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "hotsim-ever",
    "humanReadableName": "А ты горяч!",
    "description": "В Виаре ты в находишься в состоянии Хотсим. Ты включен, бодр, горяч и можешь пользоваться способностями.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-digital",
      "level": 1
    }
  },
  {
    "id": "ethic-unbind",
    "humanReadableName": "Абсолютная свобода",
    "description": "Ты можешь снимать любые веревки с себя (даже в связанном состоянии), можешь открывать любые замки. На тебя не действует оглушение. Способность действует всегда.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "absolutely-finish-him",
    "humanReadableName": "Абсолютная смерть",
    "description": "Ты можешь добивать персонажа в Абсолютную смерть",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 100
  },
  {
    "id": "ethic-absolutely-finish-him",
    "humanReadableName": "Абсолютная смерть",
    "description": "Ты можешь убивать в Абсолютную смерть \n(в том числе персонажа в КС)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 100
  },
  {
    "id": "ethic-deanon",
    "humanReadableName": "Абсолютный деанон",
    "description": "[только для VR] Если ты используешь способность Деанон - от нее не спасают способности Режим Инкогнито и Режим Фаерволл. Ты можешь использовать эту способность один раз в час.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "automatic-weapons-unlock",
    "humanReadableName": "Автоматическое оружие",
    "description": "Ты можешь использовать автомат и/или винтовку. \n(При наличии импланта Кибер-рука или абилки Биосила)",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "guns-2",
    "humanReadableName": "Автоматы",
    "description": "Ты можешь использовать автомат (до 25 патронов, электромех).  Атака НЕ пробивает тяжелую броню.",
    "prerequisites": [
      "arch-samurai",
      "guns-1"
    ],
    "availability": "open",
    "karmaCost": 70
  },
  {
    "id": "sub-agent",
    "humanReadableName": "Агент",
    "description": "Ты сервисная программа, которая обеспечивает работу хоста в Матрице",
    "prerequisites": [
      "arch-digital"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ai-agressive-marketing",
    "humanReadableName": "Агрессивный Маркетинг",
    "description": "Добавляет Заведению одну белую коробку для Позитива.",
    "prerequisites": [
      "arch-digital",
      "ai-precious"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "kill-him",
    "humanReadableName": "Агрессия",
    "description": "Цель активно пытается убить (в Клиническую смерть)  персонажа, на которого указывает менталист (персонаж должен быть в прямой видимости). Если цель убита - эффект воздействия прекращается. Пока цель жива - твоя жертва пытается её убить. После клинической смерти персонажа, попавшего под действие менталиста, воздействие проходит.",
    "prerequisites": [
      "arch-face",
      "scorn-him",
      "paralysis-3"
    ],
    "availability": "open",
    "karmaCost": 80
  },
  {
    "id": "admin",
    "humanReadableName": "Админ",
    "description": "Еще 3 хоста, на защиту которых ты можешь подписаться",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-1"
    ],
    "availability": "open",
    "karmaCost": 5
  },
  {
    "id": "breachmaster-demigod",
    "humanReadableName": "Админ подсмотрел пароль",
    "description": "Вы подключились к источнику автобэкдоров от вашей организации.  Вам будет доступно 10 автобэкдоров в день. (подключение бэкдоров работает через сайт хакерства web.evarun.ru) ВАЖНО эта способность нужна только одному чаммеру в организации",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "activate-soft",
    "humanReadableName": "Активация софта",
    "description": "Активирует софт, после чего его можно загрузить в память кибердеки\nВНИМАНИЕ: нельзя использовать, когда ты уже соединен с кибердекой.",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-hackerman-decker",
      "level": 1
    }
  },
  {
    "id": "starvation",
    "humanReadableName": "Алчность",
    "description": "При Эссенс персонажа <1 ты не можешь активировать абилки ",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ghoul",
      "level": 1
    }
  },
  {
    "id": "ambidextrous",
    "humanReadableName": "Амбидекстр",
    "description": "Ты можешь использовать два одноручных оружия в двух руках. ",
    "prerequisites": [
      "arch-samurai",
      "faster-regen-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "situation-analazis",
    "humanReadableName": "Анализ ситуации",
    "description": "Инициатива +2 в Красной комнате",
    "prerequisites": [
      "arch-digital",
      "ai-troubleshooter"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "passport-visa-null",
    "humanReadableName": "Аннулировать визу",
    "description": "Ты можешь аннулировать визу России чаммеру, не являющемуся гражданином России",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "arch-hackerman-decker",
    "humanReadableName": "Архетип: Декер",
    "description": "Ты постиг премудрости работы с кибердекой и научился использовать gUmMMy протокол!",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 100,
    "pack": {
      "id": "gen-arch-hackerman-decker",
      "level": 1
    }
  },
  {
    "id": "arch-mage",
    "humanReadableName": "Архетип: Маг",
    "description": "Маг, повелитель заклинаний!",
    "prerequisites": [
      "!arch-hackerman-technomancer",
      "!meta-digital"
    ],
    "availability": "closed",
    "karmaCost": 100,
    "pack": {
      "id": "gen-arch-mage",
      "level": 1
    }
  },
  {
    "id": "arch-rigger",
    "humanReadableName": "Архетип: Риггер",
    "description": "Риггер, повелитель дронов, хрома и химоты.",
    "prerequisites": [
      "!meta-ghoul",
      "!meta-vampire"
    ],
    "availability": "open",
    "karmaCost": 100,
    "pack": {
      "id": "gen-arch-rigger",
      "level": 1
    }
  },
  {
    "id": "arch-samurai",
    "humanReadableName": "Архетип: Самурай",
    "description": "Самурай. Практикуешь искусство Воина и враги трепещут при звуках твоего имени.",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 100,
    "pack": {
      "id": "gen-arch-samurai",
      "level": 1
    }
  },
  {
    "id": "arch-hackerman-technomancer",
    "humanReadableName": "Архетип: Техномант",
    "description": "Ты теперь чувствуешь Матрицу. Обычные люди на такое не способны.",
    "prerequisites": [
      "!arch-mage",
      "!meta-ghoul",
      "!meta-vampire",
      "!meta-digital"
    ],
    "availability": "closed",
    "karmaCost": 100,
    "pack": {
      "id": "gen-arch-hackerman-technomancer",
      "level": 1
    }
  },
  {
    "id": "arch-face",
    "humanReadableName": "Архетип: Фейс",
    "description": "Фейс, эксперт по переговорам.",
    "prerequisites": [
      "!meta-digital"
    ],
    "availability": "open",
    "karmaCost": 100,
    "pack": {
      "id": "gen-arch-face",
      "level": 1
    }
  },
  {
    "id": "astral-vision",
    "humanReadableName": "Астральное зрение",
    "description": "Ты можешь видеть существ, находящихся в Астрале (красный дождевик) и говорить с ними.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ghoul",
      "level": 1
    }
  },
  {
    "id": "fly-you-fool",
    "humanReadableName": "Беги отсюда",
    "description": "Цель боится и убегает как можно дальше от менталиста. У цели заблокирована активация всех активных абилок на 10 минут. Через 10 минут эффект проходит.",
    "prerequisites": [
      "arch-face",
      "paralysis-1"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "runaway",
    "humanReadableName": "Бегство из Основания",
    "description": "Активируй способность, чтобы покинуть основание прямо сейчас. В процессе выхода тебя никто не может остановить или как-то с тобой взаимодейстовать. Ты не можешь взаимодействовать с другими персонажами или объектами. \nfading +300",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic",
      "initiative-basic"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "berserk-effect",
    "humanReadableName": "Берсерк",
    "description": "Если у тебя сняли все хиты - издай дикий боевой крик и можешь продолжать сражаться. У тебя два хита. После их снятия нажми кнопку \"тяжран\".",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "strong-arm",
    "humanReadableName": "БиоСила",
    "description": "Биологическая сила! Можно использовать оружие, требующее одной киберруки.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-troll",
      "level": 1
    }
  },
  {
    "id": "divine-intervention",
    "humanReadableName": "Божественно вмешательство",
    "description": "Дает 100 кармы, даром, и пусть никто не уйдет обиженный",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 10
  },
  {
    "id": "auto-doc-bonus-1",
    "humanReadableName": "бонус автодок 1",
    "description": "ты лучше работаешь с имплантами в автодоке",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "auto-doc-bonus-3",
    "humanReadableName": "бонус автодок 2",
    "description": "ты ещё лучше работаешь с имплантами в автодоке",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "auto-doc-bonus-5",
    "humanReadableName": "бонус автодок 3",
    "description": "ты отлично работаешь с имплантами в автодоке",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "ethic-buryaty-smartie",
    "humanReadableName": "Буряты умные!",
    "description": "Повысить Интеллект. На Мощь*10 минут повысить на 1, если Мощь <4, иначе на 2  Интеллект цели, указанной добровольно предоставленным qr-кодом.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ethic-buryaty-dumbie",
    "humanReadableName": "Буряты хитрые!",
    "description": "Понизить Интеллект. На Мощь*10 минут понизить на 1, если Мощь <4, иначе на 2 Интеллект цели, указанной добровольно предоставленным qr-кодом.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "repoman-1",
    "humanReadableName": "Было ваше - стало наше 1",
    "description": "Увеличивает сложность имплантов, который ты можешь снять. ",
    "prerequisites": [
      "arch-rigger",
      "repoman-active"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "repoman-2",
    "humanReadableName": "Было ваше - стало наше 2",
    "description": "Сильнее увеличивает сложность имплантов, который ты можешь снять. ",
    "prerequisites": [
      "arch-rigger",
      "repoman-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "repoman-3",
    "humanReadableName": "Было ваше - стало наше 3",
    "description": "Максимально увеличивает сложность имплантов, который ты можешь снять. ",
    "prerequisites": [
      "arch-rigger",
      "repoman-2"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "executioner-1",
    "humanReadableName": "Быстрое добивание",
    "description": "Используй эту способность чтобы быстро добить из тяжрана в КС",
    "prerequisites": [
      "arch-samurai",
      "binding"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "kokkoro-backup",
    "humanReadableName": "Бэкап ",
    "description": "ты можешь забыть эпизод, если напишешь о нем Искусственному Интеллекту используя мессенджеры или расскажешь лично. Только в личном присутствии этого Искусственного Интеллекта ты помнишь все забытые таким образом эпизоды",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "koshcghei-backup",
    "humanReadableName": "Бэкап ",
    "description": "ты можешь забыть эпизод, если напишешь о нем Искусственному Интеллекту используя мессенджеры или расскажешь лично. Только в личном присутствии этого Искусственного Интеллекта ты помнишь все забытые таким образом эпизоды",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "horizon-backup",
    "humanReadableName": "Бэкап ",
    "description": "ты можешь забыть эпизод, если напишешь о нем Искусственному Интеллекту используя мессенджеры или расскажешь лично. Только в личном присутствии этого Искусственного Интеллекта ты помнишь все забытые таким образом эпизоды",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "badass-backup",
    "humanReadableName": "Бэкап ",
    "description": "ты можешь забыть эпизод, если напишешь о нем Искусственному Интеллекту используя мессенджеры или расскажешь лично. Только в личном присутствии этого Искусственного Интеллекта ты помнишь все забытые таким образом эпизоды",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "this-my-glory-hole",
    "humanReadableName": "Верзила",
    "description": "У троллей есть дополнительный слот для имплантов",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-troll",
      "level": 1
    }
  },
  {
    "id": "passport-kz-null",
    "humanReadableName": "Вернуть акцию из залога",
    "description": "Возвращает гражданскую акцию Корпорации Россия из залога",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "guns-1",
    "humanReadableName": "Винтовки",
    "description": "Ты умеешь использовать винтовку (до 16 патронов). Атака НЕ пробивает тяжелую броню.",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "drones-active",
    "humanReadableName": "Включиться в дрона",
    "description": "Активируй, чтобы включиться в дрона.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-rigger",
      "level": 1
    }
  },
  {
    "id": "use-pills-on-others",
    "humanReadableName": "Вколоть препарат",
    "description": "Активируй, чтобы применить препарат на другого персонажа. После объявления \"Колю препарат\" и каcания игрока холодным оружием, игрок обязан показать QR своего тела для применения абилки, даже если он против.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "drone-use-pills",
    "humanReadableName": "Вколоть препарат пациенту",
    "description": "Активируй, чтобы применить препарат на другого персонажа. После объявления \"Колю препарат\" и каcания игрока рукой, игрок обязан показать QR своего тела для применения абилки, даже если он против.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "aircraft-1",
    "humanReadableName": "Воздушные дроны 1",
    "description": "Улучшает способность по управлению воздушными дронами.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "aircraft-2",
    "humanReadableName": "Воздушные дроны 2",
    "description": "Сильнее улучшает способность по управлению воздушными дронами.",
    "prerequisites": [
      "aircraft-1",
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "aircraft-3",
    "humanReadableName": "Воздушные дроны 3",
    "description": "Максимально улучшает способность по управлению воздушными дронами. Немного улучшает навык для всех остальных типов дронов.",
    "prerequisites": [
      "aircraft-2",
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "ethic-individual",
    "humanReadableName": "Волк-одиночка",
    "description": "Если после твоей атаки враг перешел в тяжелое ранение - ты вылечиваешь все хиты. Ты можешь использовать эту способность один раз в час.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "ethic-freedom",
    "humanReadableName": "Вольный стрелок",
    "description": "Ты получаешь +2 к ментальной защите. Эффект постоянный.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "gm-respawn-hmhvv",
    "humanReadableName": "Воскрешение HMHVV",
    "description": "Воскрешение HMHVV",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "gm-respawn-normal",
    "humanReadableName": "Воскрешение общее",
    "description": "Воскрешение Норм, эльф, орк, тролль, гном",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "gm-respawn-digital",
    "humanReadableName": "Воскрешение цифровой",
    "description": "Воскрешение Цифровой",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "magic-recovery-1",
    "humanReadableName": "Воспрянь и пой 1 (P)",
    "description": "Перманентно ускоряет восстановление твоей Магии на 20%.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "magic-recovery-2",
    "humanReadableName": "Воспрянь и пой 2 (P)",
    "description": "Перманентно ускоряет восстановление твоей Магии на 20%.",
    "prerequisites": [
      "magic-recovery-1",
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "magic-recovery-3",
    "humanReadableName": "Воспрянь и пой 3 (P)",
    "description": "Перманентно ускоряет восстановление твоей Магии на 20%.",
    "prerequisites": [
      "magic-recovery-2",
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "gm-reset-essence",
    "humanReadableName": "Восстановление Эссенс",
    "description": "Эссенс персонажа станет =6, все импланты деактивируются(ломаются)\nдействует на расы: эльф, орк, норм, тролль, гном, ",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "rd-reset-essence",
    "humanReadableName": "Восстановление Эссенса",
    "description": "РД Эссенс персонажа станет =6, все импланты деактивируются(ломаются)\nдействует на расы: эльф, орк, норм, тролль, гном",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "churched",
    "humanReadableName": "Воцерковленный",
    "description": "После исповеди или участия в богослужении вы можете нажать \"Готово\" на любом Поступке личной этики, не выполняя его требований",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "always-online",
    "humanReadableName": "Всегда на связи",
    "description": "Пока ваш персонаж жив и не находится под запрещающим использовать связь ментальным контролем, вы можете писать сообщения в телеграмм, даже если вы связаны или без сознания. Если у окружающих возникают к вам вопросы, продемонстрируйте им наличие у вас этой способности.",
    "prerequisites": [
      "media-person"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "constitution-3",
    "humanReadableName": "Всплеск адреналина",
    "description": "Вылечить твое тяжелое ранение невозможно. Если ты упал в тяжран и тебя не добили - через 3 минуты ты сам встанешь из тяжрана. Через 30 минут автоматически упадешь в КС. ",
    "prerequisites": [
      "arch-samurai",
      "binding"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "reanimate",
    "humanReadableName": "Встань и иди",
    "description": "Поднять персонажа из состояния клинической смерти",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "deck-cve-mechmath",
    "humanReadableName": "вывих мозга \"МехМат\"",
    "description": "количество нужных дампов для получения CVE на один меньше",
    "prerequisites": [
      "arch-hackerman-decker",
      "breacher-2"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "passport-visa",
    "humanReadableName": "Выдать визу в Россию",
    "description": "Ты можешь выдать визу России чаммеру, не являющемуся гражданином России",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "very-last-droplet",
    "humanReadableName": "Выжать до капли",
    "description": "Можешь использовать бекдоры на 40 минут дольше",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "passport-kz",
    "humanReadableName": "Выкупить акцию",
    "description": "Ты можешь выкупить гражданскую акцию Корпорации Россия в залог",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "luke-i-am-your-father",
    "humanReadableName": "Выполнить любую просьбу",
    "description": "Люк, я твой отец. Цель выполняет любую просьбу (кроме самоубийства). Перевод денег и подарок не могут быть услугой. Также нельзя попросить что-либо забыть или не говорить. Выполнение услуги не должно занимать больше 30 минут. ",
    "prerequisites": [
      "arch-face",
      "really-need-it"
    ],
    "availability": "open",
    "karmaCost": 70
  },
  {
    "id": "ethic-wuxing",
    "humanReadableName": "Гармония Усин",
    "description": "Защита от вредных веществ\nГармония и сохранение позволяют последователям Усин поддерживать баланс веществ и энергий в организме. Порог Кризиса по веществам у тебя увеличен.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "deep-er",
    "humanReadableName": "Глубже",
    "description": "Ты очень хорошо чувствуешь происходящее в Матрице, Глубина +1",
    "prerequisites": [
      "arch-digital",
      "depth-master"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "master-anger-1",
    "humanReadableName": "Гнев мироздания 1",
    "description": "Ты огорчил мироздание. -1 ко всем характеристикам персонажа.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "master-anger-2",
    "humanReadableName": "Гнев мироздания 2",
    "description": "Ты огорчил мироздание. Еще -1 ко всем характеристикам персонажа.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "master-anger-3",
    "humanReadableName": "Гнев мироздания 3",
    "description": "Ты огорчил мироздание. И еще -1 ко всем характеристикам персонажа.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "meta-dwarf",
    "humanReadableName": "Гном",
    "description": "Ты гном. У тебя есть борода, чувство гордости и ты считаешь большинство остальных металюдей - длинномерками. Кстати, я уже говорил про бороду? ",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-dwarf",
      "level": 1
    }
  },
  {
    "id": "meat-hunger",
    "humanReadableName": "Голод гулей",
    "description": "Твой эссенс уменьшается  на 0,2 каждый час",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ghoul",
      "level": 1
    }
  },
  {
    "id": "feed-tamagochi",
    "humanReadableName": "Голодный как тролль!",
    "description": "Надо чаще питаться. Большому телу - нужен большой сойбургер!",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-troll",
      "level": 1
    }
  },
  {
    "id": "voting-1",
    "humanReadableName": "Голосование: вариант 1",
    "description": "Ты голосуешь за вариант 1 в голосовании.",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "chummer_zero",
      "level": 1
    }
  },
  {
    "id": "voting-2",
    "humanReadableName": "Голосование: вариант 2",
    "description": "Ты голосуешь за вариант 2 в голосовании.",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "chummer_zero",
      "level": 1
    }
  },
  {
    "id": "voting-3",
    "humanReadableName": "Голосование: вариант 3",
    "description": "Ты голосуешь за вариант 3 в голосовании.",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "chummer_zero",
      "level": 1
    }
  },
  {
    "id": "voting-4",
    "humanReadableName": "Голосование: вариант 4",
    "description": "Ты голосуешь за вариант 4 в голосовании.",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "chummer_zero",
      "level": 1
    }
  },
  {
    "id": "voting-5",
    "humanReadableName": "Голосование: вариант 5",
    "description": "Ты голосуешь за вариант 5 в голосовании.",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "chummer_zero",
      "level": 1
    }
  },
  {
    "id": "loud-break-in",
    "humanReadableName": "Громкий взлом",
    "description": "Ты можешь открыть дверь, закрытую на замок. Для этого надо в течении 5 минут громко изображать попытки выбить замок / сломать дверь. Попытки должны быть громкими и заметными окружающим.",
    "prerequisites": [
      "lock-the-door"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "dm-add-guru",
    "humanReadableName": "Гуру",
    "description": "Принять персонажа в дискурс-группу, не расходуя заряд локуса",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "let-him-pay",
    "humanReadableName": "Давай он заплатит",
    "description": "переписать долг за 1 предмет по выбору на другого персонажа по его скорингу",
    "prerequisites": [
      "arch-face",
      "let-me-pay"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "let-me-pay",
    "humanReadableName": "Давай я заплачу",
    "description": "Гешефтмахер может переписать кредит за 1 предмет на себя. Работает только если есть QR-код товара.",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "ethic-ordo",
    "humanReadableName": "Давление",
    "description": "Ты можешь заставить другого персонажа показать его куар (для взаимодействия)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "no-enter-tea",
    "humanReadableName": "Даже чаю не попьете",
    "description": "Покажи только что активированную способность персонажу. Он должен немедленно покинуть заведение, сотрудником которого ты являешься. Он не может вернуться обратно 30 минут",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 10
  },
  {
    "id": "ai-buff-double-damage",
    "humanReadableName": "Двойной удар",
    "description": "Усиление для Техномантов в Красной Комнате. Атаки цели снимают два хита вместо одного на протяжении одного конфликта в КК.",
    "prerequisites": [
      "arch-digital",
      "ai-troubleshooter"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "clubs'n'swords-3",
    "humanReadableName": "Двуручное оружие",
    "description": "Ты умеешь использовать двуручное оружие. Двуручные топоры, молоты, мечи, дубины. От 120 до 170 см. Оружие необходимо держать двумя руками. Атака снимает 4 хита с цели либо 1 хит с цели в тяжелом доспехе. ",
    "prerequisites": [
      "arch-samurai",
      "clubs'n'swords-2"
    ],
    "availability": "open",
    "karmaCost": 80
  },
  {
    "id": "backdoor-hold-2",
    "humanReadableName": "держать 2 бэкдора",
    "description": "Можешь использовать 2 бэкдора одновременно",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "backdoor-hold-3",
    "humanReadableName": "держать 3 бэкдора",
    "description": "Можешь использовать 3 бэкдора одновременно",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "backdoor-hold-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "backdoor-hold-4",
    "humanReadableName": "держать 4 бэкдора",
    "description": "Можешь использовать 4 бэкдора одновременно",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "backdoor-hold-3"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "backdoor-hold-5",
    "humanReadableName": "держать 5 бэкдоров",
    "description": "Можешь использовать 5 бэкдоров одновременно",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "backdoor-hold-4"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "whats-in-the-body-1",
    "humanReadableName": "Диагностика",
    "description": "Ты можешь проверить, какие вещества находятся в теле пациенте.\n(появится таблица с перечислением веществ в теле, если веществ нет, она будет пустая)\nТы можешь сделать это, даже если тело в КС.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "whats-in-the-body-2",
    "humanReadableName": "Диагностика 2 (усиление)",
    "description": "Ты видишь более тонкие составы в теле пациента.\n(в таблице диагностики ты сможешь видеть вещества с меньшей концентрацией)",
    "prerequisites": [
      "arch-rigger",
      "whats-in-the-body-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "whats-in-the-body-3",
    "humanReadableName": "Диагностика 3 (усиление)",
    "description": "Ты видишь самые тонкие составы в теле пациента.\n(в таблице диагностики ты сможешь видеть вещества с меньшей концентрацией)",
    "prerequisites": [
      "arch-rigger",
      "whats-in-the-body-2"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "drone-whats-in-the-body",
    "humanReadableName": "Диагностика пициента",
    "description": "Ты можешь проверить, какие вещества находятся в теле пациенте.\n(появится таблица с перечислением веществ в теле, если веществ нет, она будет пустая)\nТы можешь сделать это, даже если тело в КС.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "dividends-1",
    "humanReadableName": "Дивиденды *",
    "description": "Дивиденды гарантируют вашему персонажу регулярный пассивный доход на игре, без регистрации и СМС. Shut up and take my nuyens! Да, этого точно хватит чтобы поесть и оплатить некоторые развлечения.",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 70
  },
  {
    "id": "dividends-2",
    "humanReadableName": "Дивиденды **",
    "description": "Больше пассивного дохода!",
    "prerequisites": [
      "dividends-1"
    ],
    "availability": "open",
    "karmaCost": 70
  },
  {
    "id": "dividends-3",
    "humanReadableName": "Дивиденды ***",
    "description": "Еще больше пассивного дохода, чаммер!",
    "prerequisites": [
      "dividends-2"
    ],
    "availability": "open",
    "karmaCost": 70
  },
  {
    "id": "project-foundation",
    "humanReadableName": "для пмов",
    "description": "пм1",
    "prerequisites": [
      "project-manager-3"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "project-place",
    "humanReadableName": "для пмов2",
    "description": "пм2",
    "prerequisites": [
      "project-manager-3"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "drone-finish-him",
    "humanReadableName": "Добивание в КС",
    "description": "Добей это тело!  *работает только на биологические объекты",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "finish-him",
    "humanReadableName": "Добивание тела из тяжрана в КС",
    "description": "Добей это тело!  *работает только на биологические объекты",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 120,
    "pack": {
      "id": "chummer-zero",
      "level": 1
    }
  },
  {
    "id": "executioner-3",
    "humanReadableName": "Допрос раненого",
    "description": "Ты можешь допросить тяжело раненного персонажа. Допрашиваемый обязан честно и полно ответить на три вопроса.",
    "prerequisites": [
      "arch-samurai",
      "rummage"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "drone-heavy",
    "humanReadableName": "Дрон броня",
    "description": "На этом дроне установлена тяжелая броня. Дрон обладает \"Эффектом тяжёлой брони\"",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-dozer",
    "humanReadableName": "Дрон Бульдозер",
    "description": "Этот дрон оснащён Щитом.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-heli",
    "humanReadableName": "Дрон Вертолет",
    "description": "Может перевозить 3 персонажей. Иммунитет ко всему холодному оружию и легкому огнестрельному. ",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-copter",
    "humanReadableName": "Дрон Коптер",
    "description": "Видеокамера. Иммунитет ко всему холодному оружию и легкому огнестрельному. Может переносить до 3-х игровых предмета.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-kabuum",
    "humanReadableName": "Дрон Коптер-Камикадзе",
    "description": "Бадабум!  Иммунитет ко всему холодному оружию и легкому огнестрельному.\nПри активации необходимо громко озвучить словесный маркер \"ВЗРЫВ\".  Эффект = атака тяжелым оружием по всем персонажам в радиусе 5 метров от точки взрыва . (4 хита по персонажам без брони \\ 1 хит по персонажам в тяжелой броне). После взрыва активируй \"аварийный выход\", после возврата в тело - порви куар дрона.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-project",
    "humanReadableName": "Дрон Коптер-Проектор",
    "description": "Проектор голограмм. Иммунитет ко всему холодному оружию и легкому огнестрельному.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-medcart",
    "humanReadableName": "Дрон Медкарт",
    "description": "Вы в дроне типа Медикарт",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-turret",
    "humanReadableName": "Дрон Турель",
    "description": "Этот дрон оснащён Пушкой.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-ekzo",
    "humanReadableName": "Дрон Экзоскелет",
    "description": "Этот дрон оснащён Пулеметом.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "spirit-feed",
    "humanReadableName": "Друг духов",
    "description": "Тебе заметно легче ловить духов",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ork",
      "level": 1
    }
  },
  {
    "id": "clubs'n'swords-1",
    "humanReadableName": "Дубинки",
    "description": "Ты можешь использовать легкое холодное оружие - дубинки, биты, монтировки длиной до 60см. Атака НЕ пробивает тяжелую броню..",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "adamantaeu",
    "humanReadableName": "ДУХ: Adamantaeu",
    "description": "На тебя действует эффект тяжёлой брони.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "arr-ow",
    "humanReadableName": "ДУХ: Arr! Ow...",
    "description": "Защита от дистанционного легкого оружия.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "auriel",
    "humanReadableName": "ДУХ: Auriel",
    "description": "Узнать 95% ауры не сопротивляющегося человека",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "aurma",
    "humanReadableName": "ДУХ: Aurma",
    "description": "На 80 минут частично изменить другому персонажу его ауру. Кулдаун 60 минут",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "aval-festival",
    "humanReadableName": "ДУХ: Aval-festival",
    "description": "Снять со всех персонажей в реале в радиусе 5 метров от точки активации хиты в количестве 4. Действует на всех, кроме самого духа и тех, кого он укажет. \nРекомендуется привлекать для подтверждения эффекта представителя МГ.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 50
  },
  {
    "id": "beautti-frutti",
    "humanReadableName": "ДУХ: Beautti-frutti",
    "description": "На 60 минут повысить Харизму на 1 цели, указанной добровольно предоставленным qr-кодом",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "celestial-song",
    "humanReadableName": "ДУХ: Celestial song",
    "description": "Настраивает цель на небесный хор, что даёт значимый эффект в ритуалах соучастия",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "date-of-birds",
    "humanReadableName": "ДУХ: Date of birds",
    "description": "В течение 15 минут каждую минуту со всех в реале в радиусе 5 метров от точки активации эффекта снимается по 1 хиту (рекомендуется привлекать для подтверждения эффекта представителя МГ). \nДействует на всех, кроме самого духа и тех, кого он укажет.\nЕсли дух отходит от точки активации больше чем на 2 метра - действие эффекта прекращается.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 50
  },
  {
    "id": "fireball-back",
    "humanReadableName": "ДУХ: Fireball - back",
    "description": "Можешь кинуть 3 огненных шара. Затем эффект исчерпан до выхода из духа",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "fireball-forward",
    "humanReadableName": "ДУХ: Fireball - forward",
    "description": "Можешь кинуть 9 огненных шаров. Затем эффект исчерпан до выхода из духа",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "fireball-halfback",
    "humanReadableName": "ДУХ: Fireball - halfback",
    "description": "Можешь кинуть 5 огненных шаров. Затем эффект исчерпан до выхода из духа",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "fireball-keeper",
    "humanReadableName": "ДУХ: Fireball - keeper",
    "description": "Можешь кинуть 2 огненных шара. Затем эффект исчерпан до выхода из духа",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "get-high",
    "humanReadableName": "ДУХ: Get high",
    "description": "Повышает скорость восстановления магии цели",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "get-low",
    "humanReadableName": "ДУХ: Get low",
    "description": "Понижает Откат цели",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "hammer-time",
    "humanReadableName": "ДУХ: HammerTime",
    "description": "Можешь взять одноручное холодное оружие до 100см, оно считается тяжёлым.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "i-feel-it-in-the-water",
    "humanReadableName": "ДУХ: I feel it in the water",
    "description": "Увидеть уровень маны в локации",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "i-shall-pass",
    "humanReadableName": "ДУХ: I shall pass",
    "description": "Активация дает возможность тихо открыть один замок за 1 минуту - все это время надо держаться рукой за сертификат замка.\nКулдаун 5 минут",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "mr-cellophane",
    "humanReadableName": "ДУХ: Mr.Cellophane",
    "description": "Ты находишься в астральном плане. Необходимый маркер: красный дождевик.\nТы видишь и слышишь реальный мир, но не можешь воздействовать на него.\nИз реального мира тебя не воспринимают и никак не могут атаковать (если только у них нет абилки, которая явным образом утверждает иное).",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "over-the-pills",
    "humanReadableName": "ДУХ: Over the pills",
    "description": "Все мясные/экто тела, касающиеся этого духа на протяжении 1 минуты, в конце этого интервала восстанавливают текущие хиты до максимума",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "reefwise",
    "humanReadableName": "ДУХ: Reefwise",
    "description": "Узнать ауру локации",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "surge-the-unclean",
    "humanReadableName": "ДУХ: Surge the unclean",
    "description": "На 60 минут понизить на 3 Резонанс цели, указанной добровольно предоставленным qr-кодом.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "tick-a-lick-a-boo",
    "humanReadableName": "ДУХ: Tick-a-lick-a-boo",
    "description": "Все мясные/экто тела, щекочущие этого духа на протяжении 2 минут, в конце этого интервала восстанавливают текущие хиты до максимума",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "trackeeteer",
    "humanReadableName": "ДУХ: Trackeeteer",
    "description": "Получить данные обо всех заклинаниях, обнаруженных в этой локации за последние 15 минут.  Ауры считываются на 80 процентов",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 40
  },
  {
    "id": "trackpointer",
    "humanReadableName": "ДУХ: Trackpointer",
    "description": "Получить данные обо всех заклинаниях, обнаруженных в этой локации за последние 25 минут.  Ауры считываются на 40 процентов",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 40
  },
  {
    "id": "ugly-is-pechi",
    "humanReadableName": "ДУХ: Ugly is pechi",
    "description": "На 60 минут понизить на 2 Харизму цели, указанной добровольно предоставленным qr-кодом",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "undiena",
    "humanReadableName": "ДУХ: Undiena",
    "description": "Активируемая возможность поднять одну цель из КС/тяжрана в полные хиты. Время действия: 30 минут",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 30
  },
  {
    "id": "barguzin-gift",
    "humanReadableName": "ДУХ: Дар Баргузина",
    "description": "Баргузин невысок, бородат, но сильнее всех богатырей. Одна беда - прям слишком. Без помощи других упирается, да силы тратит.\n\nПока дух с Даром Сармы держит за одну руку тебя, а за другую духа с Даром Култука - у тебя 6 хитов, тяжёлая броня (повяжи на себя красную ленту), когти считаются тяжёлым оружием (повяжи красную ленту на нож), ты можешь кинуть 5 файерболов и не подвержен изгнанию духов (Let it go). Если хотя бы одно из двух рукопожатий распалось - хиты всех трёх духов падают до нуля.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 10
  },
  {
    "id": "kultuk-gift",
    "humanReadableName": "ДУХ: Дар Култука",
    "description": "Искажён лик Култука болезнями, но как всякая жизнь он себе дорожку находит. Одна беда - увлекается. Без помощи других хватается за разное, елозит туда-сюда, да вперёд почти не движется.\n\nПока дух с Даром Сармы держит за одну руку тебя, а за другую духа с Даром Баргузина - у тебя 6 хитов, тяжёлая броня (повяжи на себя красную ленту), когти считаются тяжёлым оружием (повяжи красную ленту на нож), ты можешь кинуть 5 файерболов и не подвержен изгнанию духов (Let it go). Если хотя бы одно из двух рукопожатий распалось - хиты всех трёх духов падают до нуля.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 10
  },
  {
    "id": "sarma-gift",
    "humanReadableName": "ДУХ: Дар Сармы",
    "description": "Сарма все хвори прогоняет, хотела бы всех исцелить. Одна беда - живые вечно снова заболеть норовят. Без помощи других никак ей окончательно этот вопрос не решить.\n\nПока ты держишь одной рукой руку духа с Даром Баргузина, а другой духа с Даром Култука - у тебя 5 хитов, защита от лёгких снарядов и любые духи, что тебя касаются, пропев \"Славное море, священный Байкал, Славный корабль омулёвая бочка\" тут же восстановят все хиты. Если хотя бы одно из двух рукопожатий распалось - хиты всех трёх духов падают до нуля.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 10
  },
  {
    "id": "dm-soul-expert",
    "humanReadableName": "Душевед",
    "description": "Предъявите экран с описанием способности игроку, чтобы тот показал вам свой этикпрофиль",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "spirit-danger",
    "humanReadableName": "Если оболочка разрушена...",
    "description": "Эктотело духа разрушено! Необходимо срочно вернуться к своему телу!\n*Применяется если тебя в эктотеле уничтожили*",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "sleep-isthere-mage",
    "humanReadableName": "Есть кто в ТХ? (маг)",
    "description": "Отсканируй qr телохранилища, чтобы проверить, есть ли кто-то внутри.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "sleep-isthere-rigger",
    "humanReadableName": "Есть кто в ТХ? (ригга)",
    "description": "Отсканируй qr телохранилища, чтобы проверить, есть ли кто-то внутри.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "more-deep-er",
    "humanReadableName": "Еще глубже",
    "description": "Тебе все проще дается взаимодействие с Матрицей, Глубина +1",
    "prerequisites": [
      "arch-digital",
      "deep-er"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "blood-thirst",
    "humanReadableName": "Жажда вампиров",
    "description": "Твой эссенс уменьшается на 1 каждый час",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-vampire",
      "level": 1
    }
  },
  {
    "id": "restioration-1",
    "humanReadableName": "Жажда действий",
    "description": "Тебе достаточно провести 30 минут у ассемблера для компиляции",
    "prerequisites": [
      "arch-digital",
      "compile-hotsim",
      "sub-ai"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "restioration-2",
    "humanReadableName": "Жажда действий 2.0",
    "description": "Тебе достаточно провести 15 минут у ассемблера для компиляции",
    "prerequisites": [
      "arch-digital",
      "restioration-1"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "oblivion",
    "humanReadableName": "Забвение",
    "description": "Целевой персонаж не помнит события последней сцены. Работает только, если персонажу не был нанесен урон (снят хотя бы 1 хит).  Начало сцены определяет менталист, но не больше 30 минут.",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "forget-it-all-eghost",
    "humanReadableName": "Забвение",
    "description": "Покажи активированную способность персонажу в VR (на Цифровых не действует!) . Цель способности забывает последние 10 минут проведенные в ВИАР. Применяется только в VR.",
    "prerequisites": [
      "arch-digital",
      "want-to-speak"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "marauder-2",
    "humanReadableName": "Забрать деньги у раненого",
    "description": "Ты можешь ограбить тяжелораненного персонажа, для этого отсканируй его куар - тебе переведется 10% с его счета. После грабежа жертва перейдет в состояние клинической смерти.",
    "prerequisites": [
      "arch-samurai",
      "rummage"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "rowing",
    "humanReadableName": "Забрать предмет",
    "description": "Если вы обыскиваете человека - вы можете его ограбить. Покажите этот текст тому, кого вы собираетесь ограбить.  Вы можете забрать у жертвы три любые игровые предмета из числа тех, которые вы нашли при обыске. Телефон и доступ в сеть заблокировать обыском нельзя. Оружие (оружие, броня и т.п, все, на чем чип “оружие допущено”) при обыске забрать нельзя.",
    "prerequisites": [
      "rummage",
      "arch-samurai"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "forget-it-all-ai",
    "humanReadableName": "Забудь что знал",
    "description": "Целевой персонаж в VR (не цифровой) забывает последние 10 минут проведенные в ВИАР. Применяется только в VR.",
    "prerequisites": [
      "arch-digital",
      "tell-me-what-you-know-ai"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "ethic-lzg",
    "humanReadableName": "Заживление ран",
    "description": "Ты можешь вылечить себе два хита, прикоснувшись к Гулю. Обними гуля на одну минуту. Ты можешь использовать эту способность один раз в час.\nНе работает, если ты находишься в тяжелом ранении.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ai-confidential",
    "humanReadableName": "Закрытытые протоколы",
    "description": "Ты можешь поместить временную печать на ящик Позитива или Негатива.",
    "prerequisites": [
      "arch-digital",
      "ai-black-pr"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "lock-the-door",
    "humanReadableName": "Запереть замок",
    "description": "Закрыть замок.  Ты можешь поставить маркер \"замок\" на дверь. (лист А4, указать список имен и SIN лиц, у кого есть ключ от замка)",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "no-enter-agent",
    "humanReadableName": "Запрет Доступа (агент)",
    "description": "Покажи только что активированную способность персонажу. Он должен немедленно покинуть заведение, сотрудником которого ты являешься. Он не может вернуться обратно 30 минут.",
    "prerequisites": [
      "arch-digital",
      "sub-agent"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "no-enter-eghost",
    "humanReadableName": "Запрет Доступа (егост)",
    "description": "Покажи только что активированную способность персонажу. Он должен немедленно покинуть заведение, сотрудником которого ты являешься. Он не может вернуться обратно 30 минут.",
    "prerequisites": [
      "sub-eghost",
      "arch-digital"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "no-enter-ai",
    "humanReadableName": "Запрет Доступа (ИИ)",
    "description": "Покажи это персонажу в VR (не цифровому), ему надо покинуть VR максимально быстро. Применяется только в VR.",
    "prerequisites": [
      "arch-digital",
      "ai-explorer"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "vr-protection",
    "humanReadableName": "Защита в Виар",
    "description": "К тебе нельзя применить способности, заставляющие покинуть VR",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-digital",
      "level": 1
    }
  },
  {
    "id": "stunning-resist",
    "humanReadableName": "Защита от оглушения",
    "description": "Иммунитет к оглушению. Скажи \"иммунитет\" и покажи эту способность, если тебя пытаются оглушить. Ты НЕ оглушен.",
    "prerequisites": [
      "arch-samurai",
      "faster-regen-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "good-rigga",
    "humanReadableName": "Защита от фидбека дронов",
    "description": "Снижает урон при выходе из поврежденного дрона.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-dwarf",
      "level": 1
    }
  },
  {
    "id": "matrix-feedback-resist",
    "humanReadableName": "Защита от фидбека матрицы",
    "description": "Снижает фейдинг техномантов и улучшает устойчивость к биофидбеку у декеров.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-dwarf",
      "level": 1
    }
  },
  {
    "id": "mental-resistance",
    "humanReadableName": "Защита разума",
    "description": "Немного повышает защиту от ментальных воздействий.",
    "prerequisites": [
      "arch-samurai",
      "faster-regen-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "kokkoro-health",
    "humanReadableName": "Здоровяк ",
    "description": "Ты получаешь +2 хита на 15 минут",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "koshcghei-health",
    "humanReadableName": "Здоровяк ",
    "description": "Ты получаешь +2 хита на 15 минут",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "horizon-health",
    "humanReadableName": "Здоровяк ",
    "description": "Ты получаешь +2 хита на 15 минут",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "badass-health",
    "humanReadableName": "Здоровяк ",
    "description": "Ты получаешь +2 хита на 15 минут",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "spirit-known",
    "humanReadableName": "Знакомый духов (P)",
    "description": "Тебе легче ловить духов",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "game-is-over",
    "humanReadableName": "Игра завершилась",
    "description": "- Все персонажи воскрешены\n-Удалены таймеры голода и вылечены все зависимости\n-В обновленной версии приложения на Google Play снова доступна кнопка самовоскрешения\n-Всем персонажам добавлена активная способность \"Божественное вмешательство\"",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "igra-na-birge-1",
    "humanReadableName": "Игра на бирже 1",
    "description": "ты получаешь кэшбэк 2% от всех своих рентных платежей.",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "igra-na-birge-2",
    "humanReadableName": "Игра на бирже 2",
    "description": "ты получаешь кэшбэк +5% от всех своих рентных платежей.",
    "prerequisites": [
      "arch-face",
      "igra-na-birge-1"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "igra-na-birge-3",
    "humanReadableName": "Игра на бирже 3",
    "description": "ты получаешь кэшбэк +13% от всех своих рентных платежей.",
    "prerequisites": [
      "arch-face",
      "igra-na-birge-2"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "dgroup-exclude",
    "humanReadableName": "Изгнать из дискурс-группы",
    "description": "Исключить персонажа из дискурс-группы",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 5
  },
  {
    "id": "initiative-basic",
    "humanReadableName": "Инициатива-базовая",
    "description": "Теперь ты можешь повышать свю инициативу во время рана",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "complex-form-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "dm-exclude-inq-1",
    "humanReadableName": "Инквизитор-1",
    "description": "Выгнать персонажа из дискурс-группы, восстановив заряд локуса",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "dm-exclude-inq-2",
    "humanReadableName": "Инквизитор-2",
    "description": "Выгнать персонажа из дискурс-группы, восстановив два заряда локуса",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ethic-kazak",
    "humanReadableName": "Казацкая сабля",
    "description": "Защита от нежити. Если ты сражаешься против Гулей или Вампиров - у тебя +2 хита (максимум 6)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "hands-samurai",
    "humanReadableName": "Киберруки и БиоСила",
    "description": "НАПОМИНАЛКА по правилам. Чтобы пользоваться оружием - тебе нужно иметь соответствующий Навык и установить себе имплант кибер-рука. Для одноручного оружия - нужна способность БиоСила или один имплант Кибер-рука. Чтобы держать оружие двумя руками (двуручное холодное, пулемет, или два одноручных) - БиоСила + Кибер-рука или 2 импланта Кибер-рука.",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "alpha-code",
    "humanReadableName": "Кодировка Альфа-уровня",
    "description": "Вы можете получить бэкдор по вашему запросу у мастера. Нужно знать идентификатор хоста (дата-трейл). Работает раз в 3 часа.",
    "prerequisites": [
      "arch-digital",
      "ai-researcher"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "native-compile",
    "humanReadableName": "Компиляция спрайта",
    "description": "Компиляция спрайта в основании\nfading +20",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-hackerman-technomancer",
      "level": 1
    }
  },
  {
    "id": "ai-sherlock",
    "humanReadableName": "Комплексный Анализ",
    "description": "Вы можете узнать у Мастера, кто и как манипулировал коробками, Позитивом и Негативом в текущем цикле в выбранном Заведении.",
    "prerequisites": [
      "arch-digital",
      "ai-manager"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "compressor",
    "humanReadableName": "Компрессор",
    "description": "Ты разобрался со всеми премудростями квантовой компрессии. Что позволяет сократить размер софта в памяти деки на 20%\n",
    "prerequisites": [
      "arch-hackerman-decker",
      "breacher-2"
    ],
    "availability": "closed",
    "karmaCost": 25
  },
  {
    "id": "huge-lucker",
    "humanReadableName": "Конский лак",
    "description": "Говорят, ты родился в рубашке. Возможно, однажды эта \"рубашка\" спасет тебе жизнь",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-1"
    ],
    "availability": "closed",
    "karmaCost": 10
  },
  {
    "id": "control-basic",
    "humanReadableName": "Контроль",
    "description": "Теперь ты можешь выбрать больше интересных навыков",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "complex-form-basic"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "dont-touch-my-hole",
    "humanReadableName": "Коротышка",
    "description": "Неотчуждаемый слот для бороды!",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-dwarf",
      "level": 1
    }
  },
  {
    "id": "die-hard",
    "humanReadableName": "Крепкий орешек",
    "description": "еще +1 хит в Красной Комнате",
    "prerequisites": [
      "arch-digital",
      "super-programme-code"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "deck-cve-delay-publish",
    "humanReadableName": "Криптоанархист",
    "description": "отсрочка публикации CVE увеличена на 30м",
    "prerequisites": [
      "arch-hackerman-decker",
      "breacher-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "bloody-tide",
    "humanReadableName": "Кровавый прилив",
    "description": "Увеличивает твоё сопротивление Откату",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "avalanche",
    "humanReadableName": "Кровопускание Киннидерг (S)",
    "description": "Снять со всех персонажей в реале в радиусе 5 метров от точки активации спелла (либо в пределах этого помещения) хиты в количестве Мощь/2. Можно указать исключения, на кого заклинание не действует  (рекомендуется привлекать для подтверждения эффекта представителя МГ)",
    "prerequisites": [
      "arch-mage",
      "trackball",
      "fireball",
      "tease-lesser-mind"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "sleep-whois-decker",
    "humanReadableName": "Кто лежит в ТХ? (декер)",
    "description": "Отсканируй qr телохранилища с телом внутри, чтобы узнать, кто там лежит.",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "sleep-whois-technomancer",
    "humanReadableName": "Кто лежит в ТХ? (техномант)",
    "description": "Отсканируй qr телохранилища с телом внутри, чтобы узнать, кто там лежит.",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "who-needs-it",
    "humanReadableName": "Кто платит",
    "description": "Ты можешь посмотреть кто платит ренту по этому товару.",
    "prerequisites": [
      "arch-face",
      "re-rent"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "complex-form-combat",
    "humanReadableName": "КФ в Красной комнате",
    "description": "Ты можешь использовать комплексные формы в красной комнате",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "complex-form-basic",
    "humanReadableName": "КФ в Основании",
    "description": "Ты можешь использовать комплексные формы в основании",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "magic-remove",
    "humanReadableName": "КФКК \"безмагия\" на всех",
    "description": "После использования этой комплексной формы никто не может использовать комплексные формы и все действительные эффекты комплексных форм - отменяются \nfading +600",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "one-for-all"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "hp-add-ally-all-1",
    "humanReadableName": "КФКК +1 хит всем своих",
    "description": "Добавить один хит всем союзникам (Хиты считаете сами)\nfading +150",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "hp-add-ally-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "hp-add-ally-1",
    "humanReadableName": "КФКК +1 хит одному",
    "description": "Добавить один хит союзнику (Хиты считаете сами)\nfading +80",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "complex-form-combat"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "hp-add-ally-all-2",
    "humanReadableName": "КФКК +2 хита всем своим",
    "description": "Добавить два хита всем союзникам (Хиты считаете сами)\nfading +200",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "hp-add-ally-all-1"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "hp-add-ally-2",
    "humanReadableName": "КФКК +2 хита одному",
    "description": "Добавить два хита союзнику (Хиты считаете сами)\nfading +100",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "hp-add-ally-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "hp-remove-foe-all-1",
    "humanReadableName": "КФКК -1 хит всем чужим",
    "description": "Снять один хит со всех противников (Хиты считаете сами)\nfading +180",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "hp-remove-foe-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "hp-remove-foe-1",
    "humanReadableName": "КФКК -1 хит с противника",
    "description": "Снять один хит противника (Хиты считаете сами)\nfading +100",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "hp-add-ally-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "hp-remove-foe-all-2",
    "humanReadableName": "КФКК -2 хита всем чужим",
    "description": "Снять два хита со всех противников (Хиты считаете сами)\nfading +300",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "hp-remove-foe-all-1"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "hp-remove-foe-2",
    "humanReadableName": "КФКК -2 хита с противника",
    "description": "Снять два хита противника (Хиты считаете сами)\nfading +120",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "hp-remove-foe-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "absolutely-death-rr",
    "humanReadableName": "КФКК добивание в АС в КК",
    "description": "Эту КФ можно применить только в Красной комнате, на персонажа, с которого сняты все хиты. Для применения надо активировать способность, затем сосканировать куар код жертвы, затем куар, который будет у игротехника.\r\nПосле применения КФ игрок должен выйти из данжа, к месту где оставил тело и там он получит КС. \r\nfading +150",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic",
      "initiative-basic",
      "sword-short",
      "clinical-death-rr"
    ],
    "availability": "closed",
    "karmaCost": 100
  },
  {
    "id": "clinical-death-rr",
    "humanReadableName": "КФКК добивание в КС в КК",
    "description": "Эту КФ можно применить только в Красной комнате, на персонажа, с которого сняты все хиты. Для применения надо активировать способность, затем сосканировать куар код жертвы, затем куар, который будет у игротехника.\nПосле применения КФ игрок должен выйти из данжа, к месту где оставил тело и там он получит КС. \nfading +150",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic",
      "initiative-basic",
      "sword-short"
    ],
    "availability": "open",
    "karmaCost": 80
  },
  {
    "id": "initiative-add-2",
    "humanReadableName": "КФКК инициатива +2 ",
    "description": "Твои лидерские качества улучшились, Инициатива +2 \n(у нападающих базовая и = 1, у защитников базовая и = 0)\nfading +60",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "complex-form-combat",
      "initiative-basic"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "bind-foe-all",
    "humanReadableName": "КФКК путы на всех чужих",
    "description": "Ты связал одну руку у всех противников, теперь они не могут ее использовать\nfading +150",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "bind-foe",
      "hp-remove-foe-all-1"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "bind-foe",
    "humanReadableName": "КФКК путы на одного чужого",
    "description": "Ты связал одну руку противника, теперь он не может ее использовать (должен убрать за спину и не может применять никакие предметы в этой руке)\nfading +50",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "hp-remove-foe-1",
      "initiative-add-2"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "add-time-1",
    "humanReadableName": "КФО больше времени +1",
    "description": "Теперь у вас на 1 минуту больше времени в данже\nfading +30",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "add-time-2",
    "humanReadableName": "КФО больше времени +2",
    "description": "Теперь у вас на 2 минуты больше времени в данже\nfading +40",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "add-time-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "add-time-3",
    "humanReadableName": "КФО больше времени +3",
    "description": "Теперь у вас на 3 минуты больше времени в данже\nfading +60",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "add-time-2"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "add-time-4",
    "humanReadableName": "КФО больше времени +4",
    "description": "Теперь у вас на 4 минуты больше времени в данже\nfading +200",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "add-time-3"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "add-time-5",
    "humanReadableName": "КФО больше времени +5",
    "description": "Теперь у вас на 5 минут больше времени в данже\nfading +400",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "add-time-4"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "add-basement",
    "humanReadableName": "КФО добавить опору",
    "description": "Укажи, где должна появиться дополнительная опора\nfading +120",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "levitation",
    "humanReadableName": "КФО левитация",
    "description": "Сейчас ты можешь спокойно обойти препятствие или топь по земле, считается, что ты летишь\nfading +500",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "magnetism",
      "add-basement"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "magnetism",
    "humanReadableName": "КФО магнетизм",
    "description": "У тебя в руках магнит, он притягивает любой предмет, который надо собрать в этой комнате, но только один\nfading +70",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "one-for-all",
    "humanReadableName": "КФО один за всех",
    "description": "Ты можешь пройти эту комнату один за всю свою команду\nfading +200",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "initiative-basic"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "bond-breaker",
    "humanReadableName": "КФО освобождение от пут",
    "description": "Ты можешь освободить одну руку себе или товарищу\nfading +80",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "remove-excees"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "bell-silence",
    "humanReadableName": "КФО тишина колокольчиков",
    "description": "Ты можешь задевать колокольчики, матрица их не услышит\nfading +150",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "remove-excees",
    "humanReadableName": "КФО убрать все лишнее",
    "description": "Теперь матрица подскажет тебе, какие детали лишние\nfading +200",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "remove-half"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "remove-half",
    "humanReadableName": "КФО убрать половину ",
    "description": "Теперь матрица убирает половину деталей, чтобы уменьшить сложность конструкции\nfading +150",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "photo-memory",
    "humanReadableName": "КФО фотопамять",
    "description": "Ты можешь сфотографировать объект и переслать фото другому участнику комнады\nfading +230",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "complex-form-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "second-sight",
    "humanReadableName": "КФО ясновидение",
    "description": "Теперь матрица (в лице игротеха) может подсказать тебе расположение двух деталей конструкции\nfading +100",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "photo-memory"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "lie-to-me",
    "humanReadableName": "Лай ту ми",
    "description": "Целевой персонаж не может скрыть свою ложь. Если цель лжет, то выполняет щелкает пальцами. Эффект длится 15 минут",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "stubbornness-3",
    "humanReadableName": "Легендарная упертость",
    "description": "Продлевает максимальное время нахождения на хосте на еще на 10 минут",
    "prerequisites": [
      "arch-hackerman-decker",
      "stubbornness-2",
      "breacher-3"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "breacher-3",
    "humanReadableName": "Легендарный Бричер",
    "description": "Улучшает конверсию Intellect в Firewall еще на 10%",
    "prerequisites": [
      "arch-hackerman-decker",
      "breacher-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "miner-3",
    "humanReadableName": "Легендарный Майнер",
    "description": "Улучшает конверсию Intellect в Dataprocessing  еще на 10%",
    "prerequisites": [
      "arch-hackerman-decker",
      "miner-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "sly-3",
    "humanReadableName": "Легендарный Слай",
    "description": "Улучшает конверсию Intellect в Sleaze  еще на 10%",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "fencer-3",
    "humanReadableName": "Легендарный Фенсер",
    "description": "Улучшает конверсию Intellect в Attack еще на 10%",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "armor-2",
    "humanReadableName": "Легкая броня",
    "description": "Ты можешь носить легкую броню. При наличии легкой брони получаешь +2 хита. Надеть легкую броню можно только при наличии импланта \"крепкая спина\".",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "ethic-carrion",
    "humanReadableName": "Лечебные ингредиенты",
    "description": "Ты можешь вылечить персонажа (восстановить все хиты, но НЕ поднять из тяжрана), если добьешь гуля. ",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "medcart-light-heal-1",
    "humanReadableName": "Лечение легких ранений (1)",
    "description": "Вылечить легкое ранение (1)",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "medcart-light-heal-2",
    "humanReadableName": "Лечение легких ранений (2)",
    "description": "Вылечить легкое ранение (2)",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "medcart-light-heal-3",
    "humanReadableName": "Лечение легких ранений (3)",
    "description": "Вылечить легкое ранение (3)",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "medcart-reanimate",
    "humanReadableName": "Лечение состояния КС",
    "description": "Вылечить состояние КС\n(Ты можешь взаимодействовать с телом в КС)",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "medcart-heavy-heal-1",
    "humanReadableName": "Лечение тяжелых ран (1)",
    "description": "Вылечить тяжелое ранение (1)",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "medcart-heavy-heal-2",
    "humanReadableName": "Лечение тяжелых ран (2)",
    "description": "Вылечить тяжелое ранение (2)",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "medcart-heavy-heal-3",
    "humanReadableName": "Лечение тяжелых ран (3)",
    "description": "Вылечить тяжелое ранение (3)",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "passport-hobo",
    "humanReadableName": "Лишить гражданства России",
    "description": "Ты можешь лишить чаммера гражданства Корпорация Россия",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ethic-emotions",
    "humanReadableName": "Ловец эмоций",
    "description": "Твое время в VR увеличено на 30 минут. Развлекайся!",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "magic-1",
    "humanReadableName": "Магия 1 (P)",
    "description": "Перманентно увеличивает твою характеристику Магия на 1",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "magic-1-summ",
    "humanReadableName": "Магия 1-П! (P)",
    "description": "Перманентно увеличивает твою характеристику Магия на 1",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "magic-2",
    "humanReadableName": "Магия 2 (P)",
    "description": "Перманентно увеличивает твою характеристику Магия на 1",
    "prerequisites": [
      "magic-1",
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 40
  },
  {
    "id": "magic-2-summ",
    "humanReadableName": "Магия 2-П! (P)",
    "description": "Перманентно увеличивает твою характеристику Магия на 1",
    "prerequisites": [
      "magic-1-summ",
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "magic-3",
    "humanReadableName": "Магия 3 (P)",
    "description": "Перманентно увеличивает твою характеристику Магия на 1",
    "prerequisites": [
      "magic-2",
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "magic-4",
    "humanReadableName": "Магия 4 (P)",
    "description": "Перманентно увеличивает твою характеристику Магия на 1",
    "prerequisites": [
      "magic-3",
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "magic-5",
    "humanReadableName": "Магия 5 (P)",
    "description": "Перманентно увеличивает твою характеристику Магия на 1",
    "prerequisites": [
      "magic-4",
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "magic-in-the-blood",
    "humanReadableName": "Магия в крови",
    "description": "Увеличивает максимальную доступную тебе Мощь на {{ amount }}",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ai-matrix-curse",
    "humanReadableName": "Матричное проклятье",
    "description": "Ослабление для Техномантов в Красной Комнате. Цель не может атаковать в течении одной минуты, только защищаться. Применяется на 3 цели одновременно. ",
    "prerequisites": [
      "arch-digital",
      "ai-dismorale"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "ai-matrix-gift",
    "humanReadableName": "Матричный дар",
    "description": "Усиление для Техномантов в Красной Комнате.  Атаки цели снимают два хита вместо одного на протяжении одного конфликта в КК. Применяется на 3 цели одновременно. ",
    "prerequisites": [
      "arch-digital",
      "ai-buff-double-damage"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "media-person",
    "humanReadableName": "Медиа-персона",
    "description": "Ты медиа персона и можешь развивать навыки работы со СМИ, новостями и информацией.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "arch-hack-decker-med-1",
    "humanReadableName": "Медицина и Хром 1",
    "description": "возможность использовать useapi API биомонитора и rcc",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "arch-hack-decker-med-2",
    "humanReadableName": "Медицина и Хром 2",
    "description": "дополнительные возможности useapi на API биомонитора и rcc",
    "prerequisites": [
      "arch-hackerman-decker",
      "arch-hack-decker-med-1"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "arch-hack-decker-med-3",
    "humanReadableName": "Медицина и Хром 3",
    "description": "расширенные возможности useapi на API биомонитора и rcc",
    "prerequisites": [
      "arch-hackerman-decker",
      "arch-hack-decker-med-2"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "medicraft-1",
    "humanReadableName": "Медицинские дроны 1",
    "description": "Улучшает способность по управлению медикартами.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "medicraft-2",
    "humanReadableName": "Медицинские дроны 2",
    "description": "Сильнее улучшает способность по управлению медикартами.",
    "prerequisites": [
      "arch-rigger",
      "medicraft-1"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "medicraft-3",
    "humanReadableName": "Медицинские дроны 3",
    "description": "Максимально улучшает способность по управлению медикартами. Немного улучшает навык для всех остальных типов дронов.",
    "prerequisites": [
      "arch-rigger",
      "medicraft-2"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "clubs'n'swords-2",
    "humanReadableName": "Мечи и топоры",
    "description": "Ты можешь использовать легкое холодное оружие - мечи, сабли до 120 см, топоры длиной до 100 см. Атака НЕ пробивает тяжелую броню.",
    "prerequisites": [
      "arch-samurai",
      "clubs'n'swords-1"
    ],
    "availability": "open",
    "karmaCost": 70
  },
  {
    "id": "my-scoring",
    "humanReadableName": "Мой скоринг",
    "description": "отображается  текущий коэф. скоринга данного персонажа с множителями.",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "monastery-ritual-magic",
    "humanReadableName": "Монастырский ритуал",
    "description": "Во время каста можно использовать людей (сканируя их QR) для увеличения доступной Мощи и снижения Отката",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "ethic-common",
    "humanReadableName": "Моральная поддержка",
    "description": "Покажите текст цели. Цель может нажать \"Готово\" на любом поступке личной этики, не выполняя его условий. Ты можешь оказать поддержку один раз в час.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "ai-precious",
    "humanReadableName": "Моя прелесть",
    "description": "Вы можете поставить метку своего ИИ на заведение.",
    "prerequisites": [
      "arch-digital",
      "ai-manager"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "groundcraft-1",
    "humanReadableName": "Наземные дроны 1",
    "description": "Улучшает способность по управлению наземными дронами.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "groundcraft-2",
    "humanReadableName": "Наземные дроны 2",
    "description": "Сильнее улучшает способность по управлению наземными дронами.",
    "prerequisites": [
      "groundcraft-1",
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "groundcraft-3",
    "humanReadableName": "Наземные дроны 3",
    "description": "Максимально улучшает способность по управлению наземными дронами.",
    "prerequisites": [
      "groundcraft-2",
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "kokkoro-vr",
    "humanReadableName": "Нано-подключение к VR",
    "description": "При подключении к VR в течение 40 минут, время пребывания там увеличено на час.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "koshcghei-vr",
    "humanReadableName": "Нано-подключение к VR",
    "description": "При подключении к VR в течение 40 минут, время пребывания там увеличено на час.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "horizon-vr",
    "humanReadableName": "Нано-подключение к VR",
    "description": "При подключении к VR в течение 40 минут, время пребывания там увеличено на час.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "badass-vr",
    "humanReadableName": "Нано-подключение к VR",
    "description": "При подключении к VR в течение 40 минут, время пребывания там увеличено на час.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ai-additional-projection",
    "humanReadableName": "Нас становится больше",
    "description": "Сделать цифрового чаммера E-ghosta своей дополнительной проекцией. Необходима трата эссенса.",
    "prerequisites": [
      "arch-digital",
      "ai-researcher"
    ],
    "availability": "open",
    "karmaCost": 80
  },
  {
    "id": "deep-legacy",
    "humanReadableName": "Наследник Стрелка",
    "description": "Ты можешь использовать любое холодное оружие в Красной комнате. ",
    "prerequisites": [
      "arch-digital",
      "programm-code-ai"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "neo-legacy",
    "humanReadableName": "Наследство Нео",
    "description": "Небольшой пассивный доход",
    "prerequisites": [
      "arch-digital",
      "sub-eghost"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "ai-qouta",
    "humanReadableName": "Настраиваемые квоты",
    "description": "Может забрать себе содержимое одной заполненной коробки Позитива из заведения, где стоит ваша метка.",
    "prerequisites": [
      "arch-digital",
      "ai-precious"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "ai-project-boost",
    "humanReadableName": "Не нашел, а наторговал!",
    "description": "Обменять Позитив на ресурс для Проекта.",
    "prerequisites": [
      "arch-digital",
      "ai-researcher"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "auto-doc-neuro",
    "humanReadableName": "Нейрохирургия",
    "description": "Ты можешь использовать автодок для установки биоимплантов.",
    "prerequisites": [
      "arch-rigger",
      "auto-doc-3"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "meta-norm",
    "humanReadableName": "Норм",
    "description": "Ты норм. Самый обычный Sapiens, как и миллионы других.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-norm",
      "level": 1
    }
  },
  {
    "id": "just-like-that",
    "humanReadableName": "Ну очень глубоко",
    "description": "Ты повелитель глубинных слоев Матрицы, Глубина+1",
    "prerequisites": [
      "arch-digital",
      "more-deep-er"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "ai-more-precious",
    "humanReadableName": "Нужно больше Позитива",
    "description": "Вы можете увеличить запасы Вашего Позитива на 50% от имеющегося количества на момент применения способности.",
    "prerequisites": [
      "arch-digital",
      "ai-precious"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "cloud-memory-temporary",
    "humanReadableName": "Облачная память",
    "description": "Вы не забываете события произошедшие с вами непосредственно перед КС",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 80
  },
  {
    "id": "cloud-memory",
    "humanReadableName": "Облачная память ",
    "description": "Следующие 6 часов целевой персонаж не забывает события перед КС",
    "prerequisites": [
      "arch-face",
      "full-oblivion"
    ],
    "availability": "open",
    "karmaCost": 80
  },
  {
    "id": "meta-werewolf",
    "humanReadableName": "Оборотень",
    "description": "Нажми, чтобы принять форму зверя - не более чем на 60 минут.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "rummage",
    "humanReadableName": "Обыск",
    "description": " Покажи этот текст тому, кого хочешь обыскать. Тот, кого обыскивают, должен показать тебе все игровые предметы, не встроенные в тело. Показывать надо все, на чем есть qr-код. Также он показывает игровые документы, письма, записки. обыскивающий может их прочесть и сфотографировать.  НЕ показывает чаты, импланты, содержание телефона и игрового приложения.",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "stunning",
    "humanReadableName": "Оглушение",
    "description": "Ты можешь оглушать. Нужно подойти к цели сзади и нанести слабый удар по плечу рукоятью холодного оружия или нерфа и произнести маркер “оглушен”. Оглушение можно производить только в небоевой ситуции.",
    "prerequisites": [
      "arch-samurai",
      "binding"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "insight",
    "humanReadableName": "Озарение",
    "description": "Когда у тебя полностью накоплена модальность, ты можешь потратить ее.. На озарение. Ты можешь превратить Идею в Рецепт, то есть \r\nсделать то, что не доступно \"просто\"-людям. Ранее это было доступно лишь сильным ИИ. Это совершенно новый уровень работы с Матрицей,\r\nи, скорее всего, эта способность - начало НОВОГО, пути! Это завораживает!\r\n\r\nТехномант не мог создать эту форму. Она.. она чужая. Да, она работает. Да, она очень эффективна. Но ранее мы никогда не сплетали\r\nрезонанс такой техникой.\r\n\r\nВНИМАНИЕ: после получения этой абилки - обратись к мастерам. Она заработает не сразу.",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "self-awareness"
    ],
    "availability": "closed",
    "karmaCost": 20
  },
  {
    "id": "danila-i-need-help",
    "humanReadableName": "Оказать услугу",
    "description": "Данила, ай нид хелп. Цель оказывает услугу, даже если это грозит ей средними проблемами (отсутствие угрозы жизни). Выполнение услуги не должно занимать больше 10 минут.  Также нельзя попросить что-либо забыть или не говорить. Перевод денег и подарок не могут быть услугой.",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "look-its-shekel",
    "humanReadableName": "Опа, шекель!",
    "description": "При получении лута после прохождения данжа покажи данную абилку игротеху. Ты получаешь +10% от лута твоей команды.",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "arch-hackerman-decker-boost",
    "humanReadableName": "Опытный Декер",
    "description": "Очень опытный декер.",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-hackerman-decker-boost",
      "level": 1
    }
  },
  {
    "id": "arch-mage-boost",
    "humanReadableName": "Опытный Маг",
    "description": "Очень опытный маг.",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-mage-boost",
      "level": 1
    }
  },
  {
    "id": "hack-deck-rungc-other",
    "humanReadableName": "Опытный мусорщик",
    "description": "Новая цель команды rungc: другой декер\n\nУдивительная способность принудительно активировать сборку мусора в канале другого декера, оживляя его канал.\n\nНесколько увеличивает эффективность работы rungc и несколько сокращает ее кулдаун.",
    "prerequisites": [
      "arch-hackerman-decker",
      "hack-deck-rungc"
    ],
    "availability": "closed",
    "karmaCost": 15
  },
  {
    "id": "project-manager-3",
    "humanReadableName": "Опытный проект-менеджер",
    "description": "Ты - опытный проект-менеджер",
    "prerequisites": [
      "project-manager-1"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "arch-rigger-boost",
    "humanReadableName": "Опытный Риггер",
    "description": "Очень опытный риггер.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-rigger-boost",
      "level": 1
    }
  },
  {
    "id": "arch-samurai-boost",
    "humanReadableName": "Опытный Самурай",
    "description": "Очень опытный самурай.",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-samurai-boost",
      "level": 1
    }
  },
  {
    "id": "arch-hackerman-technomancer-boost",
    "humanReadableName": "Опытный Техномант",
    "description": "Очень опытный техномант.",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-technomancer-boost",
      "level": 1
    }
  },
  {
    "id": "arch-face-boost",
    "humanReadableName": "Опытный Фейс",
    "description": "Очень опытный фейс",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-face-boost",
      "level": 1
    }
  },
  {
    "id": "meta-ork",
    "humanReadableName": "Орк",
    "description": "Ты орк. У тебя восхитительные клыки и крепкие кулаки.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ork",
      "level": 1
    }
  },
  {
    "id": "unbinding",
    "humanReadableName": "Освобождение связанного",
    "description": "Ты можешь освободить связанного мгновенно и в боевой ситуации. Отыграй, как ты оружием перепиливаешь\\отстреливаешь связующие путы. Это должно быть хорошо заметное внешнее воздействие. ",
    "prerequisites": [
      "arch-samurai",
      "binding"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "magic-feedback-unresistance-1",
    "humanReadableName": "Откатошный 1 (P)",
    "description": "Перманентно увеличивает твой Откат на 20%",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": -20
  },
  {
    "id": "magic-feedback-unresistance-2",
    "humanReadableName": "Откатошный 2 (P)",
    "description": "Перманентно увеличивает твой Откат на 20%",
    "prerequisites": [
      "magic-feedback-unresistance-1",
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": -30
  },
  {
    "id": "magic-feedback-unresistance-3",
    "humanReadableName": "Откатошный 3 (P)",
    "description": "Перманентно увеличивает твой Откат на 20%",
    "prerequisites": [
      "magic-feedback-unresistance-2",
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": -40
  },
  {
    "id": "drone-logoff",
    "humanReadableName": "Отключение от дрона",
    "description": "Если вы хотите отключиться от дрона - нажмите эту кнопку, после чего вернитесь в свое тело.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "breacher-2",
    "humanReadableName": "Отличный Бричер",
    "description": "Улучшает конверсию Intellect в Firewall еще на 10%",
    "prerequisites": [
      "arch-hackerman-decker",
      "breacher-1"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "miner-2",
    "humanReadableName": "Отличный Майнер",
    "description": "Улучшает конверсию Intellect в Dataprocessing  еще на 10%",
    "prerequisites": [
      "arch-hackerman-decker",
      "miner-1"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "sly-2",
    "humanReadableName": "Отличный Слай",
    "description": "Улучшает конверсию Intellect в Sleaze  еще на 10%",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-1"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "fencer-2",
    "humanReadableName": "Отличный Фенсер",
    "description": "Улучшает конверсию Intellect в Attack еще на 10%",
    "prerequisites": [
      "arch-hackerman-decker",
      "fencer-1"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "magic-blockade",
    "humanReadableName": "Отторжение Магии",
    "description": "Ты не можешь изучать навыки Мага",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-digital",
      "level": 1
    }
  },
  {
    "id": "tech-blockade",
    "humanReadableName": "Отторжение техники",
    "description": "Ты не можешь изучать навыки Риггера Пилота и Хакера Техноманта ",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ghoul",
      "level": 1
    }
  },
  {
    "id": "chrome-blockade",
    "humanReadableName": "Отторжение хрома",
    "description": "Ты не можешь использовать кибернетические импланты. Биотех - можно.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ghoul",
      "level": 1
    }
  },
  {
    "id": "paralysis-1",
    "humanReadableName": "Оцепенение",
    "description": "Цель не может двигаться 10 минут или пока ей не нанесён физический урон (-1хит). ",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "really-need-it",
    "humanReadableName": "Очень надо.",
    "description": "Цель дарит менталисту 1 игровой предмет по выбору менталиста. Предмет должен быть отчуждаем (например, нельзя попросить подарить установленный имплант)",
    "prerequisites": [
      "arch-face",
      "billioner-walk"
    ],
    "availability": "open",
    "karmaCost": 70
  },
  {
    "id": "quick-to-enter-2",
    "humanReadableName": "Очень шустрый",
    "description": "Снижает время входа на хост на еще минуту",
    "prerequisites": [
      "arch-hackerman-decker",
      "quick-to-enter-1",
      "sly-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "paralysis-2",
    "humanReadableName": "Паралич движения",
    "description": "Цель не может двигаться 10 минут.\nНе может пользоваться активными абилками.",
    "prerequisites": [
      "arch-face",
      "paralysis-1"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "drone-paralysis-1",
    "humanReadableName": "Паралич движения 1",
    "description": "Ты можешь касанием (дубинкой) И криком \"Паралич!\" обездвижить любое мясное/эктоплазменное тело на 90 секунд.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-paralysis-2",
    "humanReadableName": "Паралич движения 2",
    "description": "Ты можешь касанием (дубинкой) И криком \"Паралич!\" обездвижить любое мясное/эктоплазменное тело на 90 секунд.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "drone-paralysis-3",
    "humanReadableName": "Паралич движения 3",
    "description": "Ты можешь касанием (дубинкой) И криком \"Паралич!\" обездвижить любое мясное/эктоплазменное тело на 90 секунд.",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "paralysis-3",
    "humanReadableName": "Паралич полный",
    "description": "Цель не может двигаться и произносить звуки 10 минут.\nНе может пользоваться активными абилками.",
    "prerequisites": [
      "arch-face",
      "paralysis-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "re-rent",
    "humanReadableName": "Переоформить ренту",
    "description": "ГМ может целевому персонажу переоформить контракт с новым коэфициентом скоринга. ",
    "prerequisites": [
      "arch-face",
      "let-him-pay"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "sleep-kick",
    "humanReadableName": "Пинок в мягкое тельце!",
    "description": "Отсканируй qr телохранилища с телом внутри, чтобы больно ударить его и принудить вернуться к телу.",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "vampire-feast",
    "humanReadableName": "Питание вампиров",
    "description": "Отсканируй QR жертвы для питания\nТвой Эссенс увеличится на 2.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-vampire",
      "level": 1
    }
  },
  {
    "id": "ghoul-feast",
    "humanReadableName": "Питание гулей",
    "description": "Отсканируй QR жертвы для питания\nТвой Эссенс увеличится на 1.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ghoul",
      "level": 1
    }
  },
  {
    "id": "how-much-is-rent",
    "humanReadableName": "ПлачУ и ПлАчу",
    "description": "посмотреть на qr и сказать размер рентного платежа чаммера. ",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "extra-hp",
    "humanReadableName": "Плюс хит",
    "description": "У тебя дополнительный хит в мясном теле. ",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ork",
      "level": 1
    }
  },
  {
    "id": "depth-master",
    "humanReadableName": "Повелитель Глубины",
    "description": "Ты развиваешь свою Глубину и повышаешь эффективность использования навыков.. Глубина +1",
    "prerequisites": [
      "arch-digital",
      "sub-ai"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "drone-danger",
    "humanReadableName": "Повреждение дрона",
    "description": "Если ваш дрон атакован и с него сняли все хиты - нажмите эту кнопку. Оставьте QR дрона там где вы находитесь. Дрон перейдет в состояние \"Сломан\". \nСами наденьте белый хайратник, вернитесь к месту, где вы оставили тело и примените абилку \"Отключение от дрона\". После чего немедленно вернитесь в свое тело. ",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "increase-the-mental-protection",
    "humanReadableName": "Повысить м-защиту другому",
    "description": "на 12 часов увеличивает сопротивляемость целевого персонажа ментальному воздействию. ",
    "prerequisites": [
      "arch-face",
      "paralysis-3"
    ],
    "availability": "closed",
    "karmaCost": 80
  },
  {
    "id": "resonanse-increase1",
    "humanReadableName": "Погружение в Резонанс 1",
    "description": "Увеличивает Резонанс на +1",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "backdoor-hold-5"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "resonanse-increase2",
    "humanReadableName": "Погружение в Резонанс 2",
    "description": "Увеличивает Резонанс на +1",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "resonanse-increase1",
      "runaway"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "resonanse-increase3",
    "humanReadableName": "Погружение в Резонанс 3",
    "description": "Увеличивает Резонанс на +1",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "resonanse-increase2"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "bloggers-support",
    "humanReadableName": "Поддержка блоггеров",
    "description": "Раз в 12 часов вы можете назвать мастерам некую личность или организацию и защитить ее от использования способности \"собрать компромат\" на 12 часов.",
    "prerequisites": [
      "media-person"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "come-with-me-shit-eater",
    "humanReadableName": "Пойдем, выйдем",
    "description": "Вызвать на дуэль проекцию другого ИИ. В Красной комнате вы можете использовать только одноручный меч.",
    "prerequisites": [
      "arch-digital",
      "sub-ai"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "police-scanner",
    "humanReadableName": "Полицейский сканер",
    "description": "Ты имеешь право требовать показать в приложении страницу Экономика  - вкладка Паспорт",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 10
  },
  {
    "id": "full-oblivion",
    "humanReadableName": "Полное Забвение",
    "description": "Персонаж не помнит события последней сцены. Начало сцены определяет менталист, но не больше 30 минут.",
    "prerequisites": [
      "arch-face",
      "oblivion"
    ],
    "availability": "open",
    "karmaCost": 70
  },
  {
    "id": "reduce-the-mental-protection",
    "humanReadableName": "Понизить м-защиту другому",
    "description": "на 6 часов  уменьшает сопротивляемость целевого персонажа ментальному воздействию. ",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "closed",
    "karmaCost": 80
  },
  {
    "id": "last-report",
    "humanReadableName": "Последний репортаж",
    "description": "Эта способность сработает только если вашм персонаж был добит в КС. Вы можете записать на камеру рассказ про последние 15 минут вашей жизни, даже если вы были без сознания и чего-то не видели - можете это описать.\r\nЗапись можно выложить в любой канал, где у вас остались права на размещение материалов или послать кому-то личным сообщением.",
    "prerequisites": [
      "media-person"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "see-backdoor",
    "humanReadableName": "Посмотреть спрайты",
    "description": "Ты можешь посмотреть спрайт, установленные на данный хост.\nfading +150",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "settle-backdoor"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "investigate-scoring",
    "humanReadableName": "Посмотрим скоринг",
    "description": "другой персонаж сможет видеть свои коэффициенты скоринга в течение 5 минут.",
    "prerequisites": [
      "arch-face",
      "my-scoring"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "orthodox-ritual-magic",
    "humanReadableName": "Православный ритуал (P)",
    "description": "Во время каста можно использовать людей (сканируя их QR) для увеличения доступной Мощи и снижения Отката",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "scorn-him",
    "humanReadableName": "Презрение",
    "description": "Цель старается сделать агрессивное, но не смертельное действие к выбранному персонажу.  (оскорбить, выразить презрение убеждениям )  Адресат должен находиться в прямой видимости. ",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "elven-prices",
    "humanReadableName": "Прекрасные цены",
    "description": "Ваш скоринг прекрасен, эльфийское долголетие всегда в цене! Особая скидка на все покупки!",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-elf",
      "level": 1
    }
  },
  {
    "id": "armor-1",
    "humanReadableName": "Приживление имплантов",
    "description": "Усиленное приживление имплантов сильно мешает рипоменам срезать имеющиеся у тебя импланты.",
    "prerequisites": [
      "arch-samurai",
      "armor-2"
    ],
    "availability": "open",
    "karmaCost": 70
  },
  {
    "id": "passport-citizen",
    "humanReadableName": "Принять в гражданство",
    "description": "Ты можешь сделать чаммера полноправным гражданином корпорации Россия",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "dgroup-add",
    "humanReadableName": "Принять в дискурс-группу",
    "description": "Принять персонажа в дискурс-группу",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 5
  },
  {
    "id": "arch-rigger-negative-1",
    "humanReadableName": "Проблемы риггера - 1",
    "description": "У тебя проблемы, ригга. (штраф на Интеллект)",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": -20
  },
  {
    "id": "arch-rigger-negative-2",
    "humanReadableName": "Проблемы риггера - 2",
    "description": "У тебя серьезные проблемы, ригга. (штраф на Телосложение)",
    "prerequisites": [
      "arch-rigger-negative-1"
    ],
    "availability": "open",
    "karmaCost": -30
  },
  {
    "id": "arch-rigger-negative-3",
    "humanReadableName": "Проблемы риггера - 3",
    "description": "У тебя очень серьезные проблемы, ригга. (дополнительный штраф на Интеллект, Телосложение и дополнительный урон при выходе из дрона)",
    "prerequisites": [
      "arch-rigger-negative-2"
    ],
    "availability": "open",
    "karmaCost": -40
  },
  {
    "id": "arch-face-negative-1",
    "humanReadableName": "проблемы фейса-1",
    "description": "У тебя проблемы, фейс.",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": -15
  },
  {
    "id": "arch-face-negative-2",
    "humanReadableName": "проблемы фейса-2",
    "description": "У тебя серьезные проблемы, фейс.",
    "prerequisites": [
      "arch-face-negative-1"
    ],
    "availability": "open",
    "karmaCost": -35
  },
  {
    "id": "arch-face-negative-3",
    "humanReadableName": "проблемы фейса-3",
    "description": "У тебя очень серьезные проблемы, фейс.",
    "prerequisites": [
      "arch-face-negative-2"
    ],
    "availability": "open",
    "karmaCost": -50
  },
  {
    "id": "ai-dismorale",
    "humanReadableName": "Провал морали",
    "description": "Ослабление для Техномантов в Красной Комнате. Цель не может атаковать в течении одной минуты, только защищаться. ",
    "prerequisites": [
      "arch-digital",
      "ai-troubleshooter"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "programm-code-ai",
    "humanReadableName": "Программный код",
    "description": "+1 хит в Красной Комнате",
    "prerequisites": [
      "arch-digital",
      "ai-troubleshooter"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "billioner-walk",
    "humanReadableName": "Прогулка миллионера",
    "description": "Цель переводит на счет менталиста 20% денег со своего счета. Способность не работает на персонажей с иридиевым лафстайлом.",
    "prerequisites": [
      "arch-face",
      "danila-i-need-help"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "project-manager-1",
    "humanReadableName": "Проект-менеджер",
    "description": "Сертификат проект-менеджера. Ты можешь вести проекты. Для каждого типа проектов необходим соответствующий навык.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "sub-ai",
    "humanReadableName": "Проекция ИИ",
    "description": "Ты часть проекции Искусственного Интеллекта, сгусток программ и кода, живущий в Матрице. ",
    "prerequisites": [
      "arch-digital"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ai-concurents",
    "humanReadableName": "Происки конкурентов",
    "description": "Заполнить один ящик Негатива указанного заведения (необходим мастер, он заполнит коробку бусинами).",
    "prerequisites": [
      "arch-digital",
      "ai-black-pr"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "dm-inc-counter",
    "humanReadableName": "Пропаганда",
    "description": "Добавить один заряд к локусу",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "dm-prophet",
    "humanReadableName": "Пророк",
    "description": "Предъявите экран с описанием абилки региональному мастеру, чтобы получить новый QR локуса.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ai-project-creation-essens",
    "humanReadableName": "Прочувствовать Проект",
    "description": "Получить рецепт Проекта потратив Эссенс.",
    "prerequisites": [
      "arch-digital",
      "ai-researcher"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "guns-3",
    "humanReadableName": "Пулеметы",
    "description": "Ты можешь использовать пулемёт (без ограничения патронов, электромех). Оружие необходимо держать двумя руками. Атака НЕ пробивает тяжелую броню.",
    "prerequisites": [
      "arch-samurai",
      "guns-2"
    ],
    "availability": "open",
    "karmaCost": 80
  },
  {
    "id": "scout-decker",
    "humanReadableName": "Разведка без боя",
    "description": "Ты можешь прийти к данжу Основание, назвать ID хоста и запросить схему хоста (активируй абилку в присутствии мастера)",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "self-unbinding-mage",
    "humanReadableName": "Развязывание (маг)",
    "description": "Если тебя связали - ты можешь развязаться в любой момент по своему желанию.  Необходимо громко должны сказать “развязался” и скинуть веревочные петли. ",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "self-unbinding-face",
    "humanReadableName": "Развязывание (фейс)",
    "description": "Если тебя связали - ты можешь развязаться в любой момент по своему желанию.  Необходимо громко сказать “развязался” и скинуть веревочные петли. ",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "marauder-3",
    "humanReadableName": "Разрушить предмет",
    "description": "Ты можешь порвать (разрушить по игре) куар доспеха, дрона, кибердеки, магического фокуса или импланта. Способность можно применить только к куару, который находится у тебя в руках. К куару находящемуся у другого персонажа способность применять НЕЛЬЗЯ.",
    "prerequisites": [
      "arch-samurai",
      "marauder-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "ai-project-creation",
    "humanReadableName": "Рассчитать Проект",
    "description": "Получить рецепт Проекта потратив Позитив.",
    "prerequisites": [
      "arch-digital",
      "ai-researcher"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "faster-regen-1",
    "humanReadableName": "Регенерация 1",
    "description": "Ты восстанавливаешь все хиты за 40 минут, если не находишься в тяжелом ранении",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "faster-regen-2",
    "humanReadableName": "Регенерация 2",
    "description": "Ты восстанавливаешь все хиты за 20 минут, если не находишься в тяжелом ранении",
    "prerequisites": [
      "arch-samurai",
      "faster-regen-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "chem-resist-heavy",
    "humanReadableName": "Резистивность к препаратам",
    "description": "Для правильного воздействия препарата нужны увеличенные дозы. Аккуратно!",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ghoul",
      "level": 1
    }
  },
  {
    "id": "drone-recovery-bonus-1",
    "humanReadableName": "Ремонт бонус 1",
    "description": "Улучшает способность по ремонту дронов в Мастерской.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "drone-recovery-bonus-2",
    "humanReadableName": "Ремонт бонус 2",
    "description": "Сильнее улучшает способность по ремонту дронов в Мастерской.",
    "prerequisites": [
      "arch-rigger",
      "drone-recovery-bonus-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "drone-recovery-bonus-3",
    "humanReadableName": "Ремонт бонус 3",
    "description": "Максимально улучшает способность по ремонту дронов в Мастерской.",
    "prerequisites": [
      "arch-rigger",
      "drone-recovery-bonus-2"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "drone-recovery",
    "humanReadableName": "Ремонт дрона",
    "description": "Восстанавливает работоспособность дрона (необходимо отсканировать сломанного дрона и предмет \"Ремкомплект\")",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "cyberdeck-recovery",
    "humanReadableName": "Ремонт Кибердеки",
    "description": "Восстанавливает работоспособность Кибердеки (необходимо отсканировать сломанную кибердеку и предмет \"Набор никросхем\")",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "ethic-control",
    "humanReadableName": "Решай за других",
    "description": "Ты можешь заставить другого персонажа показать его куар (при активации способности 1 раз)",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "repoman-active",
    "humanReadableName": "Рипомен",
    "description": "Активируй, чтобы снять имплант\\мод с чаммера. Выберется самый слабый.  Для использования тебе не нужны медикарт или автодок. Нужен пустой QR чип.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "repoman-medic",
    "humanReadableName": "Рипомен хирург",
    "description": "Ты можешь использовать автодок для снятия имплантов.",
    "prerequisites": [
      "arch-rigger",
      "auto-doc-2",
      "repoman-1"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "ritual-magic",
    "humanReadableName": "Ритуальная магия (P)",
    "description": "Во время каста можно использовать людей (сканируя их QR) для увеличения доступной Мощи и снижения Отката",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "closed",
    "karmaCost": 50
  },
  {
    "id": "ethic-roleplay",
    "humanReadableName": "Ролеплей",
    "description": "Покажи это цели. Расскажи ему историю, кто ты, кто он и почему он должен быть наказан. Цель испытвает непреодолимое желание, чтобы его наказали прямо сейчас.  Помоги ему и накажи цель. Если ты причинишь цели ущерб (снимешь хит) - воздействие тут же спадет. Иначе - воздействие держится десять минут. Цель всё осознает. Ты можешь использовать эту способность один раз за цикл.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "fish-in-water",
    "humanReadableName": "Рыба в воде",
    "description": "Ты можешь изменить менять формат боя в Красной Комнате по своему выбору из двух доступных: групповое сражение и дуэль. В случае, если несколько проекций ИИ используют эту способность одновременно, право выбора решает жребий.",
    "prerequisites": [
      "arch-digital",
      "ai-troubleshooter"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "ai-sabotage",
    "humanReadableName": "Саботаж",
    "description": "Убирает у Заведения одну белую коробку для Позитива.",
    "prerequisites": [
      "arch-digital",
      "ai-black-pr"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "self-symmetry",
    "humanReadableName": "Самосимметрия",
    "description": "Эта форма странная, необычная, но не более того. Как будто то бы кто-то разгладил холмы, спрямил реки и превратил бурные ураганы резонанса в сильный морской бриз",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "closed",
    "karmaCost": 20
  },
  {
    "id": "self-awareness",
    "humanReadableName": "Самосознание",
    "description": "В этой комплексной форме все противоестественно. Потоки резонанса скомканы перемешаны, и использовать это неприятно. Но, черт возьми, это РАБОТАЕТ.",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "closed",
    "karmaCost": 10
  },
  {
    "id": "ethic-kokkoro",
    "humanReadableName": "Свой в матрице",
    "description": "Более быстрое уменьшение фейдинга",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "do-it-yourself-one",
    "humanReadableName": "Сделай сам 1.0",
    "description": "Ты можешь подключаться к биологическому чаммеру, пораженному CFD, первого уровня. CFD-1",
    "prerequisites": [
      "arch-digital",
      "ai-explorer"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "do-it-yourself-two",
    "humanReadableName": "Сделай сам 2.0",
    "description": "Увеличивает способноcть управления мясными телами. Теперь ты можешь подключаться к CFD-2",
    "prerequisites": [
      "arch-digital",
      "do-it-yourself-one"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "do-it-yourself-three",
    "humanReadableName": "Сделай сам 3.0",
    "description": "Увеличивает способноcть управления мясными телами. Теперь ты можешь подключаться к CFD-3. Лучшие мясные тела для тебя!",
    "prerequisites": [
      "arch-digital",
      "do-it-yourself-two"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "ethic-arepo",
    "humanReadableName": "Серые плащи",
    "description": "Увеличвает вероятность неудачи, если с тебя рипомен срезает имплант.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ethic-sila",
    "humanReadableName": "Сила в Правде",
    "description": "В чем сила, брат? Сила в Правде! Для того, чтобы использовать пулемет или двуручное оружие - тебе достаточно одной кибер руки \\ способности Биосила.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ethic-sila-chrome",
    "humanReadableName": "Сила в Хроме",
    "description": "В чем сила, брат? Сила в Хроме!  + ко всем \"боевым\" навыкам риггера",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ethic-badass",
    "humanReadableName": "Сила ненависти",
    "description": "В боестолкновении, где Бэдэс сражается против мясных чаммеров - он получает дополнительные хиты. (В Основании +2, максимум 10. В мясном мире +1, максимум 6, применимо к дронам)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ethic-horizon",
    "humanReadableName": "Сила слова",
    "description": "Твои тексты высоко ценятся в СМИ и повышают им рейтинг. Напиши за цикл не менее трех сообщений (строго в одно СМИ), используй личный хештег и тег #вестник - и твой вклад будет учтен..\nЕсли ты журналист - получи +2 очка влияния за цикл. Заяви это мастеру по СМИ",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "ethic-triada",
    "humanReadableName": "Сила Триады",
    "description": "Если в бою участвует 3 и более членов триады (дискурса) с этой способностью - каждый из них получает +1 хит (максимум 6)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "drone-sync-1",
    "humanReadableName": "Синхронизация 1",
    "description": "Увеличивает время в дроне на 15 минут и сокращает перерыв между включениями на 10 минут.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "drone-sync-2",
    "humanReadableName": "Синхронизация 2",
    "description": "Еще увеличивает время в дроне на 15 минут и сокращает перерыв между включениями на 15 минут.",
    "prerequisites": [
      "drone-sync-1",
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "drone-sync-3",
    "humanReadableName": "Синхронизация 3",
    "description": "И еще увеличивает время в дроне на 15 минут и сокращает перерыв между включениями на 15 минут.",
    "prerequisites": [
      "drone-sync-2",
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "tell-me-what-you-know-eghost",
    "humanReadableName": "Скажи как есть",
    "description": "Покажи активированную способность персонажу в VR (на цифровых не действует!) Цель честно отвечает на 3 вопроса. Применяется только в VR.",
    "prerequisites": [
      "arch-digital",
      "want-to-speak"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "tell-me-truth",
    "humanReadableName": "Скажи как есть.",
    "description": "Целевой персонаж честно отвечает на 3 вопроса. \n",
    "prerequisites": [
      "arch-face",
      "lie-to-me"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "tell-me-what-you-know-ai",
    "humanReadableName": "Скажи что знаешь",
    "description": "Целевой персонаж в ВР честно отвечает на 3 вопроса. Способность НЕ действует на цифровых персонажей (ИИ и Егосты). Применяется только в ВР.",
    "prerequisites": [
      "arch-digital",
      "ai-explorer"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "biomonitor-scan",
    "humanReadableName": "Сканер биомонитора",
    "description": "Отсканируй чаммера и увидишь список препаратов, которые он принимал за последние 4 часа.\n(появится таблица с перечислением принятых препаратов, если чаммер ничего не принимал, она будет пустая)\nТы можешь сделать это, даже если тело в КС.",
    "prerequisites": [
      "arch-rigger",
      "pill-name",
      "whats-in-the-body-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "discount-samurai",
    "humanReadableName": "Скидка на броню и оружие",
    "description": "У тебя есть скидка 10% на покупку оружия и брони.",
    "prerequisites": [
      "arch-samurai"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-samurai",
      "level": 1
    }
  },
  {
    "id": "discount-all-1",
    "humanReadableName": "Скидосы - 10%",
    "description": "Скидка 10% товары",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "discount-all-2",
    "humanReadableName": "Скидосы - 20%",
    "description": "Скидка +10% на товары",
    "prerequisites": [
      "arch-face",
      "discount-all-1"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "discount-all-3",
    "humanReadableName": "Скидосы - 30%",
    "description": "Скидки +10% на товары",
    "prerequisites": [
      "arch-face",
      "discount-all-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "discount-all-4",
    "humanReadableName": "Скидосы - 40%",
    "description": "Скидки +10% на товары",
    "prerequisites": [
      "arch-face",
      "discount-all-3"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "chem-weak",
    "humanReadableName": "Слабость к препаратам",
    "description": "Для воздействия препарата достаточно уменьшенной дозы. Аккуратно!",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-norm",
      "level": 1
    }
  },
  {
    "id": "marauder-1",
    "humanReadableName": "Сломать оружие",
    "description": "Ты можешь порвать (разрушить по игре) куар оружия.",
    "prerequisites": [
      "arch-samurai",
      "rummage"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "hack-guns-1",
    "humanReadableName": "Смартлинк",
    "description": "Ты умеешь использовать винтовки и автоматы. Для использования необходим имплант киберрука или способность \"биосила\".",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "incriminating-evidence",
    "humanReadableName": "Собрать компромат",
    "description": "Напишите и опубликуйте в публичном новостном канале подробную статью и приложите максимум доказательств, свидетельств, показаний, обличающих кого-то (человека, организацию и т.п.). Подпишите материал своим настоящим именем. Напишите мастеру по медиа со ссылкой на этот пост что вы “собираете компромат”. В ответ вы получите некоторую полезную информацию о том, кого вы обличили - их тайные планы, личные способности и т.п. Чем больше правдивых и обличающих фактов вы написали в своей статье - тем больше полезной информации вы получите. Работает с кулдауном 6 часов. (отправь мастеру по медиа скрин только что активированной абилки)",
    "prerequisites": [
      "media-person"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "compile-hotsim",
    "humanReadableName": "Создать аватарку (хотсим)",
    "description": "Если у тебя сняли все хиты - ты можешь собрать себя обратно. Проведи у Ассемблера 45 минут для компиляции.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-digital",
      "level": 1
    }
  },
  {
    "id": "magic-feedback-resistance-1",
    "humanReadableName": "Сопротивление откату 1 (P)",
    "description": "Перманентно снижает твой Откат на 10%",
    "prerequisites": [
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "magic-feedback-resistance-2",
    "humanReadableName": "Сопротивление откату 2 (P)",
    "description": "Перманентно снижает твой Откат на 10%",
    "prerequisites": [
      "magic-feedback-resistance-1",
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "magic-feedback-resistance-3",
    "humanReadableName": "Сопротивление откату 3 (P)",
    "description": "Перманентно снижает твой Откат на 10%",
    "prerequisites": [
      "magic-feedback-resistance-2",
      "arch-mage"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "ethic-kind",
    "humanReadableName": "Сострадание",
    "description": "Ты можешь посмотреть точную информацию об уровне эссенса другого персонажа",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "save-scoring",
    "humanReadableName": "Сохраним скоринг",
    "description": "переписать долг за 1 предмет по выбору на другого персонажа c сохранением прежнего скоринга",
    "prerequisites": [
      "arch-face",
      "let-him-pay"
    ],
    "availability": "closed",
    "karmaCost": 40
  },
  {
    "id": "arch-hack-tech-bio-1",
    "humanReadableName": "Спец по био/инфо-1",
    "description": "возможность использовать useapi read на биомониторе и rcc",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic"
    ],
    "availability": "master",
    "karmaCost": 10
  },
  {
    "id": "arch-hack-tech-bio-2",
    "humanReadableName": "Спец по био/инфо-2",
    "description": "возможность использовать расширенную useapi read на биомониторе и rcc",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "arch-hack-tech-bio-1"
    ],
    "availability": "master",
    "karmaCost": 15
  },
  {
    "id": "arch-hack-tech-bio-3",
    "humanReadableName": "Спец по био/инфо-3",
    "description": "возможность использовать расширенную и улучшкеную useapi read на биомониторе и rcc",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "arch-hack-tech-bio-2"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "arch-hack-tech-geo-1",
    "humanReadableName": "Спец по гео-1",
    "description": "возможность использовать useapi read на геоноде",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic"
    ],
    "availability": "master",
    "karmaCost": 10
  },
  {
    "id": "arch-hack-tech-geo-2",
    "humanReadableName": "Спец по гео-2",
    "description": "возможность использовать расширенную useapi read на геоноде",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "arch-hack-tech-geo-1"
    ],
    "availability": "master",
    "karmaCost": 15
  },
  {
    "id": "arch-hack-tech-geo-3",
    "humanReadableName": "Спец по гео-3",
    "description": "возможность использовать расширенную и улучшенную useapi read на геоноде",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "arch-hack-tech-geo-2"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "arch-hack-tech-econ-1",
    "humanReadableName": "Спец по экономике-1",
    "description": "возможность использовать useapi read на экономноде",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic"
    ],
    "availability": "master",
    "karmaCost": 10
  },
  {
    "id": "arch-hack-tech-econ-2",
    "humanReadableName": "Спец по экономике-2",
    "description": "возможность использовать расширенную useapi read на экономноде.",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "arch-hack-tech-econ-1"
    ],
    "availability": "master",
    "karmaCost": 15
  },
  {
    "id": "arch-hack-tech-econ-3",
    "humanReadableName": "Спец по экономике-3",
    "description": "возможность использовать расширенную и улучшкеную useapi read на экономноде",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "arch-hack-tech-econ-2"
    ],
    "availability": "master",
    "karmaCost": 20
  },
  {
    "id": "sleep-check",
    "humanReadableName": "Спи-спи",
    "description": "Отсканируй qr телохранилища с телом внутри, чтобы ограбить его",
    "prerequisites": [],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "pen-n-note",
    "humanReadableName": "Спрайт \"блокнот, карандаш\"",
    "description": "Ты умеешь использовать спрайт \"Блокнот и карандаш\" в Основании",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "keys",
    "humanReadableName": "Спрайт \"ключи\"",
    "description": "Ты умеешь использовать спрайт \"Ключи\" в Основании",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "candy",
    "humanReadableName": "Спрайт \"конфетка\"",
    "description": "Ты умеешь использовать спрайт \"Конфетка\" в Основании",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "water-walkers",
    "humanReadableName": "Спрайт \"кувшинки\"",
    "description": "Ты умеешь использовать спрайт \"Кувшинки\" в Основании",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "rubber-glowes",
    "humanReadableName": "Спрайт \"перчатки\"",
    "description": "Ты умеешь использовать спрайт \"Перчатки\" в Основании",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "racket",
    "humanReadableName": "Спрайт \"ракетка\"",
    "description": "Ты умеешь использовать спрайт \"Ракетка\" в Основании",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "rubber-glowes"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "pipe",
    "humanReadableName": "Спрайт \"труба\"",
    "description": "Ты умеешь использовать спрайт \"Труба\" в Основании",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "balls",
    "humanReadableName": "Спрайт \"шарики\"",
    "description": "Ты умеешь использовать спрайт \"Шарики\" в Основании",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-basic"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "sword-short-doubled",
    "humanReadableName": "Спрайт два меча",
    "description": "Ты можешь использовать два одноручных меча  в Красной комнате",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sword-short",
      "control-basic"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "sword-twohanded",
    "humanReadableName": "Спрайт двуручный меч",
    "description": "Ты можешь использовать  Двуручный меч в Красной комнате",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sword-short",
      "control-basic"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "initiative-sign",
    "humanReadableName": "Спрайт значок инициативы",
    "description": "Ты можешь использовать значок инициативы в Красной комнате",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-combat",
      "initiative-basic"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "armor-light",
    "humanReadableName": "Спрайт Легкий доспех",
    "description": "Ты можешь использовать Легкий доспех в Красной комнате",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-combat"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "sword-short",
    "humanReadableName": "Спрайт одноручный меч",
    "description": "Ты можешь использовать Одноручный меч в Красной комнате",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "sprites-combat"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "armor-heavy",
    "humanReadableName": "Спрайт Тяжелый доспех",
    "description": "Ты можешь использовать Тяжелый доспех в Красной комнате",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "armor-light"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "sprites-combat",
    "humanReadableName": "Спрайты в Красной комнате",
    "description": "Ты можешь пользоваться спрайтами в красной комнате",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "ask-anon",
    "humanReadableName": "Спроси анонимуса",
    "description": "Напишите мастеру по медиа любой вопрос (и его же опубликуйте в публичном новостном канале) и через некоторое время с некоторой вероятностью вы получите ответ. Внимание, спрашивать нужно то, что в теории может известно кому-то из жителей Иркутска, кто мог бы написать вам эту информацию. Не надо задавать вопросы о законах мироздания или тайных паролях от личных сейфов. Работает с кулдауном 6 часов. (отправь мастеру по медиа скрин только что активированной абилки)",
    "prerequisites": [
      "media-person"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "big-mommy-eghost",
    "humanReadableName": "Спроси Большого Брата",
    "description": "Задать мастеру вопрос на который можно ответить \"Да\", \"Нет\", \"Это не имеет значения\" и получить ответ.",
    "prerequisites": [
      "arch-digital",
      "want-to-speak"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "ai-big-mommy",
    "humanReadableName": "Спроси Большого Брата",
    "description": "Задать вопрос на который можно ответить \"Да\", \"Нет\", \"Это не имеет значения\" и получить ответ. Вопрос задается региональному мастеру.",
    "prerequisites": [
      "arch-digital",
      "ai-researcher"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "in-drone",
    "humanReadableName": "Статус: Подключен к дрону",
    "description": "Статус: Подключен к дрону. Следите за временем, если вы слишком долго пробудете в дроне - произойдет аварийное отключение. ",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "kokkoro-shooter",
    "humanReadableName": "Стрелок",
    "description": "Позволяет использовать автоматическое оружие. \n(При наличии импланта Кибер-рука или абилки Биосила)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "koshcghei-shooter",
    "humanReadableName": "Стрелок",
    "description": "Позволяет использовать автоматы и/или винтовки. \n(При наличии импланта Кибер-рука или абилки Биосила)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "horizon-shooter",
    "humanReadableName": "Стрелок",
    "description": "Позволяет использовать автоматическое оружие. \n(При наличии импланта Кибер-рука или абилки Биосила)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "badass-shooter",
    "humanReadableName": "Стрелок",
    "description": "Позволяет использовать автоматическое оружие. \n(При наличии импланта Кибер-рука или абилки Биосила)",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "quick-to-enter-3",
    "humanReadableName": "Супер шустрый",
    "description": ".. и еще снижает время входа на хост еще на 2 минуты",
    "prerequisites": [
      "arch-hackerman-decker",
      "quick-to-enter-2",
      "sly-2"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "orkish-prices",
    "humanReadableName": "Так себе цены",
    "description": "Ваш скоринг очень плох, жизнь орка коротка. Ваши покупки будут дороже, чем у других метарас.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-ork",
      "level": 1
    }
  },
  {
    "id": "ethic-violence",
    "humanReadableName": "Танатос",
    "description": "Добей 10 человек в КС. Сними пруфы этого. Покажи региональному мастеру",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "breachmaster-ai",
    "humanReadableName": "Теневой канал",
    "description": "Вы подключились к источнику автобэкдоров от вашего материнского ИИ. Вам будет доступно 15 автобэкдоров в день. (подключение бэкдоров работает через сайт хакерства web.evarun.ru) ВАЖНО эта способность нужна только одному персонажу в проекции.",
    "prerequisites": [
      "arch-digital",
      "ai-researcher",
      "ai-big-mommy"
    ],
    "availability": "open",
    "karmaCost": 90
  },
  {
    "id": "termorectal-analysis",
    "humanReadableName": "Терморектальный криптоанализ",
    "description": "Активируй абилку, покажи цели. На таймере должно быть \"20 минут\" (только что применено).  Цель должна правдиво, полно и развернуто ответить на заданный вопрос и теряет один хит. ",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "arch-hack-decker-geo-1",
    "humanReadableName": "Технические системы 1",
    "description": "возможность использовать useapi на нодах технических систем хоста и API геолокации",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "arch-hack-decker-geo-2",
    "humanReadableName": "Технические системы 2",
    "description": "дополнительные возможности useapi на нодах технических систем хоста и API геолокации",
    "prerequisites": [
      "arch-hackerman-decker",
      "arch-hack-decker-geo-1"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "arch-hack-decker-geo-3",
    "humanReadableName": "Технические системы 3",
    "description": "расширенные возможности useapi на нодах нодах технических систем хоста и API геолокации",
    "prerequisites": [
      "arch-hackerman-decker",
      "arch-hack-decker-geo-2"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "quiet-break-in-rigger",
    "humanReadableName": "Тихий взлом (риггер)",
    "description": "Ты можешь открыть дверь, закрытую на замок. Для этого надо стоять 1 минуту у закрытой двери, все это время держась рукой за сертификат замка.",
    "prerequisites": [
      "lock-the-door",
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "quiet-break-in-hacker",
    "humanReadableName": "Тихий взлом (техномант)",
    "description": "Ты можешь открыть дверь, закрытую на замок. Для этого надо стоять 1 минуту у закрытой двери, все это время держась рукой за сертификат замка.",
    "prerequisites": [
      "lock-the-door",
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "skin-armor",
    "humanReadableName": "Толстокожий",
    "description": "Ты толстокожий и совершенно не понимаешь шутки.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-troll",
      "level": 1
    }
  },
  {
    "id": "meta-troll",
    "humanReadableName": "Тролль",
    "description": "Ты тролль. У тебя есть клыки, рога, толстая шкура и возможность смотреть на остальных металюдей сверху вниз. ",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 40,
    "pack": {
      "id": "gen-meta-troll",
      "level": 1
    }
  },
  {
    "id": "you-dont-trust-anybody",
    "humanReadableName": "Ты никому не веришь",
    "description": "Временно на 30 минут увеличивает сопротивляемость другого персонажа ментальному воздействию.",
    "prerequisites": [
      "arch-face",
      "i-dont-trust-anybody"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "armor-3",
    "humanReadableName": "Тяжелая броня",
    "description": "Ты можешь носить тяжелую броню. При наличии тяжелой брони ты получаешь иммунитет к Легкому холодному и легкому дистанционному оружию. Тяжелое оружие снимает с тебя только один хит одним попаданием. Надеть тяжелую броню можно только при наличии импланта \"усиленные кости\"",
    "prerequisites": [
      "arch-samurai",
      "armor-1"
    ],
    "availability": "open",
    "karmaCost": 90
  },
  {
    "id": "heavy-weapons-unlock",
    "humanReadableName": "Тяжелое оружие",
    "description": "Позволяет использовать тяжелое оружие.\n(При наличии 2-х имплантов Кибер-рука или 1-й руки и абилки Биосила)",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "ethic-avidity",
    "humanReadableName": "Убийственная жадность.",
    "description": "Если на тебя применяют способность менталиста \"прогулка миллионера\" - ты  переводишь не 20%, а 10%",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "gm-increase-magic",
    "humanReadableName": "Увеличение магии \"+1\"",
    "description": "Увеличение магии +1",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "gm-increase-charisma",
    "humanReadableName": "Увеличение Харизмы \"+1\"",
    "description": "Увеличение Харизмы +1",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "increase-the-charisma-1",
    "humanReadableName": "Увеличение харизмы 1",
    "description": "Перманентное увеличение Харизмы персонажа",
    "prerequisites": [
      "arch-face",
      "danila-i-need-help",
      "really-need-it"
    ],
    "availability": "open",
    "karmaCost": 60
  },
  {
    "id": "increase-the-charisma-2",
    "humanReadableName": "Увеличение харизмы 2",
    "description": "Перманентное увеличение Харизмы персонажа - 2",
    "prerequisites": [
      "arch-face",
      "increase-the-charisma-1",
      "luke-i-am-your-father"
    ],
    "availability": "closed",
    "karmaCost": 60
  },
  {
    "id": "increase-the-charisma-3",
    "humanReadableName": "Увеличение харизмы 3",
    "description": "Перманентное увеличение Харизмы персонажа - 3",
    "prerequisites": [
      "arch-face",
      "increase-the-charisma-2"
    ],
    "availability": "closed",
    "karmaCost": 80
  },
  {
    "id": "increase-the-charisma-4",
    "humanReadableName": "Увеличение харизмы 4",
    "description": "Перманентное увеличение Харизмы персонажа - 4",
    "prerequisites": [
      "arch-face",
      "increase-the-charisma-3"
    ],
    "availability": "closed",
    "karmaCost": 80
  },
  {
    "id": "increase-the-charisma-5",
    "humanReadableName": "Увеличение харизмы 5",
    "description": "Перманентное увеличение Харизмы персонажа - 5",
    "prerequisites": [
      "arch-face",
      "increase-the-charisma-4"
    ],
    "availability": "closed",
    "karmaCost": 80
  },
  {
    "id": "ethic-aks",
    "humanReadableName": "Увлеченный рассказчик. ",
    "description": "Покажи это цели. Расскажи ему историю, кто ты, кто он и что вы сейчас делаете. Цель верит тебе и испытывает непреодолимое желание делать то, что ты рассказываешь. Помоги ему и сделай то, о чем ты говоришь. Если в процессе взаимодействия цели будет причинен любой ущерб (потеря хитов, потеря имущества...) - воздействие тут же спадет. Иначе - воздействие держится пять минут. Цель всё осознает. Ты можешь использовать эту способность один раз за цикл.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "delete-backdoor",
    "humanReadableName": "Удалить спрайт ",
    "description": "Удалить спрайт с данного хоста.",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "settle-backdoor"
    ],
    "availability": "closed",
    "karmaCost": 20
  },
  {
    "id": "sleep-shock",
    "humanReadableName": "Удар в мягкое тельце!",
    "description": "Отсканируй qr телохранилища с телом внутри, чтобы ударить его шоком и принудить вернуться к телу.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "discount-all-5",
    "humanReadableName": "Удвоение скидок",
    "description": "Твои гешефтмахерские скидки удваиваются!",
    "prerequisites": [
      "arch-face",
      "igra-na-birge-3",
      "discount-all-4",
      "let-him-pay"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "stubbornness-2",
    "humanReadableName": "Удивительная упертость",
    "description": "Продлевает максимальное время нахождения на хосте на еще на 10 минут",
    "prerequisites": [
      "arch-hackerman-decker",
      "stubbornness-1",
      "breacher-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "trollish-prices",
    "humanReadableName": "Ужасные цены.",
    "description": "Ваш скоринг очень плох, жизнь тролля очень коротка. Ваши покупки будут заметно дороже, чем у других метарас.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-troll",
      "level": 1
    }
  },
  {
    "id": "gm-decrease-magic",
    "humanReadableName": "Уменьшение магии \"-1\"",
    "description": "Уменьшение магии -1",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "fading-decrease-basic",
    "humanReadableName": "Уменьшение фейдинга 1",
    "description": "Фейдинг персонажа уменьшается на 2 единицы в минуту",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-hackerman-technomancer",
      "level": 1
    }
  },
  {
    "id": "fading-decrease-2",
    "humanReadableName": "Уменьшение фейдинга 2",
    "description": "Фейдинг персонажа уменьшается на ещё 2 единиц в минуту",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "control-basic",
      "fading-decrease-basic"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "fading-decrease-3",
    "humanReadableName": "Уменьшение фейдинга 3",
    "description": "Фейдинг персонажа уменьшается ещё на 3 единиц в минуту",
    "prerequisites": [
      "arch-hackerman-technomancer",
      "fading-decrease-2"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "gm-decrease-charisma",
    "humanReadableName": "Уменьшение Харизмы \"-1\"",
    "description": "Уменьшение Харизмы -1",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "stubbornness-1",
    "humanReadableName": "Упертость",
    "description": "Продлевает максимальное время нахождения на хосте на 5 минут",
    "prerequisites": [
      "arch-hackerman-decker",
      "breacher-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "super-programme-code",
    "humanReadableName": "Усиленный код",
    "description": "еще +1 хит в Красной Комнате",
    "prerequisites": [
      "arch-digital",
      "programm-code-ai"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "settle-backdoor",
    "humanReadableName": "Установить спрайт на хост",
    "description": "Установить спрайт на хост. \nfading +80",
    "prerequisites": [
      "arch-hackerman-technomancer"
    ],
    "availability": "open",
    "karmaCost": 0,
    "pack": {
      "id": "gen-arch-hackerman-technomancer",
      "level": 1
    }
  },
  {
    "id": "implant-install",
    "humanReadableName": "Установка импланта",
    "description": "Ты можешь использовать автодок для установки имплантов",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "magic-feedback-resist",
    "humanReadableName": "Устойчивость к откату",
    "description": "Понижает Откат магов",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-dwarf",
      "level": 1
    }
  },
  {
    "id": "chem-resist",
    "humanReadableName": "Устойчивость к препаратам",
    "description": "Сложнее получить передозировку препарата.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-dwarf",
      "level": 1
    }
  },
  {
    "id": "chemo-resistance",
    "humanReadableName": "Устойчивость к химии",
    "description": "Дает устойчивость к негативным эффектам при употреблении препаратов.",
    "prerequisites": [
      "arch-samurai",
      "faster-regen-1"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "pill-name",
    "humanReadableName": "Фармацевтика",
    "description": "Позволяет узнать название препарата и его основной компонент. \n(Отсканируй куар препарата этой абилкой).",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "anonymous-transaction",
    "humanReadableName": "Фиксер",
    "description": "Все твои переводы анонимны",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "arch-hack-decker-econ-1",
    "humanReadableName": "Финансы 1",
    "description": "возможность использовать useapi в финансовых API",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "arch-hack-decker-econ-2",
    "humanReadableName": "Финансы 2",
    "description": "дополнительные возможности useapi в финансовых API",
    "prerequisites": [
      "arch-hackerman-decker",
      "arch-hack-decker-econ-1"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "arch-hack-decker-econ-3",
    "humanReadableName": "Финансы 3",
    "description": "расширенные возможности useapi в финансовых API",
    "prerequisites": [
      "arch-hackerman-decker",
      "arch-hack-decker-econ-2"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "ethic-shadow",
    "humanReadableName": "Флагеллянт",
    "description": "Адепт должен причинить себе наказание, громко и прилюдно. После чего может проигнорировать первое попадание оружия в бою (даже тяжелого оружия).. Ты можешь использовать эту способность один раз в час.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "steal-pro",
    "humanReadableName": "Фрод профи",
    "description": "Теперь ты можешь работать с кошельками юр лиц\n\nкроме того, разблокирован ключ: steal --comment\nОн позволяет ввести текст \"основания перевода\", вместо билиберды по умолчанию\nи дополнительно увеличивает сумму кражи",
    "prerequisites": [
      "arch-hackerman-decker",
      "steal"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "steal-expert",
    "humanReadableName": "Фрод эксперт",
    "description": "Новый ключ: steal --sin:\n--sin: переводит сумму на другой SIN\nи дополнительно увеличивает сумму кражи",
    "prerequisites": [
      "arch-hackerman-decker",
      "steal-pro"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "breachmaster-fkb",
    "humanReadableName": "Хакер из штабквартиры",
    "description": "Вы подключились к источнику автобэкдоров от вашей организации.  Вам будет доступно 10 автобэкдоров в день. (подключение бэкдоров работает через сайт хакерства web.evarun.ru) ВАЖНО эта способность нужна только одному чаммеру в организации",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "auto-doc-1",
    "humanReadableName": "Хирургия 1",
    "description": "Улучшает способность по использованию автодока и повышает сложность имплантов которые ты можешь ставить.",
    "prerequisites": [
      "arch-rigger"
    ],
    "availability": "open",
    "karmaCost": 30
  },
  {
    "id": "auto-doc-2",
    "humanReadableName": "Хирургия 2",
    "description": "Сильнее улучшает способность по использованию автодока и повышает сложность имплантов которые ты можешь ставить.",
    "prerequisites": [
      "arch-rigger",
      "auto-doc-1"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "auto-doc-3",
    "humanReadableName": "Хирургия 3",
    "description": "Максимально улучшает способность по использованию автодока и повышает сложность имплантов которые ты можешь ставить.",
    "prerequisites": [
      "arch-rigger",
      "auto-doc-2"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "ethic-reason",
    "humanReadableName": "Холодный разум",
    "description": "Твои тексты высоко ценятся в СМИ и повышают им рейтинг. Напиши за цикл не менее трех сообщений (строго в одно СМИ), используй личный хештег и тег #аналитик - и твой вклад будет учтен..",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "breacher-1",
    "humanReadableName": "Хороший Бричер",
    "description": "Улучшает конверсию Intellect в Firewall на 20%",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "miner-1",
    "humanReadableName": "Хороший Майнер",
    "description": "Улучшает конверсию Intellect в Dataprocessing  на 20%",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "sly-1",
    "humanReadableName": "Хороший Слай",
    "description": "Улучшает конверсию Intellect в Sleaze  на 20%",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "fencer-1",
    "humanReadableName": "Хороший Фенсер",
    "description": "Улучшает конверсию Intellect в Attack на 20%\n\n",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "arch-digital",
    "humanReadableName": "Цифровая сущность",
    "description": "Цифровая сущность, егост или агент",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-digital",
      "level": 1
    }
  },
  {
    "id": "digital-life",
    "humanReadableName": "Цифровая форма жизни",
    "description": "Ты можешь неограниченное время пребывать в VR",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-digital",
      "level": 1
    }
  },
  {
    "id": "ai-digital-violence",
    "humanReadableName": "Цифровое Ультранасилие",
    "description": "Позволяет временно заблокировать работу магазина указанного заведения",
    "prerequisites": [
      "arch-digital",
      "ai-manager"
    ],
    "availability": "closed",
    "karmaCost": 40
  },
  {
    "id": "meta-digital",
    "humanReadableName": "Цифровой разум",
    "description": "Ты цифровой разум, сгусток программ и кода, живущий в Матрице. ",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-digital",
      "level": 1
    }
  },
  {
    "id": "storm-blast-ai",
    "humanReadableName": "Цифровой шторм",
    "description": "Ты можешь убивать в Абсолютную смерть. Применение требует траты Позитива (заверь у мастера). Отсканируй QR персонажа в VR, он должен немедленно выйти из  VR. После возвращения в тело с ним случится АС.",
    "prerequisites": [
      "arch-digital",
      "black-ice-ai"
    ],
    "availability": "closed",
    "karmaCost": 80
  },
  {
    "id": "digital-prices",
    "humanReadableName": "Цифровые цены",
    "description": "У тебя отличный скоринг и выгодные цены",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-digital",
      "level": 1
    }
  },
  {
    "id": "black-ice-ai",
    "humanReadableName": "Черный лед",
    "description": "Ты можешь убивать в Клиническую смерть. Применение требует траты Позитива (заверь у мастера). Отсканируй QR персонажа в VR, он должен немедленно выйти из  VR. После возвращения в тело с ним случится КС.",
    "prerequisites": [
      "arch-digital",
      "sub-ai"
    ],
    "availability": "closed",
    "karmaCost": 80
  },
  {
    "id": "repoman-black",
    "humanReadableName": "Черный рипомен",
    "description": "Активируй, чтобы снять имплант\\мод. Выберется самый сложный.  Для использования тебе не нужны медикарт или автодок. Нужен пустой QR чип.",
    "prerequisites": [
      "arch-rigger",
      "repoman-3"
    ],
    "availability": "open",
    "karmaCost": 50
  },
  {
    "id": "quarter-god",
    "humanReadableName": "Четвертак",
    "description": "Русское название для слэнга \"quaterGOD\", шутливое название для серьезных людей: профессиональных контракторов по частной защиты Хостов.\nЕще 5 хостов, на защиту которых ты можешь подписаться",
    "prerequisites": [
      "arch-hackerman-decker",
      "admin"
    ],
    "availability": "open",
    "karmaCost": 15
  },
  {
    "id": "hack-deck-fantomas",
    "humanReadableName": "Чингачгук",
    "description": "Ты -легендарный следопыт Матрицы, то есть знаток ее тайных тропок. То есть дата-трейлов. Таких троллят, называя их \"чингачгуками\"\n\nНовый ключ команды enter [trail]\nТы можешь войти на хост с разными путями, если, конечно, ты знаешь их трейлы. В команде enter в ты можешь, в дополнение к хосту, указать трейл бэкдора или портала. И попадешь прямиком на него.",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-2"
    ],
    "availability": "open",
    "karmaCost": 20
  },
  {
    "id": "how-much-it-costs",
    "humanReadableName": "Чо почем",
    "description": "посмотреть на qr и сказать сколько это стоит, базовую цену товара",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "feel-matrix",
    "humanReadableName": "Чувство Матрицы",
    "description": "Ты чувствуешь матрицу. Устойчивость к фейдингу техноманта, у декера уменьшается время входа на хоcт.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0,
    "pack": {
      "id": "gen-meta-norm",
      "level": 1
    }
  },
  {
    "id": "ai-black-pr",
    "humanReadableName": "Чёрный Пиар",
    "description": "Добавляет Заведению одну чёрную коробку для Негатива.",
    "prerequisites": [
      "arch-digital",
      "ai-manager"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "luck-spent",
    "humanReadableName": "Шрам в форме молнии",
    "description": "Про таких, как ты, говорят сама Матрица поцеловала их в лобик. \n\nКонверсия Интеллекта во все характеристики улучшена\n\nот МГ: шрам рисовать не обязательно, но будет круто",
    "prerequisites": [
      "arch-hackerman-decker"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "quick-to-enter-1",
    "humanReadableName": "Шустрый",
    "description": "Снижает время входа на хост на 2 минуты",
    "prerequisites": [
      "arch-hackerman-decker",
      "sly-1"
    ],
    "availability": "open",
    "karmaCost": 10
  },
  {
    "id": "project-artisan",
    "humanReadableName": "Экономия ресурсов",
    "description": "Ты можешь заменить часть макроресурсов, собрав паззл",
    "prerequisites": [
      "project-manager-1"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "project-industry",
    "humanReadableName": "Экономия ресурсов 2",
    "description": "Ты можешь заменить часть макроресурсов, собрав  сложный паззл",
    "prerequisites": [
      "project-manager-3",
      "project-artisan"
    ],
    "availability": "closed",
    "karmaCost": 30
  },
  {
    "id": "good-pills",
    "humanReadableName": "Экономный аптекарь",
    "description": "При применении препаратов, восстанавливающих хиты и боевых коктейлей, с 30% вероятностью препарат не израсходуется. \n(При этом эффект от препарата произойдёт).",
    "prerequisites": [
      "arch-rigger",
      "use-pills-on-others"
    ],
    "availability": "open",
    "karmaCost": 40
  },
  {
    "id": "auto-doc-screen",
    "humanReadableName": "Экран автодока",
    "description": "можешь проводить операции через экран автодока",
    "prerequisites": [
      "in-drone"
    ],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "ethic-treat",
    "humanReadableName": "Экстренная перевязка. ",
    "description": "Ты можешь вылечить два хита. Способность работает как в боевой, так и  в небоевой ситуации. Ты не можешь применить способность сам на себя.  Ты можешь использовать эту способность один раз в час. Не работает на персонажей в тяжране.",
    "prerequisites": [],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "sub-eghost",
    "humanReadableName": "Электронный призрак",
    "description": "Ты сервисная программа с нарушением кода",
    "prerequisites": [
      "arch-digital"
    ],
    "availability": "closed",
    "karmaCost": 0
  },
  {
    "id": "meta-elf",
    "humanReadableName": "Эльф",
    "description": "Ты эльф. У тебя прекрасные ушки, чувство стиля и ты точно знаешь, что ты лучше всех остальных видов металюдей.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 20,
    "pack": {
      "id": "gen-meta-elf",
      "level": 1
    }
  },
  {
    "id": "gm-increase-essence",
    "humanReadableName": "Эссенс \"+1\"",
    "description": "Увеличить Эссенс персонажа +1",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "gm-decrease-essence",
    "humanReadableName": "Эссенс \"-1\"",
    "description": "Уменьшить Эссенс на -1",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "ai-its-mine",
    "humanReadableName": "Это моё!",
    "description": "Может забрать себе содержимое одной заполненной коробки Позитива из заведения, где НЕ стоит ваша метка.",
    "prerequisites": [
      "arch-digital",
      "ai-precious"
    ],
    "availability": "open",
    "karmaCost": 25
  },
  {
    "id": "heavy-armor-effect",
    "humanReadableName": "Эффект Тяжёлая броня",
    "description": "На тебя действуют правила по хитосъему, соответствующие тяжелой броне.",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "master-of-the-universe",
    "humanReadableName": "Я мастер!",
    "description": "Я мастер и вижу все закрытые, непонятные и непротестированные абилки",
    "prerequisites": [],
    "availability": "master",
    "karmaCost": 0
  },
  {
    "id": "i-dont-trust-anybody",
    "humanReadableName": "Я никому не верю",
    "description": "Временно увеличивает сопротивляемость менталиста ментальному воздействию. Срок воздействия меньше часа.",
    "prerequisites": [
      "arch-face"
    ],
    "availability": "open",
    "karmaCost": 20
  }
]