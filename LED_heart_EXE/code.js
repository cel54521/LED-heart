"use strict";

var code;
var code2;
var table;
var flag;
var flag2;


// 方向パネルをクリック
function onDirectionPanelClick(event){
    var flag = false;
    var noneFlag = true;

    var table = event.currentTarget;
    var color;

    if(table.parentElement.parentElement.id == "command"){
        return;
    }
    // ifとパラレルは方向を変えない
    if((table.rows[1].cells[1].firstElementChild.id == "if") || (table.rows[1].cells[1].firstElementChild.id == "parallel")){
        return;
    }

    // そのほかは変える
    for(var i=0;i<table.rows.length;i++){
        for(var j=0;j<table.rows[i].cells.length;j++){
            if(  ((i==1) && (j==1))
                 || ((i==0) && (j==0))
                 || ((i==2) && (j==2))
                 || ((i==0) && (j==2))
                 || ((i==2) && (j==0))) continue;
            color = table.rows[i].cells[j].bgColor;
            if(color.toUpperCase()=="#3333CC"){
                table.rows[i].cells[j].bgColor = "#333333";
                flag = true;
                noneFlag = false;
            }else if(flag == true){
                table.rows[i].cells[j].bgColor = "#3333CC";
                flag = false;
                break;
            }
        }
    }
    if(noneFlag == true){
        table.rows[0].cells[1].bgColor = "#3333CC";
    }
}

function getCode(){
    code = new Array();
    code2 = new Array();
    table = document.getElementById("codeTable");
    flag =
        [
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ];
    flag2 =
        [
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ];
    if( table.rows[0].cells[0].firstChild.firstChild.id == "parallel"){
        analyze(0,code,flag,1, 0);
        analyze(1,code2,flag2,0, 1);
    }else{
        analyze(0,code,flag,0, 0);
    }
    generate();
}

function analyze(id,code,flag,i, j, labelName){
    var codeblock = table.rows[i].cells[j].firstChild.firstChild;

    if(codeblock == null){
        return;
    }

    // 繰り返しを判定
    if(flag[i][j] == 1){
        code[code.length-1]["goto"] = "label_"+id+"_"+i+"_"+j;
        code = code.map(function(value, index, array){
            if((value["rows"] == i) && (value["cells"] == j)){
                value["label"] = "label_"+id+"_"+i+"_"+j;
                return value;
            }else{
                return value;
            }
        });
        return;
    }
    codeblock = table.rows[i].cells[j].firstChild.firstChild;
    if(codeblock == null){
        return;
    }
    var direction = codeblock.firstElementChild;

    if(codeblock.id == "if"){
        code.push({rows:i, cells:j, id:codeblock.id, label:labelName, true:null, false:null,
                   text:codeblock.firstElementChild.rows[1].cells[1].children[1].value});
        if(i+1 <= 4){
            code[code.length-1]["true"] = "label_"+id+"_"+(i+1)+"_"+j;
        }else{
            code[code.length-1]["true"] = "end"+id;
        }
        if(j+1 <= 4){
            code[code.length-1]["false"] = "label_"+id+"_"+i+"_"+(j+1);
        }else{
            code[code.length-1]["false"] = "end"+id;
        }
        if(i+1 <= 4){
            analyze(id,code,flag,i+1,j,"label_"+id+"_"+(i+1)+"_"+j);
        }
        if(j+1 <= 4){
            analyze(id,code,flag,i,j+1,"label_"+id+"_"+i+"_"+(j+1));
        }
    }else{
        if( (codeblock.id == "value1") ||(codeblock.id == "value2") || (codeblock.id == "value3") ){
            code.push({rows:i, cells:j, id:codeblock.id, label:labelName, goto:null,
                       op:codeblock.firstElementChild.rows[1].cells[1].children[1].value,
                       text:codeblock.firstElementChild.rows[1].cells[1].children[2].value});

        }else if(codeblock.id == "nop"){
            code.push({rows:i, cells:j, id:codeblock.id, label:labelName, goto:null, text:null});
        }else if(codeblock.id == "switch"){
            code.push({rows:i, cells:j, id:codeblock.id, label:null, goto:null, text:null});
        }else{
            if(codeblock.firstElementChild.rows[1].cells[1].children[1].value == undefined){
                code.push({rows:i, cells:j, id:codeblock.id, label:labelName, goto:null,
                           text:null});
            }else{
                code.push({rows:i, cells:j, id:codeblock.id, label:labelName, goto:null,
                           text:codeblock.firstElementChild.rows[1].cells[1].children[1].value});
            }
        }
        flag[i][j] = 1;
        if(direction.rows[0].cells[1].bgColor.toUpperCase() == "#3333CC"){
            // ↑
            i--;
        }else if(direction.rows[1].cells[0].bgColor.toUpperCase() == "#3333CC"){
            // ←
            j--;
        }else if(direction.rows[1].cells[2].bgColor.toUpperCase() == "#3333CC"){
            // →
            j++;
        }else if(direction.rows[2].cells[1].bgColor.toUpperCase() == "#3333CC"){
            // ↓
            i++;
        }else{
            return;
        }

        if( (i < 0) || (j < 0) || (i > 4) || (j > 4)){
            return;
        }else{
            analyze(id,code,flag,i, j, null);
        }
    }
    if(code[code.length-1]["goto"] == null){
        code[code.length-1]["goto"] = "end"+id;
    }
    return;
}

