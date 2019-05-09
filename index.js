var satellite = require('satellite.js');
var fs = require('fs');
var readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});
readline.question('Please enter the starting date for propagation (format: December 17, 1995 03:24:00) \n', function (dateString) {
    readline.question('Please input the desired interval between propagations in seconds \n', function (interval) {
        readline.question('Please input the desired number of propagations \n', function (propagations) {
            readline.question('Please enter line 1 of the TLE \n', function (tleLine1) {
                readline.question('Please enter line 2 of the TLE \n', function (tleLine2) {
                    tleLine1 = '1 25544U 98067A   19128.71701608  .00001940  00000-0  38388-4 0  9999';
                    tleLine2 = '2 25544  51.6415 197.3488 0001121 323.2364 181.2205 15.52649463169125';
                    fs.writeFile('./output.csv', '', function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    for (var i = 0; i < propagations; i++) {
                        // Initialize a satellite record
                        var satrec = satellite.twoline2satrec(tleLine1, tleLine2);
                        //  Or you can use a JavaScript Date
                        var propagationDate = new Date(dateString);
                        propagationDate.setSeconds(propagationDate.getSeconds() + (i * interval));
                        var positionAndVelocity = satellite.propagate(satrec, propagationDate);
                        // The position_velocity result is a key-value pair of ECI coordinates.
                        // These are the base results from which all other coordinates are derived.
                        var positionEci = positionAndVelocity.position, velocityEci = positionAndVelocity.velocity;
                        var outputString = "Timehere,0,0," + positionEci.x + "," + positionEci.y + "," + positionEci.z + "," + velocityEci.x + "," + velocityEci.y + "," + velocityEci.z + ",\n";
                        fs.appendFile('./output.csv', outputString, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                    }
                    console.log('Completed succesfully');
                    readline.close();
                });
            });
        });
    });
});
