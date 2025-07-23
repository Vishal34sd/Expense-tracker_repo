import Transaction from "../model/transactionSchema.js";

const getAllTransaction = async (req, res) => {
  try {
    const allTransaction = await Transaction.find({userId: req.userInfo.userId});
    if (allTransaction && allTransaction.length > 0) {
      res.status(200).json({
        success: true,
        message: "All data fetched successfully",
        data: allTransaction
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No record found"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

const addTransaction = async (req, res) => {
  try {
    const { type, amount, category, note } = req.body;

    const newTransaction = new Transaction({
      userId: req.userInfo.userId ,
      type,
      amount,
      category,
      note
      
    });
    await newTransaction.save();
    console.log(newTransaction);

    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      data: newTransaction
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

const editTransaction = async (req, res)=>{
    try{
        const transactionId = req.params.id ;
        const newData  = req.body ;
         
        const updatedTransaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, userId: req.userInfo.userId },
      newData,
      { new: true }
    );
        if(!updatedTransaction){
          res.status(400).json({
            success : false ,
            message : "transaction not updated"
          })
        }
        res.status(200).json({
          success : true ,
          message : "Transaction updated successfully ",
          data : updatedTransaction
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            success : false,
            message : "Something went wrong"
        })
    }
}

const deleteTransaction =  async(req, res)=>{
  try{
    const transactionId = req.params.id ;
     const delTransaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: req.userInfo.userId,
    });
    if(!delTransaction){
      res.status(400).json({
        success : false ,
        message : "no record deleted "
      })
    }
    res.status(200).json({
      success : true ,
      message : "Transaction deleted successfully ",
      data : delTransaction
    })

  }
  catch(err){
    console.log(err);
    res.status(500).json({
      success : false ,
      message : "Something went  wrong "
    })
  }
}


const recentTransaction = async (req, res)=>{
  try{
   const recentTrans = await Transaction.find({ userId: req.userInfo.userId })
  .sort({ date: -1 })
  .limit(3);
    if(!recentTrans){
      res.status(400).json({
        success : false ,
        message : "Not found "
      })
    }
    return res.status(200).json({
      success : true ,
      message : "recent transaction fetched ",
      recent : recentTrans
    })
  }
  catch(err){
    console.log(err);
  }
}


export { getAllTransaction, addTransaction , editTransaction , deleteTransaction, recentTransaction};
