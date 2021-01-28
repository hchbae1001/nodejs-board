'use strict'

let $userLife = $('#lifeStatus'),
    $userScore = $('#userScore'),
    $comScore = $('#comScore');
let userLife = 2,
    userScore = 0,
    comScore = 0;
let dropNum = [];
let gameSetting = 8;
let dropstack = 0;
let failstack = 0;
let userCardIndex = 0;
let userDropped = [];
let target = 0;
let dragged = 0,
    draggedTop = 0,
    draggedLeft = 0;

let fliped = 0;
let idx = 0;
let checkFlipped = 0;
let comA = 0,
    comB = 0;
let sizeDiff = 0;
let min = 0,
    max = 0,
    smp = 1;
let cardOffset = [
    {
        top: 0,
        left: 0
    },
    {
        top: 0,
        left: 0
    }
    ];
let cardInfo = [
    {
        idx: 0,
        phoneme: ''
    },
    {
        idx: 0,
        phoneme: ''
    }
    ];

function init() {
    let boxWidth = parseInt($('.card').css('width'));
    let imgWidth = parseInt($('.card img').css('width'));
    sizeDiff = (boxWidth - imgWidth) / 2;
    $('#cards').hide();
    $('.menTable').hide();
    $('.button').hide();
    $('.card').flip();
    $('.card').hide();
    $('.Button').hide();
    $('.userBoard').css({
        pointerEvents: "none"
    });
    $(".card img").draggable({
        disabled: true
    }); // card의 draggable 을 불가능으로 초기화시킴
};

$(function () {
    init();
    
});
// 윈도우 사이즈가 1440이 아닐 경우, 카드가 제 자리를 찾아가도록 만들어 보기

//$(window).resize(function(){
//    let size = window.outerWidth;
//    console.log(size);
//});

//window.addEventListener('resize', function() {
//  //
//}, true);
// 카드 2개 뒤집을경우 다시 뒤집기

$('.card').on('click', function () {
    checkFlipped = 1;
    if (checkFlipped === 1) {
        $('#33').remove();
        $('#44').remove();
    }

    if (userLife != 0) {
        idx = parseInt($(this).index('.card')); //클릭된 카드의 index번호를 받음
        playAudio(idx); // 받은 index번호의 음성 출력
        $('.card').eq(idx).flip(false); //해당 카드를 뒤집고
        $('.card').eq(idx).css({ //클릭이나 드래그 이벤트를 배제함
            pointerEvents: "none"
        });
        $('.card img').eq(idx).css({
            pointerEvents: "none"
        });
        if (fliped == 0) { // 하나 뒤집으면
            cardInfo[0].idx = idx;
            cardInfo[0].phoneme = card[idx].phoneme; // 인덱스 번호와, 음소를 받음
            console.log("index=" + cardInfo[0].idx + " 음소=" + cardInfo[0].phoneme);
            cardOffset[0].top = $('.card').eq(cardInfo[0].idx).offset().top; //음소를 맞추고 잘 못 드래그했을때를 대비하여, 기존 위치정보를 받음
            cardOffset[0].left = $('.card').eq(cardInfo[0].idx).offset().left;
            fliped += 1;
        } else if (fliped == 1) { // 두번째 뒤집으면
            cardInfo[1].idx = idx;
            cardInfo[1].phoneme = card[idx].phoneme;
            console.log("index=" + cardInfo[1].idx + " 음소=" + cardInfo[1].phoneme);
            cardOffset[1].top = $('.card').eq(cardInfo[1].idx).offset().top;
            cardOffset[1].left = $('.card').eq(cardInfo[1].idx).offset().left;
            fliped += 1;
        }
        if (fliped === 2) { // 두개가 뒤집혀있으면
            pickOX(); // 음소를 따져 O 혹은 X 를 선택
        }
    } else {
        console.log("user의 life가 차오를 때 까지 기다려주세요");
        return;
    }
});

