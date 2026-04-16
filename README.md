Assignment2.js 
Only 1 javascript file
The file does all the coloring, grid, settings and etc.
<br>
<img width="360" height="810" alt="original assignment2" src="https://github.com/user-attachments/assets/1eca1acf-279d-4b83-ba02-e8cb6ebfbde6" />
<br>
<img width="1340" height="940" alt="modularized assignment2(1)" src="https://github.com/user-attachments/assets/c4abb22b-af9f-4a56-8aa4-bf3d7c04cf9e" />
<br>
modules of some sort of list functions, setting modules and utilities module.  

List module: it will have all the list of colors, button and images. 

    CreatePuzzleList 

    CreatePuzzleList 

    SwitchColor 

     

Setting module: color settings, grid settings, page settings 

    ChangePalette 

    ChangePage 

     

Utility module: accessibility and other features. 

    GetContrastColor 

    UpdateProgress 

    ConvertCoordsToIndex 

<br>

Assignment2.js: 

This js file is the main file 

ColorList.js: 

The file has the list of color that can be swapped around 

Utilities.js: 

The file has coloring text with specific background and x,y coord conversion. 

ColorSetting.js: 

The file has background color swapping for the site 

 

ColorList.js: 

    Moved and export the createColorLIst and switchColor functions 

    Moved and export the current_color and selected_color variables 

    Created setSelectorColor function to maintain the selected_color variable used from the assignment2.js file. 

 

Utilities.js: 

    Moved and export getContrastColor and convertCoordToIndex 

    Able to how text color depending on the background color its placed as part of the utility 

    Separate the convertCoordToIndex to change the index if needed 

ColorSetting.js: 

    Moved and export changePalette  


    
