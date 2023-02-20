var db = require('./db');
var template = require('./template');
var url = require('url');
var qs = require('querystring');

exports.home = function(request, response){ // 메인 페이지
  db.query(`SELECT * FROM topic`, function(error, results){ // results에 sql의 결과가 담김
    var title = 'MainPage';
    var description = 'MainPage';
    var list = template.list(results);
    var html = template.html(title, list, 
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>` // control 부분
    );
    response.writeHead(200);
    response.end(html);
  });
}

exports.page = function(request, response){ // 페이지 조회
  var _url = request.url;
  var queryData = url.parse(_url,true).query;
  db.query(`SELECT * FROM topic`, function(error, results){ // results에 sql의 결과가 담김
    if(error){
      throw error;
    }
    // 게시판 id번호와 유저 id번호 조회
    db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`, [queryData.id], function (error2, result) {
      if(error2){
        throw error2;
      }
      var title = result[0].title;
      var description = result[0].description;
      var list = template.list(results);
      var html = template.html(title, list, 
        `
          <h2>${title}</h2>
          ${description}
          <p>작성자: ${result[0].name}</p>
        `,
        `<a href="/create">create</a>
        <a href="/update?id=${queryData.id}">update</a>
        <form action="delete_process" method="post">
          <input type="hidden" name="id" value="${queryData.id}">
          <input type="submit" value="delete">
        </form>` // control 부분
      );
      response.writeHead(200);
      response.end(html);
    })
  })
}

exports.create = function(request, response){ // 글 생성
  db.query(`SELECT * FROM topic`, function(error, results){ // results에 sql의 결과가 담김
    db.query(`SELECT * FROM author`, function(error2, authors){
      var title = 'create';
      var list = template.list(results);
      var html = template.html(title, list, 
        `
        <form action="/create_process" method="post">
          <p>
            ${template.authorSelect(authors)} # => 테스트를 위해 유저 고르는 셀렉트 생성한것 (프로젝트 적용시엔 제거)
          </p>  
          <p><input type="text" name="title" placeholder = "title"/></p>
          <p>
            <textarea name="description" placeholder = "description"></textarea>
          </p>
          <p>
            <input type="submit" value="작성"/>
          </p>
        </form>`,
        `<a href="/create">create</a>` // control 부분
      );
      response.writeHead(200);
      response.end(html);
    });
  });
}

exports.create_process = function(request, response){ // 글 생성 처리
  var body = '';
  request.on('data',function(data){
    body = body + data;
    // body데이터에 콜백이 실행될때마다 data를 추가
  })
  request.on('end',function(){
    var post = qs.parse(body);
    // post에 body를 parse()함수를 통해 객체로 바꿔서 할당
    db.query(`INSERT INTO topic (title, description, created, author_id)
      VALUES(?, ?, NOW(), ?)`,
      [post.title, post.description, post.author],
      function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302,{Location: `/?id=${result.insertId}`}); // 페이지를 리다이렉션
        response.end(); // 따로 더 표시할 내용 없으므로 빈 칸
      }
    )
  })
}

exports.update = function(request, response){ // 글 수정 
  var _url = request.url;
  var queryData = url.parse(_url,true).query;
  db.query('SELECT * FROM topic', function(error, results){ // 배열에 topic테이블의 행들이 객체 형태로 저장
    if(error){
      throw error;
    }
    db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function (error2, result) { // queryData.id 즉 ?id=쿼리값과 topic테이블의 id값이 일치하는것 선택
      if(error2){
        throw error2;
      }
      db.query(`SELECT * FROM author`, function(error2, authors){ 
        if(error2){
          throw error2;
        }
        var list = template.list(results);
        var html = template.html(result[0].title, list, // 일치하는 id의 행이 벼열형태로 result에 담겨있음
          `
          <form action="/update_process" method="post">
            <input type="hidden", name="id", value="${result[0].id}">
            <p><input type="text" name="title" placeholder = "title" value="${result[0].title}"/></p>
            <p>
              <textarea name="description" placeholder = "description">${result[0].description}</textarea>
            </p>
            <p>
              ${template.authorSelect(authors, result[0].author_id)}
            </p>
            <p>
              <input type="submit" />
            </p>
          </form>
          `, 
          `<a href="/create">create</a>
          <a href="/update?id=${result[0].id}">update</a>` // control 부분
          );
        response.writeHead(200);
        response.end(html); // 화면에 표시하는 함수
      });
    });
  });
}

exports.update_process = function(request, response){ // 글 수정 처리
  var body = '';
  request.on('data',function(data){
    body = body + data;
    // body데이터에 콜백이 실행될때마다 data를 추가
  })
  request.on('end',function(){
    var post = qs.parse(body);
    // post에 body를 parse()함수를 통해 객체로 바꿔서 할당
    db.query('UPDATE topic SET title=?, description=?, author_id=? WHERE id=?', [post.title, post.description, post.author, post.id], function(error, result){
      response.writeHead(302,{Location: `/?id=${post.id}`}); // 페이지를 다른곳으로 리다이렉션 시키라는 것
      response.end(); // 따로 더 표시할 내용 없으므로 빈 칸
    })
  })
}

exports.delete_process = function(request, response){ // 글 삭제
  var body = '';
  request.on('data',function(data){
    body = body + data;
    // body데이터에 콜백이 실행될때마다 data를 추가
  })
  request.on('end',function(){
    var post = qs.parse(body);
    // post에 body를 parse()함수를 통해 객체로 바꿔서 할당
    db.query('DELETE FROM topic WHERE id = ?', [post.id], function(error, result){
      if(error){
        throw error;
      }
      response.writeHead(302,{Location: `/`});
      response.end(); 
    })
  })
}