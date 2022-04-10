//单手识别
var signal_date1; //开始时间
var signal_date2; //结束时间
var signal_flag=false;
var signal_x=0;
var signal_y=0;
var signal_count=0;

//双手框选
var double_date1; //开始时间
var double_date2; //结束时间
var double_flag=false;
var double_xl=0;
var double_xr=0;
var double_yl=0;
var double_yr=0;
var double_count=0;

const time_slice = 2000; //选中时间

const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

const zi_key = document.getElementById("zi_key");
const zi_pinyin = document.getElementById("zi_pinyin");
const zi_mean = document.getElementById("zi_mean");
const ci_key = document.getElementById("ci_key");
const ci_pinyin = document.getElementById("ci_pinyin");
const ci_mean = document.getElementById("ci_mean");
const ci_same = document.getElementById("ci_same");
const ci_reverse = document.getElementById("ci_reverse");
const ci_cn_sen = document.getElementById("ci_cn_sen");
const ci_en = document.getElementById("ci_en");
const ci_yingbiao = document.getElementById("ci_yingbiao");
const ci_en_sen = document.getElementById("ci_en_sen");

const ju_key = document.getElementById("ju_key");
const ju_en = document.getElementById("ju_en");

const wu_key = document.getElementById("wu_key");
const wu_en = document.getElementById("wu_en");
const wu_mean = document.getElementById("wu_mean");


const slider = document.getElementById("slider");

const main_tab = document.getElementById("main_tab");
const double_tab = document.getElementById("double_tab");
const single_tab = document.getElementById("single_tab");



var mode = 0;
var top_tag = 0;

const fanzhuan_btn = document.getElementById("fanzhuan");

var fanzhuan_flag = 1;


fanzhuan_btn.onchange = function(ev){
    //获取checked的几种方式
    /*
    event:{
        detail:{
            checked,
        }
    }
    */
    if(this.checked){
        fanzhuan_flag = 1;
        canvasElement.style['transform'] = "rotateY(180deg)"
        canvasElement.style['-webkit-transform'] = "rotateY(180deg)"
    }
    else{
        fanzhuan_flag = 0;
        canvasElement.style['transform'] = "rotateY(0deg)"
        canvasElement.style['-webkit-transform'] = "rotateY(0deg)"
    }
    console.log(this.checked);
    // console.log(ev.target.checked);
    // console.log(ev.detail.checked);
}

// 设置tab选择事件
main_tab.onchange = function(ev){
    //获取key、index和label的几种方式
    /*
    event:{
        detail:{
            key,
            index,
            label,
        }
    }
    */
    const { key, index, label } = ev.detail;
    top_tag = parseInt(ev.detail.key);
    if(top_tag > 0){
        mode = top_tag + 1;
    }
    else {
        mode = top_tag;
    }
    console.log(key, index, label, mode);
}

single_tab.onchange = function(ev){

    const { key, index, label } = ev.detail;
    if(top_tag == 0){
        mode = parseInt(ev.detail.key);
    }
    console.log(key, index, label, mode);
}

// double_tab.onchange = function(ev){
//
//     const { key, index, label } = ev.detail;
//     if(top_tag == 1){
//         mode = parseInt(ev.detail.key) + 2;
//     }
//     console.log(key, index, label, mode);
// }


function setVisible(){
    zi_pinyin.style.display = "block";
    zi_mean.style.display = "block";

    ci_pinyin.style.display = "block";
    ci_mean.style.display = "block";
    ci_same.style.display = "block";
    ci_reverse.style.display = "block";
    ci_en.style.display = "block";
    ci_en_sen.style.display = "block";
    ci_cn_sen.style.display = "block";
    ci_yingbiao.style.display = "block";

    ju_en.style.display = "block";

    wu_en.style.display = "block";
    wu_mean.style.display = "block";
}


