const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

let financialData = {}; // 데이터를 저장할 객체

app.get('/', (req, res) => {
    res.json("연습");
});

// 데이터 저장 엔드포인트
app.post('/saveData', (req, res) => {
    const {  date, income, expense, description, howincome, howexpense } = req.body;
    
    // 입력된 값이 유효한지 검사

    // 수입이나 지출 중 하나라도 입력된 경우에만 데이터 저장
    if ((income !== "" && income!=="0" && howincome!=="선택하기")) {
        if ((expense !== "" && expense!=="0" && howexpense!=="선택하기")||((expense == "" || expense=="0") && howexpense=="선택하기")){
            if (!financialData[date]) {
                financialData[date] = [];
            }
    
            financialData[date].push({ income, expense, description, howincome, howexpense});
    
            return res.json({ message: '데이터가 성공적으로 저장되었습니다.' });
        }
    }


    if ((expense !== "" && expense!=="0" && howexpense!=="선택하기")) {
        if ((income !== "" && income!=="0" && howincome!=="선택하기")||((income == "" || income=="0") && howincome=="선택하기")){
            if (!financialData[date]) {
                financialData[date] = [];
            }

            financialData[date].push({ income, expense, description, howincome, howexpense});

            return res.json({ message: '데이터가 성공적으로 저장되었습니다.' });
        }
    }
    


});


// 데이터 가져오기 엔드포인트
app.get('/withnodetop/withnode/popup.html', (req, res) => {
    const date = req.query.date;
    const data = financialData[date] || [];
    res.json({ savedata: data });
});

// 데이터 초기화 엔드포인트
app.post('/resetData', (req, res) => {
    const { date } = req.body;
    if (financialData[date]) {
        delete financialData[date];
        res.json({ message: '데이터가 초기화되었습니다.' });
    } else {
        res.json({ message: '해당 날짜의 데이터가 없습니다.' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});