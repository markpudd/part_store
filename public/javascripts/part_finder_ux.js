function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev,obj) {
    obj.classList.add('drag_taken');
    ev.dataTransfer.setData("text", ev.target.id);
}



function dragEnter(e) {
  this.classList.add('drag_over');
}

function dragLeave(e) {
  this.classList.remove('drag_over');
}



function dragEnd(e,obj) {

    obj.classList.remove('drag_taken');

}


var x = document.querySelectorAll('.store');
var i;
for (i = 0; i < x.length; i++) {
    x[i].addEventListener('dragenter', dragEnter, false);
    x[i].addEventListener('dragleave', dragLeave, false);
}

