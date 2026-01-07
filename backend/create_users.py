import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

def create_user(username, email, password, role, is_staff=False, is_superuser=False):
    if not User.objects.filter(username=username).exists():
        user = User.objects.create_user(username=username, email=email, password=password)
        user.role = role
        user.is_staff = is_staff
        user.is_superuser = is_superuser
        user.save()
        print(f"Created user: {username} ({role})")
    else:
        print(f"User already exists: {username}")

create_user('admin', 'admin@example.com', 'admin123', 'admin', is_staff=True, is_superuser=True)
create_user('docente', 'docente@example.com', 'docente123', 'docente')
create_user('estudiante', 'estudiante@example.com', 'estudiante123', 'estudiante')
