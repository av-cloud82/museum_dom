const dateField = document.querySelector("#input-date");

datePickerConfig = {
    dateFormat: "d.m.Y",
    minDate: "today",
}
flatpickr(dateField, datePickerConfig);


//Create dropdown time slots
(function () {
    const START_TIME = "08:00";
    const END_TIME = "18:00";
    const STEP = 30;
    const timeSlots = generateTimeSlots(START_TIME, END_TIME, STEP);

    const dropdown = document.querySelector(".time .dropdown-options")
    timeSlots.forEach((each) => {
        const el = document.createElement("li");
        el.dataset.value = each
        el.innerText = each
        dropdown.append(el);
    })

    function generateTimeSlots(startTime, endTime, step = 30) {
        const slots = [];

        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);

        const start = new Date();
        start.setHours(sh, sm, 0, 0);

        const end = new Date();
        end.setHours(eh, em, 0, 0);

        const current = new Date(start);

        while (current <= end) {
            const h = String(current.getHours()).padStart(2, "0");
            const m = String(current.getMinutes()).padStart(2, "0");

            slots.push(`${h}:${m}`);

            current.setMinutes(current.getMinutes() + step);
        }

        return slots;
    }
}());



// Here we make dropdowns work
document.querySelectorAll(".dropdown").forEach((dropdown) => {

    const selected = dropdown.querySelector(".dropdown-selected");
    const options = dropdown.querySelector(".dropdown-options");
    const hiddenInput = dropdown.querySelector("input[type='hidden']");

    dropdown.addEventListener("click", () => {
        dropdown.classList.toggle("open");
    });

    options.querySelectorAll("li").forEach((option) => {
        option.addEventListener("click", (e) => {
            e.stopPropagation();
            selected.textContent = option.textContent;
            hiddenInput.value = option.dataset.value;
            if (option.dataset.price) {hiddenInput.dataset.price = option.dataset.price;}
            hiddenInput.dispatchEvent(new Event('input'));
            dropdown.classList.remove("open");
        });
    });

    document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
        }
    });
});

// Show / Hide Popup
const buyBtn = document.querySelector("#buy-btn");
const closeBtn = document.querySelector("#close-btn");
const ticketsPopup = document.querySelector("#tickets-popup")
const ticketsOverlay = document.querySelector("#tickets-overlay");
[buyBtn, closeBtn].forEach((each) => {
    each.addEventListener("click", (e) => {
        ticketsPopup.classList.toggle("show");
        ticketsOverlay.classList.toggle("show");
        document.body.classList.toggle("no-scroll");
    })
})

ticketsOverlay.addEventListener("click", function(){
    ticketsPopup.classList.remove("show");
    ticketsOverlay.classList.remove("show");
    document.body.classList.remove("no-scroll");
})



// Here we show-hide error
function validationError(element, errorMsg){
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = errorMsg;
    inputControl.classList.add("error");
}

function removeError(element){
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector(".error");

    errorDisplay.innerText = "";
    inputControl.classList.remove("error");
}


(function validateUsername() {
    const nameField = document.querySelector("#input-name");

    nameField.addEventListener("input", () => {
        const value = nameField.value;

        if (value.startsWith(" ")) {
            validationError(nameField, "Error");
        } else if (value.length < 3) {
            validationError(nameField, "Too short: min 3 char");
        } else if (value.length > 15) {
            validationError(nameField, "Too long: max 15 char");
        } else if (!/^[A-Za-z\u0400-\u04FF ]+$/u.test(value)) {
            validationError(nameField, "RU or EN only");
        } else {
            removeError(nameField);
        }
    })

    nameField.addEventListener("keydown", (e) => {
        if (e.code === "Space" && nameField.selectionStart === 0) {
            e.preventDefault();
        }
    });
})();


(function validateEmail() {
    const emailField = document.querySelector("#input-email");
    const emailRegex = /^[A-Za-z0-9_-]{3,14}@[A-Za-z]{4,}\.[A-Za-z]{2,}$/;

    emailField.addEventListener("input", () => {
        const value = emailField.value;

        if (!emailRegex.test(value)) {
            validationError(emailField, "Invalid email format");
        } else {
            removeError(emailField);
        }
    })

    emailField.addEventListener("keydown", (e) => {
        if (e.code === "Space" && emailField.selectionStart === 0) {
            e.preventDefault();
        }
    });
})();


(function validatePhone() {
    const phoneField = document.querySelector("#input-phone");
    
    phoneField.addEventListener("input", () => {
        const value = phoneField.value.trim();
        const groups = value.split(/[- ]/);
        const allDigits = groups.join('');
        const isAllDigitsOnly = /^\d+$/.test(allDigits);
        const validGroupLengths = groups.every((g) => {
            return g.length === 2 || g.length === 3
        });

        if (!isAllDigitsOnly) {
            validationError(phoneField, "Only digits, '-' or spaces");
        } else if (allDigits.length > 10) {
            validationError(phoneField, "10 digitts max");
        } else if (!validGroupLengths && groups.length > 1) {
            validationError(phoneField, "Groups should be 2 or 3 digits");
        } else {
            removeError(phoneField);
        }
    });

    phoneField.addEventListener("keydown", (e) => {
        if (e.code === "Space" && phoneField.selectionStart === 0) {
            e.preventDefault();
        }
    });
})();


