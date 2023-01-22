var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

/**
 * definition of standSchema attributes
 */
var standSchema = new Schema({
	'name' : {
		type : String,
		required : true
	},
	'parkSpots' : {
		type : Number,
		required : true
	},
	'geometry' : {
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
	}
}, {
	timestamps : true
});

module.exports = mongoose.model('stand', standSchema);

/*
	{
		"name": "53 - Želežniška postaja Tabor",
		"parkSpots": "6",
		"longitude": "15.64577618045837",
		"latitude": "46.55169014946587"
	}

	{
		"name": "53 - Želežniška postaja Tabor",
		"parkSpots": "6",
		"longitude": "15.6459554291449",
		"latitude": "46.55153948728998"
	}

	{
		"name": "28- Trg Leona Štuklja",
		"parkSpots": "3",
		"longitude": "15.648152440083422",
		"latitude": "46.55925299049638"
	}
*/
