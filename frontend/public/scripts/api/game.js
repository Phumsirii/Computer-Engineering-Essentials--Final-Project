export const submitWord = () => {
    
}

export const getUsers = () => {
    fetch('http://localhost:3000/user').then(res => res.json()).then(data => console.log(data))
}