//オセロテーブル　0:無 1:黒 2:白
const table = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,2,1,0,0,0],
  [0,0,0,1,2,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
];

//色クラスリスト
const colors = ["empty", "black", "white"];

const texts = ["黒","白"];

//周辺リスト
searchs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

//手番
let teban = 1;

//メッセージ
const message = document.getElementById("message-area");

/***********************************
 * オセロの色を変更する
 ***********************************/
function changeColor() {
  loopTable((field, color) => {
    field.classList.remove(colors[0]);
    field.classList.remove(colors[1]);
    field.classList.remove(colors[2]);
    field.classList.add(colors[color]);
  })
}

/***********************************
 * クリックイベントを登録する
 ***********************************/
function registClickListener() {
  let isSet = registColorListener();
  //設定できなかった場合
  if (!isSet) {
    teban = 3 - teban;
    isSet = registColorListener();
  }
  //どちらの色も設定できなかった場合、ゲーム終了
  if (!isSet) {
    message.textContent = "ゲーム終了　";
    let blacks = 0;
    let whites = 0;
    loopTable((field, color) => {
      if (color == 1) {
        blacks++;
      } else if (color == 2) {
        whites++;
      }
    });  
    message.textContent += "黒:" + blacks + "　";
    message.textContent += "白:" + whites + "　";
    if (blacks > whites) {
      message.textContent += "黒の勝ちです。";
    } else if (blacks == whites) {
      message.textContent += "同点です。";
    } else {
      message.textContent += "白の勝ちです。";
    }
  } else {
    message.textContent =  texts[teban-1] + "の番です";
  }
}

/***********************************
 * クリックイベントを登録する
 ***********************************/
function registColorListener() {
  let isSet = false;
  loopTable((field, color, i, j) => {
    if (canPutStone(color, i, j)) {
      field.onclick = () => {
        click(i, j);
      }
      isSet = true;
    } else {
      field.onclick = () => {}
    }
  })
  return isSet;
}

/***********************************
 * クリックイベント
 ***********************************/
function click(i, j) {
  table[i][j] = teban;
  changeStone(i, j);
  changeColor();
  teban = 3 - teban;
  registClickListener();
}

/***********************************
 * 石の色を変える
 ***********************************/
function changeStone(i, j) {
  for (let index = 0; index < searchs.length; index++) {
    const rowAdd = searchs[index][0];
    const colAdd = searchs[index][1];
    const anotherColor = searchAnotherColor(i, j, rowAdd, colAdd, false);
    if (anotherColor[0]) {
      const lastRow = anotherColor[1];
      const lastCol = anotherColor[2];
      let row = i;
      let col = j;
      for(;;) {
        row += rowAdd;
        col += colAdd;
        table[row][col] = teban;
        if (row == lastRow && col == lastCol) {
          break;
        }
      }
    }      
  }
}

/***********************************
 * 石がおけるか調べる
 ***********************************/
function canPutStone(color, i, j) {
  if (color !== 0) {
    return false;
  }
  for (let index = 0; index < searchs.length; index++) {
    if (searchAnotherColor(i, j, searchs[index][0], searchs[index][1], false)[0]) {
      return true;
    }   
  }
  return false;
}

/***********************************
 * 逆色の石→同色の石があるか調べる
 ***********************************/
function searchAnotherColor(i, j, rowIndex, colIndex, isReversed) {
  const row = i + rowIndex;
  const col = j + colIndex;
  if (row > -1 && col > -1 && row < 8 && col < 8) {
    const nextColor = table[row][col]
    if (teban + nextColor == 3) {
      //逆色
      return searchAnotherColor(row, col, rowIndex, colIndex, true);
    } else if (teban == nextColor) {
      //同色
      if (isReversed) {
        //逆色あり
        return [true, row, col];
      } else {
        //逆色なし
        return [false];
      }
    }
    //空
    return [false];
  }
  return [false];
}

/***********************************
 * 各セルごとの処理
 ***********************************/
function loopTable(callback) {
  for (let i = 0; i < table.length; i++) {
    const row = table[i];
    for (let j = 0; j < row.length; j++) {
      const color = row[j];
      const field = document.getElementById("field-"+i+j);
      callback(field, color, i, j);
    }
  }
}

/***********************************
 * フィールドのサイズを変更する
 ***********************************/
function resize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const board = document.getElementById("board-area")
  if (height > width) {
    board.style.width = width - 16 + "px";
    board.style.height = width - 16 + "px";
  } else {
    board.style.width = height - 16 + "px";
    board.style.height = height - 16 + "px";
  }
}

function main() {
  window.onresize = resize;
  window.onload = resize;
  changeColor();
  registClickListener();
}

main();