$('#oButton').on('click', function () {
    if (cardInfo[0].phoneme === cardInfo[1].phoneme) { // 같은 음소일 경우
        //Alert(선택한 음소가 서로 같네요! 이제 유저테이블로 카드를 놓아요)
        userDrop(); // 음소를 맞추고 O로 확인까지 하였으므로 드래그 기능을 부여함
    } else { //음소가 같지 않을경우 해당카드 다시 뒤집기
        //Alert(두개의 음소는 같지만, 같지 않다고 하셨네요)
        $('.card').eq(cardInfo[0].idx).flip(false);
        $('.card').eq(cardInfo[1].idx).flip(false);
        lifeZero(); //컴퓨터 에게 턴 넘기기
    }
    $('.button').hide();
});

$('#xButton').on('click', function () {
    if (cardInfo[0].phoneme !== cardInfo[1].phoneme) { //다른 음소일 경우
        //Alert(두개의 음소가 같지않지만 정확히 아니라고 판별하셨으니, 한번 더 기회를 드릴게요)
        $('.card').eq(cardInfo[0].idx).flip(false);
        $('.card').eq(cardInfo[1].idx).flip(false);
        userLife -= 1;
        updateCounterStatus($userLife, userLife);
        if (userLife <= 0) {
            lifeZero();
        }
        selectable(); // 다시 고를 수 있도록 pointerevents를 auto로 바꿔줌
    } else {
        //Alert(두개의 음소가 다르지만, 같다고 하셨군요)
        $('.card').eq(cardInfo[0].idx).flip(false);
        $('.card').eq(cardInfo[1].idx).flip(false);
        lifeZero();
    }
    fliped = 0;
    $('.button').hide();
});

function dragForUser(num) {
    //음소를 맞추면 맞춘 카드의 draggable의 disabled를 해제
    $('.card img').eq(num).draggable("option", "disabled", false);
    $('.card img').eq(num).draggable({
        start: function (event, ui) {
            $(this).draggable('option', 'revert', true);
            $(this).css({
                pointerEvents: "auto"
            });
            dragged = parseInt($(this).index('.card img'));
            draggedTop = $('.card').eq(dragged).offset().top;
            draggedLeft = $('.card').eq(dragged).offset().left;
        },
    });
}

function dragFailed(num1, num2) { //드래그를 두번 실패할 경우, 해당 카드의 draggable 을 기능 잠금
    $('.card img').eq(num1).draggable('option', 'disabled', true);
    $('.card img').eq(num2).draggable('option', 'disabled', true);
}

