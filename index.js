/* Default list of categories. More can be added by user input. Selected categories will be fed into chatgpt to generate art prompts */
const list_of_categories = ['Nature', 'Buildings', 'People', 'Animals', 'Food & Drink', 'Small Objects', 'Geometry', 'Fantasy', 'Science'];
/* Categories that the user selected from the list of category buttons. automatically includes user-inputted categories */
let user_created_categories = [];
let selected_categories = [];
const categories_list = document.getElementById('categories-list');

/* generate the html for the category buttons from the default categories */
for (let category of list_of_categories) {
    generateCategoryBtn(category, false);
}
if (localStorage.getItem('user_created_categories')) {
    for (let category of JSON.parse(localStorage.getItem('user_created_categories'))) {
        generateCategoryBtn(category, false);
    }
}

/* dynamically create html buttons for each category and listen for clicks to update selected_categories */
function generateCategoryBtn(category, is_category_selected) {
    /* Create these elements dynamically 1. to allow new buttons to be created via input field and 2. allow event listeners to be attached to them */
    let category_li = document.createElement('li');
    let category_btn = document.createElement('button');
    category_btn.classList.add('btn');
    category_btn.classList.add('category-btn');
    /* <li><button class="btn category-btn">  innerHTML  </button></li> */
    category_btn.innerHTML = `
                                <span class="category-btn-txt">${category}</span>
                                <img src="icons/plus.svg" class='btn-icon' alt="add">
                            `;
    /* Each button has the category name and an icon: +, -, ✓ */
    /* Add the newly created button to the DOM */
    category_li.append(category_btn);
    categories_list.append(category_li);

    /* is_category_selected is used to check if the button has been selected(clicked on or entered via input) by the user or not. Default categories are false (meaning not selected) until clicked. 
    User entered categories are true by default*/
    if (is_category_selected) {
        category_btn.classList.add('active-btn');
        category_btn.innerHTML = `
                                        <span class="category-btn-txt">${category}</span>
                                        <img src="icons/check.svg" class='btn-icon' alt="selected">
                                    `;
        user_created_categories.push(category);
        localStorage.setItem('user_created_categories', JSON.stringify(user_created_categories));
    }
    
    category_btn.addEventListener('click', function() {
 
        /* If a category button is clicked, change the color depending on if it was selected or deselected */
        category_btn.classList.toggle('active-btn');
        is_category_selected = !is_category_selected;

        // console.log('click', category, is_category_selected);

        /* if it is selected, change icon to ✓ */
        if(is_category_selected) {
            category_btn.innerHTML = `
                                        <span class="category-btn-txt">${category}</span>
                                        <img src="icons/check.svg" class='btn-icon' alt="selected">
                                    `;
            // add category to list of categories to query chatgpt
            selected_categories.push(category);
            // if the category is not one of the defaults (meaning user-created) and it is not already included in the user_created_categories array (to prevent duplicates), add it to the array and save that to localStorage
            if (!user_created_categories.includes(category) && !list_of_categories.includes(category)) {
                user_created_categories.push(category);
                localStorage.setItem('user_created_categories', JSON.stringify(user_created_categories));
            }
        }
        /* if it is deselected, change icon back to + */
        else {
            category_btn.innerHTML = `
                                        <span class="category-btn-txt">${category}</span>
                                        <img src="icons/plus.svg" class='btn-icon' alt="add">
                                    `;
            // remove category from list of categories to query chatgpt
            removeElement(selected_categories, category);
            removeElement(user_created_categories, category);
            // update localStorage array once user-created category is unselected
            localStorage.setItem('user_created_categories', JSON.stringify(user_created_categories));
        }
    
        
    });
    category_btn.addEventListener('mouseover', function() {
        /* if a category button is selected and the user hovers over, change icon to - to denote that clicking again will deselect it */
        if(is_category_selected) {
            category_btn.innerHTML = `
                                        <span class="category-btn-txt">${category}</span>
                                        <img src="icons/minus.svg" class='btn-icon' alt="remove">
                                    `;
        }
    });
    category_btn.addEventListener('mouseout', function() {
        /* if a category button is selected and the user leaves the hover, change icon from - to ✓ to bring it back to the selected state */
        if(is_category_selected) {
            category_btn.innerHTML = `
                                        <span class="category-btn-txt">${category}</span>
                                        <img src="icons/check.svg" class='btn-icon' alt="selected">
                                    `;
        }
    });
}

/* get input text from input field either plus clicking + or pressing enter */
const add_category_btn = document.querySelector('.input-category-div .btn-icon');
const input_category = document.getElementById('input-category');
add_category_btn.addEventListener('click', addCustomCategory);
input_category.addEventListener('keydown', function onEvent(e) {
    if (e.key === "Enter") {
        addCustomCategory();
    }
})

