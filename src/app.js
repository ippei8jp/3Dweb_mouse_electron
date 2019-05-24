// =====================================================================
// 変数初期化
// =====================================================================
// デバッグ用のフラグ
const flag_wide_view = false;

// scene(シーン) 表示を変えるたびに作り替えるのでグローバルにしておく
var scene = null;

// URLパラメータから表示モデルを取得
var model_pattern = 'enterprise';                                   // デフォルトパターン
var match = location.search.match(/pattern=(.*?)(&|$)/);            // URLから"pattern"を探す
if(match) {
    model_pattern = decodeURIComponent(match[1]);                   // 見つかったら変数に設定
}

// カメラ設定パラメータ
var far_limit = 1000;                                               //デフォルトカメラパラメータ
var cam_pos_y = -250;
if (flag_wide_view) {
    // 探しやすくするためにパラメータ変更してみる場合はこちらを使うようフラグを設定
    far_limit = 100000;
    cam_pos_y = -25000;
}

// 描画領域サイズを決定
var clientWidth  = window.innerWidth;                               //デフォルトはウィンドウサイズ
var clientHeight = window.innerHeight;
const container = document.getElementById('container');             // ID: container を持つエレメントを探す
if (container) {
    // containerが定義されていればコンテナサイズに差し替え
    clientWidth  = container.clientWidth;
    clientHeight = container.clientHeight;
}

// =====================================================================
// モデルパラメータの取得関数
// =====================================================================
function get_model_param(model_pattern) {
    let param = {};
    if (model_pattern == "falcon") {
        param.path     = 'models/falcon/';                      // ファイルの存在するpath
        param.mtl_name = 'millenium-falcon.mtl';                // MTLファイルのファイル名
        param.obj_name = 'millenium-falcon.obj';                // OBJファイルのファイル名
        param.scale    = 0.2;                                   // 倍率
        param.pos      = {"x" : -2650, "y" : -80, "z":  0};     // 位置
        param.rot      = {"x" :    90, "y" : -90, "z":  0};     // 回転量(度)
    }
    else if (model_pattern == "x-wing") {
        param.path     = 'models/x-wing/';                      // ファイルの存在するpath
        param.mtl_name = 'x-wing.mtl';                          // MTLファイルのファイル名
        param.obj_name = 'x-wing.obj';                          // OBJファイルのファイル名
        param.scale    = 0.2;                                   // 倍率
        param.pos      = {"x" : 1720, "y" : -1410, "z":  -77};  // 位置
        param.rot      = {"x" :    90, "y" : 90, "z": 0};       // 回転量(度)
    }
    else if (model_pattern == "F18") {
        param.path     = 'models/F18/';                         // ファイルの存在するpath
        param.mtl_name = 'FA-18E_SuperHornet.mtl';              // MTLファイルのファイル名
        param.obj_name = 'FA-18E_SuperHornet.obj';              // OBJファイルのファイル名
        param.scale    = 8;                                     // 倍率
        param.pos      = {"x" : 0, "y" : 0, "z": 0.52};         // 位置
        param.rot      = {"x" : 0, "y" : 0, "z": -90};          // 回転量(度)
    }
    else if (model_pattern == "eagle") {
        param.path     = 'models/EAGLE/';                       // ファイルの存在するpath
        param.mtl_name = 'EAGLE_2.MTL';                         // MTLファイルのファイル名
        param.obj_name = 'EAGLE_2.OBJ';                         // OBJファイルのファイル名
        param.scale    = 100;                                   // 倍率
        param.pos      = {"x" : 0, "y" : 0, "z": 0};            // 位置
        param.rot      = {"x" : 90, "y" : 90, "z": 0};          // 回転量(度)
    }
    else /* if (model_pattern == "enterprise") */ {             // デフォルトパターン
        param.path     = 'models/NCC-1701/';                    // ファイルの存在するpath
        param.mtl_name = 'untitled.mtl';                        // MTLファイルのファイル名
        param.obj_name = 'untitled.obj';                        // OBJファイルのファイル名
        param.scale    = 30;                                    // 倍率
        param.pos      = {"x" :   0, "y" :  1.75, "z":  0};     // 位置
        param.rot      = {"x" :  90, "y" :  90,   "z":  0};     // 回転量(度)
    }
    return param;
}


// =====================================================================
// 表示シーンの初期化関数
// =====================================================================
function init_disp_scene(model_pattern) {
    // scene(シーン)の作成
    scene = new THREE.Scene();

    // group(グループ)を作成してsceneに追加
    const group = new THREE.Group();
    scene.add(group);

    // Light(ライト)の設定
    const ambientLight = new THREE.AmbientLight(0xcccccc, 2);
    scene.add(ambientLight);

    // XYZ軸の表示
    const axis1 =  new THREE.AxisHelper(80);    // 長さを指定
    axis1.position.set(0, 0, 0);                // 位置の初期化
    group.add(axis1);                           // 座標軸をグループに追加

    // モデルのパラメータを取得
    model_param = get_model_param(model_pattern);

    new THREE.MTLLoader().setPath(model_param.path).load(model_param.mtl_name,function(materials){
        materials.preload();
        new THREE.OBJLoader().setPath(model_param.path).setMaterials(materials).load(model_param.obj_name,function (object){
            object.scale.set(model_param.scale, model_param.scale, model_param.scale);                                                // 縮尺の初期化
            object.position.set(model_param.pos.x * model_param.scale, model_param.pos.y * model_param.scale, model_param.pos.z * model_param.scale);   // 位置の初期化
            object.rotation.set(model_param.rot.x * Math.PI/180, model_param.rot.y * Math.PI/180, model_param.rot.z * Math.PI/180);   // 角度の初期化

            // objectをgroupに追加
            group.add(object);
        }); 
    });

    // マウスによるコントロールを初期化(カメラ位置を初期化)
    controls.reset();
}

// =====================================================================
// アニメーション処理(繰り返し処理)
// =====================================================================
function animate() {
    requestAnimationFrame(animate);             // 次のアニメーション描画をリクエスト
    renderer.render(scene, camera);             // 描画
};

// 処理本体 ==============================================================
// renderer(レンダラー)の作成と配置
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);            // ピクセル比
renderer.setSize(clientWidth, clientHeight);                // サイズ
renderer.setClearColor(0x888888, 1);                        // 背景色
if (container) {
    // containerに配置
    container.appendChild(renderer.domElement);
}
else {
    // ID "container" が見つからなければ bodyに直接展開する
    document.body.appendChild(renderer.domElement);
}

// camera(カメラ)の作成
const camera = new THREE.PerspectiveCamera(50, clientWidth/clientHeight, 1, far_limit);
camera.position.set(0, cam_pos_y, 0);       // cameraの位置設定
camera.up.set(0, 0, 1);                     // カメラの上方向はZ軸方向

// camera(カメラ)をマウス操作する設定
var controls = new THREE.OrbitControls(camera);

// 表示するシーンの初期化
init_disp_scene(model_pattern);

animate();
