var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var topic = require('./lib/topic');

var app = http.createServer(function(request,response){
  // URL로 입력된 값 사용하기에서 변수값 변경 url => _url
    var _url = request.url;
    var queryData = url.parse(_url,true).query; // URL로 입력된 값 사용하기에서 추가
    var pathname = url.parse(_url,true).pathname;
    if(pathname === '/'){
      // 패스가 없는 경로로 접속시(메인화면)
      if(queryData.id === undefined){ // id?= 값 없을때(메인)
        topic.home(request, response);
      }else{ // id?= 값이 있을때(상세보기)
        topic.page(request, response);
      }
    }else if(pathname === '/create'){ // 글생성
      topic.create(request, response);
    }else if(pathname === '/create_process'){ // 글생성 처리
      topic.create_process(request, response);
    }else if(pathname === '/update'){ // 글수정
      topic.update(request, response);
    }else if(pathname === '/update_process'){ //글수정 처리
      topic.update_process(request,response);
    }else if(pathname === '/delete_process'){ // 글삭제
      topic.delete_process(request, response);
    }
    else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000); 