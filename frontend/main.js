
const $ = s => document.querySelector(s)

fetch("http://localhost:3001/profile", {
    credentials: "include"
})
    .then(res => res.json())
    .then(data => {

        if (data.error) return

        $("#guestArea").classList.add("d-none")
        $("#appArea").classList.remove("d-none")

        if (data.role === "admin") {
            $("#adminTabBtn").classList.remove("d-none")
        }
    })


document.querySelector("#save").onclick = () => {

    let name = $("#regName").value
    let email = $("#regEmail").value
    let password = $("#regPassword").value
    let password2 = $("#regPassword2").value
    let isAdmin = $("#regIsAdmin").checked

    if (!name || !email || !password || !password2) {
        alert("Fill all fields")
        return
    }

    if (password.length < 6) {
        alert("Password min 6 symbols")
        return
    }

    if (password !== password2) {
        alert("Passwords do not match")
        return
    }

    fetch("http://localhost:3001/register", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            email,
            password,
            isAdmin   // ⬅️ ճիշտ անուն
        })
    })
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                alert(data.error)
                return
            }

            $("#guestArea").classList.add("d-none")
            $("#appArea").classList.remove("d-none")

            if (data.role === "admin") {
                $("#adminTabBtn").classList.remove("d-none")
            }
        })
}


$("#btnLogout").onclick = () => {

    fetch("http://localhost:3001/logout", {
        credentials: "include"
    })
        .then(res => res.json())
        .then(() => {

            $("#guestArea").classList.remove("d-none")
            $("#appArea").classList.add("d-none")
            $("#adminTabBtn").classList.add("d-none")
        })
}


$("#adminTabBtn").onclick = () => {

    fetch("http://localhost:3001/admin", {
        credentials: "include"
    })
        .then(res => res.json())
        .then(data => {

            if (data.error) {
                alert(data.error)
                return
            }

            console.table(data)
        })
}
