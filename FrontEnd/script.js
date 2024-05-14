//Récupéreration de la galerie enregistrée sur l'API//
const galleryData = await fetch("http://localhost:5678/api/works")
let gallery = await galleryData.json()

//Définition de la variable à récuperer dans le DOM//
 const galleryContainer = document.querySelector(".gallery");

//Fonction pour afficher les travaux enregistrés//
 function fillWorks(gallery) {
     galleryContainer.innerHTML = ``;
     gallery.forEach((element) => {
         let galleryElement = document.createElement("figure");
         galleryElement.id = "figure" + element.id;
 
         let elementImage = document.createElement("img");
         elementImage.setAttribute("src", element.imageUrl);
         elementImage.setAttribute("alt", element.title);
 
         let figcaption = document.createElement("figcaption");
         figcaption.textContent = element.title;
 
         galleryElement.appendChild(elementImage);
         galleryElement.appendChild(figcaption);
 
         galleryContainer.appendChild(galleryElement);
     });
 }

 
//Récupération des filtres sur l'API//
 const categoriesData = await fetch("http://localhost:5678/api/categories")
 const categories = await categoriesData.json()
  
//Définition de la variable à récupérer dans le DOM//
 const filters = document.querySelector(".filters")

 //Génération des filtres//
 function createFilters(){

    for (let i=0; i<categories.length; i++){
        let filterElement = document.createElement("button")
        filterElement.setAttribute("name",categories[i].name)
        filterElement.setAttribute("type","button")
        filterElement.classList.add("filter-button")
        filterElement.textContent=categories[i].name
        
    
    filterElement.addEventListener("click", () => {
        
        const categoryId = categories[i].id;
        const filteredGallery = gallery.filter(work => work.categoryId === categoryId);
        fillWorks(filteredGallery);
    });
    
    filters.appendChild(filterElement);
}

}
//listener des filtres//
filters.addEventListener("click", function(event) {
    if (event.target.classList.contains("filter-button")) {
        const filteredCategory = event.target.name;
        galleryContainer.textContent = "";
        
        filters.querySelectorAll('.filter-button').forEach(btn => btn.classList.remove('active'));

        if (filteredCategory === "Tous") {
            fillWorks(gallery);
        } else {
            const newCategory = gallery.filter(element => element.category.name === filteredCategory);
            fillWorks(newCategory);
        }

        event.target.classList.add("active");
    }
})

//Définition des variables dans le DOM//
const modal = document.querySelector(".modal")
const modalWrapper = document.querySelector(".modal-wrapper")

//Fonction pour creer la modale de supression des travaux//
function fillDeleteModal(){

    modalWrapper.innerHTML=``
//Création des éléments//
    let nav = document.createElement("nav")
    nav.innerHTML=`<div><i class="fa-solid fa-xmark"></i></div>`


    let title = document.createElement("h3")
    title.textContent="Galerie photo"

 
    let modalImageWrapper = document.createElement("div")
    modalImageWrapper.classList.add("modal-img")

//Ajout des éléments//
    modalWrapper.appendChild(nav)
    modalWrapper.appendChild(title)
    modalWrapper.appendChild(modalImageWrapper)

    //Ajout des images//
    refreshModalImage()

//Ajout du boutton "Ajouter une photo"//
    let addButton = document.createElement("div")
    addButton.innerHTML=`<button type="button" name="add-photo" id="add-photo">Ajouter une photo</button>`
    addButton.classList.add("add-button")

    modalWrapper.appendChild(addButton)
}

//Fonction pour afficher les images avec l'icône corbeille dans la modale//
function refreshModalImage(){
//Définition de la variable dans le DOM//
    const modalImage = document.querySelector(".modal-img")
//Récupération des travaux sur l'API//
    fetch("http://localhost:5678/api/works")
    .then ((response)=>{
        return response.json()
    })
    .then ((gallery)=>{
        modalImage.innerHTML=``
//Création de chaque éléments//
    gallery.forEach((element) =>{
        let galleryElement = document.createElement("div")
        galleryElement.id = "div"+element.id

        let elementImage = document.createElement("img")
        elementImage.setAttribute("src", element.imageUrl)
        elementImage.setAttribute("alt", element.title)
        elementImage.classList.add("gallery-element")
        
        let trashImage = document.createElement("i")
        trashImage.id = element.id
        trashImage.classList.add("fa-solid","fa-trash-can")
//Ajout des éléments//
        galleryElement.appendChild(elementImage)
        galleryElement.appendChild(trashImage)
//Suppression ou non des travaux en cliquant sur l'icône corbeille//
        trashImage.addEventListener("click",()=>{
            let confirmation = confirm("Souhaitez-vous supprimer ce projet?")
            if (confirmation== true) {

            let deleteId = element.id
            const token = "Bearer " + sessionStorage.getItem("token")
            fetch(`http://localhost:5678/api/works/${deleteId}`,{
                method:"DELETE",
                headers:{"authorization" : token}
            })
            .then(()=>{
//Mise à jour des photos restantes//
                refreshModalImage()
            })}
        })

        modalImage.appendChild(galleryElement)
    })
})
}

