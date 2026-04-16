import { createColorList, current_colors, selected_color, setSelectedColor } from "./colorList.js";
import { convertCoordsToIndex } from "./utilities.js";
import { changePalette } from "./colorSetting.js";

let loaded_puzzle = 0; //index of the current puzzle we have loaded


//find whether the mouse is currently held down
//this will be used to drag over multiple cells, rather than having to click one-by-one
let held_down = false;
document.addEventListener('pointerdown', ()=>{held_down = true;});
document.addEventListener('pointerup',()=>{held_down = false;});

let progress = 0;

//to access a puzzle, you can do puzzles[x].name or puzzles[x].id
const puzzles = [
    {name: "Canvas", id: "Canvas"},
    {name: "Blossoms", id: "Blossoms"},
    {name: "Sunset", id: "Sunset"},
    {name: "Knight", id: "Knight"},
    {name: "Train", id: "Train"},
    {name: "Island", id: "Island"}
];

window.addEventListener('storage',(e)=>{
    const changed_puzzle = e.key.split('_')[1];
    if(changed_puzzle==puzzles[loaded_puzzle].id) {
        createGrid();
    }
});


//change the title to the name given
function setTitle(name) {
    const title = document.querySelector("#title");
    title.textContent = name;
}


//go through the pixel data of the current image and create a grid cell for each one
function createGrid() {
    progress = 0;
    setTitle(`${puzzles[loaded_puzzle].name} - 0%`);
    const grid = document.querySelector("#puzzle-grid");
    grid.innerHTML = "";

    let data = getImageData(puzzles[loaded_puzzle].id);
    //using a set for colors, we can attempt to add every color in the data and it will automatically remove duplicates
    current_colors.clear();
    let current_storage = loadStorage();
    let x = 0;
    let y = 0;
    for(let i = 0; i<data.length;i+=4) {
        const cell = document.createElement("button");
        cell.className = "grid-cell";
        cell.id = `cell-${x}-${y}`;
        cell.dataset.x = x;
        cell.dataset.y = y;

        let r = data[i];
        let g = data[i+1];
        let b = data[i+2];
        let a = data[i+3]/255.0;
        let color = `rgba(${r},${g},${b},${a})`;
        current_colors.add(color);
        cell.dataset.c = color;
        
        grid.appendChild(cell);
        
        if(current_storage[convertCoordsToIndex(x,y)] == '0') { //cell has not been clicked in storage
            cell.addEventListener('pointerdown', ()=> {
                buttonClick(cell);
            });

            cell.addEventListener('pointerenter', ()=> {
                if(held_down) {
                    buttonClick(cell);
                }
            });  
            cell.addEventListener('keydown', (e)=>{
                if(e.key=="Enter"||e.key==" ") {
                    buttonClick(cell);
                }
            });
        } else { //cell has been clicked in storage
            cell.style.backgroundColor = color;
            cell.style.color = color;
            cell.textContent = '0';
            updateProgress();
            cell.style.cursor = "default";
        }
        x++;
        if(x>15) {
            x=0;
            y++;
        }
    }

    createColorList(current_storage);
}


//change to a new loaded puzzle
//connected to the sidebar puzzle buttons
function changePage(puzzle_number) {
    loaded_puzzle = puzzle_number;
    localStorage.setItem('colorByNumbers_Puzzle',loaded_puzzle);
    setSelectedColor('');
    createGrid();
}


//create list of buttons in the sidebar for switching puzzles
function createPuzzleList() {
    const container = document.querySelector("#puzzle-list");
    container.innerHTML = ""; //clear the previous list

    for(let i=0;i<puzzles.length;i++) {
        const p = puzzles[i];
        const btn = document.createElement("button");
        btn.textContent = p.name;
        btn.id = `puzzle-list-${i}`;
        btn.dataset.index = i;
        btn.addEventListener("click", () => {changePage(i);});
        container.appendChild(btn);
    }
}


//draw the given image to the hidden canvas and return the pixel data (rgba colors)
function getImageData(image_id) {
    const canvas = document.querySelector("#hidden-canvas");
    const ctx = canvas.getContext("2d",{willReadFrequently: true});
    const image = document.querySelector(`#${image_id}`);
    ctx.drawImage(image, 0, 0);
    const data = ctx.getImageData(0,0,16,16).data;
    return data;
}


//fills in the clicked cell with the correct color if it is the currently selected color (and it isn't already filled)
function buttonClick(button) {
    let current_data = loadStorage();
    const storage_index = convertCoordsToIndex(Number(button.dataset.x),Number(button.dataset.y));
    if(current_data[storage_index]=='0' && button.dataset.c == selected_color) {
        button.style.backgroundColor = button.dataset.c;
        button.style.color = button.dataset.c;
        current_data = modifyString(current_data,storage_index,"1");
        setStorage(current_data);
        updateProgress();
        button.style.cursor = "default";
    }


}


//returns the local storage string for the currently selected puzzle
function loadStorage() {
    let current_data = localStorage.getItem(`colorByNumbers_${puzzles[loaded_puzzle].id}`);
    if (current_data==null) {
        current_data = createStorage();
    }
    return current_data;
}

//sets the local storage string for the currently selected puzzle to the item passed in
function setStorage(item) {
    localStorage.setItem(`colorByNumbers_${puzzles[loaded_puzzle].id}`,item);
}

//create a string in storage for the currently selected puzzle
function createStorage() {
    let current_data = '0';
    current_data = current_data.repeat(256);
    localStorage.setItem(`colorByNumbers_${puzzles[loaded_puzzle].id}`,current_data);
    return current_data;
}