function userDrop() {
    if (fliped === 2) { // 카드가 두장 뒤집혔을경우에만 기능 실행
        //선택된 두 카드의 pointerevents를 잠금해제해주고, draggable또한 잠금해제 해줌
        $('.card img').eq(cardInfo[0].idx).css({
            pointerEvents: "auto"
        });
        $('.card img').eq(cardInfo[1].idx).css({
            pointerEvents: "auto"
        });
        dragForUser(cardInfo[0].idx);
        dragForUser(cardInfo[1].idx);


        $('.userCard').droppable({
            drop: function (event, ui) {
                ui.draggable.draggable('option', 'revert', false);
                dropstack += 1;
                userCardIndex = parseInt($(this).index('.userCard'));
                if (userCardIndex < gameSetting) { //해당 카드의 index번호와 처음 33 44 세팅했던 설정을 비교, 음소를 확인하여 해당 칸에 접합
                    if (card[dragged].phoneme != 'ㅏ') { //ㅏ 가 아니면
                        dropstack -= 1;
                        failstack += 1;
                        $('.card img').eq(dragged).offset({
                            top: draggedTop + sizeDiff,
                            left: draggedLeft + sizeDiff,
                        }); // drag를 시작했을때의 값을 이용하여 다시 되돌림
                        $('.card img').eq(dragged).css({
                            pointerEvents: "auto"
                        }); // 다시 드래그 할 수 있도록 pointerevents 잠금을 해제
                    } else { // ㅏ 로 정답인 경우
                        if (userDropped.indexOf(userCardIndex) === -1) { //유저가 카드를 드랍 하는 자리에 카드가 없다면
                            $('.card img').eq(dragged).offset({
                                top: $('.userCard').eq(userCardIndex).offset().top + sizeDiff,
                                left: $('.userCard').eq(userCardIndex).offset().left + sizeDiff,
                            }); //해당 위치로 드래그 했던 카드를 이동시킴
                            //                            $('.card img').eq(dragged).flip(true); // 그림이 나오도록 고정시켜놓고
                            $('.card img').eq(dragged).css({
                                pointerEvents: "none"
                            }); // pointerEvents를 잠금하여 다른 행동을 방지함
                            userDropped.push(userCardIndex); // 해당 userCardIndex에 카드가 위치했음을 배열에 삽입
                        } else {
                            console.log("이미 자리에 카드가 있습니다");
                            target = getNear(dragged, userCardIndex); //유저가 카드를 드랍 한 자리에 이미 카드가 존재함으로 인해, 근처 index를 찾음
                            $('.card img').eq(dragged).offset({
                                top: $('.userCard').eq(target).offset().top + sizeDiff,
                                left: $('.userCard').eq(target).offset().left + sizeDiff,
                            }); // 찾은 index로 카드를 이동
                            //                            $('.card img').eq(dragged).flip(true); // 카드의 그림 면 고정
                            $('.card img').eq(dragged).css({
                                pointerEvents: "none"
                            }); // 이벤트 잠금
                            userDropped.push(target); // 해당 index에 카드가 위치했음을 배열에 삽입함
                            smp = 1;
                        }
                    }
                } else { // 위와 동일함
                    if (card[dragged].phoneme != 'ㅗ') {
                        //Alert(음소가 맞지않아요, 다시 선택해보세요)
                        dropstack -= 1;
                        failstack += 1;
                        $('.card img').eq(dragged).offset({
                            top: draggedTop + sizeDiff,
                            left: draggedLeft + sizeDiff,
                        });
                        //                        $('.card img').eq(dragged).css({
                        //                            pointerEvents: "auto"
                        //                        });
                    } else {
                        if (userDropped.indexOf(userCardIndex) === -1) {
                            $('.card img').eq(dragged).offset({
                                top: $('.userCard').eq(userCardIndex).offset().top + sizeDiff,
                                left: $('.userCard').eq(userCardIndex).offset().left + sizeDiff,
                            });
                            //                            $('.card img').eq(dragged).flip(true);
                            $('.card img').eq(dragged).css({
                                pointerEvents: "none"
                            });
                            userDropped.push(userCardIndex);
                        } else {
                            console.log("이미 자리에 카드가 있습니다");
                            target = getNear(dragged, userCardIndex);
                            $('.card img').eq(dragged).offset({
                                top: $('.userCard').eq(target).offset().top + sizeDiff,
                                left: $('.userCard').eq(target).offset().left + sizeDiff,
                            });
                            //                            $('.card img').eq(dragged).flip(true);
                            $('.card img').eq(dragged).css({
                                pointerEvents: "none"
                            });
                            userDropped.push(target);
                            smp = 1;
                        }
                    }
                }
                if (failstack >= 2) { // 만약 두번 잘못드래그하였을 경우
                    // Alert(음소가 두번 맞지 않았어요) -> 턴 종료 
                    // 두개의 카드의 기존 위치 정보를 이용하여 해당 위치로 다시 재배치
                    $('.card img').eq(cardInfo[0].idx).offset({
                        top: cardOffset[0].top + sizeDiff,
                        left: cardOffset[0].left + sizeDiff
                    });
                    $('.card img').eq(cardInfo[1].idx).offset({
                        top: cardOffset[1].top + sizeDiff,
                        left: cardOffset[1].left + sizeDiff
                    });
                    // 카드를 뒤집고, 이벤트 잠금
                    $('.card').eq(cardInfo[0].idx).flip(false);
                    $('.card').eq(cardInfo[1].idx).flip(false);
                    $('.card').css({
                        pointerEvents: "none"
                    });

                    // 하나를 맞추고, 두번 틀렸을 경우와. 하나도 맞추지 못하고 두번 틀렸을 경우에 따라 드랍했던 index를 삭제하여 재배치 할 수 있도록 만들어줌 
                    if ((userDropped.length !== 0) && userDropped.length % 2 == 0) {
                        userDropped.splice(userDropped.length - 2, 2);
                    } else if ((userDropped.length !== 0) && userDropped.length % 2 == 1) {
                        userDropped.splice(userDropped.length - 1, 1);
                    }
                    // 유저의 life를 깎고, 초기화 후 lifeZero를 하여 컴퓨터에게 턴을 넘김
                    userLife -= 2;
                    updateCounterStatus($userLife, userLife);
                    dropstack = 0;
                    failstack = 0;
                    dragFailed(cardInfo[0].idx, cardInfo[1].idx); //두 카드의 draggable을 다시 잠금
                    setTimeout(function () {
                        lifeZero();
                    }, 2000); //2초뒤 컴퓨터 차례
                }
                if (dropstack >= 2 && failstack < 2) { // 제대로 드랍되었을 경우 초기화 후, drop된 카드의 index번호를 dropNum 배열에 삽입 한 후 점수를 2점 올려줌
                    dropstack = 0;
                    failstack = 0;
                    dropOver(cardInfo[0].idx, cardInfo[1].idx);
                    userScore += 2;
                    updateCounterStatus($userScore, userScore);
                    setTimeout(function () {
                        lifeZero();
                    }, 2000); // 위 음성길이에 맞춰서
                }
            }
        });
    } else {
        console.log("User Drop Error"); // 만약 fliped가 2이상인데, 드랍이 되었을경우 오류메세지 반환함
    }
}

