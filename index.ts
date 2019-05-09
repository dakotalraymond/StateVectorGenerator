const satellite: any = require('satellite.js');
const fs = require('fs');
const readline: any = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Please enter the starting date for propagation (format: December 17, 1995 03:24:00) \n', (dateString) => {
  readline.question('Please input the desired interval between propagations in seconds \n', (interval) => {
    readline.question('Please input the desired number of propagations \n', (propagations) => {
      readline.question('Please enter line 1 of the TLE \n', (tleLine1) => {
        readline.question('Please enter line 2 of the TLE \n', (tleLine2) => {
          fs.writeFile('./output.csv', '', (err) => {
            if (err) {
              return console.log(err);
            }
          });

          for (let i = 0; i < propagations; i++) {
            // Initialize a satellite record
            let satrec = satellite.twoline2satrec(tleLine1, tleLine2);

            let propagationDate = new Date(dateString);
            propagationDate.setSeconds(propagationDate.getSeconds() + (i * interval));
            let positionAndVelocity = satellite.propagate(satrec, propagationDate);

            let positionEci = positionAndVelocity.position;
            let velocityEci = positionAndVelocity.velocity;

            let outputString = `Timehere,0,0,${positionEci.x},${positionEci.y},${positionEci.z},${velocityEci.x},${velocityEci.y},${velocityEci.z},\n`;
            fs.appendFile('./output.csv', outputString, (err) => {
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



