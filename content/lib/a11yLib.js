function a11yController() {
    this.runButton = document.querySelector('#run')
    this.banner = document.getElementById('top')
    this.blockPalette = document.querySelector('.droplet-palette-wrapper')
    this.bannerBtnContainer = document.querySelector('#topright')
    this.bannerBtns = this.bannerBtnContainer.querySelectorAll("#save, #screenshot, #share, #login, #help, #guide, #splitscreen")
    this.blockEditor = document.querySelector('.droplet-wrapper-div')
    this.blockToggle = document.querySelector('.blocktoggle')
    this.textToggle = document.querySelector('.texttoggle')
    this.blockMenuHeader = document.querySelector('.blockmenu')
    this.blockCategoriesMenu = document.querySelector('.droplet-palette-header')
    this.blockCategories = document.querySelectorAll('.droplet-palette-group-header')
    this.blockPicker = document.querySelector('.droplet-palette-scroller-stuffing')
    this.selectedCategory

    this.init();
    this.addARIAattributes(); 
    this.blockPaletteController();
}

a11yController.prototype.blockPaletteController = function() {
    //give palette a region
    this.blockPalette.setAttribute('role', 'region')
    this.blockPalette.setAttribute('aria-label', 'block palette')
    
    //turn palette into a menu
    this.blockCategoriesMenu.setAttribute('role', 'menu')
    this.blockCategoriesMenu.setAttribute('aria-label', 'block categories')
    this.blockCategoriesMenu.setAttribute('tabindex', '0')

    //turn each category into a menu item of the palette menu
    this.blockCategories.forEach(function(category) {
        category.setAttribute('role', 'menuitemradio')
        category.setAttribute('tabindex', '0')
        category.setAttribute('aria-checked', 'false')
        
        //set selected category
        if(category.classList.contains('droplet-palette-group-header-selected')) {
            this.selectedCategory = category;
            this.selectedCategory.setAttribute('aria-checked', 'true')
        }
    }, this);

    //handle ariachecked logic
    this.blockCategoriesMenu.addEventListener('click', function(e) {
        this.selectedCategory.setAttribute('aria-checked', 'false') //old selected category
        this.selectedCategory = document.querySelector('.droplet-palette-group-header-selected') //new selected category
        this.selectedCategory.setAttribute('aria-checked', 'true')
    }.bind(this))
}

//give elements the proper aria attributes
a11yController.prototype.addARIAattributes = function () {
    //top bar
    this.banner.setAttribute('role', 'banner')

    //block palette
    
    //disable useless link
    this.blockMenuHeader.setAttribute('tabindex', '-1')
    this.blockMenuHeader.setAttribute('aria-hidden', 'true')

    //block editor
    this.blockEditor.setAttribute('role', 'region')
    this.blockEditor.setAttribute('aria-label', 'block editor')

    //editor mode toggle (they made two of them for some reason)
    this.blockToggle.setAttribute('role', 'button')
    this.textToggle.setAttribute('role', 'button')

    //presentation area
    var outputFrame = document.querySelector('#output-frame')
    var outputDocument = outputFrame.contentDocument || outputFrame.contentWindow.document
    outputDocument.body.getElementsByClassName('turtlefield')[1].setAttribute('role', 'presentation');

    //console area
    outputFrame = document.querySelector('#output-frame')
    outputDocument = outputFrame.contentDocument || outputFrame.contentWindow.document
    outputDocument.body.getElementsByClassName('turtlefield')[0].setAttribute('role', 'complementary');
    outputDocument.body.getElementsByClassName('turtlefield')[0].setAttribute('aria-label', 'test panel');

    //New File Notification
    var overflowDiv = document.getElementById('notification').setAttribute('role', 'status')
}

//remove focus from elements that shouldn't have focus
a11yController.prototype.init = function () {
    //remove iframes from tab index
    var iframes = document.querySelectorAll('iframe');
    iframes.forEach(function(element) {
        element.setAttribute("tabindex", -1);
    }, this);

    //an attemp to remove focus from the text editor on load
    //this allows the user to reach the skip to editor link after hitting tab once
    document.querySelector('.droplet-main-canvas').setAttribute('id', 'code-editor-canvas')
    document.querySelector('.droplet-main-canvas').setAttribute('tabindex', 0)
    document.querySelector('.droplet-hidden-input').setAttribute('tabindex', -1)
    var textInput = document.querySelector('.ace_text-input')
    textInput.addEventListener("focus", initFocus);
    textInput.blur();
    textInput.focus();
    function initFocus() {
        document.getElementById('focus-guide').focus()
        textInput.removeEventListener("focus", initFocus)
    }
}

//old code left for reference
a11yController.prototype.tabController = function (event) {
    if(event.keyCode == 9) {
        //SHIFT + TAB
        if(event.shiftKey) {
            //event.preventDefault();
        } else {
            if(document.activeElement == document.body) {
                event.preventDefault();
                document.querySelector(".skip").focus();
            }
        }
    }
    //ESC key
    if(event.keyCode == 27) {
        console.log('registered esc key');
    }
}

//old code left for reference
a11yController.prototype.setupPrimaryNav = function () {
    //main ui sections
    var blockEditor = document.querySelector('.droplet-main-scroller')
    var blockCategory = document.querySelector('.droplet-palette-header')
    var runButton = document.querySelector('#run')

    //console exists in seperate iframe, so get the scope of the iframe to select it
    var outputFrame = document.querySelector('#output-frame')
    var outputDocument = outputFrame.contentDocument || outputFrame.contentWindow.document
    var consoleInput = outputDocument.querySelector('._log #_testinput') //select console

    //listed in navigation order
    const primaryNavSections = [
        blockEditor,
        blockCategory,
        runButton,
        consoleInput
    ]

    //remove tab index from primary navigation so we can handle this manually
    primaryNavSections.forEach(function(element) {
        element.setAttribute("tabindex", -1);
    })

    return primaryNavSections;
}

//bootstrap a11y enhancements after window loads
window.addEventListener('load', function load(event){
    window.removeEventListener('load', load, false);
    var a11yEnhancement = new a11yController();
})
