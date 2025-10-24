from flask import Flask, request, jsonify
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from resume_parser import ResumeParser
from recommendation_engine import RecommendationEngine

app = Flask(__name__)

# Initialize components
try:
    nlp = spacy.load('en_core_web_sm')
    resume_parser = ResumeParser()
    recommender = RecommendationEngine()
except OSError:
    print("Warning: spaCy model not loaded. Please install with: python -m spacy download en_core_web_sm")
    nlp = None
    resume_parser = None
    recommender = None

# Sample event data for recommendations (in production, this would come from database)
sample_events = [
    {
        'id': 1,
        'title': 'AI Hackathon',
        'skills': ['python', 'machine learning', 'tensorflow', 'data science'],
        'category': 'hackathon'
    },
    {
        'id': 2,
        'title': 'Web Development Workshop',
        'skills': ['javascript', 'react', 'html', 'css'],
        'category': 'workshop'
    },
    {
        'id': 3,
        'title': 'Cybersecurity Seminar',
        'skills': ['networking', 'security', 'encryption', 'ethical hacking'],
        'category': 'seminar'
    }
]

def extract_skills(text):
    """Extract skills from resume text using spaCy"""
    doc = nlp(text.lower())

    # Common technical skills (expand this list)
    skills_keywords = [
        'python', 'java', 'javascript', 'c++', 'c#', 'php', 'ruby', 'swift', 'kotlin',
        'html', 'css', 'react', 'angular', 'vue', 'node.js', 'express', 'django', 'flask',
        'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn',
        'data science', 'pandas', 'numpy', 'matplotlib', 'seaborn',
        'database', 'sql', 'mongodb', 'mysql', 'postgresql',
        'git', 'docker', 'kubernetes', 'aws', 'azure', 'gcp',
        'cybersecurity', 'networking', 'encryption', 'blockchain'
    ]

    extracted_skills = []
    for token in doc:
        if token.text in skills_keywords and token.text not in extracted_skills:
            extracted_skills.append(token.text)

    return extracted_skills

def get_recommendations(user_skills, events):
    """Get event recommendations based on user skills"""
    if not user_skills:
        return []

    # Create TF-IDF vectors
    all_texts = [' '.join(event['skills']) for event in events]
    user_text = ' '.join(user_skills)

    vectorizer = TfidfVectorizer()
    event_vectors = vectorizer.fit_transform(all_texts)
    user_vector = vectorizer.transform([user_text])

    # Calculate similarities
    similarities = cosine_similarity(user_vector, event_vectors)[0]

    # Get top recommendations
    top_indices = np.argsort(similarities)[::-1][:5]  # Top 5 recommendations

    recommendations = []
    for idx in top_indices:
        if similarities[idx] > 0.1:  # Threshold for relevance
            recommendations.append({
                'event_id': events[idx]['id'],
                'title': events[idx]['title'],
                'similarity_score': float(similarities[idx]),
                'matching_skills': list(set(user_skills) & set(events[idx]['skills']))
            })

    return recommendations

@app.route('/extract-skills', methods=['POST'])
def extract_skills_endpoint():
    try:
        if not resume_parser:
            return jsonify({'error': 'Resume parser not initialized'}), 500

        data = request.get_json()
        resume_text = data.get('resume_text', '')

        if not resume_text:
            return jsonify({'error': 'Resume text is required'}), 400

        parsed_data = resume_parser.parse_resume(resume_text)
        return jsonify(parsed_data)

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/recommend-events', methods=['POST'])
def recommend_events():
    try:
        if not recommender:
            return jsonify({'error': 'Recommendation engine not initialized'}), 500

        data = request.get_json()
        user_skills = data.get('skills', [])
        user_id = data.get('user_id', '')

        if not user_skills:
            return jsonify({'error': 'User skills are required'}), 400

        # Use the advanced recommendation engine
        recommendations = recommender.get_content_based_recommendations(user_skills, sample_events)
        return jsonify({'recommendations': recommendations})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ML service is running'})

if __name__ == '__main__':
    app.run(debug=True, port=8000)
