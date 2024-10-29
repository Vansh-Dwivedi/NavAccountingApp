const FinancialInfo = require("../models/FinancialInfo");

exports.submitFinancialData = async (req, res) => {
  try {
    const { clientId } = req.params;
    const financialData = req.body;

    let financialInfo = await FinancialInfo.findOne({ clientId });

    if (!financialInfo) {
      financialInfo = new FinancialInfo({ clientId, ...financialData });
    } else {
      Object.assign(financialInfo, financialData);
    }

    await financialInfo.save();

    res.status(201).json({ message: "Financial data submitted successfully" });
  } catch (error) {
    console.error("Error submitting financial data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFinancialInfo = async (req, res) => {
  try {
    const { clientId } = req.params;
    const financialInfo = await FinancialInfo.findOne({ clientId });

    if (!financialInfo) {
      return res.status(404).json({ error: "Financial information not found" });
    }

    res.json(financialInfo);
  } catch (error) {
    console.error("Error fetching financial info:", error);
    res.status(500).json({ error: "Server error" });
  }
};
