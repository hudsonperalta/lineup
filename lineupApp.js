angular.module('lineupApp', ['ng-sortable'])
    .controller('lineup', ['$scope', function ($scope) {
        $scope.player = [
            { name: 'A', number: '8' },
            { name: 'B', number: '10' },
            { name: 'C', number: '18' },
            { name: 'D', number: '2' },
            { name: 'E', number: '3' },
            { name: 'F', number: '7' },
            { name: 'G', number: '9' },
            { name: 'H', number: '4' },
            { name: 'I', number: '44' },
            { name: 'J', number: '24' },
            { name: 'K', number: '28' }
        ];
        // $http.get('data/players.json').
        // success(function(data, status, headers, config) {
        //   $scope.player = data;
        // }).
        // error(function(data, status, headers, config) {
        //   // log error
        // });
        $scope.playerConfig = { animation: 150 };
        
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

// jQuery
posOpen = 0;
var posSelected = [];
var allPositions = [1,2,3,4,5,6,7,8,9,10];
var removeItem = 0;

function drawPos(){
    //var posSelected = '';
    $('.playerPos:not([data-set-pos=""])').each(function() { 
        posSelected.push($(this).attr('data-set-pos')) 
    });
    
    $('#sel').text(posSelected)
}

function openPos() {
    if(posOpen == 0) {
        posOpen = 1;
        $('#posOptions').addClass('open');
    }
    //else closePos();
}

function closePos() {
    posOpen = 1;
    $('#posOptions').removeClass('open');
}

function remFocus() {
    $('.playerPos[data-selection]').attr('data-selection','');
}

$(document).on('click', '.playerPos', function() {
    remFocus();
    openPos();
    $(this).attr('data-selection','focus');
});

$(document).on('click', '#posOptions li', function() {
    var $pos = $(this);
    var thisPos = $pos.attr('data-pos');
    var thisPosNum = $pos.attr('data-pos-number');
    
    var $setPos = $('.playerPos[data-selection="focus"]');
    var setPosNum = $setPos.attr('data-set-pos');
    
    var removeItem = setPosNum;

    if(setPosNum != '') {
        $('[data-pos-number='+setPosNum+']').attr('data-selected','');
        $setPos.text(thisPos).attr('data-set-pos',thisPosNum);
        $pos.attr('data-selected','selected');
        
        posSelected = jQuery.grep(posSelected, function(value) {
            return value != removeItem;
        });
    }
    else {
        if ($.inArray(thisPosNum, posSelected) !== -1){
            $('[data-set-pos='+thisPosNum+']').text('').attr('data-set-pos','');
            $setPos.text(thisPos).attr('data-set-pos',thisPosNum);
        }
        else {
            $pos.attr('data-selected','selected');
            $setPos.text(thisPos).attr('data-set-pos',thisPosNum);
        }
    }

    drawPos();

});