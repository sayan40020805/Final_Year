import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MultiLabelBinarizer
from typing import List, Dict, Any
import pandas as pd

class RecommendationEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words='english')
        self.mlb = MultiLabelBinarizer()

    def preprocess_events(self, events: List[Dict]) -> pd.DataFrame:
        """Preprocess events data for recommendation"""
        df = pd.DataFrame(events)

        # Create text features from skills and categories
        df['text_features'] = df.apply(
            lambda x: ' '.join(x['skills'] + [x.get('category', '')] + [x.get('description', '')]),
            axis=1
        )

        return df

    def get_content_based_recommendations(self, user_skills: List[str], events: List[Dict], top_n: int = 5) -> List[Dict]:
        """Get content-based recommendations using TF-IDF and cosine similarity"""
        if not events or not user_skills:
            return []

        # Preprocess events
        events_df = self.preprocess_events(events)

        # Create user profile text
        user_profile = ' '.join(user_skills)

        # Vectorize events and user profile
        event_vectors = self.vectorizer.fit_transform(events_df['text_features'])
        user_vector = self.vectorizer.transform([user_profile])

        # Calculate similarities
        similarities = cosine_similarity(user_vector, event_vectors)[0]

        # Get top recommendations
        top_indices = np.argsort(similarities)[::-1][:top_n]

        recommendations = []
        for idx in top_indices:
            if similarities[idx] > 0:  # Only include if there's some similarity
                event = events_df.iloc[idx]
                matching_skills = list(set(user_skills) & set(event['skills']))

                recommendations.append({
                    'event_id': event['id'],
                    'title': event['title'],
                    'similarity_score': float(similarities[idx]),
                    'matching_skills': matching_skills,
                    'category': event.get('category', ''),
                    'description': event.get('description', ''),
                    'date': event.get('date', ''),
                    'location': event.get('location', '')
                })

        return recommendations

    def get_collaborative_recommendations(self, user_id: str, user_event_matrix: Dict, events: List[Dict], top_n: int = 5) -> List[Dict]:
        """Get collaborative filtering recommendations (simplified version)"""
        # This is a simplified collaborative filtering
        # In production, you'd use matrix factorization or KNN

        if user_id not in user_event_matrix:
            return []

        user_events = user_event_matrix[user_id]
        user_categories = set()

        # Find categories user has participated in
        for event in events:
            if event['id'] in user_events:
                user_categories.add(event.get('category', ''))

        # Recommend events in similar categories that user hasn't attended
        recommendations = []
        for event in events:
            if event['id'] not in user_events and event.get('category', '') in user_categories:
                recommendations.append({
                    'event_id': event['id'],
                    'title': event['title'],
                    'similarity_score': 0.8,  # Fixed score for category match
                    'matching_skills': [],
                    'category': event.get('category', ''),
                    'reason': 'Based on your past event categories'
                })

        return recommendations[:top_n]

    def get_hybrid_recommendations(self, user_skills: List[str], user_id: str,
                                 events: List[Dict], user_event_matrix: Dict = None,
                                 top_n: int = 5) -> List[Dict]:
        """Combine content-based and collaborative recommendations"""
        # Get content-based recommendations
        content_recs = self.get_content_based_recommendations(user_skills, events, top_n * 2)

        # Get collaborative recommendations if user history available
        collab_recs = []
        if user_event_matrix:
            collab_recs = self.get_collaborative_recommendations(user_id, user_event_matrix, events, top_n)

        # Combine and deduplicate
        all_recs = content_recs + collab_recs
        seen_events = set()
        unique_recs = []

        for rec in all_recs:
            if rec['event_id'] not in seen_events:
                unique_recs.append(rec)
                seen_events.add(rec['event_id'])

        # Sort by similarity score and return top N
        unique_recs.sort(key=lambda x: x['similarity_score'], reverse=True)
        return unique_recs[:top_n]

    def get_popular_events(self, events: List[Dict], registrations: Dict, top_n: int = 5) -> List[Dict]:
        """Get popular events based on registration count"""
        # Calculate popularity
        event_popularity = {}
        for event_id, count in registrations.items():
            event_popularity[event_id] = count

        # Sort events by popularity
        popular_events = sorted(events, key=lambda x: event_popularity.get(x['id'], 0), reverse=True)

        return [
            {
                'event_id': event['id'],
                'title': event['title'],
                'popularity_score': event_popularity.get(event['id'], 0),
                'category': event.get('category', ''),
                'reason': 'Popular event'
            }
            for event in popular_events[:top_n]
        ]
