const mongoose = require('mongoose');
const FAQ = require('../models/faqs.model');

const sampleFAQs = {
  questions: [
    {
      question: "How do I book a bus for my tour?",
      answer: "You can book a bus by calling us directly at +91 9511547154 or by filling out our online booking form. Our team will get back to you within 24 hours with a customized quote."
    },
    {
      question: "What types of buses do you offer?",
      answer: "We offer a wide range of buses including luxury coaches, AC buses, non-AC buses, and mini buses. All our buses are well-maintained and equipped with modern amenities for your comfort."
    },
    {
      question: "Do you provide drivers with the buses?",
      answer: "Yes, all our buses come with experienced and licensed drivers. Our drivers are well-trained and familiar with the routes to ensure safe and comfortable journeys."
    },
    {
      question: "What is your cancellation policy?",
      answer: "We offer flexible cancellation policies. Cancellations made 48 hours before departure are fully refundable. For more details, please contact our customer support team."
    },
    {
      question: "Do you provide insurance for passengers?",
      answer: "Yes, all our buses are fully insured and we provide comprehensive passenger insurance coverage for your safety and peace of mind during the journey."
    }
  ]
};

async function seedFAQs() {
  try {
    // Connect to MongoDB (adjust connection string as needed)
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dadhich-bus-app');
    
    // Check if FAQs already exist
    const existingFAQs = await FAQ.findOne();
    if (existingFAQs) {
      console.log('FAQs already exist, skipping seed');
      return;
    }
    
    // Create new FAQ document
    const faq = new FAQ(sampleFAQs);
    await faq.save();
    
    console.log('FAQs seeded successfully!');
    console.log('Created FAQ document with ID:', faq._id);
    
  } catch (error) {
    console.error('Error seeding FAQs:', error);
  } finally {
    await mongoose.disconnect();
  }
}

// Run the seed function
seedFAQs();