/* add user-created category from input field into the array of selected categories, and create a category button that is already selected, and clear the input field */
function addCustomCategory() {
    let custom_category = capitilizeFirstLetter(input_category.value);
    generateCategoryBtn(custom_category, true);
    selected_categories.push(custom_category);
    input_category.value = '';
}
/* Capitilize only the first letter in the string, while all other characters are lowercase.
This is to standardize the user's input so it matches the prebuilt categories */
function capitilizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/* Remove element from array */
function removeElement(array, item) {
    const index_to_remove = array.indexOf(item);
    if (index_to_remove > -1) {
        array.splice(index_to_remove, 1);
    }
}



/* Open AI ChatGPT setup */
// did not work because node.js is extremely confusing and convoluted.
// Taken from https://runjs.app/blog/chatgpt-javascript-api
// initial load of openai npm package // downloaded by typing 'npm i openai' into the terminal
// const { Configuration, OpenAIApi } = require("openai");
// import { Configuration, OpenAIApi } from "openai";
// setup openai api key
/* OpenAI API key: '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' */
// const configuration = new Configuration({
//     apiKey: ''
// });
// Configure openai api access
// const openai = new OpenAIApi(configuration);

// Next, take the user input and write the main function to get a response.
/*
createChatCompletion parameters
gpt-3.5 is limited to text-based inputs, faster at generating responses, and doesn't have hourly prompt restrictions.
max_tokens is the number of tokens able to be received back. 1 english word = 1.3 tokens.
Temperature is a hyperparameter used in some natural language processing models, including ChatGPT, to control the level of randomness or "creativity" in the generated text. Higher temperatures result in more diverse and unpredictable output. Conversely, lower temperatures result in more conservative and predictable output. 
top_p can also be used to control randomness, but documentation recommended either changing temperature or top_p, not both.
*/
// const getResponse = async () => {
//     const response = await openai.createChatCompletion({
//         model: 'gpt-3.5-turbo',
//         messages: [
//             {
//                 role: 'user',
//                 content: query_string
//             },
//         ],
//         temperature: 0,
//         max_tokens: 2048,
//         temperature: 1.5, 
//         top_p: 1.0,
//         frequency_penalty: 0.0,
//         presence_penalty: 0.0
//     });
    
//     console.log(response.data.choices[0].message);
// }


// https://www.builder.io/blog/stream-ai-javascript

let query_string = '';
/* Using the selected_categories array, which contain all the categories that the user has selected (either entered through input or clicked on button), query chatgpt for responses on 'ideas for what to draw about ...' or just 'ideas about ...'*/
const generate_prompt_btn = document.getElementById('random-prompt-btn');

generate_prompt_btn.addEventListener('click', function() {
    console.log(selected_categories);

    // create a query string to enter into chaptgpt
    query_string = `Suggest an idea for artwork about `;
    for (let category of selected_categories) {
        query_string += `${category}, `;
    }
    // console.log(query_string);
    // call the chaptgpt api to generate a text response from ai about the query string.
    // getResponse();
});

const API_URL = "<https://api.openai.com/v1/chat/completions>";
const API_KEY = "YOUR_API_KEY";






/* Handle Color generation */

/* generate random color on page load*/
let main_color = generateRandomColor();
let main_color_data = {};
/* Change color of main-color variable */
// Get the root element
const root_DOM = document.querySelector(':root');
/* set the main color to the css variable to dynamically change the look of the webpage*/
setMainColor(main_color);

// Create a function for getting a variable value. UNUSED in app, just for testing.
function getMainColor() {
  // Get the styles (properties and values) for the root
  const root_styles = getComputedStyle(root_DOM);
  // Log the value of the --main-color variable
  console.log("The value of --main-color is: " + root_styles.getPropertyValue('--main-color'));
}

// Create a function for setting a css variable value
function setMainColor(new_main_color) {
    getSetDarkMainColor(new_main_color);
    // Set the value of variable --main-color and --main-color20 to the randomly generated color value
    root_DOM.style.setProperty('--main-color', `rgb(${new_main_color.r}, ${new_main_color.g}, ${new_main_color.b})`);
    root_DOM.style.setProperty('--main-color20', `rgba(${new_main_color.r}, ${new_main_color.g}, ${new_main_color.b}, 0.2)`);
}
/* get the monochrome-dark version of the main generated color. Use this color on the big buttons for maximum stylized readability */
function getSetDarkMainColor(main_color) {
    fetch(`https://www.thecolorapi.com/scheme?rgb=${main_color.r},${main_color.g},${main_color.b}&mode=${'monochrome-dark'}&count=1`)
            .then(response => response.json())
            .then(dark_color => {
                // console.log(dark_color);
                root_DOM.style.setProperty('--dark-main-color', `${dark_color.colors[0].rgb.value}` );
            });
}

/* Generate 3 random values from 0 to 255 for (red, green, blue) to generate a completely random color */
function generateRandomColor() {
    // generate 3 random values from 0 to 255
    const r_val = Math.floor(Math.random()*256);
    const g_val = Math.floor(Math.random()*256);
    const b_val = Math.floor(Math.random()*256);
    
    // call thecolorapi to get color info for converting to other color formats
    // not actually used in this app, but can be useful for expanding functionality
    // this is for getting more data about this color.
    fetch(`https://www.thecolorapi.com/id?rgb=(${r_val},${g_val},${b_val})`)
    .then(response => response.json())
    .then(color_data => {
        // console.log('fetch main color',color_data);
        main_color_data = color_data;
    });
    return {r: r_val, g: g_val, b: b_val};
    // return an object with (r,g,b)
}