function sendImage(imgData, mode, xl, yl, xr, yr){
    console.log(imgData, mode, xl, yl, xr, yr, localStorage.string)
    $.ajax({
        type:"POST",
        url:"https://ppreader.creativecc.cn/api/test",
        // url:"https://192.168.0.105/api/test",
        //url:"http://101.43.237.206:8080/api/test",
        //url:"http://127.0.0.1:8000/api/test",
        datatype:"json",
        data:{
            imgData: imgData,
            mode: mode,
            xl: xl,
            yl: yl,
            xr: xr,
            yr: yr,
            usrid:localStorage.string
        },
        //async: true,
        //contentType:"application/json",
        success: function (data){
            console.log(data)
            setVisible()
            // alert(data["api_results"][0])
            if(mode == 0){
                zi_key.innerHTML = "字: " + data['text_results'];
                var to_speak = new SpeechSynthesisUtterance(data['text_results']);
                window.speechSynthesis.speak(to_speak);
                if(data['text_results'] == '无'){
                    zi_key.innerHTML = "未识别到任何东西，请重新选择~";
                    zi_pinyin.style.display = "none";
                    zi_mean.style.display = "none";
                }
                if(data['api_results'][1]['ret'] == 0){
                    zi_pinyin.innerHTML = "拼音: " + data['api_results'][1]['relist']['拼音'][0];
                    zi_mean.innerHTML = "释义: " + data['api_results'][1]['relist']['基本释义'];

                }
                // else{
                //     zi_pinyin.style.display = "none";
                //     zi_mean.style.display = "none";
                // }
            }
            else if(mode == 1){
                ci_key.innerHTML = "词语: " + data['text_results'];
                console.log(typeof data['text_results'])

                //语音
                var to_speak = new SpeechSynthesisUtterance(data['text_results']);
                window.speechSynthesis.speak(to_speak);
                //var msg = new SpeechSynthesisUtterance("测试");
                //msg.rate = 4 播放语速
                //msg.pitch = 10 音调高低
                //msg.text = "播放文本"
                //msg.volume = 0.5 播放音量

                if(data['text_results'] == '无'){
                    ci_key.innerHTML = "未识别到任何东西，请重新选择~";
                    ci_pinyin.style.display = "none";
                    ci_mean.style.display = "none";
                    ci_same.style.display = "none";
                    ci_reverse.style.display = "none";
                    ci_en.style.display = "none";
                    ci_en_sen.style.display = "none";
                    ci_cn_sen.style.display = "none";
                    ci_yingbiao.style.display = "none";
                }
                if(data['api_results'][1]['ret'] == 0){
                    ci_pinyin.innerHTML = "拼音: " + data['api_results'][1]['relist']['拼音'][0];
                    ci_mean.innerHTML = "释义: " + data['api_results'][1]['relist']['基本释义'];
                    ci_same.innerHTML = "近义词: " + data['api_results'][1]['relist']['近义词'];
                    ci_reverse.innerHTML = "反义词: " + data['api_results'][1]['relist']['反义词'];
                }
                if(data['api_results'][0]['ret'] == 0){
                    ci_en.innerHTML = "英文: " + data['api_results'][0]['relist']['英文'];
                    ci_yingbiao.innerHTML = "英标: " + data['api_results'][0]['relist']['英标'];
                    // ci_en_sen.innerHTML = "英文例句: " + data['api_results'][0]['relist']['英文'];
                }

            }
            else if(mode == 2){
                ju_key.innerHTML = "句子: " + data['text_results'];
                var to_speak = new SpeechSynthesisUtterance(data['text_results']);
                window.speechSynthesis.speak(to_speak);
                if(data['text_results'] == '无'){
                    ju_key.innerHTML = "未识别到任何东西，请重新选择~";
                    ju_en.style.display = "none";
                }
                if(data['api_results'][0]['ret'] == 0){
                    ju_en.innerHTML = "翻译: " + data['api_results'][0]['relist'];
                    // ci_yingbiao.innerHTML = "英标: " + data['api_results'][0]['relist']['英标'];
                    // ci_en_sen.innerHTML = "英文例句: " + data['api_results'][0]['relist']['英文'];
                }
            }
            else if(mode == 3){
                wu_key.innerHTML = "标签: " + data['text_results'];
                var to_speak = new SpeechSynthesisUtterance(data['text_results']);
                window.speechSynthesis.speak(to_speak);
                if(data['text_results'] == '无'){
                    wu_key.innerHTML = "未识别到任何东西，请重新选择~";
                    wu_en.style.display = "none";
                    wu_mean.style.display = "none";
                }
                if(data['api_results'][0]['ret'] == 0){
                    wu_en.innerHTML = "英文: " + data['api_results'][0]['relist']['英文'];
                    wu_mean.innerHTML = "释义: " + data['api_results'][0]['relist']['释义'];
                }

            }

        },
        error: function (data){
            alert("error!")
        }
    });

}

