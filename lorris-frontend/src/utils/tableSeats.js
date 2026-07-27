export function getTableSeats(players, myName) {

    const myIndex =
        players.findIndex(
            p => p.name === myName
        );

    if (myIndex === -1) return [];

    const seats = [];

    for (let i = 0; i < players.length; i++) {

        seats.push(
            players[
                (myIndex + i) % players.length
            ]
        );

    }

    return seats;

}