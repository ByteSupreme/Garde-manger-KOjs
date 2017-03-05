/**
 * Model du garde manger
 */
var gardeMangerModel = function () {

    var self = this;

    //ce qu'il y a dans la barre de recherche
    self.itemToSearch = ko.observable("");

    //resultat de la recherche
    self.allItems = ko.observableArray([]);

    //item séléctionné
    self.selectedItems = ko.observable();

    //item dans le garde à manger
    self.itemGardeManger = ko.observableArray([]);

    //total de calories
    self.totalCalories = ko.observable(0);

    //total de sel
    self.totalSalt = ko.observable(0);

    //total de gras
    self.totalFat = ko.observable(0);

    //la limite de calorie pour la recherche
    self.limitCalorie = ko.observable(0);

    //profils
    self.profils = ko.observableArray([
        {
            "name": "Enfant",
            "calorieMax": 1600
        },
        {
            "name": "Homme",
            "calorieMax": 2800
        },
        {
            "name": "Femme",
            "calorieMax": 2200
        },
        {
            "name": "Femme enceinte",
            "calorieMax": 2450
        },
        {
            "name": "Sportif",
            "calorieMax": 3300
        },
        {
            "name": "Homme agé",
            "calorieMax": 2000
        },
        {
            "name": "Femme agée",
            "calorieMax": 1800
        }
    ]);

    //profil séléctionné
    self.selectedProfile = ko.observable();

    //Alerte calorie
    self.alertCalorie = ko.observable(false);

    //Alerte sel
    self.alertSalt = ko.observable(false);

    /**
     * Fonction qui permet de rechercher de la nourriture via l'API nutrixionix
     */
    self.searchItem = function () {
        var data = {
            "appId": "67cea090",
            "appKey": "ae118026c431d61bc4b44ae60420cb55",
            "query": self.itemToSearch(),
            "fields":["item_id","item_name","brand_name","nf_calories","nf_sodium","nf_saturated_fat"],
            "sort":{
                "field":"_score",
                "order":"desc"
            },
            "filters": {
                "item_type":2,
                "nf_calories": {
                     "lte": self.limitCalorie() > 0 ? self.limitCalorie() : undefined
                }
            }
        };

        //Méthode post pour recupérer le resultat des recherches
        $.post("https://api.nutritionix.com/v1_1/search", data, function(returnedData) {
            //on enlève tout ce qui il y a dans le "select" des résultats
            self.allItems.removeAll();

            //pour chaque résultats renvoyés par l'API nutrixionix on créé un nouvel objet
            for(var i=0; i< returnedData.hits.length;i++){
                var itemResult = {
                    "name" : returnedData.hits[i].fields.item_name,
                    "calories" : returnedData.hits[i].fields.nf_calories,
                    "salt" : returnedData.hits[i].fields.nf_sodium,
                    "fat" : returnedData.hits[i].fields.nf_saturated_fat,
                    "id" :returnedData.hits[i].fields.item_id,
                    "quantity" :ko.observable(1)
                };
                //on le push dans l'observable array
                self.allItems.push(itemResult);
            }
        });
    };

    /**
     * Cette fonction permet d'ajouter des aliments séléctionnés dans le garde manger
     */
    self.addGardeManger = function () {
        //Un boucle pour prendre chaque element de l'observable array
        for(var i = 0; i<self.selectedItems().length;i++){
          //on push chaque element dans l'observableArray qui représente notre garde manger
          self.itemGardeManger.push(self.selectedItems()[i]);
        }
        //on vide la liste des élèments séléctionnés
        self.selectedItems([]);
    };

    /**
     * Calcule le total de calories
     */
    self.calcTotalCalories = ko.computed(function () {
        var total =0;
        for(var i=0; i<self.itemGardeManger().length;i++){
           total = total +  (self.itemGardeManger()[i].calories*self.itemGardeManger()[i].quantity() );
        }
        self.totalCalories(total);
    });

    /**
     * Calcule le total de sel
     */
    self.calcTotalSalt = ko.computed(function () {
        var total =0;
        for(var i=0; i<self.itemGardeManger().length;i++){
            total = total +  (self.itemGardeManger()[i].salt*self.itemGardeManger()[i].quantity() );
        }
        self.totalSalt(total);
    });

    /**
     * Calcule le total de gras
     */
    self.calcTotalFat = ko.computed(function () {
        var total =0;
        for(var i=0; i<self.itemGardeManger().length;i++){
            total = total +  (self.itemGardeManger()[i].fat*self.itemGardeManger()[i].quantity() );
        }
        self.totalFat(total);
    });

    /**
    /**
     * Fonction pour effacer un item de la liste
     * @param data
     *      L'item que nous voulons retiré du garde manger.
     */
    self.removeItemGardeManger = function(data){
        self.itemGardeManger.remove(data);
    };

    /**
     * Pour checker et faire apparaite une alerte de dépassement de calories du garde manegr
     */
    self.checkMaxCalorieProfile = ko.computed(function () {
        if(typeof self.selectedProfile() !== 'undefined'){
            if(self.totalCalories() > self.selectedProfile()[0].calorieMax){
                self.alertCalorie(true);
            }else {
                self.alertCalorie(false);
            }
        }
    });

    /**
     * Pour checker et faire apparaite une alerte de dépassement de sel pour du garde manger
     */
    self.checkMaxSalt = ko.computed(function () {
            if(self.totalSalt() > 5000){
                self.alertSalt(true);
            }else {
                self.alertSalt(false);
            }
    });

};

ko.applyBindings(new gardeMangerModel());