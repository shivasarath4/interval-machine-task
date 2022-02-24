const mysql = require("mysql");
let instance = null;


//setting up the connection to mysql
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'user',
    password : 'user',
    database : 'test',
    socketPath: '/opt/lampp/var/mysql/mysql.sock'
  });

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log(`db ${connection.state}`);
});


class DbService {
    //get DbService class instance
    static getDbServiceInstance() {
      return instance ? instance : new DbService();
    }
    



         //get catagorized articles
  async getCatArticles({catagories:catagories}  ) {
    try {
      let cat = await new Promise((resolve, reject) => {
        let query = `SELECT a.* , c.catagory as Catagory
                      FROM article a
                          INNER JOIN article_catagories ac ON a.id = ac.article_id
                          INNER JOIN catagories c ON ac.catagory_id = c.id 
                      WHERE c.catagory IN (?) ;`;
        connection.query(query,[catagories],function (error, results) {
              if (error) reject(error);
              resolve(results);
            }
        );
      });
      return cat;
    } catch (err) {
      return err.sqlMessage;
    }
  }




         //get articles
  async getArticles() {
    try {
      let cat = await new Promise((resolve, reject) => {
        let query = `SELECT * FROM article;`;
        connection.query(query,function (error, results) {
              if (error) reject(error);
              resolve(results);
            }
        );
      });
      return cat;
    } catch (err) {
      return err.sqlMessage;
    }
  }
    

     //edit  article

     async deleteArticle({id}) {
      try {
        let cat = await new Promise((resolve, reject) => {
          let query = `DELETE FROM article WHERE id = ?`;
          connection.query(query,[id],function (error, results) {
                if (error) reject(error);
                resolve(results);
              }
          );
        });
        return cat;
      } catch (err) {
        return err.sqlMessage;
      }
    }

     //edit  article

     async putArticle({itemkey,data,id}) {
      try {
        let cat = await new Promise((resolve, reject) => {
          let query = `UPDATE article SET ?? = ? WHERE id = ?`;
          connection.query(query,[itemkey,data,id],function (error, results) {
                if (error) reject(error);
                resolve(results);
              }
          );
        });
        return cat;
      } catch (err) {
        return err.sqlMessage;
      }
    }
     //add  article

     async postArticle({
      heading,
      description,
      time,
      image,
      verified,
      newest,
      trending,
      catagories
    }) {
    try {
      let cat = await new Promise((resolve, reject) => {

        connection.beginTransaction(function(err) {
          if (err) { throw err; }
          let query1 = `INSERT INTO article (heading,description,time,image,verified,newest,trending) VALUES (?,?,?,?,?,?,?);`;
          connection.query(query1,
            [heading,
             description,
             time,
             image,
             verified,
             newest,
             trending],
            function (error, results, fields) {
              if (error) {
                return connection.rollback(function() {
                  reject(error)
                });
              }
              catagories.map((catagory) => {
                let query2 = `INSERT INTO article_catagories (article_id, catagory_id) VALUES (?,(SELECT id FROM catagories WHERE catagory = ?))`;

                connection.query(query2, [results.insertId,catagory], function (error, results, fields) {
                  if (error) {
                    return connection.rollback(function() {
                      console.log(error);
                      reject(error)
                    });
                  }
                  console.log(results);
                });
            })
            connection.commit(function(err) {
              if (err) {
                return connection.rollback(function() {
                  reject(error)
                });
              }
              resolve(results);
            });

          });
        });
      });
      return cat;
    } catch (err) {
      return err;
    }
  }
     //add catagory
  async postCatagory({catagory}) {
    try {
      let cat = await new Promise((resolve, reject) => {
        let query = `INSERT INTO catagories (catagory) VALUES (?);`;
        connection.query(
          query,
          [
           catagory
          ],
          function (error, results) {
            if (error) reject(error);
            resolve(results);
          }
        );
      });
      return cat;
    } catch (err) {
      return err.sqlMessage;
    }
  }
     //get catagory
  async getCatagory() {
    try {
      let cat = await new Promise((resolve, reject) => {
        let query = `SELECT * FROM catagories;`;
        connection.query(query,function (error, results) {
              if (error) reject(error);
              resolve(results);
            }
        );
      });
      return cat;
    } catch (err) {
      return err.sqlMessage;
    }
  }

}

module.exports = DbService;