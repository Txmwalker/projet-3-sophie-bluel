document.addEventListener("DOMContentLoaded",function(){
    let loginbtn=document.getElementById("login-btn")
    loginbtn.addEventListener("click",function(){
        
        let email=document.getElementById("email").value
        
        let password=document.getElementById("password").value
        const user={
            "email":email,
            "password":password,}
        console.log(user)
        fetch("http://localhost:5678/api/users/login",
            {
                method: "POST",
            headers: {'accept': 'application/json',
                'Content-Type': 'application/json; charset=utf-8',},
            body: JSON.stringify(user)
        })
        .then(function(response){
           console.log(response) 
           if(response.status==404){
            alert("identifiant ou mot de passe incorect")
           }
           else if(response.status==200){
            return response.json()
           }
           else{
            alert("impossible de se connecter")
           }
           window.location.replace("login.html")
        })
        .then(function(data){
            window.location.replace("index.html")
        })
    })
})