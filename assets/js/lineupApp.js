//-- Angular --
//Setup Player list
var theApp = angular.module('lineupApp', ['ng-sortable']);

    theApp.controller('lineup', ['$scope', '$http', function($scope,$http) {
        $http.get('data/players.json')
            .then(function(res){
                $scope.player = res.data;
            });
        $scope.playerConfig = {
            group: "thisLineup",
            animation: 150,
            handle: ".playerNum",
            onUpdate: function (sortable) {
                var order = angular.toJson(sortable);
                $scope.msg = order;
                localStorage.newOrder = order;
                // $scope.newOrder = order;
                // $scope.msg = $scope.newOrder;
                // return order ? order.split('|') : [];

            }
            //,
            // store: {
            //     get: function (sortable) {
            //         var order = localStorage.getItem(sortable.options.group);
            //         $scope.newOrder = order;
            //         $scope.msg = $scope.newOrder;
            //         return order ? order.split('|') : [];
            //     },
            //     set: function (sortable) {
            //         var order = sortable.toArray();
            //         localStorage.setItem(sortable.options.group, order.join('|'));
            //     }
            // }
        };

        $scope.saveData = function () {
            var saveOrder = $scope.newOrder;
            $scope.msg = 'Saved: '+ JSON.stringify(saveOrder);
        };

        $scope.spots = 10;
        $scope.getSpots = function (num) {
            return new Array(num);
        };

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

        if (!localStorage.lineUpCt) { $scope.optSet = false; }
        else { $scope.optSet = true; }

        // Watch Current Doc Change
        $scope.$watch('optSet', function() {
            if($scope.optSet === false) { $('body').attr('class',''); }
            else { $('body').attr('class',localStorage.lineUpCt); }
        });

        $scope.setLineUpCt = function (ct) {
            $scope.optSet = true;
            localStorage.lineUpCt = ct;
            $('body').attr('class',ct);
        };

    }]);


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
    $('#sel').text(posSelected);
}

//Open Position List
function openPos() {
    if(posOpen === 0) {
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
    if(posOpen !== 1){
        openPos();
    }

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
    if($pos.attr('data-selected') !== 'selected'){
        //Not used, check if selection already has postion
        if(setPosNum === '') {
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
