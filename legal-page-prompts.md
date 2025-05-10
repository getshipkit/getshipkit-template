# Legal Page Generation Prompts

This file contains prompts you can use with AI tools to generate professional legal pages for your SaaS application. Simply copy the relevant prompt and customize the placeholders with your specific information.

## Terms and Conditions Page Prompt

```
Generate comprehensive Terms and Conditions for a SaaS application with the following details:

- Company Name: [YOUR_COMPANY_NAME]
- SaaS Product Name: [YOUR_PRODUCT_NAME] 
- Website URL: [YOUR_WEBSITE_URL]
- Primary Service: [BRIEF_DESCRIPTION_OF_SERVICE]
- User Data Collection: [TYPES_OF_DATA_COLLECTED]
- Subscription Model: [DETAILS_ABOUT_PRICING_TIERS]
- Refund Policy: [YOUR_REFUND_POLICY]
- Jurisdiction/Governing Law: [YOUR_LEGAL_JURISDICTION]
- Effective Date: [EFFECTIVE_DATE]

The Terms and Conditions should include:
1. User rights and responsibilities
2. Account registration requirements
3. Acceptable use policies
4. Intellectual property rights
5. Payment terms and billing cycles
6. Termination conditions
7. Service level agreement details
8. Limitation of liability
9. Indemnification clauses
10. Changes to terms notification process
11. Contact information

Please format this in clear, professional language suitable for a modern SaaS application, organized with proper headings and subheadings for readability.
```

## Privacy Policy Page Prompt

```
Generate a comprehensive Privacy Policy for a SaaS application with the following details:

- Company Name: [YOUR_COMPANY_NAME]
- SaaS Product Name: [YOUR_PRODUCT_NAME]
- Website URL: [YOUR_WEBSITE_URL]
- Data Collection Methods: [HOW_YOU_COLLECT_DATA]
- Personal Data Collected: [TYPES_OF_PERSONAL_DATA]
- Usage Data Collected: [TYPES_OF_USAGE_DATA]
- Third-Party Services: [LIST_THIRD_PARTY_SERVICES]
- Data Storage Location: [WHERE_DATA_IS_STORED]
- User Rights: [GDPR/CCPA_COMPLIANCE_IF_APPLICABLE]
- Cookie Policy: [YOUR_COOKIE_POLICY]
- Children's Privacy: [POLICY_FOR_USERS_UNDER_18]
- International Data Transfers: [IF_YOU_TRANSFER_DATA_INTERNATIONALLY]
- Data Retention Period: [HOW_LONG_YOU_KEEP_DATA]
- Security Measures: [HOW_YOU_PROTECT_DATA]
- Contact Email for Privacy Concerns: [PRIVACY_EMAIL]
- Effective Date: [EFFECTIVE_DATE]

The Privacy Policy should include:
1. Introduction and overview of data practices
2. Detailed explanation of data collection methods
3. How user data is processed and used
4. Third-party data sharing policies
5. User rights regarding their data
6. Data security measures
7. Policy updates notification process
8. Compliance with relevant regulations (GDPR, CCPA, etc.)
9. Cookie usage details
10. Opt-out procedures

Please format this in clear, professional language suitable for a modern SaaS application, organized with proper headings and subheadings for readability.
```

## Cookie Policy Page Prompt

```
Generate a clear Cookie Policy for a SaaS application with the following details:

- Company Name: [YOUR_COMPANY_NAME]
- Website URL: [YOUR_WEBSITE_URL]
- Types of Cookies Used: [ESSENTIAL/ANALYTICS/MARKETING]
- Purpose of Each Cookie Category: [PURPOSE_OF_COOKIES]
- Third-Party Cookies: [LIST_THIRD_PARTY_COOKIES]
- Cookie Duration: [EXPIRY_TIME]
- Consent Mechanism: [BANNER/POPUP/SETTINGS_PAGE]
- How Users Can Withdraw Consent: [METHOD]
- Contact Email for Cookie Queries: [COOKIE_EMAIL]

The policy should include:
1. Definition of cookies & similar technologies
2. Detailed table of cookies in use (name, purpose, expiry)
3. Instructions on how to manage cookies in major browsers
4. How consent is obtained & logged (GDPR/PECR compliant)
5. Link to Privacy Policy for more information
6. Date of last update

Please format the policy in clear, accessible language with proper headings.
```

