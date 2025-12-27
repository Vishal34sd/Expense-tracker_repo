import Question from "../model/questionSchema.js";

const showChat = async (req, res) => {
  try {
    const userId = req.userInfo.userId

    
    const questions = await Question.find({ userId }).sort({ date: -1 });

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this user.",
      });
    }

    const data = questions.map((q) => ({
      ...q.toObject(),
      reply: q.reply || q.answers || "",
    }));

    res.status(200).json({
      success: true,
      count: data.length,
      data,
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
