
let nappi = document.getElementById("nappula");
    nappula.addEventListener("click", myFunction);

function myFunction() {
    
    let text = document.getElementById("teksti");
    textvalue = teksti.value
   
    let lista = document.getElementById("lista1")
    var ul = document.createElement('li');
    document.getElementById('lista1').appendChild(ul);
    var li = document.createElement('ul');
    ul.appendChild(li);
    
    li.innerHTML = li.innerHTML + textvalue
   
}


