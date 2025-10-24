# JS_week7

## 專案簡介
本專案展示了如何整合第三方 JavaScript 套件（如 Axios、D3.js、C3.js）來實現旅遊套票管理功能。使用者可以新增旅遊套票、篩選地區、並透過圓餅圖視覺化各地區套票的分佈。

## 需求環境
- 瀏覽器：建議使用最新版本的 Chrome、Firefox 或 Edge。
- 開發工具：Visual Studio Code 或其他支援 HTML/CSS/JavaScript 的編輯器。

## 安裝與啟動
1. **下載專案**
   ```bash
   git clone https://github.com/TTW-TW/JS_week7.git
   cd JS_week7```

2. **啟動專案**
- 使用 Live Server：
  - 安裝 Live Server 擴充套件。
  - 在 VS Code 中右鍵 JS_week7.html，選擇「Open with Live Server」。
- 或直接打開 JS_week7.html 檔案於瀏覽器中。

## 檔案結構
JS_week7/
├── .git/                  # Git 版本控制資料夾
├── .gitattributes         # Git 屬性設定檔
├── [JS_week7.css](http://_vscodecontentref_/6)           # 自訂樣式檔案
├── [JS_week7.html](http://_vscodecontentref_/7)          # 主 HTML 檔案
├── [JS_week7.js](http://_vscodecontentref_/8)            # 主 JavaScript 檔案
├── [JS_week7_reset.css](http://_vscodecontentref_/9)     # CSS Reset 檔案
└── [README.md](http://_vscodecontentref_/10)              # 專案說明文件


## 主要功能
1. 新增旅遊套票
- 使用者可透過表單新增旅遊套票，並即時更新至頁面。
2. 地區篩選
- 提供下拉選單篩選特定地區的套票。
3. 圓餅圖視覺化
- 使用 C3.js 動態生成圓餅圖，顯示各地區套票的比例。
4. 表單驗證
- 驗證輸入的數值範圍與必填欄位，確保資料正確性。

## 使用方法
1. 開啟專案後，進入主頁面。
2. 在「新增旅遊套票」表單中填寫資料，點擊「新增」按鈕。
3. 使用地區篩選功能查看特定地區的套票。
4. 查看右上角的圓餅圖，了解各地區套票的分佈。

## 可配置變數
地區選項：可在 HTML 中的 <select> 元素中新增或修改地區選項。
圓餅圖顏色：可在 JS_week7.js 中的 color.pattern 屬性中調整。

