const revisionModel = require("../model/Revision");
const validator = require("../services/validator");
const fs = require("fs");
const async = require("async");

module.exports = {
  // fetch a count of all records
  countAll: async (request, response, next) => {
    await revisionModel.countDocuments({}, function(err, result) {
      //log error to json response if one occurs
      if (err) {
        response.json({ status: "error", message: "Could not retrieve results", data: null });

        next();
        //log results to json response if successful
      } else {
        response.json({ status: "success", message: "Fetched count", data: result });

        next();
      }
    });
  },

  //fetch a count of records which match the given title
  countTitle: async (request, response, next) => {
    reqTitle = request.query.title;

    await revisionModel.countDocuments({ title: reqTitle }, function(err, result) {
      //log error to json response if one occurs
      if (err) {
        response.json({ status: "error", message: "Could not retrieve results", data: null });

        next();
        //log results to json response if successful
      } else {
        response.json({ status: "success", message: "Fetched count", data: result });

        next();
      }
    });
  },

  //get list of unique titles in the revisions collection
  getUniqueTitles: async (request, response, next) => {
    await revisionModel.aggregate(
      [
        {
          $group: {
            _id: "$title",
            revisions: {
              $sum: 1
            }
          }
        },
        {
          $sort: {
            _id: 1
          }
        }
      ],
      function(err, result) {
        //log error to json response if one occurs
        if (err) {
          response.json({ status: "error", message: "Could not retrieve titles", data: null });

          next();
          //log results to json response if successful
        } else {
          response.json({ status: "success", message: "Fetched list of titles", data: result });

          next();
        }
      }
    );
  },

  //for a given title, find the latest revision done to that article
  getLatestRevision: async (request, response, next) => {
    reqTitle = request.query.title;

    await revisionModel
      .find({ title: reqTitle })
      .sort({ timestamp: -1 })
      .limit(1)
      .exec(function(err, result) {
        if (err) {
          response.json({ status: "error", message: "Could not retrieve revision", data: null });

          next();
          //log results to json response if successful
        } else {
          response.json({ status: "success", message: "Fetched latest revision", data: result });

          next();
        }
      });
  },
  //Get Highest Revisions based on user value
  getHighestRevisionsWithValue: async (request, response, next) => {
    const limit = Number(request.query.limit);

    await revisionModel.aggregate([{ $group: { _id: "$title", count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: limit }], function(err, result) {
      if (err) {
        response.json({ status: "error", message: "Could not retrieve revision", data: null });

        next();
        //log results to json response if successful
      } else {
        response.json({ status: "success", message: "Fetched highest " + limit + " revisions", data: result });

        next();
      }
    });
  },
  // Get Lowest Revisions based on user Value
  getLowestRevisionsWithValue: async (request, response, next) => {
    const limit = Number(request.query.limit);

    await revisionModel.aggregate([{ $group: { _id: "$title", count: { $sum: 1 } } }, { $sort: { count: 1 } }, { $limit: limit }], function(err, result) {
      if (err) {
        response.json({ status: "error", message: "Could not retrieve revision", data: null });

        next();
        //log results to json response if successful
      } else {
        response.json({ status: "success", message: "Fetched lowest " + limit + " revisions", data: result });

        next();
      }
    });
  },

  //for a given title, find the earliest revision done to that article
  getOldestRevision: async (request, response, next) => {
    reqTitle = request.query.title;

    await revisionModel
      .find({ title: reqTitle })
      .sort({ timestamp: 1 })
      .limit(1)
      .exec(function(err, result) {
        if (err) {
          response.json({ status: "error", message: "Could not retrieve revision", data: null });

          next();
          //log results to json response if successful
        } else {
          response.json({ status: "success", message: "Fetched oldest revision", data: result });

          next();
        }
      });
  },

  getMostRegisteredUsers: async (request, response, next) => {
    var mostRegisteredUsersPipeline = [
      { $group: { _id: { title: "$title", userid: "$userid" }, distinctUsers: { $sum: 1 } } },
      { $group: { _id: "$_id.title", distinctUsers: { $sum: 1 } } },
      { $sort: { distinctUsers: -1 } },
      { $limit: 1 }
    ];

    await revisionModel.aggregate(mostRegisteredUsersPipeline, function(err, result) {
      if (err) {
        response.json({ status: "error", message: "Problem with executing aggregate function", data: null });

        next();
      } else {
        response.json({ status: "success", message: "Fetched article edited by most users", data: result });

        next();
      }
    });
  },

  getLeastRegisteredUsers: async (request, response, next) => {
    var leastRegisteredUsersPipeline = [
      { $group: { _id: { title: "$title", userid: "$userid" }, distinctUsers: { $sum: 1 } } },
      { $group: { _id: "$_id.title", distinctUsers: { $sum: 1 } } },
      { $sort: { distinctUsers: 1 } },
      { $limit: 1 }
    ];

    await revisionModel.aggregate(leastRegisteredUsersPipeline, function(err, result) {
      if (err) {
        response.json({ status: "error", message: "Problem with executing aggregate function", data: null });

        next();
      } else {
        response.json({ status: "success", message: "Fetched article edited by fewest users", data: result });

        next();
      }
    });
  },

  getOldestArticle: async (request, response, next) => {
    const limit = parseInt(request.query.limit);

    var oldestArticlePipeline = [
      { $group: { _id: "$title", oldest: { $min: "$timestamp" } } },
      { $project: { title: 1, olddate: { $dateFromString: { dateString: "$oldest" } } } },
      { $project: { title: 1, age: { $subtract: [new Date(), "$olddate"] } } },
      { $sort: { age: -1 } },
      { $limit: limit }
    ];

    await revisionModel.aggregate(oldestArticlePipeline, function(err, result) {
      if (err) {
        response.json({ status: "error", message: "Problem with executing aggregate function", data: null });

        next();
      } else {
        var data = result;
        // converting milliseconds to days
        //data[0].age = Math.floor(parseInt(data[0].age) / (1000 * 60 * 60 * 24));
        response.json({ status: "success", message: "Fetched oldest article", data: data });

        next();
      }
    });
  },

  getYoungestArticle: async (request, response, next) => {
    const limit = parseInt(request.query.limit);

    var youngestArticlePipeline = [
      { $group: { _id: "$title", oldest: { $min: "$timestamp" } } },
      { $project: { title: 1, olddate: { $dateFromString: { dateString: "$oldest" } } } },
      { $project: { title: 1, age: { $subtract: [new Date(), "$olddate"] } } },
      { $sort: { age: 1 } },
      { $limit: limit }
    ];

    await revisionModel.aggregate(youngestArticlePipeline, function(err, result) {
      if (err) {
        response.json({ status: "error", message: "Problem with executing aggregate function", data: null });

        next();
      } else {
        var data = result;
        // converting milliseconds to days
        //data[0].age = Math.floor(parseInt(data[0].age) / (1000 * 60 * 60 * 24));
        response.json({ status: "success", message: "Fetched youngest article", data: data });

        next();
      }
    });
  },

  getRevisionsByUserType: async (request, response, next) => {
    function readAsync(file, callback) {
      fs.readFile(file, "utf8", callback);
    }

    const files = ["data/bot.txt", "data/admin_active.txt", "data/admin_inactive.txt", "data/admin_semi_active.txt", "data/admin_former.txt"];

    async.map(files, readAsync, async (error, contents) => {
      var userBots = contents[0].toString().split("\r\n");
      var userAdminActive = contents[1].toString().split("\r\n");
      var userAdminInactive = contents[2].toString().split("\r\n");
      var userAdminSemi = contents[3].toString().split("\r\n");
      var userAdminFormer = contents[4].toString().split("\r\n");
      var allAdmins = userAdminActive.concat(userAdminInactive.concat(userAdminSemi.concat(userAdminFormer)));

      async.parallel(
        {
          bot: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    year: {
                      $year: {
                        $dateFromString: {
                          dateString: "$timestamp"
                        }
                      }
                    }
                  }
                },
                {
                  $match: {
                    user: { $in: userBots }
                  }
                },
                {
                  $group: {
                    _id: "Bot",
                    bot_revisions: {
                      $sum: 1
                    }
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          admin: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    year: {
                      $year: {
                        $dateFromString: {
                          dateString: "$timestamp"
                        }
                      }
                    }
                  }
                },
                {
                  $match: {
                    user: { $in: allAdmins }
                  }
                },
                {
                  $group: {
                    _id: "Administrator",
                    admin_revisions: {
                      $sum: 1
                    }
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          anon: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    year: {
                      $year: {
                        $dateFromString: {
                          dateString: "$timestamp"
                        }
                      }
                    }
                  }
                },
                {
                  $match: {
                    anon: { $exists: true }
                  }
                },
                {
                  $group: {
                    _id: "Anonymous",
                    anon_revisions: {
                      $sum: 1
                    }
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          regular: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    year: { $year: { $dateFromString: { dateString: "$timestamp" } } }
                  }
                },
                {
                  $match: {
                    $and: [{ user: { $nin: allAdmins } }, { user: { $nin: userBots } }, { anon: { $exists: false } }]
                  }
                },
                {
                  $group: {
                    _id: "Regular User",
                    reg_revisions: {
                      $sum: 1
                    }
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          }
        },

        function(err, results) {
          if (err) {
            response.json({ status: "error", message: "didn't get stuff", data: err });
            next();
          } else {
            json1 = results.admin;
            json2 = results.bot;
            json3 = results.anon;
            json4 = results.regular;
            // mapped_res = json1.map(x => Object.assign(x, json2.find(y => y._id == x._id)));
            // mapped_res = mapped_res.map(x => Object.assign(x, json3.find(y => y._id == x._id)));
            // mapped_res = mapped_res.map(x => Object.assign(x, json4.find(y => y._id == x._id)));

            data = json1.concat(json2.concat(json3.concat(json4)));

            response.json({ status: "success", message: "got stuff", data: data });
            next();
          }
        }
      );
    });
  },

  getRevisionDistributionByYearUser: async (request, response, next) => {
    function readAsync(file, callback) {
      fs.readFile(file, "utf8", callback);
    }

    const files = ["data/bot.txt", "data/admin_active.txt", "data/admin_inactive.txt", "data/admin_semi_active.txt", "data/admin_former.txt"];

    async.map(files, readAsync, async (error, contents) => {
      var userBots = contents[0].toString().split("\r\n");
      var userAdminActive = contents[1].toString().split("\r\n");
      var userAdminInactive = contents[2].toString().split("\r\n");
      var userAdminSemi = contents[3].toString().split("\r\n");
      var userAdminFormer = contents[4].toString().split("\r\n");
      var allAdmins = userAdminActive.concat(userAdminInactive.concat(userAdminSemi.concat(userAdminFormer)));

      async.parallel(
        {
          bot: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    year: { $year: { $dateFromString: { dateString: "$timestamp" } } }
                  }
                },
                {
                  $match: {
                    user: { $in: userBots }
                  }
                },
                {
                  $group: {
                    _id: "$year",
                    bot_revisions: { $sum: 1 }
                  }
                },
                {
                  $sort: {
                    _id: 1
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          admin: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    year: { $year: { $dateFromString: { dateString: "$timestamp" } } }
                  }
                },
                {
                  $match: {
                    user: { $in: allAdmins }
                  }
                },
                {
                  $group: {
                    _id: "$year",
                    admin_revisions: { $sum: 1 }
                  }
                },
                {
                  $sort: {
                    _id: 1
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          anon: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    year: { $year: { $dateFromString: { dateString: "$timestamp" } } }
                  }
                },
                {
                  $match: {
                    anon: { $exists: true }
                  }
                },
                {
                  $group: {
                    _id: "$year",
                    anon_revisions: { $sum: 1 }
                  }
                },
                {
                  $sort: {
                    _id: 1
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          regular: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    year: { $year: { $dateFromString: { dateString: "$timestamp" } } }
                  }
                },
                {
                  $match: {
                    $and: [{ user: { $nin: allAdmins } }, { user: { $nin: userBots } }, { anon: { $exists: false } }]
                  }
                },
                {
                  $group: {
                    _id: "$year",
                    reg_revisions: { $sum: 1 }
                  }
                },
                {
                  $sort: {
                    _id: 1
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          }
        },

        function(err, results) {
          if (err) {
            response.json({ status: "error", message: "didn't get stuff", data: err });
            next();
          } else {
            json1 = results.admin;
            json2 = results.bot;
            json3 = results.anon;
            json4 = results.regular;

            mapped_res = json1.concat(json2.concat(json3.concat(json4)));
            var result = mapped_res.filter(function(v) {
              return this[v._id] ? !Object.assign(this[v._id], v) : (this[v._id] = v);
            }, {});

            response.json({ status: "success", message: "got stuff", data: result });
            next();
          }
        }
      );
    });
  },

  displaySummaryInformation: async (request, response, next) => {
    function readAsync(file, callback) {
      fs.readFile(file, "utf8", callback);
    }

    reqTitle = request.query.title;
    reqFrom = request.query.fromyear != null ? request.query.fromyear : "1970";
    reqTo = request.query.toyear != null ? request.query.toyear : new Date().getFullYear().toString();

    stringFrom = reqFrom.toString().concat("-01-01T00:00:00Z");
    stringTo = reqTo.toString().concat("-12-31T23:59:59Z");

    const files = ["data/bot.txt", "data/admin_active.txt", "data/admin_inactive.txt", "data/admin_semi_active.txt", "data/admin_former.txt"];

    async.map(files, readAsync, async (error, contents) => {
      var userBots = contents[0].toString().split("\r\n");
      var userAdminActive = contents[1].toString().split("\r\n");
      var userAdminInactive = contents[2].toString().split("\r\n");
      var userAdminSemi = contents[3].toString().split("\r\n");
      var userAdminFormer = contents[4].toString().split("\r\n");
      var allAdmins = userAdminActive.concat(userAdminInactive.concat(userAdminSemi.concat(userAdminFormer)));

      var summaryPipeline = [
        {
          $match: {
            title: reqTitle,
            $expr: {
              $and: [
                {
                  $gte: ["$timestamp", stringFrom]
                },
                {
                  $lte: ["$timestamp", stringTo]
                }
              ]
            }
          }
        },
        {
          $facet: {
            Total: [{ $count: "Total" }],
            TopFive: [
              { $match: { $and: [{ user: { $nin: allAdmins } }, { user: { $nin: userBots } }, { anon: { $exists: false } }] } },
              { $group: { _id: "$user", usercount: { $sum: 1 } } },
              { $sort: { usercount: -1 } },
              { $limit: 5 }
            ]
          }
        }
      ];

      await revisionModel.aggregate(summaryPipeline, function(err, result) {
        if (err) {
          response.json({ status: "error", message: "Problem with fetching individual article summary", data: null });

          next();
        } else {
          response.json({ status: "success", message: "Fetched individual summary article for " + reqTitle, data: result });

          next();
        }
      });
    });
  },

  getArticleRevisionsByUserType: async (request, response, next) => {
    function readAsync(file, callback) {
      fs.readFile(file, "utf8", callback);
    }

    reqTitle = request.query.title;
    reqFrom = request.query.fromyear != null ? request.query.fromyear : "1970";
    reqTo = request.query.toyear != null ? request.query.toyear : new Date().getFullYear().toString();

    stringFrom = reqFrom.toString().concat("-01-01T00:00:00Z");
    stringTo = reqTo.toString().concat("-12-31T23:59:59Z");

    const files = ["data/bot.txt", "data/admin_active.txt", "data/admin_inactive.txt", "data/admin_semi_active.txt", "data/admin_former.txt"];

    async.map(files, readAsync, async (error, contents) => {
      var userBots = contents[0].toString().split("\r\n");
      var userAdminActive = contents[1].toString().split("\r\n");
      var userAdminInactive = contents[2].toString().split("\r\n");
      var userAdminSemi = contents[3].toString().split("\r\n");
      var userAdminFormer = contents[4].toString().split("\r\n");
      var allAdmins = userAdminActive.concat(userAdminInactive.concat(userAdminSemi.concat(userAdminFormer)));

      async.parallel(
        {
          bot: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    timestamp: "$timestamp"
                  }
                },
                {
                  $match: {
                    $and: [{ user: { $in: userBots } }, { title: reqTitle }, { timestamp: { $gte: stringFrom, $lte: stringTo } }]
                  }
                },
                {
                  $group: {
                    _id: "Bot",
                    bot_revisions: {
                      $sum: 1
                    }
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          admin: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    timestamp: "$timestamp"
                  }
                },
                {
                  $match: {
                    $and: [{ user: { $in: allAdmins } }, { title: reqTitle }, { timestamp: { $gte: stringFrom, $lte: stringTo } }]
                  }
                },
                {
                  $group: {
                    _id: "Administrator",
                    admin_revisions: {
                      $sum: 1
                    }
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          anon: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    timestamp: "$timestamp"
                  }
                },
                {
                  $match: {
                    $and: [{ anon: { $exists: true } }, { title: reqTitle }, { timestamp: { $gte: stringFrom, $lte: stringTo } }]
                  }
                },
                {
                  $group: {
                    _id: "Anonymous",
                    anon_revisions: {
                      $sum: 1
                    }
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          regular: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    timestamp: "$timestamp"
                  }
                },
                {
                  $match: {
                    $and: [{ user: { $nin: allAdmins } }, { user: { $nin: userBots } }, { anon: { $exists: false } }, { title: reqTitle }, { timestamp: { $gte: stringFrom, $lte: stringTo } }]
                  }
                },
                {
                  $group: {
                    _id: "Regular User",
                    regular_revisions: {
                      $sum: 1
                    }
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          }
        },

        function(err, results) {
          if (err) {
            response.json({ status: "error", message: "didnt get article revisions by user type", data: err });
            next();
          } else {
            json1 = results.admin;
            json2 = results.bot;
            json3 = results.anon;
            json4 = results.regular;
            // mapped_res = json1.map(x => Object.assign(x, json2.find(y => y._id == x._id)));
            // mapped_res = mapped_res.map(x => Object.assign(x, json3.find(y => y._id == x._id)));
            // mapped_res = mapped_res.map(x => Object.assign(x, json4.find(y => y._id == x._id)));

            data = json1.concat(json2.concat(json3.concat(json4)));

            response.json({ status: "success", message: "got article revisions by user type", data: data });
            next();
          }
        }
      );
    });
  },

  getArticleRevsByUserTypeAndYear: async (request, response, next) => {
    function readAsync(file, callback) {
      fs.readFile(file, "utf8", callback);
    }

    const files = ["data/bot.txt", "data/admin_active.txt", "data/admin_inactive.txt", "data/admin_semi_active.txt", "data/admin_former.txt"];

    reqTitle = request.query.title;
    reqFrom = request.query.fromyear != null ? request.query.fromyear : "1970";
    reqTo = request.query.toyear != null ? request.query.toyear : new Date().getFullYear().toString();

    stringFrom = reqFrom.toString().concat("-01-01T00:00:00Z");
    stringTo = reqTo.toString().concat("-12-31T23:59:59Z");

    async.map(files, readAsync, async (error, contents) => {
      var userBots = contents[0].toString().split("\r\n");
      var userAdminActive = contents[1].toString().split("\r\n");
      var userAdminInactive = contents[2].toString().split("\r\n");
      var userAdminSemi = contents[3].toString().split("\r\n");
      var userAdminFormer = contents[4].toString().split("\r\n");
      var allAdmins = userAdminActive.concat(userAdminInactive.concat(userAdminSemi.concat(userAdminFormer)));

      async.parallel(
        {
          bot: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    timestamp: "$timestamp",
                    year: { $year: { $dateFromString: { dateString: "$timestamp" } } }
                  }
                },
                {
                  $match: {
                    $and: [{ user: { $in: userBots } }, { title: reqTitle }, { timestamp: { $gte: stringFrom, $lte: stringTo } }]
                  }
                },
                {
                  $group: {
                    _id: "$year",
                    bot_revisions: { $sum: 1 }
                  }
                },
                {
                  $sort: {
                    _id: 1
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          admin: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    timestamp: "$timestamp",
                    year: { $year: { $dateFromString: { dateString: "$timestamp" } } }
                  }
                },
                {
                  $match: {
                    $and: [{ user: { $in: allAdmins } }, { title: reqTitle }, { timestamp: { $gte: stringFrom, $lte: stringTo } }]
                  }
                },
                {
                  $group: {
                    _id: "$year",
                    admin_revisions: { $sum: 1 }
                  }
                },
                {
                  $sort: {
                    _id: 1
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          anon: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    timestamp: "$timestamp",
                    year: { $year: { $dateFromString: { dateString: "$timestamp" } } }
                  }
                },
                {
                  $match: {
                    $and: [{ anon: { $exists: true } }, { title: reqTitle }, { timestamp: { $gte: stringFrom, $lte: stringTo } }]
                  }
                },
                {
                  $group: {
                    _id: "$year",
                    anon_revisions: { $sum: 1 }
                  }
                },
                {
                  $sort: {
                    _id: 1
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          },

          regular: function(cb) {
            revisionModel.aggregate(
              [
                {
                  $project: {
                    title: "$title",
                    user: "$user",
                    anon: "$anon",
                    timestamp: "$timestamp",
                    year: { $year: { $dateFromString: { dateString: "$timestamp" } } }
                  }
                },
                {
                  $match: {
                    $and: [{ user: { $nin: allAdmins } }, { user: { $nin: userBots } }, { anon: { $exists: false } }, { title: reqTitle }, { timestamp: { $gte: stringFrom, $lte: stringTo } }]
                  }
                },
                {
                  $group: {
                    _id: "$year",
                    reg_revisions: { $sum: 1 }
                  }
                },
                {
                  $sort: {
                    _id: 1
                  }
                }
              ],
              function(err, results) {
                if (err) {
                  cb(err);
                } else {
                  cb(null, results);
                }
              }
            );
          }
        },

        function(err, results) {
          if (err) {
            response.json({ status: "error", message: "failed to get article revisions by user type and year", data: err });
            next();
          } else {
            json1 = results.admin;
            json2 = results.bot;
            json3 = results.anon;
            json4 = results.regular;

            mapped_res = json1.concat(json2.concat(json3.concat(json4)));
            var result = mapped_res.filter(function(v) {
              return this[v._id] ? !Object.assign(this[v._id], v) : (this[v._id] = v);
            }, {});

            response.json({ status: "success", message: "got article revisions by user type and year", data: result });
            next();
          }
        }
      );
    });
  },

  getArticlesByAuthor: async (request, response, next) => {
    reqAuthor = request.query.author;

    var RevisionsByAuthorPipeline = [
      { $match: { user: reqAuthor } },
      { $group: { _id: "$title", no_revisions: { $sum: 1 }, timestamp_list: { $addToSet: "$timestamp" } } },
      { $sort: { no_revisions: -1 } }
    ];

    await revisionModel.aggregate(RevisionsByAuthorPipeline, function(err, result) {
      if (err) {
        response.json({ status: "error", message: "Couldn't fetch articles revised by " + reqAuthor, data: null });

        next();
      } else {
        response.json({ status: "success", message: "Fetched articles revised by author " + reqAuthor, data: result });

        next();
      }
    });
  },

  trackArticleRevisionsByAuthor: async (request, response, next) => {
    reqAuthor = request.query.author;
    reqTitle = request.query.title;

    await revisionModel.find({ title: reqTitle, user: reqAuthor }, { title: 1, user: 1, timestamp: 1, _id: 0 }).exec(function(err, result) {
      if (err) {
        response.json({ status: "error", message: "Could not retrieve timestamps for revisions by author " + reqAuthor + " to article " + reqTitle, data: null });

        next();
        //log results to json response if successful
      } else {
        response.json({ status: "success", message: "Retrieved timestamps for revisions by author " + reqAuthor + " to article " + reqTitle, data: result });

        next();
      }
    });
  },

  getListOfAuthors: async (request, response, next) => {
    await revisionModel.aggregate(
      [
        {
          $match: { $and: [{ anon: { $exists: false } }, { user: { $exists: true } }] }
        },
        {
          $group: {
            _id: "$user",
            user: {
              $sum: 1
            }
          }
        }
      ],
      function(error, result) {
        if (error) {
          response.json({ status: "error", message: "Didnt get stuff", data: null });

          next();
        } else {
          response.json({ status: "success", message: "got stuff", data: result });

          next();
        }
      }
    );
  }
};