function nearGet(target, min, max, x, lock) {
    if (lock === 'max') {
        target -= 1;
        if (userDropped.indexOf(target) === -1) {
            return target;
        } else {
            return nearGet(target, min, max, '-', 'max');
        }
    } else if (lock === 'min') {
        target += 1;
        if (userDropped.indexOf(target) === -1) {
            return target;
        } else {
            return nearGet(target, min, max, '+', 'min');
        }
    } else {
        if (target === max) {
            return nearGet(target, min, max, '-', 'max');
        } else if (target === min) {
            return nearGet(target, min, max, '+', 'min');
        } else {
            if (x === 2) {
                target += smp;
                if (userDropped.indexOf(target) === -1) {
                    return target;
                } else {
                    smp++;
                    return nearGet(target, min, max, 1, '0');
                }
            } else if (x === 1) {
                target -= smp;
                if (userDropped.indexOf(target) === -1) {
                    return target;
                } else {
                    smp++;
                    return nearGet(target, min, max, 2, '0');
                }
            }
        }
    }
}

function getNear(dragged, target) { // 유저가 카드를 드랍했을때, 해당 위치에 카드가 이미 존재할 경우, 근처 빈 Index를 찾아서 반환함 TODO - 코드 간결화 필요
    if (gameSetting === 6) { //3X3 인 경우
        if (target >= 0 && target <= 5) {
            min = 0;
            max = 5;
        } else {
            min = 6;
            max = 11;
        }
        return target = nearGet(target, min, max, 1, '0');
    } else { //4X4 인 경우
        if (target >= 0 && target <= 7) {
            min = 0;
            max = 7;

        } else {
            min = 8;
            max = 15;
        }
        return target = nearGet(target, min, max, 1, '0');
    }
}

