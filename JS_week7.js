
/** 
================渲染套票：思路總說明===========
1. 創建一個大陣列，收納所有前端應顯示的套票資料
    - 函數1【根據下拉選單地區，展示商品卡片及選中筆數】
    - 函數2【更新實際查詢筆數文字】
    - 函式3【建立資料轉換成變數 + 組成 innerHTML 模板】
    - 函式4【創建並更新圓餅圖圖表所需陣列】
2. axios：將 api 的 3 筆 data 資料添加到大陣列前端進行渲染
3. 監聽使用者在前端的 input 提交，
    3-1 先進行表單驗證(包含數值型態規則、欄位必填)，
    3-2 取得前端當前 input 值，添加至大陣列的末端(以利下一階段區域篩選)，
    3-3 將大陣列的最後一筆結果渲染至前端(以利input完成當下即時展示)
(新增)4. 執行函數1【根據下拉選單地區，展示商品卡片及選中筆數】
====================================
**/

// 1.創建一個大陣列，收納所有已新增的套票資訊，後續地區篩選也使用這個陣列
const currentDataArray = []; 
let  idCount = 0; // 大陣列的id，與既有data 的 id 區隔

// 更新下方「本次搜尋共 n 筆資料」內容
const searchResultText = document.querySelector('.search-result');
let currentTicketNum = currentDataArray.length;


// 函數1【根據下拉選單地區，展示商品卡片及選中筆數】
const ulInsertTicket = document.querySelector('ul.ticketCard-section')
const areaChoose = document.querySelector('select.form-select-second'); // 父親
const cantFindArea = document.querySelector('.cantFind-area')

function showNumByArea (area){
    // 先清空所有套票列表
    ulInsertTicket.innerHTML = '';

    let chosenDataArray = {};

    // 2. 利用 value 的值， 搭配filter 篩選大陣列中的指定地區的套票列表，渲染在前端
    if (!(area === '全部地區' )){
        chosenDataArray = currentDataArray.filter(item => {
            return item['area'] === area ;
        });

        // console.log(event.target.value); //  value選擇台北，就會返還台北的結果
    } else {
        // 如果是全部地區，就直接把大陣列的值賦予給被選中的陣列
        chosenDataArray = currentDataArray;
    }; 

    // 將被選中的陣列添加到前端套票列表
    chosenDataArray.forEach(element => { 
        //添加到 ul 末端，運用已經事先寫好的 innerHTML模板
        ulInsertTicket.insertAdjacentHTML('beforeend', dataValueToHTML(element));
    });

    // 3.更新本次選中的「筆數」
    const chosenTicketNum = chosenDataArray.length;
    showTotalProduct(chosenTicketNum);

    // 切換查無資料的class
    
    if (chosenTicketNum === 0){
        cantFindArea.classList.add('appear');
    } else {
        cantFindArea.classList.remove('appear');
    }
};

// 函數2【更新實際查詢筆數文字】
function showTotalProduct(productNumber){
    searchResultText.textContent = `本次搜尋共 ${productNumber} 筆資料`;
};

// 函式3【建立資料轉換成變數 + 組成 innerHTML 模板】
// 運用【物件解構Object Destructuring】在迴圈內直接定義為變數，並套用至模板
function dataValueToHTML(element){
    const { // 物件解構
        name, // 0 套票名稱
        imgUrl, // 1 圖片網址
        area, // 2 景點地區 (下拉選單)
        price, // 3 套票金額
        group, // 4 套票組數
        rate, // 5 套票星級 (數值選單)
        description // 6 套票描述 
    } = element;

    // 要渲染在前端的模板文字
    
    const liNewTicket =
    `<li class=" ticketCard  shadow-sm d-flex flex-column">
        <!--圖片(超連結) + 地區(鄉對定位)-->
        <div class="relative">
            <div class=" absolute">
                <div class="ticketCard-area">${area}</div>
            </div>
            <div class="ticketCard-img-wrapper">
                <a href="#" >
                    <img class="ticketCard-img" src="${imgUrl}" alt="">
                </a>
            </div>
        </div>
        <!--名稱(超連結) + 描述 + 評分(鄉對定位)-->
        <div class="p-3 relative mt-3 flex-grow-1" >
            <div class=" absolute">
                <div class="ticketCard-rate">${rate}</div>
            </div>
            
            <a href="#"><p class="ticketCard-name">${name}</p></a>
            <p class="ticketCard-description neutal600-sm">${description}</p>
        </div>
        <!--套票數量 + 價格 -->
        <div class="p-3 d-flex justify-between align-items-center ">
            <p class="primary400-sm fw-bold d-flex mb-0 gap-1" >
                <i class="bi bi-exclamation-circle-fill"></i>
                剩下最後<span class="ticketCard-group">${group}</span>組
            </p>
            <p class="primary400-sm fw-bold d-flex align-items-center gap-1 mb-0">TWD <span class="label-xl ticketCard-price">$${Number(price).toLocaleString('en-US')}</span> </p>
        </div>
    </li>
    `
    return liNewTicket;
};

