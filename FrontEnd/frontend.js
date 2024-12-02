const req_works = await fetch("http://localhost:5678/api/works");
const travaux = await req_works.json();

// Génération de la liste des filtres
let l_filters = ["Tous"];

for (let i=0 ; i<travaux.length ; i++) {
    if (l_filters.includes (travaux[i].category.name)) {
    }
    else {l_filters.push (travaux[i].category.name)}
}

// Ajout des filtres au DOM
let filters = document.querySelector("#portfolio h2");

let ul_filter = document.createElement("div");
ul_filter.className="ul_div";
filters.insertAdjacentElement("afterend", ul_filter);

let filter = document.querySelector(".ul_div");

for (let i=0 ; i<l_filters.length ; i++) {
    let li_filter = document.createElement("div");
    li_filter.className="li_div";
    li_filter.innerText = l_filters[i];
    filter.appendChild(li_filter);
}

// Génération/ajout de la galerie
let gallery = document.querySelector(".gallery");
gallery.innerHTML = "";

for (let i=0 ; i<travaux.length ; i++) {
    const n_work = document.createElement ("figure");
    const work_img = document.createElement ("img");
    work_img.src = travaux[i].imageUrl;        
    const work_title = document.createElement ("figcaption");
    work_title.innerText = travaux[i].title;

    n_work.appendChild(work_img);
    n_work.appendChild(work_title);
    
    gallery.appendChild(n_work);
}

// Tri des images selon le filtre
let filterEvent = document.querySelectorAll(".li_div");
for (let i=0 ; i<filterEvent.length ; i++) {
    filterEvent[i].addEventListener("click", event => {
        gallery.innerHTML = "";
        for (let j=0 ; j<travaux.length ; j++) {
            if (filterEvent[i].outerText === travaux[j].category.name) {
                const n_work = document.createElement ("figure");
                const work_img = document.createElement ("img");
                work_img.src = travaux[j].imageUrl;        
                const work_title = document.createElement ("figcaption");
                work_title.innerText = travaux[j].title;

                n_work.appendChild(work_img);
                n_work.appendChild(work_title);

                gallery.appendChild(n_work)
            }
        }
    });
}

