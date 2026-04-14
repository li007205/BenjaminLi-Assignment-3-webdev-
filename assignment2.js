let loaded_puzzle = 0; //index of the current puzzle we have loaded
let current_colors = new Set(); //set of rgba color strings in the loaded image
let selected_color = '';

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
    selected_color = '';
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


//go through the set of current colors and assign each one a number
//set the text content of each grid cell to the correct number
//finally, create a button for each color
function createColorList(current_storage) {
    let color_numbers = [...current_colors];
    for(let y=0;y<16;y++) {
        for(let x=0;x<16;x++) {
            const cell = document.querySelector(`#cell-${x}-${y}`);
            if(current_storage[convertCoordsToIndex(x,y)] == '0') { //set cell's text content only if that cell hasn't been clicked
                cell.textContent = (color_numbers.indexOf(cell.dataset.c)+1);
            }
        }
    }

    const container = document.querySelector("#color-selector");
    container.innerHTML = ""; //clear the previous buttons
    for(let i = 0; i<color_numbers.length; i++) {
        const btn = document.createElement('button');
        btn.textContent = (i+1);
        btn.dataset.c = color_numbers[i];
        
        btn.style.backgroundColor = btn.dataset.c;
        btn.style.color = getContrastColor(color_numbers[i]);
        btn.id = `color-selector-${i}`;
        btn.dataset.index = i;
        btn.addEventListener("click", () => {
            switchColor(btn);
        });
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


//switches the currently selected color to the color of the selector button that was just pressed
function switchColor(button) {
   const color_selectors = document.querySelectorAll("#color-selector button")
    for(let c of color_selectors) {
        if(c.classList.contains("selected")) {
            c.classList.remove("selected")
        }
    }
    selected_color = button.dataset.c;
    button.classList.add("selected");
}


//takes in a string for an rgba color and returns the best text color to use ontop of that background
//this is used for the color selecting buttons on the sidebar
function getContrastColor(rgbaColor) {
    let parse_string = rgbaColor.substring(5,rgbaColor.length-1);
    parse_string = parse_string.split(",");

    //find the perceived brightness value
    brightness = Math.sqrt((parse_string[0]*parse_string[0]*.241)+(parse_string[1]*parse_string[1]*.691)+(parse_string[2]*parse_string[2]*.068));
    if(brightness>130) {
        return 'rgba(0,0,0,1)';
    } else {
        return 'rgba(255,255,255,1)';
    }
}

//converts a cell's x and y coordinates into a 0-255 index for use with the localstorage strings
function convertCoordsToIndex(x,y) {
    return (y*16)+x;
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
    current_data = '0';
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


//add click events for the settings menu
const dialog = document.querySelector('dialog');
const dialogBtn = document.querySelector('#close');
dialogBtn.addEventListener('click',()=>{
    dialog.close();
});
const settings = document.querySelector('#settings-button');
document.querySelector('#settings-image').draggable = false;
document.querySelector('#close-image').draggable = false;
settings.addEventListener('click',()=>{
    dialog.showModal();
});
const reset = document.querySelector('#reset-button');
reset.addEventListener('click',()=>{
    createStorage();
    createGrid();
})
const default_palette = document.querySelector('#default-palette');
const light_palette = document.querySelector('#light-palette');
const dark_palette = document.querySelector('#dark-palette');
default_palette.addEventListener('click',()=>{
    changePalette(0);
});
light_palette.addEventListener('click',()=> {
    changePalette(1);
});
dark_palette.addEventListener('click',()=>{
    changePalette(2);
});


//changes the palette based on the number provided
//connected to the palette buttons in the settings menu
function changePalette(index) {
    localStorage.setItem('colorByNumbers_Palette',index);
    const s = document.documentElement.style;
    if(index==0) {
        s.setProperty('--font-color','#ffffff');
        s.setProperty('--main-bg-color','#363d66');
        s.setProperty('--second-bg-color','#040c40');
        s.setProperty('--border-color','#1d2453');
    } else if(index==1) {
        s.setProperty('--font-color','#000000');
        s.setProperty('--main-bg-color','#ffffff');
        s.setProperty('--second-bg-color','#c8c8c8');
        s.setProperty('--border-color','#969696');
    } else {
        s.setProperty('--font-color','#ffffff');
        s.setProperty('--main-bg-color','#2b2b2b');
        s.setProperty('--second-bg-color','#181C14');
        s.setProperty('--border-color','#000000');
    }
}



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