document.addEventListener("DOMContentLoaded", function () {
    let loginbtn = document.getElementById("login-btn")
    let isUser = false
    loginbtn.addEventListener("click", function () {
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        const user = {
            "email": email,
            "password": password,
        }
        console.log(user)
        return fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(user)
        })
            .then(function (response) {
                console.log(response)
                if (response.status == 404) {
                    alert("identifiant ou mot de passe incorect")
                    window.location.replace("login.html")
                }
                else if (response.status == 200) {
                    isUser = true
                    return response.json()
                        .then(function (data) {
                            sessionStorage.setItem("user", user.email)
                            sessionStorage.setItem("isUser", "true")
                            sessionStorage.setItem("token", data.token)
                            window.location.replace("index.html")
                        })
                }
                else {
                    alert("impossible de se connecter")
                }
            })
    })
})