//fontion pour afficher et gerer le comportement de la modale suppression de travaux//
function displayDeleteModal(){

    fillDeleteModal()
    refreshModalImage()
    
    
    const closeModal = document.querySelector(".fa-xmark")
    const deleteButton = document.querySelectorAll(".fa-trash-can")
    const addWorkButton = document.getElementById("add-photo")

    
    closeModal.addEventListener("click", function(){
        modal.setAttribute("style","display:none")
    })

    modal.addEventListener("click", function(e){
        if (e.target === modal){
            modal.setAttribute("style","display:none")
        }
    })

    
    addWorkButton.addEventListener("click", function(e){
        e.preventDefault()
        displayAddModal()
    })

}

//Fonction pour supprimer un élément en fonction de l'id
function deleteFromGallery(deleteId) {
    
    let id = parseInt(deleteId)
    let index = gallery.findIndex(function(element) {
        return element.id === id;
    });
    
    if (index !== -1) {
        gallery.splice(index, 1);
    }
}



//Fonction pour créer la modale d'ajout de nouveaux travaux//
function fillAddModal(){
    
//Création des éléments//
    let nav = document.createElement("nav")
    nav.innerHTML=`<div><i class="fa-solid fa-xmark"></i></div>
    <div><i class="fa-solid fa-arrow-left"></i></div>`

    
    let title = document.createElement("h3")
    title.textContent="Ajout Photo"

    
    let form = document.createElement("form")
    form.classList.add("add-form")

    
    let photoSection = document.createElement("div")
    photoSection.classList.add("photo-section")

    
    let display = document.createElement("div")
    display.classList.add("display")
    display.innerHTML=`<i class="fa-regular fa-image"></i>`

    
    let inputContainer = document.createElement("div")
    inputContainer.classList.add("input-container")

     
    let labelFile = document.createElement("label")
    labelFile.innerHTML=`<span>+ Ajouter photo</span>`
    labelFile.setAttribute("for","photo-input")

    let inputFile = document.createElement("input")
    inputFile.setAttribute("name","image")
    inputFile.setAttribute("type","file")
    inputFile.setAttribute("accept","image/png, image/jpeg")
    inputFile.setAttribute("id","photo-input")
    inputFile.setAttribute("required","true")

    let info = document.createElement("p")
    info.textContent="jpg, png : 4mo max"

//Ajout des éléments//
    photoSection.appendChild(display)
    labelFile.appendChild(inputFile)
    inputContainer.appendChild(labelFile)
    inputContainer.appendChild(info)
    photoSection.appendChild(inputContainer)

//Création de l'input pour le titre de la photo ajouté//
    let titleLabel = document.createElement("label")
    titleLabel.textContent="Titre"
    titleLabel.setAttribute("for","title-input")

    let titleInput = document.createElement("input")
    titleInput.setAttribute("name","title")
    titleInput.setAttribute("type","text")
    titleInput.setAttribute("id","title-input")
    titleInput.setAttribute("required","true")

//Création de la catégorie à mettre après ajout de photo//
    let categoryLabel = document.createElement("label")
    categoryLabel.textContent="Catégorie"
    categoryLabel.setAttribute("for","category-select")

    let categorySelect = document.createElement("select")
    categorySelect.setAttribute("name","category")
    categorySelect.setAttribute("id","category-select")
    categorySelect.setAttribute("required","true")

    let placeHolderSelect = document.createElement("option")
    placeHolderSelect.setAttribute("value","")
    placeHolderSelect.setAttribute("selected","true")
    placeHolderSelect.setAttribute("disabled","true")
    categorySelect.appendChild(placeHolderSelect)


//Génération des catégorie existante//
    for (let i=0; i<categories.length; i++){
        let categoryOption = document.createElement("option")
        categoryOption.setAttribute("value",categories[i].id)
        categoryOption.textContent=categories[i].name
        categorySelect.appendChild(categoryOption)
    }

//Création du boutton "envoyer"//
    let submitContainer = document.createElement("div")
    submitContainer.classList.add("submit-container")

    let addSubmitButton = document.createElement("button")
    addSubmitButton.setAttribute("type","submit")
    addSubmitButton.classList.add("add-submit-button")
    addSubmitButton.textContent="Valider"

    submitContainer.appendChild(addSubmitButton)

    

    form.appendChild(photoSection)
    form.appendChild(titleLabel)
    form.appendChild(titleInput)
    form.appendChild(categoryLabel)
    form.appendChild(categorySelect)
    form.appendChild(submitContainer)

    
    modalWrapper.appendChild(nav)
    modalWrapper.appendChild(title)
    modalWrapper.appendChild(form)

}

