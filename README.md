Task 1:
<br>
Assignment2.js 
Only 1 javascript file
The file does all the coloring, grid, settings and etc.
<br>

<img width="360" height="810" alt="original assignment2(1)" src="https://github.com/user-attachments/assets/b7d4c5a7-af74-414d-b063-a0b1ba0a01ca" />

<br>
<img width="780" height="948" alt="modularized assignment2(2)" src="https://github.com/user-attachments/assets/0f87afae-3047-4e54-b57b-3354f10c7224" />

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
Task 2:
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

    Moved dialog, dialogBtn, setting, default_palatte, light_palatte, dark_palatte 

    Allow the user to change into 3 color settings for the background of the site 
