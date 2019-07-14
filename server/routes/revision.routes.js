const revisionController = require("../controllers/revision.controller");
const express = require("express");
const router = express.Router();

//OVERALL ANALYTICS

//fetches total number of revisions in the database
router.get("/", revisionController.countAll);
//fetches the top x articles with the highest number of revisions
router.get("/getHighestRevisionsWithValue", revisionController.getHighestRevisionsWithValue);
//fetches the top x articles with the fewest number of revisions
router.get("/getLowestRevisionsWithValue", revisionController.getLowestRevisionsWithValue);
//gets the article in the database with the most users contributing to its revisions
router.get("/getMostRegUsers", revisionController.getMostRegisteredUsers);
//gets the article in the database with the fewest users contributing to its revisions
router.get("/getLeastRegUsers", revisionController.getLeastRegisteredUsers);
//gets the x articles (x is a param) whose first revision in the database is the earliest of any other
router.get("/getOldestArticle", revisionController.getOldestArticle);
//gets the article whose first revision in the database is the latest of any other
router.get("/getYoungestArticle", revisionController.getYoungestArticle);
//breaks down how many revisions were done by each user type {admin, anon, bot, regular}
router.get("/getRevisionsByUserType", revisionController.getRevisionsByUserType);
//breaks down how many revisions were done by each user type for each given year
router.get("/getRevisionDistributionByYearUser", revisionController.getRevisionDistributionByYearUser);

//INDIVIDUAL ANALYTICS

//displays metrics for given article, including total no. of revisions associated with it,
//and the top 5 users in terms of revision contributions along with how many revisions they have contributed
router.get("/displaySummaryInfo", revisionController.displaySummaryInformation);
//breaks down how many revisions were done for specified article by each user type
router.get("/getArticleRevsByUserType", revisionController.getArticleRevisionsByUserType);
//breaks down how many revisions were done for specified article by each user type for each year
router.get("/getArticleRevsByUserTypeAndYear", revisionController.getArticleRevsByUserTypeAndYear);
//fetches number of revisions for specified article
router.get("/countTitle", revisionController.countTitle);
//fetches all the article titles featured in the revisions database
router.get("/uniqueTitles", revisionController.getUniqueTitles);
//fetches the latest revision for a given article
router.get("/latestRevision", revisionController.getLatestRevision);
//fetches the earliest revision for a given article
router.get("/oldestRevision", revisionController.getOldestRevision);

//AUTHOR ANALYTICS

//fetches all articles which given author has contributed to
router.get("/getArticlesByAuthor", revisionController.getArticlesByAuthor);
//fetches timestamps of revisions made to specified article by specified author
router.get("/trackArticleRevsByAuthor", revisionController.trackArticleRevisionsByAuthor);
//get list of authors
router.get("/getAllAuthors", revisionController.getListOfAuthors);

module.exports = router;
