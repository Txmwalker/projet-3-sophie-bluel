
const galleryData = await fetch("http://localhost:5678/api/works")
let gallery = await galleryData.json()


 const galleryContainer = document.querySelector(".gallery");

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

 fillWorks(gallery)


 const categoriesData = await fetch("http://localhost:5678/api/categories")
 const categories = await categoriesData.json()
  

 const filters = document.querySelector(".filters")

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
});
createFilters()


