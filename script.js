const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateBtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '"`~!@#$%^&*()_-{[}],.<>?/|;:';

let password = "";
let passwordLength = 10;
let checkCount = 0;
handleSlider();
setIndicator("#ccc");


// set pwd length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;


    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getRndInteger(min,max){
    return Math.floor(Math.random() * (max - min)) + min;
}
function generateRandomNumber(){
    return getRndInteger(0,9);
}
function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}
function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}
function generateSymbol(){
    let int = getRndInteger(0,symbols.length);
    return symbols.charAt(int);
}


function calcStrength(){
    let hasUpper = false;
    let haslower = false;
    let hasNum = false;
    let hasSymbol= false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) haslower = true;
    if(numberCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSymbol = true;

    if(haslower && hasUpper && (hasNum || hasSymbol) && passwordLength >= 8){
        setIndicator("#0f0");
    }
    else if(
        (haslower || hasUpper) && 
        (hasNum || hasSymbol) && passwordLength>=6
    ){
        setIndicator("#ff0");
    }else{
        setIndicator("#f00");
    }
}


async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value)
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // for making copied visible
    copyMsg.classList.add("active");
    // for removing that message
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function hadleCheckboxChange(){
    checkCount = 0;

    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount = checkCount + 1;
        }
    })
    // special cond
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',hadleCheckboxChange);
})


inputSlider.addEventListener("input",(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click",()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})



generateBtn.addEventListener("click",()=>{
    if(checkCount == 0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }


    password = "";
    let fncArr = [];
    if(uppercaseCheck.checked){
        fncArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        fncArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        fncArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        fncArr.push(generateSymbol);
    }


    //compulsory addition
    for(let i=0; i<fncArr.length; i++) {
        password += fncArr[i]();
    }

    //remaining adddition
    for(let i=0; i<passwordLength-fncArr.length; i++) {
        let randIndex = getRndInteger(0 , fncArr.length);
        console.log("randIndex" + randIndex);
        password += fncArr[randIndex]();
    }
    // shuffle password
    password = shufflePassword(Array.from(password));

    // show in ui
    passwordDisplay.value = password;
    // calculate strength
    calcStrength()
});