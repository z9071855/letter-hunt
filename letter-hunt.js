window.onload = function (event) {

    //QUERY SELECTORS
    const CAPS_LOCK_INDICATOR = document.querySelector('#capsLock');

    //CEHCK BOXES
    const LOWERCASE_CHECKBOX = document.querySelector('#lowercaseCheckbox');
    const UPPERCASE_CHECKBOX = document.querySelector('#uppercaseCheckbox');
    const NUMBER_CHECKBOX = document.querySelector('#numberCheckbox');
    const SPECIAL_CHECKBOX = document.querySelector('#specialCheckbox');
    //GROUPED FOR EVENT LISTENERS
    const CHECKBOXES = [
        LOWERCASE_CHECKBOX, UPPERCASE_CHECKBOX, NUMBER_CHECKBOX, SPECIAL_CHECKBOX
    ]

    //GAME LETTER
    const GAME_LETTER = document.querySelector('#find-letter');

    //SCORE TABLES
    const LOWERCASE_STATS = document.querySelector('#lowercaseStats');
    const UPPERCASE_STATS = document.querySelector('#uppercaseStats');
    const NUMBER_STATS = document.querySelector('#numberStats');
    const SPECIAL_STATS = document.querySelector('#specialStats');

    //DATA HOLDERS
    const LOWERCASE_CHARACTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const UPPERCASE_CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const NUMBER_CHARACTERS = '0123456789'.split('');
    const SPECIAL_CHARCATERS = '~`!@#$%^&*()-_=+[{]}\\|;:\'",<.>/? '.split(''); //how layed out on the keyboard
    const REMAPPED_SPECIAL_CHARACTERS = SPECIAL_CHARCATERS
        .map(elem => elem.charCodeAt(0))
        .sort((a, b) => a - b)
        .map(elem => String.fromCharCode(elem));
    const VALID_CHARACTERS = LOWERCASE_CHARACTERS
        .concat(UPPERCASE_CHARACTERS)
        .concat(NUMBER_CHARACTERS)
        .concat(REMAPPED_SPECIAL_CHARACTERS);

    // HASHTABLE FOR PROGRAM
    const HUNTED_LETTERS = [
        LOWERCASE_CHARACTERS,
        UPPERCASE_CHARACTERS,
        NUMBER_CHARACTERS,
        REMAPPED_SPECIAL_CHARACTERS
    ];

    /**
     * Creates a table with the character on the left and a score setting on the right
     * @param {HTMLNode} target table targeted by the function
     * @param {String[]} data dataset intended to build the table
     */
    function generateTableStats(target, data) {
        for (let i = 0; i < data.length; i++) {
            let tempCharacter = data[i];
            let row = document.createElement('tr');
            let leftCell = document.createElement('td');
            let rightCell = document.createElement('td');
            leftCell.innerHTML = tempCharacter;
            rightCell.innerHTML = 0;
            rightCell.id = `count-${tempCharacter}`;
            rightCell.dataset.value = 0
            row.appendChild(leftCell);
            row.appendChild(rightCell);
            target.appendChild(row);
        };
    }

    //build the score tables dynamically
    generateTableStats(LOWERCASE_STATS, LOWERCASE_CHARACTERS);
    generateTableStats(UPPERCASE_STATS, UPPERCASE_CHARACTERS);
    generateTableStats(NUMBER_STATS, NUMBER_CHARACTERS);
    generateTableStats(SPECIAL_STATS, REMAPPED_SPECIAL_CHARACTERS);


    /**
     * pulls a random letter out of a set of characters and returns it without a duplicate being possible
     * @param {String[]} DATASET the set of charcters passed from the caller
     * @param {String} previousCharacter passes the previous character so it cannot be selected twice in a row
     * @returns a character from the requested dataset
     */
    const randomCharacter = function (DATASET, previousCharacter) {

        //ensure the dataset is an array
        if (!Array.isArray(DATASET)) {
            console.error(DATASET);
            throw Error('random character dataset not found');
        }


        //TODO 011 add a check to make sure the dataset is not empty or contains 1 element
        if (DATASET.length < 2) {
            throw Error('not enough data in the set size <2');
        }

        //safety check if there is no character
        if (previousCharacter === undefined) {
            return DATASET[Math.floor(Math.random() * DATASET.length)]
        }
        previousCharacter = previousCharacter[0];

        //check if the previous character is in the dataset and removes it if it is
        if (DATASET.indexOf(previousCharacter[0]) !== -1) {
            //remove that data point and has the new list
            hash = DATASET.filter(data => data !== previousCharacter[0]);
            //return the datapoint
            return hash[Math.floor(Math.random() * hash.length)];
        }
        return DATASET[Math.floor(Math.random() * DATASET.length)];

    }

    //this controls the state of the game
    let state = [
        LOWERCASE_CHECKBOX.checked,
        UPPERCASE_CHECKBOX.checked,
        NUMBER_CHECKBOX.checked,
        SPECIAL_CHECKBOX.checked
    ];

    /**
     * This checks the state of the checkboxes 
     * @returns boolean[] 
     */
    const checkCheckboxState = function () {
        state = [
            LOWERCASE_CHECKBOX.checked,
            UPPERCASE_CHECKBOX.checked,
            NUMBER_CHECKBOX.checked,
            SPECIAL_CHECKBOX.checked
        ];

        console.log(`state=>${state}`);
        return state;
    };

    /**
     * changes the boolean into a map
     * @param {boolean[]} checkboxState 
     * @returns int[]
     */
    const hashCheckboxState = function (checkboxState) {
        let hash = [], counter = 0;
        for (let i = 0; i < checkboxState.length; i++) {
            if (checkboxState[i]) {
                hash[counter] = i;
                counter++;
            }
        }
        // console.log(`hash=>${hash}`);
        return hash;
    }

    /**
     * returns a random character from the desired dataset
     * @param {String} previousLetter 
     * @returns char
     */
    const randomCharacterReturn = function (previousLetter) {
        let stateHash = hashCheckboxState(state);
        let selection = Math.floor(Math.random() * stateHash.length);
        // console.log(`selection=>${selection}`);
        // console.log(`hashed selection=>${stateHash[selection]}`);
        let chosen = randomCharacter(HUNTED_LETTERS[stateHash[selection]], previousLetter);
        // let chosen = randomCharacter[hash[selection]]();
        // console.log(`chosen=>${chosen}`);
        return chosen;
    }

    //starts with a random letter
    GAME_LETTER.innerHTML = randomCharacter(HUNTED_LETTERS[0]);

    //CAPS LOCK CHECK
    window.addEventListener('keydown', function (e) {
        //if caps lock is true change the background to red, if its false change it to white and hide it
        if (e.getModifierState('CapsLock')) {
            CAPS_LOCK_INDICATOR.className = 'capsLockOn';
        } else {
            CAPS_LOCK_INDICATOR.className = 'capsLockOff';
        }
    });

    /**
     * adds an event listener for each checkbox to change the state of the game instead of calling it each time a button is pressed
     */
    CHECKBOXES.forEach(function (checkbox) {
        checkbox.addEventListener('input', function () {
            //this is where state should be updated;
            checkCheckboxState();
        });
    });

    //This is the game
    document.addEventListener('keydown', function (event) {
        // ensures only the first letter is taken from the page
        let displayedLetter = GAME_LETTER.innerText[0];

        // checks if the displayed characters is valid, changes it if not
        if (VALID_CHARACTERS.indexOf(displayedLetter) === -1) {
            GAME_LETTER.innerHTML = randomCharacterReturn(' ');
        }

        // stores to pressed key
        let pressedKey = event.key;
        // console.log(pressedKey);
        if (pressedKey === displayedLetter) {

            // adds escape character for special characters
            if (REMAPPED_SPECIAL_CHARACTERS.indexOf(pressedKey) !== -1) {
                pressedKey = `\\${pressedKey}`;
            }

            // score table updator
            let scoreHolder = document.querySelector(`#count-${pressedKey}`);
            scoreHolder.dataset.value++;
            scoreHolder.innerHTML = scoreHolder.dataset.value;

            // finds a new letter
            let tempLetter = randomCharacterReturn(pressedKey);

            // console.log('passed', tempLetter)
            GAME_LETTER.innerHTML = tempLetter;
        }
    });

    //PREVENTS THE CHECKBOXES FROM BEING DELETED!
    const GAME_WATCHER = new MutationObserver(function (mutation) {
        if (mutation[0].removedNodes.length > 0) {
            let parent = mutation[0].target,
                child = mutation[0].removedNodes[0],
                sibling = mutation[0].nextSibling;

            // console.log(1000, mutation)
            // console.log(1111, child)
            // console.log(mutation[0]);
            // console.log(1234, `parent->${parent} child->${child} sibling->${sibling}`);
            // console.log(mutation[0].removedNodes[0]);
            parent.insertBefore(child, sibling);
            console.log('nice try big guy!')
        }
    })
    GAME_WATCHER.observe(document.querySelector('html'), {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
    });

}