//Muuttujat laskuun
let number1 = 0;
let number2 = 0;
let operator = "";

function addNumber(newNumber){
    let input = document.getElementById("#input1")
    input1.value = input1.value + newNumber;
}

function addComma() {
    let input = document.getElementById("#input1");
    input1.value = input1.value + ".";
}
// tyhjentää
function clearDisplay() {
    let input = document.getElementById("#input1");
    input1.value = "";
}

function selectOperator() {
let select = document.getElementById("operation")
//tarkistetaan onko laskutoimitus valittu

if(select.selectedIndex > 0){
    let input = document.getElementById("#input1");
    number1 = input1.value;
    operator = select.options[select.selectedIndex].value;
    //tekstikentan tyhjennys
    input1.value = "";
    //valitaan select eka rivi
    select.selectedIndex = 0;
}
}

function calculate() {
   let tulos = 0;
    //lue toka luku
let input = document.getElementById("#input1");
number2 = input1.value;
if( operator == "+") {
tulos = parseFloat(number1) + parseFloat(number2);
}

if(operator == "-") {
    tulos = number1 - number2;
    }

    if(operator == "*") {
        tulos = number1 * number2;
        }

        if(operator == "/") {
            tulos = number1 / number2;
            }

input1.value = tulos;

number1 = 0;
number2 = 0;
operator = "";

}




