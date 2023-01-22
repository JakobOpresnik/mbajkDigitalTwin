var CoridorModel = require('../models/coridorModel.js');

module.exports = {

    /**
     * coridorController.list()
     * @returns returns all coridors
     */
    list: function (req, res) {
        CoridorModel.find(function (err, coridors) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting coridor.',
                    error: err
                });
            }

            return res.json({success: true, "Coridors": coridors});
        });
    },

    /**
     * coridorController.show()
     * @returns returns coridor based on ID
     */
    show: function (req, res) {
        var id = req.params.id;

        CoridorModel.findOne({_id: id}, function (err, coridor) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting coridor.',
                    error: err
                });
            }

            if (!coridor) {
                return res.status(404).json({
                    success: false,
                    message: 'No such coridor'
                });
            }

            return res.json({success: true, "Coridor": coridor});
        });
    },

    /**
     * coridorController.create()
     * inserts new coridor into the database
     */
    create: function (req, res) {
        if(req.body.coordinates.length < 2){
            return res.status(500).json({
                success: false,
                message: 'Coordinates must contain atleast 2 points',
            });
        }

        var objGeometry = {
            type: 'LineString', 
            coordinates: req.body.coordinates
        }

        var coridor = new CoridorModel({
            geometry: objGeometry
        });

        coridor.save(function (err, coridor) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when creating coridor',
                    error: err
                });
            }

            return res.status(201).json({success: true, "Coridor": coridor});
        });
    },

    /**
     * coridorController.removeAll()
     * deletes all coridors from the database
     */
    removeAll: function (req, res) {
        CoridorModel.remove({}, function (err, coridors) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when deleting coridors.',
                    error: err
                });
            }

            return res.status(204).json({success: true});
        });
    }

    /*
    update: function (req, res) {
        var id = req.params.id;

        CoridorModel.findOne({_id: id}, function (err, coridor) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting coridor',
                    error: err
                });
            }

            if (!coridor) {
                return res.status(404).json({
                    message: 'No such coridor'
                });
            }

            
            coridor.save(function (err, coridor) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating coridor.',
                        error: err
                    });
                }

                return res.json(coridor);
            });
        });
    },
    */
};