(function popupEvents(){
    let ticketType,
        qtyBasic, qtySenior, 
        eventDate, eventTime,
        clientName, clientEmail, clientPhone;


    const radioTtypeSelect = document.querySelectorAll(".radio-container input")
    const basicQtyInput = document.querySelector("#adultsInput");
    const seniorQtyInput = document.querySelector("#seniors");

    const popupTtypeDisplay = document.querySelector("#popup-ttype-display");
    const popupTtypeInput = document.querySelector("#popup-ttype-input");
    const popupTtypeDiaplayField = document.querySelector(".right-section .event-type");
    const popupBasicSubtotal = document.querySelector("#popupBasicSubtotal");
    const popupSeniorSubtotal = document.querySelector("#popupSeniorSubtotal");
    


    ticketType = 20;
    qtyBasic = 0;
    qtySenior = 0;
    total = 0;

    radioTtypeSelect.forEach((each) => {
        
        each.addEventListener("change", () => {
            ticketType = Number(each.dataset.price);
            popupTtypeDisplay.textContent = each.value;
            popupTtypeInput.value = each.value;
            popupTtypeInput.dataset.price = each.dataset.price;
            popupTtypeDiaplayField.textContent = each.value;

            priceCalculation()
        })
        
    })

    basicQtyInput.addEventListener("input", function(){
        qtyBasic = this.value;

        const popupBasicQty = document.querySelector("#tBasic");
        popupBasicQty.value = this.value;
        popupBasicSubtotal.textContent = this.value;
        priceCalculation()
    })
    
    seniorQtyInput.addEventListener("input", function(){
        qtySenior = this.value;

        const popupSeniorsQty = document.querySelector("#tSeniors");
        popupSeniorsQty.value = this.value;
        popupSeniorSubtotal.textContent = this.value;
        priceCalculation()
    })

    document.querySelector("#input-date").addEventListener("input", function(){
        const dateDisplalyField = document.querySelector(".right-section .event-date");
        eventDate = this.value;
        dateDisplalyField.innerText = formatDate(this.value);
    })

    document.querySelector("#input-time").addEventListener("input", function(){
        const timeDisplalyField = document.querySelector(".right-section .event-time");
        eventTime = this.value;
        timeDisplalyField.innerText = this.value;
    })

    document.querySelector("#input-name").addEventListener("input", function(){
        clientName = this.value;
    })

    document.querySelector("#input-email").addEventListener("input", function(){
        clientEmail = this.value;
    })

    document.querySelector("#input-phone").addEventListener("input", function(){
        clientPhone = this.value;
    })

    popupTtypeInput.addEventListener("input", function(){
        ticketType = this.dataset.price
        popupTtypeDiaplayField.textContent = this.value;

        const radioToSelect = document.querySelector(`.radio-input input[value="${this.value}"]`)
        if (radioToSelect) {
            radioToSelect.checked = true;
        }
        priceCalculation()
    })
    
    document.querySelector("#tBasic").addEventListener("input", function(){
        qtyBasic = this.value;
        popupBasicSubtotal.textContent = this.value;
        basicQtyInput.value = this.value;
        priceCalculation()
    })
    
    document.querySelector("#tSeniors").addEventListener("input", function(){
        qtySenior = this.value;
        popupSeniorSubtotal.textContent = this.value;
        seniorQtyInput.value = this.value;
        priceCalculation()
    })

    
    function priceCalculation(){
        let totalBasic = ticketType * qtyBasic
        let totalSeniors = ticketType * qtySenior * 0.5;
        total = totalBasic + totalSeniors;


        const totalValue = document.querySelector("#totalValue");
        const popupTotalValue = document.querySelector("#popupTotalValue");
        const popupBasicSubtotalValue = document.querySelector("#popupBasicSubtotalValue");
        const popupSeniorSubtotalValue = document.querySelector("#popupSeniorSubtotalValue");

        const basicPrice1 = document.querySelector("#basicPrice1");
        const seniorPrice1 = document.querySelector("#seniorPrice1");
        const basicPrice2 = document.querySelector("#basicPrice2");
        const seniorPrice2 = document.querySelector("#seniorPrice2");
        basicPrice1.textContent = `Basic 18+ (${popupTtypeInput.dataset.price} €)`
        seniorPrice1.textContent = `Senior 65+ (${Number(popupTtypeInput.dataset.price) * 0.5} €)`
        basicPrice2.textContent = `Basic (${popupTtypeInput.dataset.price} €)`
        seniorPrice2.textContent = `Senior (${Number(popupTtypeInput.dataset.price) * 0.5} €)`

        popupBasicSubtotalValue.innerText = `${totalBasic} €`;
        popupSeniorSubtotalValue.textContent = `${totalSeniors} €`;
        totalValue.textContent = total;
        popupTotalValue.textContent = total;
    }


})()



function formatDate(input) {
    const [day, month, year] = input.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    
    const options = {weekday: "long", month: "long", day: "numeric"};
    
    return new Intl.DateTimeFormat("en-US", options).format(date);
}

