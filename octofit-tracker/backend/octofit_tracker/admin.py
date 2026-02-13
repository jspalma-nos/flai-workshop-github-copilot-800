from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'team_id', 'created_at')
    list_filter = ('created_at', 'team_id')
    search_fields = ('name', 'email')
    ordering = ('-created_at',)


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('name',)
    ordering = ('-created_at',)


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'activity_type', 'duration', 'calories', 'date')
    list_filter = ('activity_type', 'date')
    search_fields = ('user_id', 'activity_type')
    ordering = ('-date',)


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'team_id', 'total_calories', 'total_duration', 'total_activities', 'last_updated')
    list_filter = ('team_id', 'last_updated')
    search_fields = ('user_id', 'team_id')
    ordering = ('-total_calories',)


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ('name', 'activity_type', 'duration', 'difficulty', 'target_calories')
    list_filter = ('activity_type', 'difficulty')
    search_fields = ('name', 'activity_type')
    ordering = ('name',)
