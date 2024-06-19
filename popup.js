let totalIncome = 0; // 총 수입을 저장할 변수
let totalExpense = 0; // 총 지출을 저장할 변수
let count = 1; // 결과 항목을 세기 위한 카운터




function resetData() {
    const date = new URLSearchParams(window.location.search).get('date');
    if (confirm("정말 데이터를 초기화 하시겠습니까?")) {
        // 서버에 데이터 초기화 요청을 보냅니다.
        fetch('http://localhost:3000/resetData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // 화면에서 데이터를 초기화합니다.
            document.getElementById('savedata').innerHTML = '';
        });
    }
    if (window.opener && typeof window.opener.resetDayData === "function") {
        window.opener.resetDayData();
        // window.close(); // 팝업 창 닫기
    } else {
        alert("부모 창과의 연결이 올바르지 않습니다.");
    }
};

function getData() {
    const date = new URLSearchParams(window.location.search).get('date'); // URL에서 date 파라미터 가져오기
    fetch(`http://localhost:3000/withnodetop/withnode/popup.html?date=${date}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayData(data.savedata);
        });
}


function newWindow() {
    window.open(`daycheck.html`, "checkday", "width=700, height=500, left=500, top=120");
}

function displayData(savedata) {
    const savedataElement = document.getElementById('savedata');
    savedataElement.innerHTML = '';

    let count = 1;
    savedata.forEach(entry => {
        const entryElement = document.createElement('div');
        entryElement.innerHTML = `${count}번째 입력: 수입(${entry.howincome}): ${entry.income}원, 지출(${entry.howexpense}): ${entry.expense}원`;
        savedataElement.appendChild(entryElement);
        count++;
    });
}

window.onload = function() {
    const contentFromIndex2 = window.opener.document.querySelector('.current').innerText;
    const days = window.opener.document.querySelectorAll('.calendar .days li');
    const h2El = document.querySelector("h2");
    const selectedDate = window.opener.getSelectedDate();
    h2El.innerHTML = `${selectedDate}일의 수입/지출 내역을 입력하세요.`;

    getData();
};

let daytotalIncome = 0;
let daytotalExpense = 0;

function submitData() {

    // 입력된 값 가져오기
    let income = document.getElementById('income').value;
    let expense = document.getElementById('expense').value;
    let howincome = document.getElementById('inc').value;
    let howexpense = document.getElementById('exp').value;
    const date = window.opener.getSelectedDate();

    // 입력된 값이 유효한지 검사
    if (((income === "" || income === "0") && howincome === "선택하기") && ((expense === "" || expense === "0") && howexpense === "선택하기")) {
        alert("수입 또는 지출 값 중 최소 하나는 입력하세요.");
        return;
    }

    if (howincome !== "선택하기" && (income === "" || income === "0")) {
        alert("수입 값을 입력하세요.");
        document.getElementById('income').focus();
        return;
    }

    if (income !== "" && income !== "0") {
        if (howincome === "선택하기") {
            alert("수입 경로를 선택하세요.");
            document.getElementById('inc').focus();
            return;
        }
    }

    if (howexpense !== "선택하기" && (expense === "" || expense === "0")) {
        alert("지출 값을 입력하세요.");
        document.getElementById('expense').focus();
        return;
    }

    if (expense !== "" && expense !== "0") {
        if (howexpense === "선택하기") {
            alert("지출 경로를 선택하세요.");
            document.getElementById('exp').focus();
            return;
        }
    }

    if (income === "") {
        income = 0;
    }

    if (expense === "") {
        expense = 0;
    }

    // 일의 총 수입과 총 지출 계산

    daytotalIncome +=parseInt(income);
    daytotalExpense +=parseInt(expense);


    // 결과를 표시할 div 요소를 가져옵니다.
    let result = document.getElementById('result');

    // 새로운 결과를 생성합니다.
    // let newResult = document.createElement('div');
    // newResult.classList.add('result-item');
    // newResult.innerHTML = `
    //     <p>${count}. 수입(${howincome}): ${income}원, 지출(${howexpense}): ${expense}원<br>
    //     총 수입: ${parseInt(totalIncome)}원, 총 지출: ${parseInt(totalExpense)}원, 총 잔액 : ${parseInt(totalIncome) - parseInt(totalExpense)}원</p>`;

    // // 생성한 결과를 결과 영역에 추가합니다.
    // result.appendChild(newResult);

    // 입력 완료 횟수를 증가시킵니다.
    count++;

    // 입력 후 입력 필드를 초기화합니다.
    document.getElementById('income').value = '';
    document.getElementById('expense').value = '';
    document.getElementById('inc').value = '선택하기';
    document.getElementById('exp').value = '선택하기';

    // 부모 창으로 데이터 전송
    window.opener.updateParentData(income, expense);

    // 서버에 데이터 저장 후, 새 데이터를 가져옴
    fetch('http://localhost:3000/saveData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date, howincome, income, howexpense, expense,description: '' })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        getData(); // 데이터 저장 후, 갱신된 데이터를 가져옴
    });
}