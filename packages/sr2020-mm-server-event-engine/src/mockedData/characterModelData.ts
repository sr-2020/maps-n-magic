import { CharacterModelData } from "sr2020-mm-event-engine";


export const basicCharacter = {
	"baseModel": {
		"modelId": "51935",
		"timestamp": 1635033444085,
		"modifiers": [
			{
				"mID": "_system",
				"priority": 3,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "systemEssenceEffect"
					},
					{
						"enabled": true,
						"type": "normal",
						"handler": "jackedInEffect"
					}
				]
			},
			{
				"mID": "_limiter",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "clampAttributes"
					}
				]
			},
			{
				"mID": "_cooldown_calculator",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "calculateCooldowns"
					}
				]
			},
			{
				"amount": 1,
				"mID": "ckv30mdu5000a01wd317kcdxt",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseFadingResistance"
					}
				]
			},
			{
				"amount": -1,
				"mID": "ckv30mduo000b01wd8gv03cd4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseHostEntrySpeed"
					}
				]
			},
			{
				"amount": -40,
				"mID": "ckv30mduo000c01wd1ydp3v38",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoBaseEffectThreshold"
					}
				]
			},
			{
				"amount": -30,
				"mID": "ckv30mduo000d01wdbcg0do1v",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoUberEffectThreshold"
					}
				]
			},
			{
				"amount": -20,
				"mID": "ckv30mduo000e01wd45pd7yd5",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoSuperEffectThreshold"
					}
				]
			},
			{
				"amount": -60,
				"mID": "ckv30mduo000f01wd1la4c07c",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoCrysisThreshold"
					}
				]
			},
			{
				"amount": 2,
				"mID": "ckv30ozrm000g01wd9m8c7oe4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseMagic"
					}
				]
			},
			{
				"amount": 0.8,
				"mID": "ckv30xwon000h01wd1he1as2t",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "multiplySpiritResistanceMultiplier"
					}
				]
			}
		],
		"timers": [
			{
				"name": "give-karma-for-passives",
				"description": "Начисление кармы за все ваши способности",
				"miliseconds": 2533168,
				"eventType": "giveKarmaForPassiveAbilities",
				"data": {}
			},
			{
				"name": "decrease-current-fading",
				"description": "Уменьшение фейдинга (при наличии абилок)",
				"miliseconds": 13168,
				"eventType": "decreaseCurrentFading",
				"data": {}
			},
			{
				"name": "normal-hunger",
				"description": "Голодный обморок",
				"miliseconds": 43174168,
				"eventType": "hungerStage1",
				"data": {}
			},
			{
				"name": "normal-hunger-reminder",
				"description": "Напоминание о том, что нужно поесть",
				"miliseconds": 39574168,
				"eventType": "hungerReminder",
				"data": {}
			}
		],
		"name": "ТестПер",
		"currentBody": "physical",
		"maxHp": 2,
		"healthState": "healthy",
		"metarace": "meta-norm",
		"body": 1,
		"strength": 1,
		"depth": 1,
		"intelligence": 1,
		"charisma": 1,
		"essence": 0,
		"mentalAttackBonus": 0,
		"mentalDefenceBonus": 0,
		"mentalQrId": 61935,
		"magic": 1,
		"resonance": 1,
		"matrixHp": 1,
		"maxTimeInVr": 60,
		"cooldownCoefficient": 1,
		"victimCoefficient": 1,
		"participantCoefficient": 1,
		"implantsBodySlots": 2,
		"implantsRemovalResistance": 0,
		"spells": [
			{
				"id": "spirit-catcher",
				"description": "В течение Мощь*2 минут можно три раза попытаться поймать духа. С увеличением Мощи растут и шансы на поимку",
				"humanReadableName": "Spirit catcher (S)",
				"hasTarget": false,
				"sphere": "stats"
			},
			{
				"id": "fireball",
				"description": "У мага на Мощь*4 минуты появляется пассивная способность Fireball-Эффект, позволяющая кидать файерболы. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных файерболов: Мощь/2 с округлением вверх",
				"humanReadableName": "Fireball (S)",
				"hasTarget": false,
				"sphere": "fighting"
			},
			{
				"id": "input-stream",
				"description": "В течение Мощь*3 минут мана из соседних локаций периодически будет призываться в эту  (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
				"humanReadableName": "InputStream (S)",
				"hasTarget": false,
				"sphere": "astral"
			}
		],
		"activeAbilities": [],
		"passiveAbilities": [
			{
				"id": "meta-norm",
				"humanReadableName": "Норм",
				"description": "Ты норм. Самый обычный Sapiens, как и миллионы других.",
				"modifierIds": []
			},
			{
				"id": "feel-matrix",
				"humanReadableName": "Чувство Матрицы",
				"description": "Ты чувствуешь матрицу. Устойчивость к фейдингу техноманта, у декера уменьшается время входа на хоcт.",
				"modifierIds": [
					"ckv30mdu5000a01wd317kcdxt",
					"ckv30mduo000b01wd8gv03cd4"
				]
			},
			{
				"id": "chem-weak",
				"humanReadableName": "Слабость к препаратам",
				"description": "Для воздействия препарата достаточно уменьшенной дозы. Аккуратно!",
				"modifierIds": [
					"ckv30mduo000c01wd1ydp3v38",
					"ckv30mduo000d01wdbcg0do1v",
					"ckv30mduo000e01wd45pd7yd5",
					"ckv30mduo000f01wd1la4c07c"
				]
			},
			{
				"id": "arch-mage",
				"humanReadableName": "Архетип: Маг",
				"description": "Маг, повелитель заклинаний!",
				"modifierIds": [
					"ckv30ozrm000g01wd9m8c7oe4"
				]
			},
			{
				"id": "nice-suit",
				"humanReadableName": "Nice suit (P)",
				"description": "Увеличивает продолжительность призыва духа на 30 минут",
				"modifierIds": []
			},
			{
				"id": "leisure-suit",
				"humanReadableName": "Leisure suit (P)",
				"description": "Увеличивает продолжительность призыва духа еще на 30 минут",
				"modifierIds": []
			},
			{
				"id": "suit-up",
				"humanReadableName": "Suit Up (P)",
				"description": "Даёт возможность временно надеть тело духа из тотема. Своё мясное тело маг должен оставить в телохранилище. Продолжительность призыва духа - 30 минут. (время может быть увеличено)",
				"modifierIds": []
			},
			{
				"id": "fine-hearing",
				"humanReadableName": "Fine hearing (P)",
				"description": "Ты знаешь, какими способностями обладают духи вокруг тебя",
				"modifierIds": []
			},
			{
				"id": "spirit-master-1",
				"humanReadableName": "Spirit Apprentice (P)",
				"description": "Ты можешь ловить духов 1го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-2",
				"humanReadableName": "Spirit Disciple (P)",
				"description": "Ты можешь ловить духов 2го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-3",
				"humanReadableName": "Spirit Master (P)",
				"description": "Ты можешь ловить духов 3го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-feed",
				"humanReadableName": "Друг духов",
				"description": "Тебе заметно легче ловить духов",
				"modifierIds": [
					"ckv30xwon000h01wd1he1as2t"
				]
			},
			{
				"id": "spirit-known",
				"humanReadableName": "Знакомый духов (P)",
				"description": "Тебе легче ловить духов",
				"modifierIds": []
			},
			{
				"id": "magic-1",
				"humanReadableName": "Магия 1 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jus3h000i01wd5agtaj31"
				]
			},
			{
				"id": "magic-2",
				"humanReadableName": "Магия 2 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jutwp000j01wdc8fxax1m"
				]
			},
			{
				"id": "magic-3",
				"humanReadableName": "Магия 3 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juvkw000k01wd5wlshdm8"
				]
			},
			{
				"id": "magic-4",
				"humanReadableName": "Магия 4 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juy6e000l01wdgdtz34gr"
				]
			},
			{
				"id": "magic-5",
				"humanReadableName": "Магия 5 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jv06u000m01wdarmi9ith"
				]
			}
		],
		"implants": [],
		"chemoConsumptionRecords": [],
		"analyzedBody": null,
		"history": [
			{
				"id": "6d545980-dd82-483f-a2fb-61cf1b779fc4",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634946615138
			},
			{
				"id": "e7cebc48-feb1-4940-957d-c4320d4d1a7c",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634946625341
			},
			{
				"id": "18e868ec-db87-4857-8a72-819c71d8a46b",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634953863785
			},
			{
				"id": "9e076772-5a1f-4b31-9e35-ad5871ed6a3f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634953938463
			},
			{
				"id": "57753e71-4327-44f2-9c9d-3df0e2a44622",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957246689
			},
			{
				"id": "049eb826-2f8a-42d9-8f42-46c61ab78b74",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957256485
			},
			{
				"id": "20b4f87c-a7f8-43db-a3b1-24f57388c5cb",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957882816
			},
			{
				"id": "e138de9b-71fb-4c21-849e-6a26288e6265",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957894581
			},
			{
				"id": "60a49d70-1177-48b4-985d-98e9cc224233",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634958035585
			},
			{
				"id": "36becab7-3a2c-42bc-bdd4-172533d7811a",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634958073382
			},
			{
				"id": "3d44b7a3-2d0b-4677-aa7e-c83b84981ac0",
				"title": "Голод",
				"shortText": "Вы потеряли сознание от голода. Тяжелое ранение.",
				"longText": "",
				"timestamp": 1634989177253
			},
			{
				"id": "c3e858d5-5f47-438f-8544-19d367d6537e",
				"title": "Ранение",
				"shortText": "Вы в состоянии клинической смерти",
				"longText": "",
				"timestamp": 1634990977253
			},
			{
				"id": "75b88fa2-85b1-46a1-acf2-f318b181cd0d",
				"title": "Лечение",
				"shortText": "Хиты полностью восстановлены",
				"longText": "Вы полностью здоровы. Ура!",
				"timestamp": 1635033418253
			}
		],
		"magicStats": {
			"feedbackMultiplier": 1,
			"recoverySpeedMultiplier": 1,
			"spiritResistanceMultiplier": 1,
			"auraReadingMultiplier": 1,
			"auraMarkMultiplier": 1,
			"auraMask": 0,
			"aura": "ecjerjbhcwbrgixrqzjg",
			"maxPowerBonus": 0,
			"victimCoefficient": 1,
			"participantCoefficient": 1
		},
		"hacking": {
			"maxTimeAtHost": 30,
			"hostEntrySpeed": 8,
			"conversionAttack": 0,
			"conversionFirewall": 0,
			"conversionSleaze": 0,
			"conversionDataprocessing": 0,
			"fadingResistance": 0,
			"biofeedbackResistance": 0,
			"adminHostNumber": 3,
			"spriteLevel": 0,
			"resonanceForControlBonus": 0,
			"varianceResistance": 0,
			"compilationFadingResistance": 0,
			"additionalRequests": 0,
			"additionalSprites": 0,
			"additionalBackdoors": 0,
			"backdoorTtl": 120,
			"jackedIn": false,
			"fading": 0,
			"fadingDecrease": 0
		},
		"drones": {
			"maxDifficulty": -1000,
			"maxTimeInside": 0,
			"recoveryTime": 120,
			"medicraftBonus": 1,
			"autodocBonus": 1,
			"aircraftBonus": 2,
			"groundcraftBonus": 2,
			"feedbackModifier": 0,
			"recoverySkill": 0
		},
		"chemo": {
			"baseEffectThreshold": 200,
			"uberEffectThreshold": 250,
			"superEffectThreshold": 300,
			"crysisThreshold": 400,
			"sensitivity": 280,
			"concentration": {
				"teqgel": 0,
				"iodine": 0,
				"argon": 0,
				"radium": 0,
				"junius": 0,
				"custodium": 0,
				"polonium": 0,
				"silicon": 0,
				"magnium": 0,
				"chromium": 0,
				"opium": 0,
				"elba": 0,
				"barium": 0,
				"uranium": 0,
				"moscovium": 0,
				"iconium": 0,
				"vampirium": 0
			}
		},
		"billing": {
			"anonymous": false,
			"stockGainPercentage": 0
		},
		"discounts": {
			"weaponsArmor": 1,
			"everything": 1
		},
		"screens": {
			"billing": true,
			"spellbook": true,
			"activeAbilities": true,
			"passiveAbilities": true,
			"karma": true,
			"implants": true,
			"autodoc": false,
			"autodocWoundHeal": true,
			"autodocImplantInstall": false,
			"autodocImplantRemoval": false,
			"ethics": true,
			"location": false,
			"wound": true,
			"scanQr": true,
			"scoring": false
		},
		"ethic": {
			"groups": [],
			"state": [
				{
					"scale": "violence",
					"value": 0,
					"description": "За добро платит добром, за зло - по справедливости"
				},
				{
					"scale": "control",
					"value": 0,
					"description": "Свобода выбора обязует принять его последствия"
				},
				{
					"scale": "individualism",
					"value": 0,
					"description": "Своя рубашка ближе к телу"
				},
				{
					"scale": "mind",
					"value": 0,
					"description": "Равновесие - основа душевного здоровья"
				}
			],
			"trigger": [
				{
					"id": "30df06ca-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Нельзя упускать свою выгоду. Так называемые милосердие и насилие - лишь средства ее получить"
				},
				{
					"id": "30df06cb-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили тому, кто сильнее вас"
				},
				{
					"id": "30df06cc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились тому, кто слабее вас"
				},
				{
					"id": "30df06e3-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "И покорность, и бунт хороши, если пополняют твой счет. И плохи в обратном случае."
				},
				{
					"id": "30df06e4-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы выполнили просьбу, которую не были обязаны выполнять"
				},
				{
					"id": "30df06e5-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы отказались выполнять требование, которое были обязаны выполнить"
				},
				{
					"id": "30df06fc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Принадлежность к сообществу или самостоятельность хороши, только если это выгодно"
				},
				{
					"id": "30df06fd-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили общему решению вашей группы"
				},
				{
					"id": "30df06fe-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились общему решению вашей группы"
				},
				{
					"id": "30df0715-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Поверяйте решения рассудка чувством, а стремления чувств рассудком"
				},
				{
					"id": "30df0716-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Ваше рассуждение убедило собеседника"
				},
				{
					"id": "30df0717-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы публично прокомментировали эмоционально задевшую вас медиа-публикацию"
				}
			],
			"lockedUntil": 0
		},
		"rigging": {
			"canWorkWithBioware": false,
			"implantsBonus": 2,
			"tuningBonus": 2,
			"repomanBonus": 2
		},
		"essenceDetails": {
			"max": 600,
			"used": 0,
			"gap": 0
		},
		"karma": {
			"available": 0,
			"spent": 0,
			"spentOnPassives": 0,
			"cycleLimit": 100,
			"gameLimit": 500
		}
	},
	"workModel": {
		"modelId": "51935",
		"timestamp": 1635033444085,
		"modifiers": [
			{
				"mID": "_system",
				"priority": 3,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "systemEssenceEffect"
					},
					{
						"enabled": true,
						"type": "normal",
						"handler": "jackedInEffect"
					}
				]
			},
			{
				"mID": "_limiter",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "clampAttributes"
					}
				]
			},
			{
				"mID": "_cooldown_calculator",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "calculateCooldowns"
					}
				]
			},
			{
				"amount": 1,
				"mID": "ckv30mdu5000a01wd317kcdxt",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseFadingResistance"
					}
				]
			},
			{
				"amount": -1,
				"mID": "ckv30mduo000b01wd8gv03cd4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseHostEntrySpeed"
					}
				]
			},
			{
				"amount": -40,
				"mID": "ckv30mduo000c01wd1ydp3v38",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoBaseEffectThreshold"
					}
				]
			},
			{
				"amount": -30,
				"mID": "ckv30mduo000d01wdbcg0do1v",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoUberEffectThreshold"
					}
				]
			},
			{
				"amount": -20,
				"mID": "ckv30mduo000e01wd45pd7yd5",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoSuperEffectThreshold"
					}
				]
			},
			{
				"amount": -60,
				"mID": "ckv30mduo000f01wd1la4c07c",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoCrysisThreshold"
					}
				]
			},
			{
				"amount": 2,
				"mID": "ckv30ozrm000g01wd9m8c7oe4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseMagic"
					}
				]
			},
			{
				"amount": 0.8,
				"mID": "ckv30xwon000h01wd1he1as2t",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "multiplySpiritResistanceMultiplier"
					}
				]
			}
		],
		"timers": [
			{
				"name": "give-karma-for-passives",
				"description": "Начисление кармы за все ваши способности",
				"miliseconds": 2533168,
				"eventType": "giveKarmaForPassiveAbilities",
				"data": {}
			},
			{
				"name": "decrease-current-fading",
				"description": "Уменьшение фейдинга (при наличии абилок)",
				"miliseconds": 13168,
				"eventType": "decreaseCurrentFading",
				"data": {}
			},
			{
				"name": "normal-hunger",
				"description": "Голодный обморок",
				"miliseconds": 43174168,
				"eventType": "hungerStage1",
				"data": {}
			},
			{
				"name": "normal-hunger-reminder",
				"description": "Напоминание о том, что нужно поесть",
				"miliseconds": 39574168,
				"eventType": "hungerReminder",
				"data": {}
			}
		],
		"name": "ТестПер",
		"currentBody": "physical",
		"maxHp": 2,
		"healthState": "healthy",
		"metarace": "meta-norm",
		"body": 1,
		"strength": 1,
		"depth": 1,
		"intelligence": 1,
		"charisma": 1,
		"essence": 600,
		"mentalAttackBonus": 0,
		"mentalDefenceBonus": 0,
		"mentalQrId": 61935,
		"magic": 3,
		"resonance": 1,
		"matrixHp": 1,
		"maxTimeInVr": 60,
		"cooldownCoefficient": 1,
		"victimCoefficient": 1,
		"participantCoefficient": 1,
		"implantsBodySlots": 2,
		"implantsRemovalResistance": 0,
		"spells": [
			{
				"id": "spirit-catcher",
				// "description": "В течение Мощь*2 минут можно три раза попытаться поймать духа. С увеличением Мощи растут и шансы на поимку",
				// "humanReadableName": "Spirit catcher (S)",
				// "hasTarget": false,
				// "sphere": "stats"
			},
			{
				"id": "fireball",
				"description": "У мага на Мощь*4 минуты появляется пассивная способность Fireball-Эффект, позволяющая кидать файерболы. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных файерболов: Мощь/2 с округлением вверх",
				"humanReadableName": "Fireball (S)",
				"hasTarget": false,
				"sphere": "fighting"
			},
			{
				"id": "input-stream",
				"description": "В течение Мощь*3 минут мана из соседних локаций периодически будет призываться в эту  (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
				"humanReadableName": "InputStream (S)",
				"hasTarget": false,
				"sphere": "astral"
			}
		],
		"activeAbilities": [],
		"passiveAbilities": [
			{
				"id": "meta-norm",
				"humanReadableName": "Норм",
				"description": "Ты норм. Самый обычный Sapiens, как и миллионы других.",
				"modifierIds": []
			},
			// {
			// 	"id": "feel-matrix",
			// 	"humanReadableName": "Чувство Матрицы",
			// 	"description": "Ты чувствуешь матрицу. Устойчивость к фейдингу техноманта, у декера уменьшается время входа на хоcт.",
			// 	"modifierIds": [
			// 		"ckv30mdu5000a01wd317kcdxt",
			// 		"ckv30mduo000b01wd8gv03cd4"
			// 	]
			// },
			{
				"id": "chem-weak",
				// "humanReadableName": "Слабость к препаратам",
				// "description": "Для воздействия препарата достаточно уменьшенной дозы. Аккуратно!",
				// "modifierIds": [
				// 	"ckv30mduo000c01wd1ydp3v38",
				// 	"ckv30mduo000d01wdbcg0do1v",
				// 	"ckv30mduo000e01wd45pd7yd5",
				// 	"ckv30mduo000f01wd1la4c07c"
				// ]
			},
			{
				"id": "arch-mage",
				"humanReadableName": "Архетип: Маг",
				"description": "Маг, повелитель заклинаний!",
				"modifierIds": [
					"ckv30ozrm000g01wd9m8c7oe4"
				]
			},
			{
				"id": "nice-suit",
				"humanReadableName": "Nice suit (P)",
				"description": "Увеличивает продолжительность призыва духа на 30 минут",
				"modifierIds": []
			},
			{
				"id": "leisure-suit",
				"humanReadableName": "Leisure suit (P)",
				"description": "Увеличивает продолжительность призыва духа еще на 30 минут",
				"modifierIds": []
			},
			{
				"id": "suit-up",
				"humanReadableName": "Suit Up (P)",
				"description": "Даёт возможность временно надеть тело духа из тотема. Своё мясное тело маг должен оставить в телохранилище. Продолжительность призыва духа - 30 минут. (время может быть увеличено)",
				"modifierIds": []
			},
			{
				"id": "fine-hearing",
				"humanReadableName": "Fine hearing (P)",
				"description": "Ты знаешь, какими способностями обладают духи вокруг тебя",
				"modifierIds": []
			},
			{
				"id": "spirit-master-1",
				"humanReadableName": "Spirit Apprentice (P)",
				"description": "Ты можешь ловить духов 1го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-2",
				"humanReadableName": "Spirit Disciple (P)",
				"description": "Ты можешь ловить духов 2го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-3",
				"humanReadableName": "Spirit Master (P)",
				"description": "Ты можешь ловить духов 3го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-feed",
				"humanReadableName": "Друг духов",
				"description": "Тебе заметно легче ловить духов",
				"modifierIds": [
					"ckv30xwon000h01wd1he1as2t"
				]
			},
			{
				"id": "spirit-known",
				"humanReadableName": "Знакомый духов (P)",
				"description": "Тебе легче ловить духов",
				"modifierIds": []
			},
			{
				"id": "magic-1",
				"humanReadableName": "Магия 1 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jus3h000i01wd5agtaj31"
				]
			},
			{
				"id": "magic-2",
				"humanReadableName": "Магия 2 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jutwp000j01wdc8fxax1m"
				]
			},
			{
				"id": "magic-3",
				"humanReadableName": "Магия 3 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juvkw000k01wd5wlshdm8"
				]
			},
			{
				"id": "magic-4",
				"humanReadableName": "Магия 4 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juy6e000l01wdgdtz34gr"
				]
			},
			{
				"id": "magic-5",
				"humanReadableName": "Магия 5 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jv06u000m01wdarmi9ith"
				]
			}
		],
		"implants": [],
		"chemoConsumptionRecords": [],
		"analyzedBody": null,
		"history": [
			{
				"id": "6d545980-dd82-483f-a2fb-61cf1b779fc4",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634946615138
			},
			{
				"id": "e7cebc48-feb1-4940-957d-c4320d4d1a7c",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634946625341
			},
			{
				"id": "18e868ec-db87-4857-8a72-819c71d8a46b",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634953863785
			},
			{
				"id": "9e076772-5a1f-4b31-9e35-ad5871ed6a3f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634953938463
			},
			{
				"id": "57753e71-4327-44f2-9c9d-3df0e2a44622",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957246689
			},
			{
				"id": "049eb826-2f8a-42d9-8f42-46c61ab78b74",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957256485
			},
			{
				"id": "20b4f87c-a7f8-43db-a3b1-24f57388c5cb",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957882816
			},
			{
				"id": "e138de9b-71fb-4c21-849e-6a26288e6265",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957894581
			},
			{
				"id": "60a49d70-1177-48b4-985d-98e9cc224233",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634958035585
			},
			{
				"id": "36becab7-3a2c-42bc-bdd4-172533d7811a",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634958073382
			},
			{
				"id": "3d44b7a3-2d0b-4677-aa7e-c83b84981ac0",
				"title": "Голод",
				"shortText": "Вы потеряли сознание от голода. Тяжелое ранение.",
				"longText": "",
				"timestamp": 1634989177253
			},
			{
				"id": "c3e858d5-5f47-438f-8544-19d367d6537e",
				"title": "Ранение",
				"shortText": "Вы в состоянии клинической смерти",
				"longText": "",
				"timestamp": 1634990977253
			},
			{
				"id": "75b88fa2-85b1-46a1-acf2-f318b181cd0d",
				"title": "Лечение",
				"shortText": "Хиты полностью восстановлены",
				"longText": "Вы полностью здоровы. Ура!",
				"timestamp": 1635033418253
			}
		],
		"magicStats": {
			"feedbackMultiplier": 1,
			"recoverySpeedMultiplier": 1,
			"spiritResistanceMultiplier": 0.8,
			"auraReadingMultiplier": 1,
			"auraMarkMultiplier": 1,
			"auraMask": 0,
			"aura": "ecjerjbhcwbrgixrqzjg",
			"maxPowerBonus": 0,
			"victimCoefficient": 1,
			"participantCoefficient": 1
		},
		"hacking": {
			"maxTimeAtHost": 30,
			"hostEntrySpeed": 7,
			"conversionAttack": 0,
			"conversionFirewall": 0,
			"conversionSleaze": 0,
			"conversionDataprocessing": 0,
			"fadingResistance": 1,
			"biofeedbackResistance": 0,
			"adminHostNumber": 3,
			"spriteLevel": 0,
			"resonanceForControlBonus": 0,
			"varianceResistance": 0,
			"compilationFadingResistance": 0,
			"additionalRequests": 0,
			"additionalSprites": 0,
			"additionalBackdoors": 0,
			"backdoorTtl": 120,
			"jackedIn": false,
			"fading": 0,
			"fadingDecrease": 0
		},
		"drones": {
			"maxDifficulty": -1000,
			"maxTimeInside": 6,
			"recoveryTime": 120,
			"medicraftBonus": 1,
			"autodocBonus": 1,
			"aircraftBonus": 2,
			"groundcraftBonus": 2,
			"feedbackModifier": 0,
			"recoverySkill": 0
		},
		"chemo": {
			"baseEffectThreshold": 160,
			"uberEffectThreshold": 220,
			"superEffectThreshold": 280,
			"crysisThreshold": 340,
			"sensitivity": 280,
			"concentration": {
				"teqgel": 0,
				"iodine": 0,
				"argon": 0,
				"radium": 0,
				"junius": 0,
				"custodium": 0,
				"polonium": 0,
				"silicon": 0,
				"magnium": 0,
				"chromium": 0,
				"opium": 0,
				"elba": 0,
				"barium": 0,
				"uranium": 0,
				"moscovium": 0,
				"iconium": 0,
				"vampirium": 0
			}
		},
		"billing": {
			"anonymous": false,
			"stockGainPercentage": 0
		},
		"discounts": {
			"weaponsArmor": 1,
			"everything": 1
		},
		"screens": {
			"billing": true,
			"spellbook": true,
			"activeAbilities": true,
			"passiveAbilities": true,
			"karma": true,
			"implants": true,
			"autodoc": false,
			"autodocWoundHeal": true,
			"autodocImplantInstall": false,
			"autodocImplantRemoval": false,
			"ethics": true,
			"location": false,
			"wound": true,
			"scanQr": true,
			"scoring": false
		},
		"ethic": {
			"groups": [],
			"state": [
				{
					"scale": "violence",
					"value": 0,
					"description": "За добро платит добром, за зло - по справедливости"
				},
				{
					"scale": "control",
					"value": 0,
					"description": "Свобода выбора обязует принять его последствия"
				},
				{
					"scale": "individualism",
					"value": 0,
					"description": "Своя рубашка ближе к телу"
				},
				{
					"scale": "mind",
					"value": 0,
					"description": "Равновесие - основа душевного здоровья"
				}
			],
			"trigger": [
				{
					"id": "30df06ca-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Нельзя упускать свою выгоду. Так называемые милосердие и насилие - лишь средства ее получить"
				},
				{
					"id": "30df06cb-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили тому, кто сильнее вас"
				},
				{
					"id": "30df06cc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились тому, кто слабее вас"
				},
				{
					"id": "30df06e3-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "И покорность, и бунт хороши, если пополняют твой счет. И плохи в обратном случае."
				},
				{
					"id": "30df06e4-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы выполнили просьбу, которую не были обязаны выполнять"
				},
				{
					"id": "30df06e5-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы отказались выполнять требование, которое были обязаны выполнить"
				},
				{
					"id": "30df06fc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Принадлежность к сообществу или самостоятельность хороши, только если это выгодно"
				},
				{
					"id": "30df06fd-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили общему решению вашей группы"
				},
				{
					"id": "30df06fe-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились общему решению вашей группы"
				},
				{
					"id": "30df0715-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Поверяйте решения рассудка чувством, а стремления чувств рассудком"
				},
				{
					"id": "30df0716-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Ваше рассуждение убедило собеседника"
				},
				{
					"id": "30df0717-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы публично прокомментировали эмоционально задевшую вас медиа-публикацию"
				}
			],
			"lockedUntil": 0
		},
		"rigging": {
			"canWorkWithBioware": false,
			"implantsBonus": 2,
			"tuningBonus": 2,
			"repomanBonus": 2
		},
		"essenceDetails": {
			"max": 600,
			"used": 0,
			"gap": 0
		},
		"karma": {
			"available": 0,
			"spent": 0,
			"spentOnPassives": 0,
			"cycleLimit": 100,
			"gameLimit": 500
		}
	},
	"notifications": [],
	"outboundEvents": [],
	"pubSubNotifications": []
} as CharacterModelData;

