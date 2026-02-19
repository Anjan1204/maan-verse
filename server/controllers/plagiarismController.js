const Submission = require('../models/Submission');
const stringSimilarity = require('string-similarity');

// @desc    Check plagiarism for a submission
// @route   GET /api/plagiarism/check/:submissionId
// @access  Private (Faculty/Admin)
const checkPlagiarism = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const targetSubmission = await Submission.findById(submissionId).populate('student', 'name email');

        if (!targetSubmission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        if (!targetSubmission.content || targetSubmission.content.trim().length < 10) {
            return res.json({
                similarity: 0,
                highestMatch: null,
                message: 'Content too short for analysis.'
            });
        }

        // Fetch all other submissions for the same assignment
        const otherSubmissions = await Submission.find({
            assignment: targetSubmission.assignment,
            _id: { $ne: submissionId } // Exclude current submission
        }).populate('student', 'name');

        if (otherSubmissions.length === 0) {
            return res.json({
                similarity: 0,
                highestMatch: null,
                message: 'No other submissions to compare against.'
            });
        }

        let highestSimilarity = 0;
        let mostSimilarStudent = null;

        // Perform comparison
        otherSubmissions.forEach(sub => {
            if (sub.content && sub.content.trim().length > 10) {
                const similarity = stringSimilarity.compareTwoStrings(targetSubmission.content, sub.content);
                if (similarity > highestSimilarity) {
                    highestSimilarity = similarity;
                    mostSimilarStudent = sub.student.name;
                }
            }
        });

        res.json({
            similarity: highestSimilarity,
            highestMatch: mostSimilarStudent,
            message: highestSimilarity > 0.3
                ? `Plagiarism Warning: Matches ${Math.round(highestSimilarity * 100)}% with ${mostSimilarStudent}`
                : 'Content appears original.'
        });

    } catch (error) {
        console.error("Plagiarism Check Error:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { checkPlagiarism };
