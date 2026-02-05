const $ = s => document.querySelector(s)

fetch("http://localhost:3001/profile",{
    credentials: "include"
}).then(res=>res.json()).then(data=>{
    if(data.error){
        console.log("login")
        return
    }
    $("#guestArea").classList.add("d-none")
    $("#appArea").classList.remove("d-none")

    if(data.newValue.role==="admin"){
        $("adminTabBtn").classList.remove("d-none")
    }



})

document.querySelector("#save").onclick = () => {
    let regNameEl = $("#regName")
    let regEmailEl = $("#regEmail")
    let regPasswordEl = $("#regPassword")
    let regPassword2El = $("#regPassword2")
    let regIsAdminEl = $("#regIsAdmin")

    if (!regNameEl.value || !regEmailEl.value || !regPasswordEl.value || !regPassword2El.value ||
        regPasswordEl.value.length < 6 && regPasswordEl.value !== regPassword2El.value) {
        alert("false")
        return false
    }
    {
        fetch("http://localhost:3001/register", {
            method: "POST",
            body: JSON.stringify({value: regNameEl.value, email: regEmailEl.value, password: regPasswordEl.value, IsAdmin: regIsAdminEl.checked}),
            headers: {
                "Content-Type": "application/json",
                "Accept":"application/json",
            },
            credentials: "include"


        }).then(res => {
            if (res.ok) {
                return res.json()
            }
            throw res.error
        }).then(data=>{
            $("#guestArea").classList.add("d-none")
            $("#appArea").classList.remove("d-none")
        })

    }
}

$("#btnLogout").onclick=()=>{
    fetch("http://localhost:3001/logout",{
        credentials: "include"

    }).then(res=>res.json()).then(data=>{
        console.table(data)
        $("#guestArea").classList.remove("d-none")
        $("#appArea").classList.add("d-none")
    })

}
$("#adminTabBtn").onclick=()=>{
    fetch("http://localhost:3001/admin",{
        credentials: "include"

    }).then(res=>res.json()).then(data=>{
        console.table(data)





        $("#guestArea").classList.remove("d-none")
        $("#appArea").classList.add("d-none")
    })
}