export const suitedSpiritCharacter = {
	"baseModel": {
		"modelId": "51935",
		"timestamp": 1635035889235,
		"modifiers": [
			{
				"mID": "_system",
				"priority": 3,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "systemEssenceEffect"
					},
					{
						"enabled": true,
						"type": "normal",
						"handler": "jackedInEffect"
					}
				]
			},
			{
				"mID": "_limiter",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "clampAttributes"
					}
				]
			},
			{
				"mID": "_cooldown_calculator",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "calculateCooldowns"
					}
				]
			},
			{
				"amount": 1,
				"mID": "ckv30mdu5000a01wd317kcdxt",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseFadingResistance"
					}
				]
			},
			{
				"amount": -1,
				"mID": "ckv30mduo000b01wd8gv03cd4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseHostEntrySpeed"
					}
				]
			},
			{
				"amount": -40,
				"mID": "ckv30mduo000c01wd1ydp3v38",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoBaseEffectThreshold"
					}
				]
			},
			{
				"amount": -30,
				"mID": "ckv30mduo000d01wdbcg0do1v",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoUberEffectThreshold"
					}
				]
			},
			{
				"amount": -20,
				"mID": "ckv30mduo000e01wd45pd7yd5",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoSuperEffectThreshold"
					}
				]
			},
			{
				"amount": -60,
				"mID": "ckv30mduo000f01wd1la4c07c",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoCrysisThreshold"
					}
				]
			},
			{
				"amount": 2,
				"mID": "ckv30ozrm000g01wd9m8c7oe4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseMagic"
					}
				]
			},
			{
				"amount": 0.8,
				"mID": "ckv30xwon000h01wd1he1as2t",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "multiplySpiritResistanceMultiplier"
					}
				]
			},
			{
				"mID": "in-the-spirit",
				"priority": 5,
				"enabled": true,
				"effects": [
					{
						"type": "functional",
						"handler": "inTheSpirit",
						"enabled": true
					}
				],
				"name": "fireball-keeper--tXBPiWo5I",
				"hp": 3,
				"abilityIds": [
					"fireball-keeper",
					"i-shall-pass"
				],
				"bodyStorageId": "367",
				"qrCodeId": "359",
				"spiritId": 382,
				"postSpiritDamage": 0,
				"stage": 0
			}
		],
		"timers": [
			{
				"name": "give-karma-for-passives",
				"description": "Начисление кармы за все ваши способности",
				"miliseconds": 88018,
				"eventType": "giveKarmaForPassiveAbilities",
				"data": {}
			},
			{
				"name": "normal-hunger",
				"description": "Голодный обморок",
				"miliseconds": 40729018,
				"eventType": "hungerStage1",
				"data": {}
			},
			{
				"name": "normal-hunger-reminder",
				"description": "Напоминание о том, что нужно поесть",
				"miliseconds": 37129018,
				"eventType": "hungerReminder",
				"data": {}
			},
			{
				"name": "decrease-current-fading",
				"description": "Уменьшение фейдинга (при наличии абилок)",
				"miliseconds": 28018,
				"eventType": "decreaseCurrentFading",
				"data": {}
			}
		],
		"name": "ТестПер",
		"currentBody": "physical",
		"maxHp": 2,
		"healthState": "healthy",
		"metarace": "meta-norm",
		"body": 1,
		"strength": 1,
		"depth": 1,
		"intelligence": 1,
		"charisma": 1,
		"essence": 0,
		"mentalAttackBonus": 0,
		"mentalDefenceBonus": 0,
		"mentalQrId": 61935,
		"magic": 1,
		"resonance": 1,
		"matrixHp": 1,
		"maxTimeInVr": 60,
		"cooldownCoefficient": 1,
		"victimCoefficient": 1,
		"participantCoefficient": 1,
		"implantsBodySlots": 2,
		"implantsRemovalResistance": 0,
		"spells": [
			{
				"id": "spirit-catcher",
				"description": "В течение Мощь*2 минут можно три раза попытаться поймать духа. С увеличением Мощи растут и шансы на поимку",
				"humanReadableName": "Spirit catcher (S)",
				"hasTarget": false,
				"sphere": "stats"
			},
			{
				"id": "fireball",
				"description": "У мага на Мощь*4 минуты появляется пассивная способность Fireball-Эффект, позволяющая кидать файерболы. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных файерболов: Мощь/2 с округлением вверх",
				"humanReadableName": "Fireball (S)",
				"hasTarget": false,
				"sphere": "fighting"
			},
			{
				"id": "input-stream",
				"description": "В течение Мощь*3 минут мана из соседних локаций периодически будет призываться в эту  (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
				"humanReadableName": "InputStream (S)",
				"hasTarget": false,
				"sphere": "astral"
			}
		],
		"activeAbilities": [
			{
				"id": "i-shall-pass",
				"humanReadableName": "ДУХ: I shall pass",
				"description": "Активация дает возможность тихо открыть один замок за 1 минуту - все это время надо держаться рукой за сертификат замка.\nКулдаун 5 минут",
				"target": "scan",
				"targetsSignature": [],
				"cooldownMinutes": 0,
				"cooldownUntil": 0
			}
		],
		"passiveAbilities": [
			{
				"id": "meta-norm",
				"humanReadableName": "Норм",
				"description": "Ты норм. Самый обычный Sapiens, как и миллионы других.",
				"modifierIds": []
			},
			{
				"id": "feel-matrix",
				"humanReadableName": "Чувство Матрицы",
				"description": "Ты чувствуешь матрицу. Устойчивость к фейдингу техноманта, у декера уменьшается время входа на хоcт.",
				"modifierIds": [
					"ckv30mdu5000a01wd317kcdxt",
					"ckv30mduo000b01wd8gv03cd4"
				]
			},
			{
				"id": "chem-weak",
				"humanReadableName": "Слабость к препаратам",
				"description": "Для воздействия препарата достаточно уменьшенной дозы. Аккуратно!",
				"modifierIds": [
					"ckv30mduo000c01wd1ydp3v38",
					"ckv30mduo000d01wdbcg0do1v",
					"ckv30mduo000e01wd45pd7yd5",
					"ckv30mduo000f01wd1la4c07c"
				]
			},
			{
				"id": "arch-mage",
				"humanReadableName": "Архетип: Маг",
				"description": "Маг, повелитель заклинаний!",
				"modifierIds": [
					"ckv30ozrm000g01wd9m8c7oe4"
				]
			},
			{
				"id": "nice-suit",
				"humanReadableName": "Nice suit (P)",
				"description": "Увеличивает продолжительность призыва духа на 30 минут",
				"modifierIds": []
			},
			{
				"id": "leisure-suit",
				"humanReadableName": "Leisure suit (P)",
				"description": "Увеличивает продолжительность призыва духа еще на 30 минут",
				"modifierIds": []
			},
			{
				"id": "suit-up",
				"humanReadableName": "Suit Up (P)",
				"description": "Даёт возможность временно надеть тело духа из тотема. Своё мясное тело маг должен оставить в телохранилище. Продолжительность призыва духа - 30 минут. (время может быть увеличено)",
				"modifierIds": []
			},
			{
				"id": "fine-hearing",
				"humanReadableName": "Fine hearing (P)",
				"description": "Ты знаешь, какими способностями обладают духи вокруг тебя",
				"modifierIds": []
			},
			{
				"id": "spirit-master-1",
				"humanReadableName": "Spirit Apprentice (P)",
				"description": "Ты можешь ловить духов 1го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-2",
				"humanReadableName": "Spirit Disciple (P)",
				"description": "Ты можешь ловить духов 2го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-3",
				"humanReadableName": "Spirit Master (P)",
				"description": "Ты можешь ловить духов 3го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-feed",
				"humanReadableName": "Друг духов",
				"description": "Тебе заметно легче ловить духов",
				"modifierIds": [
					"ckv30xwon000h01wd1he1as2t"
				]
			},
			{
				"id": "spirit-known",
				"humanReadableName": "Знакомый духов (P)",
				"description": "Тебе легче ловить духов",
				"modifierIds": []
			},
			{
				"id": "fireball-keeper",
				"humanReadableName": "ДУХ: Fireball - keeper",
				"description": "Можешь кинуть 2 огненных шара. Затем эффект исчерпан до выхода из духа",
				"modifierIds": []
			},
			{
				"id": "magic-1",
				"humanReadableName": "Магия 1 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jus3h000i01wd5agtaj31"
				]
			},
			{
				"id": "magic-2",
				"humanReadableName": "Магия 2 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jutwp000j01wdc8fxax1m"
				]
			},
			{
				"id": "magic-3",
				"humanReadableName": "Магия 3 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juvkw000k01wd5wlshdm8"
				]
			},
			{
				"id": "magic-4",
				"humanReadableName": "Магия 4 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juy6e000l01wdgdtz34gr"
				]
			},
			{
				"id": "magic-5",
				"humanReadableName": "Магия 5 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jv06u000m01wdarmi9ith"
				]
			}
		],
		"implants": [],
		"chemoConsumptionRecords": [],
		"analyzedBody": null,
		"history": [
			{
				"id": "6d545980-dd82-483f-a2fb-61cf1b779fc4",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634946615138
			},
			{
				"id": "e7cebc48-feb1-4940-957d-c4320d4d1a7c",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634946625341
			},
			{
				"id": "18e868ec-db87-4857-8a72-819c71d8a46b",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634953863785
			},
			{
				"id": "9e076772-5a1f-4b31-9e35-ad5871ed6a3f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634953938463
			},
			{
				"id": "57753e71-4327-44f2-9c9d-3df0e2a44622",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957246689
			},
			{
				"id": "049eb826-2f8a-42d9-8f42-46c61ab78b74",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957256485
			},
			{
				"id": "20b4f87c-a7f8-43db-a3b1-24f57388c5cb",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957882816
			},
			{
				"id": "e138de9b-71fb-4c21-849e-6a26288e6265",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957894581
			},
			{
				"id": "60a49d70-1177-48b4-985d-98e9cc224233",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634958035585
			},
			{
				"id": "36becab7-3a2c-42bc-bdd4-172533d7811a",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634958073382
			},
			{
				"id": "3d44b7a3-2d0b-4677-aa7e-c83b84981ac0",
				"title": "Голод",
				"shortText": "Вы потеряли сознание от голода. Тяжелое ранение.",
				"longText": "",
				"timestamp": 1634989177253
			},
			{
				"id": "c3e858d5-5f47-438f-8544-19d367d6537e",
				"title": "Ранение",
				"shortText": "Вы в состоянии клинической смерти",
				"longText": "",
				"timestamp": 1634990977253
			},
			{
				"id": "75b88fa2-85b1-46a1-acf2-f318b181cd0d",
				"title": "Лечение",
				"shortText": "Хиты полностью восстановлены",
				"longText": "Вы полностью здоровы. Ура!",
				"timestamp": 1635033418253
			},
			{
				"id": "0363deba-ba16-4dbf-8a40-88aff38cd7aa",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1635035879611
			}
		],
		"magicStats": {
			"feedbackMultiplier": 1,
			"recoverySpeedMultiplier": 1,
			"spiritResistanceMultiplier": 1,
			"auraReadingMultiplier": 1,
			"auraMarkMultiplier": 1,
			"auraMask": 0,
			"aura": "ecjerjbhcwbrgixrqzjg",
			"maxPowerBonus": 0,
			"victimCoefficient": 1,
			"participantCoefficient": 1
		},
		"hacking": {
			"maxTimeAtHost": 30,
			"hostEntrySpeed": 8,
			"conversionAttack": 0,
			"conversionFirewall": 0,
			"conversionSleaze": 0,
			"conversionDataprocessing": 0,
			"fadingResistance": 0,
			"biofeedbackResistance": 0,
			"adminHostNumber": 3,
			"spriteLevel": 0,
			"resonanceForControlBonus": 0,
			"varianceResistance": 0,
			"compilationFadingResistance": 0,
			"additionalRequests": 0,
			"additionalSprites": 0,
			"additionalBackdoors": 0,
			"backdoorTtl": 120,
			"jackedIn": false,
			"fading": 0,
			"fadingDecrease": 0
		},
		"drones": {
			"maxDifficulty": -1000,
			"maxTimeInside": 0,
			"recoveryTime": 120,
			"medicraftBonus": 1,
			"autodocBonus": 1,
			"aircraftBonus": 2,
			"groundcraftBonus": 2,
			"feedbackModifier": 0,
			"recoverySkill": 0
		},
		"chemo": {
			"baseEffectThreshold": 200,
			"uberEffectThreshold": 250,
			"superEffectThreshold": 300,
			"crysisThreshold": 400,
			"sensitivity": 280,
			"concentration": {
				"teqgel": 0,
				"iodine": 0,
				"argon": 0,
				"radium": 0,
				"junius": 0,
				"custodium": 0,
				"polonium": 0,
				"silicon": 0,
				"magnium": 0,
				"chromium": 0,
				"opium": 0,
				"elba": 0,
				"barium": 0,
				"uranium": 0,
				"moscovium": 0,
				"iconium": 0,
				"vampirium": 0
			}
		},
		"billing": {
			"anonymous": false,
			"stockGainPercentage": 0
		},
		"discounts": {
			"weaponsArmor": 1,
			"everything": 1
		},
		"screens": {
			"billing": true,
			"spellbook": true,
			"activeAbilities": true,
			"passiveAbilities": true,
			"karma": true,
			"implants": true,
			"autodoc": false,
			"autodocWoundHeal": true,
			"autodocImplantInstall": false,
			"autodocImplantRemoval": false,
			"ethics": true,
			"location": false,
			"wound": true,
			"scanQr": true,
			"scoring": false
		},
		"ethic": {
			"groups": [],
			"state": [
				{
					"scale": "violence",
					"value": 0,
					"description": "За добро платит добром, за зло - по справедливости"
				},
				{
					"scale": "control",
					"value": 0,
					"description": "Свобода выбора обязует принять его последствия"
				},
				{
					"scale": "individualism",
					"value": 0,
					"description": "Своя рубашка ближе к телу"
				},
				{
					"scale": "mind",
					"value": 0,
					"description": "Равновесие - основа душевного здоровья"
				}
			],
			"trigger": [
				{
					"id": "30df06ca-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Нельзя упускать свою выгоду. Так называемые милосердие и насилие - лишь средства ее получить"
				},
				{
					"id": "30df06cb-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили тому, кто сильнее вас"
				},
				{
					"id": "30df06cc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились тому, кто слабее вас"
				},
				{
					"id": "30df06e3-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "И покорность, и бунт хороши, если пополняют твой счет. И плохи в обратном случае."
				},
				{
					"id": "30df06e4-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы выполнили просьбу, которую не были обязаны выполнять"
				},
				{
					"id": "30df06e5-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы отказались выполнять требование, которое были обязаны выполнить"
				},
				{
					"id": "30df06fc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Принадлежность к сообществу или самостоятельность хороши, только если это выгодно"
				},
				{
					"id": "30df06fd-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили общему решению вашей группы"
				},
				{
					"id": "30df06fe-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились общему решению вашей группы"
				},
				{
					"id": "30df0715-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Поверяйте решения рассудка чувством, а стремления чувств рассудком"
				},
				{
					"id": "30df0716-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Ваше рассуждение убедило собеседника"
				},
				{
					"id": "30df0717-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы публично прокомментировали эмоционально задевшую вас медиа-публикацию"
				}
			],
			"lockedUntil": 0
		},
		"rigging": {
			"canWorkWithBioware": false,
			"implantsBonus": 2,
			"tuningBonus": 2,
			"repomanBonus": 2
		},
		"essenceDetails": {
			"max": 600,
			"used": 0,
			"gap": 0
		},
		"karma": {
			"available": 0,
			"spent": 0,
			"spentOnPassives": 0,
			"cycleLimit": 100,
			"gameLimit": 500
		}
	},
	"workModel": {
		"modelId": "51935",
		"timestamp": 1635035889235,
		"modifiers": [
			{
				"mID": "_system",
				"priority": 3,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "systemEssenceEffect"
					},
					{
						"enabled": true,
						"type": "normal",
						"handler": "jackedInEffect"
					}
				]
			},
			{
				"mID": "_limiter",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "clampAttributes"
					}
				]
			},
			{
				"mID": "_cooldown_calculator",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "calculateCooldowns"
					}
				]
			},
			{
				"amount": 1,
				"mID": "ckv30mdu5000a01wd317kcdxt",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseFadingResistance"
					}
				]
			},
			{
				"amount": -1,
				"mID": "ckv30mduo000b01wd8gv03cd4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseHostEntrySpeed"
					}
				]
			},
			{
				"amount": -40,
				"mID": "ckv30mduo000c01wd1ydp3v38",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoBaseEffectThreshold"
					}
				]
			},
			{
				"amount": -30,
				"mID": "ckv30mduo000d01wdbcg0do1v",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoUberEffectThreshold"
					}
				]
			},
			{
				"amount": -20,
				"mID": "ckv30mduo000e01wd45pd7yd5",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoSuperEffectThreshold"
					}
				]
			},
			{
				"amount": -60,
				"mID": "ckv30mduo000f01wd1la4c07c",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoCrysisThreshold"
					}
				]
			},
			{
				"amount": 2,
				"mID": "ckv30ozrm000g01wd9m8c7oe4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseMagic"
					}
				]
			},
			{
				"amount": 0.8,
				"mID": "ckv30xwon000h01wd1he1as2t",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "multiplySpiritResistanceMultiplier"
					}
				]
			},
			{
				"mID": "in-the-spirit",
				"priority": 5,
				"enabled": true,
				"effects": [
					{
						"type": "functional",
						"handler": "inTheSpirit",
						"enabled": true
					}
				],
				"name": "fireball-keeper--tXBPiWo5I",
				"hp": 3,
				"abilityIds": [
					"fireball-keeper",
					"i-shall-pass"
				],
				"bodyStorageId": "367",
				"qrCodeId": "359",
				"spiritId": 382,
				"postSpiritDamage": 0,
				"stage": 0
			}
		],
		"timers": [
			{
				"name": "give-karma-for-passives",
				"description": "Начисление кармы за все ваши способности",
				"miliseconds": 88018,
				"eventType": "giveKarmaForPassiveAbilities",
				"data": {}
			},
			{
				"name": "normal-hunger",
				"description": "Голодный обморок",
				"miliseconds": 40729018,
				"eventType": "hungerStage1",
				"data": {}
			},
			{
				"name": "normal-hunger-reminder",
				"description": "Напоминание о том, что нужно поесть",
				"miliseconds": 37129018,
				"eventType": "hungerReminder",
				"data": {}
			},
			{
				"name": "decrease-current-fading",
				"description": "Уменьшение фейдинга (при наличии абилок)",
				"miliseconds": 28018,
				"eventType": "decreaseCurrentFading",
				"data": {}
			}
		],
		"name": "fireball-keeper--tXBPiWo5I",
		"currentBody": "ectoplasm",
		"maxHp": 3,
		"healthState": "healthy",
		"metarace": "meta-norm",
		"body": 1,
		"strength": 1,
		"depth": 1,
		"intelligence": 1,
		"charisma": 1,
		"essence": 600,
		"mentalAttackBonus": 0,
		"mentalDefenceBonus": 0,
		"mentalQrId": 61935,
		"magic": 3,
		"resonance": 1,
		"matrixHp": 1,
		"maxTimeInVr": 60,
		"cooldownCoefficient": 1,
		"victimCoefficient": 1,
		"participantCoefficient": 1,
		"implantsBodySlots": 2,
		"implantsRemovalResistance": 0,
		"spells": [
			{
				"id": "spirit-catcher",
				// "description": "В течение Мощь*2 минут можно три раза попытаться поймать духа. С увеличением Мощи растут и шансы на поимку",
				// "humanReadableName": "Spirit catcher (S)",
				// "hasTarget": false,
				// "sphere": "stats"
			},
			{
				"id": "fireball",
				"description": "У мага на Мощь*4 минуты появляется пассивная способность Fireball-Эффект, позволяющая кидать файерболы. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных файерболов: Мощь/2 с округлением вверх",
				"humanReadableName": "Fireball (S)",
				"hasTarget": false,
				"sphere": "fighting"
			},
			{
				"id": "input-stream",
				"description": "В течение Мощь*3 минут мана из соседних локаций периодически будет призываться в эту  (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
				"humanReadableName": "InputStream (S)",
				"hasTarget": false,
				"sphere": "astral"
			}
		],
		"activeAbilities": [
			{
				"id": "i-shall-pass",
				// "humanReadableName": "ДУХ: I shall pass",
				// "description": "Активация дает возможность тихо открыть один замок за 1 минуту - все это время надо держаться рукой за сертификат замка.\nКулдаун 5 минут",
				// "target": "scan",
				// "targetsSignature": [],
				// "cooldownMinutes": 5,
				// "cooldownUntil": 0
			}
		],
		"passiveAbilities": [
			{
				"id": "meta-norm",
				"humanReadableName": "Норм",
				"description": "Ты норм. Самый обычный Sapiens, как и миллионы других.",
				"modifierIds": []
			},
			{
				"id": "feel-matrix",
				// "humanReadableName": "Чувство Матрицы",
				// "description": "Ты чувствуешь матрицу. Устойчивость к фейдингу техноманта, у декера уменьшается время входа на хоcт.",
				// "modifierIds": [
				// 	"ckv30mdu5000a01wd317kcdxt",
				// 	"ckv30mduo000b01wd8gv03cd4"
				// ]
			},
			{
				"id": "chem-weak",
				"humanReadableName": "Слабость к препаратам",
				"description": "Для воздействия препарата достаточно уменьшенной дозы. Аккуратно!",
				"modifierIds": [
					"ckv30mduo000c01wd1ydp3v38",
					"ckv30mduo000d01wdbcg0do1v",
					"ckv30mduo000e01wd45pd7yd5",
					"ckv30mduo000f01wd1la4c07c"
				]
			},
			{
				"id": "arch-mage",
				"humanReadableName": "Архетип: Маг",
				"description": "Маг, повелитель заклинаний!",
				"modifierIds": [
					"ckv30ozrm000g01wd9m8c7oe4"
				]
			},
			{
				"id": "nice-suit",
				"humanReadableName": "Nice suit (P)",
				"description": "Увеличивает продолжительность призыва духа на 30 минут",
				"modifierIds": []
			},
			{
				"id": "leisure-suit",
				"humanReadableName": "Leisure suit (P)",
				"description": "Увеличивает продолжительность призыва духа еще на 30 минут",
				"modifierIds": []
			},
			{
				"id": "suit-up",
				"humanReadableName": "Suit Up (P)",
				"description": "Даёт возможность временно надеть тело духа из тотема. Своё мясное тело маг должен оставить в телохранилище. Продолжительность призыва духа - 30 минут. (время может быть увеличено)",
				"modifierIds": []
			},
			{
				"id": "fine-hearing",
				"humanReadableName": "Fine hearing (P)",
				"description": "Ты знаешь, какими способностями обладают духи вокруг тебя",
				"modifierIds": []
			},
			{
				"id": "spirit-master-1",
				"humanReadableName": "Spirit Apprentice (P)",
				"description": "Ты можешь ловить духов 1го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-2",
				"humanReadableName": "Spirit Disciple (P)",
				"description": "Ты можешь ловить духов 2го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-3",
				"humanReadableName": "Spirit Master (P)",
				"description": "Ты можешь ловить духов 3го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-feed",
				"humanReadableName": "Друг духов",
				"description": "Тебе заметно легче ловить духов",
				"modifierIds": [
					"ckv30xwon000h01wd1he1as2t"
				]
			},
			{
				"id": "spirit-known",
				"humanReadableName": "Знакомый духов (P)",
				"description": "Тебе легче ловить духов",
				"modifierIds": []
			},
			{
				"id": "fireball-keeper",
				"humanReadableName": "ДУХ: Fireball - keeper",
				"description": "Можешь кинуть 2 огненных шара. Затем эффект исчерпан до выхода из духа",
				"modifierIds": []
			},
			{
				"id": "magic-1",
				"humanReadableName": "Магия 1 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jus3h000i01wd5agtaj31"
				]
			},
			{
				"id": "magic-2",
				"humanReadableName": "Магия 2 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jutwp000j01wdc8fxax1m"
				]
			},
			{
				"id": "magic-3",
				"humanReadableName": "Магия 3 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juvkw000k01wd5wlshdm8"
				]
			},
			{
				"id": "magic-4",
				"humanReadableName": "Магия 4 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juy6e000l01wdgdtz34gr"
				]
			},
			{
				"id": "magic-5",
				"humanReadableName": "Магия 5 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jv06u000m01wdarmi9ith"
				]
			}
		],
		"implants": [],
		"chemoConsumptionRecords": [],
		"analyzedBody": null,
		"history": [
			{
				"id": "6d545980-dd82-483f-a2fb-61cf1b779fc4",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634946615138
			},
			{
				"id": "e7cebc48-feb1-4940-957d-c4320d4d1a7c",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634946625341
			},
			{
				"id": "18e868ec-db87-4857-8a72-819c71d8a46b",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634953863785
			},
			{
				"id": "9e076772-5a1f-4b31-9e35-ad5871ed6a3f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634953938463
			},
			{
				"id": "57753e71-4327-44f2-9c9d-3df0e2a44622",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957246689
			},
			{
				"id": "049eb826-2f8a-42d9-8f42-46c61ab78b74",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957256485
			},
			{
				"id": "20b4f87c-a7f8-43db-a3b1-24f57388c5cb",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957882816
			},
			{
				"id": "e138de9b-71fb-4c21-849e-6a26288e6265",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957894581
			},
			{
				"id": "60a49d70-1177-48b4-985d-98e9cc224233",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634958035585
			},
			{
				"id": "36becab7-3a2c-42bc-bdd4-172533d7811a",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634958073382
			},
			{
				"id": "3d44b7a3-2d0b-4677-aa7e-c83b84981ac0",
				"title": "Голод",
				"shortText": "Вы потеряли сознание от голода. Тяжелое ранение.",
				"longText": "",
				"timestamp": 1634989177253
			},
			{
				"id": "c3e858d5-5f47-438f-8544-19d367d6537e",
				"title": "Ранение",
				"shortText": "Вы в состоянии клинической смерти",
				"longText": "",
				"timestamp": 1634990977253
			},
			{
				"id": "75b88fa2-85b1-46a1-acf2-f318b181cd0d",
				"title": "Лечение",
				"shortText": "Хиты полностью восстановлены",
				"longText": "Вы полностью здоровы. Ура!",
				"timestamp": 1635033418253
			},
			{
				"id": "0363deba-ba16-4dbf-8a40-88aff38cd7aa",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1635035879611
			}
		],
		"magicStats": {
			"feedbackMultiplier": 1,
			"recoverySpeedMultiplier": 1,
			"spiritResistanceMultiplier": 0.8,
			"auraReadingMultiplier": 1,
			"auraMarkMultiplier": 1,
			"auraMask": 0,
			"aura": "ecjerjbhcwbrgixrqzjg",
			"maxPowerBonus": 0,
			"victimCoefficient": 1,
			"participantCoefficient": 1
		},
		"hacking": {
			"maxTimeAtHost": 30,
			"hostEntrySpeed": 7,
			"conversionAttack": 0,
			"conversionFirewall": 0,
			"conversionSleaze": 0,
			"conversionDataprocessing": 0,
			"fadingResistance": 1,
			"biofeedbackResistance": 0,
			"adminHostNumber": 3,
			"spriteLevel": 0,
			"resonanceForControlBonus": 0,
			"varianceResistance": 0,
			"compilationFadingResistance": 0,
			"additionalRequests": 0,
			"additionalSprites": 0,
			"additionalBackdoors": 0,
			"backdoorTtl": 120,
			"jackedIn": false,
			"fading": 0,
			"fadingDecrease": 0
		},
		"drones": {
			"maxDifficulty": -1000,
			"maxTimeInside": 6,
			"recoveryTime": 120,
			"medicraftBonus": 1,
			"autodocBonus": 1,
			"aircraftBonus": 2,
			"groundcraftBonus": 2,
			"feedbackModifier": 0,
			"recoverySkill": 0
		},
		"chemo": {
			"baseEffectThreshold": 160,
			"uberEffectThreshold": 220,
			"superEffectThreshold": 280,
			"crysisThreshold": 340,
			"sensitivity": 280,
			"concentration": {
				"teqgel": 0,
				"iodine": 0,
				"argon": 0,
				"radium": 0,
				"junius": 0,
				"custodium": 0,
				"polonium": 0,
				"silicon": 0,
				"magnium": 0,
				"chromium": 0,
				"opium": 0,
				"elba": 0,
				"barium": 0,
				"uranium": 0,
				"moscovium": 0,
				"iconium": 0,
				"vampirium": 0
			}
		},
		"billing": {
			"anonymous": false,
			"stockGainPercentage": 0
		},
		"discounts": {
			"weaponsArmor": 1,
			"everything": 1
		},
		"screens": {
			"billing": false,
			"spellbook": false,
			"activeAbilities": true,
			"passiveAbilities": true,
			"karma": false,
			"implants": false,
			"autodoc": false,
			"autodocWoundHeal": true,
			"autodocImplantInstall": false,
			"autodocImplantRemoval": false,
			"ethics": false,
			"location": false,
			"wound": true,
			"scanQr": true,
			"scoring": false
		},
		"ethic": {
			"groups": [],
			"state": [
				{
					"scale": "violence",
					"value": 0,
					"description": "За добро платит добром, за зло - по справедливости"
				},
				{
					"scale": "control",
					"value": 0,
					"description": "Свобода выбора обязует принять его последствия"
				},
				{
					"scale": "individualism",
					"value": 0,
					"description": "Своя рубашка ближе к телу"
				},
				{
					"scale": "mind",
					"value": 0,
					"description": "Равновесие - основа душевного здоровья"
				}
			],
			"trigger": [
				{
					"id": "30df06ca-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Нельзя упускать свою выгоду. Так называемые милосердие и насилие - лишь средства ее получить"
				},
				{
					"id": "30df06cb-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили тому, кто сильнее вас"
				},
				{
					"id": "30df06cc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились тому, кто слабее вас"
				},
				{
					"id": "30df06e3-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "И покорность, и бунт хороши, если пополняют твой счет. И плохи в обратном случае."
				},
				{
					"id": "30df06e4-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы выполнили просьбу, которую не были обязаны выполнять"
				},
				{
					"id": "30df06e5-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы отказались выполнять требование, которое были обязаны выполнить"
				},
				{
					"id": "30df06fc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Принадлежность к сообществу или самостоятельность хороши, только если это выгодно"
				},
				{
					"id": "30df06fd-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили общему решению вашей группы"
				},
				{
					"id": "30df06fe-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились общему решению вашей группы"
				},
				{
					"id": "30df0715-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Поверяйте решения рассудка чувством, а стремления чувств рассудком"
				},
				{
					"id": "30df0716-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Ваше рассуждение убедило собеседника"
				},
				{
					"id": "30df0717-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы публично прокомментировали эмоционально задевшую вас медиа-публикацию"
				}
			],
			"lockedUntil": 0
		},
		"rigging": {
			"canWorkWithBioware": false,
			"implantsBonus": 2,
			"tuningBonus": 2,
			"repomanBonus": 2
		},
		"essenceDetails": {
			"max": 600,
			"used": 0,
			"gap": 0
		},
		"karma": {
			"available": 0,
			"spent": 0,
			"spentOnPassives": 0,
			"cycleLimit": 100,
			"gameLimit": 500
		}
	},
	"notifications": [],
	"outboundEvents": [],
	"pubSubNotifications": [],
	"spiritSuitState": {
		"status": "Suited",
		"message": null,
		"spiritId": 382,
		"spiritName": "fireball-keeper--tXBPiWo5I",
		"suitStatus": "normal",
		"characterId": 51935,
		"suitDuration": 5400000,
		"bodyStorageId": 367,
		"suitStartTime": 1635035879706,
		"suitStatusChangeTime": -1
	},
	"messageData": {
		"timestamp": 1635035880154,
		"message": ""
	}
} as CharacterModelData;

