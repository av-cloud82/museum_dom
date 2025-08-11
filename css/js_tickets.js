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

ticketsPopup.addEventListener("click", (e) => {
    e.stopPropagation();
});



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
        const groups = value.split(/[- ]+/); // разделение по пробелам/дефисам
        const allDigits = groups.join('');
        const isAllDigitsOnly = /^\d*$/.test(allDigits);

        // Если есть разделители, каждая группа — строго 2 или 3 цифры
        const hasSeparators = /[- ]/.test(value);
        const validGroupLengths = hasSeparators
            ? groups.every(g => /^\d{2,3}$/.test(g))
            : true;

        if (!isAllDigitsOnly) {
            validationError(phoneField, "Only digits, '-' or spaces");
        } else if (allDigits.length > 10) {
            validationError(phoneField, "10 digits max");
        } else if (!validGroupLengths) {
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
        clientName, clientEmail, clientPhone,
        total;


    const radioTtypeSelect = document.querySelectorAll(".radio-container input")
    const basicQtyInput = document.querySelector("#adultsInput");
    const seniorQtyInput = document.querySelector("#seniors");

    const popupTtypeDisplay = document.querySelector("#popup-ttype-display");
    const popupTtypeInput = document.querySelector("#popup-ttype-input");
    const popupTtypeDiaplayField = document.querySelector(".right-section .event-type");
    const popupBasicSubtotal = document.querySelector("#popupBasicSubtotal");
    const popupSeniorSubtotal = document.querySelector("#popupSeniorSubtotal");
    
    function saveToSession() {
        sessionStorage.setItem("ticketType", ticketType);
        sessionStorage.setItem("qtyBasic", qtyBasic);
        sessionStorage.setItem("qtySenior", qtySenior);
        sessionStorage.setItem("eventDate", eventDate);
        sessionStorage.setItem("eventTime", eventTime);
        sessionStorage.setItem("clientName", clientName);
        sessionStorage.setItem("clientEmail", clientEmail);
        sessionStorage.setItem("clientPhone", clientPhone);
        sessionStorage.setItem("total", total);
    }

    function loadFromSession() {
        ticketType = Number(sessionStorage.getItem("ticketType")) || 20;
        qtyBasic = Number(sessionStorage.getItem("qtyBasic")) || 0;
        qtySenior = Number(sessionStorage.getItem("qtySenior")) || 0;
        eventDate = sessionStorage.getItem("eventDate") || "";
        eventTime = sessionStorage.getItem("eventTime") || "";
        clientName = sessionStorage.getItem("clientName") || "";
        clientEmail = sessionStorage.getItem("clientEmail") || "";
        clientPhone = sessionStorage.getItem("clientPhone") || "";

        const popupTtypeDiaplayField = document.querySelector(".right-section .event-type");
        const popupTtypeInput = document.querySelector("#popup-ttype-input");
        const popupTtypeDisplay = document.querySelector("#popup-ttype-display");

        // Для восстановления radio по ticketType ищем radio с data-price == ticketType
        const radioToSelect = Array.from(document.querySelectorAll(".radio-container input")).find(
            radio => Number(radio.dataset.price) === ticketType
        );

        if (radioToSelect) {
            radioToSelect.checked = true;
            popupTtypeInput.value = radioToSelect.value;
            popupTtypeInput.dataset.price = radioToSelect.dataset.price;
            popupTtypeDisplay.textContent = radioToSelect.value;
            popupTtypeDiaplayField.textContent = radioToSelect.value;
        }

        const basicQtyInput = document.querySelector("#adultsInput");
        const seniorQtyInput = document.querySelector("#seniors");
        basicQtyInput.value = qtyBasic;
        seniorQtyInput.value = qtySenior;

        const tBasicInput = document.querySelector("#tBasic");
        const tSeniorsInput = document.querySelector("#tSeniors");
        tBasicInput.value = qtyBasic;
        tSeniorsInput.value = qtySenior;

        const popupBasicSubtotal = document.querySelector("#popupBasicSubtotal");
        const popupSeniorSubtotal = document.querySelector("#popupSeniorSubtotal");
        popupBasicSubtotal.textContent = qtyBasic;
        popupSeniorSubtotal.textContent = qtySenior;

        const dateInput = document.querySelector("#input-date");
        const timeInput = document.querySelector("#input-time");
        const dateDisplalyField = document.querySelector(".right-section .event-date");
        const timeDisplalyField = document.querySelector(".right-section .event-time");

        dateInput.value = eventDate;
        dateDisplalyField.innerText = eventDate ? formatDate(eventDate) : "––";

        timeInput.value = eventTime;
        timeDisplalyField.innerText = eventTime || "––";

        const selectedTime = document.querySelector("#selected-time");
        if (selectedTime) {
            selectedTime.textContent = eventTime || "Time";
        }

        const nameInput = document.querySelector("#input-name");
        const emailInput = document.querySelector("#input-email");
        const phoneInput = document.querySelector("#input-phone");

        nameInput.value = clientName;
        emailInput.value = clientEmail;
        phoneInput.value = clientPhone;
        priceCalculation();
    }
    loadFromSession();

    // ticketType = 20;
    // qtyBasic = 0;
    // qtySenior = 0;
    // total = 0;



    radioTtypeSelect.forEach((each) => {
        
        each.addEventListener("change", () => {
            ticketType = Number(each.dataset.price);
            popupTtypeDisplay.textContent = each.value;
            popupTtypeInput.value = each.value;
            popupTtypeInput.dataset.price = each.dataset.price;
            popupTtypeDiaplayField.textContent = each.value;

            priceCalculation()
            saveToSession();
        })
        
    })

    basicQtyInput.addEventListener("input", function(){
        qtyBasic = this.value;

        const popupBasicQty = document.querySelector("#tBasic");
        popupBasicQty.value = this.value;
        popupBasicSubtotal.textContent = this.value;
        priceCalculation();
        saveToSession();
    })
    
    seniorQtyInput.addEventListener("input", function(){
        qtySenior = this.value;

        const popupSeniorsQty = document.querySelector("#tSeniors");
        popupSeniorsQty.value = this.value;
        popupSeniorSubtotal.textContent = this.value;
        priceCalculation();
        saveToSession();
    })

    document.querySelector("#input-date").addEventListener("input", function(){
        const dateDisplalyField = document.querySelector(".right-section .event-date");
        eventDate = this.value;
        dateDisplalyField.innerText = formatDate(this.value);
        saveToSession();
    })

    document.querySelector("#input-time").addEventListener("input", function(){
        const timeDisplalyField = document.querySelector(".right-section .event-time");
        eventTime = this.value;
        timeDisplalyField.innerText = this.value;
        saveToSession();
    })

    document.querySelector("#input-name").addEventListener("input", function(){
        clientName = this.value;
        saveToSession();
    })

    document.querySelector("#input-email").addEventListener("input", function(){
        clientEmail = this.value;
        saveToSession();
    })

    document.querySelector("#input-phone").addEventListener("input", function(){
        clientPhone = this.value;
        saveToSession();
    })

    popupTtypeInput.addEventListener("input", function(){
        ticketType = this.dataset.price
        popupTtypeDiaplayField.textContent = this.value;

        const radioToSelect = document.querySelector(`.radio-input input[value="${this.value}"]`)
        if (radioToSelect) {
            radioToSelect.checked = true;
        }
        priceCalculation()
        saveToSession();
    })
    
    document.querySelector("#tBasic").addEventListener("input", function(){
        qtyBasic = this.value;
        popupBasicSubtotal.textContent = this.value;
        basicQtyInput.value = this.value;
        priceCalculation()
        saveToSession();
    })
    
    document.querySelector("#tSeniors").addEventListener("input", function(){
        qtySenior = this.value;
        popupSeniorSubtotal.textContent = this.value;
        seniorQtyInput.value = this.value;
        priceCalculation()
        saveToSession();
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

        saveToSession();
    }


})()



function formatDate(input) {
    const [day, month, year] = input.split('.').map(Number);
    const date = new Date(year, month - 1, day);
    
    const options = {weekday: "long", month: "long", day: "numeric"};
    
    return new Intl.DateTimeFormat("en-US", options).format(date);
}

