var socket = io();
socket.on('connect', function(){
  console.log('Connected to server');
});

function buttonPop(){
  $('.button-effect-pop').css('transform','scale(1.25,1.5)');
  $('.button-effect-pop').css('opacity','0');
  setTimeout(function(){
    $('.button-effect-pop').css('display','none');
    $('.button-effect-pop').css('transform','scale(1)');
    $('.button-effect-pop').css('opacity','.75');
  },1000);
  setTimeout(function(){
    $('.button-effect-pop').css('display','block');
  },2000);
}

function messageHighlight(){
  setTimeout(function(){
    $('.message:last-of-type').css('border','4px solid #fdcb6e');
  },200);
  setTimeout(function(){
    $('.message:last-of-type').css('border','4px solid transparent');
  },1200);
}

$('#post-form').on('submit', function(e){
  e.preventDefault();
  if($('#post-area').val().length>1){
    buttonPop();
    socket.emit('newPost', {
      message: $('#post-area').val()
    });
  }
  $('#post-area').val('');
});


socket.on('loadPosts',function(allPosts){
  $('.confessions').html('');
  $.each(allPosts, function(i) {
    let htmlVar = `<div class="message">
      <div class="number">#${allPosts[i].postNumber}</div><div class="time-stamp">${allPosts[i].postedAt}</div>
      ${allPosts[i].message}
    </div>`;
    $('.confessions').append(htmlVar);
  });
});

socket.on('addPost',function(posted){
  let htmlVar = `<div class="message">
    <div class="number">#${posted.postNumber}</div><div class="time-stamp">${posted.postedAt}</div>
    ${posted.message}
  </div>`;
  $('.confessions').append(htmlVar);
  messageHighlight();
});

socket.on('disconnect', function(){
  console.log('Disconnected to server');
});
