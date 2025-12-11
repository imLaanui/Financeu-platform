const { getUserProgress, markLessonComplete } = require('../models/lessonModel');

async function getProgress(req, res) { /* logic from server.js */ }
async function completeLesson(req, res) { /* logic from server.js */ }
async function getLessons(req, res) { /* logic from server.js */ }

module.exports = { getProgress, completeLesson, getLessons };
