import mongoose from "mongoose";
import dotenv from "dotenv";
import transactionModel from "../model/transactionSchema.js";


dotenv.config();

const MONGO_URI = "mongodb://dubeyji8080:Vishal2525@ac-wnqat2d-shard-00-00.uai8kho.mongodb.net:27017,ac-wnqat2d-shard-00-01.uai8kho.mongodb.net:27017,ac-wnqat2d-shard-00-02.uai8kho.mongodb.net:27017/Expense-Tracker?ssl=true&replicaSet=atlas-ld7rxb-shard-0&authSource=admin&retryWrites=true&w=majority";

// Put an existing User _id in your .env
const USER_ID = "6a8e8527b5026e01202e1415";


const categories = {
    income: [
        "Salary",
        "Freelance",
        "Business",
        "Investment",
        "Gift",
        "Other Income"
    ],

    expense: [
        "Food",
        "Shopping",
        "Transport",
        "Rent",
        "Bills",
        "Entertainment",
        "Healthcare",
        "Education",
        "Travel",
        "Other"
    ]
};

const notes = [
    "Monthly transaction",
    "Regular payment",
    "Online payment",
    "Cash payment",
    "UPI payment",
    "Credit card payment",
    "Personal expense",
    "Daily expense",
    "Monthly income",
    "Other"
];

function randomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function randomAmount(type) {
    if (type === "income") {
        return Math.floor(Math.random() * 90000) + 10000;
    }

    return Math.floor(Math.random() * 10000) + 100;
}

function randomDate() {
    const now = new Date();

    // Random date within the last 365 days
    const daysAgo = Math.floor(Math.random() * 365);

    const date = new Date(now);

    date.setDate(date.getDate() - daysAgo);

    return date;
}

function generateTransaction() {

    // 30% income, 70% expense
    const type = Math.random() < 0.3
        ? "income"
        : "expense";

    return {
        userId: USER_ID,

        type: type,

        amount: randomAmount(type),

        category: randomItem(categories[type]),

        note: randomItem(notes),

        date: randomDate()
    };
}

async function seedTransactions() {

    try {

        // Connect MongoDB
        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected");

        // Generate 500 transactions
        const transactions = [];

        for (let i = 0; i < 500; i++) {
            transactions.push(generateTransaction());
        }

        // Insert transactions
        await transactionModel.insertMany(transactions);

        console.log("500 transactions inserted successfully!");

        // Statistics
        const incomeCount = transactions.filter(
            transaction => transaction.type === "income"
        ).length;

        const expenseCount = transactions.filter(
            transaction => transaction.type === "expense"
        ).length;

        console.log(`Income transactions: ${incomeCount}`);
        console.log(`Expense transactions: ${expenseCount}`);

        // Close connection
        await mongoose.connection.close();

        console.log("MongoDB connection closed");

    } catch (error) {

        console.error("Error inserting transactions:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
}

seedTransactions();