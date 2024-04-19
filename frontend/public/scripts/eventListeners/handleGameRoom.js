import { leaveRoom } from "../api/rooms.js";

export const handleLeaveRoom = () => {
    document.querySelector("#leave-room-button").addEventListener("click", async (e) => {
        e.preventDefault();
        console.log("leave room");
        const res = await leaveRoom();
        if (res.status === "success") {
            window.location.href = "/rooms";
        } else {
            alert(res.data.message);
        }
    });
};
