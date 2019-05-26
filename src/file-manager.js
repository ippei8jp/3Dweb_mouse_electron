const {shell} = require('electron');
const os = require('os');

// エクスプローラを起動する関数
function exec_open_file_manager(path) {
    shell.showItemInFolder(path)
}

// clickハンドラの登録
const fileManagerBtn = document.getElementById('open-file-manager');     // 対象エレメントの取得
fileManagerBtn.addEventListener('click', (event) => {
    exec_open_file_manager(os.homedir());
})