//Fonction pour gerer l'interraction et le comportement de modale d'ajout//
function displayAddModal(){

    

    modalWrapper.innerHTML=''

    fillAddModal()
    checkInputs()
    
    const previous = document.querySelector(".fa-arrow-left")
    previous.addEventListener("click", displayDeleteModal)

    
    const closeModal = document.querySelector(".fa-xmark")
    closeModal.addEventListener("click", function(){
        modal.setAttribute("style","display:none")
    })

    const photoInput = document.getElementById("photo-input")
    photoInput.addEventListener("change",checkFileSize)

    
    let addForm = document.querySelector(".add-form")

    addForm.addEventListener("change",checkInputs)

    

    addForm.addEventListener("submit", async function(event){
        
        event.preventDefault();
        const addFormData = new FormData(addForm)
        const token = "Bearer " + sessionStorage.getItem("token")
        
        try {
            await fetch ("http://localhost:5678/api/works", {
                method:"POST",
                body:addFormData,
                headers: {"Authorization": token}
            })

            .then(response => {
            
                if (response.ok) {
                    //modal.setAttribute("style","display:none")
                    resetForm()
                    return response.json()
                }else{
                    alert("Une erreur est survenue")
                    throw new Error("Une erreur est survenue. Vérifiez les informations entrées et votre connexion internet.")
                }
            })

            .then (data => {
                const newWork = {
                    id : data.id,
                    title : data.title,
                    imageUrl : data.imageUrl,
                    categoryId : data.categoryId,
                    userId : data.userId
                }
                gallery.push(newWork)
                fillWorks(gallery)
            })

        }catch (error){
            console.log(error)
        }
    })
}

// Fonction pour reinitialiser le formulaire d'ajout d'élément//
function resetForm() {
    document.getElementById("photo-input").value=""
    document.getElementById("title-input").value=""
    document.getElementById("category-select").value=""
    displayDeleteModal()
}
//Fonction pour vérifier la taille de l'image à ajouter//
function checkFileSize() {
    let selectedFile=document.getElementById("photo-input").files

    if (selectedFile.length > 0) {
        let fileSize = selectedFile[0].size; 
        let maxSizeInBytes = 4200000;

        if (fileSize > maxSizeInBytes) {
            alert("La taille du fichier dépasse la limite autorisée.");
            selectedFile.value = ''; 
        }else{
            updateDisplay(selectedFile)
        }
    }
}

//fonction permettant d'afficher l'image séléctionner par l'utilisateur//
function updateDisplay(selectedFile) {
    let inputContainer = document.querySelector(".input-container")
    let imagePlaceholder = document.querySelector(".display")


    if (selectedFile.length !== 0) {
        
        imagePlaceholder.innerHTML=``

        let image = document.createElement("img")
        image.src=window.URL.createObjectURL(selectedFile[0])
        image.id="selected-image"
        image.setAttribute("name",selectedFile[0].name)

        imagePlaceholder.appendChild(image)
        
        inputContainer.classList.add("display-none")
    }
}

//fonction permettant de vérifier si toute les infos sont remplie avant de pouvoir cliquer sur "envoyer"//
function checkInputs() {
    let inputFile= document.getElementById("photo-input")
    let titleInput = document.getElementById("title-input")
    let categorySelect = document.getElementById("category-select")
    let addSubmitButton = document.querySelector(".add-submit-button")
    console.log(addSubmitButton)

    if (inputFile.value !== '' && titleInput.value.trim() !== '' && categorySelect.value.trim() !== '') {
        addSubmitButton.removeAttribute('disabled');
    } else {
        addSubmitButton.setAttribute('disabled', 'disabled');
    }
  }

  //affichage de la gallerie et du filtre//
fillWorks(gallery)
createFilters()


const modifierButton = document.getElementById("modifier-button")
const loginLink = document.getElementById("loginLink")
const logoutLink = document.getElementById("logoutLink")

//Affichage et masquage des éléments après connexion//

if (sessionStorage!==null){

    const isUser = sessionStorage.getItem("isUser")
    const user = sessionStorage.getItem("user")
    
    
    if (isUser === "true") {

        modifierButton.classList.remove("display-none")
        filters.classList.add("display-none")
        logoutLink.classList.remove("display-none")
        loginLink.classList.add("display-none")
        
        console.log("Utilisateur connecté:", user)

    } else {

        modifierButton.classList.add("display-none")
        filters.classList.remove("display-none")
        logoutLink.classList.add("display-none")
        loginLink.classList.remove("display-none")
        console.log("Aucun utilisateur connecté.")
    }

}

modifierButton.addEventListener("click", function(){
    displayDeleteModal()
    modal.removeAttribute("style")
})

logoutLink.addEventListener("click", function(){
    loginLink.classList.remove("display-none")
    logoutLink.classList.add("display-none")
    sessionStorage.clear()
    location.reload()
})