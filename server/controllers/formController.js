const Form = require("../models/Form");
const FormSubmission = require("../models/FormSubmission");
const User = require("../models/User");
const { sendNotification } = require("../utils/notifications");
const Notification = require("../models/Notification");

exports.createDraft = async (req, res) => {
  try {
    const { title, fields, isCompulsory, deadline, category } = req.body;
    const form = new Form({
      title,
      fields,
      isCompulsory,
      deadline,
      category,
      createdBy: req.user.id,
      status: "draft",
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error("Error creating draft form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.saveForm = async (req, res) => {
  try {
    const { title, fields, isCompulsory, deadline, category } = req.body;
    const form = new Form({
      title,
      fields,
      isCompulsory,
      deadline,
      createdBy: req.user.id,
      status: "saved",
      category,
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    console.error("Error saving form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSavedForms = async (req, res) => {
  try {
    const forms = await Form.find({ status: "saved" });
    res.json(forms);
  } catch (error) {
    console.error("Error fetching saved forms:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.sendFormToUser = async (req, res) => {
  try {
    const { formId } = req.body;
    const userId = req.params.userId;
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new form submission with correct field names
    const formSubmission = new FormSubmission({
      formId: formId,
      userId: userId,
      status: "pending",
    });
    await formSubmission.save();

    const newNotification = new Notification({
      userId: userId,
      sender: req.user.id,
      message: `${req.user.username}`,
      senderProfilePic: req.user.profilePic || "default-profile-pic.jpg",
      createdAt: new Date(),
    });

    await newNotification.save();

    res.json({ message: "Form sent successfully" });
  } catch (error) {
    console.error("Error sending form to user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSentForms = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let forms;
    if (user.role === 'manager') {
      // For managers, get forms they've sent to their assigned clients
      forms = await Form.find({
        sender: userId,
        receiver: { $in: user.assignedClients }
      })
      .populate('receiver', 'username')
      .sort('-createdAt');
    } else {
      // For other roles, get forms they've sent
      forms = await Form.find({ sender: userId })
        .populate('receiver', 'username')
        .sort('-createdAt');
    }

    res.json(forms);
  } catch (error) {
    console.error("Error fetching sent forms:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    await FormSubmission.deleteMany({ form: req.params.id });
    await form.deleteOne();
    res.json({ message: "Form and its submissions deleted successfully" });
  } catch (error) {
    console.error("Error deleting form and its submissions:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUserForms = async (req, res) => {
  try {
    const formSubmissions = await FormSubmission.find({
      user: req.user.id,
      status: "pending",
    }).populate("form");
    const forms = formSubmissions.map((submission) => submission.form);
    res.json(forms);
  } catch (error) {
    console.error("Error fetching user forms:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.submitForm = async (req, res) => {
  try {
    const formSubmission = await FormSubmission.findOne({
      form: req.params.id,
      user: req.user.id,
      status: "pending",
    });
    if (!formSubmission) {
      return res.status(404).json({ error: "Form submission not found" });
    }

    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const responses = await Promise.all(
      form.fields.map(async (field) => {
        let value = req.body[field._id] || "";
        if (field.type === "file" && req.files && req.files[field._id]) {
          const file = req.files[field._id];
          const fileName = `${Date.now()}-${file.name}`;
          const uploadPath = path.join(__dirname, "..", "uploads", fileName);
          await file.mv(uploadPath);
          value = fileName;
        }
        return {
          fieldId: field._id,
          value: value,
        };
      })
    );

    formSubmission.responses = responses;
    formSubmission.status = "submitted";
    formSubmission.submittedAt = Date.now();

    await formSubmission.save();

    // Update the status in the Form model
    form.status = "submitted";
    await form.save();

    res.status(201).json(formSubmission);
  } catch (error) {
    console.error("Error submitting form:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

exports.getFormSubmissions = async (req, res) => {
  try {
    // Get the authenticated user's ID
    const userId = req.user.id;
    
    // Find the user to check their role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let submissions;
    if (user.role === 'manager') {
      // For managers, get submissions from their assigned clients
      submissions = await FormSubmission.find({
        user: { $in: user.assignedClients }
      })
      .populate('user', 'username')
      .sort('-createdAt');
    } else {
      // For other roles, get their own submissions
      submissions = await FormSubmission.find({ user: userId })
        .populate('user', 'username')
        .sort('-createdAt');
    }

    res.json(submissions);
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getFormPDF = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(form.pdf);
  } catch (error) {
    console.error("Error fetching form PDF:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (error) {
    console.error("Error fetching all forms:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    console.error("Error fetching form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAllFormSubmissions = async (req, res) => {
  try {
    const submissions = await FormSubmission.find()
      .populate("form")
      .populate("user", "username email")
      .sort("-submittedAt");
    res.json(submissions);
  } catch (error) {
    console.error("Error fetching all form submissions:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const submission = await FormSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    submission.status = "deleted";
    await submission.save();
    res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error("Error deleting submission:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.resendForm = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const submission = await FormSubmission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }
    submission.status = "raw";
    await submission.save();
    res.json({ message: "Form resent successfully" });
  } catch (error) {
    console.error("Error resending form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedForm = await Form.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(updatedForm);
  } catch (error) {
    console.error("Error updating form:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getAssignedForms = async (req, res) => {
  console.log("getAssignedForms function called");
  try {
    const userId = req.params.userId;
    console.log("User ID:", userId);
    
    const formSubmissions = await FormSubmission.find({ user: userId, status: 'pending' })
      .populate('form');
    console.log("Form submissions found:", formSubmissions.length);
    
    const validSubmissions = formSubmissions.filter(submission => submission.form !== null);
    console.log("Valid submissions:", validSubmissions.length);

    const forms = validSubmissions.map(submission => submission.form);
    console.log("Forms extracted:", forms.length);
    
    res.json(forms);
  } catch (error) {
    console.error("Error fetching assigned forms:", error);
    res.status(500).json({ error: "Server error" });
  }
};
