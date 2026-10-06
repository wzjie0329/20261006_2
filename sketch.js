/*
 * p5.js 簡易指令選擇題測驗
 * 這份程式可以直接貼入既有 p5.js 專案的 sketch.js 檔案。
 */

// 宣告所有測驗題目的資料，方便之後新增、修改或重新排列題目。
const questions = [
  {
    // 設定第一題的題目文字。
    question: "在 p5.js 中，哪一個指令可以建立畫布？",
    // 設定第一題的四個選項。
    options: ["createCanvas()", "makeCanvas()", "newCanvas()", "canvasCreate()"],
    // 設定正確答案的索引值，索引從 0 開始。
    correctIndex: 0
  },
  {
    // 設定第二題的題目文字。
    question: "在 p5.js 中，哪一個指令可以設定畫布的背景顏色？",
    // 設定第二題的四個選項。
    options: ["fill()", "background()", "stroke()", "colorCanvas()"],
    // 設定正確答案的索引值。
    correctIndex: 1
  },
  {
    // 設定第三題的題目文字。
    question: "ellipse(100, 100, 50, 50) 會畫出哪一種圖形？",
    // 設定第三題的四個選項。
    options: ["矩形", "三角形", "圓形或橢圓形", "直線"],
    // 設定正確答案的索引值。
    correctIndex: 2
  },
  {
    // 設定第四題的題目文字。
    question: "在 p5.js 中，哪一個函式會在滑鼠被按下時執行？",
    // 設定第四題的四個選項。
    options: ["mousePressed()", "mouseClickedOnly()", "whenMouseDown()", "pressMouse()"],
    // 設定正確答案的索引值。
    correctIndex: 0
  },
  {
    // 設定第五題的題目文字。
    question: "rect(20, 30, 100, 60) 中的四個數字通常代表什麼？",
    // 設定第五題的四個選項。
    options: ["顏色與透明度", "x、y、寬度、高度", "四個角的角度", "速度與方向"],
    // 設定正確答案的索引值。
    correctIndex: 1
  }
];

// 記錄目前正在作答的題目索引值。
let currentQuestionIndex = 0;

// 記錄使用者目前答對的題數。
let score = 0;

// 記錄目前題目的作答狀態：未作答、答對或答錯。
let answerState = "unanswered";

// 記錄使用者選到的選項索引值，尚未選擇時使用 -1。
let selectedOptionIndex = -1;

// 記錄顯示在題目下方的回饋文字。
let feedbackMessage = "請選擇一個答案。";

// 儲存四個由 createButton 動態建立的選項按鈕。
let optionButtons = [];

// 儲存「下一題」按鈕。
let nextButton;

// 儲存「重新開始」按鈕。
let restartButton;

// 記錄動畫開始的時間，用來讓正確答案上下跳動。
let animationStartTime = 0;

// 設定答錯時正確選項的背景顏色。
const correctAnswerColor = "#8da9c4";

// 設定使用者點選錯誤選項時的背景顏色。
const wrongAnswerColor = "#ffcad4";

// p5.js 的初始化函式只會執行一次。
function setup() {
  // 建立與瀏覽器視窗一樣大的畫布。
  createCanvas(windowWidth, windowHeight);

  // 移除瀏覽器預設的 body 外距，讓畫布真正貼齊視窗邊緣。
  document.body.style.margin = "0";

  // 隱藏畫布溢出的內容，避免按鈕造成水平捲軸。
  document.body.style.overflow = "hidden";

  // 設定整個頁面的基本字型。
  document.body.style.fontFamily = "Arial, Noto Sans TC, sans-serif";

  // 建立四個選項按鈕與其他控制按鈕。
  createInterfaceButtons();

  // 根據目前畫面尺寸安排所有按鈕的位置。
  layoutInterfaceButtons();

  // 將畫面初始化為第一題。
  updateInterface();
}

