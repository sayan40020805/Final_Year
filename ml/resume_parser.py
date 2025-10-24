import spacy
from typing import List, Dict

class ResumeParser:
    def __init__(self):
        try:
            self.nlp = spacy.load('en_core_web_sm')
        except OSError:
            print("spaCy model 'en_core_web_sm' not found. Please install it with: python -m spacy download en_core_web_sm")
            self.nlp = None

    def extract_skills(self, text: str) -> List[str]:
        """Extract technical skills from resume text"""
        if not self.nlp:
            return []

        doc = self.nlp(text.lower())

        # Comprehensive list of technical skills
        skills_database = {
            'programming_languages': [
                'python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin',
                'go', 'rust', 'typescript', 'scala', 'perl', 'r', 'matlab', 'bash', 'shell'
            ],
            'web_technologies': [
                'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
                'spring', 'laravel', 'asp.net', 'jquery', 'bootstrap', 'sass', 'less'
            ],
            'data_science_ml': [
                'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
                'keras', 'pandas', 'numpy', 'matplotlib', 'seaborn', 'jupyter', 'data science',
                'data analysis', 'statistics', 'neural networks', 'computer vision', 'nlp'
            ],
            'databases': [
                'sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'oracle', 'sqlite',
                'cassandra', 'elasticsearch', 'firebase'
            ],
            'cloud_devops': [
                'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'jenkins', 'git', 'github',
                'gitlab', 'bitbucket', 'terraform', 'ansible', 'ci/cd', 'linux', 'ubuntu'
            ],
            'cybersecurity': [
                'cybersecurity', 'networking', 'encryption', 'firewall', 'penetration testing',
                'ethical hacking', 'security', 'cryptography', 'blockchain'
            ],
            'mobile_dev': [
                'android', 'ios', 'react native', 'flutter', 'xamarin', 'swift', 'kotlin'
            ],
            'other_tech': [
                'api', 'rest', 'graphql', 'microservices', 'agile', 'scrum', 'kanban',
                'testing', 'unit testing', 'selenium', 'jira', 'confluence'
            ]
        }

        extracted_skills = set()

        # Extract skills based on keyword matching
        for category, skills in skills_database.items():
            for skill in skills:
                if skill in text.lower():
                    extracted_skills.add(skill)

        # Use NER for additional skill extraction (organizations, products as potential skills)
        for ent in doc.ents:
            if ent.label_ in ['ORG', 'PRODUCT'] and len(ent.text) > 2:
                # Check if it looks like a tech skill
                if any(keyword in ent.text.lower() for keyword in ['tech', 'software', 'system', 'platform']):
                    extracted_skills.add(ent.text.lower())

        return list(extracted_skills)

    def extract_experience(self, text: str) -> Dict:
        """Extract experience information"""
        # Simple regex-based extraction (can be enhanced with better NLP)
        import re

        experience_years = re.findall(r'(\d+)\s*(?:year|yr)s?\s*(?:of\s*)?experience', text.lower())
        if experience_years:
            return {'years': int(max(experience_years))}
        return {'years': 0}

    def extract_education(self, text: str) -> List[str]:
        """Extract education information"""
        education_keywords = ['bachelor', 'master', 'phd', 'degree', 'university', 'college', 'b.tech', 'm.tech', 'bsc', 'msc']
        education = []

        for keyword in education_keywords:
            if keyword in text.lower():
                education.append(keyword.title())

        return list(set(education))

    def parse_resume(self, resume_text: str) -> Dict:
        """Parse complete resume and return structured data"""
        return {
            'skills': self.extract_skills(resume_text),
            'experience': self.extract_experience(resume_text),
            'education': self.extract_education(resume_text)
        }