/*- 컴퓨터 차례 lifeZero() 호출 시 시작 -*/
// 컴퓨터 카드의 index는 3X3 인지 4X4인지 결정하는 버튼에 의해 바뀌기 때문에 전역번수로 두었습니다.
function comTurn() { //컴퓨터 턴 (반복해서 실행하기 때문에 시작시 음성을 넣지않습니다)
    let rNum = 0; // 첫 카드
    let rNum2 = 0; // 두번째 카드
    rNum = findComNum(); // findComNum을 호출하여 이미 드랍된 dropNum 배열안의 수를 제외하고 랜덤한 카드를 고름. 골랐을 경우 이미 drop된 카드로 취급하기위해 Push(rNum)을 넣음
    $('.card').eq(rNum).flip(true); // 그림이 나오도록 뒤집기
    cardOffset[0].top = $('.card').eq(rNum).offset().top;
    cardOffset[0].left = $('.card').eq(rNum).offset().left; //animate를 위해 기존 카드 위치정보 삽입
    playAudio(rNum); // 해당 음성 재생
    setTimeout(function () { // 첫 카드를 고르고 2초뒤 실행
        rNum2 = findComNum(); // 이미 드랍된 카드와 rnum과 겹치지 않는 랜덤한 숫자를 rNum2에 삽입함
        $('.card').eq(rNum2).flip(true); // 그림이 나오도록 뒤집기
        cardOffset[1].top = $('.card').eq(rNum2).offset().top;
        cardOffset[1].left = $('.card').eq(rNum2).offset().left;
        playAudio(rNum2);

        setTimeout(function () { //2초뒤 실행
            if (card[rNum].phoneme === card[rNum2].phoneme) { // 두개의 카드의 음소가 같은 경우
                if (card[rNum].phoneme === 'ㅏ' && card[rNum2].phoneme === 'ㅏ') { // 음소가 'ㅏ' 로 같을경우
                    console.log("same phoneme with ㅏ");
                    //Alert(컴퓨터가 고른 두 카드의 음소가 ㅏ 로 같으니, 컴퓨터가 가져갑니다)
                    setTimeout(function () { // 1초뒤 카드 두개를 해당 칸으로 이동
                        $('.card img').eq(rNum).animate({
                            top: $('.comCard').eq(comA).offset().top - cardOffset[0].top,
                            left: $('.comCard').eq(comA).offset().left - cardOffset[0].left,
                        }, 1000);
                        comA++;
                        $('.card img').eq(rNum2).animate({

                            top: $('.comCard').eq(comA).offset().top - cardOffset[1].top,
                            left: $('.comCard').eq(comA).offset().left - cardOffset[1].left,
                        }, 1000);
                        comA++;
                    }, 2000);
                } else { // 음소가 'ㅗ'로 같을 경우
                    console.log("same phoneme with ㅗ");
                    //Alert(컴퓨터가 고른 두 카드의 음소가  ㅗ 로 같으니, 컴퓨터가 가져갑니다)
                    setTimeout(function () {
                        $('.card img').eq(rNum).animate({
                            top: $('.comCard').eq(comB).offset().top - cardOffset[0].top,
                            left: $('.comCard').eq(comB).offset().left - cardOffset[0].left,
                        }, 1000);
                        comB++;
                        $('.card img').eq(rNum2).animate({
                            top: $('.comCard').eq(comB).offset().top - cardOffset[1].top,
                            left: $('.comCard').eq(comB).offset().left - cardOffset[1].left,
                        }, 1000);
                        comB++;
                    }, 1000);
                }
                comScore += 2; // 컴퓨터 점수 2점 증가
                updateCounterStatus($comScore, comScore);
                setTimeout(function () { // 2초뒤 유저에게 턴 넘김
                    comOver();
                }, 1000);
            } else { // 컴퓨터가 랜덤하게 고른 두 카드의 음소가 다른 경우
                console.log("wrong phoneme");
                //Alert(컴퓨터가 고른 두 카드의 음소가 같지않네요, 이제 유저 턴으로 넘어갈게요)
                $('.card').eq(rNum).flip(false);
                $('.card').eq(rNum2).flip(false);
                dropNum.splice(dropNum.length - 2, 2);
                //카드를 다시 뒤집고, dropNum push들어온 두개를 삭제하여 다시 고를 수 있도록 만듬
                setTimeout(function () { // 2초뒤 유저에게 턴 넘김
                    comOver();
                }, 1000);
            }
        }, 2000);
    }, 1000);
}