// p5.js 的繪圖函式會以動畫方式持續執行。
function draw() {
  // 使用柔和的淺色背景清除上一幀畫面。
  background("#f4f7fb");

  // 判斷是否已經完成所有題目。
  if (currentQuestionIndex >= questions.length) {
    // 顯示測驗完成畫面。
    drawResultScreen();
  } else {
    // 顯示目前題目的文字與測驗資訊。
    drawQuestionScreen();
  }

  // 只有答錯時，才讓正確選項持續上下跳動。
  animateCorrectAnswer();
}

// 建立所有由 p5.js 控制的互動按鈕。
function createInterfaceButtons() {
  // 使用 for 迴圈依照四個選項建立按鈕，避免重複撰寫相同程式碼。
  for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
    // 建立一個初始文字為空的 p5.js 按鈕。
    const optionButton = createButton("");

    // 設定按鈕的基本外觀。
    styleOptionButton(optionButton);

    // 使用區域變數記住目前這顆按鈕所代表的選項索引值。
    optionButton.mousePressed(function () {
      // 將使用者的選擇交給統一的答題函式處理。
      answerQuestion(optionIndex);
    });

    // 將建立好的按鈕加入選項按鈕陣列。
    optionButtons.push(optionButton);
  }

  // 建立答題後才會顯示的下一題按鈕。
  nextButton = createButton("下一題");

  // 設定下一題按鈕的基本外觀。
  styleActionButton(nextButton);

  // 按下下一題按鈕時，切換到下一題或結果畫面。
  nextButton.mousePressed(goToNextQuestion);

  // 建立完成畫面使用的重新開始按鈕。
  restartButton = createButton("重新開始");

  // 設定重新開始按鈕的基本外觀。
  styleActionButton(restartButton);

  // 按下重新開始按鈕時，重設整份測驗。
  restartButton.mousePressed(restartQuiz);
}

// 設定選項按鈕的 CSS 樣式，但不需要額外建立 HTML 或 CSS 檔案。
function styleOptionButton(button) {
  // 設定按鈕文字靠左對齊，方便閱讀較長的選項。
  button.style("text-align", "left");

  // 設定按鈕內距，讓文字不要貼著邊緣。
  button.style("padding", "14px 18px");

  // 設定按鈕文字大小。
  button.style("font-size", "clamp(16px, 2vw, 21px)");

  // 設定按鈕文字顏色。
  button.style("color", "#17324d");

  // 設定按鈕背景顏色。
  button.style("background-color", "#ffffff");

  // 設定按鈕外框顏色與寬度。
  button.style("border", "2px solid #b7c9dc");

  // 設定按鈕圓角。
  button.style("border-radius", "12px");

  // 設定滑鼠移到按鈕上時顯示手形游標。
  button.style("cursor", "pointer");

  // 設定按鈕的盒模型，讓寬度計算包含內距與外框。
  button.style("box-sizing", "border-box");

  // 設定按鈕的轉換效果，讓上下跳動更加平滑。
  button.style("transition", "transform 0.08s ease");
}

// 設定下一題與重新開始按鈕的共同外觀。
function styleActionButton(button) {
  // 設定按鈕文字大小。
  button.style("font-size", "clamp(16px, 2vw, 20px)");

  // 設定按鈕文字顏色。
  button.style("color", "#ffffff");

  // 設定按鈕背景顏色。
  button.style("background-color", "#315b7d");

  // 設定按鈕內距。
  button.style("padding", "12px 28px");

  // 設定按鈕外框。
  button.style("border", "none");

  // 設定按鈕圓角。
  button.style("border-radius", "10px");

  // 設定滑鼠移到按鈕上時顯示手形游標。
  button.style("cursor", "pointer");

  // 設定按鈕的盒模型。
  button.style("box-sizing", "border-box");
}

