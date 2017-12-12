var aVerif = [];
var nbBranche = 1;

function affichage(event, formule){

	var exp = parserExpression(formule);
	var elem1 = exp.elt1;
	var elem2 = exp.elt2;
	var symb = exp.symbole;
	var el = event.target.parentElement.parentElement;
	console.log(el);
	var parent = el.parentElement;

	parent.removeChild(el);
	parent.appendChild(el);


	//on récupère les formules précédentes
	var divForm = el.children[1];

	var ListForm = [];

	for(var i =0; i<divForm.children.length; i++){
		if (divForm.children[i].innerHTML!==formule) {
			ListForm.push(divForm.children[i]);
		}
		divForm.children[i].setAttribute('onclick','');
	}



	if(symb==="∧"){
		affichageEt(el,elem1,elem2,ListForm);
	}
	else if(symb==="∨"){
		affichageOu(el,elem1,elem2,ListForm);
	}
	else
		affichageEt(el,elem1,elem2,ListForm);

	//var txt = el.getElementsByClass("texteForm")[0].innerHTML;




}


function afficheElem(parent, formule, pos, listeForm){

	var element = document.createElement('div'); //div global
	element.setAttribute('class','element');


	if(pos==="gauche"){
		element.classList.add('filsGauche');
		element.innerHTML = "<b>/</b>" + element.innerHTML;
	}
	if(pos==="droite"){
		element.classList.add('filsDroit');
		element.innerHTML = "<b>\\</b>" + element.innerHTML;
	}

	if(pos==="et"){
		element.innerHTML = "<b>|</b>" + element.innerHTML;
	}

	if(pos==="neutre"){
		element.innerHTML = "<b></b>" + element.innerHTML;
	}

	var divFormules = document.createElement('div'); //div d'affichage des formules
	divFormules.setAttribute('class','formules');
	for(var i=0; i<listeForm.length; i++){
		divFormules.appendChild(listeForm[i].cloneNode(true));
	}

	//Activation des event
	for(var i=0; i<divFormules.children.length; i++){ //pour toutes les formules
		var form = divFormules.children[i];
		if(!estUnLitteral(form.innerHTML)){
			form.setAttribute('onclick','affichage(event,"'+form.innerHTML+'");');
		}else{
			form.setAttribute('onclick','contradiction(event);');
		}
	}


	var texteForm = document.createElement('div'); //affichage première formule
	texteForm.setAttribute('class','texteForm');
	texteForm.innerHTML = formule;

	if(!estUnLitteral(formule)){
		texteForm.setAttribute('onclick','affichage(event,"'+formule+'");');
	}else{
		texteForm.setAttribute('onclick','contradiction(event);');
	}

	divFormules.appendChild(texteForm);

	var divFils = document.createElement('div');
	divFils.setAttribute('class','fils');

	element.appendChild(divFormules);
	element.appendChild(divFils);

	//interface.appendChild(element);
	parent.appendChild(element);
}

function suiteEt(parent, formule){

	var element = parent.children[0]; //première partie du ET
	//console.log(parent.children);

	var divFormules = element.children[1]; //première partie de l'elem : divFormules


	var texteForm = document.createElement('div'); //affichage première formule
	texteForm.setAttribute('class','texteForm');
	texteForm.innerHTML = formule;

	texteForm.setAttribute('onclick','affichage(event,"'+formule+'");');

	divFormules.appendChild(texteForm);

}

function affichePremierElem(formule){
	liste = [];
	afficheElem(interface, formule, "neutre",liste);
}

function affichageOu(el, form1, form2, listeForm){
	divFils = el.lastChild;
	afficheElem(divFils,form1,"gauche",listeForm);
	afficheElem(divFils,form2,"droite",listeForm);
	nbBranche++; //on obtient une branche supplémentaire

}

function affichageEt(el, form1, form2, listeForm){
	divFils = el.lastChild;
	listeVide = [];
	//divFils.innerHTML = "<b>|</b>" + divFils.innerHTML;
	afficheElem(divFils,form1,"et",listeForm);
	suiteEt(divFils,form2);
}

function estUnLitteral(txt){

	switch(txt.length){
		case 1 :
			return true;
		case 2 :
			if (txt[0]==='¬'){
				return true;
			}else{
				return false;
			}
		default :
			return false;
	}
}

function contradiction(event){

	elem = event.target;
	switch(aVerif.length){
		case 0 :
			aVerif.push(elem);
			elem.classList.add('actif');
			break;
		case 1 :
			if(aVerif[0].parentElement == elem.parentElement){ //si dans la même branche
				var e1 = aVerif[0].innerHTML;
				var e2 = elem.innerHTML;
				if(e1.slice(1)===e2 || e2.slice(1)===e1){ //si pareil sauf premier char (le non)
					console.log("contradiction ! ");
					liste  = [];
					affichageEt(elem.parentElement.parentElement,"⊥","",liste);
					nbBranche--;
					if (nbBranche==0) {
						alert("Toutes les contradictions ont été trouvées, la formule est valide !");
					}
					aVerif[0].setAttribute('onclick',''); //on désactive les events pour éviter de faire la contradiction 2 fois
					elem.setAttribute('onclick','');

					resetAVerif();
				}else{
					resetAVerif();
				}

			}else{
				resetAVerif();
				aVerif.push(elem);
				elem.classList.add('actif');
			}
			break;
		default:
			resetAVerif();

	}
}

function resetAVerif(){
	while(aVerif.length!=0){
		aVerif[aVerif.length - 1].classList.remove('actif');
		aVerif.pop();
	}
}

/*Met en place la liste des formuales dans le menu déroulant
*/
function afficheMenu(){
	var dropList = document.getElementById("choix");
	console.log(dropList);

	for(var i=0; i<formules.length; i++){
		var form = document.createElement('option'); //affichage première formule
		form.innerHTML = formules[i];
		dropList.appendChild(form);
	}
}

function viderInterface(){
	interface = document.getElementById("interface");
	interface.innerHTML="";
}

function changerFormule(){
	var dropList = document.getElementById("choix");
	var choix = dropList.value;
	localStorage.setItem("formule",choix);
	viderInterface();
    affichePremierElem(choix);
    nbBranche = 0;
    aVerif = [];

}

function formuleAleatoire(){
	var choix = obtenirFormuleAleatoire();
	localStorage.setItem("formule",choix);
	viderInterface();
    affichePremierElem(choix);
    nbBranche = 1;
    aVerif = [];
}