export const zeroSpiritAbilitiesCharacter = {
	"baseModel": {
		"modelId": "51935",
		"timestamp": 1635036065017,
		"modifiers": [
			{
				"mID": "_system",
				"priority": 3,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "systemEssenceEffect"
					},
					{
						"enabled": true,
						"type": "normal",
						"handler": "jackedInEffect"
					}
				]
			},
			{
				"mID": "_limiter",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "clampAttributes"
					}
				]
			},
			{
				"mID": "_cooldown_calculator",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "calculateCooldowns"
					}
				]
			},
			{
				"amount": 1,
				"mID": "ckv30mdu5000a01wd317kcdxt",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseFadingResistance"
					}
				]
			},
			{
				"amount": -1,
				"mID": "ckv30mduo000b01wd8gv03cd4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseHostEntrySpeed"
					}
				]
			},
			{
				"amount": -40,
				"mID": "ckv30mduo000c01wd1ydp3v38",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoBaseEffectThreshold"
					}
				]
			},
			{
				"amount": -30,
				"mID": "ckv30mduo000d01wdbcg0do1v",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoUberEffectThreshold"
					}
				]
			},
			{
				"amount": -20,
				"mID": "ckv30mduo000e01wd45pd7yd5",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoSuperEffectThreshold"
					}
				]
			},
			{
				"amount": -60,
				"mID": "ckv30mduo000f01wd1la4c07c",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoCrysisThreshold"
					}
				]
			},
			{
				"amount": 2,
				"mID": "ckv30ozrm000g01wd9m8c7oe4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseMagic"
					}
				]
			},
			{
				"amount": 0.8,
				"mID": "ckv30xwon000h01wd1he1as2t",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "multiplySpiritResistanceMultiplier"
					}
				]
			},
			{
				"mID": "in-the-spirit",
				"priority": 5,
				"enabled": true,
				"effects": [
					{
						"type": "functional",
						"handler": "inTheSpirit",
						"enabled": true
					}
				],
				"name": "fireball-keeper--tXBPiWo5I",
				"hp": 3,
				"abilityIds": [
					"fireball-keeper",
					"i-shall-pass"
				],
				"bodyStorageId": "367",
				"qrCodeId": "359",
				"spiritId": 382,
				"postSpiritDamage": 0,
				"stage": 0
			}
		],
		"timers": [
			{
				"name": "normal-hunger",
				"description": "Голодный обморок",
				"miliseconds": 40553236,
				"eventType": "hungerStage1",
				"data": {}
			},
			{
				"name": "normal-hunger-reminder",
				"description": "Напоминание о том, что нужно поесть",
				"miliseconds": 36953236,
				"eventType": "hungerReminder",
				"data": {}
			},
			{
				"name": "give-karma-for-passives",
				"description": "Начисление кармы за все ваши способности",
				"miliseconds": 3512236,
				"eventType": "giveKarmaForPassiveAbilities",
				"data": {}
			},
			{
				"name": "decrease-current-fading",
				"description": "Уменьшение фейдинга (при наличии абилок)",
				"miliseconds": 32236,
				"eventType": "decreaseCurrentFading",
				"data": {}
			}
		],
		"name": "ТестПер",
		"currentBody": "physical",
		"maxHp": 2,
		"healthState": "healthy",
		"metarace": "meta-norm",
		"body": 1,
		"strength": 1,
		"depth": 1,
		"intelligence": 1,
		"charisma": 1,
		"essence": 0,
		"mentalAttackBonus": 0,
		"mentalDefenceBonus": 0,
		"mentalQrId": 61935,
		"magic": 1,
		"resonance": 1,
		"matrixHp": 1,
		"maxTimeInVr": 60,
		"cooldownCoefficient": 1,
		"victimCoefficient": 1,
		"participantCoefficient": 1,
		"implantsBodySlots": 2,
		"implantsRemovalResistance": 0,
		"spells": [
			{
				"id": "spirit-catcher",
				"description": "В течение Мощь*2 минут можно три раза попытаться поймать духа. С увеличением Мощи растут и шансы на поимку",
				"humanReadableName": "Spirit catcher (S)",
				"hasTarget": false,
				"sphere": "stats"
			},
			{
				"id": "fireball",
				"description": "У мага на Мощь*4 минуты появляется пассивная способность Fireball-Эффект, позволяющая кидать файерболы. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных файерболов: Мощь/2 с округлением вверх",
				"humanReadableName": "Fireball (S)",
				"hasTarget": false,
				"sphere": "fighting"
			},
			{
				"id": "input-stream",
				"description": "В течение Мощь*3 минут мана из соседних локаций периодически будет призываться в эту  (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
				"humanReadableName": "InputStream (S)",
				"hasTarget": false,
				"sphere": "astral"
			}
		],
		"activeAbilities": [
			{
				"id": "i-shall-pass",
				"humanReadableName": "ДУХ: I shall pass",
				"description": "Активация дает возможность тихо открыть один замок за 1 минуту - все это время надо держаться рукой за сертификат замка.\nКулдаун 5 минут",
				"target": "scan",
				"targetsSignature": [],
				"cooldownMinutes": 0,
				"cooldownUntil": 0
			}
		],
		"passiveAbilities": [
			{
				"id": "meta-norm",
				"humanReadableName": "Норм",
				"description": "Ты норм. Самый обычный Sapiens, как и миллионы других.",
				"modifierIds": []
			},
			{
				"id": "feel-matrix",
				"humanReadableName": "Чувство Матрицы",
				"description": "Ты чувствуешь матрицу. Устойчивость к фейдингу техноманта, у декера уменьшается время входа на хоcт.",
				"modifierIds": [
					"ckv30mdu5000a01wd317kcdxt",
					"ckv30mduo000b01wd8gv03cd4"
				]
			},
			{
				"id": "chem-weak",
				"humanReadableName": "Слабость к препаратам",
				"description": "Для воздействия препарата достаточно уменьшенной дозы. Аккуратно!",
				"modifierIds": [
					"ckv30mduo000c01wd1ydp3v38",
					"ckv30mduo000d01wdbcg0do1v",
					"ckv30mduo000e01wd45pd7yd5",
					"ckv30mduo000f01wd1la4c07c"
				]
			},
			{
				"id": "arch-mage",
				"humanReadableName": "Архетип: Маг",
				"description": "Маг, повелитель заклинаний!",
				"modifierIds": [
					"ckv30ozrm000g01wd9m8c7oe4"
				]
			},
			{
				"id": "nice-suit",
				"humanReadableName": "Nice suit (P)",
				"description": "Увеличивает продолжительность призыва духа на 30 минут",
				"modifierIds": []
			},
			{
				"id": "leisure-suit",
				"humanReadableName": "Leisure suit (P)",
				"description": "Увеличивает продолжительность призыва духа еще на 30 минут",
				"modifierIds": []
			},
			{
				"id": "suit-up",
				"humanReadableName": "Suit Up (P)",
				"description": "Даёт возможность временно надеть тело духа из тотема. Своё мясное тело маг должен оставить в телохранилище. Продолжительность призыва духа - 30 минут. (время может быть увеличено)",
				"modifierIds": []
			},
			{
				"id": "fine-hearing",
				"humanReadableName": "Fine hearing (P)",
				"description": "Ты знаешь, какими способностями обладают духи вокруг тебя",
				"modifierIds": []
			},
			{
				"id": "spirit-master-1",
				"humanReadableName": "Spirit Apprentice (P)",
				"description": "Ты можешь ловить духов 1го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-2",
				"humanReadableName": "Spirit Disciple (P)",
				"description": "Ты можешь ловить духов 2го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-3",
				"humanReadableName": "Spirit Master (P)",
				"description": "Ты можешь ловить духов 3го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-feed",
				"humanReadableName": "Друг духов",
				"description": "Тебе заметно легче ловить духов",
				"modifierIds": [
					"ckv30xwon000h01wd1he1as2t"
				]
			},
			{
				"id": "spirit-known",
				"humanReadableName": "Знакомый духов (P)",
				"description": "Тебе легче ловить духов",
				"modifierIds": []
			},
			{
				"id": "fireball-keeper",
				"humanReadableName": "ДУХ: Fireball - keeper",
				"description": "Можешь кинуть 2 огненных шара. Затем эффект исчерпан до выхода из духа",
				"modifierIds": []
			},
			{
				"id": "magic-1",
				"humanReadableName": "Магия 1 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jus3h000i01wd5agtaj31"
				]
			},
			{
				"id": "magic-2",
				"humanReadableName": "Магия 2 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jutwp000j01wdc8fxax1m"
				]
			},
			{
				"id": "magic-3",
				"humanReadableName": "Магия 3 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juvkw000k01wd5wlshdm8"
				]
			},
			{
				"id": "magic-4",
				"humanReadableName": "Магия 4 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juy6e000l01wdgdtz34gr"
				]
			},
			{
				"id": "magic-5",
				"humanReadableName": "Магия 5 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jv06u000m01wdarmi9ith"
				]
			}
		],
		"implants": [],
		"chemoConsumptionRecords": [],
		"analyzedBody": null,
		"history": [
			{
				"id": "6d545980-dd82-483f-a2fb-61cf1b779fc4",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634946615138
			},
			{
				"id": "e7cebc48-feb1-4940-957d-c4320d4d1a7c",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634946625341
			},
			{
				"id": "18e868ec-db87-4857-8a72-819c71d8a46b",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634953863785
			},
			{
				"id": "9e076772-5a1f-4b31-9e35-ad5871ed6a3f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634953938463
			},
			{
				"id": "57753e71-4327-44f2-9c9d-3df0e2a44622",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957246689
			},
			{
				"id": "049eb826-2f8a-42d9-8f42-46c61ab78b74",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957256485
			},
			{
				"id": "20b4f87c-a7f8-43db-a3b1-24f57388c5cb",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957882816
			},
			{
				"id": "e138de9b-71fb-4c21-849e-6a26288e6265",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957894581
			},
			{
				"id": "60a49d70-1177-48b4-985d-98e9cc224233",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634958035585
			},
			{
				"id": "36becab7-3a2c-42bc-bdd4-172533d7811a",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634958073382
			},
			{
				"id": "3d44b7a3-2d0b-4677-aa7e-c83b84981ac0",
				"title": "Голод",
				"shortText": "Вы потеряли сознание от голода. Тяжелое ранение.",
				"longText": "",
				"timestamp": 1634989177253
			},
			{
				"id": "c3e858d5-5f47-438f-8544-19d367d6537e",
				"title": "Ранение",
				"shortText": "Вы в состоянии клинической смерти",
				"longText": "",
				"timestamp": 1634990977253
			},
			{
				"id": "75b88fa2-85b1-46a1-acf2-f318b181cd0d",
				"title": "Лечение",
				"shortText": "Хиты полностью восстановлены",
				"longText": "Вы полностью здоровы. Ура!",
				"timestamp": 1635033418253
			},
			{
				"id": "0363deba-ba16-4dbf-8a40-88aff38cd7aa",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1635035879611
			}
		],
		"magicStats": {
			"feedbackMultiplier": 1,
			"recoverySpeedMultiplier": 1,
			"spiritResistanceMultiplier": 1,
			"auraReadingMultiplier": 1,
			"auraMarkMultiplier": 1,
			"auraMask": 0,
			"aura": "ecjerjbhcwbrgixrqzjg",
			"maxPowerBonus": 0,
			"victimCoefficient": 1,
			"participantCoefficient": 1
		},
		"hacking": {
			"maxTimeAtHost": 30,
			"hostEntrySpeed": 8,
			"conversionAttack": 0,
			"conversionFirewall": 0,
			"conversionSleaze": 0,
			"conversionDataprocessing": 0,
			"fadingResistance": 0,
			"biofeedbackResistance": 0,
			"adminHostNumber": 3,
			"spriteLevel": 0,
			"resonanceForControlBonus": 0,
			"varianceResistance": 0,
			"compilationFadingResistance": 0,
			"additionalRequests": 0,
			"additionalSprites": 0,
			"additionalBackdoors": 0,
			"backdoorTtl": 120,
			"jackedIn": false,
			"fading": 0,
			"fadingDecrease": 0
		},
		"drones": {
			"maxDifficulty": -1000,
			"maxTimeInside": 0,
			"recoveryTime": 120,
			"medicraftBonus": 1,
			"autodocBonus": 1,
			"aircraftBonus": 2,
			"groundcraftBonus": 2,
			"feedbackModifier": 0,
			"recoverySkill": 0
		},
		"chemo": {
			"baseEffectThreshold": 200,
			"uberEffectThreshold": 250,
			"superEffectThreshold": 300,
			"crysisThreshold": 400,
			"sensitivity": 280,
			"concentration": {
				"teqgel": 0,
				"iodine": 0,
				"argon": 0,
				"radium": 0,
				"junius": 0,
				"custodium": 0,
				"polonium": 0,
				"silicon": 0,
				"magnium": 0,
				"chromium": 0,
				"opium": 0,
				"elba": 0,
				"barium": 0,
				"uranium": 0,
				"moscovium": 0,
				"iconium": 0,
				"vampirium": 0
			}
		},
		"billing": {
			"anonymous": false,
			"stockGainPercentage": 0
		},
		"discounts": {
			"weaponsArmor": 1,
			"everything": 1
		},
		"screens": {
			"billing": true,
			"spellbook": true,
			"activeAbilities": true,
			"passiveAbilities": true,
			"karma": true,
			"implants": true,
			"autodoc": false,
			"autodocWoundHeal": true,
			"autodocImplantInstall": false,
			"autodocImplantRemoval": false,
			"ethics": true,
			"location": false,
			"wound": true,
			"scanQr": true,
			"scoring": false
		},
		"ethic": {
			"groups": [],
			"state": [
				{
					"scale": "violence",
					"value": 0,
					"description": "За добро платит добром, за зло - по справедливости"
				},
				{
					"scale": "control",
					"value": 0,
					"description": "Свобода выбора обязует принять его последствия"
				},
				{
					"scale": "individualism",
					"value": 0,
					"description": "Своя рубашка ближе к телу"
				},
				{
					"scale": "mind",
					"value": 0,
					"description": "Равновесие - основа душевного здоровья"
				}
			],
			"trigger": [
				{
					"id": "30df06ca-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Нельзя упускать свою выгоду. Так называемые милосердие и насилие - лишь средства ее получить"
				},
				{
					"id": "30df06cb-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили тому, кто сильнее вас"
				},
				{
					"id": "30df06cc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились тому, кто слабее вас"
				},
				{
					"id": "30df06e3-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "И покорность, и бунт хороши, если пополняют твой счет. И плохи в обратном случае."
				},
				{
					"id": "30df06e4-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы выполнили просьбу, которую не были обязаны выполнять"
				},
				{
					"id": "30df06e5-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы отказались выполнять требование, которое были обязаны выполнить"
				},
				{
					"id": "30df06fc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Принадлежность к сообществу или самостоятельность хороши, только если это выгодно"
				},
				{
					"id": "30df06fd-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили общему решению вашей группы"
				},
				{
					"id": "30df06fe-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились общему решению вашей группы"
				},
				{
					"id": "30df0715-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Поверяйте решения рассудка чувством, а стремления чувств рассудком"
				},
				{
					"id": "30df0716-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Ваше рассуждение убедило собеседника"
				},
				{
					"id": "30df0717-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы публично прокомментировали эмоционально задевшую вас медиа-публикацию"
				}
			],
			"lockedUntil": 0
		},
		"rigging": {
			"canWorkWithBioware": false,
			"implantsBonus": 2,
			"tuningBonus": 2,
			"repomanBonus": 2
		},
		"essenceDetails": {
			"max": 600,
			"used": 0,
			"gap": 0
		},
		"karma": {
			"available": 0,
			"spent": 0,
			"spentOnPassives": 0,
			"cycleLimit": 100,
			"gameLimit": 500
		}
	},
	"workModel": {
		"modelId": "51935",
		"timestamp": 1635036065017,
		"modifiers": [
			{
				"mID": "_system",
				"priority": 3,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "systemEssenceEffect"
					},
					{
						"enabled": true,
						"type": "normal",
						"handler": "jackedInEffect"
					}
				]
			},
			{
				"mID": "_limiter",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "clampAttributes"
					}
				]
			},
			{
				"mID": "_cooldown_calculator",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "calculateCooldowns"
					}
				]
			},
			{
				"amount": 1,
				"mID": "ckv30mdu5000a01wd317kcdxt",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseFadingResistance"
					}
				]
			},
			{
				"amount": -1,
				"mID": "ckv30mduo000b01wd8gv03cd4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseHostEntrySpeed"
					}
				]
			},
			{
				"amount": -40,
				"mID": "ckv30mduo000c01wd1ydp3v38",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoBaseEffectThreshold"
					}
				]
			},
			{
				"amount": -30,
				"mID": "ckv30mduo000d01wdbcg0do1v",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoUberEffectThreshold"
					}
				]
			},
			{
				"amount": -20,
				"mID": "ckv30mduo000e01wd45pd7yd5",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoSuperEffectThreshold"
					}
				]
			},
			{
				"amount": -60,
				"mID": "ckv30mduo000f01wd1la4c07c",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoCrysisThreshold"
					}
				]
			},
			{
				"amount": 2,
				"mID": "ckv30ozrm000g01wd9m8c7oe4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseMagic"
					}
				]
			},
			{
				"amount": 0.8,
				"mID": "ckv30xwon000h01wd1he1as2t",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "multiplySpiritResistanceMultiplier"
					}
				]
			},
			{
				"mID": "in-the-spirit",
				"priority": 5,
				"enabled": true,
				"effects": [
					{
						"type": "functional",
						"handler": "inTheSpirit",
						"enabled": true
					}
				],
				"name": "fireball-keeper--tXBPiWo5I",
				"hp": 3,
				"abilityIds": [
					"fireball-keeper",
					"i-shall-pass"
				],
				"bodyStorageId": "367",
				"qrCodeId": "359",
				"spiritId": 382,
				"postSpiritDamage": 0,
				"stage": 0
			}
		],
		"timers": [
			{
				"name": "normal-hunger",
				"description": "Голодный обморок",
				"miliseconds": 40553236,
				"eventType": "hungerStage1",
				"data": {}
			},
			{
				"name": "normal-hunger-reminder",
				"description": "Напоминание о том, что нужно поесть",
				"miliseconds": 36953236,
				"eventType": "hungerReminder",
				"data": {}
			},
			{
				"name": "give-karma-for-passives",
				"description": "Начисление кармы за все ваши способности",
				"miliseconds": 3512236,
				"eventType": "giveKarmaForPassiveAbilities",
				"data": {}
			},
			{
				"name": "decrease-current-fading",
				"description": "Уменьшение фейдинга (при наличии абилок)",
				"miliseconds": 32236,
				"eventType": "decreaseCurrentFading",
				"data": {}
			}
		],
		"name": "fireball-keeper--tXBPiWo5I",
		"currentBody": "ectoplasm",
		"maxHp": 3,
		"healthState": "healthy",
		"metarace": "meta-norm",
		"body": 1,
		"strength": 1,
		"depth": 1,
		"intelligence": 1,
		"charisma": 1,
		"essence": 600,
		"mentalAttackBonus": 0,
		"mentalDefenceBonus": 0,
		"mentalQrId": 61935,
		"magic": 3,
		"resonance": 1,
		"matrixHp": 1,
		"maxTimeInVr": 60,
		"cooldownCoefficient": 1,
		"victimCoefficient": 1,
		"participantCoefficient": 1,
		"implantsBodySlots": 2,
		"implantsRemovalResistance": 0,
		"spells": [
			{
				"id": "spirit-catcher",
				// "description": "В течение Мощь*2 минут можно три раза попытаться поймать духа. С увеличением Мощи растут и шансы на поимку",
				// "humanReadableName": "Spirit catcher (S)",
				// "hasTarget": false,
				// "sphere": "stats"
			},
			{
				"id": "fireball",
				"description": "У мага на Мощь*4 минуты появляется пассивная способность Fireball-Эффект, позволяющая кидать файерболы. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных файерболов: Мощь/2 с округлением вверх",
				"humanReadableName": "Fireball (S)",
				"hasTarget": false,
				"sphere": "fighting"
			},
			{
				"id": "input-stream",
				"description": "В течение Мощь*3 минут мана из соседних локаций периодически будет призываться в эту  (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
				"humanReadableName": "InputStream (S)",
				"hasTarget": false,
				"sphere": "astral"
			}
		],
		"activeAbilities": [
			{
				"id": "i-shall-pass",
				// "humanReadableName": "ДУХ: I shall pass",
				// "description": "Активация дает возможность тихо открыть один замок за 1 минуту - все это время надо держаться рукой за сертификат замка.\nКулдаун 5 минут",
				// "target": "scan",
				// "targetsSignature": [],
				// "cooldownMinutes": 5,
				// "cooldownUntil": 0
			}
		],
		"passiveAbilities": [
			{
				"id": "meta-norm",
				"humanReadableName": "Норм",
				"description": "Ты норм. Самый обычный Sapiens, как и миллионы других.",
				"modifierIds": []
			},
			{
				"id": "feel-matrix",
				// "humanReadableName": "Чувство Матрицы",
				// "description": "Ты чувствуешь матрицу. Устойчивость к фейдингу техноманта, у декера уменьшается время входа на хоcт.",
				// "modifierIds": [
				// 	"ckv30mdu5000a01wd317kcdxt",
				// 	"ckv30mduo000b01wd8gv03cd4"
				// ]
			},
			{
				"id": "chem-weak",
				"humanReadableName": "Слабость к препаратам",
				"description": "Для воздействия препарата достаточно уменьшенной дозы. Аккуратно!",
				"modifierIds": [
					"ckv30mduo000c01wd1ydp3v38",
					"ckv30mduo000d01wdbcg0do1v",
					"ckv30mduo000e01wd45pd7yd5",
					"ckv30mduo000f01wd1la4c07c"
				]
			},
			{
				"id": "arch-mage",
				"humanReadableName": "Архетип: Маг",
				"description": "Маг, повелитель заклинаний!",
				"modifierIds": [
					"ckv30ozrm000g01wd9m8c7oe4"
				]
			},
			{
				"id": "nice-suit",
				"humanReadableName": "Nice suit (P)",
				"description": "Увеличивает продолжительность призыва духа на 30 минут",
				"modifierIds": []
			},
			{
				"id": "leisure-suit",
				"humanReadableName": "Leisure suit (P)",
				"description": "Увеличивает продолжительность призыва духа еще на 30 минут",
				"modifierIds": []
			},
			{
				"id": "suit-up",
				"humanReadableName": "Suit Up (P)",
				"description": "Даёт возможность временно надеть тело духа из тотема. Своё мясное тело маг должен оставить в телохранилище. Продолжительность призыва духа - 30 минут. (время может быть увеличено)",
				"modifierIds": []
			},
			{
				"id": "fine-hearing",
				"humanReadableName": "Fine hearing (P)",
				"description": "Ты знаешь, какими способностями обладают духи вокруг тебя",
				"modifierIds": []
			},
			{
				"id": "spirit-master-1",
				"humanReadableName": "Spirit Apprentice (P)",
				"description": "Ты можешь ловить духов 1го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-2",
				"humanReadableName": "Spirit Disciple (P)",
				"description": "Ты можешь ловить духов 2го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-3",
				"humanReadableName": "Spirit Master (P)",
				"description": "Ты можешь ловить духов 3го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-feed",
				"humanReadableName": "Друг духов",
				"description": "Тебе заметно легче ловить духов",
				"modifierIds": [
					"ckv30xwon000h01wd1he1as2t"
				]
			},
			{
				"id": "spirit-known",
				"humanReadableName": "Знакомый духов (P)",
				"description": "Тебе легче ловить духов",
				"modifierIds": []
			},
			{
				"id": "fireball-keeper",
				"humanReadableName": "ДУХ: Fireball - keeper",
				"description": "Можешь кинуть 2 огненных шара. Затем эффект исчерпан до выхода из духа",
				"modifierIds": []
			},
			{
				"id": "magic-1",
				"humanReadableName": "Магия 1 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jus3h000i01wd5agtaj31"
				]
			},
			{
				"id": "magic-2",
				"humanReadableName": "Магия 2 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jutwp000j01wdc8fxax1m"
				]
			},
			{
				"id": "magic-3",
				"humanReadableName": "Магия 3 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juvkw000k01wd5wlshdm8"
				]
			},
			{
				"id": "magic-4",
				"humanReadableName": "Магия 4 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juy6e000l01wdgdtz34gr"
				]
			},
			{
				"id": "magic-5",
				"humanReadableName": "Магия 5 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jv06u000m01wdarmi9ith"
				]
			}
		],
		"implants": [],
		"chemoConsumptionRecords": [],
		"analyzedBody": null,
		"history": [
			{
				"id": "6d545980-dd82-483f-a2fb-61cf1b779fc4",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634946615138
			},
			{
				"id": "e7cebc48-feb1-4940-957d-c4320d4d1a7c",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634946625341
			},
			{
				"id": "18e868ec-db87-4857-8a72-819c71d8a46b",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634953863785
			},
			{
				"id": "9e076772-5a1f-4b31-9e35-ad5871ed6a3f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634953938463
			},
			{
				"id": "57753e71-4327-44f2-9c9d-3df0e2a44622",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957246689
			},
			{
				"id": "049eb826-2f8a-42d9-8f42-46c61ab78b74",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957256485
			},
			{
				"id": "20b4f87c-a7f8-43db-a3b1-24f57388c5cb",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957882816
			},
			{
				"id": "e138de9b-71fb-4c21-849e-6a26288e6265",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957894581
			},
			{
				"id": "60a49d70-1177-48b4-985d-98e9cc224233",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634958035585
			},
			{
				"id": "36becab7-3a2c-42bc-bdd4-172533d7811a",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634958073382
			},
			{
				"id": "3d44b7a3-2d0b-4677-aa7e-c83b84981ac0",
				"title": "Голод",
				"shortText": "Вы потеряли сознание от голода. Тяжелое ранение.",
				"longText": "",
				"timestamp": 1634989177253
			},
			{
				"id": "c3e858d5-5f47-438f-8544-19d367d6537e",
				"title": "Ранение",
				"shortText": "Вы в состоянии клинической смерти",
				"longText": "",
				"timestamp": 1634990977253
			},
			{
				"id": "75b88fa2-85b1-46a1-acf2-f318b181cd0d",
				"title": "Лечение",
				"shortText": "Хиты полностью восстановлены",
				"longText": "Вы полностью здоровы. Ура!",
				"timestamp": 1635033418253
			},
			{
				"id": "0363deba-ba16-4dbf-8a40-88aff38cd7aa",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1635035879611
			}
		],
		"magicStats": {
			"feedbackMultiplier": 1,
			"recoverySpeedMultiplier": 1,
			"spiritResistanceMultiplier": 0.8,
			"auraReadingMultiplier": 1,
			"auraMarkMultiplier": 1,
			"auraMask": 0,
			"aura": "ecjerjbhcwbrgixrqzjg",
			"maxPowerBonus": 0,
			"victimCoefficient": 1,
			"participantCoefficient": 1
		},
		"hacking": {
			"maxTimeAtHost": 30,
			"hostEntrySpeed": 7,
			"conversionAttack": 0,
			"conversionFirewall": 0,
			"conversionSleaze": 0,
			"conversionDataprocessing": 0,
			"fadingResistance": 1,
			"biofeedbackResistance": 0,
			"adminHostNumber": 3,
			"spriteLevel": 0,
			"resonanceForControlBonus": 0,
			"varianceResistance": 0,
			"compilationFadingResistance": 0,
			"additionalRequests": 0,
			"additionalSprites": 0,
			"additionalBackdoors": 0,
			"backdoorTtl": 120,
			"jackedIn": false,
			"fading": 0,
			"fadingDecrease": 0
		},
		"drones": {
			"maxDifficulty": -1000,
			"maxTimeInside": 6,
			"recoveryTime": 120,
			"medicraftBonus": 1,
			"autodocBonus": 1,
			"aircraftBonus": 2,
			"groundcraftBonus": 2,
			"feedbackModifier": 0,
			"recoverySkill": 0
		},
		"chemo": {
			"baseEffectThreshold": 160,
			"uberEffectThreshold": 220,
			"superEffectThreshold": 280,
			"crysisThreshold": 340,
			"sensitivity": 280,
			"concentration": {
				"teqgel": 0,
				"iodine": 0,
				"argon": 0,
				"radium": 0,
				"junius": 0,
				"custodium": 0,
				"polonium": 0,
				"silicon": 0,
				"magnium": 0,
				"chromium": 0,
				"opium": 0,
				"elba": 0,
				"barium": 0,
				"uranium": 0,
				"moscovium": 0,
				"iconium": 0,
				"vampirium": 0
			}
		},
		"billing": {
			"anonymous": false,
			"stockGainPercentage": 0
		},
		"discounts": {
			"weaponsArmor": 1,
			"everything": 1
		},
		"screens": {
			"billing": false,
			"spellbook": false,
			"activeAbilities": true,
			"passiveAbilities": true,
			"karma": false,
			"implants": false,
			"autodoc": false,
			"autodocWoundHeal": true,
			"autodocImplantInstall": false,
			"autodocImplantRemoval": false,
			"ethics": false,
			"location": false,
			"wound": true,
			"scanQr": true,
			"scoring": false
		},
		"ethic": {
			"groups": [],
			"state": [
				{
					"scale": "violence",
					"value": 0,
					"description": "За добро платит добром, за зло - по справедливости"
				},
				{
					"scale": "control",
					"value": 0,
					"description": "Свобода выбора обязует принять его последствия"
				},
				{
					"scale": "individualism",
					"value": 0,
					"description": "Своя рубашка ближе к телу"
				},
				{
					"scale": "mind",
					"value": 0,
					"description": "Равновесие - основа душевного здоровья"
				}
			],
			"trigger": [
				{
					"id": "30df06ca-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Нельзя упускать свою выгоду. Так называемые милосердие и насилие - лишь средства ее получить"
				},
				{
					"id": "30df06cb-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили тому, кто сильнее вас"
				},
				{
					"id": "30df06cc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились тому, кто слабее вас"
				},
				{
					"id": "30df06e3-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "И покорность, и бунт хороши, если пополняют твой счет. И плохи в обратном случае."
				},
				{
					"id": "30df06e4-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы выполнили просьбу, которую не были обязаны выполнять"
				},
				{
					"id": "30df06e5-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы отказались выполнять требование, которое были обязаны выполнить"
				},
				{
					"id": "30df06fc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Принадлежность к сообществу или самостоятельность хороши, только если это выгодно"
				},
				{
					"id": "30df06fd-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили общему решению вашей группы"
				},
				{
					"id": "30df06fe-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились общему решению вашей группы"
				},
				{
					"id": "30df0715-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Поверяйте решения рассудка чувством, а стремления чувств рассудком"
				},
				{
					"id": "30df0716-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Ваше рассуждение убедило собеседника"
				},
				{
					"id": "30df0717-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы публично прокомментировали эмоционально задевшую вас медиа-публикацию"
				}
			],
			"lockedUntil": 0
		},
		"rigging": {
			"canWorkWithBioware": false,
			"implantsBonus": 2,
			"tuningBonus": 2,
			"repomanBonus": 2
		},
		"essenceDetails": {
			"max": 600,
			"used": 0,
			"gap": 0
		},
		"karma": {
			"available": 0,
			"spent": 0,
			"spentOnPassives": 0,
			"cycleLimit": 100,
			"gameLimit": 500
		}
	},
	"notifications": [],
	"outboundEvents": [],
	"pubSubNotifications": [],
	"spiritSuitState": {
		"status": "Suited",
		"message": null,
		"spiritId": 382,
		"spiritName": "fireball-keeper--tXBPiWo5I",
		"suitStatus": "normal",
		"characterId": 51935,
		"suitDuration": 5400000,
		"bodyStorageId": 367,
		"suitStartTime": 1635035879706,
		"suitStatusChangeTime": -1
	},
	"messageData": {
		"timestamp": 1635035880154,
		"message": ""
	}
} as CharacterModelData;

