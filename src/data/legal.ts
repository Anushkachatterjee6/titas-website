/**
 * Legal page content.
 *
 * Transcribed directly from the client-approved "privacy pages" document.
 * Wording is preserved as supplied — do not rewrite into generic legal
 * boilerplate. The "[Insert Date]" placeholders are kept as-is until an
 * actual effective date is provided.
 */

export type LegalSection = {
  heading: string;
  /** Paragraph(s) that introduce or follow the bullet list, if any. */
  lead?: string;
  bullets?: string[];
  /** Paragraph(s) after the bullets, or the section's only content. */
  paragraphs?: string[];
};

export type LegalSlug = "privacy-policy" | "terms" | "shipping-delivery" | "cancellation-refund";

export type LegalDoc = {
  slug: LegalSlug;
  navLabel: string;
  pageTitle: string;
  effectiveDateLines: string[];
  intro?: string[];
  sections: LegalSection[];
};

export const legalDocs: LegalDoc[] = [
  {
    slug: "privacy-policy",
    navLabel: "Privacy Policy",
    pageTitle: "Privacy Policy",
    effectiveDateLines: ["Effective Date: [Insert Date]", "Last Updated: [Insert Date]"],
    intro: [
      "SUJIT AQUA ENTERPRISE, operating under the brand name TiTAS — Ekti Jaler Naam, respects your privacy and is committed to protecting the information you provide while using our website, placing orders, making enquiries, or communicating with us.",
      "This Privacy Policy explains what information we may collect, how we use it, and how we protect it.",
    ],
    sections: [
      {
        heading: "1. Information We Collect",
        lead: "Depending on how you use our website, we may collect:",
        bullets: [
          "Name",
          "Mobile number",
          "WhatsApp number",
          "Email address",
          "Billing and delivery address",
          "PIN code and delivery location",
          "Order details",
          "Payment-related transaction/reference information",
          "Enquiry details",
          "Information you voluntarily provide through contact or enquiry forms",
        ],
        paragraphs: [
          "We do not need or intend to collect your complete card, UPI PIN, banking password, or other sensitive payment credentials through our website.",
        ],
      },
      {
        heading: "2. How We Use Your Information",
        lead: "We may use information provided by you to:",
        bullets: [
          "Process and fulfil orders",
          "Confirm deliveries",
          "Respond to enquiries",
          "Communicate regarding your order",
          "Process cancellations, replacements or refunds",
          "Provide customer support",
          "Verify transactions",
          "Improve our website and services",
          "Maintain records required for business and legal purposes",
        ],
      },
      {
        heading: "3. Online Payments",
        paragraphs: [
          "Online payments may be processed through a third-party payment gateway such as Razorpay, subject to successful merchant setup and approval.",
          "Payment processing may therefore be subject to the privacy policy and terms of the relevant payment service provider.",
        ],
      },
      {
        heading: "4. Cookies and Website Technologies",
        paragraphs: [
          "Our website may use cookies or similar technologies for essential website functionality, analytics, performance measurement and improving user experience.",
          "Where applicable, analytics and website measurement tools may collect information such as browser type, device information, pages visited and general usage patterns.",
        ],
      },
      {
        heading: "5. Sharing of Information",
        lead: "We may share relevant information where necessary with:",
        bullets: [
          "Payment service providers",
          "Delivery/logistics partners",
          "Technology and website service providers",
          "Service providers assisting us in operating the website",
          "Government, regulatory or law-enforcement authorities where required by applicable law",
        ],
        paragraphs: ["We do not intend to sell customers' personal information."],
      },
      {
        heading: "6. Data Security",
        paragraphs: [
          "We take reasonable measures to protect information against unauthorised access, misuse, alteration or disclosure.",
          "However, no internet-based transmission or electronic storage system can be guaranteed to be completely secure.",
        ],
      },
      {
        heading: "7. Data Retention",
        paragraphs: [
          "We may retain information for as long as reasonably necessary for order fulfilment, customer support, business records, dispute resolution, accounting, legal or regulatory requirements.",
        ],
      },
      {
        heading: "8. Third-Party Services",
        paragraphs: [
          "Our website may contain or use third-party services, payment gateways, maps, analytics tools or other integrations. Their handling of information may be governed by their own policies.",
        ],
      },
      {
        heading: "9. Your Choices",
        paragraphs: [
          "You may contact us regarding information you have provided to us or to request assistance regarding your personal information, subject to applicable legal and operational requirements.",
        ],
      },
    ],
  },
  {
    slug: "terms",
    navLabel: "Terms & Conditions",
    pageTitle: "Terms & Conditions",
    effectiveDateLines: ["Effective Date: [Insert Date]"],
    intro: [
      "Welcome to the TiTAS website, operated by SUJIT AQUA ENTERPRISE.",
      "By accessing this website, submitting an enquiry, placing an order or using our services, you agree to these Terms & Conditions.",
    ],
    sections: [
      {
        heading: "1. About TiTAS",
        paragraphs: [
          "TiTAS is the packaged drinking water brand operated by SUJIT AQUA ENTERPRISE and has been serving since 1999.",
          "The website provides information about TiTAS products, services, ordering and customer enquiries.",
        ],
      },
      {
        heading: "2. Products",
        lead: "TiTAS currently offers the following pack sizes:",
        bullets: ["500 ml", "1 L", "2 L", "5 L", "20 L"],
        paragraphs: [
          "Product availability, pricing and applicable delivery charges may vary.",
          "Online prices should only be considered final after the company confirms the applicable price at the time of order.",
        ],
      },
      {
        heading: "3. Orders",
        paragraphs: [
          "Orders may be placed through available website ordering facilities or other authorised TiTAS ordering channels.",
          "An order is subject to product availability, delivery feasibility and successful confirmation.",
          "For bulk, commercial, institutional, dealer or distributor requirements, separate terms may apply depending on quantity, destination and order requirements.",
        ],
      },
      {
        heading: "4. Pricing",
        paragraphs: [
          "Product prices displayed on the website may be updated by TiTAS from time to time.",
          "Where a product is marked “Price on request”, customers should contact TiTAS for the applicable price.",
        ],
      },
      {
        heading: "5. Delivery",
        paragraphs: [
          "Delivery availability depends on location, quantity and order size.",
          "TiTAS may provide delivery within applicable service areas, potentially extending up to approximately 200 km depending on location and order requirements.",
          "Delivery charges may apply.",
        ],
      },
      {
        heading: "6. Bulk Orders",
        paragraphs: [
          "Bulk and commercial orders may be subject to minimum quantities and separate delivery/commercial terms.",
          "The currently proposed minimum bulk order is approximately 100 cases, subject to pack size, location and applicable terms.",
        ],
      },
      {
        heading: "7. Payments",
        lead: "Online payments may be processed through the selected payment gateway. Available payment methods may include:",
        bullets: [
          "UPI",
          "Credit/debit cards",
          "Net banking",
          "Supported wallets",
          "Payment links",
          "Bank transfer for eligible business/bulk orders",
          "COD where available",
        ],
      },
      {
        heading: "8. Order Confirmation",
        paragraphs: [
          "Successful payment does not necessarily guarantee fulfilment if the order cannot be delivered because of product availability, delivery limitations or other operational circumstances.",
          "Where an order cannot be fulfilled, TiTAS may offer an alternative arrangement or applicable refund.",
        ],
      },
      {
        heading: "9. Cancellation & Refunds",
        paragraphs: [
          "Cancellations and refunds are governed by the Cancellation & Refund Policy published on this website.",
        ],
      },
      {
        heading: "10. Product Issues",
        paragraphs: [
          "Customers should contact TiTAS if they receive a product that is damaged, leaking, incorrect in quantity/pack size or materially different from the confirmed order.",
        ],
      },
      {
        heading: "11. Website Content",
        paragraphs: [
          "TiTAS makes reasonable efforts to keep website information accurate and current. Product images may be representative and packaging/design may change.",
        ],
      },
      {
        heading: "12. Intellectual Property",
        paragraphs: [
          "The TiTAS name, logo, branding, photographs, graphics, website design and other original content belong to or are used by SUJIT AQUA ENTERPRISE and may not be reproduced without appropriate permission.",
        ],
      },
      {
        heading: "13. Changes",
        paragraphs: [
          "TiTAS may update products, services, prices, delivery terms or website content from time to time.",
        ],
      },
      {
        heading: "14. Applicable Law",
        paragraphs: ["These Terms shall be subject to the applicable laws and regulations of India."],
      },
    ],
  },
  {
    slug: "shipping-delivery",
    navLabel: "Shipping & Delivery",
    pageTitle: "Shipping & Delivery Policy",
    effectiveDateLines: ["Effective Date: [Insert Date]"],
    intro: [
      "TiTAS provides packaged drinking water delivery based on product availability, customer location and order requirements.",
    ],
    sections: [
      {
        heading: "1. Delivery Areas",
        paragraphs: [
          "TiTAS accepts delivery requests within applicable service areas.",
          "Delivery may be available up to approximately 200 km, depending on the destination, order quantity and operational feasibility.",
          "Customers should confirm delivery availability before placing large or bulk orders.",
        ],
      },
      {
        heading: "2. Delivery Charges",
        lead: "Delivery charges depend on:",
        bullets: [
          "Delivery location",
          "Order quantity",
          "Pack size",
          "Order type",
          "Distance",
          "Applicable commercial/bulk terms",
        ],
        paragraphs: [
          "Eligible orders within 10 km may qualify for free delivery subject to applicable conditions.",
        ],
      },
      {
        heading: "3. Bulk Orders",
        paragraphs: [
          "Bulk orders may have different delivery arrangements and charges.",
          "The proposed minimum bulk order is approximately 100 cases, subject to location, pack size and applicable terms.",
        ],
      },
      {
        heading: "4. Delivery Time",
        lead: "Delivery timing may vary depending on:",
        bullets: [
          "Product availability",
          "Order quantity",
          "Delivery location",
          "Traffic and road conditions",
          "Operational constraints",
          "Bulk/commercial requirements",
        ],
        paragraphs: [
          "A delivery estimate provided during ordering should be treated as an expected timeframe rather than an absolute guarantee.",
        ],
      },
      {
        heading: "5. Delivery Address",
        paragraphs: [
          "Customers are responsible for providing an accurate delivery address and reachable contact number.",
          "If delivery cannot be completed because the provided address or contact information is incorrect or the recipient is unavailable, additional arrangements or charges may apply.",
        ],
      },
      {
        heading: "6. Damaged or Leaking Products",
        paragraphs: [
          "If a product arrives damaged, leaking, incorrectly supplied or materially different from the confirmed order, please contact TiTAS as soon as reasonably possible.",
          "Customers may be requested to provide photographs/videos and order details for verification.",
        ],
      },
      {
        heading: "7. Failed Delivery",
        paragraphs: [
          "If TiTAS is unable to fulfil an order due to product unavailability, delivery limitations or another issue on the company's side, TiTAS may offer an alternative delivery arrangement or applicable refund for a prepaid order.",
        ],
      },
      {
        heading: "8. Bulk & Commercial Delivery",
        paragraphs: [
          "Bulk, institutional, dealer, distributor and commercial orders may have separate delivery and transportation terms agreed during order confirmation.",
        ],
      },
    ],
  },
  {
    slug: "cancellation-refund",
    navLabel: "Cancellation & Refund",
    pageTitle: "Cancellation & Refund Policy",
    effectiveDateLines: ["Effective Date: [Insert Date]"],
    intro: [
      "At TiTAS, customer satisfaction is important to us. We aim to maintain a transparent and fair cancellation and refund process for orders placed through our website or other authorised ordering channels.",
    ],
    sections: [
      {
        heading: "1. Order Cancellation",
        paragraphs: [
          "Customers may request cancellation before an order has been dispatched.",
          "If an eligible prepaid order is cancelled before dispatch, a full refund of the eligible order amount will be initiated through the original payment method.",
          "Once an order has been dispatched or is out for delivery, cancellation may not normally be accepted.",
          "Bulk, institutional, dealer or distributor orders that have already been prepared, loaded or dispatched may be subject to separate applicable terms.",
        ],
      },
      {
        heading: "2. Damaged, Leaking or Incorrect Products",
        lead: "If you receive a product that is:",
        bullets: [
          "Damaged during delivery",
          "Leaking",
          "Incorrect in pack size or quantity",
          "Materially different from the confirmed order",
        ],
        paragraphs: [
          "please contact TiTAS customer support as soon as reasonably possible after delivery.",
          "You may be requested to provide your Order ID, photographs/videos of the affected product and packaging, and other relevant information.",
          "After verification, TiTAS may provide an appropriate replacement or refund depending on the circumstances.",
        ],
      },
      {
        heading: "3. Returns After Delivery",
        paragraphs: [
          "For safety, hygiene and product-integrity reasons, packaged drinking water correctly supplied and delivered in acceptable condition is generally not returnable merely because of a change of mind.",
          "This does not affect cases involving damaged, leaking, incorrect or otherwise eligible products or any rights available under applicable law.",
        ],
      },
      {
        heading: "4. Failed or Undelivered Orders",
        paragraphs: [
          "If TiTAS cannot fulfil an order because of product unavailability, delivery limitations or another issue on our side, the customer may be offered an alternative delivery arrangement or a refund for an affected prepaid order.",
        ],
      },
      {
        heading: "5. Online Payment Issues",
        paragraphs: [
          "If payment is deducted but the order is not successfully confirmed, contact TiTAS with the payment reference/transaction ID and relevant order details.",
          "After verification, any eligible duplicate or unsuccessful-order payment will be refunded or reversed as applicable.",
        ],
      },
      {
        heading: "6. Refund Processing",
        paragraphs: [
          "Approved online-payment refunds will normally be initiated through the original payment method.",
          "The time taken for the refund to appear may depend on the payment gateway, bank or payment service provider.",
        ],
      },
      {
        heading: "7. Delivery Charges",
        paragraphs: [
          "Where cancellation is approved before dispatch, applicable delivery charges collected for that undelivered order will also be refunded.",
          "If an order has already been dispatched or a delivery attempt has been made, delivery or transportation charges may be non-refundable where applicable.",
        ],
      },
      {
        heading: "8. Bulk, Dealer & Institutional Orders",
        paragraphs: [
          "Bulk, dealer, distributor, commercial and institutional orders may have separate cancellation, transportation, advance-payment and refund terms depending on quantity, destination and agreed commercial terms.",
        ],
      },
      {
        heading: "9. How to Request a Cancellation, Replacement or Refund",
        lead: "Contact TiTAS, and please provide:",
        bullets: [
          "Name",
          "Order ID",
          "Registered mobile number",
          "Payment details/reference",
          "Reason for the request",
        ],
      },
      {
        heading: "10. Policy Conditions",
        paragraphs: [
          "TiTAS reserves the right to verify cancellation, replacement and refund requests before approval.",
          "This policy is subject to applicable laws, regulations and consumer rights in India.",
        ],
      },
    ],
  },
];

export const getLegalDoc = (slug: string) => legalDocs.find((d) => d.slug === slug);

/** Typed route paths for each legal page, keyed by slug — kept here so the
 *  header dropdown and the legal pages themselves share one source. */
export const legalPaths = {
  "privacy-policy": "/privacy-policy",
  terms: "/terms",
  "shipping-delivery": "/shipping-delivery",
  "cancellation-refund": "/cancellation-refund",
} as const;
