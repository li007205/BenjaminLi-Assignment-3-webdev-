import { getContrastColor, convertCoordsToIndex } from "./utilities.js";

export let current_colors = new Set(); //set of rgba color strings in the loaded image
export let selected_color = '';

export function createColorList(current_storage) {
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


export function switchColor(button) {
   const color_selectors = document.querySelectorAll("#color-selector button")
    for(let c of color_selectors) {
        if(c.classList.contains("selected")) {
            c.classList.remove("selected")
        }
    }
    selected_color = button.dataset.c;
    button.classList.add("selected");
}

export function setSelectedColor(val) {
    selected_color=val;
}