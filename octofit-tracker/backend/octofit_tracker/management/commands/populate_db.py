from django.core.management.base import BaseCommand
from octofit_tracker.models import User, Team, Activity, Leaderboard, Workout
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting database population...'))
        
        # Delete existing data
        self.stdout.write('Deleting existing data...')
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()
        
        # Create Teams
        self.stdout.write('Creating teams...')
        team_marvel = Team.objects.create(
            name='Team Marvel',
            description='Earth\'s Mightiest Heroes fitness team'
        )
        team_dc = Team.objects.create(
            name='Team DC',
            description='Justice League fitness warriors'
        )
        
        # Create Users
        self.stdout.write('Creating users...')
        marvel_heroes = [
            {'name': 'Tony Stark', 'email': 'ironman@marvel.com', 'password': 'stark123'},
            {'name': 'Steve Rogers', 'email': 'captain@marvel.com', 'password': 'shield123'},
            {'name': 'Thor Odinson', 'email': 'thor@marvel.com', 'password': 'hammer123'},
            {'name': 'Natasha Romanoff', 'email': 'blackwidow@marvel.com', 'password': 'widow123'},
            {'name': 'Bruce Banner', 'email': 'hulk@marvel.com', 'password': 'smash123'},
            {'name': 'Peter Parker', 'email': 'spiderman@marvel.com', 'password': 'web123'},
        ]
        
        dc_heroes = [
            {'name': 'Clark Kent', 'email': 'superman@dc.com', 'password': 'krypton123'},
            {'name': 'Bruce Wayne', 'email': 'batman@dc.com', 'password': 'gotham123'},
            {'name': 'Diana Prince', 'email': 'wonderwoman@dc.com', 'password': 'themyscira123'},
            {'name': 'Barry Allen', 'email': 'flash@dc.com', 'password': 'speed123'},
            {'name': 'Arthur Curry', 'email': 'aquaman@dc.com', 'password': 'atlantis123'},
            {'name': 'Hal Jordan', 'email': 'greenlantern@dc.com', 'password': 'willpower123'},
        ]
        
        marvel_users = []
        for hero in marvel_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                password=hero['password'],
                team_id=str(team_marvel._id)
            )
            marvel_users.append(user)
        
        dc_users = []
        for hero in dc_heroes:
            user = User.objects.create(
                name=hero['name'],
                email=hero['email'],
                password=hero['password'],
                team_id=str(team_dc._id)
            )
            dc_users.append(user)
        
        all_users = marvel_users + dc_users
        
        # Create Activities
        self.stdout.write('Creating activities...')
        activity_types = ['Running', 'Cycling', 'Swimming', 'Weight Training', 'Yoga', 'HIIT']
        
        for user in all_users:
            num_activities = random.randint(5, 15)
            for i in range(num_activities):
                activity_type = random.choice(activity_types)
                duration = random.randint(20, 90)
                distance = round(random.uniform(2, 15), 2) if activity_type in ['Running', 'Cycling', 'Swimming'] else None
                calories = duration * random.randint(5, 12)
                
                Activity.objects.create(
                    user_id=str(user._id),
                    activity_type=activity_type,
                    duration=duration,
                    distance=distance,
                    calories=calories,
                    date=datetime.now() - timedelta(days=random.randint(0, 30)),
                    notes=f'{activity_type} session by {user.name}'
                )
        
        # Create Leaderboard entries
        self.stdout.write('Creating leaderboard entries...')
        for user in all_users:
            user_activities = Activity.objects.filter(user_id=str(user._id))
            total_calories = sum(activity.calories for activity in user_activities)
            total_duration = sum(activity.duration for activity in user_activities)
            total_activities = user_activities.count()
            
            Leaderboard.objects.create(
                user_id=str(user._id),
                team_id=user.team_id,
                total_calories=total_calories,
                total_duration=total_duration,
                total_activities=total_activities
            )
        
        # Create Workouts
        self.stdout.write('Creating workouts...')
        workouts = [
            {
                'name': 'Iron Man Cardio Blast',
                'description': 'High-intensity cardio workout to boost stamina and endurance',
                'activity_type': 'HIIT',
                'duration': 30,
                'difficulty': 'hard',
                'target_calories': 400
            },
            {
                'name': 'Captain America Strength Training',
                'description': 'Build strength and muscle with this comprehensive workout',
                'activity_type': 'Weight Training',
                'duration': 60,
                'difficulty': 'medium',
                'target_calories': 450
            },
            {
                'name': 'Thor Thunder Run',
                'description': 'Long-distance running to build godlike endurance',
                'activity_type': 'Running',
                'duration': 45,
                'difficulty': 'medium',
                'target_calories': 500
            },
            {
                'name': 'Black Widow Flexibility Flow',
                'description': 'Yoga and stretching for flexibility and balance',
                'activity_type': 'Yoga',
                'duration': 40,
                'difficulty': 'easy',
                'target_calories': 200
            },
            {
                'name': 'Superman Speed Cycling',
                'description': 'Fast-paced cycling workout for speed and power',
                'activity_type': 'Cycling',
                'duration': 50,
                'difficulty': 'hard',
                'target_calories': 550
            },
            {
                'name': 'Batman Night Patrol',
                'description': 'Evening run through the city streets',
                'activity_type': 'Running',
                'duration': 35,
                'difficulty': 'easy',
                'target_calories': 350
            },
            {
                'name': 'Wonder Woman Warrior Training',
                'description': 'Complete warrior workout combining strength and cardio',
                'activity_type': 'HIIT',
                'duration': 45,
                'difficulty': 'hard',
                'target_calories': 480
            },
            {
                'name': 'Flash Speed Circuit',
                'description': 'Lightning-fast circuit training for maximum results',
                'activity_type': 'HIIT',
                'duration': 25,
                'difficulty': 'hard',
                'target_calories': 380
            },
            {
                'name': 'Aquaman Swim Session',
                'description': 'Ocean-inspired swimming workout for full body fitness',
                'activity_type': 'Swimming',
                'duration': 40,
                'difficulty': 'medium',
                'target_calories': 420
            },
        ]
        
        for workout_data in workouts:
            Workout.objects.create(**workout_data)
        
        # Print summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(f'Teams created: {Team.objects.count()}')
        self.stdout.write(f'Users created: {User.objects.count()}')
        self.stdout.write(f'Activities created: {Activity.objects.count()}')
        self.stdout.write(f'Leaderboard entries: {Leaderboard.objects.count()}')
        self.stdout.write(f'Workouts created: {Workout.objects.count()}')
        self.stdout.write(self.style.SUCCESS('Database successfully populated with superhero test data!'))
