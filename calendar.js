// 기존의 모든 코드 위에 추가
window.resetDayData = resetDayData;

const currentDate = document.querySelector(".current");
const monthDays = document.querySelector(".days");
const twoButton = document.querySelectorAll(".btn");

let date = new Date();
let currentYear = date.getFullYear();
let currentMonth = date.getMonth();

const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

let financialData = {}; // 월별 데이터를 저장할 객체
let selectedDate = ''; // 선택된 날짜를 저장할 변수

function YearMonth() {
    let firstDayofMonth = new Date(currentYear, currentMonth, 1).getDay();
    let lastDateofMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let lastDayofMonth = new Date(currentYear, currentMonth, lastDateofMonth).getDay();
    let lastDateofPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofPrevMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear() ? "active" : "";
        liTag += `<li class="${isToday}">${i}<div class="income-expense"></div></li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }

    currentDate.innerText = `${currentYear}년 ${months[currentMonth]}`;
    monthDays.innerHTML = liTag;

    loadMonthlyData();

    const days = document.querySelectorAll('.calendar .days li');
    days.forEach(function(day) {
        day.addEventListener('click', function() {
            if (!this.classList.contains('inactive')) {
                selectedDate = this.innerText.trim().match(/\d+/)[0];
                let dayDate=this.innerText.trim().match(/\d+/)[0]
                let daydate = dayDate.padStart(2, '0');
                let nowmonth=months[currentMonth].trim().match(/\d+/)[0];
                nowmonth = nowmonth.padStart(2,'0');
                selectedDate2 = currentYear+nowmonth+daydate;

                newWindow(selectedDate2);
                // loadDayData(selectedDate); // 선택된 날짜의 데이터 로드
            }
        });
    });

    const liEl = document.querySelectorAll(".days li");
    for (let i = 6; i < liEl.length; i += 7) {
        // 6, 13, 20번째 요소 (인덱스 5, 12, 19)
        if (!liEl[i].classList.contains("inactive")) {
            liEl[i].style.color = "blue";
        }
    }
    for (let i = 0; i < liEl.length; i += 7) {
        // 0, 7, 14번째 요소 (일요일)
        if (!liEl[i].classList.contains("inactive")) {
            liEl[i].style.color = "red";
        }
    }

    liEl.forEach(function (li) {
        const day = li.innerText.trim().match(/\d+/)[0];
        const monthKey = `${currentYear}-${currentMonth}`;
        if (financialData[monthKey] && financialData[monthKey][day]) {
            const { income, expense } = financialData[monthKey][day];
            const incomeExpenseDiv = li.querySelector(".income-expense");
            incomeExpenseDiv.innerHTML = "";
            if (income > 0) {
                const incomeDiv = document.createElement("div");
                incomeDiv.id = "dayincome";
                incomeDiv.textContent = `수입: ${income}원`;
                incomeExpenseDiv.appendChild(incomeDiv);
            }
            if (expense > 0) {
                const expenseDiv = document.createElement("div");
                expenseDiv.id = "dayexpense";
                expenseDiv.textContent = `지출: ${expense}원`;
                incomeExpenseDiv.appendChild(expenseDiv);
            }
        }
    });
}

function handleClick(btn) {
    currentMonth = btn.id === "prev" ? currentMonth - 1 : currentMonth + 1;
    if (currentMonth < 0 || currentMonth > 11) {
        date = new Date(currentYear, currentMonth);
        currentYear = date.getFullYear();
        currentMonth = date.getMonth();
    } else {
        date = new Date();
    }
    YearMonth();
}

twoButton.forEach(addClickListener);

function addClickListener(btn) {
    btn.addEventListener("click", function() {
        handleClick(btn);
    });
}

function newWindow(selectedDate) {
    window.open(`popup.html?date=${selectedDate}`, "popup", "width=700, height=500, left=400, top=100");
}

window.getSelectedDate = function() {
    return selectedDate2;
}



// 일별 데이터 업데이트 (합산)
window.updateParentData = function(income, expense) {
    const monthKey = `${currentYear}-${currentMonth}`;
    if (!financialData[monthKey]) {
        financialData[monthKey] = {};
    }
    if (!financialData[monthKey][selectedDate]) {
        financialData[monthKey][selectedDate] = { income: 0, expense: 0 };
    }

    // 기존 값에 새로운 값 추가
    financialData[monthKey][selectedDate].income += parseInt(income);
    financialData[monthKey][selectedDate].expense += parseInt(expense);


    loadDayData(selectedDate); // 업데이트된 일별 데이터 로드
    loadMonthlyData(); // 월별 총 수입, 지출, 잔액 업데이트
};

function loadMonthlyData() {
    const monthKey = `${currentYear}-${currentMonth}`;
    const data = financialData[monthKey] || {};

    let totalIncome = 0;
    let totalExpense = 0;
    let totalBalance = 0;
    for (const date in data) {
        totalIncome += data[date].income;
        totalExpense += data[date].expense;
    }

    totalBalance = totalIncome - totalExpense;

    document.getElementById('incomeDisplay').innerText = `${months[currentMonth]} 총 수입 : ${totalIncome}원`;
    document.getElementById('expenseDisplay').innerText = `${months[currentMonth]} 총 지출 : ${totalExpense}원`;
    document.getElementById('currentmoney').innerText = `${months[currentMonth]} 총 잔액 : ${totalBalance}원`;

}

function loadDayData(selectedDate) {
    const monthKey = `${currentYear}-${currentMonth}`;

    const liEl = document.querySelectorAll('.days li');
    liEl.forEach((li) => {
        const day = li.innerText.trim().match(/\d+/)[0];
        if (day === selectedDate && !li.classList.contains('inactive')) {
            let incomeExpenseDiv = li.querySelector('.income-expense');
            if (!incomeExpenseDiv) {
                incomeExpenseDiv = document.createElement('div');
                incomeExpenseDiv.classList.add('income-expense');
                li.appendChild(incomeExpenseDiv);
            }

            if (financialData[monthKey][selectedDate]) {
                let incomeDiv = incomeExpenseDiv.querySelector('#dayincome');
                const newIncome = financialData[monthKey][selectedDate].income;

                if (!incomeDiv) {
                    incomeDiv = document.createElement('div');
                    incomeDiv.setAttribute('id', 'dayincome');
                    incomeExpenseDiv.appendChild(incomeDiv);
                }
                incomeDiv.textContent = `수입: ${newIncome}원`;

                let expenseDiv = incomeExpenseDiv.querySelector('#dayexpense');
                const newExpense = financialData[monthKey][selectedDate].expense;

                if (!expenseDiv) {
                    expenseDiv = document.createElement('div');
                    expenseDiv.setAttribute('id', 'dayexpense');
                    incomeExpenseDiv.appendChild(expenseDiv);
                }
                expenseDiv.textContent = `지출: ${newExpense}원`;
            }
        }
    });
}



function resetDayData() {
    const monthKey = `${currentYear}-${currentMonth}`;

    if (!financialData[monthKey] || !financialData[monthKey][selectedDate]) return;

    financialData[monthKey][selectedDate].income = 0;
    financialData[monthKey][selectedDate].expense = 0;

    loadDayData(selectedDate); // 초기화된 일별 데이터 로드
    loadMonthlyData(); // 초기화된 월별
}

YearMonth();