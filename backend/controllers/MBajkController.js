var MbajkModel = require('../models/MBajkModel.js');

module.exports = {

    /**
     * MBajkController.list()
     * @returns returns message of success and listed MBajk locations or error message
     */
    list: function (req, res) {
        MbajkModel.find().select("-historyAvailabitilities").exec(function (err, MBajks) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error when getting MBikes",
                    error: err
                });
            }
            res.append('Content-Range', `mbajks 0-${MBajks.length}/${MBajks.length}`);
            res.append('Access-Control-Expose-Headers', 'Content-Range');
            //return res.json({success: true, auth: "jwt", "Mbajks": MBajks});
            return res.json(MBajks);
            //return res.json(MBajks.filter(mbajk => mbajk.number === req.body.number));
        });
    },

    /**
     * MBajkController.near()
     * @returns returns nearest MBajk location based on given coordinates or error message
     */
    near: function(req, res){
        //console.log(req.query.longitude)
        //console.log(req.query.latitude)
        if(!req.query.longitude || !req.query.latitude){
            return res.status(500).json({
                success: false,
                message: "longitude or latitude not set",
            });
        }
        // geospatial query
        MbajkModel.aggregate([{
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [parseFloat(req.query.longitude), parseFloat(req.query.latitude)]
                },
                distanceField: 'distance',
                spherical: true
            }
        }])
        .then(function(MBajk, error){
            if(error){
                return res.status(500).json({
                    success: false,
                    message: "Error when getting MBike",
                    error: err
                });
            }
            return res.json({success:true, "Mbajk": MBajk});
        })
    },

    /**
     * MBajkController.show()
     * @returns returns an MBajk location based on its ID
     */
    show: function (req, res) {
        var id = req.params.id;
        console.log(id);
        MbajkModel.findOne({id: id}, function (err, MBajk) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Error when getting MBike",
                    error: err
                });
            }

            if (!MBajk) {
                return res.status(404).json({
                    success: false,
                    message: "Error no such MBajk"
                });
            }

            return res.json(MBajk);
        });
    },

    /**
     * MBajkController.insert()
     * adds an MBajk location to the database
     * adds past measurements to the history array if the last sensor update doesn't match given location's last sensor update
     * @returns returns success message and the inserted MBajk location or error message 
     */
    insert: function (req, res) {
        MbajkModel.findOne({number: parseInt(req.body.number)}, function (err, MBajk) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err
                });
            }
            if(MBajk){
                if(MBajk.lastUpdateSensor != req.body.lastUpdateSensor){
                    var objCurrentAvail = {
                        'bikesAvailable' : parseInt(req.body.bikes),
                        'parkSpots' : parseInt(req.body.capacity),
                        'dateTimeAdded' : Date.now()
                    }
                    MBajk.currentAvailabilities = objCurrentAvail;
                    MBajk.lastUpdateSensor = req.body.lastUpdateSensor;
                    MBajk.historyAvailabitilities.push(objCurrentAvail);
                    MBajk.save(function (err, MBajk) {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Error when updating MBike",
                                error: err
                            });
                        }
                        return res.json({success: true, 
                            inserted: false, 
                            updated: true, 
                            MBajk: MBajk
                        })
                    });
                }else{
                    return res.json({success: true, 
                            inserted: false, 
                            updated: false, 
                            MBajk: MBajk
                    })
                }
            }else{
                var objGeometry = {
                    type: 'Point', 
                    coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
                }
                var objCurrentAvail = {
                    'bikesAvailable' : parseInt(req.body.bikes),
                    'parkSpots' : parseInt(req.body.capacity)
                }
                var objHistoryAvailabitilities = [
                    {
                        'bikesAvailable' : parseInt(req.body.bikes),
                        'parkSpots' : parseInt(req.body.capacity),
                        'dateTimeAdded' : Date.now()
                    }
                ]
                
                var MBajk = new MbajkModel({
                    // random ID generated, required by the admin interface
                    id : require("crypto").randomBytes(64).toString('hex'),
                    number : parseInt(req.body.number),
                    name : req.body.name,
                    address : req.body.address,
                    geometry : objGeometry,
                    currentStatus : req.body.status,
                    lastUpdateSensor : req.body.lastUpdateSensor,
                    currentAvailabilities : objCurrentAvail,
                    historyAvailabitilities : objHistoryAvailabitilities
                });
                
                MBajk.save(function (err, MBajk) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Error when saving MBike",
                            error: err
                        });
                    }
                    return res.json({success: true, 
                        inserted: true, 
                        updated: false, 
                        MBajk: MBajk
                    })
                });
            }
        });
    },

    /*
    update: function (req, res) {
        var id = req.params.id;

        MbajkModel.findOne({_id: id}, function (err, MBajk) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting MBajk',
                    error: err
                });
            }

            if (!MBajk) {
                return res.status(404).json({
                    message: 'No such MBajk'
                });
            }

            MBajk.number = req.body.number ? req.body.number : MBajk.number;
			MBajk.name = req.body.name ? req.body.name : MBajk.name;
			MBajk.address = req.body.address ? req.body.address : MBajk.address;
			MBajk.currentStatus = req.body.currentStatus ? req.body.currentStatus : MBajk.currentStatus;
			MBajk.number = req.body.number ? req.body.number : MBajk.number;
			
            MBajk.save(function (err, MBajk) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating MBajk.',
                        error: err
                    });
                }

                return res.json(MBajk);
            });
        });
    },
    remove: function (req, res) {
        var id = req.params.id;

        MbajkModel.findByIdAndRemove(id, function (err, MBajk) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the MBajk.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
    */
};
