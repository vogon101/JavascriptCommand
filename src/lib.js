if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

/**
 *
 * @param {Command[]}commands
 * @constructor
 */
function Terminal(commands) {

    this.commands = commands;

    this.selectedCommand = null;

    this.termID = Math.floor((Math.random() * 100000) + 1);

    Terminal.register(this.termID, this)

}

Terminal.terminals = [];

Terminal.register = function (id, term) {

    Terminal.terminals[id] = term;
};

Terminal.go = function (id) {
    Terminal.terminals[id].go()
};

//Run selectedCommand
Terminal.prototype.go = function () {

    console.log("Go")

};

Terminal.terminalHTML = function (id) {


    return "<input id='command-" + id + "'><input id='argument-" + id +"'><input id='go-" + id +"' onclick='Terminal.go(" + id + ")' type='button' value='Run!'> "

};

Terminal.prototype.commandListNames = function() {
    return this.commands.map(function (e){return e.name});
};

Terminal.prototype.bind = function (selector) {



    $(selector).html(Terminal.terminalHTML(this.termID));

    var term = this;
    var commandInput = $("#command-" + this.termID);
    var argumentInput = $("#argument-" + term.termID);


    commandInput.autocomplete({
        source:this.commandListNames(),
        select: function (e, ui) {
            console.dir(e);
            console.dir(ui);

            //Get Command
            term.selectedCommand = term.getCommand(ui.item.value);

            if (term.selectedCommand.arguments.length > 0){
                argumentInput.autocomplete({
                    source:term.selectedCommand.arumentNameList(),
                    minLength: 0
                }).on("focus", function (){
                    $(this).autocomplete("search", "")
                });
            }
            else {
                argumentInput.remove(   )
            }

        },
        minLength: 0

    }).on("focus", function (){
        $(this).autocomplete("search", "")
    });

    argumentInput.keydown(function (e) {
        if (e.keyCode == 8) {
            if (argumentInput.val().replace(/ /g,'') == "") {
                commandInput.focus()
            }
        }
    })

};

Terminal.prototype.getCommand = function (name) {
    return this.commands.filter(function (e){return e.name == name.trim()})[0]
};

/**
 *
 * @param {String} name
 * @param arguments
 * @constructor
 */
function Command (name, arguments) {

    this.name = name;
    this.arguments = arguments;

}

Command.prototype.arumentNameList = function () {
    return this.arguments.map(function (e) {return e.name})
};

function Argument (name, text) {

    this.name = name;
    this.text = text;

}