// 計算題目與選項共用的版面座標，確保視窗改變大小後仍保持上下關係。
function getQuestionLayout() {
  // 計算測驗內容區的寬度，並限制最大寬度避免大螢幕上文字過寬。
  const contentWidth = min(width * 0.86, 900);

  // 計算內容區的左側位置，讓題目與選項群組共用同一個水平中心。
  const contentLeft = (width - contentWidth) / 2;

  // 題目文字區域位於標題與選項群組之間。
  const questionTop = constrain(height * 0.18, 118, 150);
  const questionHeight = constrain(height * 0.10, 68, 84);

  // 題目區域底部與第一個選項之間保留清楚但適中的間距。
  const questionOptionGap = constrain(height * 0.025, 16, 24);
  const questionBottom = questionTop + questionHeight;
  const optionTop = questionBottom + questionOptionGap;

  // 根據畫布高度調整選項之間的距離，避免小畫面內容超出畫布。
  const optionGap = constrain(height * 0.075, 56, 66);

  // 回傳所有需要在繪圖與按鈕配置中共用的座標。
  return {
    contentLeft,
    contentWidth,
    questionTop,
    questionHeight,
    questionBottom,
    optionTop,
    optionGap
  };
}

// 依照目前視窗大小重新安排 HTML 按鈕的位置與尺寸。
function layoutInterfaceButtons() {
  // 使用與題目繪圖相同的版面資料，讓題目永遠位於選項正上方。
  const layout = getQuestionLayout();

  // 讓選項按鈕群組直接使用內容區的完整寬度。
  const optionWidth = layout.contentWidth;

  // 讓選項按鈕群組與題目共用相同的左側邊界。
  const optionLeft = layout.contentLeft;

  // 使用迴圈排列四個選項。
  for (let optionIndex = 0; optionIndex < optionButtons.length; optionIndex += 1) {
    // 計算每一顆選項按鈕的垂直位置。
    const optionTopPosition = layout.optionTop + optionIndex * layout.optionGap;

    // 設定選項按鈕的位置。
    optionButtons[optionIndex].position(optionLeft, optionTopPosition);

    // 設定選項按鈕的寬度與高度。
    optionButtons[optionIndex].size(optionWidth, 50);
  }

  // 計算下一題按鈕的垂直位置。
  const actionTop = layout.optionTop + 4 * layout.optionGap + 20;

  // 計算下一題按鈕的水平位置。
  const actionLeft = layout.contentLeft + layout.contentWidth - 150;

  // 設定下一題按鈕的位置。
  nextButton.position(actionLeft, actionTop);

  // 設定下一題按鈕的大小。
  nextButton.size(150, 48);

  // 設定重新開始按鈕的位置，讓它位於結果畫面中央附近。
  restartButton.position(width / 2 - 80, height * 0.62);

  // 設定重新開始按鈕的大小。
  restartButton.size(160, 50);
}

// 更新按鈕文字、顯示狀態與目前題目的畫面控制。
function updateInterface() {
  // 當題目尚未全部完成時，更新題目與選項按鈕。
  if (currentQuestionIndex < questions.length) {
    // 取得目前題目的資料。
    const currentQuestion = questions[currentQuestionIndex];

    // 逐一更新四顆選項按鈕的文字。
    for (let optionIndex = 0; optionIndex < optionButtons.length; optionIndex += 1) {
      // 在選項前加上 A、B、C、D，增加閱讀辨識度。
      optionButtons[optionIndex].html(
        String.fromCharCode(65 + optionIndex) + ". " + currentQuestion.options[optionIndex]
      );

      // 顯示目前題目的選項按鈕。
      optionButtons[optionIndex].show();

      // 清除上一題可能留下的跳動位移。
      optionButtons[optionIndex].style("transform", "translateY(0px)");

      // 將選項按鈕恢復成未作答時的白色背景。
      optionButtons[optionIndex].style("background-color", "#ffffff");

      // 讓新的題目可以重新點選每個選項。
      optionButtons[optionIndex].removeAttribute("disabled");

      // 將按鈕游標恢復為可點擊樣式。
      optionButtons[optionIndex].style("cursor", "pointer");
    }

    // 隱藏尚未答題時不需要出現的下一題按鈕。
    nextButton.hide();

    // 隱藏結果畫面的重新開始按鈕。
    restartButton.hide();
  } else {
    // 題目完成後隱藏所有選項按鈕。
    for (let optionIndex = 0; optionIndex < optionButtons.length; optionIndex += 1) {
      // 隱藏目前不再使用的選項按鈕。
      optionButtons[optionIndex].hide();
    }

    // 隱藏下一題按鈕。
    nextButton.hide();

    // 顯示重新開始按鈕。
    restartButton.show();
  }

  // 重新安排按鈕位置，支援切換畫面或視窗大小改變。
  layoutInterfaceButtons();
}