function generate(){
    var sourceCode = "#include <kernel.h>\n"
            + "#include <t_syslog.h>\n"
            + "#include <t_stdlib.h>\n"
            + "#include \"syssvc/serial.h\"\n"
            + "#include \"syssvc/syslog.h\"\n"
            + "#include \"kernel_cfg.h\"\n"
            + "#include \"arduino_app.h\"\n"
            + "#include \"arduino_main.h\"\n"
            + "/* GR-PEACH Sketch Template V1.00 */\n"
            + "#include <Arduino.h>\n"

            + "#define INTERVAL 100\n"
            + "int value1;\n"
            + "int value2;\n"
            + "int value3;\n"
            + "int sw;\n"
            + "\n"
            + "void setup()\n"
        +"{\n"
        +"    value1 = 0;\n"
        +"    value2 = 0;\n"
        +"    sw = 0;\n"
        +"    pinMode(PIN_LED_RED   , OUTPUT);\n"
        +"    pinMode(PIN_LED_GREEN , OUTPUT);\n"
        +"    pinMode(PIN_LED_BLUE  , OUTPUT);\n"
        +"    pinMode(PIN_LED_USER  , OUTPUT);\n"
        +"    pinMode(PIN_SW        , INPUT);\n"
        +"}\n"
        +"void cyclic_handler(intptr_t exinf) {\n"
        +"  irot_rdq(LOOP_PRI); /* change the running loop. */\n"
        +"}\n"
        +"void loop()\n"
        +"{\n";

    sourceCode += output(code);

    sourceCode +="end0:\n    ;\n";
    sourceCode += "}\n";

    sourceCode += "void loop1()\n"
        +"{\n";
    sourceCode += output(code2);
    sourceCode +="end1:\n    ;\n";
    sourceCode += "}\n";

    // document.getElementById("sourceCode").value=sourceCode;
    writeFile("asp-gr_peach_gcc-mbed/examples/led_hearts/led_heart.cpp",sourceCode);
    var consoleArea = document.getElementById("consoleArea");

    const exec = require('child_process').execFile;
    exec("exe.bat",null,
         (error, stdout, stderr) => {consoleArea.innerHTML = ""}
        );
}

function output(code){
    var sourceCode = "";
    for(var token of code){
        if(token.label != null){
            sourceCode += token.label + ":\n";
        }
        switch(token.id){
        case "ledOn":
            switch(token.text){
            case "RED":
                sourceCode += "    digitalWrite(PIN_LED_RED, 1);\n";
                break;
            case "GREEN":
                sourceCode += "    digitalWrite(PIN_LED_GREEN, 1);\n";
                break;
            case "BLUE":
                sourceCode += "    digitalWrite(PIN_LED_BLUE, 1);\n";
                break;
            }
            break;
        case "ledOff":
            switch(token.text){
            case "RED":
                sourceCode += "    digitalWrite(PIN_LED_RED, 0);\n";
                break;
            case "GREEN":
                sourceCode += "    digitalWrite(PIN_LED_GREEN, 0);\n";
                break;
            case "BLUE":
                sourceCode += "    digitalWrite(PIN_LED_BLUE, 0);\n";
                break;
            }
            break;
        case "if":
            sourceCode += "    if("+token.text+") goto " + token.true +"; else goto " + token.false + ";\n"
            break;
        case "value1":
            switch(token.op){
            case "=":
                sourceCode += "    value1 = " + token.text + ";\n";
                break;
            case "+":
                sourceCode += "    value1 += " + token.text + ";\n";
                break;
            case "-":
                sourceCode += "    value1 -= " + token.text + ";\n";
                break;
            case "*":
                sourceCode += "    value1 *= " + token.text + ";\n";
                break;
            case "/":
                sourceCode += "    value1 /= " + token.text + ";\n";
                break;
            default:
                break;
            }
            break;
        case "value2":
            switch(token.op){
            case "=":
                sourceCode += "    value2 = " + token.text + ";\n";
                break;
            case "+":
                sourceCode += "    value2 += " + token.text + ";\n";
                break;
            case "-":
                sourceCode += "    value2 -= " + token.text + ";\n";
                break;
            case "*":
                sourceCode += "    value2 *= " + token.text + ";\n";
                break;
            case "/":
                sourceCode += "    value2 /= " + token.text + ";\n";
                break;
            default:
                break;
            }
            break;
        case "value3":
            switch(token.op){
            case "=":
                sourceCode += "    value3 = " + token.text + ";\n";
                break;
            case "+":
                sourceCode += "    value3 += " + token.text + ";\n";
                break;
            case "-":
                sourceCode += "    value3 -= " + token.text + ";\n";
                break;
            case "*":
                sourceCode += "    value3 *= " + token.text + ";\n";
                break;
            case "/":
                sourceCode += "    value3 /= " + token.text + ";\n";
                break;
            default:
                break;
            }
            break;
        case "delay":
            sourceCode += "    delay("+token.text+");\n";
            break;
        case "nop":
            break;
        case "switch":
            sourceCode += "    sw = digitalRead(PIN_SW);\n";
            break;
        default:
            break;

        }

        if(token.goto != null){
            sourceCode += "    goto " + token.goto + ";\n";
        }
    }

    return sourceCode;
}

// ファイルを書き込む
function writeFile(path, data) {
    var fs = require('fs');
    fs.writeFile(path, data, function (error) {
        if (error != null) {
            alert('error : ' + error);
        }
    });
}