// 函式4【創建並更新圓餅圖圖表所需陣列】
let chart = null; // 把圖表擺在全域變數

function areaCount(dataArray) {
    let areaCountObj = {};
    dataArray.forEach (function(item){
        if (!(item['area'] in areaCountObj ) && item['area'] !== undefined){
            areaCountObj[item['area']] = 1;
        } else {
            areaCountObj[item['area']] ++;
        }
    });

    let donutArray = Object.entries(areaCountObj);

    // 加入甜甜圈
    if (!chart){
        // 如果是新載入網頁，chart還未被定義，才使用c3.generate生成
        chart = c3.generate({
            bindto: '#donutChart',
            data: {
                columns:donutArray,
                type : 'donut',
            },
            donut: {
                title: "套票地區比重",
                width: 20, // 數值越小，圓環越細
                label: {
                    show: false
                },
            },

            size: {
                height: 200, // 增加高度
                width: 250   // 增加寬度
            },
            legend: {
                position: 'right' 
                // 預設是 'buttom',
            },
            color: {
                pattern: ['#26be86ff', '#ffd43b', '#6fd7e3ff', '#a3be8c', '#009acd', '#f0a056ff', '#dae277ff']// 示例顏色，請根據您的設計圖調整
            }
        });
    } else {
        // 如果chart已經生成，那只需要chart.load更新資料(減少效能))
        chart.load({
            columns:donutArray,
        });
    }

};

//  2.axios：將 api 的 3 筆 data 資料添加到大陣列前端進行渲染

let data;

axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json')
    .then(response => {
    data = response.data;

    // 將API data 資料添加到大陣列前端進行渲染
    // 清空 ul 內既有的資料
    ulInsertTicket.innerHTML = ''

    data.forEach(element => { 
            element['idTotal'] = (currentDataArray.length - 1) + 1;
            currentDataArray.push(element)

            //添加到 ul 末端，運用已經事先寫好的 innerHTML模板
            ulInsertTicket.insertAdjacentHTML('beforeend', dataValueToHTML(element));

            // 更新本次選中的筆數
            currentTicketNum = currentDataArray.length;
            showTotalProduct(currentTicketNum);
        });

    areaCount(currentDataArray);
    

    })
    .catch(error => {
    console.error('Error:', error);
    })
    .finally(() => {    
    });



// 3. 監聽使用者在前端的 input 提交，先進行表單驗證，添加至 data 末端(才能編列id)，並渲染至前端

const addTicketForm = document.querySelector('.addTicket-form')
const addTicketBtn = document.querySelector('button.submit-btn');

// 以下是 3-1 先進行表單驗證(包含數值型態規則、欄位必填) 所需參數
const priceInput = document.querySelector('#ticketInput-price');
const priceMin = Number(priceInput.min);
const priceMax = Number(priceInput.max);
const groupInput  = document.querySelector('#ticketInput-group');
const groupMin = Number(groupInput.min);
const groupMax = Number(groupInput.max);
const rateInput = document.querySelector('#ticketInput-rate');
const rateMin = Number(rateInput.min);
const rateMax = Number(rateInput.max);

