import { EmptyBodyStorageQr, EmptySpiritJarQr, FullBodyStorageQr, FullSpiritJarQr } from "sr2020-mm-event-engine";

export const refSpiritJarQrId = 359;
export const refBodyStorageQrId = 367;
export const refSpiritId = 382;

export const fullSpiritJarQr = {
	"baseModel": {
		"usesLeft": 9999,
		"type": "spirit_jar",
		"name": "Духохранилище",
		"description": "",
		"modelId": "359",
		"timestamp": 1634953769900,
		"modifiers": [],
		"timers": [],
		"eventType": "",
		"data": {
			"spiritId": 382
		}
	},
	"workModel": {
		"usesLeft": 9999,
		"type": "spirit_jar",
		"name": "Духохранилище",
		"description": "",
		"modelId": "359",
		"timestamp": 1634953769900,
		"modifiers": [],
		"timers": [],
		"eventType": "",
		"data": {
			"spiritId": 382
		}
	},
	"notifications": [],
	"outboundEvents": [],
	"pubSubNotifications": []
} as FullSpiritJarQr;

export const emptyBodyStorageQr = {
	"baseModel": {
		"usesLeft": 1,
		"type": "body_storage",
		"name": "",
		"description": "",
		"modelId": "367",
		"timestamp": 1634953817435,
		"modifiers": [],
		"timers": [],
		"eventType": "",
		"data": {}
	},
	"workModel": {
		"usesLeft": 1,
		"type": "body_storage",
		"name": "",
		"description": "",
		"modelId": "367",
		"timestamp": 1634953817435,
		"modifiers": [],
		"timers": [],
		"eventType": "",
		"data": {}
	},
	"notifications": [],
	"outboundEvents": [],
	"pubSubNotifications": []
} as EmptyBodyStorageQr;

export const fullBodyStorageQr = {
	"baseModel": {
		"usesLeft": 1,
		"type": "body_storage",
		"name": "",
		"description": "",
		"modelId": "367",
		"timestamp": 1634953871643,
		"modifiers": [],
		"timers": [],
		"eventType": "",
		"data": {
			"body": {
				"characterId": "51935",
				"type": "physical",
				"name": "ТестПер",
				"metarace": "meta-norm"
			}
		}
	},
	"workModel": {
		"usesLeft": 1,
		"type": "body_storage",
		"name": "",
		"description": "",
		"modelId": "367",
		"timestamp": 1634953871643,
		"modifiers": [],
		"timers": [],
		"eventType": "",
		"data": {
			"body": {
				"characterId": "51935",
				"type": "physical",
				"name": "ТестПер",
				"metarace": "meta-norm"
			}
		}
	},
	"notifications": [],
	"outboundEvents": [],
	"pubSubNotifications": []
} as FullBodyStorageQr;

export const emptySpiritJarQr = {
	"baseModel": {
		"usesLeft": 9999,
		"type": "spirit_jar",
		"name": "Духохранилище",
		"description": "",
		"modelId": "359",
		"timestamp": 1634953900603,
		"modifiers": [],
		"timers": [],
		"eventType": "",
		"data": {
			"emptiness_reason": "Дух используется."
		}
	},
	"workModel": {
		"usesLeft": 9999,
		"type": "spirit_jar",
		"name": "Духохранилище",
		"description": "",
		"modelId": "359",
		"timestamp": 1634953900603,
		"modifiers": [],
		"timers": [],
		"eventType": "",
		"data": {
			"emptiness_reason": "Дух используется."
		}
	},
	"notifications": [],
	"outboundEvents": [],
	"pubSubNotifications": []
} as EmptySpiritJarQr;