function shuffleCard() { //카드섞기, 4X4 , 3X3에따라 다르게 섞습니다.
    if (gameSetting === 8) {
        for (let i = 0; i < card.length; i++) {
            let j = Math.floor(Math.random() * (i + 1));
            const x = card[i];
            card[i] = card[j];
            card[j] = x;
        }
    } else { //3X3 을 고를때, ㅏ 4개 ㅗ3개를 랜덤으로 찾아 지우고, 재배치하는 과정입니다.
        for (let x = 8; x > 4; x--) {
            let re = Math.floor(Math.random() * x);
            card.splice(re, 1);
        }
        for (let x = 8; x > 5; x--) {
            let re = Math.floor(Math.random() * x + 4);
            card.splice(re, 1);
        }
        for (let i = 0; i < card.length; i++) {
            let j = Math.floor(Math.random() * (i + 1));
            const x = card[i];
            card[i] = card[j];
            card[j] = x;
        }
    }
    for (let i = 0; i < card.length; i++) {
        $('.image').eq(i).attr('src', card[i].image);
    }
}

function playAudio(num) { // 매개변수로 index번호를 받아, 해당하는 카드의 음성파일을 재생시킵니다.
    let audio = new Audio();
    audio.src = card[num].audio;
    audio.play();
}

// 3X3  버튼
$('#33').one('click', function () { // 이 클릭 이벤트는 한번만 가능
    //카드 7개 삭제
    $('.card').eq(3).remove();
    $('.card').eq(3).remove();
    $('.card').eq(7).remove();
    $('.card').eq(11).remove();
    $('.card').eq(11).remove();
    $('.card').eq(10).remove();
    $('.card').eq(9).remove();
    //유저카드와 컴퓨터 카드 4개씩 삭제
    for (let x = 15; x > 13; x--) {
        $('.comCard').eq(x).remove();
        $('.userCard').eq(x).remove();
    }
    for (let x = 0; x < 2; x++) {
        $('.comCard').eq(x).remove();
        $('.userCard').eq(x).remove();
    }

    //gameboard의 가로를 줄여, 2행 3열로 정렬
    $('.game').css({
        width: "420px"
    });
    gameSetting = 6;
    comB = gameSetting;
    shuffleCard();
    $('#cards').show();
    $('.card').show();
    $('#33').remove();
    $('#44').remove();
});
// 4X4  버튼 (init -> 숨김)
$('#44').one('click', function () { // 이 클릭 이벤트는 한번만 가능함
    gameSetting = 8;
    comB = gameSetting;
    shuffleCard();
    $('#cards').show();
    $('.card').show();
    $('#33').remove();
    $('#44').remove();
});

function pickOX() { // 카드를 두개 골랐을경우 모든 카드의 포인터이벤트를 막고, 선택하도록 만듦
    //Alert(카드를 두개 선택하였으니, 두 카드의 음소가 맞으면 O , 틀리면 X를 눌러주세요)
    $('.button').show();
    $('.card img').css({
        pointerEvents: "none"
    });
    $('.card').css({
        pointerEvents: "none"
    });
}

function selectable() { //유저가 음소가 다른 두개를 골라서, 두개다 다름을 인지하였을 경우 다시 선택
    $('.card').css({
        pointerEvents: "auto"
    });
    fliped = 0;
    droppedCardBlock();
}

