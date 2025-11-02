import Question from "../model/questionSchema.js";

const showChat = async (req, res) => {
  try {
    const userId = req.userInfo.userId

    
    const questions = await Question.find({ userId }).sort({ createdAt: -1 });

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      count: questions.length,
      data : questions,
    });
  } catch (err) {
    console.error("Error fetching user questions:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export {showChat};
