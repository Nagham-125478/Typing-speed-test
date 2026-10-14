const texts = {
    ar: "البرمجة هي عملية كتابة تعليمات ووجهات توجيه للحاسوب لكي يقوم بمهام محددة وتطوير تطبيقات ويب مذهلة باستخدام أحدث التقنيات واللغات البرمجية المختلفة.",
    en: "Programming is the process of creating a set of instructions that tell a computer how to perform a task. It allows developers to build amazing web applications using modern technologies."
};

const textDisplay = document.getElementById("textDisplay");
const inputField = document.getElementById("inputField");
const timerTag = document.getElementById("timer");
const accuracyTag = document.getElementById("accuracy");
const resetBtn = document.getElementById("resetBtn");
const langSelect = document.getElementById("langSelect");
const container = document.querySelector(".container");
const resultMessage = document.getElementById("resultMessage");

const instructionText = document.getElementById("instructionText");
const timerLabel = document.getElementById("timerLabel");
const secLabel = document.getElementById("secLabel");
const accLabel = document.getElementById("accLabel");

let timer;
let maxTime = 60;
let timeLeft = maxTime;
let charIndex = 0;
let mistakes = 0;
let isTyping = false;

function loadParagraph() {
    const currentLang = langSelect.value;
    const typingText = texts[currentLang];

    textDisplay.innerHTML = "";
    typingText.split("").forEach(char => {
        let span = `<span>${char}</span>`;
        textDisplay.innerHTML += span;
    });
    
    if (currentLang === 'ar') {
        textDisplay.setAttribute("dir", "rtl");
        inputField.setAttribute("dir", "rtl");
        container.classList.remove("ltr");
        instructionText.innerHTML = `قم بإعادة كتابة النص الظاهر في الصندوق أدناه بدقة، لديك <strong>دقيقة واحدة (60 ثانية)</strong> لإكمال الاختبار!`;
        timerLabel.innerText = "الوقت المتبقي:";
        secLabel.innerText = "ثانية";
        accLabel.innerText = "نسبة الدقة:";
        inputField.placeholder = "ابدأ الكتابة هنا فوراً...";
    } else {
        textDisplay.setAttribute("dir", "ltr");
        inputField.setAttribute("dir", "ltr");
        container.classList.add("ltr");
        instructionText.innerHTML = `Type the text displayed in the box below accurately, you have <strong>one minute (60 seconds)</strong> to complete the test!`;
        timerLabel.innerText = "Time Left:";
        secLabel.innerText = "seconds";
        accLabel.innerText = "Accuracy:";
        inputField.placeholder = "Start typing here immediately...";
    }

    textDisplay.querySelectorAll("span")[0].classList.add("active");
}

function initTyping() {
    const currentLang = langSelect.value;
    const typingText = texts[currentLang];
    const characters = textDisplay.querySelectorAll("span");
    const typedChar = inputField.value.split("")[charIndex];

    if (!isTyping) {
        timer = setInterval(initTimer, 1000);
        isTyping = true;
    }

    if (typedChar == null) {
        if (charIndex > 0) {
            charIndex--;
            if (characters[charIndex].classList.contains("incorrect")) {
                mistakes--;
            }
            characters[charIndex].classList.remove("correct", "incorrect");
        }
    } else {
        if (characters[charIndex].innerText === typedChar) {
            characters[charIndex].classList.add("correct");
        } else {
            mistakes++;
            characters[charIndex].classList.add("incorrect");
        }
        charIndex++;
    }

    characters.forEach(span => span.classList.remove("active"));
    
    // التحقق مما إذا أنهى المستخدم كتابة النص بالكامل (نجاح)
    if (charIndex < characters.length) {
        characters[charIndex].classList.add("active");
    } else {
        clearInterval(timer);
        inputField.disabled = true;
        showResult(true, currentLang); // إظهار رسالة النجاح
    }

    let accuracy = 100;
    if (charIndex > 0 && mistakes <= charIndex) {
        accuracy = Math.floor(((charIndex - mistakes) / charIndex) * 100);
    }
    accuracyTag.innerText = accuracy;
}

function initTimer() {
    const currentLang = langSelect.value;
    if (timeLeft > 0) {
        timeLeft--;
        timerTag.innerText = timeLeft;
    } else {
        clearInterval(timer);
        inputField.disabled = true;
        showResult(false, currentLang); // إظهار رسالة الفشل عند نفاد الوقت
    }
}

function showResult(isSuccess, lang) {
    resultMessage.className = "result-message"; // إعادة تعيين الكلاسات
    if (isSuccess) {
        resultMessage.classList.add("success");
        resultMessage.innerText = lang === 'ar' ? "🎉 مبروك! لقد نجحت وأنهيت النص في الوقت المحدد." : "🎉 Success! You completed the text on time.";
    } else {
        resultMessage.classList.add("fail");
        resultMessage.innerText = lang === 'ar' ? "❌ انتهى الوقت! لقد فشلت في إكمال النص، حاول مرة أخرى." : "❌ Time's up! You failed to complete the text, try again.";
    }
}

function resetGame() {
    clearInterval(timer);
    timeLeft = maxTime;
    charIndex = 0;
    mistakes = 0;
    isTyping = false;
    timerTag.innerText = timeLeft;
    accuracyTag.innerText = 100;
    inputField.value = "";
    inputField.disabled = false;
    resultMessage.className = "result-message"; // إخفاء رسالة النتيجة
    loadParagraph();
}

inputField.addEventListener("input", initTyping);
resetBtn.addEventListener("click", resetGame);
langSelect.addEventListener("change", resetGame);

loadParagraph();