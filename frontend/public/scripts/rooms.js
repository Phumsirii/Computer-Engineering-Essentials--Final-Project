export async function FetchRoom() {
    console.log("OK");
    await fetch('/api/rooms') //implementing fetch link later
        .then(response => response.json())
        .then(data => {
            let rooms = data.rooms;//get all rooms
            let roomContainer = document.getElementById('room-container');
            roomContainer.innerHTML = '';
            rooms.forEach(room => {
                const roomDiv = document.createElement('div');
                roomDiv.className = 'room';

                const roomName = document.createElement('span');
                roomName.className = 'room-name';
                roomName.innerText = room.name;
                roomDiv.appendChild(roomName);

                const roomPlayers = document.createElement('span');
                roomPlayers.className = 'room-players';
                const numberOfPlayersSpan = document.createElement('span');
                numberOfPlayersSpan.id = 'number-of-players';
                numberOfPlayersSpan.textContent = numberOfPlayers; // array.size();
                roomPlayers.appendChild(numberOfPlayersSpan);

                const joinButton = document.createElement('button');
                joinButton.className = 'room-button';
                joinButton.textContent = 'Join';
                roomJoinDiv.appendChild(joinButton);

                roomDiv.appendChild(roomJoinDiv);

                roomContainer.appendChild(roomDiv);
            });
        });
}