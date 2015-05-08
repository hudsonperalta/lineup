//-- Angular --
//Setup Player list
var theApp = angular.module('lineupApp', ['ng-sortable']);

    theApp.service('store', function () {
      return function (name, value) {
        try {
          if (value) {
            localStorage.setItem(name, JSON.stringify(value));
          } else {
            return JSON.parse(localStorage.getItem(name));
          }
        } catch (err) {}
      };
    });


    theApp.factory('sortable', ['store', function (store) {
      return function (name, idAttr, models) {
        var i,
            idx,
            tmp,
            order = store(name);
        
        if (order) {
          // Restore
          i = models.length;

          while (i--) {
            idx = order.indexOf(models[i][idAttr]);
            
            if (idx > -1 && idx !== i) {
              tmp = models[i];
              models[i] = models[idx];
              models[idx] = tmp;
            }
          }
        }
        
        return {
          options: {
            animation: 150,
            onSort: function (evt) {
              // Save
              store(name, evt.models.map(function (model) {
                return model[idAttr];
              }));
            }
          },

          models: models,
        };
      };
    }]);


    theApp.controller('lineup', [
      '$scope',
      '$http',
      'sortable',
      function ($scope, $http, sortableFactory) {
        var sortable = sortableFactory("any name", "id", [
          { id: 1, name: 'Symington, Jack', number: '17'},
          { id: 2, name: 'Hudson-Peralta, Noah', number: '6'},
          { id: 3, name: 'Butler, Blake',  number: '7' },
          { id: 4, name: 'Phillips, Quartaze',  number: '24' },
          { id: 5, name: 'Randall, Robbie',  number: '19' },
          { id: 6, name: 'George, Nik',  number: '2' },
          { id: 7, name: 'Flaherty, Evan',  number: '41' },
          { id: 8, name: 'Bates, Donovan',  number: '3' },
          { id: 9, name: 'Teschendorf, Bryce',  number: '9' },
          { id: 10, name: 'Addleman, Jordan', number: '28' },
          { id: 11, name: 'Szep, Wil', number: '18' }
         ]);
        
        $scope.models = sortable.models;
        $scope.sortableOptions = sortable.options;
    }]);

    theApp.controller('xlineup', ['$scope', '$http', function($scope,$http) {
        // $http.get('data/players.json')
        //     .then(function(res){
        //         $scope.player = res.data;
        //     });
        $scope.player = [
            { "name": "Symington, Jack", "number": "17", "defSpot": "1" },
            { "name": "Hudson-Peralta, Noah", "number": "6", "defSpot": "2" },
            { "name": "Butler, Blake", "number": "7", "defSpot": "3" },
            { "name": "Phillips, Quartaze", "number": "24", "defSpot": "4" },
            { "name": "Randall, Robbie", "number": "19", "defSpot": "5" },
            { "name": "George, Nik", "number": "2", "defSpot": "6" },
            { "name": "Flaherty, Evan", "number": "41", "defSpot": "7" },
            { "name": "Bates, Donovan", "number": "3", "defSpot": "8" },
            { "name": "Teschendorf, Bryce", "number": "9", "defSpot": "9" },
            { "name": "Addleman, Jordan", "number": "28", "defSpot": "10" },
            { "name": "Szep, Wil", "number": "18", "defSpot": "11" }
        ];
        $scope.playerConfig = {
            group: "thisLineup",
            animation: 150,
            store: {
                /**
                 * Get the order of elements. Called once during initialization.
                 * @param   {Sortable}  sortable
                 * @returns {Array}
                 */
                get: function (sortable) {
                    var order = localStorage.getItem(sortable.options.group);
                    return order ? order.split('|') : [];
                },

                /**
                 * Save the order of elements. Called onEnd (when the item is dropped).
                 * @param {Sortable}  sortable
                 */
                set: function (sortable) {
                    var order = sortable.toArray();
                    localStorage.setItem(sortable.options.group, order.join('|'));
                }
            }
        };

        $scope.spots = 10;
        $scope.getSpots = function (num) {
            return new Array(num);
        }

        $scope.positions = [
            { pos: 'P', posNum: '1' },
            { pos: 'C', posNum: '2' },
            { pos: '1B', posNum: '3' },
            { pos: '2B', posNum: '4' },
            { pos: '3B', posNum: '5' },
            { pos: 'SS', posNum: '6' },
            { pos: 'LF', posNum: '7' },
            { pos: 'CF', posNum: '8' },
            { pos: 'RF', posNum: '9' },
            { pos: 'EH', posNum: '10' }
        ];

    }])


//-- jQuery --
//Variables
var posOpen = 0;
var posList = new Array(10); //indexed 0-9

var $setPos;
var setPosNum;
var $pos;
var thisPos;
var thisPosNum;


//Add position into the box
function drawPos(){
    $('#sel').text(posSelected)
}

//Open Position List
function openPos() {
    if(posOpen == 0) {
        posOpen = 1;
        $('#posOptions').addClass('open');
        $('body').addClass('choosePos');
    }
}

//Close position list
function closePos() {
    posOpen = 0; //Changed from 1 to 0
    $('#posOptions').removeClass('open');
}

//Set focus only to user selected position box
function remFocus() {
    $('.playerPos[data-selection]').attr('data-selection','');
}

//Reset box data
function resetPos($resPos){
    $resPos.text('').attr('data-set-pos','');
    $('[data-pos-number='+setPosNum+']').attr('data-selected','');
}

//Set Postion in box
function setPos(){
    $('[data-set-pos='+thisPosNum+']').text('').attr('data-set-pos','');
    $pos.attr('data-selected','selected');
    $setPos.text(thisPos).attr('data-set-pos',thisPosNum);
    setPosNum = $setPos.attr('data-set-pos');

    posList[thisPosNum-1]=$setPos;
}

//Position box clicked
$(document).on('click', '.playerPos', function() {
    //Set Focus to position box
    remFocus();
    $(this).attr('data-selection','focus');

    //set selection data
    $setPos = $('.playerPos[data-selection="focus"]');
    setPosNum = $setPos.attr('data-set-pos');

    //Open position list
    if(posOpen != 1)
        openPos();

    //Clear any existing value
     if(setPosNum>0){
        resetPos($setPos);
        setPosNum='';
    }
});

//Position Selected
$(document).on('click', '#posOptions li', function() {
    //Set Position Selection
    $pos = $(this);
    thisPos = $pos.attr('data-pos');
    thisPosNum = $pos.attr('data-pos-number');

    //Check if position is already in use
    if($pos.attr('data-selected') != 'selected'){
        //Not used, check if selection already has postion
        if(setPosNum == '') {
            //No postion, fill
            setPos();
        }else{
            //Has postion, clear then fill
            resetPos($pos);
            setPos();
        }
    }else{
        //In use, switch.
        resetPos(posList[thisPosNum-1]);
        setPos();
    }
});
