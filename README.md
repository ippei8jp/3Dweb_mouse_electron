#### WEB 3D表示テストプログラム(electron-builder版)

##### 概要

WebGLを使用(ラッパにthree.jsを使用)した3D表示のテスト

electronによるデスクトップアプリ化対応

マウスの移動/ホイールで表示を動かすことができる

元プログラムは[3Dweb_mouse](https://github.com/ippei8jp/3Dweb_mouse)


##### プログラム実行

ソースの取得

```bash
git clone https://github.com/ippei8jp/3Dweb_mouse_electron
cd 3Dweb_mouse_electron
```

必要なモジュールのインストール
```bash
npm install
```

実行側の必要なモジュールもインストール
```bash
cd src
npm install
cd ..
```

とりあえず表示してみる。
パッケージ化しないのでデバッグとかやるとき用かな。
```bash
rpm start
```

パッケージ化
```bash
npm run el_build
```

で、ちょっと待つと完成するハズ

ポータブル版実行ファイル `dist/3Dweb_mouse 0.0.0.exe`  ができる。
このファイル1つを別のマシンにコピーすれば実行できる。
ただし、このファイルはテンポラリにファイルを展開してから実行するみたいで、起動に時間がかかる。

`dist/win-unpacked/3Dweb_mouse.exe` が実行プログラム本体なので、これを実行すると起動は早い。

`dist/win-unpacked`ディレクトリをまとめてコピーすれば、別のマシンにコピーすれば実行できる。
(`3Dweb_mouse.exe`だけじゃダメ。DLLや各種リソースが`dist/win-unpacked`ディレクトリにちらばっているので)

なお、mac版やLinux版、32bit版などは`el_build.js`の中身を書き換えれば対応できる(ハズ)。


プログラムの動作は以下の通り。

- マウス ドラッグでカメラ位置変更

- マウス ホイールでズームイン/アウト

##### ファイルの構成

```
3Dweb_mouse_electron
├── package.json          npm管理ファイル
├── el_build.js              build実行用スクリプト
├── build
│   ├── app.ico              アプリケーションアイコン(未使用)
│   ├── app_16x16.png        アプリケーションアイコンをpng化したもの(未使用)
│   └── app_256x256.png      アプリケーションアイコンをpng化して256x256サイズ化したもの
├── src                   アプリケーション本体 
│  ├── package.json          npm管理ファイル
│  ├── main.js               トップレベルウィンドウを操作するプログラム
│  ├── index.html            アプリケーションプログラム
│  └── ・・・・
└── dist                  パッケージ化した時に作成されるディレクトリ
     ├── 3Dweb_mouse 0.0.0.exe                 ポータブル版実行ファイル
     ├── builder-effective-config.yaml         パッケージ化した時のパラメータ
     └── win-unpacked                          実行ディレクトリ
         ├── 3Dweb_mouse.exe                      実行ディレクり内の実行プログラム()
         ├── ・・・・
         └── resources
              ├── app.asar                         srcディレクトリをasarで固めたもの
              └── ・・・・
```

##### おまけ

`dist/win-unpacked/resources/app.asar` が 実行時の本体(主に`src`ディレクトリ)が格納されているファイル。
このファイルを展開してみれば、ファイルの過不足がないか確認できる。

`asar`ファイルを展開するには以下のように実行すれば良い。

適当なディレクトリを作成して移動、そこへ`asar`ファイルをコピっておく。

`asar`モジュールのインストール
```bash
npm install asar
```

asarファイルの展開 (app.asarをoutputディレクトリへ)。
asarモジュールはローカルインストールなので、npxを付けて実行。
```bash
npx asar extruct app.asar output
```