// 處理使用者點選某一個選項的動作。
function answerQuestion(optionIndex) {
  // 如果本題已經作答，就直接結束，避免重複計分。
  if (answerState !== "unanswered") {
    return;
  }

  // 記錄使用者選到的選項。
  selectedOptionIndex = optionIndex;

  // 取得目前題目的資料。
  const currentQuestion = questions[currentQuestionIndex];

  // 判斷使用者選擇是否等於正確答案。
  if (optionIndex === currentQuestion.correctIndex) {
    // 將作答狀態記錄為答對。
    answerState = "correct";

    // 將答對題數增加一題，且本函式前方已確認本題尚未作答。
    score += 1;

    // 將正確選項標示為指定的藍色背景。
    optionButtons[currentQuestion.correctIndex].style(
      "background-color",
      correctAnswerColor
    );

    // 顯示答對提示。
    feedbackMessage = "答對了！做得很好。";
  } else {
    // 將作答狀態記錄為答錯。
    answerState = "wrong";

    // 顯示答錯提示，但不扣分也不重複計分。
    feedbackMessage = "這個選項不正確，請觀察會跳動的正確答案。";

    // 將被點擊的錯誤選項套用指定的粉紅色背景 #ffcad4。
    optionButtons[optionIndex].style(
      "background-color",
      wrongAnswerColor
    );

    // 將正確選項套用指定的藍色背景 #8da9c4。
    optionButtons[currentQuestion.correctIndex].style(
      "background-color",
      correctAnswerColor
    );

    // 記錄動畫開始時間，讓正確選項從新的動畫週期開始跳動。
    animationStartTime = millis();
  }

  // 作答後鎖定所有選項，避免使用者重複點選或重複計分。
  for (let buttonIndex = 0; buttonIndex < optionButtons.length; buttonIndex += 1) {
    // 停用每一個選項按鈕。
    optionButtons[buttonIndex].attribute("disabled", true);

    // 將停用按鈕的游標改成一般箭頭。
    optionButtons[buttonIndex].style("cursor", "default");
  }

  // 顯示下一題按鈕，讓使用者確認後繼續。
  nextButton.show();

  // 如果目前是最後一題，將按鈕文字改成查看結果。
  if (currentQuestionIndex === questions.length - 1) {
    nextButton.html("查看結果");
  } else {
    // 如果不是最後一題，維持下一題文字。
    nextButton.html("下一題");
  }
}

// 前往下一題，或在最後一題後顯示測驗結果。
function goToNextQuestion() {
  // 只有完成目前題目且尚未進入結果頁時才能進入下一題。
  if (answerState === "unanswered" || currentQuestionIndex >= questions.length) {
    return;
  }

  // 將題目索引值增加一題。
  currentQuestionIndex += 1;

  // 將新題目的作答狀態重設為尚未作答。
  answerState = "unanswered";

  // 清除上一題的選項紀錄。
  selectedOptionIndex = -1;

  // 恢復初始提示文字。
  feedbackMessage = "請選擇一個答案。";

  // 更新所有按鈕與畫面元件。
  updateInterface();
}

// 將測驗恢復成最開始的狀態。
function restartQuiz() {
  // 將目前題目索引值重設為第一題。
  currentQuestionIndex = 0;

  // 將答對題數歸零。
  score = 0;

  // 將作答狀態重設為尚未作答。
  answerState = "unanswered";

  // 清除使用者選項紀錄。
  selectedOptionIndex = -1;

  // 恢復初始提示文字。
  feedbackMessage = "請選擇一個答案。";

  // 將下一題按鈕文字恢復成原本的文字。
  nextButton.html("下一題");

  // 更新所有按鈕與畫面元件。
  updateInterface();
}

