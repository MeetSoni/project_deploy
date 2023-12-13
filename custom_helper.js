/******************************************************************************
***
* ITE5315 – Assignment 4
* I declare that this assignment is my own work in accordance with Humber Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students. *
* Name: Parth Shah Student ID: n01550466 Date: 26/11/23 *
* ****************************************************************************** 
**/
const Handlebars = require('handlebars');


Handlebars.registerHelper('getProperty', function(object, propertyName) {
    return object[propertyName];
});

Handlebars.registerHelper('ratingHelper', function(rating, options) {
    if (rating !== 0) {
        return options.fn(this);
    } else {
        return options.inverse(this);
    }
});

Handlebars.registerHelper('incrementedIndex', function(index) {
    return index + 1;
});





module.exports = Handlebars;
