const memoList = document.getElementById('memoList');
const editor = document.getElementById('editor');
const saveMemoButton = document.getElementById('saveMemo');
const toggleThemeButton = document.getElementById('toggleTheme');
const colorPalettes = ['palette-1', 'palette-2', 'palette-3', 'palette-4'];
let currentPaletteIndex = 0;
let editingMemoIndex = null; // 編集中のメモのインデックス（nullの場合、新規作成）

// **カラーパレットを取得**
function getCurrentPalette() {
  const paletteColors = [
    { background: '#FFC107', text: '#000' }, // palette-1
    { background: '#4CAF50', text: '#fff' }, // palette-2
    { background: '#2196F3', text: '#fff' }, // palette-3
    { background: '#FF5722', text: '#fff' }, // palette-4
  ];
  return paletteColors[currentPaletteIndex];
}

// **スタイルを適用**
function applyStylesToButton(button) {
  const currentPalette = getCurrentPalette();
  button.style.backgroundColor = currentPalette.background;
  button.style.color = currentPalette.text;
}

// **すべてのボタンにデフォルトスタイルを適用**
function applyDefaultStyles() {
  const allButtons = document.querySelectorAll('button');
  allButtons.forEach(applyStylesToButton);
}

// **メモをロード**
function loadMemos() {
  const memos = JSON.parse(localStorage.getItem('memos')) || [];
  memoList.innerHTML = '';
  memos.forEach((memo, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      Memo ${index + 1}
    `;

    // Deleteボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteMemo(index);

    // Deleteボタンにスタイルを適用
    applyStylesToButton(deleteButton);

    // Deleteボタンをリスト項目に追加
    li.appendChild(deleteButton);

    // クリックイベントで選択・編集
    li.addEventListener('click', () => {
      document.querySelectorAll('#memoList li').forEach(item => item.classList.remove('selected'));
      li.classList.add('selected');
      editor.innerHTML = memo;
      editingMemoIndex = index; // 編集中のメモインデックスを更新
    });

    // リストに追加
    memoList.appendChild(li);
  });
}

// **メモを保存**
function saveMemo() {
  const memos = JSON.parse(localStorage.getItem('memos')) || [];
  if (editingMemoIndex !== null) {
    // 編集中のメモを更新
    memos[editingMemoIndex] = editor.innerHTML;
    editingMemoIndex = null; // 編集モードを解除
  } else {
    // 新規メモを追加
    memos.push(editor.innerHTML);
  }
  localStorage.setItem('memos', JSON.stringify(memos));
  loadMemos();
  editor.innerHTML = ''; // エディタをクリア
}

// **メモを削除**
function deleteMemo(index) {
  const memos = JSON.parse(localStorage.getItem('memos')) || [];
  if (confirm("Are you sure you want to delete this memo?")) {
    memos.splice(index, 1);
    localStorage.setItem('memos', JSON.stringify(memos));
    loadMemos();

    // 削除後、エディタをクリア
    if (editingMemoIndex === index) {
      editor.innerHTML = '';
      editingMemoIndex = null;
    }
  }
}

// **検索機能**
function searchMemos(keyword) {
  const memos = JSON.parse(localStorage.getItem('memos')) || [];
  const filteredMemos = memos.filter(memo => memo.toLowerCase().includes(keyword.toLowerCase()));

  memoList.innerHTML = '';
  filteredMemos.forEach((memo, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      Memo ${index + 1}
    `;

    // Deleteボタンを作成
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = () => deleteMemo(index);

    // Deleteボタンにスタイルを適用
    applyStylesToButton(deleteButton);

    // Deleteボタンをリスト項目に追加
    li.appendChild(deleteButton);

    // クリックイベントで選択・編集
    li.addEventListener('click', () => {
      document.querySelectorAll('#memoList li').forEach(item => item.classList.remove('selected'));
      li.classList.add('selected');
      editor.innerHTML = memo;
      editingMemoIndex = index; // 編集中のメモインデックスを更新
    });

    // リストに追加
    memoList.appendChild(li);
  });
}

// **テーマを変更**
function changeButtonColors() {
  currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;

  const allButtons = document.querySelectorAll('button');
  allButtons.forEach(applyStylesToButton);

  const searchBox = document.getElementById('searchBox');
  const currentPalette = getCurrentPalette();
  searchBox.style.borderColor = currentPalette.background;
  searchBox.style.boxShadow = `0 0 5px ${currentPalette.background}`;
}

// **リッチテキストのフォーマット機能**
function formatText(command) {
  if (command === 'insertOrderedList' || command === 'insertUnorderedList') {
    document.execCommand(command); // リストを作成
    applyListStyles(); // 作成されたリストにスタイルを適用
  } else {
    document.execCommand(command, false, null); // 太字、斜体、下線を適用
  }
}

// **リストスタイルを適用**
function applyListStyles() {
  const lists = editor.querySelectorAll('ol, ul');
  lists.forEach(list => {
    list.style.paddingLeft = '20px'; // 左側の余白
    list.style.margin = '10px 0'; // 上下の余白
    list.style.listStylePosition = 'inside'; // マーカーを枠内に表示
  });
}

// イベントリスナーを設定
toggleThemeButton.addEventListener('click', changeButtonColors);
saveMemoButton.addEventListener('click', saveMemo);

// 初期化
applyDefaultStyles(); // デフォルトで全ボタンにスタイル適用
loadMemos();