// 在畫布上繪製目前題目的標題、題號與回饋文字。
function drawQuestionScreen() {
  // 取得題目與四個選項的垂直版面資料。
  const layout = getQuestionLayout();

  // 統一使用畫布真正的水平中心，避免題目與主標題產生不同的中心點。
  const centerX = width / 2;

  // 使用內容寬度限制文字區域，但不使用內容左側或選項群組中心計算文字的 x 座標。
  const contentWidth = layout.contentWidth;

  // 讓主標題、題號、題目與回饋文字都以水平與垂直方向置中繪製。
  textAlign(CENTER, CENTER);

  // 設定主標題文字大小。
  textSize(min(36, width * 0.075));

  // 設定主標題文字顏色。
  fill("#17324d");

  // 使用畫布中心繪製測驗主標題。
  text("p5.js 簡易指令測驗", centerX, 48);

  // 設定題號文字大小。
  textSize(min(20, width * 0.045));

  // 設定題號文字顏色。
  fill("#52718e");

  // 使用畫布中心繪製目前題號與總題數。
  text(
    "第 " + (currentQuestionIndex + 1) + " 題 / 共 " + questions.length + " 題",
    centerX,
    94
  );

  // 設定題目文字大小。
  textSize(min(26, width * 0.052));

  // 設定題目文字顏色。
  fill("#203b55");

  // 計算題目區域的垂直中心，讓題目保持在選項正上方。
  const questionCenterY = layout.questionTop + layout.questionHeight / 2;

  // 使用畫布中心與相同的 textAlign，讓題目和主標題完全水平對齊。
 text(
  questions[currentQuestionIndex].question,
  width / 2,
  questionCenterY
);

  // 設定回饋文字大小。
  textSize(min(19, width * 0.042));

  // 根據答題狀態設定回饋文字顏色。
  if (answerState === "correct") {
    // 答對時使用綠色提示。
    fill("#2f7d4a");
  } else if (answerState === "wrong") {
    // 答錯時使用深橘色提示。
    fill("#a15c2f");
  } else {
    // 尚未作答時使用一般藍灰色提示。
    fill("#52718e");
  }

  // 使用畫布中心繪製回饋文字。
  text(feedbackMessage, centerX, height - 48, contentWidth, 40);
}

// 在畫布上繪製測驗完成後的結果畫面。
function drawResultScreen() {
  // 設定文字水平置中對齊。
  textAlign(CENTER, CENTER);

  // 設定結果標題大小。
  textSize(min(42, width * 0.09));

  // 設定結果標題顏色。
  fill("#17324d");

  // 繪製完成標題。
  text("測驗完成！", width / 2, height * 0.28);

  // 設定成績文字大小。
  textSize(min(30, width * 0.065));

  // 設定成績文字顏色。
  fill("#315b7d");

  // 繪製答對題數與總題數。
  text("你答對了 " + score + " / " + questions.length + " 題", width / 2, height * 0.43);

  // 設定鼓勵文字大小。
  textSize(min(21, width * 0.045));

  // 設定鼓勵文字顏色。
  fill("#52718e");

  // 繪製鼓勵使用者重新挑戰的文字。
  text("按下重新開始，再挑戰一次！", width / 2, height * 0.53);
}

// 讓答錯時的正確選項上下跳動，直到按下下一題。
function animateCorrectAnswer() {
  // 只有目前仍在答錯狀態時才執行動畫。
  if (answerState !== "wrong") {
    return;
  }

  // 取得目前題目的正確答案索引值。
  const correctIndex = questions[currentQuestionIndex].correctIndex;

  // 使用正弦函式產生平滑的上下位移，移動幅度為 8 像素。
  const bounceOffset = sin((millis() - animationStartTime) * 0.012) * 8;

  // 將位移套用到正確選項按鈕。
  optionButtons[correctIndex].style(
    "transform",
    "translateY(" + bounceOffset + "px)"
  );
}

// 當瀏覽器視窗大小改變時，重新調整畫布尺寸與按鈕位置。
function windowResized() {
  // 將畫布調整成新的視窗寬度與高度。
  resizeCanvas(windowWidth, windowHeight);

  // 重新計算所有按鈕的位置與尺寸。
  layoutInterfaceButtons();
}
