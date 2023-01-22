var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

/**
 * definition of bikeShedSchema attributes
 */
var bikeShedSchema = new Schema({
	'providerName' : {
		type : String,
		required : true
	},
	'providerLink' : {
		type : String,
		required : true
	},
	'address' : {
		type : String,
		required : true
	},
	'quantity' : {
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

module.exports = mongoose.model('bikeShed', bikeShedSchema);

/*
{
	"providerName" : "Center mobilnosti Maribor",
	"providerLink" : "https://mobilnost.si/storitve/kolesodvor/",
	"address" : "Partizanska cesta 50, 2000 Maribor",
	"quantity" : "20",
	"longitude" : "15.657430340440774",
	"latitude" : "46.56223243175121"
}
*/