export const dispiritCharacter = {
	"baseModel": {
		"modelId": "51935",
		"timestamp": 1635036538311,
		"modifiers": [
			{
				"mID": "_system",
				"priority": 3,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "systemEssenceEffect"
					},
					{
						"enabled": true,
						"type": "normal",
						"handler": "jackedInEffect"
					}
				]
			},
			{
				"mID": "_limiter",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "clampAttributes"
					}
				]
			},
			{
				"mID": "_cooldown_calculator",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "calculateCooldowns"
					}
				]
			},
			{
				"amount": 1,
				"mID": "ckv30mdu5000a01wd317kcdxt",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseFadingResistance"
					}
				]
			},
			{
				"amount": -1,
				"mID": "ckv30mduo000b01wd8gv03cd4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseHostEntrySpeed"
					}
				]
			},
			{
				"amount": -40,
				"mID": "ckv30mduo000c01wd1ydp3v38",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoBaseEffectThreshold"
					}
				]
			},
			{
				"amount": -30,
				"mID": "ckv30mduo000d01wdbcg0do1v",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoUberEffectThreshold"
					}
				]
			},
			{
				"amount": -20,
				"mID": "ckv30mduo000e01wd45pd7yd5",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoSuperEffectThreshold"
					}
				]
			},
			{
				"amount": -60,
				"mID": "ckv30mduo000f01wd1la4c07c",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoCrysisThreshold"
					}
				]
			},
			{
				"amount": 2,
				"mID": "ckv30ozrm000g01wd9m8c7oe4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseMagic"
					}
				]
			},
			{
				"amount": 0.8,
				"mID": "ckv30xwon000h01wd1he1as2t",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "multiplySpiritResistanceMultiplier"
					}
				]
			}
		],
		"timers": [
			{
				"name": "normal-hunger",
				"description": "Голодный обморок",
				"miliseconds": 40079942,
				"eventType": "hungerStage1",
				"data": {}
			},
			{
				"name": "normal-hunger-reminder",
				"description": "Напоминание о том, что нужно поесть",
				"miliseconds": 36479942,
				"eventType": "hungerReminder",
				"data": {}
			},
			{
				"name": "give-karma-for-passives",
				"description": "Начисление кармы за все ваши способности",
				"miliseconds": 3038942,
				"eventType": "giveKarmaForPassiveAbilities",
				"data": {}
			},
			{
				"name": "decrease-current-fading",
				"description": "Уменьшение фейдинга (при наличии абилок)",
				"miliseconds": 38942,
				"eventType": "decreaseCurrentFading",
				"data": {}
			}
		],
		"name": "ТестПер",
		"currentBody": "physical",
		"maxHp": 2,
		"healthState": "healthy",
		"metarace": "meta-norm",
		"body": 1,
		"strength": 1,
		"depth": 1,
		"intelligence": 1,
		"charisma": 1,
		"essence": 0,
		"mentalAttackBonus": 0,
		"mentalDefenceBonus": 0,
		"mentalQrId": 61935,
		"magic": 1,
		"resonance": 1,
		"matrixHp": 1,
		"maxTimeInVr": 60,
		"cooldownCoefficient": 1,
		"victimCoefficient": 1,
		"participantCoefficient": 1,
		"implantsBodySlots": 2,
		"implantsRemovalResistance": 0,
		"spells": [
			{
				"id": "spirit-catcher",
				"description": "В течение Мощь*2 минут можно три раза попытаться поймать духа. С увеличением Мощи растут и шансы на поимку",
				"humanReadableName": "Spirit catcher (S)",
				"hasTarget": false,
				"sphere": "stats"
			},
			{
				"id": "fireball",
				"description": "У мага на Мощь*4 минуты появляется пассивная способность Fireball-Эффект, позволяющая кидать файерболы. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных файерболов: Мощь/2 с округлением вверх",
				"humanReadableName": "Fireball (S)",
				"hasTarget": false,
				"sphere": "fighting"
			},
			{
				"id": "input-stream",
				"description": "В течение Мощь*3 минут мана из соседних локаций периодически будет призываться в эту  (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
				"humanReadableName": "InputStream (S)",
				"hasTarget": false,
				"sphere": "astral"
			}
		],
		"activeAbilities": [],
		"passiveAbilities": [
			{
				"id": "meta-norm",
				"humanReadableName": "Норм",
				"description": "Ты норм. Самый обычный Sapiens, как и миллионы других.",
				"modifierIds": []
			},
			{
				"id": "feel-matrix",
				"humanReadableName": "Чувство Матрицы",
				"description": "Ты чувствуешь матрицу. Устойчивость к фейдингу техноманта, у декера уменьшается время входа на хоcт.",
				"modifierIds": [
					"ckv30mdu5000a01wd317kcdxt",
					"ckv30mduo000b01wd8gv03cd4"
				]
			},
			{
				"id": "chem-weak",
				"humanReadableName": "Слабость к препаратам",
				"description": "Для воздействия препарата достаточно уменьшенной дозы. Аккуратно!",
				"modifierIds": [
					"ckv30mduo000c01wd1ydp3v38",
					"ckv30mduo000d01wdbcg0do1v",
					"ckv30mduo000e01wd45pd7yd5",
					"ckv30mduo000f01wd1la4c07c"
				]
			},
			{
				"id": "arch-mage",
				"humanReadableName": "Архетип: Маг",
				"description": "Маг, повелитель заклинаний!",
				"modifierIds": [
					"ckv30ozrm000g01wd9m8c7oe4"
				]
			},
			{
				"id": "nice-suit",
				"humanReadableName": "Nice suit (P)",
				"description": "Увеличивает продолжительность призыва духа на 30 минут",
				"modifierIds": []
			},
			{
				"id": "leisure-suit",
				"humanReadableName": "Leisure suit (P)",
				"description": "Увеличивает продолжительность призыва духа еще на 30 минут",
				"modifierIds": []
			},
			{
				"id": "suit-up",
				"humanReadableName": "Suit Up (P)",
				"description": "Даёт возможность временно надеть тело духа из тотема. Своё мясное тело маг должен оставить в телохранилище. Продолжительность призыва духа - 30 минут. (время может быть увеличено)",
				"modifierIds": []
			},
			{
				"id": "fine-hearing",
				"humanReadableName": "Fine hearing (P)",
				"description": "Ты знаешь, какими способностями обладают духи вокруг тебя",
				"modifierIds": []
			},
			{
				"id": "spirit-master-1",
				"humanReadableName": "Spirit Apprentice (P)",
				"description": "Ты можешь ловить духов 1го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-2",
				"humanReadableName": "Spirit Disciple (P)",
				"description": "Ты можешь ловить духов 2го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-3",
				"humanReadableName": "Spirit Master (P)",
				"description": "Ты можешь ловить духов 3го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-feed",
				"humanReadableName": "Друг духов",
				"description": "Тебе заметно легче ловить духов",
				"modifierIds": [
					"ckv30xwon000h01wd1he1as2t"
				]
			},
			{
				"id": "spirit-known",
				"humanReadableName": "Знакомый духов (P)",
				"description": "Тебе легче ловить духов",
				"modifierIds": []
			},
			{
				"id": "magic-1",
				"humanReadableName": "Магия 1 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jus3h000i01wd5agtaj31"
				]
			},
			{
				"id": "magic-2",
				"humanReadableName": "Магия 2 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jutwp000j01wdc8fxax1m"
				]
			},
			{
				"id": "magic-3",
				"humanReadableName": "Магия 3 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juvkw000k01wd5wlshdm8"
				]
			},
			{
				"id": "magic-4",
				"humanReadableName": "Магия 4 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juy6e000l01wdgdtz34gr"
				]
			},
			{
				"id": "magic-5",
				"humanReadableName": "Магия 5 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jv06u000m01wdarmi9ith"
				]
			}
		],
		"implants": [],
		"chemoConsumptionRecords": [],
		"analyzedBody": null,
		"history": [
			{
				"id": "6d545980-dd82-483f-a2fb-61cf1b779fc4",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634946615138
			},
			{
				"id": "e7cebc48-feb1-4940-957d-c4320d4d1a7c",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634946625341
			},
			{
				"id": "18e868ec-db87-4857-8a72-819c71d8a46b",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634953863785
			},
			{
				"id": "9e076772-5a1f-4b31-9e35-ad5871ed6a3f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634953938463
			},
			{
				"id": "57753e71-4327-44f2-9c9d-3df0e2a44622",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957246689
			},
			{
				"id": "049eb826-2f8a-42d9-8f42-46c61ab78b74",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957256485
			},
			{
				"id": "20b4f87c-a7f8-43db-a3b1-24f57388c5cb",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957882816
			},
			{
				"id": "e138de9b-71fb-4c21-849e-6a26288e6265",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957894581
			},
			{
				"id": "60a49d70-1177-48b4-985d-98e9cc224233",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634958035585
			},
			{
				"id": "36becab7-3a2c-42bc-bdd4-172533d7811a",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634958073382
			},
			{
				"id": "3d44b7a3-2d0b-4677-aa7e-c83b84981ac0",
				"title": "Голод",
				"shortText": "Вы потеряли сознание от голода. Тяжелое ранение.",
				"longText": "",
				"timestamp": 1634989177253
			},
			{
				"id": "c3e858d5-5f47-438f-8544-19d367d6537e",
				"title": "Ранение",
				"shortText": "Вы в состоянии клинической смерти",
				"longText": "",
				"timestamp": 1634990977253
			},
			{
				"id": "75b88fa2-85b1-46a1-acf2-f318b181cd0d",
				"title": "Лечение",
				"shortText": "Хиты полностью восстановлены",
				"longText": "Вы полностью здоровы. Ура!",
				"timestamp": 1635033418253
			},
			{
				"id": "0363deba-ba16-4dbf-8a40-88aff38cd7aa",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1635035879611
			},
			{
				"id": "84f5ccf3-f3ad-468d-9c7e-bfa86d577b80",
				"title": "Эктоплазма разрушается",
				"shortText": "Вам нужно срочно вернуться в мясное тело, иначе через 10 минут наступит клиническая смерть",
				"longText": "",
				"timestamp": 1635036306989
			},
			{
				"id": "6ccfd979-d646-45cf-8b1d-b82948d29f9f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1635036478580
			}
		],
		"magicStats": {
			"feedbackMultiplier": 1,
			"recoverySpeedMultiplier": 1,
			"spiritResistanceMultiplier": 1,
			"auraReadingMultiplier": 1,
			"auraMarkMultiplier": 1,
			"auraMask": 0,
			"aura": "ecjerjbhcwbrgixrqzjg",
			"maxPowerBonus": 0,
			"victimCoefficient": 1,
			"participantCoefficient": 1
		},
		"hacking": {
			"maxTimeAtHost": 30,
			"hostEntrySpeed": 8,
			"conversionAttack": 0,
			"conversionFirewall": 0,
			"conversionSleaze": 0,
			"conversionDataprocessing": 0,
			"fadingResistance": 0,
			"biofeedbackResistance": 0,
			"adminHostNumber": 3,
			"spriteLevel": 0,
			"resonanceForControlBonus": 0,
			"varianceResistance": 0,
			"compilationFadingResistance": 0,
			"additionalRequests": 0,
			"additionalSprites": 0,
			"additionalBackdoors": 0,
			"backdoorTtl": 120,
			"jackedIn": false,
			"fading": 0,
			"fadingDecrease": 0
		},
		"drones": {
			"maxDifficulty": -1000,
			"maxTimeInside": 0,
			"recoveryTime": 120,
			"medicraftBonus": 1,
			"autodocBonus": 1,
			"aircraftBonus": 2,
			"groundcraftBonus": 2,
			"feedbackModifier": 0,
			"recoverySkill": 0
		},
		"chemo": {
			"baseEffectThreshold": 200,
			"uberEffectThreshold": 250,
			"superEffectThreshold": 300,
			"crysisThreshold": 400,
			"sensitivity": 280,
			"concentration": {
				"teqgel": 0,
				"iodine": 0,
				"argon": 0,
				"radium": 0,
				"junius": 0,
				"custodium": 0,
				"polonium": 0,
				"silicon": 0,
				"magnium": 0,
				"chromium": 0,
				"opium": 0,
				"elba": 0,
				"barium": 0,
				"uranium": 0,
				"moscovium": 0,
				"iconium": 0,
				"vampirium": 0
			}
		},
		"billing": {
			"anonymous": false,
			"stockGainPercentage": 0
		},
		"discounts": {
			"weaponsArmor": 1,
			"everything": 1
		},
		"screens": {
			"billing": true,
			"spellbook": true,
			"activeAbilities": true,
			"passiveAbilities": true,
			"karma": true,
			"implants": true,
			"autodoc": false,
			"autodocWoundHeal": true,
			"autodocImplantInstall": false,
			"autodocImplantRemoval": false,
			"ethics": true,
			"location": false,
			"wound": true,
			"scanQr": true,
			"scoring": false
		},
		"ethic": {
			"groups": [],
			"state": [
				{
					"scale": "violence",
					"value": 0,
					"description": "За добро платит добром, за зло - по справедливости"
				},
				{
					"scale": "control",
					"value": 0,
					"description": "Свобода выбора обязует принять его последствия"
				},
				{
					"scale": "individualism",
					"value": 0,
					"description": "Своя рубашка ближе к телу"
				},
				{
					"scale": "mind",
					"value": 0,
					"description": "Равновесие - основа душевного здоровья"
				}
			],
			"trigger": [
				{
					"id": "30df06ca-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Нельзя упускать свою выгоду. Так называемые милосердие и насилие - лишь средства ее получить"
				},
				{
					"id": "30df06cb-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили тому, кто сильнее вас"
				},
				{
					"id": "30df06cc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились тому, кто слабее вас"
				},
				{
					"id": "30df06e3-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "И покорность, и бунт хороши, если пополняют твой счет. И плохи в обратном случае."
				},
				{
					"id": "30df06e4-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы выполнили просьбу, которую не были обязаны выполнять"
				},
				{
					"id": "30df06e5-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы отказались выполнять требование, которое были обязаны выполнить"
				},
				{
					"id": "30df06fc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Принадлежность к сообществу или самостоятельность хороши, только если это выгодно"
				},
				{
					"id": "30df06fd-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили общему решению вашей группы"
				},
				{
					"id": "30df06fe-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились общему решению вашей группы"
				},
				{
					"id": "30df0715-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Поверяйте решения рассудка чувством, а стремления чувств рассудком"
				},
				{
					"id": "30df0716-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Ваше рассуждение убедило собеседника"
				},
				{
					"id": "30df0717-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы публично прокомментировали эмоционально задевшую вас медиа-публикацию"
				}
			],
			"lockedUntil": 0
		},
		"rigging": {
			"canWorkWithBioware": false,
			"implantsBonus": 2,
			"tuningBonus": 2,
			"repomanBonus": 2
		},
		"essenceDetails": {
			"max": 600,
			"used": 0,
			"gap": 0
		},
		"karma": {
			"available": 0,
			"spent": 0,
			"spentOnPassives": 0,
			"cycleLimit": 100,
			"gameLimit": 500
		}
	},
	"workModel": {
		"modelId": "51935",
		"timestamp": 1635036538311,
		"modifiers": [
			{
				"mID": "_system",
				"priority": 3,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "systemEssenceEffect"
					},
					{
						"enabled": true,
						"type": "normal",
						"handler": "jackedInEffect"
					}
				]
			},
			{
				"mID": "_limiter",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "clampAttributes"
					}
				]
			},
			{
				"mID": "_cooldown_calculator",
				"priority": 9,
				"enabled": true,
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "calculateCooldowns"
					}
				]
			},
			{
				"amount": 1,
				"mID": "ckv30mdu5000a01wd317kcdxt",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseFadingResistance"
					}
				]
			},
			{
				"amount": -1,
				"mID": "ckv30mduo000b01wd8gv03cd4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseHostEntrySpeed"
					}
				]
			},
			{
				"amount": -40,
				"mID": "ckv30mduo000c01wd1ydp3v38",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoBaseEffectThreshold"
					}
				]
			},
			{
				"amount": -30,
				"mID": "ckv30mduo000d01wdbcg0do1v",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoUberEffectThreshold"
					}
				]
			},
			{
				"amount": -20,
				"mID": "ckv30mduo000e01wd45pd7yd5",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoSuperEffectThreshold"
					}
				]
			},
			{
				"amount": -60,
				"mID": "ckv30mduo000f01wd1la4c07c",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseСhemoCrysisThreshold"
					}
				]
			},
			{
				"amount": 2,
				"mID": "ckv30ozrm000g01wd9m8c7oe4",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "increaseMagic"
					}
				]
			},
			{
				"amount": 0.8,
				"mID": "ckv30xwon000h01wd1he1as2t",
				"priority": 5,
				"enabled": true,
				"class": "",
				"effects": [
					{
						"enabled": true,
						"type": "normal",
						"handler": "multiplySpiritResistanceMultiplier"
					}
				]
			}
		],
		"timers": [
			{
				"name": "normal-hunger",
				"description": "Голодный обморок",
				"miliseconds": 40079942,
				"eventType": "hungerStage1",
				"data": {}
			},
			{
				"name": "normal-hunger-reminder",
				"description": "Напоминание о том, что нужно поесть",
				"miliseconds": 36479942,
				"eventType": "hungerReminder",
				"data": {}
			},
			{
				"name": "give-karma-for-passives",
				"description": "Начисление кармы за все ваши способности",
				"miliseconds": 3038942,
				"eventType": "giveKarmaForPassiveAbilities",
				"data": {}
			},
			{
				"name": "decrease-current-fading",
				"description": "Уменьшение фейдинга (при наличии абилок)",
				"miliseconds": 38942,
				"eventType": "decreaseCurrentFading",
				"data": {}
			}
		],
		"name": "ТестПер",
		"currentBody": "physical",
		"maxHp": 2,
		"healthState": "healthy",
		"metarace": "meta-norm",
		"body": 1,
		"strength": 1,
		"depth": 1,
		"intelligence": 1,
		"charisma": 1,
		"essence": 600,
		"mentalAttackBonus": 0,
		"mentalDefenceBonus": 0,
		"mentalQrId": 61935,
		"magic": 3,
		"resonance": 1,
		"matrixHp": 1,
		"maxTimeInVr": 60,
		"cooldownCoefficient": 1,
		"victimCoefficient": 1,
		"participantCoefficient": 1,
		"implantsBodySlots": 2,
		"implantsRemovalResistance": 0,
		"spells": [
			{
				"id": "spirit-catcher",
				// "description": "В течение Мощь*2 минут можно три раза попытаться поймать духа. С увеличением Мощи растут и шансы на поимку",
				// "humanReadableName": "Spirit catcher (S)",
				// "hasTarget": false,
				// "sphere": "stats"
			},
			{
				"id": "fireball",
				"description": "У мага на Мощь*4 минуты появляется пассивная способность Fireball-Эффект, позволяющая кидать файерболы. Файербол должен выглядеть как обшитый мягким теннисный шар с красной лентой, его попадание обрабатывается согласно правилам по боевке (тяжелое магическое оружие). Количество доступных файерболов: Мощь/2 с округлением вверх",
				"humanReadableName": "Fireball (S)",
				"hasTarget": false,
				"sphere": "fighting"
			},
			{
				"id": "input-stream",
				"description": "В течение Мощь*3 минут мана из соседних локаций периодически будет призываться в эту  (с некоторой вероятностью). Чем больше Мощь, тем больше срок и вероятность",
				"humanReadableName": "InputStream (S)",
				"hasTarget": false,
				"sphere": "astral"
			}
		],
		"activeAbilities": [],
    "passiveAbilities": [
			{
				"id": "meta-norm",
				"humanReadableName": "Норм",
				"description": "Ты норм. Самый обычный Sapiens, как и миллионы других.",
				"modifierIds": []
			},
			{
				"id": "feel-matrix",
				// "humanReadableName": "Чувство Матрицы",
				// "description": "Ты чувствуешь матрицу. Устойчивость к фейдингу техноманта, у декера уменьшается время входа на хоcт.",
				// "modifierIds": [
				// 	"ckv30mdu5000a01wd317kcdxt",
				// 	"ckv30mduo000b01wd8gv03cd4"
				// ]
			},
			{
				"id": "chem-weak",
				"humanReadableName": "Слабость к препаратам",
				"description": "Для воздействия препарата достаточно уменьшенной дозы. Аккуратно!",
				"modifierIds": [
					"ckv30mduo000c01wd1ydp3v38",
					"ckv30mduo000d01wdbcg0do1v",
					"ckv30mduo000e01wd45pd7yd5",
					"ckv30mduo000f01wd1la4c07c"
				]
			},
			{
				"id": "arch-mage",
				"humanReadableName": "Архетип: Маг",
				"description": "Маг, повелитель заклинаний!",
				"modifierIds": [
					"ckv30ozrm000g01wd9m8c7oe4"
				]
			},
			{
				"id": "nice-suit",
				"humanReadableName": "Nice suit (P)",
				"description": "Увеличивает продолжительность призыва духа на 30 минут",
				"modifierIds": []
			},
			{
				"id": "leisure-suit",
				"humanReadableName": "Leisure suit (P)",
				"description": "Увеличивает продолжительность призыва духа еще на 30 минут",
				"modifierIds": []
			},
			{
				"id": "suit-up",
				"humanReadableName": "Suit Up (P)",
				"description": "Даёт возможность временно надеть тело духа из тотема. Своё мясное тело маг должен оставить в телохранилище. Продолжительность призыва духа - 30 минут. (время может быть увеличено)",
				"modifierIds": []
			},
			{
				"id": "fine-hearing",
				"humanReadableName": "Fine hearing (P)",
				"description": "Ты знаешь, какими способностями обладают духи вокруг тебя",
				"modifierIds": []
			},
			{
				"id": "spirit-master-1",
				"humanReadableName": "Spirit Apprentice (P)",
				"description": "Ты можешь ловить духов 1го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-2",
				"humanReadableName": "Spirit Disciple (P)",
				"description": "Ты можешь ловить духов 2го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-master-3",
				"humanReadableName": "Spirit Master (P)",
				"description": "Ты можешь ловить духов 3го ранга",
				"modifierIds": []
			},
			{
				"id": "spirit-feed",
				"humanReadableName": "Друг духов",
				"description": "Тебе заметно легче ловить духов",
				"modifierIds": [
					"ckv30xwon000h01wd1he1as2t"
				]
			},
			{
				"id": "spirit-known",
				"humanReadableName": "Знакомый духов (P)",
				"description": "Тебе легче ловить духов",
				"modifierIds": []
			},
			{
				"id": "magic-1",
				"humanReadableName": "Магия 1 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jus3h000i01wd5agtaj31"
				]
			},
			{
				"id": "magic-2",
				"humanReadableName": "Магия 2 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jutwp000j01wdc8fxax1m"
				]
			},
			{
				"id": "magic-3",
				"humanReadableName": "Магия 3 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juvkw000k01wd5wlshdm8"
				]
			},
			{
				"id": "magic-4",
				"humanReadableName": "Магия 4 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4juy6e000l01wdgdtz34gr"
				]
			},
			{
				"id": "magic-5",
				"humanReadableName": "Магия 5 (P)",
				"description": "Перманентно увеличивает твою характеристику Магия на 1",
				"modifierIds": [
					"ckv4jv06u000m01wdarmi9ith"
				]
			}
		],
		"implants": [],
		"chemoConsumptionRecords": [],
		"analyzedBody": null,
		"history": [
			{
				"id": "6d545980-dd82-483f-a2fb-61cf1b779fc4",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634946615138
			},
			{
				"id": "e7cebc48-feb1-4940-957d-c4320d4d1a7c",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634946625341
			},
			{
				"id": "18e868ec-db87-4857-8a72-819c71d8a46b",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634953863785
			},
			{
				"id": "9e076772-5a1f-4b31-9e35-ad5871ed6a3f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634953938463
			},
			{
				"id": "57753e71-4327-44f2-9c9d-3df0e2a44622",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957246689
			},
			{
				"id": "049eb826-2f8a-42d9-8f42-46c61ab78b74",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957256485
			},
			{
				"id": "20b4f87c-a7f8-43db-a3b1-24f57388c5cb",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634957882816
			},
			{
				"id": "e138de9b-71fb-4c21-849e-6a26288e6265",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634957894581
			},
			{
				"id": "60a49d70-1177-48b4-985d-98e9cc224233",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1634958035585
			},
			{
				"id": "36becab7-3a2c-42bc-bdd4-172533d7811a",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1634958073382
			},
			{
				"id": "3d44b7a3-2d0b-4677-aa7e-c83b84981ac0",
				"title": "Голод",
				"shortText": "Вы потеряли сознание от голода. Тяжелое ранение.",
				"longText": "",
				"timestamp": 1634989177253
			},
			{
				"id": "c3e858d5-5f47-438f-8544-19d367d6537e",
				"title": "Ранение",
				"shortText": "Вы в состоянии клинической смерти",
				"longText": "",
				"timestamp": 1634990977253
			},
			{
				"id": "75b88fa2-85b1-46a1-acf2-f318b181cd0d",
				"title": "Лечение",
				"shortText": "Хиты полностью восстановлены",
				"longText": "Вы полностью здоровы. Ура!",
				"timestamp": 1635033418253
			},
			{
				"id": "0363deba-ba16-4dbf-8a40-88aff38cd7aa",
				"title": "Вход в духа",
				"shortText": "Вы вошли в духа fireball-keeper--tXBPiWo5I, все в порядке.",
				"longText": "",
				"timestamp": 1635035879611
			},
			{
				"id": "84f5ccf3-f3ad-468d-9c7e-bfa86d577b80",
				"title": "Эктоплазма разрушается",
				"shortText": "Вам нужно срочно вернуться в мясное тело, иначе через 10 минут наступит клиническая смерть",
				"longText": "",
				"timestamp": 1635036306989
			},
			{
				"id": "6ccfd979-d646-45cf-8b1d-b82948d29f9f",
				"title": "Выход из духа",
				"shortText": "Вы вышли из духа, все в порядке.",
				"longText": "",
				"timestamp": 1635036478580
			}
		],
		"magicStats": {
			"feedbackMultiplier": 1,
			"recoverySpeedMultiplier": 1,
			"spiritResistanceMultiplier": 0.8,
			"auraReadingMultiplier": 1,
			"auraMarkMultiplier": 1,
			"auraMask": 0,
			"aura": "ecjerjbhcwbrgixrqzjg",
			"maxPowerBonus": 0,
			"victimCoefficient": 1,
			"participantCoefficient": 1
		},
		"hacking": {
			"maxTimeAtHost": 30,
			"hostEntrySpeed": 7,
			"conversionAttack": 0,
			"conversionFirewall": 0,
			"conversionSleaze": 0,
			"conversionDataprocessing": 0,
			"fadingResistance": 1,
			"biofeedbackResistance": 0,
			"adminHostNumber": 3,
			"spriteLevel": 0,
			"resonanceForControlBonus": 0,
			"varianceResistance": 0,
			"compilationFadingResistance": 0,
			"additionalRequests": 0,
			"additionalSprites": 0,
			"additionalBackdoors": 0,
			"backdoorTtl": 120,
			"jackedIn": false,
			"fading": 0,
			"fadingDecrease": 0
		},
		"drones": {
			"maxDifficulty": -1000,
			"maxTimeInside": 6,
			"recoveryTime": 120,
			"medicraftBonus": 1,
			"autodocBonus": 1,
			"aircraftBonus": 2,
			"groundcraftBonus": 2,
			"feedbackModifier": 0,
			"recoverySkill": 0
		},
		"chemo": {
			"baseEffectThreshold": 160,
			"uberEffectThreshold": 220,
			"superEffectThreshold": 280,
			"crysisThreshold": 340,
			"sensitivity": 280,
			"concentration": {
				"teqgel": 0,
				"iodine": 0,
				"argon": 0,
				"radium": 0,
				"junius": 0,
				"custodium": 0,
				"polonium": 0,
				"silicon": 0,
				"magnium": 0,
				"chromium": 0,
				"opium": 0,
				"elba": 0,
				"barium": 0,
				"uranium": 0,
				"moscovium": 0,
				"iconium": 0,
				"vampirium": 0
			}
		},
		"billing": {
			"anonymous": false,
			"stockGainPercentage": 0
		},
		"discounts": {
			"weaponsArmor": 1,
			"everything": 1
		},
		"screens": {
			"billing": true,
			"spellbook": true,
			"activeAbilities": true,
			"passiveAbilities": true,
			"karma": true,
			"implants": true,
			"autodoc": false,
			"autodocWoundHeal": true,
			"autodocImplantInstall": false,
			"autodocImplantRemoval": false,
			"ethics": true,
			"location": false,
			"wound": true,
			"scanQr": true,
			"scoring": false
		},
		"ethic": {
			"groups": [],
			"state": [
				{
					"scale": "violence",
					"value": 0,
					"description": "За добро платит добром, за зло - по справедливости"
				},
				{
					"scale": "control",
					"value": 0,
					"description": "Свобода выбора обязует принять его последствия"
				},
				{
					"scale": "individualism",
					"value": 0,
					"description": "Своя рубашка ближе к телу"
				},
				{
					"scale": "mind",
					"value": 0,
					"description": "Равновесие - основа душевного здоровья"
				}
			],
			"trigger": [
				{
					"id": "30df06ca-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Нельзя упускать свою выгоду. Так называемые милосердие и насилие - лишь средства ее получить"
				},
				{
					"id": "30df06cb-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили тому, кто сильнее вас"
				},
				{
					"id": "30df06cc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились тому, кто слабее вас"
				},
				{
					"id": "30df06e3-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "И покорность, и бунт хороши, если пополняют твой счет. И плохи в обратном случае."
				},
				{
					"id": "30df06e4-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы выполнили просьбу, которую не были обязаны выполнять"
				},
				{
					"id": "30df06e5-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы отказались выполнять требование, которое были обязаны выполнить"
				},
				{
					"id": "30df06fc-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Принадлежность к сообществу или самостоятельность хороши, только если это выгодно"
				},
				{
					"id": "30df06fd-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы возразили общему решению вашей группы"
				},
				{
					"id": "30df06fe-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы подчинились общему решению вашей группы"
				},
				{
					"id": "30df0715-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "principle",
					"description": "Поверяйте решения рассудка чувством, а стремления чувств рассудком"
				},
				{
					"id": "30df0716-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Ваше рассуждение убедило собеседника"
				},
				{
					"id": "30df0717-5d9e-11ea-b518-e5c6714f0b78",
					"kind": "action",
					"description": "Вы публично прокомментировали эмоционально задевшую вас медиа-публикацию"
				}
			],
			"lockedUntil": 0
		},
		"rigging": {
			"canWorkWithBioware": false,
			"implantsBonus": 2,
			"tuningBonus": 2,
			"repomanBonus": 2
		},
		"essenceDetails": {
			"max": 600,
			"used": 0,
			"gap": 0
		},
		"karma": {
			"available": 0,
			"spent": 0,
			"spentOnPassives": 0,
			"cycleLimit": 100,
			"gameLimit": 500
		}
	},
	"notifications": [],
	"outboundEvents": [],
	"pubSubNotifications": [],
	"messageData": {
		"timestamp": 1635036479071,
		"message": "При снятии духа вы были ранены. Вычтите 2 хита."
	}
} as CharacterModelData;