function updateCounterStatus($event_counter, new_count) { // userlife, userscore, comscore를 상시 반영
    $("span.count", $event_counter).text(new_count);
    if ((dropNum.length === 8 && gameSetting === 6) || (dropNum.length === 16 && gameSetting === 8)) {
        endTrigger(gameSetting);
    }
}

function lifeZero() { // 유저의 턴이 끝났을 경우 값들을 초기화 후 포인터 이벤트를 막음
    //Alert(유저의 차례가 끝이났어요!)
    if ((gameSetting === 6 && dropNum.length >= 8) || (gameSetting === 8 && dropNum.length === 16)) {
        return;
    }
    userLife = 0;
    fliped = 0;
    updateCounterStatus($userLife, userLife);
    failstack = 0;
    $('.card').css({
        pointerEvents: "none"
    });
    setTimeout(function () {
        comTurn();
    }, 2000);
}

function findComNum() { //4X4 인경우와 3X3인경우 컴퓨터의 랜덤값을 반환하기 위해 만들어진 함수
    let n = 0;
    if (gameSetting === 8) {
        n = Math.floor(Math.random() * 16); // 0~15 사이의 랜덤한 수를 n 에다 대입
        let on = dropNum.indexOf(n); // on = dropNum배열에 n의 값을 가진게 하나라도 있는경우 -1을 반환함
        if (on === -1) {
            dropNum.push(n);
            return n;
        } else if (on !== -1 || (n < 0 || n >= 16)) { // n이 0보다 작거나 16보다 큰경우 방지, dropnum에 n값이 있는경우 재귀하여 이 조건이 맞을때까지 반복함
            return findComNum();
        }
    } else { //3X3인 경우
        n = Math.floor(Math.random() * 9);
        let on = dropNum.indexOf(n);
        if (on === -1) {
            dropNum.push(n);
            return n;
        } else if (on !== -1 || (n < 0 || n >= 9)) {
            return findComNum();
        }
    }
}

function game33End() {
    let lastCard;
    for (let i = 0; i < 9; i++) {
        if (dropNum.indexOf(i) === -1) {
            lastCard = i;
        }
    }
    dropNum.push(lastCard);
    $('.card').eq(lastCard).flip(true);
    playAudio(lastCard);
    $('.card').css({
        pointerEvents: "none"
    });
    console.log("Game Over");
}

function endTrigger(set) {
    if (set === 6) {
        if (dropNum.length === 8) {
            console.log("3X3 Game End");
            if (userScore > comScore) {
                console.log("User Win");
            } else if (userScore === comScore) {
                console.log("Draw");
            } else {
                console.log("Com Win");
            }
            setTimeout(function () {
                game33End();
            }, 2000);
        }
    } else if (dropNum.length === 16) {
        console.log("4X4 Game End");
        if (userScore > comScore) {
            console.log("User Win");
        } else if (userScore === comScore) {
            console.log("Draw");
        } else {
            console.log("Com Win");
        }
        console.log("Game Over");
    }
}

function comOver() {
    //Alert(컴퓨터의 차례가 끝나고, 이제 유저의 차례임을 알림)
    if ((gameSetting === 6 && dropNum.length === 8) || (gameSetting === 8 && dropNum.length === 16))  {
        return;
    } else {
        userLife = 2;
        updateCounterStatus($userLife, userLife);
    }

    $('.card').css({
        pointerEvents: "auto"
    });
    droppedCardBlock();
}

function dropOver(one, two) { //유저가 카드 두장을 음소에 맞게 드랍한 경우
    dropNum.push(one);
    dropNum.push(two);
    droppedCardBlock();
}

function droppedCardBlock() { //턴을 종료할때, drop된 카드를 클릭하지 못하게 막기
    for (let i = 0; i < dropNum.length; i++) {
        $('.card').eq(dropNum[i]).css({
            pointerEvents: "none"
        });
    }
}
