var TourpathModel = require('../models/tourPathModel.js');

module.exports = {

    /**
     * tourPathController.list()
     * @returns returns all bike tour paths
     */
    list: function (req, res) {
        TourpathModel.find(function (err, tourPaths) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting tourPath.',
                    error: err
                });
            }

            return res.status(201).json({success: true, "TourhPaths": tourPaths});
        });
    },

    /**
     * tourPathController.show()
     * @returns returns bike tour path based on ID
     */
    show: function (req, res) {
        var id = req.params.id;

        TourpathModel.findOne({_id: id}, function (err, tourPath) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when getting tourPath.',
                    error: err
                });
            }

            if (!tourPath) {
                return res.status(404).json({
                    success: false,
                    message: 'No such tourPath'
                });
            }

            return res.status(201).json({success: true, "TourhPath": tourPath});
        });
    },

    /**
     * tourPathController.create()
     * inserts a new bike tour path into the database
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

        var tourPath = new TourpathModel({
            geometry: objGeometry
        });

        tourPath.save(function (err, tourPath) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when creating tourPath',
                    error: err
                });
            }

            return res.status(201).json({success: true, "TourhPath": tourPath});
        });
    },

    /**
     * tourPathController.removeAll()
     * removes all bike tour paths from the database
     */
    removeAll: function (req, res) {
        TourpathModel.remove({}, function (err, TourhPaths) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'Error when deleting tourPaths.',
                    error: err
                });
            }

            return res.status(204).json({success: true});
        });
    }

    /*
    update: function (req, res) {
        var id = req.params.id;

        TourpathModel.findOne({_id: id}, function (err, tourPath) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting tourPath',
                    error: err
                });
            }

            if (!tourPath) {
                return res.status(404).json({
                    message: 'No such tourPath'
                });
            }

            
            tourPath.save(function (err, tourPath) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating tourPath.',
                        error: err
                    });
                }

                return res.json(tourPath);
            });
        });
    }
    */
};