addTicketBtn.addEventListener('click', function(event) {

    event.preventDefault(); // 取消系統預設行為，要留意會把表單驗證也清除
    event.stopPropagation(); // 阻止事件向上傳播

    // 3-1 先進行表單驗證(包含數值型態規則、欄位必填)
    // 表單驗證：數值型態檢查
    // 定義 Number型態變數 (不能放全域，因為要click後才賦值)
    const priceValue = priceInput.value;
    const groupValue = groupInput.value;
    const rateValue = rateInput.value;

    // 金額數值驗證
    if (priceValue !== ''){
        const invalidMessage = priceInput.nextElementSibling; // 因為沒有唯一識別id，用此方式找到 price 的錯誤訊息標籤div.invalid-feedback
        if (priceValue < priceMin || priceValue > priceMax ){ // 沒通過驗證
            // 確保有此標籤且是我們要尋找的目標
            if (invalidMessage && invalidMessage.classList.contains('invalid-feedback')){ // 第一個invalidMessage是為了避免invalidMessage是null造成程式崩潰(若沒加，程式會試著在null上使用contain造成短路；若有加，程式會回傳null)
                invalidMessage.innerText = `金額數值必須介於${Number(priceMin).toLocaleString('en-US')}至${Number(priceMax).toLocaleString('en-US')}之間!`;
            };
        } else if (priceValue % 1 !==0) {
            if (invalidMessage && invalidMessage.classList.contains('invalid-feedback')){ // 第一個invalidMessage是為了避免invalidMessage是null造成程式崩潰(若沒加，程式會試著在null上使用contain造成短路；若有加，程式會回傳null)
                invalidMessage.innerText = '金額必須為整數!';
            };           
        }  
        else { // 通過驗證，但有可能是從不通過變成通過，因此必須重設字串
            priceInput.setCustomValidity(''); // 再次設定為空字串
            
            // 確保有此標籤且是我們要尋找的目標
            if (invalidMessage && invalidMessage.classList.contains('invalid-feedback')){ // 第一個invalidMessage是為了避免invalidMessage是null造成程式崩潰(若沒加，程式會試著在null上使用contain造成短路；若有加，程式會回傳null)
                invalidMessage.innerText = '尚未填寫金額!';
            }
        }
    };

    // 組數數值驗證(只能為整數))
    if (groupValue !== ''){
        const invalidMessage = groupInput.nextElementSibling; // 因為沒有唯一識別id，用此方式找到 group 的錯誤訊息標籤div.invalid-feedback
        if (groupValue < groupMin || groupValue > groupMax){ // 沒通過驗證
            // 確保有此標籤且是我們要尋找的目標
            if (invalidMessage && invalidMessage.classList.contains('invalid-feedback')){ // 第一個invalidMessage是為了避免invalidMessage是null造成程式崩潰(若沒加，程式會試著在null上使用contain造成短路；若有加，程式會回傳null)
                invalidMessage.innerText = `套票組數必須介於${Number(groupMin).toLocaleString('en-US')}至${Number(groupMax).toLocaleString('en-US')}之間!`;
            };
        } else if (groupValue % 1 !==0) {
            if (invalidMessage && invalidMessage.classList.contains('invalid-feedback')){ // 第一個invalidMessage是為了避免invalidMessage是null造成程式崩潰(若沒加，程式會試著在null上使用contain造成短路；若有加，程式會回傳null)
                invalidMessage.innerText = '請輸入整數!';
            };           
        } 
        else { // 通過驗證，但有可能是從不通過變成通過，因此必須重設字串
            groupInput.setCustomValidity(''); // 再次設定為空字串
            
            // 確保有此標籤且是我們要尋找的目標
            if (invalidMessage && invalidMessage.classList.contains('invalid-feedback')){ // 第一個invalidMessage是為了避免invalidMessage是null造成程式崩潰(若沒加，程式會試著在null上使用contain造成短路；若有加，程式會回傳null)
                invalidMessage.innerText = '尚未填寫金額!';
            }
        }
    };

    // 星級數值驗證(含大小值)
    if (rateValue !== ''){
        const invalidMessage = rateInput.nextElementSibling; // 因為沒有唯一識別id，用此方式找到 rate 的錯誤訊息標籤div.invalid-feedback
        if (rateValue < rateMin || rateValue > rateMax){ // 沒通過驗證
            // 確保有此標籤且是我們要尋找的目標
            if (invalidMessage && invalidMessage.classList.contains('invalid-feedback')){ // 第一個invalidMessage是為了避免invalidMessage是null造成程式崩潰(若沒加，程式會試著在null上使用contain造成短路；若有加，程式會回傳null)
                invalidMessage.innerText = `星級數值必須介於${rateMin}至${rateMax}之間!`;
            };
        } else { // 通過驗證，但有可能是從不通過變成通過，因此必須重設字串
            rateInput.setCustomValidity(''); // 再次設定為空字串
            
            // 確保有此標籤且是我們要尋找的目標
            if (invalidMessage && invalidMessage.classList.contains('invalid-feedback')){ // 第一個invalidMessage是為了避免invalidMessage是null造成程式崩潰(若沒加，程式會試著在null上使用contain造成短路；若有加，程式會回傳null)
                invalidMessage.innerText = '尚未填寫星級!';
            }
        }
    };

    // 表單驗證：必填欄位檢(所有必填欄位)
    if (addTicketForm.checkValidity() === false) { // 如果表單無效 (有欄位沒填寫)
        // was-validated：表示表單驗證狀態已經被觸發 (要寫在 form)
        // needs-validation：表示表單驗證狀態還沒被觸發 (要寫在form)
        // required：form 當中需要被驗證的欄位 (要寫在 input)
        // invalid-feedback：無效輸入時的說明(欲設會帶入寫在html內的.invalid-feedback)
        // setCustomValidity("")：自定義錯誤訊息

        addTicketForm.classList.add('was-validated'); // 顯示錯誤訊息
        return; // 類似 break，會結束function且不執行後續的函數，先顯示錯誤訊息
    }

    // 如果通過表單驗證，就開始取值，準備寫入下方卡片區
    const ticketId = (currentDataArray.length - 1) + 1; // idTotal 持續往下編列(不考慮刪除)

    // 3-2 取得前端當前 input 值，添加至大陣列的末端(以利下一階段區域篩選)，
    const dataUserInput = {
        "idTotal": Number(ticketId),
        "id": '',
        "name": String(document.getElementById("ticketInput-name").value),
        "imgUrl": String(document.getElementById("ticketInput-img").value),
        "area": String(document.getElementById("ticketInput-area").value),
        "description": String(document.getElementById("ticketInput-description").value),
        "group": Number(document.getElementById("ticketInput-group").value),
        "price": Number(document.getElementById("ticketInput-price").value),
        "rate": Number(document.getElementById("ticketInput-rate").value)
    }

    currentDataArray.push(dataUserInput); // 大陣列資料已更新
    areaCount(currentDataArray); // 更新圓餅圖
    
    // 3-3 將大陣列的最後一筆結果渲染至前端(以利input完成當下即時展示)
    // const addLastTicket = currentDataArray[currentDataArray.length - 1]; // data 內的最後一筆    
    // ulInsertTicket.insertAdjacentHTML('beforeend', dataValueToHTML(addLastTicket));

    // 更新本次選中的筆數(確認當前選擇的地區，決定顯示在前端的筆數和卡片)
    const area = areaChoose.value;
    showNumByArea (area)
    
    // 清空前端 input 內容
    addTicketForm.reset();

    // 移除 was-validated，這樣下次 user input時才可以繼續驗證
    addTicketForm.classList.remove('was-validated');

});

