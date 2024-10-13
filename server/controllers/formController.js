const Form = require("../models/Form");
const FormSubmission = require("../models/FormSubmission");
const User = require("../models/User");
const { sendNotification } = require("../utils/notifications");

exports.createDraft = async (req, res) => {
  try {
    const { title, fields, isCompulsory, deadline } = req.body;
    const form = new Form({
      title,
      fields,
      isCompulsory,
      deadline,
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



exports.getDrafts = async (req, res) => {
  try {
    const drafts = await Form.find({ createdBy: req.user.id, status: "draft" });
    res.json(drafts);
  } catch (error) {
    console.error("Error fetching draft forms:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateDraft = async (req, res) => {
  try {
    const { title, fields, isCompulsory, deadline } = req.body;
    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id, status: "draft" },
      { title, fields, isCompulsory, deadline },
      { new: true }
    );
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    console.error("Error updating draft form:", error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.sendForm = async (req, res) => {
  try {
    const { id, recipients } = req.body;

    // Check if id is provided and valid
    if (!id || typeof id !== 'string' || id.length !== 24) {
      return res.status(400).json({ error: 'Invalid form ID provided' });
    }

    const form = await Form.findOneAndUpdate(
      { _id: id, createdBy: req.user.id, status: 'draft' },
      { status: 'sent', recipients },
      { new: true }
    );

    if (!form) {
      return res.status(404).json({ error: 'Form not found or not in draft status' });
    }

    // Send notifications to recipients
    for (const recipientId of recipients) {
      const recipient = await User.findById(recipientId);
      if (recipient) {
        await sendNotification(
          recipientId,
          'New Form',
          `You have a new form to complete: ${form.title}`,
          req.user.id,
          req.user.profilePic,
          { formId: form._id }
        );
      }
    }

    res.json(form);
  } catch (error) {
    console.error('Error sending form:', error);
    if (error.name === 'CastError') {
      res.status(400).json({ error: 'Invalid form ID format' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
};


exports.getUserForms = async (req, res) => {
  try {
    const forms = await Form.find({ recipients: req.user.id, status: "sent" });
    res.json(forms);
  } catch (error) {
    console.error("Error fetching user forms:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.submitForm = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const responses = form.fields.map(field => ({
      fieldId: field._id,
      value: req.body[field._id] || '',
    }));


    const submission = new FormSubmission({
      form: form._id,
      user: req.user.id,
      responses: responses
    });

    await submission.save();
    res.status(201).json(submission);
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};


exports.getFormSubmissions = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id).lean();
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const submissions = await FormSubmission.find({ form: req.params.id })
      .populate('user', 'username email profilePic')
      .select('user responses submittedAt')
      .lean();

    // Create a map of field IDs to their labels
    const fieldMap = form.fields.reduce((acc, field) => {
      acc[field._id.toString()] = field.label;
      return acc;
    }, {});

    // Add field labels to each submission
    const submissionsWithLabels = submissions.map(submission => ({
      ...submission,
      responses: submission.responses.map(response => ({
        ...response,
        fieldLabel: fieldMap[response.fieldId.toString()] || 'Unknown Field'
      }))
    }));

    res.json(submissionsWithLabels);
  } catch (error) {
    console.error('Error fetching form submissions:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getAllForms = async (req, res) => {
  try {
    const forms = await Form.find({ status: { $ne: 'deleted' } });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFormById = async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteForm = async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, { status: 'deleted' }, { new: true });
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendFormToClient = async (req, res) => {
  try {
    const { formId, clientId } = req.body;
    const form = await Form.findByIdAndUpdate(
      formId,
      { $addToSet: { recipients: clientId } },
      { new: true }
    );
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json({ message: 'Form sent to client successfully', form });
  } catch (error) {
    res.status(500).json({ error: error.message });
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