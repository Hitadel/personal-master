module.exports = {
  html:function(title,list,body,control){ // 페이지 생성 함수
    return ` 
    <!doctype html>
    <html>
    <head>
      <title>WEB - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">General Forum</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },
  list:function(filelist){ // 작성된 페이지 목록 불러오는 함수
    var list = `<table>
                  <tr>
                    <td>제목</td>
                  </tr>
                `;
    var i = 0;
    while(i < filelist.length){
      list += `<tr>
                <td>
                  <a href="/?id=${filelist[i].id}">${filelist[i].title}</a>
                </td>
              </tr>`;
      i = i+1;
    };
    list += `</table>
            <style>
              table{
                border-collapse : collapse;
              }
              td{
                border : solid 1px black;
              }
              a{
                text-decoration: none;
              }
            </style>
            `
    return list;
  },
  authorSelect:function(authors, author_id){ // 유저 선택. 프로젝트 적용시엔 제거
    var tag = '';
    var i = 0;
    while(i<authors.length){
      var selected = '';
      if(authors[i].id === author_id){
        selected = ' selected'
      }
      tag+=`<option value="${authors[i].id}"${selected}>${authors[i].name}</option>`
      i++;
    }
    return`
    <select name="author">
      ${tag}
    </select>
    `
  },
}

// module.exports = template;