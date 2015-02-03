/*
 * Copyright (c) 2014 Peter Flynn.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */


/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define, brackets, $ */

define(function (require, exports, module) {
    "use strict";
    
    // Brackets modules
    var EditorManager   = brackets.getModule("editor/EditorManager"),
        Menus           = brackets.getModule("command/Menus"),
        CommandManager  = brackets.getModule("command/CommandManager");
    
    
    var SEARCH_CONFIG = { maxScanLineLength: 50000, maxScanLines: 1000 };
    
    function gotoMatching() {
        var editor = EditorManager.getActiveEditor();
        
        // If cursor is next to a brace/bracket/paren, find its matching counterpart
        var match = editor._codeMirror.findMatchingBracket(editor.getCursorPos(), false, SEARCH_CONFIG);
        if (match) {
            var otherBrace = match.to;
            editor.setCursorPos(otherBrace.line, otherBrace.ch);
            
        } else {
            // Cursor wasn't on a brace, so just find the first one going backwards from the current pos
            // (actually it seems to search up by scope level -- skipping any matched pairs it finds -- which is even better)
            var prevBrace = editor._codeMirror.scanForBracket(editor.getCursorPos(), -1, undefined, SEARCH_CONFIG);
            if (prevBrace) {
                editor.setCursorPos(prevBrace.pos.line, prevBrace.pos.ch);
            }
        }
    }
    
    
    // Register command
    var COMMAND_ID = "pflynn.jump-to-matching-brace";
    CommandManager.register("Go to Matching Brace", COMMAND_ID, gotoMatching);
    
    var menu = Menus.getMenu(Menus.AppMenuBar.NAVIGATE_MENU);
    menu.addMenuItem(COMMAND_ID, [
        {
            "key": "Ctrl-Shift-["
        },
        {
            "key": "Ctrl-Shift-[",
            "platform": "mac"
        }
    ], Menus.LAST_IN_SECTION, Menus.MenuSection.NAVIGATE_GOTO_COMMANDS);
});
