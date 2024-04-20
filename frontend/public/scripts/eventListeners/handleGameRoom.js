import { leaveRoom } from "../api/rooms.js";

export const handleQuitRoom = () => {
    document.querySelector("#leave-room-button").addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("Quiting room");
        const res = await quitRoom();
        if (res.status === "success") {
            window.location.href = "/rooms";
        } else {
            alert(res.data.message);
        }
    });
};

export const handleSubmitWord = () => {
    document.querySelector("#submit-word-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const word = document.querySelector("#input-word").value;
        console.log(word);
    })
};