const color_scheme_buttons = [
    document.getElementById('monochromatic-btn'),
    document.getElementById('analogous-btn'),
    document.getElementById('complementary-btn'),
    document.getElementById('split-complementary-btn'),
    document.getElementById('triadic-btn')
];
const color_scheme_names = [
    'monochrome',
    'analogic',
    'complement',
    'analogic-complement',
    'triad'
];
const color_blocks = [
    document.getElementById('color1'),
    document.getElementById('color2'),
    document.getElementById('color3'),
    document.getElementById('color4'),
    document.getElementById('color5')     
];
let color_scheme_index = 0;
getColorScheme(color_scheme_index);

document.addEventListener('click', function(e) {
    // console.log(e.target.id);

    /* Handle click on color scheme buttons */
    /* Whenever 'Pick New Random Color button is clicked, generate and set a new random color */
    if (e.target.id === 'random-color-btn') {
        main_color = generateRandomColor();
        setMainColor(main_color);

        getColorScheme(color_scheme_index);

    }
    /* When a color scheme button is clicked, change the css to show which button is selected. Only one color scheme can be selected at once. */
    else if (color_scheme_buttons.includes( document.getElementById(e.target.id) )) {
        // find which color scheme button was clicked
        color_scheme_index = color_scheme_buttons.indexOf( document.getElementById(e.target.id) );
        
        // remove .active-btn class from all color scheme buttons
        for (let i=0; i< color_scheme_buttons.length; i++) {
            color_scheme_buttons[i].classList.remove('active-btn');
        }
        // add .active-btn class to the selected color scheme button
        color_scheme_buttons[color_scheme_index].classList.add('active-btn');

        /* get the color scheme from the main_color and which color scheme was selected */
        getColorScheme(color_scheme_index);
           
    }
    
});

/* Based on which color scheme was selected, GET a list of colors from thecolorapi using the corresponding color_scheme */
function getColorScheme(index) {
    // GET color scheme from thecolorapi
    fetch(`https://www.thecolorapi.com/scheme?rgb=${main_color.r},${main_color.g},${main_color.b}&mode=${color_scheme_names[index]}&count=4`)
    .then(response => response.json())
    .then(data => {
        // console.log(data);

        if (color_scheme_names[index] === 'complement') {
            let complement_color = data.colors[0].rgb;
            color_blocks[1].style.backgroundColor = complement_color.value;
            // get the monochrome scheme of the complement color
            fetch(`https://www.thecolorapi.com/scheme?rgb=${complement_color.r},${complement_color.g},${complement_color.b}&mode=${color_scheme_names[0]}&count=3`)
            .then(response => response.json())
            .then(complement_data => {
                // console.log(complement_data)
                let cc=2;
                for (let comp_color of complement_data.colors) {
                    color_blocks[cc].style.backgroundColor = comp_color.rgb.value;
                    cc++;
                }
            });
        }
        else if (color_scheme_names[index] === 'triad') {
            // change colorblocks 3,4. colorblock 3 is to be a monochrome of colorblock 1. colorblock 4 is to be a monochrome of colorblock 2.
            let triad1_color = data.colors[0].rgb;
            let triad2_color = data.colors[1].rgb;
            color_blocks[1].style.backgroundColor = triad1_color.value;
            color_blocks[2].style.backgroundColor = triad2_color.value;
            fetch(`https://www.thecolorapi.com/scheme?rgb=${triad1_color.r},${triad1_color.g},${triad1_color.b}&mode=${color_scheme_names[0]}&count=1`)
            .then(response => response.json())
            .then(triad3_data => {
                // console.log(triad3_data);
                color_blocks[3].style.backgroundColor = triad3_data.colors[0].rgb.value;
            });
            fetch(`https://www.thecolorapi.com/scheme?rgb=${triad2_color.r},${triad2_color.g},${triad2_color.b}&mode=${color_scheme_names[0]}&count=1`)
            .then(response => response.json())
            .then(triad4_data => {
                color_blocks[4].style.backgroundColor = triad4_data.colors[0].rgb.value;
            });
        }
        else {
            /* change color of colorblocks 1,2,3,4. colorblock 0 is the main color generated at the beginning */
            let c=1;
            // console.log(main_color_data.rgb.value); 
            for (let color of data.colors) {
                // console.log(color.rgb.value);
                color_blocks[c].style.backgroundColor = color.rgb.value;
                c++;
            }
        }
    });
}

function selectCategory(buttonname) {
    console.log(buttonname);
    // for (let category_li of list_of_category_btns) {
    //     if (category_li.getAttribute('id') === buttonname) {
    //         category_li.innerHTML = `
    //                         <button class="btn category-btn active-btn" data-buttonname="${buttonname}">
    //                             <p>${buttonname}</p>
    //                             <img src="icons/check.svg" class='btn-icon' alt="selected">
    //                         </button>
    //                         `;
    //         break;
    //     }
    // }
}