/*
*
* Ce script permet de gèrer le garde manger
*
* */

/**
 *
 *
 *
 * @param food
 */
var choosenFoodModel = function(food) {

    var self = this;
    self.choosenOneFood = ko.observableArray(foods);

    /**
     * Cette fonction permet d'ajouter un aliment séléctionné dans la liste de résultats
     */
    self.addOneFood = function() {
        self.choosenOneFood.push({
            name: "",
            calories: "",
            quantity:1
        });
    };

    /**
     * Cette fonction permet de retirer un alimeent du garde manger
     * @param food
     *      L'aliment à supprimer
     */
    self.removeOneFood = function(food) {
        self.gifts.remove(food);
    };

};

var foodModel = new choosenFoodModel([]);
ko.applyBindings(foodModel);