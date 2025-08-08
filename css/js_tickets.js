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
            console.log(m)
            slots.push(`${h}:${m}`);

            current.setMinutes(current.getMinutes() + step);
        }
        console.log(slots);
        return slots;
    }
}());



// Here we make dropdowns work
document.querySelectorAll(".dropdown").forEach((dropdown) => {
    console.log(dropdown);
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