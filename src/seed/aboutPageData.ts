import type { AboutPage } from '@/payload-types'

type SeededAboutPage = Omit<AboutPage, 'createdAt' | 'id' | 'updatedAt'>

export const aboutPageSeedData = {
  introduction: {
    eyebrow: 'Meet your nutritionist',
    name: 'Bidisha Das',
    role: 'Nutritionist · Digestive health support',
    location: 'Kolkata, India',
    summary:
      'Hi, I’m Bidisha. I help people understand what to eat, manage digestive problems, and build eating habits that fit their daily lives. Together, we make a plan around your health, your routine, and the food you enjoy.',
    philosophy:
      'First, I listen to your concerns and learn about your meals, routine, and health history. Then we choose a few manageable changes. At follow-ups, we check what is working and adjust your plan together.',
  },
  experience: [
    {
      organisation: 'Intellimed Healthcare Solution',
      role: 'Clinical Dietitian Consultant',
      location: 'Mumbai',
      startDate: 'November 2025',
      endDate: 'Present',
      summary:
        'I help people receiving mental health care plan meals around their health needs, medicines, and daily routines.',
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
        'I helped people with digestive problems understand their food triggers and make changes to their meals.',
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
      summary: 'I supported women with meal plans for their health needs and weight goals.',
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
        'During my hospital training, I helped the care team plan nutrition for heart patients and people recovering from surgery.',
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
        'Help understanding how your meals may relate to bloating, acidity, and other digestive problems.',
      areas: [
        { name: 'Acidity and acid reflux' },
        { name: 'Bloating and irritable bowel syndrome (IBS)' },
        { name: 'Finding foods that trigger symptoms' },
      ],
    },
    {
      title: 'Eating with a health condition',
      description:
        'Meal plans that take your health condition, medical reports, and treatment into account.',
      areas: [
        { name: 'Nutrition for heart health' },
        { name: 'Eating before and after surgery' },
        { name: 'Meal planning around your medical needs' },
      ],
    },
    {
      title: 'Everyday eating habits',
      description:
        'Simple changes to your meals, with regular support to help you stick with them.',
      areas: [
        { name: 'Women’s health nutrition' },
        { name: 'PCOS/PCOD & endometriosis' },
        { name: 'Weight management' },
        { name: 'Understanding your food choices' },
        { name: 'Building habits you can keep' },
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
    ctaHeading: 'Need help with your meals?',
    ctaText:
      'Tell me about your health concerns and what you would like to change. We can work out the next step together.',
  },
} satisfies SeededAboutPage
