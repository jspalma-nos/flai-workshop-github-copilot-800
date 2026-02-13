from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, Team, Activity, Leaderboard, Workout
from .serializers import (
    UserSerializer,
    TeamSerializer,
    ActivitySerializer,
    LeaderboardSerializer,
    WorkoutSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    
    @action(detail=True, methods=['get'])
    def activities(self, request, pk=None):
        """Get all activities for a specific user"""
        user = self.get_object()
        activities = Activity.objects.filter(user_id=str(user._id))
        serializer = ActivitySerializer(activities, many=True)
        return Response(serializer.data)


class TeamViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing teams.
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get all members of a specific team"""
        team = self.get_object()
        members = User.objects.filter(team_id=str(team._id))
        serializer = UserSerializer(members, many=True)
        return Response(serializer.data)


class ActivityViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing activities.
    """
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    
    def get_queryset(self):
        """
        Optionally restricts the returned activities to a given user,
        by filtering against a `user_id` query parameter in the URL.
        """
        queryset = Activity.objects.all()
        user_id = self.request.query_params.get('user_id', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset


class LeaderboardViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing leaderboard entries.
    """
    queryset = Leaderboard.objects.all().order_by('-total_calories')
    serializer_class = LeaderboardSerializer
    
    @action(detail=False, methods=['get'])
    def top_users(self, request):
        """Get top 10 users by calories"""
        top_entries = Leaderboard.objects.all().order_by('-total_calories')[:10]
        serializer = self.get_serializer(top_entries, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_team(self, request):
        """Get leaderboard grouped by team"""
        team_id = request.query_params.get('team_id', None)
        if team_id:
            entries = Leaderboard.objects.filter(team_id=team_id).order_by('-total_calories')
        else:
            entries = Leaderboard.objects.all().order_by('-total_calories')
        serializer = self.get_serializer(entries, many=True)
        return Response(serializer.data)


class WorkoutViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing workout suggestions.
    """
    queryset = Workout.objects.all()
    serializer_class = WorkoutSerializer
    
    def get_queryset(self):
        """
        Optionally restricts the returned workouts by difficulty or activity type,
        by filtering against query parameters in the URL.
        """
        queryset = Workout.objects.all()
        difficulty = self.request.query_params.get('difficulty', None)
        activity_type = self.request.query_params.get('activity_type', None)
        
        if difficulty is not None:
            queryset = queryset.filter(difficulty=difficulty)
        if activity_type is not None:
            queryset = queryset.filter(activity_type=activity_type)
        
        return queryset
