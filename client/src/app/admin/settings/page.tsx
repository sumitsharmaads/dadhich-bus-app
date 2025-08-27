"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  Alert,
  CircularProgress,
  IconButton,
  Select,
  MenuItem,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  EmailSettings,
  GeneralSettings,
  LogoSettings,
  SocialMediaSettings,
  BusinessSettings,
  BookingSettings,
  DomainsSettings,
  AnalyticsSettings,
  SEOSettings,
  RentalSettings,
  SystemSettings,
} from "@/components/admin/settings";
import { useWebsite } from "@/contexts/WebsiteProvider";
import { WebsiteInfoType } from "@/types";
import { settingsService } from "@/lib/api/services/settings.service";
import { successPopup, errorPopup } from "@/utils/errors/alerts";

type WebsiteSettings = Omit<WebsiteInfoType, "id">;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3, overflowX: "hidden" }}>{children}</Box>
      )}
    </div>
  );
}

const AdminSettings: React.FC = () => {
  const { websiteInfo, refreshWebsiteInfo } = useWebsite();
  const [settings, setSettings] = useState<WebsiteSettings>({
    branding: {
      brandName: "",
      tagline: "",
      logo: { url: "", id: "" },
      preLogo: { url: "", id: "" },
    },
    contact: {
      emails: { infoEmails: [], supportEmail: "" },
      phone: "",
      address: {
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "", // Added country field
        pincode: "",
      },
    },
    socials: {
      facebook: "",
      instagram: "",
      twitter: "",
      youtube: "",
      whatsapp: "",
      linkedin: "",
    },
    seo: {
      metaTitle: "",
      metaDescription: "",
      metaKeywords: [],
      ogImageUrl: "",
    },
    booking: {
      currencyCode: "INR",
      currencySymbol: "₹",
      taxPercent: 0,
      taxRegistration: "",
      cancellationPolicy: "",
      advancePaymentPercent: 0,
      allowGuestCheckout: true,
    },
    rental: {
      serviceCities: [],
      minRentalHours: 0,
      maxPassengersDefault: 0,
    },
    business: {
      companyName: "",
      registrationNumber: "",
      supportHours: "",
    },
    files: {
      brochureUrl: "",
    },
    domains: {
      primary: "",
      aliases: [],
    },
    analytics: {
      googleAnalyticsId: "",
      facebookPixelId: "",
    },
    flags: {
      isMaintenanceMode: false,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const info = useMemo(() => settings, [settings]);
  const fetched = useRef(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);

    // Scroll to the active tab to ensure it's visible
    setTimeout(() => {
      if (tabsRef.current) {
        const tabElement = tabsRef.current.querySelector(
          `[role="tab"][aria-selected="true"]`
        ) as HTMLElement;
        if (tabElement) {
          tabElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    }, 100);
  };

  const scrollTabs = (direction: "left" | "right") => {
    if (tabsRef.current) {
      const scrollAmount = 200; // Adjust scroll amount as needed
      const newScrollLeft =
        tabsRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);
      tabsRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  const checkScrollButtons = () => {
    if (tabsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const handleTabScroll = () => {
    checkScrollButtons();
  };

  const handleSaveChanges = useCallback(
    async (updated: Partial<WebsiteSettings>, type: string) => {
      try {
        let res;

        // Use the appropriate settings method based on type
        switch (type) {
          case "email":
            res = await settingsService.updateContactSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "logo":
            res = await settingsService.updateBrandingSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "general":
            res = await settingsService.updateGeneralSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "social links":
            res = await settingsService.updateContactSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "business":
            res = await settingsService.updateBusinessSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "booking":
            res = await settingsService.updateBookingSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "domains":
            res = await settingsService.updateDomainSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "analytics":
            res = await settingsService.updateAnalyticsSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "seo":
            res = await settingsService.updateSEOSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "rental":
            res = await settingsService.updateRentalSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          case "system":
            res = await settingsService.updateSystemSettings(
              websiteInfo?.id!,
              updated
            );
            break;
          default:
            res = await settingsService.updateWebsite(
              websiteInfo?.id!,
              updated
            );
        }

        if (res.success && res.data) {
          setSettings(res.data as any);
          successPopup("Settings saved successfully");
          await refreshWebsiteInfo();
        } else {
          errorPopup(res.message || "Failed to save settings");
        }
      } catch (e) {
        errorPopup("Failed to save settings");
      }
    },
    [websiteInfo?.id, refreshWebsiteInfo]
  );

  const getWebsiteInfo = async () => {
    setLoading(true);
    try {
      const res = await settingsService.getWebsiteSettings(websiteInfo?.id!);
      if (res.success && res.data) {
        setSettings(res.data as any);
      } else {
        errorPopup(res.message || "Failed to fetch settings");
      }
    } catch (e) {
      errorPopup("Failed to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (websiteInfo?.id && !fetched.current) {
      fetched.current = true;
      getWebsiteInfo();
    }
  }, [websiteInfo?.id, getWebsiteInfo]);

  useEffect(() => {
    // Check scroll buttons after component mounts and when tabs change
    const timer = setTimeout(checkScrollButtons, 100);
    return () => clearTimeout(timer);
  }, [activeTab]);

  useEffect(() => {
    // Add scroll event listener to tabs
    const tabsElement = tabsRef.current;
    if (tabsElement) {
      tabsElement.addEventListener("scroll", handleTabScroll);
      return () => tabsElement.removeEventListener("scroll", handleTabScroll);
    }
  }, []);

  useEffect(() => {
    // Check scroll buttons on window resize
    const handleResize = () => {
      setTimeout(checkScrollButtons, 100);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = [
    { label: "General", component: "general" },
    { label: "Branding", component: "branding" },
    { label: "Contact", component: "contact" },
    { label: "Business", component: "business" },
    { label: "Booking", component: "booking" },
    { label: "Rental", component: "rental" },
    { label: "SEO", component: "seo" },
    { label: "Analytics", component: "analytics" },
    { label: "Domains", component: "domains" },
    { label: "System", component: "system" },
  ];

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ overflowX: "hidden", maxWidth: "100%" }}
      className="admin-settings-page"
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Admin Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure all aspects of your website including branding, business
          details, booking settings, and more
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <div />
        <Button variant="outlined" onClick={getWebsiteInfo} disabled={loading}>
          {loading ? "Refreshing..." : "Refresh Settings"}
        </Button>
      </Box>

      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto">
        <Paper elevation={3} sx={{ mb: 3, overflowX: "hidden" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              borderBottom: 1,
              borderColor: "divider",
              flexWrap: "wrap", // Allow wrapping on very small screens
              gap: 1,
            }}
          >
            {/* Left Navigation Button - Hidden on very small screens */}
            <IconButton
              onClick={() => scrollTabs("left")}
              disabled={!canScrollLeft}
              sx={{
                mx: { xs: 0.5, sm: 1 },
                opacity: canScrollLeft ? 1 : 0.5,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
                display: { xs: "none", sm: "flex" }, // Hide on very small screens
              }}
              aria-label="Scroll tabs left"
            >
              <ChevronLeft />
            </IconButton>

            {/* Tabs Container */}
            <Box
              ref={tabsRef}
              sx={{
                flex: 1,
                overflowX: "auto",
                minWidth: 0, // Allow shrinking
                "&::-webkit-scrollbar": {
                  display: "none", // Hide scrollbar for cleaner look
                },
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE and Edge
              }}
            >
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons={false} // Disable default scroll buttons
                sx={{
                  minHeight: { xs: 40, sm: 48 }, // Smaller height on mobile
                  "& .MuiTabs-scroller": {
                    overflowX: "visible", // Allow our custom scrolling
                  },
                  "& .MuiTab-root": {
                    minWidth: { xs: "auto", sm: "auto" },
                    px: { xs: 1, sm: 2 }, // Smaller padding on mobile
                    whiteSpace: "nowrap",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font on mobile
                    minHeight: { xs: 40, sm: 48 }, // Match container height
                    maxWidth: { xs: "120px", sm: "none" }, // Limit width on mobile
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <Tab
                    key={index}
                    label={tab.label}
                    sx={{
                      // Responsive label handling
                      "& .MuiTab-label": {
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        lineHeight: { xs: 1.2, sm: 1.5 },
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>

            {/* Right Navigation Button - Hidden on very small screens */}
            <IconButton
              onClick={() => scrollTabs("right")}
              disabled={!canScrollRight}
              sx={{
                mx: { xs: 0.5, sm: 1 },
                opacity: canScrollRight ? 1 : 0.5,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
                display: { xs: "none", sm: "flex" }, // Hide on very small screens
              }}
              aria-label="Scroll tabs right"
            >
              <ChevronRight />
            </IconButton>

            {/* Mobile Dropdown for very small screens */}
            <Box sx={{ display: { xs: "block", sm: "none" }, ml: "auto" }}>
              <Select
                value={activeTab}
                onChange={(e) => setActiveTab(Number(e.target.value))}
                size="small"
                sx={{
                  minWidth: 120,
                  "& .MuiSelect-select": {
                    py: 1,
                    fontSize: "0.875rem",
                  },
                }}
              >
                {tabs.map((tab, index) => (
                  <MenuItem key={index} value={index}>
                    {tab.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>

          <TabPanel value={activeTab} index={0}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                General Information
              </Typography>
              <GeneralSettings
                settings={info as any}
                onSave={(data) => handleSaveChanges(data as any, "general")}
              />
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Logo & Branding
              </Typography>
              <LogoSettings
                settings={info as any}
                onSave={(data) => handleSaveChanges(data as any, "logo")}
              />
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={2}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Contact Information
              </Typography>
              <EmailSettings
                emails={info.contact.emails as any}
                onSave={(data) => handleSaveChanges(data as any, "email")}
              />
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2 }}>
                Social Media Links
              </Typography>
              <SocialMediaSettings
                socialLinks={info.socials as any}
                onSave={(data) =>
                  handleSaveChanges(data as any, "social links")
                }
              />
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={3}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Business Information
              </Typography>
              <BusinessSettings
                settings={info as any}
                onSave={(data) => handleSaveChanges(data as any, "business")}
              />
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={4}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Booking & Payment Settings
              </Typography>
              <BookingSettings
                settings={info as any}
                onSave={(data) => handleSaveChanges(data as any, "booking")}
              />
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={5}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Rental Service Settings
              </Typography>
              <RentalSettings
                settings={info as any}
                onSave={(data) => handleSaveChanges(data as any, "rental")}
              />
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={6}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                SEO Settings
              </Typography>
              <SEOSettings
                settings={info as any}
                onSave={(data) => handleSaveChanges(data as any, "seo")}
              />
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={7}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Analytics & Tracking
              </Typography>
              <AnalyticsSettings
                settings={info as any}
                onSave={(data) => handleSaveChanges(data as any, "analytics")}
              />
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={8}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Domain Configuration
              </Typography>
              <DomainsSettings
                settings={info as any}
                onSave={(data) => handleSaveChanges(data as any, "domains")}
              />
            </Paper>
          </TabPanel>

          <TabPanel value={activeTab} index={9}>
            <Paper sx={{ p: 3, mb: 3, overflowX: "hidden" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                System Configuration
              </Typography>
              <SystemSettings
                settings={info as any}
                onSave={(data) => handleSaveChanges(data as any, "system")}
              />
            </Paper>
          </TabPanel>
        </Paper>
      </div>
      <Alert severity="info" sx={{ mb: 2 }}>
        <strong>💡 Tip:</strong> Use the tabs above to navigate between
        different setting categories. Each section can be edited independently
        and saved separately.
      </Alert>
    </Container>
  );
};

export default AdminSettings;
