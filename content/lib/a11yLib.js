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
    this.textEditor = document.querySelector('.ace_editor')
    this.blockCategoriesMenu = document.querySelector('.droplet-palette-header')
    this.blockCategories = document.querySelectorAll('.droplet-palette-group-header')
    this.blockPicker = document.querySelector('.droplet-palette-scroller-stuffing')
    this.selectedCategory

    this.init();
    this.addARIAattributes(); 
    this.blockPaletteController();
    this.editorToggleController();
}

//When the editor is toggled, the editor that is removed from view is removed from the accessibility tree
a11yController.prototype.editorToggleController = function() {
    var _this = this;
    var topBlockEditor = parseInt(this.blockEditor.style.top, 10)
    
    this.blockToggle.setAttribute("role", "button")
    this.textToggle.setAttribute("role", "button")
    this.blockToggle.setAttribute("aria-label", "open block editor")
    this.textToggle.setAttribute("aria-label", "open text editor")

    //block editor is out of view
    if(topBlockEditor < 0) {
        enableTextMode()
    } else { //text editor is out of view
        enableBlockMode()
    }

    this.blockToggle.addEventListener("click", function () {
        enableBlockMode()
        console.log(this.blockEditor)
        console.log(this.textEditor)
    }.bind(this))

    this.textToggle.addEventListener("click", function () {
        enableTextMode()
        console.log(this.blockEditor)
        console.log(this.textEditor)
    }.bind(this))

    function enableTextMode() {
        console.log("enabling text mode")
        _this.textEditor.setAttribute("aria-hidden", "false")
        _this.blockEditor.setAttribute("aria-hidden", "true")
        _this.blockPalette.setAttribute("aria-hidden", "true")
    }

    function enableBlockMode() {
        console.log("enabling block mode")
        _this.textEditor.setAttribute("aria-hidden", "true")
        _this.blockEditor.setAttribute("aria-hidden", "false")
        _this.blockPalette.setAttribute("aria-hidden", "false")
    }
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
        category.setAttribute('tabindex', '-1')
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
    textInput.setAttribute("aria-label", "text editor cursor")
    textInput.addEventListener("focus", initFocus);
    textInput.blur();
    textInput.focus();
    function initFocus() {
        document.getElementById('focus-guide').focus()
        textInput.removeEventListener("focus", initFocus)
    }
}

//bootstrap a11y enhancements after window loads
window.addEventListener('load', function load(event){
    window.removeEventListener('load', load, false);
    var a11yEnhancement = new a11yController();
})
