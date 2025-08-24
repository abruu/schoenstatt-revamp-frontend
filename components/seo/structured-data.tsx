import Script from 'next/script'

interface OrganizationSchemaProps {
  name: string
  description: string
  url: string
  logo?: string
  address?: {
    streetAddress?: string
    addressLocality: string
    addressRegion: string
    addressCountry: string
  }[]
  contactPoint?: {
    telephone: string
    contactType: string
  }
}

export function OrganizationSchema({ 
  name, 
  description, 
  url, 
  logo, 
  address, 
  contactPoint 
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name,
    description,
    url,
    logo,
    address,
    contactPoint,
    hasCredential: "Telc Certified Center",
    educationalCredentialAwarded: "German Language B2 Certification"
  }

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface CourseSchemaProps {
  name: string
  description: string
  provider: string
  courseCode?: string
  educationalLevel: string
  timeRequired: string
  price?: string
  currency?: string
}

export function CourseSchema({
  name,
  description,
  provider,
  courseCode,
  educationalLevel,
  timeRequired,
  price,
  currency = "INR"
}: CourseSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    provider: {
      "@type": "EducationalOrganization",
      name: provider
    },
    courseCode,
    educationalLevel,
    timeRequired,
    ...(price && {
      offers: {
        "@type": "Offer",
        price,
        priceCurrency: currency
      }
    })
  }

  return (
    <Script
      id="course-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  questions: Array<{
    question: string
    answer: string
  }>
}

export function FAQSchema({ questions }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  }

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
