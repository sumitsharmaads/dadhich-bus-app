"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Typography,
  Button,
  Alert,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { faqsService } from "@/lib/api/services/faqs.service";
import { termsService } from "@/lib/api/services/terms.service";
import DOMPurify from "dompurify";

interface FAQItem {
  question: string;
  answer: string; // rich text HTML
}

// Helper function to get mock FAQs
const getMockFaqs = (): FAQItem[] => [
  {
    question: "How do I book a bus for my tour?",
    answer:
      "You can book a bus by calling us directly at +91 9812617300 or by filling out our online booking form. Our team will get back to you within 24 hours with a customized quote.",
  },
  {
    question: "What types of buses do you offer?",
    answer:
      "We offer a wide range of buses including luxury coaches, AC buses, non-AC buses, and mini buses. All our buses are well-maintained and equipped with modern amenities for your comfort.",
  },
  {
    question: "Do you provide drivers with the buses?",
    answer:
      "Yes, all our buses come with experienced and licensed drivers. Our drivers are well-trained and familiar with the routes to ensure safe and comfortable journeys.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "We offer flexible cancellation policies. Cancellations made 48 hours before departure are fully refundable. For more details, please contact our customer support team.",
  },
  {
    question: "Do you provide insurance for passengers?",
    answer:
      "Yes, all our buses are fully insured and we provide comprehensive passenger insurance coverage for your safety and peace of mind during the journey.",
  },
];

const FaqAndTerms: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [terms, setTerms] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | false>(0);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string>("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [faqRes, termsRes] = await Promise.all([
        faqsService.getCurrentFAQs(),
        termsService.getCurrentTerms(),
      ]);

      if (faqRes?.success && faqRes?.data?.questions) {
        setFaqs(faqRes.data.questions);
      } else if (faqRes?.success && faqRes?.data === null) {
        // No FAQs exist, try to initialize with defaults
        try {
          const initRes = await faqsService.initializeFAQs();
          if (initRes?.success && initRes?.data?.questions) {
            setFaqs(initRes.data.questions);
          } else {
            // Fallback to mock data
            setFaqs(getMockFaqs());
          }
        } catch (initError) {
          setFaqs(getMockFaqs());
        }
      } else {
        // Fallback to mock data if API fails
        setFaqs(getMockFaqs());
      }

      if (termsRes?.success && termsRes?.data?.text) {
        setTerms(termsRes.data.text);
      } else {
        setTerms("Terms and conditions will be displayed here...");
      }
    } catch (error) {
      setError("Failed to load FAQs and Terms. Please try again later.");

      // Fallback to mock data if API fails
      setFaqs(getMockFaqs());
      setTerms("Terms and conditions will be displayed here...");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const displayedFaqs = useMemo(() => {
    return showAll ? faqs : faqs.slice(0, 3);
  }, [faqs, showAll]);

  const handleAccordionChange = useCallback((index: number) => {
    setExpandedIndex((prev) => (prev === index ? false : index));
  }, []);

  const handleInitializeFAQs = useCallback(async () => {
    try {
      setLoading(true);
      const initRes = await faqsService.initializeFAQs();
      if (initRes?.success && initRes?.data?.questions) {
        setFaqs(initRes.data.questions);
        setError("");
      } else {
        setError("Failed to initialize FAQs");
      }
    } catch (error) {
      setError("Failed to initialize FAQs");
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl mt-20 px-4">
      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          className="mb-6"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleInitializeFAQs}
              disabled={loading}
            >
              Initialize FAQs
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* FAQ Section */}
      <div className="mb-12" id="faq-section">
        <h2 className="text-3xl font-semibold text-text-primary mb-8 font-primary">
          Frequently Asked Questions
        </h2>

        <div className="rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          {displayedFaqs.length > 0 ? (
            displayedFaqs.map((faq, index) => (
              <Accordion
                key={index}
                expanded={expandedIndex === index}
                onChange={() => handleAccordionChange(index)}
                disableGutters
                sx={{
                  backgroundColor: "var(--color-surface-primary)",
                  "&:hover": {
                    backgroundColor: "var(--color-neutral-50)",
                  },
                  transition: "all 0.3s ease",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  borderRadius: "0.5rem",
                  margin: "0.25rem",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    backgroundColor: "var(--color-surface-primary)",
                    "&:hover": {
                      backgroundColor: "var(--color-neutral-50)",
                    },
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 600,
                      color: "var(--color-text-primary)",
                      fontSize: "1rem",
                    }}
                  >
                    Q. {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails
                  sx={{
                    backgroundColor: "var(--color-neutral-50)",
                    color: "var(--color-text-secondary)",
                    fontSize: "0.875rem",
                  }}
                >
                  <Typography
                    component="div"
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(faq.answer),
                    }}
                  />
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <div className="text-center py-8">
              <Typography
                variant="body1"
                color="text.secondary"
                className="mb-4"
              >
                No FAQs available
              </Typography>
              <Button
                variant="contained"
                onClick={handleInitializeFAQs}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Initializing..." : "Initialize Default FAQs"}
              </Button>
            </div>
          )}
        </div>

        {faqs.length > 3 && displayedFaqs.length > 0 && (
          <div className="text-center mt-6">
            <Button
              variant="outlined"
              onClick={() => setShowAll(!showAll)}
              sx={{
                borderColor: "var(--color-primary-500)",
                color: "var(--color-primary-500)",
                "&:hover": {
                  borderColor: "var(--color-primary-600)",
                  backgroundColor: "var(--color-primary-50)",
                },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: "50px",
                px: 3,
                py: 1,
              }}
            >
              {showAll ? "Show Less" : "Show More FAQs"}
            </Button>
          </div>
        )}
      </div>

      {/* Terms Section */}
      {terms && (
        <div className="mt-12" id="term-condition">
          <h2 className="text-3xl font-semibold text-text-primary mb-8 font-primary">
            Terms & Conditions
          </h2>
          <div
            className="bg-neutral-100 p-6 rounded-xl shadow-md text-text-secondary leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(terms),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FaqAndTerms;