function onResults(results) {
    // console.log(results.image)
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);



    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    // canvasCtx.scale(-1, 1)
    // canvasCtx.translate(-canvasElement.width, 0);
    //单手识别 右手

    if(results.multiHandedness){
        //清空进度条
        slider.value = 0;
        if(results.multiHandedness.length===1){
            //判断是哪个框
            let i = 0;
            for (const landmarks of results.multiHandedness) {

                if(landmarks['label']==="Left"&& signal_flag===false){
                    signal_count=0;
                    signal_x=results.multiHandLandmarks[i][8]['x'];
                    signal_y=results.multiHandLandmarks[i][8]['y'];
                    console.log('get left first')
                    signal_date1=new Date();
                    signal_flag=true;
                }
                else if(landmarks['label']==="Left" && signal_flag===true){
                    signal_count=0;
                    var x_x=Math.abs(signal_x-results.multiHandLandmarks[i][8]['x']);
                    var y_y=Math.abs(signal_y-results.multiHandLandmarks[i][8]['y']);
                    if(x_x<(30.0/canvasElement.width) && y_y<(30.0/canvasElement.height)){
                        console.log('get left ')
                        signal_date2=new Date();
                        var date3=signal_date2.getTime()-signal_date1.getTime() //时间差的毫秒数
                        //进度条
                        slider.value = date3 / parseInt(time_slice) * 100
                        // document.getElementById('count').value=date3;
                        if(date3>time_slice){
                            console.log('get signal ')
                            // document.getElementById('statue').value=true;
                            signal_flag=false;
                            var imageData = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height);
                            var imgData = canvasElement.toDataURL("image/jpeg", 1);
                            console.log(canvasElement.width, canvasElement.height)
                            sendImage(imgData, mode, Math.floor(signal_x*canvasElement.width), Math.floor(signal_y*canvasElement.height), Math.floor(-1), Math.floor(-1));

                        }
                    }
                    else{
                        signal_flag=false;
                    }
                }
                else{
                    if(signal_count>100)
                        signal_flag=false;
                    else
                        signal_count++;
                }
                i++;
            }


        }
        else{
            if(signal_count>100)
                signal_flag=false;
            else
                signal_count++;
        }
    }
    else{
        if(signal_count>100)
            signal_flag=false;
        else
            signal_count++;
    }

    //双手识别 左右手
    if(results.multiHandedness){
        //判断条件：两个框，分别为左右手
        if(results.multiHandedness.length===2){
            if(
                (results.multiHandedness[0]['label']==="Left" && results.multiHandedness[1]['label']==="Right")
                ||
                (results.multiHandedness[1]['label']==="Left" && results.multiHandedness[0]['label']==="Right")
            ) {
                var index_l=0;
                var index_r=0;
                if(results.multiHandedness[0]['label']==="Left" && results.multiHandedness[1]['label']==="Right")
                {
                    index_l=0;
                    index_r=1;
                }
                else{
                    index_l=1;
                    index_r=0;
                }
                //第一次识别到手
                if (double_flag === false) {
                    double_count = 0;
                    //记录坐标
                    double_xl = results.multiHandLandmarks[index_l][8]['x'];
                    double_yl = results.multiHandLandmarks[index_l][8]['y'];
                    double_xr = results.multiHandLandmarks[index_r][8]['x'];
                    double_yr = results.multiHandLandmarks[index_r][8]['y'];

                    console.log('get both first')
                    //记录第一次识别时间
                    double_date1 = new Date();
                    double_flag = true;
                    //后续检测
                }
                else {
                    double_count = 0;
                    //记录坐标
                    var x_xl = Math.abs(double_xl - results.multiHandLandmarks[index_l][8]['x']);
                    var y_yl = Math.abs(double_yl - results.multiHandLandmarks[index_l][8]['y']);
                    var x_xr = Math.abs(double_xr - results.multiHandLandmarks[index_r][8]['x']);
                    var y_yr = Math.abs(double_yr - results.multiHandLandmarks[index_r][8]['y']);

                    //判断手指位置
                    if (x_xl < (30.0 / canvasElement.width) && y_yl < (30.0 / canvasElement.height) && x_xr < (30.0 / canvasElement.width) && y_yr < (30.0 / canvasElement.height)) {
                        console.log('get both ')
                        //记录后续识别时间
                        double_date2 = new Date();
                        var date3 = double_date2.getTime() - double_date1.getTime() //时间差的毫秒数
                        // document.getElementById('count').value = date3;
                        //进度条
                        slider.value = date3 / parseInt(time_slice) * 100
                        //
                        if (date3 > time_slice) {
                            // document.getElementById('statue').value = true;
                            double_flag = false;
                            console.log('get double ')
                            //var imageData = canvasCtx.getImageData(0, 0, canvasElement.width, canvasElement.height);
                            var imgData = canvasElement.toDataURL("image/jpeg", 1);
                            console.log(canvasElement.width, canvasElement.height)
                            sendImage(imgData, mode, Math.floor(double_xl*canvasElement.width), Math.floor(double_yl*canvasElement.height), Math.floor(double_xr*canvasElement.width), Math.floor(double_yr*canvasElement.height));

                        }
                    } else {
                        double_flag = false;
                    }
                }
            }
            else{
                if(double_count>100)
                    double_flag=false;
                else
                    double_count++;
            }
        }
        if(double_count>100)
            double_flag=false;
        else
            double_count++;

    }
    else{
        if(double_count>100)
            double_flag=false;
        else
            double_count++;
    }

    if (results.multiHandLandmarks) {
        for (const landmarks of results.multiHandLandmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                {color: '#00FF00', lineWidth: 5});
            //console.log(results)
            drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
        }
    }
    canvasCtx.restore();

    // canvasCtx.scale(-1, 1)
    // canvasCtx.translate(-canvasElement.width, 0);
}

const hands = new Hands({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
hands.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await hands.send({image: videoElement});
    },
    // width: 1280,
    // height: 720
    width: 1280,
    height: 720
});
camera.start();