import type { AboutPage } from '@/payload-types'

type SeededAboutPage = Omit<AboutPage, 'createdAt' | 'id' | 'updatedAt'>

export const aboutPageSeedData = {
  introduction: {
    eyebrow: 'Clinical nutrition, made personal',
    name: 'Bidisha Das',
    role: 'Clinical Nutritionist · Gut Health Expert',
    location: 'Kolkata, India',
    summary:
      'I am a clinical nutritionist and gut health expert with more than four years of experience across clinical, healthcare, and corporate nutrition settings. My work brings together medical nutrition therapy, careful clinical assessment, and practical, personalised nutrition planning.',
    philosophy:
      'I look beyond one-size-fits-all advice to understand symptoms, dietary patterns, clinical reports, and everyday routines—then turn that picture into clear, sustainable steps that support long-term wellbeing.',
  },
  experience: [
    {
      organisation: 'Intellimed Healthcare Solution',
      role: 'Clinical Dietitian Consultant',
      location: 'Mumbai',
      startDate: 'November 2025',
      endDate: 'Present',
      summary:
        'Individualised clinical nutrition care for psychiatric patients, shaped around nutritional status, dietary patterns, medication considerations, and broader health needs.',
      highlights: [
        { detail: 'Develop personalised nutrition plans and provide dietary counselling.' },
        { detail: 'Support sustainable dietary adherence and nutrition-related behaviour change.' },
        { detail: 'Apply medical nutrition therapy, clinical assessment, and patient education.' },
      ],
    },
    {
      organisation: 'Hugg Beverages',
      role: 'Dietitian – Gut Health Expert',
      location: 'Mumbai',
      startDate: 'October 2024',
      endDate: 'August 2025',
      summary:
        'Specialist nutrition guidance for gastrointestinal wellness, digestive symptoms, dietary triggers, and condition-specific interventions.',
      highlights: [
        { detail: 'Worked with gastritis, GERD, IBS, ulcers, dysbiosis, and other GI concerns.' },
        { detail: 'Designed personalised protocols using functional foods and prebiotics.' },
        {
          detail:
            'Interpreted laboratory reports and translated findings into practical recommendations.',
        },
        { detail: 'Monitored symptoms, adherence, and outcomes through structured follow-ups.' },
      ],
    },
    {
      organisation: 'Fitelo',
      role: 'Dietitian',
      location: 'Remote',
      startDate: 'August 2023',
      endDate: 'January 2024',
      summary:
        'Personalised nutrition and lifestyle counselling for women’s health and weight-management needs.',
      highlights: [
        { detail: 'Supported clients with PCOS/PCOD, endometriosis, and lifestyle concerns.' },
        { detail: 'Created individual plans around health needs, goals, and dietary patterns.' },
        { detail: 'Focused on practical modifications and sustainable lifestyle interventions.' },
      ],
    },
    {
      organisation: 'B.M. Birla Heart Research Centre',
      role: 'Dietetic Intern',
      location: 'Kolkata',
      startDate: 'July 2022',
      endDate: 'January 2023',
      summary:
        'Hospital-based clinical nutrition experience supporting cardiac and critically ill patients across the nutrition care process.',
      highlights: [
        { detail: 'Supported medical nutrition therapy and nutrition care in ICU/CCU settings.' },
        { detail: 'Calculated requirements for pre- and post-operative patients.' },
        {
          detail:
            'Contributed to assessment, dietary recommendations, and healthcare communication.',
        },
      ],
    },
  ],
  specialties: [
    {
      title: 'Gut & digestive health',
      description:
        'Finding useful links between food, symptoms, clinical context, and the gut microbiome.',
      areas: [
        { name: 'Gastritis & GERD' },
        { name: 'IBS & digestive symptoms' },
        { name: 'Ulcer-related nutrition' },
        { name: 'Dysbiosis & microbiome nutrition' },
        { name: 'Dietary trigger identification' },
        { name: 'Functional foods & prebiotics' },
      ],
    },
    {
      title: 'Clinical nutrition',
      description:
        'Evidence-led assessment and nutrition planning for complex, condition-specific needs.',
      areas: [
        { name: 'Medical nutrition therapy' },
        { name: 'Clinical nutrition assessment' },
        { name: 'Laboratory report interpretation' },
        { name: 'Cardiac nutrition' },
        { name: 'ICU/CCU nutrition support' },
        { name: 'Pre- & post-operative nutrition' },
      ],
    },
    {
      title: 'Personalised wellbeing',
      description:
        'Realistic counselling and follow-up designed for the person, not just the diagnosis.',
      areas: [
        { name: 'Women’s health nutrition' },
        { name: 'PCOS/PCOD & endometriosis' },
        { name: 'Weight management' },
        { name: 'Patient education' },
        { name: 'Dietary adherence' },
        { name: 'Sustainable behaviour change' },
      ],
    },
  ],
  education: [
    {
      institution: 'Calcutta University',
      degree: 'M.Sc. Food and Nutrition',
      year: '2021',
      result: 'First Class',
    },
    {
      institution: 'Burdwan University',
      degree: 'B.Sc. Applied Nutrition',
      year: '2019',
      result: 'First Class',
    },
  ],
  certifications: [
    {
      title: 'Medical Nutrition Therapy (MNT)',
      issuer: 'Cognize Nutrition',
      year: '2025',
    },
    {
      title: 'Life Member',
      issuer: 'IAPEN',
      year: '',
    },
  ],
  languages: [
    { name: 'Bengali', proficiency: 'Native' },
    { name: 'English', proficiency: 'C2' },
    { name: 'Hindi', proficiency: 'C1' },
  ],
  contact: {
    email: 'dasbidisha228@gmail.com',
    phone: '+91 7001880119',
    ctaLabel: 'Work with Bidisha',
    ctaHeading: 'Let’s make nutrition feel clear and achievable.',
    ctaText:
      'Whether you are navigating digestive symptoms or looking for thoughtful clinical nutrition support, we can begin with a conversation about what you need.',
  },
} satisfies SeededAboutPage
