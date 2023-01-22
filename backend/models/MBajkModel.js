var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

/**
 * definition of MBajkSchema attributes
 */
var MBajkSchema = new Schema({
	'id': {
		type: String,
		required: true
	},
	'number' : {
		type : Number,
		required : true
	},
	'name' : {
		type : String,
		required : true
	},
	'address' : {
		type : String,
		required : true
	},
	'geometry': {
		'type' : {
			type : String,
			enum : ['Point'],
			default : 'Point',
			required : true
		},
		'coordinates' : {
			type : [Number],
			index : "2dsphere",
			required : true
		}
	},
	'currentStatus' : {
		type : String,
		required : true
	},
	'currentAvailabilities' : {
		'bikesAvailable' : {
			type : Number,
			required : true
		},
		'parkSpots' : {
			type : Number,
			required : true
		}
	},
	'historyAvailabitilities' : [
		{
			'bikesAvailable' : {
				type : Number,
				required : true
			},
			'parkSpots' : {
				type : Number,
				required : true
			},
			'dateTimeAdded' : {
				type : Date,
				required : true
			}
		}
	],
	'lastUpdateSensor' : {
		type : String,
		required : true
	}
}, {
	timestamps : true
});

module.exports = mongoose.model('MBajk', MBajkSchema);

/*
{
	"number" : "10",
    "name" : "TELEMACH - GLAVNI TRG - STARI PERON",
    "address" : "Glavni trg 20",
    "longitude" : "15.646833",
    "latitude" : " 46.5577328",
    "status" : "OPEN",
    "bikes" : "20",
    "capacity" : "20",
    "lastUpdateSensor" : "2022-05-05T09:51:18Z"
}

{
	"number" : "9",
    "name" : "NKBM - TRG LEONA ŠTUKLJA",
    "address" : "Ulica slovenske osamosvojitve 5",
    "longitude" : "15.649072",
    "latitude" : "46.558519",
    "status" : "OPEN",
    "bikes" : "7",
    "capacity" : "20",
    "lastUpdateSensor" : "2022-05-05T10:23:54Z"
}

http://localhost:3000/mbajk/closeTo?longitude=15.646833&latitude=46.5577328
*/