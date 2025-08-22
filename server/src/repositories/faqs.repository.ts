import mongoose from 'mongoose';
import { FAQ, FAQDocument } from '../models/faqs.model';

class FAQRepository {
  async list(): Promise<FAQDocument[]> {
    return await FAQ.find().sort({ createdAt: -1 });
  }

  async getById(id: string): Promise<FAQDocument | null> {
    try {
      // Validate that the id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return await FAQ.findById(id);
    } catch (error) {
      console.error('Error getting FAQ by ID:', error);
      return null;
    }
  }

  async getCurrent(): Promise<FAQDocument | null> {
    try {
      // Get the most recent FAQ document
      const current = await FAQ.findOne().sort({ createdAt: -1 });
      console.log(
        'Current FAQ found:',
        current ? `ID: ${current._id}, Questions: ${current.questions?.length || 0}` : 'None',
      );
      return current;
    } catch (error) {
      console.error('Error getting current FAQ:', error);
      return null;
    }
  }

  async getCount(): Promise<number> {
    try {
      return await FAQ.countDocuments();
    } catch (error) {
      console.error('Error getting FAQ count:', error);
      return 0;
    }
  }

  async cleanupCorruptedFAQs(): Promise<void> {
    try {
      console.log('Checking for corrupted FAQ documents...');
      const allFAQs = await FAQ.find({});
      let corruptedCount = 0;

      for (const faq of allFAQs) {
        if (!faq._id || !mongoose.Types.ObjectId.isValid(faq._id.toString())) {
          console.log('Found corrupted FAQ document, removing:', faq._id);
          await FAQ.findByIdAndDelete(faq._id);
          corruptedCount++;
        }
      }

      if (corruptedCount > 0) {
        console.log(`Cleaned up ${corruptedCount} corrupted FAQ documents`);
      } else {
        console.log('No corrupted FAQ documents found');
      }
    } catch (error) {
      console.error('Error cleaning up corrupted FAQs:', error);
    }
  }

  async initializeWithDefaults(): Promise<FAQDocument> {
    try {
      const count = await this.getCount();
      if (count === 0) {
        // Create default FAQs
        const defaultFAQs = {
          questions: [
            {
              question: 'How do I book a bus for my tour?',
              answer:
                'You can book a bus by calling us directly at +91 9511547154 or by filling out our online booking form. Our team will get back to you within 24 hours with a customized quote.',
            },
            {
              question: 'What types of buses do you offer?',
              answer:
                'We offer a wide range of buses including luxury coaches, AC buses, non-AC buses, and mini buses. All our buses are well-maintained and equipped with modern amenities for your comfort.',
            },
            {
              question: 'Do you provide drivers with the buses?',
              answer:
                'Yes, all our buses come with experienced and licensed drivers. Our drivers are well-trained and familiar with the routes to ensure safe and comfortable journeys.',
            },
            {
              question: 'What is your cancellation policy?',
              answer:
                'We offer flexible cancellation policies. Cancellations made 48 hours before departure are fully refundable. For more details, please contact our customer support team.',
            },
            {
              question: 'Do you provide insurance for passengers?',
              answer:
                'Yes, all our buses are fully insured and we provide comprehensive passenger insurance coverage for your safety and peace of mind during the journey.',
            },
          ],
        };
        return await this.create(defaultFAQs);
      } else {
        // Return existing FAQ
        const existing = await this.getCurrent();
        if (existing) {
          return existing;
        } else {
          throw new Error('Failed to get existing FAQ');
        }
      }
    } catch (error) {
      console.error('Error initializing FAQs with defaults:', error);
      throw error;
    }
  }

  async create(data: Partial<FAQDocument>): Promise<FAQDocument> {
    const faq = new FAQ(data);
    return await faq.save();
  }

  async update(id: string, data: Partial<FAQDocument>): Promise<FAQDocument | null> {
    try {
      // Validate that the id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid FAQ ID format');
      }
      return await FAQ.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error;
    }
  }

  async updateCurrent(data: Partial<FAQDocument>): Promise<FAQDocument | null> {
    try {
      console.log('updateCurrent called with data:', {
        questionsCount: data.questions?.length || 0,
      });

      // Update the most recent FAQ document or create a new one
      const current = await this.getCurrent();
      console.log(
        'Current FAQ document:',
        current ? `ID: ${current._id}, Type: ${typeof current._id}` : 'None',
      );

      if (current && current._id) {
        try {
          // Convert ObjectId to string for findByIdAndUpdate
          const currentId = current._id.toString();
          console.log('Converted ID to string:', currentId);

          // Validate that the id is a valid ObjectId string
          if (!mongoose.Types.ObjectId.isValid(currentId)) {
            console.log('Invalid ObjectId format, creating new FAQ document');
            return await this.create(data);
          }

          console.log('Attempting to update FAQ with ID:', currentId);
          // Ensure the _id is a valid ObjectId string
          const updated = await FAQ.findByIdAndUpdate(currentId, data, {
            new: true,
            runValidators: true,
          });

          if (updated) {
            console.log('FAQ updated successfully');
            return updated;
          } else {
            // If update failed, create a new one
            console.log('Update failed, creating new FAQ document');
            return await this.create(data);
          }
        } catch (updateError) {
          console.error('Error during update attempt:', updateError);
          console.log('Update failed, creating new FAQ document');
          return await this.create(data);
        }
      } else {
        // No existing FAQ document, create a new one
        console.log('No existing FAQ document, creating new one');
        return await this.create(data);
      }
    } catch (error) {
      console.error('Error updating current FAQs:', error);
      // If update fails, try to create a new one
      console.log('Update failed due to error, creating new FAQ document');
      return await this.create(data);
    }
  }

  async remove(id: string): Promise<void> {
    try {
      // Validate that the id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error('Invalid FAQ ID format');
      }
      await FAQ.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error removing FAQ:', error);
      throw error;
    }
  }
}

export const faqsRepository = new FAQRepository();