## Data Processing Agreement (DPA) Prompt

```
Generate a GDPR-compliant Data Processing Agreement between a Controller (your customer) and the Processor (your Company) with the following details:

- Company Name (Processor): [YOUR_COMPANY_NAME]
- Company Address: [COMPANY_ADDRESS]
- Customer Name (Controller): [CUSTOMER_NAME]
- Subject Matter of Processing: [WHAT_DATA_AND_PURPOSE]
- Categories of Personal Data: [DATA_CATEGORIES]
- Duration of Processing: [PROCESSING_DURATION]
- Sub-processors Used: [LIST_OF_SUBPROCESSORS]
- Data Transfer Mechanisms: [SCCS/PRIVACY_SHIELD/ETC]
- Technical & Organisational Measures: [TOMS_SUMMARY]
- Audit Rights: [AUDIT_FREQUENCY]
- Contact Email for Data Protection: [DPO_EMAIL]

The DPA must include:
1. Obligations of the Processor
2. Obligations of the Controller
3. Confidentiality clauses
4. Sub-processing conditions & notice periods
5. Data subject assistance & breach notification
6. Deletion/return of data upon termination
7. Liability & indemnity provisions
8. Governing law & jurisdiction

Write in formal legal language aligned with EU GDPR Article 28.
```

## How to Use These Prompts

1. Copy the relevant prompt above **(Terms, Privacy, Cookie Policy, or DPA)**
2. Replace all bracketed placeholders [LIKE_THIS] with your specific information
3. Use an AI tool like Claude or ChatGPT to generate the content
4. Review the generated content carefully **with a qualified legal professional in your jurisdiction**
5. Implement the pages in your SaaS application in the following locations:
   - Terms page: `src/app/terms/page.tsx`
   - Privacy policy: `src/app/privacy/page.tsx`
   - Cookie policy: `src/app/cookie/page.tsx`
   - DPA: `src/app/dpa/page.tsx`

## Important Legal Disclaimer

**The content generated using these prompts should be reviewed by a qualified legal professional before implementation.** Legal requirements vary by jurisdiction and industry. These prompts are designed to create a starting point, not to provide legal advice or guarantee compliance with all applicable laws and regulations.

## Implementation Example

Here's a simple example of how to implement these pages in your Next.js application:

```tsx
// src/app/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      
      <div className="prose prose-lg">
        {/* Paste your generated and reviewed terms here */}
        <h2>1. Introduction</h2>
        <p>Welcome to [Your SaaS Name]...</p>
        
        {/* Continue with the rest of your terms */}
      </div>
    </div>
  );
}
```

```tsx
// src/app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="prose prose-lg">
        {/* Paste your generated and reviewed privacy policy here */}
        <h2>1. Data Collection</h2>
        <p>At [Your SaaS Name], we collect...</p>
        
        {/* Continue with the rest of your privacy policy */}
      </div>
    </div>
  );
}
```

```tsx
// src/app/cookie/page.tsx
export default function CookiePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
      
      <div className="prose prose-lg">
        {/* Paste your generated and reviewed cookie policy here */}
        <h2>1. Definition of Cookies</h2>
        <p>Cookies are small text files...</p>
        
        {/* Continue with the rest of your cookie policy */}
      </div>
    </div>
  );
}
```

```tsx
// src/app/dpa/page.tsx
export default function DpaPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Data Processing Agreement</h1>
      
      <div className="prose prose-lg">
        {/* Paste your generated and reviewed DPA here */}
        <h2>1. Obligations of the Processor</h2>
        <p>The Processor shall...</p>
        
        {/* Continue with the rest of your DPA */}
      </div>
    </div>
  );
}
```

Don't forget to add links to these pages in your footer component. 