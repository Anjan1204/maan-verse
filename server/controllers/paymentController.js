// @desc    Simulate and complete payment
// @route   POST /api/payment/complete
// @access  Private
const completePayment = async (req, res, next) => {
    try {
        const { courseId } = req.body;

        // In a real app, you'd verify payment with a gateway like Stripe here
        // For this flow, we simulate successful payment and proceed to enrollment logic

        res.status(200).json({
            success: true,
            message: 'Payment processed successfully',
            courseId
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { completePayment };
