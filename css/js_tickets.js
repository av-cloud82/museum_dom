const dateField = document.querySelector("#input-date");

datePickerConfig = {
    dateFormat: "d.m.Y",
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
[buyBtn, closeBtn].forEach((each) => {
    each.addEventListener("click", () => {
        document.querySelector("#tickets-popup").classList.toggle("show");
    })
})



// Here we show error
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
        console.log(groups);
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