/** 
================地區篩選：思路總說明===========
1. 監聽 <select> 元素 的 change 事件，並從 event.target.value 取得選取的值
2. 執行函數【根據下拉選單地區，展示商品卡片及選中筆數】
====================================
**/

// 1. 監聽 <select> 元素 的 change 事件，並從 event.target.value 取得選取的值

//  <select> 元素通常監聽 'change' 事件
areaChoose.addEventListener('change', function(event) {  
    // ulInsertTicket.innerHTML = ''
    const areaName = event.target.value;
    showNumByArea (areaName);

});







// 主線任務5-資料備分
// let data = [
//     {
//     "id": 0,
//     "name": "肥宅心碎賞櫻3日",
//     "imgUrl": "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80",
//     "area": "高雄",
//     "description": "賞櫻花最佳去處。肥宅不得不去的超讚景點！",
//     "group": 87,
//     "price": 1400,
//     "rate": 10
//     },
//     {
//     "id": 1,
//     "name": "貓空纜車雙程票",
//     "imgUrl": "https://images.unsplash.com/photo-1501393152198-34b240415948?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
//     "area": "台北",
//     "description": "乘坐以透明強化玻璃為地板的「貓纜之眼」水晶車廂，享受騰雲駕霧遨遊天際之感",
//     "group": 99,
//     "price": 240,
//     "rate": 2
//     },
//     {
//     "id": 2,
//     "name": "台中谷關溫泉會1日",
//     "imgUrl": "https://images.unsplash.com/photo-1535530992830-e25d07cfa780?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80",
//     "area": "台中",
//     "description": "全館客房均提供谷關無色無味之優質碳酸原湯，並取用八仙山之山冷泉供蒞臨貴賓沐浴及飲水使用。",
//     "group": 20,
//     "price": 1765,
//     "rate": 7
//     }
// ];
