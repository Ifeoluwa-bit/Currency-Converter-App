const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
apiKey = "328e37083dfcf1fad6abe1c0",
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++){
    for(currency_code in country_code){
    //selecting USD by default as FROM currency and NGN by default as TO currency
    let selected;
    if(i == 0){
        selected = currency_code == "USD" ? "selected" : ""
    }else if(i == 1){
        selected = currency_code == "NGN" ? "selected" : ""
    }
    //creating option tag with passing currency code as a text and value
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    //inserting option tag inside the select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener('change', e => {
        loadFlag(e.target); //calling loadFlag with passing target element as an argument 
    });
}

function loadFlag(element){
    for(let code in country_code){
        if(code == element.value){
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_code[code].toLowerCase()}.png`;
        }
    }
}


window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener("click", e => {
    e.preventDefault();//preventing form from submitting
    getExchangeRate();
})

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value; //temporary currency code of FROM drop List
    fromCurrency.value = toCurrency.value; //passing TO currency code to FROM currency code 
    toCurrency.value = tempCode; //passing temporary currency code to TO currency code
    loadFlag(fromCurrency); // calling loadFlag with passing select element(fromCurrency) of FROM
    loadFlag(toCurrency); // calling loadFlag with passing select element(toCurrency) of TO
    getExchangeRate();
})

function getExchangeRate(){
    const amount = document.querySelector(".amount input"),
    exchangeRateText = document.querySelector(".exchange-rate");
    //if user don't enter any value or enter 0 then we'll put 1 valure there by default in the input field
    let amountVal = amount.value;
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateText.innerText = "Getting exchange rate....";
    let url = ` https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
    //fetching api response and returning it with parsing into js obj and in another then method receiving obj
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2)
        exchangeRateText.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    }).catch(() => { //if user is offline or any other error occured while fetching data, then catch function will run
        exchangeRateText.innerText = "Something went wrong";
    });
}