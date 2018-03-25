$(document).ready(function(){
  console.log("calling GET /");
  $.ajax({
    method: 'get',
    url: '/',
    data: '',
    success: function(){
      console.log("get / success");
    },
    error: function(){
      console.log("error");
    }
  });
});

function checkInNow(){
  $.ajax({
    method: 'post',
    url: '/check-in-users',
    data: '',
    success: function(){
      window.location.pathname = 'user.html';
    },
    error: function(){
      console.log("error");
    }
  });
}

function viewHistory(){
  $.ajax({
    method: 'post',
    url: '/view-history',
    data: 'checkin='+$('#checkin').val(),
    success: appendusers
  });
}

function appendusers(data){
  console.log('starting append users');
  console.log(data);
  $('body>table').empty();
  $('<tbody>').appendTo('body>table');
  var $tr = $('<tr>').append(
    $('<th>').html("Where you checked in"),
    $('<th>').html("Name"),
    $('<th>').html("ID"),
    $('<th>').html("Date")
  ).appendTo('body>table>tbody');
  $.each(data, function(i, item){
    var $tr = $('<tr class=>').append(
      $('<td>').html(item.checkString),
      $('<td>').html(item.name),
      $('<td>').html(item.studentid),
      $('<td>').html(item.date)
    ).addClass("table-insert").appendTo('body>table');
  });
}
$('table').on('click', 'tbody>tr.table-insert', function(){
  var data = $(this).children('td').map(function(){
    return $(this).html();
  }).get();
  console.log(data);
  $.ajax({
    method: 'delete',
    url: '/delete/'+data[1],
    data: 'checkString='+data[0] + '&name='+data[1] + '&studentid='+data[2] + '&date='+data[3],
    success: appendusers
  })
});
