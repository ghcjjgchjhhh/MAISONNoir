export interface PolicySection {
  id: number;
  sectionNumber: number;
  title: string;
  category: 'store' | 'account' | 'orders' | 'delivery' | 'returns' | 'legal';
  paragraphs: string[];
  bullets?: string[];
  highlight?: string;
}

export const POLICY_METADATA = {
  storeName: "Maison Noir",
  lastUpdated: "September 7, 2026",
  email: "concierge@maisonnoir.com",
  phone: "+234 810 000 9000",
  address: "12 Victoria Island Atelier Blvd, Lagos, Nigeria",
  returnWindowDays: "14 days",
};

export const POLICY_SECTIONS: PolicySection[] = [
  {
    id: 1,
    sectionNumber: 1,
    title: "About Our Store",
    category: "store",
    paragraphs: [
      "Maison Noir is an online clothing store that allows customers to browse, select, and order clothing and related fashion products online.",
      "We reserve the right to update our products, prices, descriptions, availability, and policies when necessary."
    ]
  },
  {
    id: 2,
    sectionNumber: 2,
    title: "Products & Product Information",
    category: "store",
    paragraphs: [
      "We make reasonable efforts to ensure that product descriptions, photographs, colours, sizes, and other information are accurate.",
      "However:"
    ],
    bullets: [
      "Product colours may appear slightly different depending on your device or screen.",
      "Minor differences in measurements may occur.",
      "Some products may have limited availability.",
      "Product images may not always represent the exact colour appearance under different lighting conditions.",
      "We reserve the right to correct inaccurate product information or pricing."
    ]
  },
  {
    id: 3,
    sectionNumber: 3,
    title: "Account Registration & Google Sign-In",
    category: "account",
    paragraphs: [
      "To use certain features of our store, customers may be required to create or access an account.",
      "We may allow customers to sign in using Google Sign-In or other supported authentication methods.",
      "When you choose to sign in with Google:"
    ],
    bullets: [
      "You authorize the authentication service to verify your identity.",
      "We may receive information from your Google account that is necessary to create and manage your store account, such as your name, email address, and profile information made available through the sign-in process.",
      "We do not receive or store your Google password.",
      "You are responsible for maintaining the security of your Google account.",
      "You must not use another person's Google account to access our services.",
      "If you lose access to your Google account, you may also lose access to the store account connected to it."
    ],
    highlight: "Google Sign-In is provided by Google and is subject to Google's applicable terms and policies. We are not responsible for problems caused by Google's authentication services, including temporary outages, account restrictions, or changes to Google's services. By using Google Sign-In, you agree that we may use the information provided through the authentication process to create and manage your account and provide our services, in accordance with our Privacy Policy and applicable law."
  },
  {
    id: 4,
    sectionNumber: 4,
    title: "Account Security",
    category: "account",
    paragraphs: [
      "If you create an account, you are responsible for keeping your login information secure.",
      "You must not share your account credentials with unauthorized persons.",
      "If you believe that your account has been accessed without authorization, contact us immediately.",
      "We reserve the right to suspend or restrict accounts involved in fraudulent, abusive, or unauthorized activity."
    ]
  },
  {
    id: 5,
    sectionNumber: 5,
    title: "Product Sizes",
    category: "orders",
    paragraphs: [
      "Customers are responsible for selecting the correct size before placing an order.",
      "Please carefully check the size information and measurements provided on the product page.",
      "If you are unsure about your size, contact customer support before placing your order."
    ]
  },
  {
    id: 6,
    sectionNumber: 6,
    title: "Prices",
    category: "orders",
    paragraphs: [
      "All product prices displayed in our store are subject to change without prior notice.",
      "The price applicable to an order is the price displayed at the time the order is placed, except where an obvious pricing error has occurred.",
      "Delivery charges, where applicable, may be displayed separately during checkout."
    ]
  },
  {
    id: 7,
    sectionNumber: 7,
    title: "Placing an Order",
    category: "orders",
    paragraphs: [
      "When you place an order, you are making a request to purchase the selected products.",
      "After placing an order, you may receive an order confirmation.",
      "An order may be cancelled by us if:"
    ],
    bullets: [
      "The product is unavailable.",
      "There is an obvious pricing or product-information error.",
      "We are unable to verify the order.",
      "The delivery information provided is insufficient or incorrect.",
      "We reasonably suspect fraudulent or unauthorized activity."
    ],
    highlight: "If we cancel an order for which payment has already been made, an applicable refund will be processed."
  },
  {
    id: 8,
    sectionNumber: 8,
    title: "Customer Information",
    category: "delivery",
    paragraphs: [
      "Customers must provide accurate information when placing an order, including:"
    ],
    bullets: [
      "Full name",
      "Active phone number",
      "Delivery address",
      "City or area",
      "Any important delivery instructions"
    ],
    highlight: "We are not responsible for delivery problems caused by incorrect or incomplete information provided by the customer."
  },
  {
    id: 9,
    sectionNumber: 9,
    title: "Delivery Policy",
    category: "delivery",
    paragraphs: [
      "We aim to deliver orders within the estimated delivery period displayed or communicated to the customer.",
      "Delivery times may vary depending on:"
    ],
    bullets: [
      "Customer location",
      "Courier availability",
      "Weather conditions",
      "Public holidays",
      "Traffic or transportation delays",
      "Unforeseen circumstances"
    ],
    highlight: "Delivery estimates are not guaranteed unless expressly stated otherwise. Customers should ensure that someone is available to receive the order at the provided delivery address."
  },
  {
    id: 10,
    sectionNumber: 10,
    title: "Failed Delivery",
    category: "delivery",
    paragraphs: [
      "If a delivery attempt fails because the customer:"
    ],
    bullets: [
      "Provided an incorrect address,",
      "Provided an unreachable phone number,",
      "Is unavailable to receive the order, or",
      "Refuses to cooperate with the delivery process,"
    ],
    highlight: "Additional delivery arrangements or charges may apply. Repeated failed delivery attempts may result in the order being cancelled."
  },
  {
    id: 11,
    sectionNumber: 11,
    title: "Payment Policy",
    category: "orders",
    paragraphs: [
      "We may offer one or more payment methods depending on the options available in our store.",
      "Customers must provide accurate payment information where required.",
      "Orders may not be processed until payment has been successfully confirmed, except where Cash on Delivery is specifically offered."
    ]
  },
  {
    id: 12,
    sectionNumber: 12,
    title: "Cash on Delivery",
    category: "orders",
    paragraphs: [
      "Where Cash on Delivery is available, the customer agrees to pay the full order amount when the order is delivered.",
      "Customers should only place Cash on Delivery orders when they genuinely intend to receive and pay for them.",
      "Repeatedly refusing legitimate Cash on Delivery orders may result in restrictions on future Cash on Delivery purchases."
    ]
  },
  {
    id: 13,
    sectionNumber: 13,
    title: "Order Cancellation",
    category: "orders",
    paragraphs: [
      "Customers may request cancellation of an order before it has been dispatched.",
      "Once an order has been shipped or handed over to a delivery provider, cancellation may no longer be possible.",
      "To request cancellation, contact customer support as soon as possible and provide your order number."
    ]
  },
  {
    id: 14,
    sectionNumber: 14,
    title: "Returns & Exchanges",
    category: "returns",
    paragraphs: [
      "We want customers to be satisfied with their purchases.",
      "A return or exchange may be accepted where:"
    ],
    bullets: [
      "The wrong item was sent.",
      "The wrong size was sent by us.",
      "The item arrived damaged or defective.",
      "The item is substantially different from the product ordered."
    ],
    highlight: "Returned items must generally be unworn, unwashed, undamaged, in their original condition, and returned with original tags, packaging, or accessories where applicable. For hygiene reasons, certain products may not be eligible for return or exchange."
  },
  {
    id: 15,
    sectionNumber: 15,
    title: "Items That Cannot Be Returned",
    category: "returns",
    paragraphs: [
      "Unless required by applicable law, we may refuse returns for items that:"
    ],
    bullets: [
      "Have been worn.",
      "Have been washed.",
      "Have been altered.",
      "Have stains, odors, makeup, or other signs of use.",
      "Have been damaged after delivery.",
      "Are missing original tags or packaging where required.",
      "Were purchased as non-returnable items."
    ]
  },
  {
    id: 16,
    sectionNumber: 16,
    title: "Return Period",
    category: "returns",
    paragraphs: [
      `Return or exchange requests should be submitted within ${POLICY_METADATA.returnWindowDays} after delivery.`,
      "Requests submitted after this period may not be accepted unless required by applicable law or approved by us.",
      "Customers should contact customer support before sending an item back."
    ]
  },
  {
    id: 17,
    sectionNumber: 17,
    title: "Refund Policy",
    category: "returns",
    paragraphs: [
      "If an approved return qualifies for a refund, the refund will be processed using the applicable refund method available from our store.",
      "Refund processing times may depend on the payment provider or financial institution.",
      "Delivery charges may be non-refundable unless the return is caused by an error on our part or applicable law requires otherwise."
    ]
  },
  {
    id: 18,
    sectionNumber: 18,
    title: "Damaged or Incorrect Items",
    category: "returns",
    paragraphs: [
      "If you receive an item that appears damaged, defective, or different from what you ordered, contact us as soon as possible.",
      "We may request photographs, videos, your order number, or other information to investigate the issue.",
      "If the issue is confirmed to be our responsibility, we may provide an appropriate solution, such as replacement, exchange, refund, or another reasonable remedy."
    ]
  },
  {
    id: 19,
    sectionNumber: 19,
    title: "Exchanges",
    category: "returns",
    paragraphs: [
      "If an exchange is approved, availability of the replacement size, colour, or product is not guaranteed.",
      "If the requested replacement is unavailable, we may offer another appropriate solution."
    ]
  },
  {
    id: 20,
    sectionNumber: 20,
    title: "Promotions & Discounts",
    category: "orders",
    paragraphs: [
      "Promotional offers, discount codes, sales, and special offers may have additional conditions.",
      "Unless otherwise stated:"
    ],
    bullets: [
      "Promotions cannot be combined.",
      "Discount codes cannot be exchanged for cash.",
      "Promotions may have expiration dates.",
      "We reserve the right to modify or cancel a promotion where necessary."
    ]
  },
  {
    id: 21,
    sectionNumber: 21,
    title: "Customer Responsibilities",
    category: "legal",
    paragraphs: [
      "Customers agree to:"
    ],
    bullets: [
      "Provide accurate information.",
      "Use the store lawfully.",
      "Not create fraudulent orders.",
      "Not misuse discounts or promotional offers.",
      "Not attempt to interfere with the operation of the website or application.",
      "Not use another person's account without authorization.",
      "Accept and pay for legitimate Cash on Delivery orders they place."
    ]
  },
  {
    id: 22,
    sectionNumber: 22,
    title: "Intellectual Property",
    category: "legal",
    paragraphs: [
      `All store content, including logos, graphics, photographs, product descriptions, designs, text, and other materials, belongs to ${POLICY_METADATA.storeName} or its respective rights holders.`,
      "You may not copy, reproduce, modify, distribute, or commercially use our content without permission."
    ]
  },
  {
    id: 23,
    sectionNumber: 23,
    title: "Privacy & Personal Information",
    category: "legal",
    paragraphs: [
      "We may collect information necessary to provide our services and process orders, including:"
    ],
    bullets: [
      "Name",
      "Email address",
      "Phone number",
      "Delivery address",
      "Account information",
      "Order history",
      "Information received through supported authentication services such as Google Sign-In"
    ],
    highlight: "We use this information to create and manage customer accounts, process orders, deliver products, provide customer support, send order updates, improve our services, and prevent fraud and unauthorized activity. We handle personal information in accordance with our Privacy Policy and applicable laws."
  },
  {
    id: 24,
    sectionNumber: 24,
    title: "Communications & Notifications",
    category: "account",
    paragraphs: [
      "By creating an account or placing an order, you agree that we may send important service communications, including order confirmations, status updates, delivery notifications, cancellation notifications, return or refund updates, customer-support messages, and important account notifications.",
      "Where permitted, customers may also receive promotional communications and may have options to manage marketing notifications."
    ]
  },
  {
    id: 25,
    sectionNumber: 25,
    title: "Website & App Availability",
    category: "legal",
    paragraphs: [
      "We aim to keep our website and application available and functioning properly, but we do not guarantee uninterrupted access.",
      "Temporary interruptions may occur because of maintenance, technical problems, internet or network failures, security issues, third-party service interruptions, or events beyond our reasonable control."
    ]
  },
  {
    id: 26,
    sectionNumber: 26,
    title: "Fraud & Abuse",
    category: "legal",
    paragraphs: [
      "We reserve the right to investigate suspicious transactions and take appropriate action where we reasonably believe that an account or order involves fraud, abuse, unauthorized activity, or violation of these Terms.",
      "This may include cancelling orders, restricting accounts, or refusing future transactions where legally permitted."
    ]
  },
  {
    id: 27,
    sectionNumber: 27,
    title: "Limitation of Liability",
    category: "legal",
    paragraphs: [
      `To the extent permitted by applicable law, ${POLICY_METADATA.storeName} will not be responsible for losses caused by circumstances beyond our reasonable control.`,
      "Nothing in these Terms is intended to remove or limit any consumer rights or legal protections that cannot lawfully be excluded."
    ]
  },
  {
    id: 28,
    sectionNumber: 28,
    title: "Changes to These Terms",
    category: "legal",
    paragraphs: [
      "We may update these Terms & Conditions and Store Policies from time to time.",
      "The updated version will be published through our store and will take effect from the date stated in the updated policy."
    ]
  },
  {
    id: 29,
    sectionNumber: 29,
    title: "Governing Law",
    category: "legal",
    paragraphs: [
      "These Terms shall be interpreted in accordance with the laws applicable to our business and the customer's transaction, subject to any mandatory consumer-protection rights that apply."
    ]
  },
  {
    id: 30,
    sectionNumber: 30,
    title: "Contact Us",
    category: "store",
    paragraphs: [
      "If you have questions about these Terms, an order, delivery, returns, exchanges, or refunds, please contact us:"
    ],
    bullets: [
      `Store: ${POLICY_METADATA.storeName}`,
      `Email: ${POLICY_METADATA.email}`,
      `Phone/WhatsApp: ${POLICY_METADATA.phone}`,
      `Business Address: ${POLICY_METADATA.address}`
    ],
    highlight: "CUSTOMER AGREEMENT: By accessing our store, creating an account, using Google Sign-In, or placing an order, you confirm that you have read, understood, and agreed to these Terms & Conditions and Store Policies. Thank you for shopping with Maison Noir."
  }
];
