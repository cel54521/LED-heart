"use strict";

var no =0;

function dragStart(event){
    event.dataTransfer.setData("text", event.target.id);
}

function dragOver(event){
    event.preventDefault();
}


function drop(event){
    var id_name = event.dataTransfer.getData("text");
    var drag_elm =document.getElementById(id_name);
    var copy_elm= drag_elm.cloneNode(true);
    var table;

    copy_elm.setAttribute("id"+no,"elm"+no);
    table = copy_elm.firstElementChild;

    no++;
    if(event.currentTarget.id != "start"){
        if(table.rows[1].cells[1].firstChild.id == "parallel"){
            event.preventDefault();
            return;
        }
    }
    while (event.currentTarget.firstChild) {
        event.currentTarget.removeChild(event.currentTarget.firstChild);
    }

    event.currentTarget.appendChild(copy_elm);
    event.preventDefault();


    if( (table.rows[1].cells[1].firstElementChild.id == "if") || (table.rows[1].cells[1].firstElementChild.id == "parallel")){
        table.rows[1].cells[2].bgColor = "#CC3333";
        table.rows[2].cells[1].bgColor = "#3333CC";
    }
}