//replaces character at index with the new character
function modifyString(str,index,new_char) {
    return(str.substring(0,index)+new_char+str.substring(index+1));
}

//increments the total progress and checks when the puzzle is complete
function updateProgress() {
    progress++;
    let percent = Math.round((progress/256)*100);
    if(progress<256 && percent==100) {
        percent = 99;
    }
    setTitle(`${puzzles[loaded_puzzle].name} - ${percent}%`);
    if(progress>= 256) {
        const cells = document.querySelectorAll('.grid-cell');
        for(let i=0;i<cells.length;i++) {
            cells[i].style.borderColor = 'transparent';
        }
        
    }
}

const reset = document.querySelector('#reset-button');
reset.addEventListener('click',()=>{
    createStorage();
    createGrid();
})

//load color palette from local storage
//the Number() method will make it default to 0 if getItem returns null
changePalette(Number(localStorage.getItem('colorByNumbers_Palette')));

//run the functions which load the elements on the page
//uses window.onload to wait for all the image elements to fully load before we attempt to read from them
window.onload = ()=>{
    changePage(Number(localStorage.getItem('colorByNumbers_Puzzle')));
    createPuzzleList();
};

//gets key input, allowing the user to control focus using arrow keys 
window.addEventListener('keydown',(e)=>{
    let focus = document.activeElement;
    if(e.key=="ArrowRight") {
        if(focus.classList.value=='grid-cell') {
            if(Number(focus.dataset.x)<15){
                document.querySelector(`#cell-${Number(focus.dataset.x)+1}-${Number(focus.dataset.y)}`).focus();
            } else {
                document.querySelector('#settings-button').focus();
            }
        } else if(focus.id=='settings-button') {
            document.querySelector('#puzzle-list-0').focus();
        } else if(focus.id.includes('puzzle-list')) {
            document.querySelector('#cell-0-0').focus();
        } else if(focus.id.includes('color-selector')) {
            const index = Number(focus.dataset.index);
            if(index==2 || index==5 || index==8) {
                document.querySelector('#cell-0-0').focus();
            } else {
                const next_selector = document.querySelector(`#color-selector-${index+1}`);
                if(next_selector==null) {
                    document.querySelector('#cell-0-0').focus();
                } else {
                    next_selector.focus();
                }
            }
        }
    } else if(e.key=="ArrowLeft") {
        if(focus.classList.value=='grid-cell') {
            if(Number(focus.dataset.x)>0){
                document.querySelector(`#cell-${Number(focus.dataset.x)-1}-${Number(focus.dataset.y)}`).focus();
            } else {
                document.querySelector('#puzzle-list-0').focus();
            }
        } else if(focus.id=='settings-button') {
            document.querySelector('#cell-15-0').focus();
        } else if(focus.id.includes('puzzle-list')) {
            document.querySelector('#settings-button').focus();
        } else if(focus.id.includes('color-selector')) {
            const index = Number(focus.dataset.index);
            if(index==0 || index==3 || index==6) {
                document.querySelector('#settings-button').focus();
            } else {
                document.querySelector(`#color-selector-${index-1}`).focus();
            }
        }
    } else if(e.key=="ArrowDown") {
        if(focus.classList.value=='grid-cell') {
            if(Number(focus.dataset.y)<15){
                document.querySelector(`#cell-${Number(focus.dataset.x)}-${Number(focus.dataset.y)+1}`).focus();
            } else {
                document.querySelector(`#cell-${Number(focus.dataset.x)}-0`).focus();
            }
        } else if(focus.id=='settings-button') {
            document.querySelector('#cell-15-0').focus();
        } else if(focus.id.includes('puzzle-list')) {
            const next_puzzle = document.querySelector(`#puzzle-list-${Number(focus.dataset.index)+1}`);
            if(next_puzzle==null) {
                document.querySelector('#color-selector-0').focus();
            } else {
                next_puzzle.focus();
            }
        } else if(focus.id.includes('color-selector')) {
            const index = Number(focus.dataset.index);
            if(index==6 || index==7 || index==8) {
                document.querySelector('#puzzle-list-0').focus();
            } else {
                const next_selector = document.querySelector(`#color-selector-${index+3}`);
                if(next_selector==null) {
                    document.querySelector('#puzzle-list-0').focus();
                } else {
                    next_selector.focus();
                }
            }
        }
    } else if(e.key=="ArrowUp") {
        if(focus.classList.value=='grid-cell') {
            if(Number(focus.dataset.y)>0){
                document.querySelector(`#cell-${Number(focus.dataset.x)}-${Number(focus.dataset.y)-1}`).focus();
            } else {
                document.querySelector(`#cell-${Number(focus.dataset.x)}-15`).focus();
            }
        } else if(focus.id=='settings-button') {
            document.querySelector('#cell-15-15').focus();
        } else if(focus.id.includes('puzzle-list')) {
            const next_puzzle = document.querySelector(`#puzzle-list-${Number(focus.dataset.index)-1}`);
            if(next_puzzle==null) {
                document.querySelector('#color-selector-6').focus();
            } else {
                next_puzzle.focus();
            }
        } else if(focus.id.includes('color-selector')) {
            const index = Number(focus.dataset.index);
            if(index==0 || index==1 || index==2) {
                document.querySelector('#puzzle-list-5').focus();
            } else {
                const next_selector = document.querySelector(`#color-selector-${index-3}`);
                if(next_selector==null) {
                    document.querySelector('#puzzle-list-5').focus();
                } else {
                    next_selector.focus();
                }
            }
        }
    }

});
