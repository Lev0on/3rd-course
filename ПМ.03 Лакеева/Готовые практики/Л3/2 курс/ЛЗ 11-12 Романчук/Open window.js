function choiceOf(){
    if(confirm('Вы действительно хотите открыть окно?')){
        volvo = window.open('volvo.html' , 'display_volvo',
        'with = 400,height = 300 , status = no. toolbar =no, menubar =no');
    }
}

function close_pict(){
    window.close();
}

function choiceOf1(){
    alert("Вы нажали на кнопку 1");
}
function choiceOf2(){
    alert("Вы нажали на кнопку 2");
}