const beacons = [];

for (let i = 0; i < 50; i++) {
    // const element = 50];
    beacons.push({
        id: i,
        x: (Math.random()+0.5)*300,
        y: (Math.random()+0.5)*300,
    })
}

console.log(JSON.stringify(beacons, null, '  '));