import Script from "next/script";

interface GoogleAnalyticsProps {
  measurementId?: string;
  gtmId?: string;
}

const GoogleAnalytics: React.FC<GoogleAnalyticsProps> = ({
  measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  gtmId = process.env.NEXT_PUBLIC_GTM_ID,
}) => {
  if (!measurementId && !gtmId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 4 */}
      {measurementId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', {
                page_title: document.title,
                page_location: window.location.href,
                custom_map: {
                  'custom_dimension1': 'user_type',
                  'custom_dimension2': 'service_category',
                  'custom_dimension3': 'location'
                }
              });
              
              // Track page views
              window.addEventListener('load', function() {
                gtag('event', 'page_view', {
                  page_title: document.title,
                  page_location: window.location.href,
                  page_referrer: document.referrer
                });
              });
              
              // Track user interactions
              document.addEventListener('click', function(e) {
                const target = e.target as HTMLElement;
                if (target.tagName === 'A' || target.tagName === 'BUTTON') {
                  const text = target.textContent?.trim();
                  const href = (target as HTMLAnchorElement).href;
                  
                  if (text && href) {
                    gtag('event', 'click', {
                      event_category: 'engagement',
                      event_label: text,
                      link_url: href
                    });
                  }
                }
              });
              
              // Track form submissions
              document.addEventListener('submit', function(e) {
                const form = e.target as HTMLFormElement;
                if (form) {
                  gtag('event', 'form_submit', {
                    event_category: 'engagement',
                    event_label: form.action || 'unknown_form',
                    form_id: form.id || 'unknown_id'
                  });
                }
              });
              
              // Track scroll depth
              let maxScroll = 0;
              window.addEventListener('scroll', function() {
                const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
                if (scrollPercent > maxScroll) {
                  maxScroll = scrollPercent;
                  if (maxScroll % 25 === 0) { // Track every 25%
                    gtag('event', 'scroll', {
                      event_category: 'engagement',
                      event_label: 'scroll_depth',
                      value: maxScroll
                    });
                  }
                }
              });
              
              // Track time on page
              let startTime = Date.now();
              window.addEventListener('beforeunload', function() {
                const timeOnPage = Math.round((Date.now() - startTime) / 1000);
                gtag('event', 'timing_complete', {
                  name: 'page_view',
                  value: timeOnPage,
                  event_category: 'engagement'
                });
              });
            `}
          </Script>
        </>
      )}

      {/* Google Tag Manager */}
      {gtmId && (
        <>
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      )}

      {/* Enhanced E-commerce Tracking */}
      <Script id="enhanced-ecommerce" strategy="afterInteractive">
        {`
          // Track service views
          function trackServiceView(serviceName, serviceCategory, servicePrice) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'view_item', {
                event_category: 'ecommerce',
                event_label: serviceName,
                items: [{
                  item_id: serviceName.toLowerCase().replace(/\\s+/g, '_'),
                  item_name: serviceName,
                  item_category: serviceCategory,
                  price: servicePrice,
                  currency: 'INR'
                }]
              });
            }
          }
          
          // Track service clicks
          function trackServiceClick(serviceName, serviceCategory) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'select_item', {
                event_category: 'ecommerce',
                event_label: serviceName,
                items: [{
                  item_id: serviceName.toLowerCase().replace(/\\s+/g, '_'),
                  item_name: serviceName,
                  item_category: serviceCategory
                }]
              });
            }
          }
          
          // Track inquiry submissions
          function trackInquiry(serviceName, serviceCategory) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'begin_checkout', {
                event_category: 'ecommerce',
                event_label: serviceName,
                items: [{
                  item_id: serviceName.toLowerCase().replace(/\\s+/g, '_'),
                  item_name: serviceName,
                  item_category: serviceCategory
                }]
              });
            }
          }
          
          // Track phone number clicks
          function trackPhoneClick(phoneNumber) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'click', {
                event_category: 'engagement',
                event_label: 'phone_click',
                value: phoneNumber
              });
            }
          }
          
          // Track email clicks
          function trackEmailClick(emailAddress) {
            if (typeof gtag !== 'undefined') {
              gtag('event', 'click', {
                event_category: 'engagement',
                event_label: 'email_click',
                value: emailAddress
              });
            }
          }
          
          // Make functions globally available
          window.trackServiceView = trackServiceView;
          window.trackServiceClick = trackServiceClick;
          window.trackInquiry = trackInquiry;
          window.trackPhoneClick = trackPhoneClick;
          window.trackEmailClick = trackEmailClick;
        `}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
