var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

/**
 * definition of tourPathSchema attributes
 */
var tourPathSchema = new Schema({
    'geometry' : {
		'type' : {
			type : String,
			enum : ['LineString'],
			default : 'LineString',
			required : true
		},
		'coordinates' : {
			type : [[Number]],
			required : true
		}
	}
}, {
    timestamps : true
});

module.exports = mongoose.model('tourPath', tourPathSchema);

/*
{
    "coordinates": [
          [
            15.627771080994304,
            46.60964403352395
          ],
          [
            15.627809999713907,
            46.609670000384426
          ],
          [
            15.627900000614453,
            46.60961000041628
          ]
    ]
}
*/