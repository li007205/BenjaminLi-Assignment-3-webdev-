
export function changePalette(index) {
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